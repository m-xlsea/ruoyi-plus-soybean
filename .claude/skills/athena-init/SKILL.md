---
name: athena-init
description: >
  项目初始化。每个新项目首次使用 Athena 时运行。扫描项目、生成环境脚本、创建 .ai_state/ schema。
effort: xhigh
disable-model-invocation: true
---

# /athena-init — 项目初始化

参考: <https://code.claude.com/docs/en/skills>

## 1. CC 原生初始化

无 CLAUDE.md → 运行 `/init`, 生成后追加: "本项目使用 VibeCoding Athena, 开发用 `/athena-dev`"
已有 CLAUDE.md → 跳过。

## 2. 项目扫描

```bash
ls package.json pyproject.toml Cargo.toml go.mod build.gradle pom.xml 2>/dev/null
cat package.json 2>/dev/null | grep -A5 '"scripts"'
ls jest.config* vitest.config* pytest.ini .eslintrc* ruff.toml biome.json 2>/dev/null
```

## 3. 创建 .ai_state/ 目录树 (v9.6 schema)

```bash
mkdir -p .ai_state/details/reviews
mkdir -p .ai_state/details/tasks-archive
```

## 4. 拷贝模板到 .ai_state/

从 `~/.claude/skills/pace/templates/` 复制 (必须全部, 缺一不可):

- `_index.md`  →  `.ai_state/_index.md` (单一入口, 铁律 8)
- `details/tasks-current.md`
- `details/progress.md`
- `details/design.md`
- `details/handoff.md`
- `details/lessons.md`
- `details/review-report.md`  →  `.ai_state/details/reviews/template.md`
- `details/next.md`
- `details/proposals.md`
- `init.sh`  →  `.ai_state/init.sh`

## 5. 填充 _index.md frontmatter

把扫描结果写入:
- `tech_stack` (检测到的: node/python/rust/go)
- `test_cmd` (从 package.json scripts.test 或 pytest 等)
- `build_cmd`
- `lint_cmd`
- `dev_cmd`

填充 `platform_features` (用 `claude --version` 和 `codex --version 2>&1`):
- `cc_version`
- `cx_version`
- `goal_supported`: 解析 cc_version, ≥ "2.1.139" 即 true
- `batch_supported`: ≥ "2.1.121"
- `background_supported`: ≥ "2.1.139"
- `session_memory_active`: 检测 `~/.claude/projects/` 是否含 session-memory 子目录
- `cross_session_memory`: 检测 `~/.claude/plugins/` 含 claude-mem 则 "claude-mem", 含 superpowers 则 "superpowers", 否则 "none"

## 6. 生成 init.sh

根据扫描结果定制 `.ai_state/init.sh`:
- 依赖安装命令 (npm install / pip install / cargo build)
- dev server 启动 (如有)
- 基线测试命令
- `chmod +x .ai_state/init.sh`

## 7. .gitignore

```bash
grep -q '.ai_state' .gitignore 2>/dev/null || echo '.ai_state/' >> .gitignore
```

## 8. 跨项目记忆推荐 (替代删除的全局 lessons)

```bash
# 检测 claude-mem 或 superpowers, 缺则软提示
if ! ls ~/.claude/plugins/ 2>/dev/null | grep -iE 'claude-mem|superpowers' > /dev/null; then
  echo "💡 推荐装 claude-mem (89k stars) 做跨项目记忆"
  echo "   /plugin install claude-mem (待加入官方 marketplace)"
  echo "   或: /athena-setup 走完整推荐流"
fi
```

## 9. Git commit

```bash
git add .ai_state/ .gitignore
git commit -m "athena: project initialized (v9.6 schema)"
```

## 10. 验证

运行 `bash .ai_state/init.sh` 确认脚本正常。
告知用户: "Athena 已就绪。用 `/athena-dev <需求>` 开始开发, 或 `/athena-status` 看面板。"

已有 .ai_state/ 但 schema_version != "9.6" → 提示运行 `/athena-migrate` 升级。
已有 .ai_state/ 且 schema_version == "9.6" → 提示用户是否重新初始化 (会重置 _index.md)。
