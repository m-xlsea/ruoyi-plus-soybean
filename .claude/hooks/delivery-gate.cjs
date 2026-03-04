// VibeCoding v8.9 — Stop Hook (Delivery Gate)
// 阻止未完成任务/未测试代码的交付
const fs = require('node:fs');
const { execSync } = require('node:child_process');

function exists(f) {
  try {
    return fs.existsSync(f);
  } catch {
    return false;
  }
}

function runQuiet(cmd, timeout) {
  try {
    execSync(cmd, { timeout: timeout || 60000, stdio: 'pipe' });
    return true;
  } catch {
    return false;
  }
}

function hasScript(name) {
  try {
    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    return Boolean(pkg.scripts && pkg.scripts[name]);
  } catch {
    return false;
  }
}

// 获取当前 Path
let currentPath = 'A';
try {
  const session = fs.readFileSync('.ai_state/session.md', 'utf8');
  const m = session.match(/path:\s*([ABCD])/i);
  if (m) currentPath = m[1].toUpperCase();
} catch {}

const errors = [];

// === 检查 1: plan.md 完成度 (Path B+) ===
if (currentPath !== 'A' && exists('.ai_state/plan.md')) {
  try {
    const plan = fs.readFileSync('.ai_state/plan.md', 'utf8');
    const total = (plan.match(/- \[[ x]\]/g) || []).length;
    const done = (plan.match(/- \[x\]/gi) || []).length;
    if (total > 0 && done < total) {
      errors.push(`plan.md: ${done}/${total} 完成, ${total - done} 个任务未完成`);
    }
  } catch {}
}

// === 检查 2: npm test (Path B+) ===
if (currentPath !== 'A' && hasScript('test')) {
  if (!runQuiet('npm test', 90000)) {
    errors.push('npm test 失败');
  }
}

// === 检查 3: ESLint (Path C+) ===
const isStrictPath = currentPath === 'C' || currentPath === 'D';
const hasEslintConfig =
  exists('.eslintrc') ||
  exists('.eslintrc.js') ||
  exists('.eslintrc.json') ||
  exists('.eslintrc.cjs') ||
  exists('eslint.config.js') ||
  exists('eslint.config.mjs') ||
  exists('eslint.config.cjs');
if (isStrictPath && hasEslintConfig) {
  if (!runQuiet('npx eslint . --max-warnings 0', 60000)) {
    errors.push('ESLint 检查未通过');
  }
}

// === 检查 4: TypeScript (Path B+) ===
if (currentPath !== 'A' && exists('tsconfig.json')) {
  if (!runQuiet('npx tsc --noEmit', 60000)) {
    errors.push('TypeScript 类型检查失败');
  }
}

// === 输出 ===
if (errors.length > 0) {
  process.stderr.write(`🚫 Delivery Gate 拦截:\n${errors.map(e => `  ❌ ${e}`).join('\n')}`);
  process.exit(2); // exit 2 = block
} else {
  process.stdout.write(`✅ Delivery Gate 通过 (Path ${currentPath})`);
  process.exit(0);
}
