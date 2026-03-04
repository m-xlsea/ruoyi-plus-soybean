---
name: verification
description: 分级验证清单 — T 阶段
context: main
---

## 分级清单

### Path A (最小验证)
- [ ] 修改的功能可正常运行
- [ ] lint 无新增错误

### Path B (标准验证)
- [ ] Path A 全部
- [ ] 单测通过 (`npm test` 或等效)
- [ ] 类型检查通过 (`tsc --noEmit` 或等效)
- [ ] plan.md 中所有任务标记 DONE

### Path C+ (完整验证)
- [ ] Path B 全部
- [ ] E2E 测试通过 (skills/e2e-testing)
- [ ] 安全审查通过 (skills/security-review)
- [ ] 无硬编码密钥/Token
- [ ] 性能无明显退化

## 输出
`.ai_state/verified.md` — 记录验证结果。

## 注意
Path A 不检查 plan.md (因为 Path A 没有 P 阶段)。
