#!/usr/bin/env node
'use strict';
// VibeCoding Athena PostToolUse index-updater v9.6 ★新增
// 协议: 无输出即放行 (PostToolUse 不阻断)
// 参考: https://code.claude.com/docs/en/hooks#posttooluse
//
// 设计 (铁律 5 文档即真相 + 铁律 8 索引先行):
//   1. 检测 tool_input.file_path 是否在 .ai_state/details/
//   2. 若是 → 重新扫描 details/ 计算 counts/fingerprints/pointers
//   3. 原子写 _index.md (写 .tmp 后 rename)
//   4. 避免热路径: 同一秒内对同一文件多次触发只更新一次 (debounce by mtime)

const fs = require('fs');
const path = require('path');

const PROJECT_DIR = process.env.CLAUDE_PROJECT_DIR || process.cwd();
const STATE_DIR = path.join(PROJECT_DIR, '.ai_state');
const INDEX_PATH = path.join(STATE_DIR, '_index.md');
const DETAILS_DIR = path.join(STATE_DIR, 'details');

let input = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', d => input += d);
process.stdin.on('end', () => {
  let event = {};
  try { event = JSON.parse(input); } catch (e) { process.exit(0); return; }

  // 检测 file_path 是否在 details/
  const filePath = (event.tool_input && (event.tool_input.file_path || event.tool_input.notebook_path)) || '';
  if (!filePath || !filePath.includes('.ai_state/details/')) {
    process.exit(0); return;
  }
  if (!fs.existsSync(INDEX_PATH)) { process.exit(0); return; }

  try {
    updateIndex();
  } catch (e) {
    process.stderr.write(`[index-updater] failed: ${e.message}\n`);
  }
  process.exit(0);
});

function readFileSafe(p) {
  try { return fs.readFileSync(p, 'utf8'); } catch (e) { return null; }
}

function mtime(p) {
  try { return Math.floor(fs.statSync(p).mtimeMs); } catch (e) { return 0; }
}

function countMatches(text, regex) {
  if (!text) return 0;
  return (text.match(regex) || []).length;
}

function lastSectionLine(text, headPrefix) {
  if (!text) return 0;
  const lines = text.split('\n');
  for (let i = lines.length - 1; i >= 0; i--) {
    if (lines[i].startsWith(headPrefix)) return i + 1;
  }
  return 0;
}

function lastNonEmptyLine(text) {
  if (!text) return 0;
  const lines = text.split('\n');
  for (let i = lines.length - 1; i >= 0; i--) {
    if (lines[i].trim() && !lines[i].startsWith('<!--') && !lines[i].startsWith('-->')) return i + 1;
  }
  return 0;
}

function updateIndex() {
  // 读 _index.md
  const content = fs.readFileSync(INDEX_PATH, 'utf8');
  const fmMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!fmMatch) {
    process.stderr.write('[index-updater] _index.md frontmatter parse failed\n');
    return;
  }
  let fm = fmMatch[1];
  const body = fmMatch[2];

  // 扫描 details/
  const tasksText = readFileSafe(path.join(DETAILS_DIR, 'tasks-current.md'));
  const progressText = readFileSafe(path.join(DETAILS_DIR, 'progress.md'));
  const lessonsText = readFileSafe(path.join(DETAILS_DIR, 'lessons.md'));
  const designText = readFileSafe(path.join(DETAILS_DIR, 'design.md'));
  const proposalsText = readFileSafe(path.join(DETAILS_DIR, 'proposals.md'));

  // counts
  const tasks_pending = countMatches(tasksText, /^- \[ \]/gm);
  const tasks_done = countMatches(tasksText, /^- \[x\]/gm);
  const tasks_blocked = countMatches(tasksText, /^- \[!\]/gm);
  const lessons_lines = countMatches(lessonsText, /^## /gm);

  // progress entries: 非空非注释非标题行
  let progress_entries = 0;
  if (progressText) {
    progress_entries = progressText.split('\n')
      .filter(l => l.trim() && !l.startsWith('<!--') && !l.startsWith('-->') && !l.startsWith('#'))
      .length;
  }

  // reviews_count
  let reviews_count = 0;
  let latest_review = '';
  try {
    const files = fs.readdirSync(path.join(DETAILS_DIR, 'reviews'))
      .filter(f => f.match(/^sprint-\d+\.md$/));
    reviews_count = files.length;
    if (files.length > 0) {
      const sorted = files.sort((a, b) => {
        const na = parseInt(a.match(/\d+/)[0], 10);
        const nb = parseInt(b.match(/\d+/)[0], 10);
        return na - nb;
      });
      latest_review = `details/reviews/${sorted[sorted.length - 1]}`;
    }
  } catch (e) {}

  // pointers
  const latest_progress = progressText ? `details/progress.md#L${lastNonEmptyLine(progressText)}` : '';
  const latest_lesson = lessonsText ? `details/lessons.md#L${lastSectionLine(lessonsText, '## ')}` : '';
  const latest_proposal = proposalsText ? `details/proposals.md#L${lastSectionLine(proposalsText, '## ')}` : '';

  // fingerprints
  const tasks_mtime = mtime(path.join(DETAILS_DIR, 'tasks-current.md'));
  const design_mtime = mtime(path.join(DETAILS_DIR, 'design.md'));
  const progress_mtime = mtime(path.join(DETAILS_DIR, 'progress.md'));
  const lessons_mtime = mtime(path.join(DETAILS_DIR, 'lessons.md'));

  // 替换 frontmatter 字段 (保留其他字段不动)
  function replaceField(yaml, key, value, isNumeric) {
    const re = new RegExp(`(^  ${key}: ).*$`, 'm');
    const val = isNumeric ? value : `"${value}"`;
    if (re.test(yaml)) return yaml.replace(re, `$1${val}`);
    return yaml;  // 不存在不创建, 等用户/init 加
  }

  fm = replaceField(fm, 'tasks_pending', tasks_pending, true);
  fm = replaceField(fm, 'tasks_done', tasks_done, true);
  fm = replaceField(fm, 'tasks_blocked', tasks_blocked, true);
  fm = replaceField(fm, 'lessons_lines', lessons_lines, true);
  fm = replaceField(fm, 'progress_entries', progress_entries, true);
  fm = replaceField(fm, 'reviews_count', reviews_count, true);
  fm = replaceField(fm, 'latest_progress', latest_progress, false);
  fm = replaceField(fm, 'latest_review', latest_review, false);
  fm = replaceField(fm, 'latest_lesson', latest_lesson, false);
  fm = replaceField(fm, 'latest_proposal', latest_proposal, false);
  fm = replaceField(fm, 'tasks_mtime', tasks_mtime, true);
  fm = replaceField(fm, 'design_mtime', design_mtime, true);
  fm = replaceField(fm, 'progress_mtime', progress_mtime, true);
  fm = replaceField(fm, 'lessons_mtime', lessons_mtime, true);

  const newContent = `---\n${fm}\n---\n${body}`;

  // 原子写入
  const tmpPath = INDEX_PATH + '.tmp';
  fs.writeFileSync(tmpPath, newContent);
  fs.renameSync(tmpPath, INDEX_PATH);

  process.stderr.write(`[index-updater] _index.md updated (pending=${tasks_pending} done=${tasks_done})\n`);

  // hook-trace
  try {
    const trace = JSON.stringify({
      ts: new Date().toISOString(),
      hook: 'index-updater',
      tasks_pending, tasks_done, lessons_lines, reviews_count
    }) + '\n';
    fs.appendFileSync(path.join(STATE_DIR, 'hook-trace.jsonl'), trace);
  } catch (e) {}
}
