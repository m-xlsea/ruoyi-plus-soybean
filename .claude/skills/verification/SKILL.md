---
name: verification
description: T 阶段验证 — 测试 + 覆盖率 + 验收标准
---
# Verification (T 阶段)

## 流程
1. 运行测试: `npm test` 或项目配置的测试命令
2. 覆盖率: 如有配置, 检查覆盖率阈值
3. TypeScript: `npx tsc --noEmit` (如有 tsconfig.json)
4. Lint: `npx eslint . --max-warnings 0` (如有 eslint 配置, Path C+ 强制)

## 验收标准逐条确认 (v9.2.0 新增)
5. 读 .ai_state/design.md 的 "## 验收标准"
6. 逐条确认: 这个标准是否被满足? 证据是什么 (测试名/文件位置)?
7. 未满足的标准 → 标注到 .ai_state/quality.md "## 未满足验收标准"
8. 如果有 E2E 框架 → 运行 E2E 确认用户流程

## 产出
- .ai_state/quality.md 填入验证结果 + 未满足标准
