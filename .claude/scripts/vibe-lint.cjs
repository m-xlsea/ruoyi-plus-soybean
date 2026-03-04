// VibeCoding v8.9 — 配置健康检查
// 运行: node .claude/scripts/vibe-lint.cjs
const fs = require('node:fs');
const path = require('node:path');

let fail = 0;
let ok = 0;
let warn = 0;

function check(condition, msg) {
  if (condition) {
    console.log(`  ✅ ${msg}`);
    ok++;
  } else {
    console.log(`  ❌ ${msg}`);
    fail++;
  }
}

function soft(condition, msg) {
  if (condition) {
    console.log(`  ✅ ${msg}`);
    ok++;
  } else {
    console.log(`  ⚠️  ${msg}`);
    warn++;
  }
}

function exists(f) {
  return fs.existsSync(f);
}

console.log('🔍 VibeCoding v8.9 配置检查\n');

console.log('=== 核心文件 ===');
check(exists('.claude/CLAUDE.md'), 'CLAUDE.md 入口');
check(exists('.claude/settings.json'), 'settings.json 配置');
check(exists('.claude/workflows/pace.md'), 'P.A.C.E. 路由');
check(exists('.claude/workflows/riper-7.md'), 'RIPER-7 编排');
check(exists('.claude/rules/rules.md'), '项目规则');

console.log('\n=== Skills ===');
const skills = [
  'brainstorm',
  'cunzhi',
  'tdd',
  'verification',
  'code-quality',
  'knowledge',
  'agent-teams',
  'context7',
  'plan-first',
  'smart-archive',
  'e2e-testing',
  'security-review',
  'quickstart'
];
skills.forEach(s => check(exists(`.claude/skills/${s}/SKILL.md`), `skill: ${s}`));

console.log('\n=== Agents ===');
['builder', 'validator', 'explorer', 'e2e-runner', 'security-auditor'].forEach(a =>
  check(exists(`.claude/agents/${a}.md`), `agent: ${a}`)
);

console.log('\n=== Hooks ===');
check(exists('.claude/hooks/context-loader.cjs'), 'SessionStart hook');
check(exists('.claude/hooks/delivery-gate.cjs'), 'Stop hook');
check(exists('.claude/hooks/worktree-init.cjs'), 'WorktreeCreate hook');

console.log('\n=== 项目状态 ===');
soft(exists('.ai_state'), '.ai_state/ 目录');
soft(exists('.knowledge'), '.knowledge/ 目录');
soft(exists('.ai_state/conventions.md'), 'conventions.md');

console.log(`\n📊 结果: ${ok} 通过, ${warn} 警告, ${fail} 失败`);
if (fail > 0) process.exit(1);
