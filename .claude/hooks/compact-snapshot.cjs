#!/usr/bin/env node
'use strict';
// VibeCoding Athena PreCompact hook v9.6
// 协议: 不阻断, 写文件做副作用
// 参考: https://code.claude.com/docs/en/hooks#precompact
//
// v9.6 减薄设计 (L2.C):
//   旧版 v9.5 快照整个 .ai_state/{tasks,design,progress,lessons,handoff}.md 多个文件
//   v9.6 仅快照 _index.md frontmatter (≤30 行), context 利用率提升数倍
//   detail/* 内容在 PostCompact 时按需 lazy load (按 pointers 跳转)

const fs = require('fs');
const path = require('path');

const PROJECT_DIR = process.env.CLAUDE_PROJECT_DIR || process.cwd();
const STATE_DIR = path.join(PROJECT_DIR, '.ai_state');
const INDEX_PATH = path.join(STATE_DIR, '_index.md');
const SNAPSHOT_PATH = path.join(STATE_DIR, 'compact-snapshot.md');

let input = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', d => input += d);
process.stdin.on('end', () => {
  let event = {};
  try { event = JSON.parse(input); } catch (e) {}
  const trigger = event.trigger || 'unknown';  // "manual" | "auto"

  if (!fs.existsSync(INDEX_PATH)) {
    process.stderr.write('[compact-snapshot] _index.md not found, skip\n');
    process.exit(0); return;
  }

  try {
    const content = fs.readFileSync(INDEX_PATH, 'utf8');
    const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
    if (!fmMatch) {
      process.stderr.write('[compact-snapshot] _index.md frontmatter missing, skip\n');
      process.exit(0); return;
    }

    const ts = new Date().toISOString();
    const snapshot = `# Athena Compact Snapshot (${trigger})
# Saved at: ${ts}
# 仅快照 _index.md frontmatter (≤30 行). 详细内容按 pointers 在 PostCompact 后 lazy load.

---
${fmMatch[1]}
---
`;
    fs.writeFileSync(SNAPSHOT_PATH, snapshot);
    process.stderr.write(`[compact-snapshot] saved (${trigger}, ${snapshot.length} chars)\n`);

    const trace = JSON.stringify({
      ts, hook: 'compact-snapshot', trigger,
      chars: snapshot.length
    }) + '\n';
    fs.appendFileSync(path.join(STATE_DIR, 'hook-trace.jsonl'), trace);
  } catch (e) {
    process.stderr.write(`[compact-snapshot] failed: ${e.message}\n`);
  }

  process.exit(0);
});
