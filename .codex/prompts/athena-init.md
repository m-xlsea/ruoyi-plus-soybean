# /athena-init (Codex) — 项目初始化

# 描述
> 项目初始化。每个新项目首次使用 Athena 时运行。
# end

参考: <https://developers.openai.com/codex/concepts/customization>

`.ai_state/_index.md` 已存在 → 提示用户用 `/athena-migrate` 升级或确认覆盖。

## 1. 项目扫描

```bash
ls package.json pyproject.toml Cargo.toml go.mod build.gradle pom.xml 2>/dev/null
cat package.json 2>/dev/null | grep -A5 '"scripts"'
ls jest.config* vitest.config* pytest.ini .eslintrc* ruff.toml biome.json 2>/dev/null
```

## 2. 创建 .ai_state/ (v9.6 schema)

```bash
mkdir -p .ai_state/details/reviews .ai_state/details/tasks-archive
```

## 3. 拷贝模板

从 `~/.codex/skills/pace/templates/` 复制:
- `_index.md`  →  `.ai_state/_index.md`
- 所有 `details/*.md`
- `init.sh`

## 4. 填充 _index.md frontmatter

把扫描结果写入: tech_stack, test_cmd, build_cmd, lint_cmd, dev_cmd

平台特征 (`codex --version` 输出):
- `cx_version`
- `goal_supported`: Codex 当前**没有原生 /goal** → false
- `batch_supported`: Codex subagent (max_threads in [agents]) 部分支持 → 视 max_threads 而定
- `background_supported`: false (Codex 无 /background)
- `session_memory_active`: false (Codex 无 ~/.claude/projects/ 等价物)
- `cross_session_memory`: "none"

## 5. 生成 init.sh

根据扫描结果定制 `.ai_state/init.sh`. `chmod +x`.

## 6. .gitignore

```bash
grep -q '.ai_state' .gitignore 2>/dev/null || echo '.ai_state/' >> .gitignore
```

## 7. Git commit

```bash
git add .ai_state/ .gitignore
git commit -m "athena: project initialized (v9.6 schema, Codex)"
```

## 8. 验证

```bash
bash .ai_state/init.sh
```

告知用户: "Athena (Codex 版) 已就绪。用 `/athena-dev <需求>` 开始, 或 `/athena-status` 看面板。"
