---
name: e2e
description: 端到端测试 — Path C+ 或有 E2E 框架时
---
# E2E Testing

## 前置条件
- 项目有 E2E 框架 (Playwright/Cypress/Selenium)
- Path C+ 或用户显式要求

## 流程
1. 基于 design.md 验收标准编写 E2E 用例
2. 运行 E2E: `npx playwright test` 或项目配置的命令
3. 失败 → 定位是测试问题还是实现问题
4. 结果追加到 quality.md

## 如果没有 E2E 框架
- 手动验证清单: 列出关键用户流程 + 验证步骤
