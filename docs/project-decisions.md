# Confetti decisions

Working notes to keep the project focused and consistent.

## Goal

Confetti is a project-management application that helps people organise work without unnecessary process or complexity.

The product's tagline is **Bring order to the party.**

## Product

Confetti helps people organise work without turning project management into a job of its own.

### Core model

This describes the intended product model. The first release deliberately implements only the subset listed below.

- A project is the private collaboration boundary and represents the team workspace.
- Each project owns one ordered backlog, shared statuses and cards. Later releases can add labels, sprints and multiple boards.
- Cards belong to projects, not boards. Boards are filtered views of project cards.
- A card has one canonical status and one project-wide rank, so changes appear consistently on every board.
- Backlog sections are configurable. Cards selected for work retain their backlog section and rank so they can return to the same context.
- Project prefixes produce card keys such as `CF-42`. Moving a card to another project assigns a new key while every previous key remains a permanent alias.
- `Done`, `Archived` and `Deleted` are distinct lifecycle states. Normal deletion is recoverable; permanent deletion is a privileged privacy operation.
- Sprints are project resources. A project has at most one active sprint, and unfinished work requires an explicit destination when the sprint completes.
- Card types initially are Story, Bug and Task. Cards also support labels, multiple assignees, priority, an optional positive-integer estimate, a due date, ordered checklist tasks and card relationships.
- Descriptions and comments use sanitized Markdown. File attachments are deferred.
- Projects start private. Project roles are Owner, Member and Viewer; Administrator is a system-wide role.

### First release

- V1 delivers the core workflow defined in [the roadmap](roadmap.md).
- Each project has one implicit board showing active cards in the fixed `To Do`, `In Progress` and `Done` statuses.
- The backlog uses the fixed `Inbox`, `Refined` and `Ready` sections.
- Boards are not stored or configurable yet. A board entity becomes relevant when multiple saved views are introduced.
- English is the only locale, while Nuxt i18n remains in place.
- A small authenticated, versioned REST API uses the same application services as the web UI.
- Typed domain events are stored transactionally and power the card activity timeline.
- The application and PostgreSQL have a reproducible deployment path.

### Deferred from the first release

- Project memberships beyond the initial owner, groups and scoped permissions.
- Multiple boards, saved board filters, board templates and configurable statuses or backlog sections.
- MCP, complete OpenAPI coverage and persistent idempotency infrastructure.
- Cross-project transfers, historical key aliases, card relationships and extended lifecycle management.
- Administrator bootstrap, administrative MFA and recovery codes.
- Comments, multiple assignees, watchers, mentions and notifications.
- Sprints, releases, analytics, public extensions and embedded AI.
- File attachments, custom card types, custom estimation schemes and arbitrary board query languages.

## Principles

- The workflow stays fast, visual and uncluttered.
- Useful defaults take priority over configuration.
- Features address real user needs.
- The public API is part of the product from the start.
- Authentication and authorization are enforced on the server.
- Changes are delivered as small vertical slices, normally achievable in one to four hours.
- Architectural foundations are introduced when the first real feature uses them.
- Core workflows meet WCAG 2.2 AA.

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

Confetti remains one repository and one Nuxt application. All external input is validated, API contracts stay separate from database schemas and database constraints form the final integrity boundary.

Retain business records for history and audits. Deactivate users instead of deleting them, and preserve their references in historical activity. Transient authentication data such as sessions and verification tokens may be deleted. Personal data may be anonymised when required without removing the related business history.

Shared application services support both the web application and versioned REST API. External clients use hashed, revocable, project-scoped personal access tokens. MCP, a published OpenAPI specification and persistent idempotency follow when the implemented API surface justifies them.

Current state lives in ordinary relational tables. Small, typed and versioned domain events are appended in the same transaction as each completed business operation. Events are immutable and power activity timelines, internal reactions and later integrations; Confetti is not event sourced. Consumers use at-least-once delivery and deduplicate with stable event IDs.

The first release board is an implicit view of a project's active cards grouped by canonical status. It has no table, filters or settings. When multiple boards are needed, add saved filtered views without changing card ownership or status.

One explicit project-wide card rank defines ordering. Its implementation only changes if concurrent real-world usage shows it is insufficient.

Administrator bootstrap, TOTP MFA, recovery codes and a restricted security audit log are not V1 prerequisites.

Domain authorization lives in shared application services so the web UI, REST API and MCP server enforce identical rules. Personal access tokens are hashed, expiring, revocable and scoped by project and capability.

## Delivery

The repository is public under the MIT license. Secrets and real personal data are never committed.

Development uses short-lived branches and squash-merged pull requests into protected `main`. CI checks formatting, linting, types, tests and the production build.
