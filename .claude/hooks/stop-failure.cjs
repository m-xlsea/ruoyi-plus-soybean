// VibeCoding v9.2.0 — StopFailure: API错误时保存状态
'use strict';
const fs = require('fs');
const path = require('path');
const STATE_DIR = path.join(process.cwd(), '.ai_state');

try {
  if (fs.existsSync(STATE_DIR)) {
    const sessionFile = path.join(STATE_DIR, 'session.md');
    if (fs.existsSync(sessionFile)) {
      let content = fs.readFileSync(sessionFile, 'utf8');
      const ts = new Date().toISOString();
      content += `\n\n## 异常中断\n${ts} — API错误导致会话中断。下次 SessionStart 自动恢复。\n`;
      fs.writeFileSync(sessionFile, content);
    }
    console.log('[VibeCoding] API错误，状态已保存。下次启动自动恢复。');
  }
} catch {}
