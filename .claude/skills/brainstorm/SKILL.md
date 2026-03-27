---
name: brainstorm
description: R₀ 苏格拉底式需求精炼 — 写代码前激活
---
# Brainstorm (R₀ 需求精炼)

Path B+ 任务在写代码前**必须**激活本 skill。

## 流程

### 0. 自主调研 (提问前)
- 搜索 (Grep/Glob, 或 augment-context-engine 如已安装)项目中与需求相关的现有代码
- 读 .ai_state/knowledge.md + lessons.md 查相关经验
- 读 .ai_state/conventions.md 查编码规范
- 如果 Codex 可用: 用 codex-comm skill 问 Codex "这类需求常见陷阱?"
→ 基于调研结果准备更有深度的问题

### 1. 访谈 (苏格拉底式, 基于调研的针对性问题)
- **一次只问一个问题**, 不堆叠
- 优先选择题, 开放题为辅
- 覆盖: 用户目标、使用场景、边界、非功能需求
- YAGNI 原则: 主动砍不必要的功能

### 2. 提出 2-3 个方案
- 每方案: 架构概述 + 优劣 + 复杂度预估
- context7 查依赖库文档验证可行性
- 标注推荐方案及理由

### 3. 分段呈现设计
- 每段 ≤ 200 字, 用户确认后再下一段

### 4. 确认输出
- 写入 .ai_state/design.md (用模板格式: MUST/SHOULD/COULD + 验收标准)
- cunzhi `DESIGN_READY` 确认
- 进入 plan-first skill

## 铁律
- 设计未确认前**不写任何代码**
