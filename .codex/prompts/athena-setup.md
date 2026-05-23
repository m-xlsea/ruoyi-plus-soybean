# /athena-setup (Codex)

参考: <https://developers.openai.com/codex/config-basic>

## Step 0: Codex 版本

```bash
codex --version
```

要求 ≥ v0.124 (hooks stable). v0.129+ 解锁 /hooks TUI menu.

写入 `_index.md.platform_features.cx_version`.

## Step 1: 验证 config.toml

`~/.codex/config.toml` 应包含 (从 cx/.codex/config.toml 拷贝):

- `model = "gpt-5.5"`
- `[features] hooks = true` (规范名, 非 deprecated codex_hooks)
- `[[hooks.SessionStart]]`, `[[hooks.PreToolUse]]`, `[[hooks.PostToolUse]]`, `[[hooks.Stop]]`
- `[agents] max_threads = 6`
- `[[skills.config]]` 包含 pace / compound / context7 / superpowers

```bash
codex check config 2>&1 | head -20
```

## Step 2: 部署 hooks

```bash
mkdir -p ~/.codex/hooks
cp cx/.codex/hooks/*.py ~/.codex/hooks/
chmod +x ~/.codex/hooks/*.py
```

Codex hook 列表 (Python, 6 个):
- session-start.py
- user-prompt-submit.py
- pre-bash-guard.py
- index-updater.py
- subagent-retry.py
- delivery-gate.py

⚠️ Codex hooks 当前 Windows 不支持 (官方限制, 参考 <https://developers.openai.com/codex/hooks>)

## Step 3: 部署 skills

```bash
mkdir -p ~/.codex/skills/pace ~/.codex/skills/compound
cp -r cx/.codex/skills/pace/* ~/.codex/skills/pace/
cp -r cx/.codex/skills/compound/* ~/.codex/skills/compound/
```

## Step 4: 部署 prompts (slash commands)

```bash
mkdir -p ~/.codex/prompts
cp cx/.codex/prompts/*.md ~/.codex/prompts/
```

## Step 5: 部署 subagents (单 TOML 文件, 非子目录)

参考: <https://developers.openai.com/codex/subagents>

```bash
mkdir -p ~/.codex/agents
cp cx/.codex/agents/*.toml ~/.codex/agents/
```

部署后:
- `~/.codex/agents/evaluator.toml` — 评分员 (read-only)
- `~/.codex/agents/generator.toml` — 实现者 (workspace-write)
- `~/.codex/agents/reviewer.toml` — 审查员 (read-only)

验证:
```bash
codex /agents 2>&1 | head -20
# 应列出 evaluator, generator, reviewer 三个 custom agent
```

## Step 6: 跨项目记忆 (推荐)

Codex 暂无 claude-mem 等价物。推荐:
- 用 `~/.codex/AGENTS.md` 全局 "## Tool Preferences" 段做轻量记忆
- 多项目用同一 ~/.codex/AGENTS.md (跨项目人工同步)

## Step 7: 验证

```bash
codex --version           # ≥ 0.124
ls ~/.codex/hooks/*.py | wc -l  # 应 = 6
ls ~/.codex/prompts/*.md  # 7 个 athena-* prompt
codex /hooks 2>&1 | head  # v0.129+ TUI 显示 hook 树
cat .ai_state/_index.md | head -5  # schema_version: "9.6"
```

通过 → "Codex 端 Athena 已就绪。"
