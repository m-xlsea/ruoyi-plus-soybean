# /athena-preferences (Codex)

## 设计原则 (同 CC 版)

Athena 不造私有偏好文件。所有写入都是 Codex 原生位置:

| 偏好类型 | Codex 落点 |
|---|---|
| 工具偏好 (pnpm/vitest) | `~/.codex/AGENTS.md` "## Tool Preferences" 段 |
| 风格偏好 (Linus 模式等) | `~/.codex/AGENTS.md` |

**Codex 没有 CC 风格的 permissions.allow/deny.** Codex 用:
- `approval_policy` (on-request / never / on-failure / untrusted) — 顶层
- `sandbox_mode` (workspace-write / read-only / danger-full-access)
- `[shell_environment_policy]` 控制环境

参考: <https://developers.openai.com/codex/config-reference>

所以 `/athena:remember-allow|deny` 在 Codex 上**部分语义不可映射**, 当前实现:
- `/athena:remember-tool <key>=<value>` → 写 `~/.codex/AGENTS.md` "## Tool Preferences"
- `/athena:show-preferences` → cat ~/.codex/AGENTS.md
- `/athena:remember-allow|deny` → 提示用户在 `~/.codex/config.toml` 改 `approval_policy` 或 `sandbox_mode`, **不自动改** (那是 critical 配置)

## 子命令 (Codex)

### `/athena:remember-tool <key>=<value>`

```bash
GLOBAL_AGENTS_MD="$HOME/.codex/AGENTS.md"
mkdir -p "$(dirname "$GLOBAL_AGENTS_MD")"

# 创建文件 / 找到 Tool Preferences 段 / 追加
python3 << PY
import os, re
p = os.path.expanduser("~/.codex/AGENTS.md")
try:
    content = open(p).read()
except FileNotFoundError:
    content = ""

section = "## Tool Preferences"
arg = "$ARGUMENTS"  # 由 Codex 替换

if section not in content:
    if content and not content.endswith("\n"):
        content += "\n"
    content += "\n" + section + "\n\n- " + arg + "\n"
else:
    # 在 section 后追加一行 (避免重复)
    if "- " + arg in content:
        print(f"⚠️ 已存在: {arg}")
        exit(0)
    content = re.sub(r"(" + re.escape(section) + r"\n+)", r"\g<1>- " + arg + "\n", content, count=1)

open(p, "w").write(content)
print(f"✓ 已加入 ~/.codex/AGENTS.md Tool Preferences: {arg}")
PY
```

### `/athena:show-preferences`

```bash
echo "=== ~/.codex/AGENTS.md (Tool Preferences) ==="
sed -n '/^## Tool Preferences/,/^## /p' ~/.codex/AGENTS.md 2>/dev/null | head -30

echo ""
echo "=== ~/.codex/config.toml (approvals / sandbox) ==="
grep -E "^(approval_policy|sandbox_mode)" ~/.codex/config.toml 2>/dev/null
```

### `/athena:remember-allow|deny <pattern>`

不自动写, 仅提示:
```
⚠️ Codex 没有 permissions.allow/deny 概念.
   等价配置在 ~/.codex/config.toml:
   - approval_policy: on-request | never | on-failure | untrusted
   - sandbox_mode: read-only | workspace-write | danger-full-access
   请用编辑器手改这两个字段, 不通过 Athena 自动改 (critical config).
```
