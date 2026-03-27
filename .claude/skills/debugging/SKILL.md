---
name: debugging
description: 系统化调试 — 4阶段强制流程
---
# Systematic Debugging

遇到 bug 时**必须**按以下 4 阶段执行, 禁止跳步:

## 1. 复现 (Reproduce)
- 写一个**最小**可复现用例
- 记录: 输入、期望输出、实际输出
- 如果无法复现 → 停, 收集更多信息

## 2. 定位 (Locate)
- 从错误点向上追溯调用链
- 用 console.log / debugger / 断点缩小范围
- **不要猜**: 用证据定位, 不是直觉

## 3. 修复 (Fix)
- 只改**根因**, 不改症状
- 修复必须有对应测试覆盖
- 禁止: `as any`, `try {} catch {}` 空吞, `// TODO: fix later`

## 4. 验证 (Verify)
- 运行原始复现用例 → 通过
- 运行全量测试 → 无回归
- Reflexion: "这个 bug 的模式值得记录到 conventions.md 吗?"
