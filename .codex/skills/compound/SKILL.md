---
name: compound
description: >
  Sprint Quality Gate 通过后触发。提炼本 Sprint 学到的为结构化条目追加 lessons.md。
effort: xhigh
---

# /compound — 经验沉淀

Gate PASS 后触发 (或用户显式 `/compound`).

## 输入

- `.ai_state/details/reviews/sprint-N.md` (审查报告)
- `git diff` (本 Sprint 所有变更)
- `.ai_state/details/tasks-current.md` (完成项)
- `.ai_state/details/design.md` (设计 vs 实际实现对比)

## 提炼方法

从以上输入找**真实发现**, 不写仪式性废话。每 Sprint 0-N 条不强制。

- **Pattern**: 什么解法有效且可复用? (带代码行号 / 文件路径)
- **Pitfall**: 什么坑踩过? 未来同类场景要提前避开
- **Constraint**: 发现的新约束 (依赖版本、环境、性能边界、API 限制)

没发现可提炼的 → 不写, 直接告知用户 "no new lesson". **不允许编造**.

## 输出 (项目级)

追加到 `.ai_state/details/lessons.md` (append-only, 不修改历史).

格式见 `pace/templates/details/lessons.md`. **Athena 不做跨项目知识管理**——需要的话装 claude-mem 或 superpowers。

写入后同步更新 `_index.md`:
- `counts.lessons_lines` += 新增条目数 (按 `## ` 头计)
- `pointers.latest_lesson` = `details/lessons.md#L<新条目行号>`
- `fingerprints.lessons_mtime` = 当前时间戳

## 自检

写入后读回验证:
1. 条目有具体的文件/行号/版本引用 (不只是"要注意 X")
2. 一句话标题能让下次 R₀ 快速扫描命中
3. Pattern/Pitfall/Constraint 三段不强制全有, 但至少有一段

写完告知用户: "Lessons updated. Next sprint R₀ 会自动读取 (按 _index.md.pointers.latest_lesson 跳转)."
