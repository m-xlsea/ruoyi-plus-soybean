---
schema_version: "9.6"
athena_version: "9.6.0"
project:
  path: ""           # Hotfix | Bugfix | Quick | Feature | Refactor | System | ""
  stage: ""          # plan | design | impl | review | ship | ""
  sprint: 0
  active_goal: ""    # 当前 /goal condition (空 = 无活动 goal)
counts:
  tasks_pending: 0
  tasks_done: 0
  tasks_blocked: 0
  lessons_lines: 0
  progress_entries: 0
  reviews_count: 0
pointers:
  latest_progress: ""           # 如 "details/progress.md#L46"
  latest_review: ""             # 如 "details/reviews/sprint-3.md"
  latest_lesson: ""             # 如 "details/lessons.md#L98"
  latest_proposal: ""           # 如 "details/proposals.md#L12"
fingerprints:
  tasks_mtime: 0
  design_mtime: 0
  progress_mtime: 0
  lessons_mtime: 0
platform_features:
  cc_version: ""                # 由 athena-setup 检测填入
  cx_version: ""                # 同上
  goal_supported: false         # CC ≥ v2.1.139 时 true
  batch_supported: false        # CC ≥ v2.1.121 时 true
  background_supported: false   # CC ≥ v2.1.139 时 true
  session_memory_active: false  # ~/.claude/projects/ 自动摘要是否启用
  cross_session_memory: "none"  # "claude-mem" | "superpowers" | "none"
gotchas: []                     # 项目特有的"小心点", PACE 会在 SessionStart 注入
conventions: []                 # 项目约定 (pnpm vs npm 等)
tech_stack: ""
test_cmd: ""
build_cmd: ""
lint_cmd: ""
dev_cmd: ""
---

# 项目状态索引

<!--
本文件是 .ai_state/ 的单一入口 (铁律 8)。
SessionStart hook 只读这一个文件, 注入轻量 frontmatter 字段 + counts 摘要。
下游 (Edit/Read tools) 按 pointers 自取明细。
任何 detail/* 文件写入 → PostToolUse index-updater.cjs 原子更新本文件。
-->

## 最近活动

<!-- 由 pace-continuator hook 在 Stop 时维护, 保留最近 3 条 -->

## 当前阻塞

<!-- 由 PACE 流程在 stage=impl/review 时填写 -->

## 下一动作 (PACE 建议)

<!-- 由 pace-continuator 在 Stop 时根据 stage 推断, 写入 details/next.md 的摘要 -->

## 反思建议 (Hook 沉淀)

<!-- 引用 details/proposals.md 最近一条 (latest_proposal) -->
