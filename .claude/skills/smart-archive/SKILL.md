---
name: smart-archive
description: 智能压缩归档 — V 阶段
context: main
---

## 触发
V 阶段 [DELIVERY_CONFIRMED] 后。

## 流程

1. 将 .ai_state/ 中的完成文件移动到 .ai_state/archive/{date}/
2. 保留 conventions.md (跨任务持续)
3. 清理 session.md (为下次任务准备)
4. 不清理 .knowledge/ (永久持续)

## 与 /compact 关系
/compact 是 Claude Code 内置的上下文压缩。
smart-archive 是 VibeCoding 的任务归档。两者互补, 不冲突。

## 降级
归档目录创建失败 → 将状态文件内容追加到 conventions.md 底部保留, 不丢失。
