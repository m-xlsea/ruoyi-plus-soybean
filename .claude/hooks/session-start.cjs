#!/usr/bin/env node
'use strict';
// VibeCoding Athena SessionStart hook v9.6
// 协议: hookSpecificOutput.{hookEventName: "SessionStart", additionalContext}
// 参考: https://code.claude.com/docs/en/hooks#sessionstart
//
// 设计 (铁律 8 索引先行):
//   1. 唯一 IO: read .ai_state/_index.md (frontmatter)
//   2. 注入 context-essentials.md (静态文本)
//   3. 注入 _index.md 关键字段摘要 (path/stage/sprint/counts/active_goal)
//   4. effort=max 时跳过 PACE 状态注入 (高 effort 模型自己探索)
//   5. 不预加载 tasks/design/progress 内容

const fs = require('fs');
const path = require('path');

const PROJECT_DIR = process.env.CLAUDE_PROJECT_DIR || process.cwd();
const STATE_DIR = path.join(PROJECT_DIR, '.ai_state');
const INDEX_PATH = path.join(STATE_DIR, '_index.md');

const PROJECT_ESSENTIALS = path.join(PROJECT_DIR, '.claude', 'skills', 'pace', 'context-essentials.md');
const HOME = process.env.HOME || require('os').homedir();
const GLOBAL_ESSENTIALS = path.join(HOME, '.claude', 'skills', 'pace', 'context-essentials.md');

let input = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', d => input += d);
process.stdin.on('end', () => {
  let event = {};
  try { event = JSON.parse(input); } catch (e) {}
  const source = event.source || 'unknown';

  // CC v2.1.133+ 注入 effort.level
  const effort = (event.effort && event.effort.level) || process.env.CLAUDE_EFFORT || '';
  const isMax = effort === 'max';

  const lines = [];

  // 1. 注入 context-essentials.md (优先项目级, 回落全局)
  let essentialsText = '';
  for (const p of [PROJECT_ESSENTIALS, GLOBAL_ESSENTIALS]) {
    try {
      const t = fs.readFileSync(p, 'utf8').trim();
      if (t) { essentialsText = t; break; }
    } catch (e) {}
  }
  if (essentialsText) {
    lines.push(essentialsText);
  } else {
    lines.push('[VibeCoding Athena v9.6] TDD · Review · Sisyphus · 索引先行 · 完成度证据 · 出处优先\n[Get-bearings] read .ai_state/_index.md 然后按 pointers 跳转明细');
  }

  // 2. effort=max 时不注入 PACE 状态摘要 (高 effort 自己探索)
  if (!isMax && fs.existsSync(INDEX_PATH)) {
    try {
      const content = fs.readFileSync(INDEX_PATH, 'utf8');
      const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
      if (fmMatch) {
        const fm = fmMatch[1];
        const getStr = k => {
          const m = fm.match(new RegExp('^  ' + k + ': (.*)$', 'm'));
          return m ? m[1].replace(/^["']|["']$/g, '').trim() : '';
        };
        const getNum = k => {
          const m = fm.match(new RegExp('^  ' + k + ': (\\d+)$', 'm'));
          return m ? parseInt(m[1], 10) : 0;
        };
        const path_ = getStr('path');
        const stage = getStr('stage');
        const sprint = getNum('sprint');
        const goal = getStr('active_goal');
        const pending = getNum('tasks_pending');
        const done = getNum('tasks_done');
        const blocked = getNum('tasks_blocked');

        if (path_ && stage) {
          lines.push(`\n[PACE] Path:${path_} Stage:${stage} Sprint:${sprint}`);
        }
        if (goal) {
          lines.push(`[/goal active] ${goal.slice(0, 120)}${goal.length > 120 ? '...' : ''}`);
        }
        if (pending + done + blocked > 0) {
          lines.push(`[任务] ${done} 完成 ${pending} 待办 ${blocked} 阻塞 (详见 details/tasks-current.md)`);
        }

        // gotchas (按 YAML array 简单解析: 单行 [..] 或多行 - 形式)
        const gotchasMatch = fm.match(/^gotchas:\s*(.+)$/m);
        if (gotchasMatch) {
          const g = gotchasMatch[1].trim();
          if (g.startsWith('[') && !g.match(/^\[\s*\]$/)) {
            lines.push(`[Gotchas] ${g.slice(1, -1).trim()}`);
          }
        }
      }
    } catch (e) {
      process.stderr.write(`[session-start] _index.md parse failed: ${e.message}\n`);
    }
  }

  if (lines.length === 0) { process.exit(0); return; }

  const additionalContext = lines.join('\n');
  process.stderr.write(`[session-start/${source}${isMax ? '/max' : ''}] injected ${additionalContext.length} chars\n`);

  // hook-trace
  try {
    const trace = JSON.stringify({
      ts: new Date().toISOString(),
      hook: 'session-start',
      source, effort, chars: additionalContext.length
    }) + '\n';
    fs.appendFileSync(path.join(STATE_DIR, 'hook-trace.jsonl'), trace);
  } catch (e) {}

  process.stdout.write(JSON.stringify({
    hookSpecificOutput: {
      hookEventName: 'SessionStart',
      additionalContext
    }
  }));
  process.exit(0);
});
