---
name: vibe-init
description: 初始化 VibeCoding 项目结构
allowed-tools: Read, Write, Bash
---

# /vibe-init — 项目初始化

1. 检查项目根目录是否已有 .ai_state/
2. 如果没有:
   ```bash
   mkdir -p .ai_state/archive
   mkdir -p .knowledge
   ```
3. 从 `.claude/templates/ai-state/` 复制模板到 `.ai_state/`
4. 从 `.claude/templates/knowledge/` 复制模板到 `.knowledge/`
5. 检测项目类型 (package.json/requirements.txt/go.mod)
6. 初始化 conventions.md 中的项目信息
7. 触发 quickstart 引导

如果 .ai_state/ 已存在, 检查完整性并补全缺失文件。
