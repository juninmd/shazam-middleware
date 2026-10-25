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