#!/usr/bin/env node
'use strict';
// VibeCoding Athena PermissionDenied hook v9.6
// 协议: stdout JSON { retry: true } (CC v2.1.89+ 官方标准)
// 参考: https://code.claude.com/docs/en/hooks#permissiondenied
//
// 设计:
//   当 auto mode classifier 拒绝某个工具调用 → 提示 model 可以重试 (但只针对一次)
//   并 systemMessage 建议用户加入全局 deny (如果是反复出现的 pattern)

const fs = require('fs');
const path = require('path');

const PROJECT_DIR = process.env.CLAUDE_PROJECT_DIR || process.cwd();
const STATE_DIR = path.join(PROJECT_DIR, '.ai_state');

let input = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', d => input += d);
process.stdin.on('end', () => {
  let event = {};
  try { event = JSON.parse(input); } catch (e) { process.exit(0); return; }

  const tool = event.tool_name || '';
  const cmd = (event.tool_input && event.tool_input.command) || '';
  const reason = event.reason || '';

  // 软提示: 如果是 Bash + 看起来是项目本地命令 → 提示用户考虑加入项目 allow
  let suggestion = '';
  if (tool === 'Bash' && cmd) {
    // 抽取命令名 (第一个 token)
    const cmdName = cmd.trim().split(/\s+/)[0];
    if (['npm', 'pnpm', 'yarn', 'pytest', 'cargo', 'go', 'make'].includes(cmdName)) {
      suggestion = `如果这是项目常用命令, 可: /athena:remember-allow "Bash(${cmdName}:*)" 加入全局 allow`;
    }
  }

  if (suggestion) {
    process.stderr.write(`[permission-retry] suggest: ${suggestion}\n`);
    process.stdout.write(JSON.stringify({
      retry: true,
      systemMessage: `[Athena] permission denied. ${suggestion}`
    }));
  } else {
    // 默认让 model 知道可以一次性重试
    process.stdout.write(JSON.stringify({ retry: true }));
  }

  try {
    const trace = JSON.stringify({
      ts: new Date().toISOString(),
      hook: 'permission-retry',
      tool, cmd_head: cmd.slice(0, 60), reason: reason.slice(0, 100)
    }) + '\n';
    fs.appendFileSync(path.join(STATE_DIR, 'hook-trace.jsonl'), trace);
  } catch (e) {}

  process.exit(0);
});
