---
name: e2e-testing
description: 端到端测试 — Path C/D 的 T 阶段
context: main
---
## 触发: Path C/D 的 T(测试) 阶段

## 步骤
1. 检查 Playwright 配置 (playwright.config.ts)
2. 调用 e2e-runner 子代理执行测试
3. 收集结果: 通过率 + 失败详情 + 截图
4. 失败 → 反馈给 builder 修复 → 重测
5. 全部通过 → cunzhi [TESTS_PASSED]

## 降级
Playwright 不可用 → 手动功能验证 + 用户确认
