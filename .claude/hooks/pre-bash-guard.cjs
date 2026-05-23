#!/usr/bin/env node
'use strict';
// VibeCoding Athena PreToolUse Bash guard v9.6
// 协议: hookSpecificOutput.{hookEventName: "PreToolUse", permissionDecision: "deny", permissionDecisionReason}
// 参考: https://code.claude.com/docs/en/hooks#pretooluse
//
// v9.6 设计:
// 配合 settings.json 的 if 字段做精细化拦截 (官方 if syntax: https://code.claude.com/docs/en/hooks#common-fields)
// settings.json 已用 if: "Bash(rm *)" / "Bash(curl *|wget *)" / "Bash(mkfs*|dd *)" 预过滤
// hook 内部做二次确认 + 提供具体的拒绝原因
//
// permissions.deny 已含 "Bash(rm -rf *)" 灾难规则, 这里是双重保险

let input = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', d => input += d);
process.stdin.on('end', () => {
  let cmd = '';
  try {
    const d = JSON.parse(input);
    cmd = (d.tool_input && d.tool_input.command) || '';
  } catch (e) { process.exit(0); return; }

  if (!cmd) { process.exit(0); return; }

  const deny = (reason) => {
    process.stderr.write(`[bash-guard] deny: ${reason} (${cmd.slice(0, 60)})\n`);
    process.stdout.write(JSON.stringify({
      hookSpecificOutput: {
        hookEventName: 'PreToolUse',
        permissionDecision: 'deny',
        permissionDecisionReason: `Athena bash-guard 阻断: ${reason}`
      }
    }));
    process.exit(0);
  };

  // 灾难级 (3 条):
  // 1. rm -rf 系统/用户根
  if (/rm\s+-[rRf]+\s+(\/\s|\/\*|~\/?\s|~\s|\/$|~$)/.test(cmd) ||
      /rm\s+-[rRf]+\s+\/\s*[;&|]/.test(cmd)) {
    return deny('禁止删除系统/用户根目录');
  }
  // 2. 管道远程脚本
  if (/(curl|wget)\s+[^|]*\|\s*(bash|sh|zsh|fish|ksh)/.test(cmd)) {
    return deny('禁止管道执行远程脚本 (curl|wget ... | sh)');
  }
  // 3. 格式化磁盘 / 写设备
  if (/\bmkfs\.|dd\s+if=.*of=\/dev\/sd|>\s*\/dev\/sd[a-z]/.test(cmd)) {
    return deny('禁止格式化磁盘/写设备');
  }

  process.exit(0);
});
