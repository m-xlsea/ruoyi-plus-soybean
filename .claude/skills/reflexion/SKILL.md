---
name: reflexion
description: E 阶段自我反思 — 每个 Task Micro-review 之前
---
# Reflexion (自我反思)

## 触发时机
E 阶段每个 Task 实现完成后, Micro-review 之前。

## 反思清单
逐条自问:
1. 我有没有走捷径? (如: 用 `as any` 绕过类型检查, 空 catch 吞错误)
2. 我有没有忽略边界条件? (空输入/超长/并发/零值/null)
3. 我有没有硬编码本应配置的值? (URL/端口/阈值/路径)
4. 我有没有过度工程? (加了需求没要求的功能/抽象层)
5. 我有没有偏离 design.md 的方案? (擅自"优化"设计)
6. 这段代码 6 个月后我还能理解吗? (命名/结构/注释)

## 处理
- 发现问题 → **立即修复**, 不留 TODO
- 值得记录的模式 → 追加到 .ai_state/lessons.md
- 模式性错误 → 追加到 conventions.md "Agent 易犯错误"

## 与 Micro-review 的关系
Reflexion = "我审视自己" (主观, 面向实现质量)
Micro-review = "对标 spec + 标准" (客观, 面向需求合规)
两者互补, 不重叠。先 Reflexion 再 Micro-review。
