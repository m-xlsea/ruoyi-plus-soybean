---
name: code-review
description: T 阶段代码审查 — 含 LLM-as-Judge 模式
---
# Code Review (T 阶段)

## 审查清单
1. **Spec 合规**: 每个 MUST 需求是否实现? (对照 design.md)
2. **TDD**: 每个源码文件有对应测试?
3. **边界**: 空输入/超长/并发/错误路径 是否处理?
4. **安全**: 无硬编码密钥, 无 SQL 注入, 输入已验证
5. **可读**: 函数 < 50 行, 注释说明 WHY 不是 WHAT, 严格类型
6. **简洁**: 无过度工程, 无重复代码, 无空 catch

## LLM-as-Judge 模式 (delivery-gate 触发)
输出格式:
```json
{"level": "PASS|CONCERNS|REWORK|FAIL", "issues": [...], "summary": "..."}
```
- FAIL: 未完成任务 / 硬编码密钥 / 缺 quality.md
- REWORK: 源码无测试 (TDD 违规)
- CONCERNS: 非关键文件无测试 (1-2 个警告)
- PASS: 全部通过
