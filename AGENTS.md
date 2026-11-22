# AGENTS.md

shazam-middleware: an Express middleware that logs requests and sends error notifications to Slack, Telegram, and Discord. `GEMINI.md` holds the system context for Gemini agents.

## Stack

- TypeScript, Express. Tests: `bun test` with `supertest`.
- Runtime dependencies: `browser-detect`, `on-finished`.
- Package manager: pnpm (per the release directive). The repo also has `bun.lock` and `yarn.lock`; do not regenerate them without an owner decision.

## Commands

```bash
bun test     # the test script (package.json)
```

## Structure

- `app.ts`: the middleware factory (`shazamFactory`). `handler.ts`: request handler.
- `bin/middleware/`: `exceptionMiddleware.ts` (error handling), `logMiddleware.ts` (request log).
- `bin/handler/commonHandler.ts`: shared handler logic.
- `bin/api/`: `baseApi.ts`, `slackApi.ts`, `telegramApi.ts`, `discordApi.ts`.
- `bin/util/`: attachments, `environment.ts`, `ipUtil.ts`, `normalizeError.ts`, `truncate.ts`, `userAgentUtil.ts`.
- `test/`: tests for the app, the APIs, attachments, and environment handling.

## Conventions

- Error handling is centralized in `bin/middleware/exceptionMiddleware.ts`.
- Never log secrets (webhooks, tokens), and keep them out of error messages.
- Releases follow semantic versioning. `release-drafter` builds the release notes.
- Keep the code small and single-purpose, and document the purpose, inputs, and outputs of each module.

## Gotchas

- `logMiddleware.ts` is on every request path. Watch its latency when you change it.
- User-Agent parsing is a hot path. `bin/util/userAgentUtil.ts` caches results in a `Map`. Keep the eviction policy in mind before you change it.
- `.jules/bolt.md` has earlier performance notes from an agent. Read them before you touch the hot path.

<!-- base-actions-main-policy -->
## GitHub Actions — padrão obrigatório (@main)

- Referencie as actions internas sempre pelo branch, nunca por SHA:
  - `uses: juninmd/base-actions/<action>@main`
  - `uses: juninmd/base-actions/.github/workflows/<arquivo>.yml@main`
- Não fixe `@<sha>` em `juninmd/base-actions`: a atualização é centralizada no
  `main` e passa a valer no próximo run.
- PRs cujos checks não iniciam por billing/spending limit são mesclados pelo bot central
  `juninmd/base-actions/.github/workflows/auto-merge-billing-blocked.yml`.
  Para impedir o merge automático de um PR, aplique a label `do-not-merge`.
