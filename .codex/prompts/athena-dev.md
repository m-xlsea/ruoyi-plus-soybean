# /athena-dev (Codex) — 主入口

`.ai_state/` 不存在 → 提示 `/athena-init` 并停。
`schema_version` != "9.6" → 提示 `/athena-migrate` 并停。

## Get-bearings (R₀, just-in-time, 铁律 8)

1. **必读**: `.ai_state/_index.md`
2. **按需**: stage=impl/review → 按 pointers.latest_progress 读 progress.md 尾部
3. **按需**: 任务命中 lessons 主题 → pointers.latest_lesson 跳段
4. **按需**: `git log --oneline -10`
5. **按需**: impl/review 阶段 → `bash .ai_state/init.sh`

文件大就用 head/tail/grep。**禁止 glob 整个 .ai_state/**。

## Dispatch

有进行中的 stage → 从当前阶段继续 (参考 `~/.codex/skills/pace/SKILL.md`)。
新需求 → 触发 pace skill 路由, 需求: $ARGUMENTS。

Codex 端特别注意:
- **无 /goal** → delivery-gate hook 兜底判定
- **无 /batch** → 多任务用 spawn_agent (config.toml [agents] 配置)
- **无 compact 生命周期** → 长任务点主动写 `.ai_state/_index.md` 保存
