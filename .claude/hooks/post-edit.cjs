#!/usr/bin/env node
"use strict";
// VibeCoding v9.1.0 — PostToolUse Hook (Post-Edit)
// 非阻塞: 格式化提醒 (Block-at-Commit 策略)
var d = "";
process.on("uncaughtException", function() { process.exit(0); });
process.stdin.on("data", function(c) { d += c; });
process.stdin.on("end", function() {
  try {
    var input = JSON.parse(d);
    var p = input.tool_input && input.tool_input.file_path || "";

    // 阻止在系统目录外创建不必要的 .md 文件
    if (/\.(md|txt)$/.test(p)
      && !/(README|CLAUDE|AGENTS|CONTRIBUTING|CHANGELOG|LICENSE|API|ARCHITECTURE|SECURITY|MIGRATION)\.md$/.test(p)
      && !/\.claude\//.test(p)
      && !/\.ai_state\//.test(p)
      && !/docs?\//.test(p)
      && !/src\//.test(p)
      && !/plans?\//.test(p)) {
      console.error("[Hook] BLOCKED: 不必要的文档文件: " + p);
      console.error("[Hook] 使用 README.md, docs/, 或 .ai_state/");
      process.exit(2);
    }
  } catch {}
  console.log(d);
});
