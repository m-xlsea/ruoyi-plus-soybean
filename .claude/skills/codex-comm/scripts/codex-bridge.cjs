// VibeCoding v9.2.0 — Codex Bridge: CC↔Codex 通信层
'use strict';
const { execSync, spawn } = require('child_process');
const crypto = require('crypto');

const SERVE_PORT = process.env.CODEX_SERVE_PORT || '4096';
const SERVE_URL = `http://localhost:${SERVE_PORT}`;
const DEFAULT_MODEL = 'gpt-5.4';
const EXEC_TIMEOUT = 300000; // 5 min

// ── 敏感信息过滤 ──
function filterSensitive(text) {
  return text
    .replace(/(?:password|secret|api[_-]?key|token|credential)\s*[:=]\s*['"][^'"]{4,}['"]/gi, '[REDACTED]')
    .replace(/(?:-----BEGIN (?:RSA |EC )?PRIVATE KEY-----[\s\S]*?-----END (?:RSA |EC )?PRIVATE KEY-----)/g, '[REDACTED_KEY]');
}

// ── 可用性检测 ──
function isCodexAvailable() {
  try { execSync('which codex', { stdio: 'ignore', timeout: 3000 }); return true; }
  catch { return false; }
}

// ── Health Check (2s 超时) ──
function healthCheck() {
  try { execSync(`curl -sf ${SERVE_URL}/health`, { timeout: 2000, stdio: 'ignore' }); return true; }
  catch { return false; }
}

// ── UUID 生成 (并发安全) ──
function generateReviewId() {
  return crypto.randomUUID().slice(0, 8);
}

// ── exec 模式 (单轮) ──
function execMode(prompt, opts = {}) {
  if (!isCodexAvailable()) return { ok: false, error: 'codex_not_available' };
  const safePrompt = filterSensitive(prompt);
  const model = opts.model || DEFAULT_MODEL;
  const sandbox = opts.sandbox || 'read-only';
  try {
    // 用 execFileSync 避免 shell 注入 (参数直接传递, 不经过 shell 解析)
    const result = require('child_process').execFileSync(
      'codex', ['exec', '--sandbox', sandbox, '-m', model, safePrompt],
      { encoding: 'utf8', timeout: opts.timeout || EXEC_TIMEOUT }
    );
    const sidMatch = result.match(/session[_\s]*(?:id)?[:\s]*([0-9a-f-]{8,})/i);
    return { ok: true, output: result, sessionId: sidMatch ? sidMatch[1] : null };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

// ── resume 模式 (多轮, 保持上下文) ──
function resumeSession(sessionId, prompt, opts = {}) {
  if (!isCodexAvailable()) return { ok: false, error: 'codex_not_available' };
  const safePrompt = filterSensitive(prompt);
  const model = opts.model || DEFAULT_MODEL;
  try {
    const result = require('child_process').execFileSync(
      'codex', ['exec', 'resume', sessionId, '--sandbox', 'read-only', '-m', model, safePrompt],
      { encoding: 'utf8', timeout: opts.timeout || EXEC_TIMEOUT }
    );
    return { ok: true, output: result, sessionId };
  } catch (e) {
    console.error(`[codex-bridge] resume failed, falling back to new exec: ${e.message}`);
    return execMode(prompt, opts);
  }
}

// ── 自动启动 serve ──
function ensureServe() {
  if (healthCheck()) return true;
  try {
    const child = spawn('codex', ['serve', '--port', SERVE_PORT], {
      detached: true, stdio: 'ignore'
    });
    child.unref();
    // 等待启动 (最多 10s)
    for (let i = 0; i < 10; i++) {
      try { execSync('sleep 1'); if (healthCheck()) return true; } catch {}
    }
  } catch {}
  return false;
}

// ── serve HTTP 请求 ──
function serveRequest(endpoint, data) {
  try {
    const result = execSync(
      `curl -sf -X POST ${SERVE_URL}${endpoint} -H "Content-Type: application/json" -d '${JSON.stringify(data)}'`,
      { encoding: 'utf8', timeout: 30000 }
    );
    return { ok: true, data: JSON.parse(result) };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

// ── 获取 session 历史消息 ──
function getSessionMessages(sessionId) {
  return serveRequest(`/sessions/${sessionId}/messages`, {});
}

module.exports = {
  isCodexAvailable, healthCheck, generateReviewId,
  execMode, resumeSession, ensureServe, serveRequest,
  getSessionMessages, filterSensitive
};
