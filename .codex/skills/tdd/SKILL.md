---
name: tdd
description: 测试驱动开发 — E 阶段, 先写测试后实现 (强制执行)
context: main
---
## 触发: E(执行) 阶段 (自动加载)

## 铁律: RED → GREEN → REFACTOR
**写功能代码前必须先有失败的测试。**
违反此规则时, 立即停止, 补写测试。

## 分级策略
- **Level 1** (Path A): 功能验证, 关键路径有测试即可
- **Level 2** (Path B): 单元+集成, 严格 RED→GREEN→REFACTOR
- **Level 3** (Path C+): + E2E, 覆盖率 >80%

## 强制流程 (Level 2+)
1. 读 plan.md 当前任务
2. 写失败测试 (RED) → 运行确认失败
3. 写最小实现 (GREEN) → 运行确认通过
4. 重构 (REFACTOR) → 测试保持绿色
5. 更新 doing.md (TODO→DOING→DONE)
6. git commit

## 测试命令自动检测
package.json scripts.test → npm test
pytest.ini/pyproject.toml → pytest
Cargo.toml → cargo test
go.mod → go test ./...
