---
name: knowledge
description: 经验管理 — V 阶段沉淀, R 阶段读取
context: main
---

## .knowledge/ 目录

| 文件 | 内容 | 写入时机 | 读取时机 |
|:---|:---|:---|:---|
| patterns.md | 成功的解决模式 | V 阶段 | R₀b 阶段 |
| pitfalls.md | 踩过的坑和规避方法 | V 阶段 / 出错时 | R₀b/R 阶段 |
| decisions.md | 架构决策记录 (ADR) | D 阶段 | R 阶段 |
| tools.md | 工具使用经验和配置 | 任何时候 | R 阶段 |

## 写入格式

```markdown
## [日期] [标题]

**场景**: 什么情况下遇到的
**方案**: 怎么解决的
**效果**: 结果如何
```

## 规则
- V 阶段结束前, 至少更新一个 .knowledge/ 文件
- 出错重试超过 2 次, 立即写入 pitfalls.md
- ADR 记录不可删除, 只追加
