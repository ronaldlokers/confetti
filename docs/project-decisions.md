# Confetti decisions

Working notes to keep the project focused and consistent.

## Goal

Build a polished board application that I want to use myself and that demonstrates senior full-stack TypeScript skills.

Confetti should keep Fizzy's simple, pleasant workflow while fixing the limitations that matter to me. The product is called **Confetti** and its tagline is **Bring order to the party.**

## Product

Confetti helps people organise work on boards without turning project management into a job of its own.

### V1

- Create boards with a name and user-defined card prefix from a small set of column templates.
- Create, edit, order and move cards.
- Give every card a stable board key such as `EX-1`; never reuse numbers.
- Provide an API from the start so people and AI tools can manage boards.
- Support accounts and keep board data private by default.

### Not in V1

- Multiple languages; but add Nuxt i18n with English as the only locale.
- notifications or email workflows.
- Time tracking, estimates, sprints or reporting.
- Plugin or automation systems.

## Principles

- Keep the workflow fast, visual and uncluttered.
- Prefer useful defaults over configuration.
- Build only features I would use.
- Treat the public API as a first-class interface, not a later addition.
- Enforce authentication and authorization on the server.
- Meet WCAG 2.2 AA in the core workflows.

## Stack

- Strict TypeScript
- Vue, Nuxt, Nuxt UI and Tailwind CSS
- PostgreSQL with Drizzle ORM and Drizzle Kit
- Zod for validation and shared API contracts
- Better Auth with its Drizzle adapter
- Nuxt i18n with English only
- Vitest, Vue Test Utils and Playwright
- pnpm, with tool versions pinned in `mise.toml`

## Architecture

Keep one repository and one Nuxt application. Validate all external input, keep API contracts separate from database schemas and use database constraints as the final integrity boundary.

Start with a versioned HTTP API used by the web application itself. Use personal access tokens for external clients, publish an OpenAPI specification and support idempotency for create operations.

Boards are the top-level private resource. Each board belongs to one account and owns its columns, cards, card prefix and next card number. Cards cannot move between boards in V1.

Use integer positions for ordering cards and columns. Replace this only if real usage shows it is insufficient.

## Delivery

Keep the repository public under the MIT license and never commit secrets or real personal data.

Use short-lived branches and squash-merged pull requests into protected `main`. CI checks formatting, linting, types, tests and the production build.
