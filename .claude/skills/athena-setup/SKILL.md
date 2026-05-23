---
name: athena-setup
description: >
  Athena 全局安装。检查 CC 版本、装插件、配置 Codex、部署 hooks、推 claude-mem。首次使用运行一次。
effort: xhigh
disable-model-invocation: true
---

# /athena-setup (v9.6)

## 设计哲学 (启动时告诉用户)

```
v9.6 原则:
- permissions.deny 仅保留 "Bash(rm -rf *)" + 机密文件 (sandbox 是正道)
  参考: https://claude.com/blog/beyond-permission-prompts-making-claude-code-more-secure-and-autonomous
- 全局 lessons 已删, 跨项目记忆推 claude-mem (默认装)
- /goal /batch /background CC 原生, 不再造状态机驱动器
- 不维护插件推荐列表, 实时查 marketplace
```

## Step 0: CC 版本检查

参考: <https://code.claude.com/docs/en/changelog>

```bash
claude --version
```

要求 ≥ v2.1.121 (worktree isolation + updatedToolOutput 全工具). v2.1.139+ 解锁 /goal /background.
低于 → `claude update` 或 `npm install -g @anthropic-ai/claude-code@latest`.

把检测到的版本写入 `.ai_state/_index.md.platform_features.cc_version`. 解析后置 goal_supported/batch_supported/background_supported.

## Step 1: 插件安装 (按 PACE 节点 best-fit, 非强依赖)

每装一个问自己: "这个真的会用吗?" 多余 = context 浪费。

### 工程主线 (强烈推荐)

```
/plugin marketplace add obra/superpowers-marketplace
/plugin install superpowers@superpowers-marketplace

/plugin marketplace add openai/codex-plugin-cc
/plugin install codex@openai-codex
```

### 跨项目记忆 (v9.6 默认推 claude-mem)

claude-mem 89k stars, Apache-2.0, 自动捕获 tool use + 压缩摘要 + 注入下次 session.
参考: <https://github.com/thedotmack/claude-mem>

```
# 检测是否已装
if /plugin list | grep -iq claude-mem; then
  echo "claude-mem ✓ 已装"
else
  echo "推荐安装 claude-mem (跨 session 记忆):"
  echo "  /plugin marketplace add <claude-mem 所在 marketplace>"
  echo "  /plugin install claude-mem"
  echo "  (如不在 marketplace, 从 github.com/thedotmack/claude-mem 下载)"
fi
```

未装也行——Athena 仍可用, `_index.md.platform_features.cross_session_memory` 标 "none".

### PACE 节点 best-fit (按需, 实时查 marketplace)

athena-setup **不写死推荐列表**, 改用 `/plugin browse` + 关键词查询:

| 路径 | 关键词 (用 /plugin browse 查) |
|------|------------------------------|
| Bugfix | debugger / bug-fix / metronome |
| Feature 实现 | superpowers / dev-workflows / context7 |
| Feature 审查 | codex-plugin-cc / agent-peer-review / local-review |
| Refactor | TypeScript LSP / Rust LSP / ast-grep |
| Refactor 审查 | codex-plugin-cc / AgentLint |
| System | shipyard (IaC) / mcp-builder |
| 跨节点 | context-mode (大输出 sandbox 化) |

### 官方插件 (claude-plugins-official, 已在 settings.json 启用)

```
/plugin install feature-dev
/plugin install code-review
/plugin install commit-commands
```

`/reload-plugins` 后生效.

## Step 2: context7 (skill 模式)

```bash
npx ctx7 setup --claude
```

无需全局装 ctx7 CLI, npx 按需拉. OAuth 登录后 `~/.claude/skills/` 自动生成 context7 skill.
触发方式: "use context7" 或 "use context7 with /owner/repo for <query>".

## Step 3: Codex 配置

```
/codex:setup
```

未登录 → `!codex login`.

**不要启用 review gate** (`/codex:setup --enable-review-gate`) — 会 Claude ↔ Codex 死循环.

settings.json codex 权限 (已在 v9.6 默认 settings 含):

```json
"Bash(codex:*)",
"Bash(node:*)"
```

Codex 独立配置 `~/.codex/config.toml` (见本仓库 cx/.codex/config.toml).

## Step 4: Hooks 安装

```bash
mkdir -p ~/.claude/hooks
cp .claude/hooks/*.cjs ~/.claude/hooks/
chmod +x ~/.claude/hooks/*.cjs
```

v9.6 hook 列表 (8 个):
- session-start · pre-bash-guard · index-updater · subagent-retry
- delivery-gate · pace-continuator
- permission-retry · compact-snapshot · compact-restore · state-audit

## Step 5: 验证

```bash
claude --version                         # ≥ 2.1.121, 最佳 ≥ 2.1.139
/plugin list                             # superpowers / codex / claude-mem (推荐)
npx ctx7 library express                 # context7 CLI 通
/codex:setup                             # Codex ready
ls ~/.claude/hooks/*.cjs | wc -l         # 应 = 10
cat .ai_state/_index.md | head -5        # 含 schema_version: "9.6"
```

通过 → "安装完成。每个新项目 `/athena-init`, 然后 `/athena-dev`."

## 为什么这样设计 (用户视角)

| v9.5 有 | v9.6 变化原因 |
|---|---|
| 18 → 0 条 deny | sandbox 是正道, 但 v9.6 再加回 "Bash(rm -rf *)" 兜底 |
| 全局 lessons 系统 | 删, 委外给 claude-mem (89k stars) |
| 手写 spawn_agent 协议 | 部分场景接入 /batch (CC v2.1.121+ 原生) |
| delivery-gate 自造 VERDICT 解析 | 接入 /goal evaluator (v2.1.139+), 旧版本兜底 |
| 写死的插件推荐列表 | 改为 /plugin browse 实时查 |
