---
name: brainstorm
description: 需求头脑风暴 — R₀b 阶段, 探索方案空间
context: main
---
## 触发: Path B+ 任务开始时 (自动加载)

## 步骤
1. augment-context-engine 搜索相关代码和依赖
2. 读 .ai_state/knowledge.md 了解历史经验
3. 生成 Spec 需求模板 (写入 design.md 顶部):
   - 功能需求 (MUST/SHOULD/COULD)
   - 非功能需求 (性能/安全/兼容性)
   - 约束条件 (技术栈/时间/依赖)
   - 验收标准 (可测试的完成条件)
4. 生成 2-3 个候选方案, 每个包含:
   方案描述 / 优劣势 / 预估工作量 / 技术风险
5. 输出到 .ai_state/design.md
6. cunzhi [DESIGN_DIRECTION] 让用户选择方向

不可用时: 直接基于需求分析, 跳过代码搜索
