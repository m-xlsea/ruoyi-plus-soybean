#!/usr/bin/env node
"use strict";
// VibeCoding v9.1.0 — Stop Hook (Delivery Gate)
// 阻止未完成任务/未测试代码的交付
var fs = require("fs");
var child_process = require("child_process");

process.on("uncaughtException", function() { process.exit(0); });
if (process.env.VIBECODING_HOOKS_DISABLED === "1") process.exit(0);

function exists(f) { try { return fs.existsSync(f); } catch { return false; } }

function runQuiet(cmd, timeout) {
  try {
    child_process.execSync(cmd, { timeout: timeout || 60000, stdio: "pipe" });
    return true;
  } catch { return false; }
}

function hasScript(name) {
  try {
    var pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));
    return !!(pkg.scripts && pkg.scripts[name]);
  } catch { return false; }
}

var d = "";
process.stdin.on("data", function(c) { d += c; });
process.stdin.on("end", function() {
  try {
    var input = JSON.parse(d);

    // 检查 last_assistant_message (v2.1.47+ 新增)
    var lastMsg = input.last_assistant_message || "";

    // 1. 检查 plan.md 未完成任务
    if (exists(".ai_state/plan.md")) {
      var plan = fs.readFileSync(".ai_state/plan.md", "utf8");
      var unchecked = (plan.match(/^- \[ \]/gm) || []).length;
      if (unchecked > 0) {
        process.stderr.write("[DeliveryGate] BLOCKED: " + unchecked + " unchecked tasks in plan.md\n");
        process.exit(2);
      }
    }

    // 2. Path B+: 运行测试 (仅当有测试脚本时)
    var isStrictPath = exists(".ai_state/design.md") || exists(".ai_state/plan.md");
    if (isStrictPath) {
      // 多语言测试检测
      var testCmd = null;
      if (hasScript("test")) testCmd = "npm test";
      else if (exists("pytest.ini") || exists("pyproject.toml")) testCmd = "pytest --tb=short -q";
      else if (exists("Cargo.toml")) testCmd = "cargo test";
      else if (exists("go.mod")) testCmd = "go test ./...";

      if (testCmd) {
        var passed = runQuiet(testCmd, 120000);
        if (!passed) {
          process.stderr.write("[DeliveryGate] BLOCKED: tests failed (" + testCmd + ")\n");
          process.exit(2);
        }
      }

      // ESLint (仅当有配置时)
      var hasEslint = exists(".eslintrc.js") || exists(".eslintrc.json") || exists(".eslintrc.yml") || exists("eslint.config.js") || exists("eslint.config.mjs");
      if (hasEslint) {
        runQuiet("npx eslint . --max-warnings=0 2>/dev/null", 30000);
        // ESLint 失败不阻塞, 只警告
      }
    }

    // 3. 检查 doing.md 是否有未完成项
    if (exists(".ai_state/doing.md")) {
      var doing = fs.readFileSync(".ai_state/doing.md", "utf8");
      var inProgress = (doing.match(/🔄|IN_PROGRESS|进行中/g) || []).length;
      if (inProgress > 0) {
        process.stderr.write("[DeliveryGate] WARNING: " + inProgress + " tasks still in progress\n");
      }
    }

  } catch(e) {}
  console.log(d);
});
