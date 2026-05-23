#!/usr/bin/env node
'use strict';
// VibeCoding Athena ConfigChange hook v9.6 ★新增 (L2.G)
// 协议: 不阻断, additionalContext 注入 warning
// 参考: https://code.claude.com/docs/en/hooks#configchange
//
// 设计:
//   ConfigChange 事件触发时 (settings.json/CLAUDE.md/MCP 等变更):
//   1. 重新读 _index.md, 验证 schema_version 仍是 "9.6"
//   2. 比对 fingerprints 段, 检测 details/* 是否被外部修改 (mtime 异常跳变)
//   3. 异常时注入 systemMessage 提醒 (而非 block, ConfigChange 不该 block)
//
// 用途场景: 用户用编辑器手改了 _index.md 导致 schema 损坏 / git checkout 切换分支后状态错位

const fs = require('fs');
const path = require('path');

const PROJECT_DIR = process.env.CLAUDE_PROJECT_DIR || process.cwd();
const STATE_DIR = path.join(PROJECT_DIR, '.ai_state');
const INDEX_PATH = path.join(STATE_DIR, '_index.md');

let input = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', d => input += d);
process.stdin.on('end', () => {
  let event = {};
  try { event = JSON.parse(input); } catch (e) {}
  const configSource = event.matcher || 'unknown';

  if (!fs.existsSync(INDEX_PATH)) { process.exit(0); return; }

  const warnings = [];

  try {
    const content = fs.readFileSync(INDEX_PATH, 'utf8');
    const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);

    if (!fmMatch) {
      warnings.push('_index.md frontmatter 已损坏, 无法解析');
    } else {
      const fm = fmMatch[1];

      // 1. schema_version 检查
      const schemaMatch = fm.match(/^schema_version: "([^"]+)"$/m);
      if (!schemaMatch || schemaMatch[1] !== '9.6') {
        warnings.push(`schema_version 异常: ${schemaMatch ? schemaMatch[1] : 'missing'} (期望 "9.6", 可能需要 /athena-migrate)`);
      }

      // 2. fingerprints vs 实际 mtime 比对
      const getFp = k => {
        const m = fm.match(new RegExp('^  ' + k + ': (\\d+)$', 'm'));
        return m ? parseInt(m[1], 10) : 0;
      };
      const fpTasks = getFp('tasks_mtime');
      const fpDesign = getFp('design_mtime');
      const fpProgress = getFp('progress_mtime');
      const fpLessons = getFp('lessons_mtime');

      const checkFile = (name, fp) => {
        try {
          const actual = Math.floor(fs.statSync(path.join(STATE_DIR, 'details', name)).mtimeMs);
          // 允许 fingerprint 落后于 actual (PostToolUse 还没跑), 但反过来不正常
          if (fp > actual + 1000) {
            warnings.push(`${name} fingerprint 比实际 mtime 新 (${fp - actual}ms), 可能被外部修改`);
          }
        } catch (e) {}
      };
      checkFile('tasks-current.md', fpTasks);
      checkFile('design.md', fpDesign);
      checkFile('progress.md', fpProgress);
      checkFile('lessons.md', fpLessons);
    }
  } catch (e) {
    warnings.push(`审计失败: ${e.message}`);
  }

  if (warnings.length === 0) { process.exit(0); return; }

  const msg = `[Athena state-audit] ConfigChange (${configSource}) 检测到 ${warnings.length} 个潜在问题:\n${warnings.map(w => '• ' + w).join('\n')}`;
  process.stderr.write(msg + '\n');
  process.stdout.write(JSON.stringify({ systemMessage: msg }));

  try {
    const trace = JSON.stringify({
      ts: new Date().toISOString(),
      hook: 'state-audit',
      source: configSource,
      warnings_count: warnings.length
    }) + '\n';
    fs.appendFileSync(path.join(STATE_DIR, 'hook-trace.jsonl'), trace);
  } catch (e) {}

  process.exit(0);
});
