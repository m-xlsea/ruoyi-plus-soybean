#!/usr/bin/env node
'use strict';
// VibeCoding Athena Stop hook (pace-continuator) v9.6 ★新增
// 协议: 不阻断 (放在 delivery-gate 之后串联运行)
//   - 写入 details/next.md (PACE-aware 下一动作建议)
//   - 在检测到"反复试错/失败模式"时, append details/proposals.md (铁律 9)
// 参考: https://code.claude.com/docs/en/hooks#stop
//
// 不发明 "自动 PACE", 只是写"下一步可以做的"备忘, 等用户自己读或下次 SessionStart 注入

const fs = require('fs');
const path = require('path');

const PROJECT_DIR = process.env.CLAUDE_PROJECT_DIR || process.cwd();
const STATE_DIR = path.join(PROJECT_DIR, '.ai_state');
const INDEX_PATH = path.join(STATE_DIR, '_index.md');
const NEXT_PATH = path.join(STATE_DIR, 'details', 'next.md');
const PROPOSALS_PATH = path.join(STATE_DIR, 'details', 'proposals.md');
const HOOK_TRACE = path.join(STATE_DIR, 'hook-trace.jsonl');

let input = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', d => input += d);
process.stdin.on('end', () => {
  let event = {};
  try { event = JSON.parse(input); } catch (e) {}
  if (event.stop_hook_active) { process.exit(0); return; }
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

  const pathName = getStr('path');
  const stage = getStr('stage');
  const sprint = getNum('sprint');
  const tasks_pending = getNum('tasks_pending');
  const tasks_done = getNum('tasks_done');

  if (!pathName || !stage || pathName === 'Hotfix' || pathName === 'Bugfix') {
    process.exit(0); return;
  }

  // 推断下一动作
  const suggestions = nextActionSuggestions(pathName, stage, tasks_pending, tasks_done);

  if (suggestions.length === 0) { process.exit(0); return; }

  // 写 next.md (覆盖, 仅保留最新一条 + 历史移到顶部)
  const ts = new Date().toISOString().replace('T', ' ').slice(0, 16);
  const entry = `## ${ts}\n当前: ${pathName}/${stage}/sprint ${sprint}\n建议:\n${suggestions.map(s => '- ' + s).join('\n')}\n`;

  let existing = '';
  try { existing = fs.readFileSync(NEXT_PATH, 'utf8'); } catch (e) {}
  // 去掉模板注释, 在顶部 append
  existing = existing.replace(/<!--[\s\S]*?-->\s*/g, '').trim();
  const newContent = `# 下一动作建议\n\n${entry}\n${existing ? '\n---\n\n' + existing : ''}`.trim() + '\n';
  fs.writeFileSync(NEXT_PATH, newContent);

  // 检测反复试错: 读 hook-trace 最近 20 条, 看 subagent-retry / delivery-gate block 是否高频
  try {
    const trace = fs.readFileSync(HOOK_TRACE, 'utf8').split('\n').filter(l => l).slice(-20);
    const retryCount = trace.filter(l => l.includes('"subagent-retry"')).length;
    const blockCount = trace.filter(l => l.includes('"delivery-gate"') && l.includes('"block"')).length;
    if (retryCount >= 3 || blockCount >= 2) {
      // append proposals.md (铁律 9 Hook 反思)
      const proposalEntry = `\n## ${ts} (sprint ${sprint})\n- 观察: 最近 20 hook 事件含 subagent-retry × ${retryCount}, delivery-gate block × ${blockCount}\n- 假设: ${pathName}/${stage} 阶段流程可能不顺畅, 可能是 design 不足 / task 过大 / 验收标准模糊\n- 提议: 复盘当前 sprint 设计粒度, 考虑拆 task 或回 plan 阶段\n`;
      fs.appendFileSync(PROPOSALS_PATH, proposalEntry);
      process.stderr.write(`[pace-continuator] proposals.md +1 (retry=${retryCount}, block=${blockCount})\n`);
    }
  } catch (e) {}

  process.stderr.write(`[pace-continuator] next.md updated (${pathName}/${stage})\n`);

  // hook-trace
  try {
    const trace = JSON.stringify({
      ts: new Date().toISOString(),
      hook: 'pace-continuator',
      path: pathName, stage, sprint,
      suggestions_count: suggestions.length
    }) + '\n';
    fs.appendFileSync(HOOK_TRACE, trace);
  } catch (e) {}

  process.exit(0);
});

function nextActionSuggestions(path, stage, pending, done) {
  const s = [];
  if (stage === 'plan') {
    s.push('完成 design.md 的 File Structure Plan 段');
    s.push('和用户确认设计后 → 进入 stage=impl');
    s.push('可选: /goal "design.md 含 File Structure Plan + tasks ≥ 1 + 用户确认"');
  } else if (stage === 'design') {
    s.push('锁定架构, 完成 details/tasks-current.md (每 Task 含 Boundary/Depends)');
    s.push('用户确认 → 进入 stage=impl');
  } else if (stage === 'impl') {
    if (pending > 0) {
      s.push(`完成剩余 ${pending} 个 Task (按 Boundary 拆分)`);
      if (path === 'Refactor' || path === 'System') {
        s.push('可选: /batch "<重构描述>" 并行加速 (CC v2.1.121+ 原生)');
      }
      s.push('每完成 Task → tasks-current.md 勾选 + progress.md 追加');
    } else if (done > 0) {
      s.push('所有 task 完成, 跑测试和 lint → 切 stage=review');
      s.push('/simplify 清理冗余');
    }
  } else if (stage === 'review') {
    s.push('运行 /review → 写 reviews/sprint-N.md');
    if (path !== 'Quick') {
      s.push('运行 /codex:review (跨模型审查)');
    }
    s.push('@evaluator 评分 → VERDICT');
    s.push('PASS → /compound 沉淀 lessons → stage=ship');
  } else if (stage === 'ship') {
    s.push('superpowers /ship (Feature+) 或 git commit (Quick)');
    s.push('归档 details/tasks-archive/sprint-N.md');
    s.push('_index.md sprint += 1, stage="" ');
  }
  return s;
}
