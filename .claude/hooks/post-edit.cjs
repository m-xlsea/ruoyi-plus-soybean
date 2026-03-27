// VibeCoding v9.2.0 — PostToolUse(Write|Edit): 格式化
'use strict';
const { execSync } = require('child_process');
const fs = require('fs');
const input = JSON.parse(fs.readFileSync('/dev/stdin', 'utf8'));
const file = input?.tool_input?.file_path || input?.tool_input?.path || '';

try {
  if (file.match(/\.(ts|tsx|js|jsx)$/)) {
    // 先检查 prettier 存在
    if (fs.existsSync('node_modules/.bin/prettier')) {
      execSync(`npx prettier --write "${file}" 2>/dev/null`, { timeout: 5000 });
    }
  } else if (file.match(/\.py$/)) {
    try { execSync('which black', { stdio: 'ignore', timeout: 2000 }); } catch { process.exit(0); }
    execSync(`python3 -m black "${file}" --quiet 2>/dev/null`, { timeout: 5000 });
  }
} catch {}
process.exit(0);
