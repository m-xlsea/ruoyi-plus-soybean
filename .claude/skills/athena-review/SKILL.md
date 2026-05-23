---
name: athena-review
description: >
  单独运行质量审查, 不走完整开发流程。
effort: xhigh
disable-model-invocation: true
argument-hint: "[focus area]"
---

# /athena-review

有 `.ai_state/_index.md` → 按当前 Path 深度触发 pace skill 审查阶段。
无 → 快速审查: `/review`。

焦点: $ARGUMENTS
