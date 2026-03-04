// VibeCoding v8.9 — WorktreeCreate Hook
// 在 agent worktree 中初始化 .ai_state
const fs = require('node:fs');

function ensureDir(d) {
  try {
    fs.mkdirSync(d, { recursive: true });
  } catch {}
}

// 在 worktree 中创建最小 .ai_state
ensureDir('.ai_state');

// 只创建 doing.md (子代理需要记录进度)
if (!fs.existsSync('.ai_state/doing.md')) {
  fs.writeFileSync('.ai_state/doing.md', '# Worktree Task Progress\n\n');
}

process.stdout.write('✅ Worktree .ai_state 已初始化');
