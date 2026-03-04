---
name: e2e-testing
description: Playwright E2E 测试 — T 阶段 (Path C+)
context: main
---

## 触发
Path C+ 的 T 阶段, 且项目有前端或 API 端点。

## 流程

1. 检查 playwright 是否安装, 未安装则 `npm install -D @playwright/test`
2. 从 plan.md 提取关键用户流
3. 编写或更新 E2E 测试
4. `npx playwright test` 执行
5. 失败 → 截图保存 → 修复 → 重跑 (最多 3 轮)
6. 结果写入 verified.md

## 降级
无 Playwright → 用 curl/fetch 做 API 冒烟测试。
纯 CLI 工具 → 跳过 E2E, 只跑单测。
