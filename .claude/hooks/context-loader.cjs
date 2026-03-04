// VibeCoding v8.9 — SessionStart Hook
// 加载项目上下文 + 智能断点恢复
const fs = require('node:fs');
const path = require('node:path');

function readHead(file, lines) {
  try {
    const content = fs.readFileSync(file, 'utf8');
    return content.split('\n').slice(0, lines).join('\n');
  } catch {
    return '';
  }
}

function exists(f) {
  try {
    return fs.existsSync(f);
  } catch {
    return false;
  }
}

const ctx = [];

// 1. 加载 conventions (始终)
if (exists('.ai_state/conventions.md')) {
  ctx.push(`📋 conventions:\n${readHead('.ai_state/conventions.md', 30)}`);
}

// 2. 加载 .knowledge/ (跨会话经验)
for (const f of ['patterns.md', 'pitfalls.md', 'decisions.md', 'tools.md']) {
  const p = path.join('.knowledge', f);
  if (exists(p)) {
    const head = readHead(p, 15);
    if (head.trim()) ctx.push(`📚 ${f}:\n${head}`);
  }
}

// 3. 断点恢复: 检测中断阶段
if (exists('.ai_state/session.md')) {
  const session = fs.readFileSync('.ai_state/session.md', 'utf8');
  ctx.push(`🔄 session:\n${session}`);

  // 检测高级阶段断点
  if (exists('.ai_state/review.md')) {
    ctx.push('⚠️ 断点: 已到 V(验收) 阶段, 上次可能在最终审查中中断');
  } else if (exists('.ai_state/verified.md')) {
    ctx.push('⚠️ 断点: 已到 T(测试) 阶段, 验证已开始');
  } else if (exists('.ai_state/doing.md')) {
    const doing = readHead('.ai_state/doing.md', 20);
    ctx.push(`📝 doing:\n${doing}`);
  }
}

// 4. plan.md 和 design.md (如果存在)
if (exists('.ai_state/plan.md')) {
  ctx.push(`📐 plan:\n${readHead('.ai_state/plan.md', 25)}`);
}
if (exists('.ai_state/design.md')) {
  ctx.push(`🎨 design:\n${readHead('.ai_state/design.md', 15)}`);
  // 异常场景: design.md 存在但 session.md 不存在 (异常中断)
  if (!exists('.ai_state/session.md')) {
    ctx.push(
      '⚠️ design.md 存在但 session.md 缺失, 可能是上次任务异常中断。建议 /vibe-resume 恢复或 /vibe-dev 重新开始。'
    );
  }
}

if (ctx.length > 0) {
  process.stdout.write(ctx.join('\n---\n'));
}
