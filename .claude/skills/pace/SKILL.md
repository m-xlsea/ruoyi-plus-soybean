---
name: pace
description: >
  工作流路由器。收到开发任务时触发。按任务复杂度路由到 6 条路径, 编排 CC 工具 + 增强节点。
effort: xhigh
---

# PACE — 6 路径路由器 (v9.6 Athena)

首先读 `.ai_state/_index.md` (铁律 8 索引先行)。有 stage → 从当前阶段继续。
.ai_state/ 不存在 → 提示 `/athena-init`。

## 路由

```
          ┌─ 1行/配置 ──────→ Hotfix
 修复 ────┤
          └─ 需要调试 ─────→ Bugfix

          ┌─ 需求清晰/小 ──→ Quick
 新建 ────┤ 需要设计 ─────→ Feature
          ├─ 改现有结构 ───→ Refactor
          └─ 跨模块/服务 ──→ System
```

| Path     | 文件量 | CC 主力                | 增强                                    | 写 _index.md |
| -------- | ------ | ---------------------- | --------------------------------------- | ------------ |
| Hotfix   | 1      | Edit                   | 无                                      | 否           |
| Bugfix   | 1-5    | /debug                 | 无                                      | 否           |
| Quick    | 1-10   | TDD                    | 可选交叉审查                            | 是           |
| Feature  | 5-20   | /feature-dev           | brainstorming + 交叉审查                | 是           |
| Refactor | 10-50  | /batch                 | superpowers + 交叉审查                  | 是           |
| System   | 20+    | /batch + /feature-dev  | 全增强                                  | 是           |

Quick+ 路由完成 → 更新 `_index.md` (path, stage, sprint) → 告知用户。

---

## CC 原生自动化接入 (v9.6 新)

v9.5 的"自动 PACE"借助 CC 原生 `/goal /batch /loop /background` 实现, **不再发明状态机驱动器**。

### `/goal` — 每 stage 一个 condition (autonomous loop)

参考: <https://code.claude.com/docs/en/goal>

每个 PACE stage 配套一个 condition 模板, 见 `templates/details/goal-conditions.md`:

- **plan**: `design.md 含 File Structure Plan + tasks-current.md ≥ 1 Task + 用户回过 confirm`
- **impl**: `tasks-current.md 所有 [ ] 变 [x] + <test_cmd> exits 0 + progress.md 每 task 一行`
- **review**: `reviews/sprint-N.md 含 VERDICT 字段 + /codex:review 或 reviewer 已跑`
- **ship**: `lessons.md 含 Sprint N 条目 + git push 完成 + _index.md sprint+=1`

启动方式: `/goal <condition>` (CC v2.1.139+) 或 `claude -p "/goal <condition>"` (非交互).

**降级**: CC < v2.1.139 时无 /goal, 由 delivery-gate hook 兜底判定 VERDICT.

### `/batch` — Refactor/System 并行实现

参考: CC v2.1.121+, `/batch` 自动 5-30 worktree subagent + PR.

适用场景: 大量同模式 task (重命名 / import 路径迁移 / 接口签名变更).

**降级**: 旧版本 → spawn_agent 手动 worktree.

### `/background` + `claude agents` 多会话编排

参考: CC v2.1.139+, agent view 看 Running / Blocked / Done 状态.

适用: System 阶段长跑 / 跨任务监控.

---

## 跨平台路由建议 (Codex Terminal-Bench SOTA)

某些任务在 Codex 上更优:

| 信号 | 建议 |
|------|------|
| 终端命令为主 (build/test/grep/sed) | Codex Terminal-Bench 2.0 SOTA 82.7% (GPT-5.5, April 2026), 委派 Codex |
| 大量重复改写 (100 个文件相同 import 路径) | Codex token 0.25-0.33×, 更经济 |
| 需要多 reviewer 互相 critique | CC 主跑 + /codex:adversarial-review 二审 |
| 设计/架构判断 | CC Opus 4.7 略强, 主跑 CC + Codex review |

不强制——是建议。

---

## 路径升级机制 (impl 阶段持续监测)

写代码过程中发现实际复杂度超出当前路径 → 暂停询问用户升级:

| 升级触发信号 | 当前 → 建议 |
|------------|-----------|
| 需要改数据库 schema | * → System |
| 跨 3+ 模块的接口变更 | Feature → System |
| 实际改文件数 > 当前路径上限的 50% | Quick → Feature, Feature → Refactor/System |
| Refactor 中发现需要新增模块 | Refactor → System |

升级流程: 用户确认 → _index.md path 升级 + stage 回到 design (System) 或 plan → progress.md 追加升级记录 → 重新 plan。
**不自动升级**, 避免 Athena 借机扩 scope。

---

## 共享协议

### 审查协议 (Quick/Feature/Refactor/System 的 review 阶段共用)

```
1. /review → 第一份审查 (CC 原生)
2. [Feature+] /codex:review [--base main] [--wait] → 跨模型审查
   → 必须看到真实 codex job ID 或命令输出 (铁律 6)
   → 调用失败 → 失败处理协议三轮 → 真失败则降级 + review-report.md 注明 "codex unavailable + stderr"
3. [System] 追加 /codex:adversarial-review + ECC AgentShield
4. [System UI 类] superpowers /qa + playwright E2E
5. /simplify
6. @evaluator → VERDICT
   PASS → 触发 /compound → details/lessons.md 追加 → 停一轮让用户确认 → stage=ship
   CONCERNS → 修复 → 重新评分
   REWORK → stage=impl (Feature/Refactor) 或 stage=design (System)
   FAIL → stage=plan
```

### 发布协议 (ship 阶段共用)

```
1. [Quick] git commit → 直接提交
2. [Feature+] superpowers /ship → 同步 main, 跑测试, 开 PR
3. [System] superpowers /retro → 工程回顾
4. details/lessons.md (compound 已追加) + progress.md 最终更新
5. _index.md: stage="", sprint+=1
6. /compact "Sprint N 完成"
```

---

## 失败处理协议 (落地铁律 6 完成度证据)

工具调用失败 (任意 Bash/Skill/Task):

```
Round 1: 读 stderr 和 exit code 分类:
  - permission denied → 报具体规则, **继续尝试**:
    a) 用 settings.local.json 临时绕过 (告知用户)
    b) 换等价命令 (node 改 npx)
    c) 拆到主 agent
  - command not found → 装包 / 换工具
  - subagent 报"无能力" → 实测一次 (echo 探测), 真不可用主 agent 接管

Round 2: 改参数 / 换路径 / 换工具

Round 3: 仍失败 → 报告每次的:
  - 完整命令
  - 完整 stderr
  - exit code
  - 已尝试的修复方式
  → 写入 review-report.md / progress.md 作为完成度证据
```

**绝对禁止**: "请你用 ! 前缀手动执行" 作为第一次响应。

**subagent 输出预算 ≤ 2000 tokens** (Anthropic 多 agent research 经验): 深入探索可以, 只回传关键发现。

---

## Hotfix — 无仪式

```
Edit → test_cmd (有就跑) → git commit → 完
```

## Bugfix — /debug + TDD (无 stage)

```
/debug → 定位根因
TDD: 写回归测试(复现) → 修复 → 测试通过
lint_cmd → /review → git commit
自愈: 修不好 → /debug 再来 (限 3 轮) → 3 轮后通知用户
```

## Quick

stages: impl → review → ship

```
stage=impl:
  Explore: 读要改的文件 + 调用方
  TDD 实现 (superpowers brainstorming 自动激活)
  库文档不确定 → use context7
  每完成 Task → tasks-current.md 勾选 + progress.md 追加一行 + index-updater 自动更 _index.md counts
  路径升级监测
  lint_cmd + test_cmd → /simplify → stage=review

stage=review: → 审查协议
stage=ship: → 发布协议
```

## Feature — /feature-dev + 增强

stages: plan → impl → review → ship

```
stage=plan:
  R₀: 命中主题再读 details/lessons.md (just-in-time, 不预加载)
  superpowers brainstorming → 发散 + 方向挑战
  → 合成 design.md (含 File Structure Plan 段)
  用户确认 → tasks-current.md (Boundary/Depends 标注) → stage=impl
  可选: /goal "tasks-current.md 全 [x] + npm test exits 0"

stage=impl:
  /feature-dev "需求描述"
  Phase 4 (架构) 前 → 用户确认
  每完成 Task → tasks-current.md 勾选 + progress.md 追加
  设计偏离 → 先改 design.md 再继续 (铁律 5)
  库文档不确定 → use context7
  路径升级监测 → 触发即停
  /simplify → stage=review

stage=review: → 审查协议
stage=ship: → 发布协议
```

## Refactor — /batch + 增强

stages: plan → impl → review → ship

```
stage=plan:
  R₀: 按需 read details/lessons.md
  superpowers /plan-eng-review → 验证重构方案
  用户确认 → design.md (含 before/after 边界) + tasks-current.md → stage=impl

stage=impl:
  /batch "重构描述"  ← CC v2.1.121+ 原生
  CC 自动: Research → Plan → 用户确认 → 并行 worktree → 每 worker /simplify + 测试
  每完成一组 Task → tasks-current.md 勾选 + progress.md 追加
  路径升级: 发现需要新增模块 → 升 System
  → stage=review
```

## System — 全链

stages: plan → design → impl → review → ship

```
stage=plan:
  R₀: 按需 read details/lessons.md
  superpowers /office-hours → 需求提取
  superpowers brainstorming → 发散 + 方向挑战
  → 合成 design.md → 用户确认 → stage=design

stage=design:
  superpowers /plan-eng-review → 架构锁定
  superpowers /plan-design-review → 设计审查 (有 UI 时)
  design.md 必含 File Structure Plan → tasks 据此拆
  → 合成 tasks-current.md → 用户确认 → stage=impl

stage=impl:
  按 Task 性质选工具:
    批量同模式 → /batch 并行 (CC 原生)
    复杂独立 → /feature-dev
    跨模型委托 → /codex:rescue "<prompt 内容>"
  每完成 Task → tasks-current.md 勾选 + progress.md 追加
  全部完成 → /simplify → stage=review

stage=review: → 审查协议 (含 adversarial + ECC + /qa + E2E)
stage=ship: → 发布协议 (含 /retro)
```

---

## 状态管理 (铁律 5/8 文档即真相 + 索引先行)

`.ai_state/_index.md` frontmatter 字段: path, stage, sprint, active_goal, tech_stack, test_cmd, build_cmd, lint_cmd, dev_cmd, conventions, gotchas, counts, pointers, fingerprints, platform_features

合法 path: Quick, Feature, Refactor, System (Hotfix/Bugfix 不写 _index)
合法 stage: plan, design (System only), impl, review, ship, ""

**`.ai_state/` 文档职责 (just-in-time)**:
- 写端:
  - `_index.md` ← athena-init + 路由 + index-updater hook (PostToolUse)
  - `details/tasks-current.md` ← plan + impl 勾选
  - `details/tasks-archive/sprint-N.md` ← ship 时归档
  - `details/progress.md` ← impl 每 Task 追加 (append-only)
  - `details/design.md` ← plan + impl 偏离时更新
  - `details/handoff.md` ← 跨模型/跨 worker 临时
  - `details/lessons.md` ← compound skill 写 (append-only)
  - `details/reviews/sprint-N.md` ← V 阶段写
  - `details/next.md` ← pace-continuator (Stop hook) 写下一步建议
  - `details/proposals.md` ← Stop hook 反思沉淀 (铁律 9)
  - `hook-trace.jsonl` ← hooks 自动
- 读端 (按 _index.md.pointers 跳转, 不预加载):
  - 必读: `_index.md`
  - 阶段=impl/review → 按 pointers.latest_progress 读 progress.md 尾部
  - 任务命中 lessons 主题 → pointers.latest_lesson 跳到段
  - plan 阶段 → 命中再读 lessons / impl 读 design 对照 / review 读 design + previous reviews

**跨项目记忆已删除**: Athena 不做。推荐装 claude-mem (~/.claude/projects/ 已内置) 或 superpowers。

`delivery-gate` (Stop hook) 在 stage="review" 时检查质量门 (Feature+ 要求外部审查, Quick 不要求)。
阶段转换 + 长任务中 → 主动 `/compact`, 不等 context 满。

不间断工作: 不确定用什么库 → use context7。不确定现有代码 → Read 看。不确定测试怎么跑 → 读 _index.md test_cmd。
只在以下情况停: 方案需用户确认 (plan 阶段), VERDICT 需判断 (review 阶段), 真正的阻塞 (失败 3 次后)。
