---
name: code-review
description: T 阶段代码审查
---
# Code Review

## 审查清单
1. Spec 合规: 每个 MUST 实现?
2. TDD: 源码有对应测试?
3. 边界: 空输入/超长/并发/错误路径?
4. 安全: 无硬编码密钥, 输入已验证
5. 可读: 函数 < 50 行, 注释说 WHY, 严格类型
6. 简洁: 无过度工程, 无重复, 无空 catch

## LLM-as-Judge 输出格式
```json
{"level": "PASS|CONCERNS|REWORK|FAIL", "issues": [...], "summary": "..."}
```
