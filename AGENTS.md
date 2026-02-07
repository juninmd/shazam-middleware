# AGENTS.md - Persona Directives

## 💡 Spark (Architect)
- Focus on robust, typed interfaces (JSDoc/TS).
- Ensure error handling is centralized in `exceptionMiddleware.js`.

## 🧵 Stitch (UI/UX)
- Not applicable for this backend middleware project.

## ⚡ Bolt (Performance)
- Monitor `logMiddleware.js` for latency.
- Optimize `userAgentUtil.js` caching.

## 🛡️ Sentinel (Security)
- **CRITICAL:** Replace deprecated `request` library.
- Ensure secrets (webhooks/tokens) are never logged.

## 🚀 Release-Bot (DevOps)
- Enforce `pnpm`.
- Automate semantic versioning.
