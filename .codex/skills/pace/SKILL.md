---
name: pace
description: >
  工作流路由器 (Codex 版). 收到开发任务时触发. 按任务复杂度路由到 6 条路径.
effort: high
---

# PACE — 6 路径路由器 (v9.6 Codex)

首先读 `.ai_state/_index.md` (铁律 8 索引先行). 有 stage → 从当前阶段继续.
.ai_state/ 不存在 → 提示 `/athena-init`.

## 路由 (同 CC)

```
          ┌─ 1行/配置 ──────→ Hotfix
 修复 ────┤
          └─ 需要调试 ─────→ Bugfix

          ┌─ 需求清晰/小 ──→ Quick
 新建 ────┤ 需要设计 ─────→ Feature
          ├─ 改现有结构 ───→ Refactor
          └─ 跨模块/服务 ──→ System
```

## Codex 端关键限制 (vs CC)

| 能力 | CC | Codex | Athena 替代方案 |
|------|-----|-------|----------------|
| /goal autonomous loop | ✓ v2.1.139+ | ✗ | delivery-gate hook 兜底判定 VERDICT |
| /batch 自动并行 worktree | ✓ v2.1.121+ | ✗ | spawn_agent 多线程 (config.toml [agents].max_threads) |
| /background 多会话 | ✓ v2.1.139+ | ✗ | 用户自己开多个 codex session |
| PreCompact / PostCompact | ✓ | ✗ | 长任务点主动 _index.md 保存 |
| Session memory | ✓ ~/.claude/projects/ | ✗ | 无 (cross_session_memory: "none") |
| compact 自动 | ✓ /compact | ✗ | Codex 用 `/clear` + AGENTS.md 注入恢复 |

## Codex 优势 (vs CC)

| 信号 | Codex 更适合 |
|------|------------|
| 终端命令为主 | Terminal-Bench 2.0 SOTA 82.7% (GPT-5.5 Apr 2026) |
| 大量同模式改写 | token 成本 0.25-0.33× CC, 适合"重复劳动" |
| 多模型互审 | Codex 主跑 + 调 web_search 验证 |

## 跨平台路由建议

Codex 端在以下情况主动建议用户切到 CC:
- 任务包含大量"自动循环直到达成条件" → 建议 CC `/goal`
- 任务包含"并行改 100 个文件" → 建议 CC `/batch`
- 任务需要 Opus 设计能力 → 建议 CC

不强制 — 是建议。

## 6 路径 (Codex 版, 简化)

### Hotfix · Bugfix
同 CC 版, 没有 stage. `apply_patch` 改 → `shell` 跑测试 → `git commit`.

### Quick (impl → review → ship)
TDD 实现 → /review (Codex 内置) → git commit.
路径升级监测 (同 CC).

### Feature (plan → impl → review → ship)
- **plan**: web_search 调研 + brainstorming → design.md → 用户确认 → tasks.
- **impl**: 按 task 实现, TDD, 完成勾选 + progress 追加. 路径升级监测.
- **review**: /review + spawn_agent reviewer (Codex subagent, 见 [agents].max_threads). VERDICT.
- **ship**: git commit + 归档.

### Refactor (plan → impl → review → ship)
- **plan**: 用户确认重构方案 + design.md (before/after) + tasks-current.md.
- **impl**: 用 spawn_agent 多线程并发 (Codex 端不像 CC 的 /batch 自动 worktree, 需要手动多 agent 协作).
  - 设置 `--max-threads <N>` (从 _index.md.platform_features 推断 max_threads)
- **review**: 同 Feature.
- **ship**: 同上.

### System (plan → design → impl → review → ship)
完整流程, 长 stage 主动写 `.ai_state/_index.md` 保存 (Codex 无 compact).

## 共享协议 (审查/发布同 CC 端)

参考 `~/.codex/skills/pace/SKILL.md` 完整文本.

## 失败处理协议 (同 CC, 铁律 6 完成度证据)

工具失败 → 三轮重试 (改参数 / 换工具 / 拆任务). 三轮后报告完整 stderr + exit code.
spawn_agent 输出预算 ≤ 2000 tokens.

**禁止**: "请你手动执行" 作为首次响应.

## 状态管理 (铁律 5/8)

`.ai_state/_index.md` 单一入口. 协议字段同 CC 端. 跨平台一致 (铁律 6).

合法 path: Hotfix / Bugfix / Quick / Feature / Refactor / System
合法 stage: plan / design (System only) / impl / review / ship

Codex 无 compact 生命周期 → 不写 `compact-snapshot.md`, hooks 也无 PreCompact/PostCompact.
