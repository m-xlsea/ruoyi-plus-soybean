---
name: code-quality
description: 代码审查编排 — T/V 阶段
context: main
---

## 工具编排

| 工具 | 类型 | 触发 | 调用方式 |
|:---|:---|:---|:---|
| code-review | Plugin | T 阶段自动 | 自然语言: "审查以上变更" |
| security-guidance | Plugin | Path C+ | 自然语言: "检查安全问题" |
| pr-review-toolkit | Plugin | V 阶段 PR 时 | 自然语言: "准备 PR 审查" |
| superpowers review | Plugin Skill | T 阶段 | 自动触发 |

## 审查维度
不重复 Superpowers 方法论。只补充 VibeCoding 特有规则:
- design.md 中的决策是否被正确实现
- conventions.md 中的约定是否被遵守
- .knowledge/pitfalls.md 中的陷阱是否被规避
