// VibeCoding v9.2.0 — Stop: 4级 Quality Gate
'use strict';
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

process.on('uncaughtException', function(e) {
  process.stderr.write('[delivery-gate] ERROR: ' + e.message + '\n');
  process.exit(0); // 脚本错误不阻断
});

if (process.env.VIBECODING_HOOKS_DISABLED === '1') { process.exit(0); }

const STATE_DIR = path.join(process.cwd(), '.ai_state');
const severity = { fail: [], rework: [], concerns: [] };

try {
  if (!fs.existsSync(STATE_DIR)) { process.exit(0); } // 无状态 = Path A, 放行

  const planFile = path.join(STATE_DIR, 'plan.md');
  const qualityFile = path.join(STATE_DIR, 'quality.md');

  // ── FAIL 级: 硬约束 ──
  // 未完成任务
  if (fs.existsSync(planFile)) {
    const plan = fs.readFileSync(planFile, 'utf8');
    const unchecked = (plan.match(/^- \[ \]/gm) || []).length;
    if (unchecked > 0) severity.fail.push(`plan.md 有 ${unchecked} 个未完成任务`);
  }
  // 缺 quality.md (有 plan 但没 quality = T 阶段未执行)
  if (fs.existsSync(planFile) && !fs.existsSync(qualityFile)) {
    severity.fail.push('缺少 quality.md — T 阶段验证未执行');
  }
  // 硬编码密钥
  try {
    const secrets = execSync(
      "git diff --cached -U0 2>/dev/null | grep -iE '(password|secret|api_key|token)\\s*[:=]\\s*.' || true",
      { encoding: 'utf8' }
    );
    if (secrets.trim()) severity.fail.push('疑似硬编码密钥');
  } catch {}

  // ── REWORK 级: 源码无测试 ──
  try {
    const diff = execSync('git diff --cached --name-only 2>/dev/null || git diff --name-only 2>/dev/null', { encoding: 'utf8' });
    const codeExts = /\.(ts|tsx|js|jsx|py|go|rs|java|rb)$/;
    const testPattern = /\.test\.|\.spec\.|__test__|__spec__|_test\.|tests\//;
    const configPattern = /config|\.env|\.json$|\.yaml$|\.yml$|\.toml$|\.md$|\.txt$/i;
    const srcFiles = diff.split('\n').filter(f =>
      f.match(codeExts) && !f.match(testPattern) && !f.match(configPattern)
    );
    const testFiles = diff.split('\n').filter(f => f.match(testPattern));
    if (srcFiles.length > 0 && testFiles.length === 0) {
      if (srcFiles.length > 2) {
        severity.rework.push(`${srcFiles.length} 个源码文件修改但无对应测试`);
      } else {
        severity.concerns.push(`${srcFiles.length} 个源码文件修改但无测试 (数量少, 标注)`);
      }
    }
  } catch {}

} catch (e) {
  process.exit(0);
}

// ── 输出结果 ──
// Stop hook 语义: exit 0 = 放行停止, exit 2 = 阻断停止(强制继续)
// stdout 输出会作为 context 注入 Claude
const allIssues = [...severity.fail, ...severity.rework, ...severity.concerns];
if (severity.fail.length > 0) {
  process.stderr.write(`[delivery-gate] ❌ FAIL — 严重问题, 必须修复:\n${severity.fail.map(i => `  ✗ ${i}`).join('\n')}\n`);
  if (severity.rework.length) process.stderr.write(`  + REWORK: ${severity.rework.join(', ')}\n`);
  if (severity.concerns.length) process.stderr.write(`  + CONCERNS: ${severity.concerns.join(', ')}\n`);
  process.exit(2); // 阻断: 不让停
}
if (severity.rework.length > 0) {
  process.stderr.write(`[delivery-gate] 🔧 REWORK — 需要修复:\n${severity.rework.map(i => `  ✗ ${i}`).join('\n')}\n`);
  if (severity.concerns.length) process.stderr.write(`  + CONCERNS: ${severity.concerns.join(', ')}\n`);
  process.exit(2); // 阻断: 不让停
}
if (severity.concerns.length > 0) {
  // CONCERNS: 放行但输出警告作为 context
  process.stdout.write(`[delivery-gate] ⚠ CONCERNS (已放行, 建议修复):\n${severity.concerns.map(i => `  △ ${i}`).join('\n')}\n`);
  process.exit(0); // 放行: 但警告已注入
}
process.exit(0); // PASS
