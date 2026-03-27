// VibeCoding v9.2.0 — SessionStart: 检测状态 + 恢复 + 提醒
'use strict';
const fs = require('fs');
const path = require('path');
const STATE_DIR = path.join(process.cwd(), '.ai_state');

try {
  if (fs.existsSync(STATE_DIR)) {
    // 恢复: 读取关键状态文件
    const files = ['session.md', 'doing.md', 'plan.md', 'design.md'];
    const found = files.filter(f => fs.existsSync(path.join(STATE_DIR, f)));
    if (found.length > 0) {
      console.log(`[VibeCoding] 恢复会话: ${found.join(', ')} 已加载`);
      // 检查未完成任务
      const planFile = path.join(STATE_DIR, 'plan.md');
      if (fs.existsSync(planFile)) {
        const plan = fs.readFileSync(planFile, 'utf8');
        const unchecked = (plan.match(/^- \[ \]/gm) || []).length;
        if (unchecked > 0) console.log(`[VibeCoding] ⚠ plan.md 有 ${unchecked} 个未完成任务`);
      }
    }
    // Agent 易犯错误提醒
    const convFile = path.join(STATE_DIR, 'conventions.md');
    if (fs.existsSync(convFile)) {
      const conv = fs.readFileSync(convFile, 'utf8');
      const errSection = conv.match(/## Agent 易犯错误\n([\s\S]*?)(?=\n##|$)/);
      if (errSection && errSection[1].trim()) {
        console.log('[VibeCoding] 🔔 Agent 易犯错误提醒:');
        console.log(errSection[1].trim().split('\n').slice(0, 5).join('\n'));
      }
    }
  } else {
    console.log('[VibeCoding] 新会话: .ai_state/ 不存在, 首次任务时自动初始化');
  }
} catch (e) {
  console.log('[VibeCoding] context-loader 警告: ' + e.message);
}
