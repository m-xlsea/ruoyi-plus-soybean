#!/usr/bin/env node
'use strict';
// VibeCoding Athena Stop hook (delivery-gate) v9.6
// 协议:
//   - block: stdout JSON { decision: "block", reason: "..." }
//   - pass:  exit 0 无输出
// 参考: https://code.claude.com/docs/en/hooks#stop
//
// v9.6 设计:
//   1. 只读 _index.md 不读单独文件 (铁律 8)
//   2. 适配 CC v2.1.x 的 Stop hook block-cap=8 (CLAUDE_CODE_STOP_HOOK_BLOCK_CAP)
//      hook 自身计数 block 次数, 接近 8 时 warn 而非 block
//   3. 当平台支持 /goal (CC v2.1.139+) 时, 让位给 /goal evaluator, 仅作 fallback
//   4. CONCERNS 时仅 systemMessage 不阻断
//
// stop_hook_active 防递归: CC 已经在嵌套 Stop hook 时设置该字段为 true

const fs = require('fs');
const path = require('path');

const PROJECT_DIR = process.env.CLAUDE_PROJECT_DIR || process.cwd();
const STATE_DIR = path.join(PROJECT_DIR, '.ai_state');
const INDEX_PATH = path.join(STATE_DIR, '_index.md');
const HOME = process.env.HOME || require('os').homedir();
const COUNTER_PATH = path.join(HOME, '.claude', 'state', 'athena-block-counter.json');

const BLOCK_CAP_SAFE = 6;  // 留 2 次冗余给 CC 的硬 cap 8

function trace(event) {
  try {
    const line = JSON.stringify({ ts: new Date().toISOString(), hook: 'delivery-gate', ...event }) + '\n';
    fs.appendFileSync(path.join(STATE_DIR, 'hook-trace.jsonl'), line);
  } catch (e) {}
}

let input = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', d => input += d);
process.stdin.on('end', () => {
  let event = {};
  try { event = JSON.parse(input); } catch (e) {}

  // 防递归 (官方字段)
  if (event.stop_hook_active) { process.exit(0); return; }

  // 跳过 subagent
  if (event.agent_type && event.agent_type !== 'main') { process.exit(0); return; }

  if (!fs.existsSync(INDEX_PATH)) { process.exit(0); return; }

  let fm = '';
  try {
    const content = fs.readFileSync(INDEX_PATH, 'utf8');
    const m = content.match(/^---\n([\s\S]*?)\n---/);
    if (!m) { process.exit(0); return; }
    fm = m[1];
  } catch (e) { process.exit(0); return; }

  const getStr = k => {
    const m = fm.match(new RegExp('^  ' + k + ': (.*)$', 'm'));
    return m ? m[1].replace(/^["']|["']$/g, '').trim() : '';
  };
  const getNum = k => {
    const m = fm.match(new RegExp('^  ' + k + ': (\\d+)$', 'm'));
    return m ? parseInt(m[1], 10) : 0;
  };
  const getBool = k => {
    const m = fm.match(new RegExp('^  ' + k + ': (true|false)$', 'm'));
    return m ? m[1] === 'true' : false;
  };

  const pathName = getStr('path');
  const stage = getStr('stage');
  const sprint = getNum('sprint');
  const tasks_pending = getNum('tasks_pending');
  const goal_supported = getBool('goal_supported');
  const active_goal = getStr('active_goal');

  // 仅在 review 阶段 + 非 Hotfix 时介入
  if (!sprint || !stage || pathName === 'Hotfix' || pathName === 'Bugfix' || stage !== 'review') {
    process.exit(0); return;
  }

  // 平台支持 /goal 且用户已设置 active_goal → 让位给 /goal evaluator
  if (goal_supported && active_goal) {
    process.stderr.write('[delivery-gate] defer to /goal evaluator (active goal detected)\n');
    trace({ action: 'defer', reason: 'goal-active', sprint });
    process.exit(0); return;
  }

  const needsExtReview = ['Feature', 'Refactor', 'System'].includes(pathName);
  const issues = [];

  // 1. tasks 全完成
  if (tasks_pending > 0) {
    issues.push(`${tasks_pending} Task 未完成`);
  }

  // 2. review report 存在
  const reviewFile = path.join(STATE_DIR, 'details', 'reviews', `sprint-${sprint}.md`);
  let rc = '';
  try {
    rc = fs.readFileSync(reviewFile, 'utf8');
  } catch (e) {
    issues.push('审查报告不存在');
  }

  // 3. Feature+ 外部审查
  if (needsExtReview && rc &&
      !/\/codex:review|\/codex:adversarial|reviewer|ecc-agentshield|codex unavailable/i.test(rc)) {
    issues.push('无外部审查记录');
  }

  // 4. 测试通过记录
  if (rc && !/test|测试|pass|通过|✅/i.test(rc)) {
    issues.push('无测试通过记录');
  }

  // 5. VERDICT
  let verdict = '';
  if (rc) {
    const m = rc.match(/VERDICT:\s*(PASS|CONCERNS|REWORK|FAIL)/i);
    if (m) {
      verdict = m[1].toUpperCase();
      if (verdict === 'REWORK') issues.push('VERDICT=REWORK');
      else if (verdict === 'FAIL') issues.push('VERDICT=FAIL');
      else if (verdict === 'CONCERNS') {
        process.stderr.write('[delivery-gate] CONCERNS: 建议修复后重新评分\n');
      }
    }
  }

  if (issues.length > 0) {
    // 检查 block 次数, 接近 cap 时降级 systemMessage
    fs.mkdirSync(path.dirname(COUNTER_PATH), { recursive: true });
    let counter = {};
    try { counter = JSON.parse(fs.readFileSync(COUNTER_PATH, 'utf8')); } catch (e) {}
    const sessionId = event.session_id || 'unknown';
    counter[sessionId] = (counter[sessionId] || 0) + 1;
    try { fs.writeFileSync(COUNTER_PATH, JSON.stringify(counter)); } catch (e) {}
    const count = counter[sessionId];

    process.stderr.write(`[delivery-gate] block #${count}/${BLOCK_CAP_SAFE} ${pathName}/${stage}: ${issues.join(', ')}\n`);
    trace({ action: 'block', count, pathName, stage, sprint, issues });

    if (count >= BLOCK_CAP_SAFE) {
      // 接近 cap, 改为 systemMessage 避免触发 CC 的 force-kill
      process.stdout.write(JSON.stringify({
        systemMessage: `[Athena] 已连续 block ${count} 次, 建议手动处理: ${issues.join('; ')} (剩余尝试: ${8 - count})`
      }));
    } else {
      process.stdout.write(JSON.stringify({
        decision: 'block',
        reason: `[Athena delivery-gate] 阻断:\n${issues.map(i => '• ' + i).join('\n')}\n\n修复后再交付 (block ${count}/${BLOCK_CAP_SAFE}).`
      }));
    }
    process.exit(0); return;
  }

  // 通过, 重置计数
  try {
    let counter = JSON.parse(fs.readFileSync(COUNTER_PATH, 'utf8'));
    delete counter[event.session_id];
    fs.writeFileSync(COUNTER_PATH, JSON.stringify(counter));
  } catch (e) {}

  if (verdict === 'PASS') {
    // 检查是否做了 compound
    const lessonsText = (() => {
      try { return fs.readFileSync(path.join(STATE_DIR, 'details', 'lessons.md'), 'utf8'); }
      catch (e) { return ''; }
    })();
    const compounded = lessonsText.includes(`Sprint ${sprint}`);
    if (!compounded) {
      const msg = `Sprint ${sprint} 通过但 details/lessons.md 无条目, 建议 /compound 沉淀经验`;
      process.stderr.write(`[delivery-gate] PASS ${pathName}/${stage} · ${msg}\n`);
      trace({ action: 'soft-warn', pathName, stage, sprint, reason: 'no compound' });
      process.stdout.write(JSON.stringify({ systemMessage: `[Athena] ${msg}` }));
    } else {
      process.stderr.write(`[delivery-gate] PASS ${pathName}/${stage} · lessons ✓\n`);
      trace({ action: 'pass', pathName, stage, sprint });
    }
  } else {
    process.stderr.write(`[delivery-gate] 放行 ${pathName}/${stage}\n`);
    trace({ action: 'pass', pathName, stage, sprint, verdict });
  }
  process.exit(0);
});
