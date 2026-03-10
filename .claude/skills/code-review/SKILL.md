---
name: code-review
description: 代码审查 — T 阶段辅助
context: main
---
## 触发: T 阶段, verification 之后

## 审查维度
1. 逻辑正确性: 边界条件、错误处理、并发安全
2. 可读性: 命名清晰、函数职责单一、注释合理
3. 性能: 无 N+1 查询、无不必要的循环
4. 安全: 无注入、无硬编码密钥
5. 测试: 测试有意义, 不只是刷覆盖率
6. 优雅: "如果重新实现, 我会这样写吗?"

## 输出格式
每个问题: 文件+行号 / MUST-FIX|SHOULD-FIX|NIT / 问题描述 / 修复建议
无问题: "APPROVED — no issues found"
