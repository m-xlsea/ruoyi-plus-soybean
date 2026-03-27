// VibeCoding v9.2.0 — PreToolUse(Bash): 安全守卫 (JSON decision output)
'use strict';
const input = JSON.parse(require('fs').readFileSync('/dev/stdin', 'utf8'));
const cmd = input?.tool_input?.command || '';

const BLOCKED = [
  /rm\s+-rf\s+[\/~]/, /chmod\s+777/, /curl\s+.*\|\s*(?:bash|sh)/,
  /wget\s+.*\|\s*(?:bash|sh)/, />\s*\/etc\//, /mkfs\./, /dd\s+if=/,
  /:(){ :\|:& };:/, /fork\s*bomb/i
];

for (const pattern of BLOCKED) {
  if (pattern.test(cmd)) {
    // 使用 JSON decision output (官方推荐方式)
    const output = JSON.stringify({
      hookSpecificOutput: {
        hookEventName: "PreToolUse",
        permissionDecision: "deny",
        permissionDecisionReason: `[pre-bash] 危险命令被阻断: ${cmd.slice(0, 80)}`
      }
    });
    process.stdout.write(output);
    process.exit(0);
  }
}
process.exit(0);
