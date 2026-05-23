# /goal Condition 模板库

每个 PACE stage 对应一个 condition 模板, 用 `/goal <condition>` 启动 autonomous loop。

参考: <https://code.claude.com/docs/en/goal>

## 写 condition 的四件套 (官方推荐)

```
End Goal + Verification + Constraints + Turn/Time Limit
```

- **End Goal**: 一个可测的终态 (test 通过 / 文件存在 / git log 含 commit)
- **Verification**: 如何证明 (npm test exits 0 / rg "X" 0 行)
- **Constraints**: 边界 (不动 X 文件 / 不引入新依赖)
- **Turn/Time Limit**: stop after 20 turns / stop after 60 minutes

---

## Feature/Refactor/System stage=plan

```
ALL of:
  - .ai_state/details/design.md 含 "## File Structure Plan" 段且段下至少 3 个 owner 行
  - .ai_state/details/tasks-current.md 至少 1 个 - [ ] Task
  - 我已经 ask 用户确认且收到了 "yes" 或 "go" 回复
Constraints:
  - 不修改 design.md 之外的源码文件
  - 不超过 20 turns
```

## Quick/Feature stage=impl

```
ALL of:
  - .ai_state/details/tasks-current.md 中所有 - [ ] 都变成 - [x]
  - 运行 <test_cmd> 退出码 0 (从 _index.md.test_cmd 读)
  - .ai_state/details/progress.md 在本 turn 序列至少新增 N 行 (N = 原待办 task 数)
  - 没有任何对 design.md 的修改
Constraints:
  - 不动 .ai_state/_index.md 以外的元数据
  - 不超过 30 turns 或 90 分钟
```

## Refactor stage=impl (用 /batch)

```
ALL of:
  - tasks-current.md 全部 - [x]
  - 每个 worktree 的 lint_cmd 退出 0
  - 每个 worktree 的 test_cmd 退出 0
  - 主分支 git diff 显示预期的批量变更模式
Constraints:
  - 不引入新依赖
  - 不超过 60 minutes 或 50 turns
```

## System stage=design

```
ALL of:
  - details/design.md 含 "## File Structure Plan" 且段下覆盖所有新增/修改的模块路径
  - details/design.md 含 "## 验收标准" 段且至少 5 条 - [ ] (会在 impl 阶段勾选)
  - details/tasks-current.md 至少 N 个 Task (N = design 模块数), 每个含 Boundary 和 Depends 注释
  - 我已经 ask 用户对设计的最终确认
Constraints:
  - 不超过 25 turns
```

## stage=review (Feature+)

```
ALL of:
  - .ai_state/details/reviews/sprint-{sprint}.md 已存在且含 "VERDICT:" 行
  - VERDICT 取值为 PASS / CONCERNS / REWORK / FAIL 之一
  - 报告含至少一段 /codex:review 或 reviewer subagent 的真实输出 (codex job ID 或 thread ID)
  - 报告含 test_cmd 实际输出
Constraints:
  - 评分必须基于代码行号级证据
  - 不超过 40 turns
```

## stage=ship

```
ALL of:
  - details/lessons.md 末尾含 "## [{date} Sprint {sprint}]" 标题
  - git log --oneline -1 显示本 sprint 的提交
  - _index.md.project.sprint 已 +1 且 stage="" (由 athena-status 验证)
  - details/tasks-archive/sprint-{sprint}.md 存在 (归档)
Constraints:
  - 不超过 10 turns
```

---

## 启动方式

### 交互式
```
/goal <粘贴上面对应 stage 的 condition>
```

### 非交互式 (overnight 跑)
```bash
claude -p "/goal <condition>"
```

### 状态查询
```
/goal            # 不带参数, 看 turns/tokens/最近 evaluator reason
/goal clear      # 中止
```

## 注意事项 (官方文档)

- evaluator 只读 transcript, 不跑命令——condition 必须是"transcript 能证明的事"
- 一个 session 只能有一个 active goal, 设置新 goal 替换旧的
- condition ≤ 4000 字符
- v2.1.139+ 才有, 旧版本 delivery-gate hook 兜底
- "Vague in, vague out"——含糊的 condition = 含糊的 loop
