#!/usr/bin/env node
'use strict';
// VibeCoding Athena PostCompact hook v9.6
// 协议: hookSpecificOutput.{hookEventName: "PostCompact", additionalContext}
// 参考: https://code.claude.com/docs/en/hooks#postcompact
//
// 设计:
//   读 compact-snapshot.md, 注入 _index.md frontmatter 摘要
//   提示 model: 详细内容按 _index.md.pointers lazy load, 不要 glob 全目录 (铁律 8)

const fs = require('fs');
const path = require('path');

const PROJECT_DIR = process.env.CLAUDE_PROJECT_DIR || process.cwd();
const STATE_DIR = path.join(PROJECT_DIR, '.ai_state');
const SNAPSHOT_PATH = path.join(STATE_DIR, 'compact-snapshot.md');

let input = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', d => input += d);
process.stdin.on('end', () => {
  if (!fs.existsSync(SNAPSHOT_PATH)) {
    process.exit(0); return;
  }

  try {
    const snapshot = fs.readFileSync(SNAPSHOT_PATH, 'utf8');
    const fmMatch = snapshot.match(/---\n([\s\S]*?)\n---/);
    if (!fmMatch) { process.exit(0); return; }

    const additionalContext = `[Athena PostCompact 恢复]

上次 compact 前的项目状态 (_index.md frontmatter 快照):

\`\`\`yaml
${fmMatch[1].slice(0, 1500)}
\`\`\`

详细内容**按需** lazy load:
- progress 详情 → 按 pointers.latest_progress 读 progress.md 尾部
- lessons → 命中主题再按 pointers.latest_lesson 跳段
- 完整 _index.md → \`.ai_state/_index.md\`

⚠️ 禁止 glob 整个 .ai_state/ (铁律 8 索引先行)`;

    process.stderr.write(`[compact-restore] injected ${additionalContext.length} chars\n`);
    process.stdout.write(JSON.stringify({
      hookSpecificOutput: {
        hookEventName: 'PostCompact',
        additionalContext
      }
    }));

    const trace = JSON.stringify({
      ts: new Date().toISOString(),
      hook: 'compact-restore',
      chars: additionalContext.length
    }) + '\n';
    fs.appendFileSync(path.join(STATE_DIR, 'hook-trace.jsonl'), trace);
  } catch (e) {
    process.stderr.write(`[compact-restore] failed: ${e.message}\n`);
  }

  process.exit(0);
});
