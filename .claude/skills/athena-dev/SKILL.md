---
name: athena-dev
description: >
  Athena 主入口。从需求到交付的完整工程化开发流程。
effort: xhigh
disable-model-invocation: true
argument-hint: "<需求描述>"
---

# /athena-dev

`.ai_state/` 不存在 → 提示 `/athena-init` 并停。
`.ai_state/_index.md.schema_version` != "9.6" → 提示 `/athena-migrate` 并停。

## Get-bearings (R₀, just-in-time, 铁律 8)

1. **必读**: `.ai_state/_index.md` (单一入口)
2. **按需**: stage=impl/review → 按 pointers.latest_progress 读 progress.md 尾部
3. **按需**: 任务命中 lessons 主题 → pointers.latest_lesson 跳段
4. **按需**: `git log --oneline -10`
5. **按需**: impl/review 阶段 → `bash .ai_state/init.sh`

文件大就用 head/tail/grep。**禁止 glob 整个 .ai_state/** (铁律 8)。

## Dispatch

有进行中的 stage → 从当前阶段继续 (触发 pace skill)。
新需求 → 触发 pace skill 路由, 需求: $ARGUMENTS。

首次使用简短说明: "PACE 帮你路由——小事直接做, 大事加设计和审查。CC 原生 /goal /batch /background 已接入。"
