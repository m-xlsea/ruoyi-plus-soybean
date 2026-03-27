// VibeCoding v9.2.0 — Stop: TDD 检查 (git diff 对比)
'use strict';
const { execSync } = require('child_process');

try {
  const diff = execSync('git diff --name-only 2>/dev/null', { encoding: 'utf8' });
  const codeExts = /\.(ts|tsx|js|jsx|py|go|rs)$/;
  const testPattern = /\.test\.|\.spec\.|__test__|_test\./;
  const configPattern = /config|\.json$|\.yaml$|\.yml$|\.md$|\.lock$/i;

  const srcFiles = diff.split('\n').filter(f =>
    f.match(codeExts) && !f.match(testPattern) && !f.match(configPattern)
  );
  const testFiles = diff.split('\n').filter(f => f.match(testPattern));

  if (srcFiles.length > 0 && testFiles.length === 0) {
    process.stderr.write(`[tdd-check] ⚠ ${srcFiles.length} 个源码修改但无测试。TDD: 先写测试!\n`);
    // 不阻断, 只提醒 (阻断在 delivery-gate)
  }
} catch {}
process.exit(0);
