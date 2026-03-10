# VibeCoding Kernel v9.1.0 — Codex CLI

## 铁律 (违反即失败)
1. **先搜后写**: augment-context-engine 搜现有实现 → 不可用时 grep -r
2. **先规后码**: Path B+ 任务必须先 plan.md → cunzhi 确认后才能写代码
3. **先测后码**: E 阶段写功能代码前必须先写/更新测试 (RED→GREEN→REFACTOR)
4. **不确定就问**: 歧义/架构决策 → cunzhi 向用户确认, 不猜
5. **不破坏已有**: 改代码前读测试, 改后跑测试, 红了就修
6. **只改需要改的**: 不重构范围外代码, 不加未要求的功能
7. **避免过度工程**: 最简方案, YAGNI 优先
8. **commit 粒度**: 每个逻辑变更独立 commit, conventional commits
9. **交付必复盘**: 完成后必须 diff 分析→提炼 lessons→写入 knowledge.md

## 工作流
1. 评估复杂度 → P.A.C.E. 路由 (读 .codex/workflows/pace.md)
2. 按路径执行 RIPER-7 阶段 (读 .codex/workflows/riper-7.md)
3. 各阶段 skills **自动加载** (读 .codex/skills/{name}/SKILL.md)

## TDD 强制规则 (E 阶段)
写功能代码前必须先有失败的测试。流程:
1. 先写测试文件 → 运行 → 看到红色失败
2. 再写最小实现 → 运行 → 看到绿色通过
3. 重构 → 测试保持绿色
违反时: 停下, 补写测试, 再继续

## Kaizen 复盘规则 (V 阶段)
交付后必须执行:
1. `git diff --stat` 回顾变更范围
2. 提炼经验 → .ai_state/knowledge.md
3. 记录陷阱 → .ai_state/lessons.md

## 状态持久化
.ai_state/ 目录: session → design → plan → doing → verified → review → archive
模板位于 .codex/templates/ai-state/

## MCP 降级
augment-context 不可用→grep | cunzhi 不可用→对话确认 | deepwiki 不可用→web search

## Codex 专属能力
- /review: 原生代码审查 (T 阶段集成)
- /plan: 原生规划模式 (P 阶段集成)
- /statusline: 配置 TUI 底栏显示当前阶段和进度
- multi_agent + collaboration_modes: 多代理并行 (Path C+)
- [agents] 角色定义: builder / reviewer / explorer (config.toml)
- Profiles: `codex --profile dev|ci|review` 切换预设
- spawn_agents_on_csv: 批量多代理分派
- /model: gpt-5.4 (默认) / gpt-5.3-codex / gpt-5.3-codex-spark (快速)

## 并行工作规范 (Path C/D)
1. 读 plan.md → 识别无依赖任务组
2. 为每组指派 agent 角色 (Codex 自动编排)
3. 无依赖任务并行, 有依赖串行
4. 同文件不并行修改
5. 完成后合并 + /review 审查
