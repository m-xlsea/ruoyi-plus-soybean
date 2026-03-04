---
name: cunzhi
description: 寸止检查点协议 — 全阶段
context: main
---

## 检查点清单

| 检查点 | 阶段 | Path | 含义 |
|:---|:---|:---|:---|
| [DESIGN_DIRECTION] | R₀b | B+ | 用户选择技术方向 |
| [DESIGN_READY] | D | B+ | 设计方案确认 |
| [PLAN_CONFIRMED] | P | B+ | 执行计划确认 |
| [MILESTONE_CHECK] | E | C+ | 阶段性里程碑确认 (每 3-5 任务) |
| [SECURITY_PASSED] | T | C+ | 安全审查通过 |
| [DELIVERY_CONFIRMED] | V | ALL | 最终交付确认 |

## 调用方式

```
优先: cunzhi MCP → 弹出确认界面, AI 真正暂停等待
降级: 对话确认 → 直接问用户, 等回复再继续
```

不可跳过确认本身。如果 cunzhi MCP 不可用, 必须用对话方式等待用户回复。

## 规则
- Path A 只需 [DELIVERY_CONFIRMED]
- Path B 需要 [DESIGN_DIRECTION] + [DESIGN_READY] + [PLAN_CONFIRMED] + [DELIVERY_CONFIRMED]
- Path C+ 需要全部检查点
