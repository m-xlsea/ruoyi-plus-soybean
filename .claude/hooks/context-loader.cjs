#!/usr/bin/env node
"use strict";
// VibeCoding v9.1.0 — SessionStart Hook (Context Loader)
// 恢复断点 + 按需加载上下文
var fs = require("fs");
var path = require("path");

process.on("uncaughtException", function() { process.exit(0); });
if (process.env.VIBECODING_HOOKS_DISABLED === "1") process.exit(0);

function exists(f) { try { return fs.existsSync(f); } catch { return false; } }
function readHead(f, n) {
  try {
    var lines = fs.readFileSync(f, "utf8").split("\n");
    return lines.slice(0, n).join("\n");
  } catch { return ""; }
}

var ctx = [];

// 1. conventions (始终加载)
if (exists(".ai_state/conventions.md")) {
  ctx.push("📋 conventions:\n" + readHead(".ai_state/conventions.md", 30));
}

// 2. knowledge (跨会话经验, 配合 /memory auto-memory)
if (exists(".ai_state/knowledge.md")) {
  var kn = readHead(".ai_state/knowledge.md", 20);
  if (kn.trim()) ctx.push("📚 knowledge:\n" + kn);
}

// 3. lessons (错误教训)
if (exists(".ai_state/lessons.md")) {
  var ls = readHead(".ai_state/lessons.md", 15);
  if (ls.trim()) ctx.push("⚠️ lessons:\n" + ls);
}

// 4. 断点恢复: 检测中断阶段
if (exists(".ai_state/session.md")) {
  var session = fs.readFileSync(".ai_state/session.md", "utf8");
  ctx.push("🔄 session:\n" + session);

  // 推断当前阶段
  if (exists(".ai_state/review.md")) {
    ctx.push("⚠️ 断点: V(验收)阶段, 上次在最终审查中中断");
  } else if (exists(".ai_state/verified.md")) {
    ctx.push("⚠️ 断点: T(测试)阶段, 验证已开始");
  } else if (exists(".ai_state/doing.md")) {
    ctx.push("📝 doing:\n" + readHead(".ai_state/doing.md", 20));
    ctx.push("⚠️ 断点: E(执行)阶段, 开发进行中");
  } else if (exists(".ai_state/plan.md")) {
    ctx.push("📐 plan:\n" + readHead(".ai_state/plan.md", 25));
    ctx.push("⚠️ 断点: P(计划)阶段已完成, 继续执行");
  } else if (exists(".ai_state/design.md")) {
    ctx.push("🎨 design:\n" + readHead(".ai_state/design.md", 15));
    ctx.push("⚠️ 断点: D(设计)阶段已完成");
  }
} else {
  // 无 session = 新会话, 检查是否有 .ai_state 目录
  if (!exists(".ai_state")) {
    ctx.push("💡 新项目: 使用 /vibe-init 初始化, 或 /vibe-dev {需求} 直接开始");
  }
}

// 5. design + plan (如果存在且未在断点中加载)
if (exists(".ai_state/plan.md") && !exists(".ai_state/doing.md")) {
  // plan 存在但 doing 不存在 → 可能刚完成规划
}

if (ctx.length > 0) {
  process.stdout.write(ctx.join("\n---\n"));
}
