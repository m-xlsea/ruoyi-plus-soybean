---
name: athena-preferences
description: >
  Athena 全局偏好便利层。直接操作 CC 原生 ~/.claude/settings.json 的 permissions.allow/deny 和全局 CLAUDE.md。
effort: medium
disable-model-invocation: true
argument-hint: "<subcommand> <args>"
---

# /athena-preferences (v9.6)

## 设计原则

**Athena 不造私有偏好文件**。所有写入都是 CC 原生位置:

| 偏好类型 | 落点 |
|---|---|
| 全局 allow | `~/.claude/settings.json` `permissions.allow[]` |
| 全局 deny | `~/.claude/settings.json` `permissions.deny[]` |
| 工具偏好 (pnpm/vitest) | `~/.claude/CLAUDE.md` "## Tool Preferences" 段 |

参考: <https://code.claude.com/docs/en/settings> + <https://code.claude.com/docs/en/permissions>

**永远不写**:
- ❌ `~/.claude/memory/athena-*.list` 类私有文件
- ❌ 项目特定的命令到全局 (路径泛化检查)

**永远不自动写**:
- ❌ 不监控命令频次自动建议 (隐私决定)
- ✅ 仅在用户**显式调用**本 skill 时写

## 子命令

### `/athena:remember-allow <pattern>`

参数: 标准 CC permission pattern, 如 `Bash(pnpm test:*)`.

```javascript
const fs = require('fs');
const os = require('os');
const path = require('path');

const settingsPath = path.join(os.homedir(), '.claude/settings.json');
let s = {};
try { s = JSON.parse(fs.readFileSync(settingsPath,'utf8')); } catch(e) {}
s.permissions = s.permissions || {};
s.permissions.allow = s.permissions.allow || [];

const pattern = process.argv[2];

// 路径泛化检查: 拒绝含项目特定路径的 pattern
if (/\/Users\/|\/home\/[^*/]|C:\\Users\\/.test(pattern) || /[\w-]+\.(com|cn|net)\//.test(pattern)) {
  console.error('❌ 拒绝: pattern 含项目/用户特定路径, 不应写入全局');
  console.error('   如果只想本项目用, 写到 .claude/settings.local.json');
  process.exit(1);
}

if (s.permissions.allow.includes(pattern)) {
  console.log('✓ 已存在, 无需添加');
  process.exit(0);
}
s.permissions.allow.push(pattern);
fs.writeFileSync(settingsPath, JSON.stringify(s,null,2));
console.log(`✓ 已加入全局 allow: ${pattern}`);
console.log(`   位置: ${settingsPath}`);
```

### `/athena:remember-deny <pattern>`

同 `remember-allow`, 写入 `permissions.deny[]`. 但**不做路径泛化拒绝**——deny 越严格越好。

### `/athena:remember-tool <key>=<value>`

写入 `~/.claude/CLAUDE.md` 的 "## Tool Preferences" 段 (无则创建):

```
## Tool Preferences

- 包管理器: pnpm
- 测试运行器: vitest
- Linter: biome
- 默认提交者: --signoff
```

### `/athena:show-preferences`

```bash
echo "=== Global allow (~/.claude/settings.json) ==="
node -e 'console.log((JSON.parse(require("fs").readFileSync(require("os").homedir()+"/.claude/settings.json")).permissions?.allow || []).join("\n"))'

echo ""
echo "=== Global deny ==="
node -e 'console.log((JSON.parse(require("fs").readFileSync(require("os").homedir()+"/.claude/settings.json")).permissions?.deny || []).join("\n"))'

echo ""
echo "=== Tool preferences (~/.claude/CLAUDE.md) ==="
sed -n '/^## Tool Preferences/,/^## /p' ~/.claude/CLAUDE.md 2>/dev/null | head -20
```

### `/athena:forget <pattern>`

从全局 allow/deny 中删除指定 pattern. 显示删除前后 diff.

```javascript
const fs = require('fs');
const os = require('os');
const path = require('path');

const settingsPath = path.join(os.homedir(), '.claude/settings.json');
const s = JSON.parse(fs.readFileSync(settingsPath,'utf8'));
const pattern = process.argv[2];

const beforeA = s.permissions?.allow?.length || 0;
const beforeD = s.permissions?.deny?.length || 0;
if (s.permissions?.allow) s.permissions.allow = s.permissions.allow.filter(p => p !== pattern);
if (s.permissions?.deny) s.permissions.deny = s.permissions.deny.filter(p => p !== pattern);
const afterA = s.permissions?.allow?.length || 0;
const afterD = s.permissions?.deny?.length || 0;

fs.writeFileSync(settingsPath, JSON.stringify(s,null,2));
console.log(`allow: ${beforeA} → ${afterA}`);
console.log(`deny:  ${beforeD} → ${afterD}`);
```

## 安全约束

1. **不修改 managed-settings.json** (企业管理层)
2. **不修改项目 .claude/settings.json** (那是项目级, 用 settings.local.json 兜底)
3. **永远显示 diff** 在写入前——用户能看到改了什么
4. **永远说明落点** ("位置: ~/.claude/settings.json") 而不是含糊"已记住"

## Boundary

- ✅ 操作 `~/.claude/settings.json`
- ✅ 追加到 `~/.claude/CLAUDE.md` 末尾 "## Tool Preferences" 段
- ❌ 不读不写 `~/.claude/projects/` (那是 session memory, claude-mem 管)
- ❌ 不读不写 `~/.claude/memory/`
- ❌ 不创建 `~/.claude/athena-*.txt` 类文件
