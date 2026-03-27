---
name: verification
description: T 阶段验证
---
# Verification

## 流程
1. 运行测试 + 覆盖率
2. TypeScript 类型检查 (如有)
3. Lint (如有, Path C+ 强制)

## 验收标准逐条确认
4. 读 design.md "## 验收标准"
5. 逐条确认: 满足? 证据?
6. 未满足 → quality.md "## 未满足验收标准"
7. E2E (如有框架)
