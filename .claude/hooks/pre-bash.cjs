#!/usr/bin/env node
"use strict";
// VibeCoding v9.1.0 — PreToolUse Hook (Bash Safety Guard)
// 拦截危险命令, 使用 hookSpecificOutput.permissionDecision
var d = "";
process.on("uncaughtException", function() { process.exit(0); });
process.stdin.on("data", function(c) { d += c; });
process.stdin.on("end", function() {
  try {
    var input = JSON.parse(d);
    var cmd = (input.tool_input && input.tool_input.command) || "";

    // DENY: rm -rf / 或 根目录危险操作
    if (/\brm\s+(-[a-zA-Z]*r[a-zA-Z]*f|--recursive)/.test(cmd) && /\s\/(\s|$)/.test(cmd)) {
      process.stderr.write("[SECURITY] Blocked: rm -rf /\n");
      process.exit(2);
    }

    // DENY: sudo
    if (/\bsudo\b/.test(cmd)) {
      process.stderr.write("[SECURITY] Blocked: sudo\n");
      process.exit(2);
    }

    // DENY: eval (精确匹配, 排除 node eval.js 类误报)
    if (/(^|[;&|])\s*eval\b/.test(cmd)) {
      process.stderr.write("[SECURITY] Blocked: eval\n");
      process.exit(2);
    }

    // DENY: curl pipe bash
    if (/\bcurl\b.*\|\s*(ba)?sh/.test(cmd) || /\bwget\b.*\|\s*(ba)?sh/.test(cmd)) {
      process.stderr.write("[SECURITY] Blocked: curl|bash\n");
      process.exit(2);
    }

    // WARN: 敏感文件访问 (不阻塞)
    if (/\.(env|pem|key|cert|p12|pfx|jks)\b/.test(cmd)
      && !/\.gitignore/.test(cmd) && !/grep/.test(cmd)) {
      process.stderr.write("[SECURITY] WARNING: sensitive file access — " + cmd.slice(0, 80) + "\n");
    }

  } catch {}
  console.log(d);
});
