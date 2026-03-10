---
name: tdd
description: 测试驱动开发 — E 阶段, 先写测试后实现 (强制执行)
context: main
---
## 触发: E(执行) 阶段 (自动加载)

## 铁律: RED → GREEN → REFACTOR
**写功能代码前必须先有失败的测试。PostToolUse hook 会检查。**

## 分级策略
- **Level 1** (Path A): 功能验证, 关键路径有测试即可
- **Level 2** (Path B): 单元+集成, 严格 RED→GREEN→REFACTOR
- **Level 3** (Path C+): + E2E, 覆盖率 >80%

## 强制流程 (Level 2+)
1. 读 plan.md 当前任务
2. 写失败测试 (RED) — **必须先看到测试失败**
3. 写最小实现通过测试 (GREEN) — **只写刚好让测试通过的代码**
4. 重构 (REFACTOR) — 改善结构, 测试保持绿色
5. 更新 doing.md 看板 (TODO→DOING→DONE)
6. git commit

## 违规处理
如果写了源代码但没有对应测试:
- PostToolUse prompt hook 会提醒
- 必须补写测试后才能继续

## 测试命令自动检测
package.json scripts.test → npm test
pytest.ini/pyproject.toml → pytest
Cargo.toml → cargo test
go.mod → go test ./...
