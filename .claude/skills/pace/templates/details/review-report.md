# Sprint N 审查报告

## Step 1: 测试结果

<!-- 命令 + 实际输出 (不是"已跑通") -->

## Step 2: /codex:review (Feature+, Quick 可选)

<!-- 必须有以下证据之一, 防伪装 (铁律 4 反空跑 + 铁律 6 完成度证据):
     - codex job ID
     - codex CLI 真实命令行输出片段
     - 不可用时明示 "codex unavailable" + 完整 stderr -->

## Step 3: /codex:adversarial-review (System)

<!-- 同上证据要求 -->

## Step 4: ECC 扫描 (System)

<!-- npx ecc-agentshield scan 实际输出摘要 -->

## Step 5: Claude 审查 (/review 内置)

<!-- /review 输出 -->

## Step 6: @evaluator 评分

| 维度 | 分数 | 证据 |
|------|------|------|
| Functionality | /5 | (代码行号) |
| Spec Compliance | /5 | (代码行号 vs design.md) |
| Boundary Adherence | /5 | (是否越出 File Structure Plan) |
| Craft | /5 | (代码行号) |
| Robustness | /5 | (边界用例覆盖) |
| **均分** | **/5** | |

均分 = F×0.25 + SC×0.25 + B×0.15 + C×0.15 + R×0.20

## VERDICT:

<!-- PASS (均分≥4.0 且所有维度≥3) | CONCERNS (均分≥3.0 有维度=2) | REWORK (均分<3.0 或任一=1) | FAIL (多维度=1 或安全/Boundary 大幅越界) -->
