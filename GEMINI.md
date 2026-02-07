# GEMINI.md - System Context & Architecture

## Project Identity
**Name:** shazam-middleware
**Type:** Express.js Middleware
**Purpose:** Request logging and error notification (Slack, Telegram, Discord).

## Constitution (Global Constraints)
1. **Package Manager:** `pnpm` (Strict).
2. **File Size:** < 150 lines.
3. **Code Principles:** DRY, KISS, Clean Code.
4. **Test Coverage:** 100%.
5. **Documentation:** JSDoc mandatory for all exports.

## Architecture
- **Entry Point:** `app.js` / `index.js` (exported middleware).
- **Core Logic:** `bin/middleware/`.
- **API Clients:** `bin/api/` (Wraps `request` - DEPRECATED).
- **Utilities:** `bin/util/`.
