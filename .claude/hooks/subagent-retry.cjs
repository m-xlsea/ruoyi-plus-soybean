#!/usr/bin/env node
'use strict';
// VibeCoding Athena PostToolUse subagent-retry v9.6
// 协议: 不阻断 (additionalContext 注入 hint)
// 参考: https://code.claude.com/docs/en/hooks#posttooluse
//
// 设计:
//   Task tool 调用 subagent. 若返回的 tool_response 里含"无法"/"无能力"等放弃语
//   → 注入 systemMessage 提示 main agent 重试或亲自接管
//   防止 subagent 偷懒 (v9.5 实测问题)

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

  if (event.tool_name !== 'Task') { process.exit(0); return; }

  const response = event.tool_response;
  if (!response || typeof response !== 'object') { process.exit(0); return; }

  // 提取 subagent 的完整响应内容
  let text = '';
  if (typeof response.content === 'string') text = response.content;
  else if (Array.isArray(response.content)) text = response.content.map(c => c.text || '').join('\n');
  else text = JSON.stringify(response);

  // 放弃信号词
  const giveupPatterns = [
    /我(无法|不能|没法|无能力|不具备能力)/,
    /I (cannot|can't|am not able to|don't have access)/i,
    /no (capability|access|permission) to/i,
    /unable to (read|write|execute|access)/i,
    /tool not available/i,
    /(请|你)(自己|手动|帮我)?(运行|执行|跑)/,
    /please run (this|the command) (yourself|manually)/i
  ];

  const found = giveupPatterns.find(p => p.test(text));
  if (!found) { process.exit(0); return; }

  process.stderr.write(`[subagent-retry] giveup detected: ${found}\n`);

  const subagentType = (event.tool_input && event.tool_input.subagent_type) || 'subagent';

  process.stdout.write(JSON.stringify({
    systemMessage: `[Athena subagent-retry] ${subagentType} 返回了放弃信号. 协议: 1) 再尝试一次, 用不同参数或拆分任务 2) 仍失败则主 agent 接管, 不要让用户代执行 (铁律 6 完成度证据)`
  }));

  // hook-trace
  try {
    const trace = JSON.stringify({
      ts: new Date().toISOString(),
      hook: 'subagent-retry',
      subagent_type: subagentType,
      pattern: String(found)
    }) + '\n';
    fs.appendFileSync(path.join(STATE_DIR, 'hook-trace.jsonl'), trace);
  } catch (e) {}

  process.exit(0);
});
