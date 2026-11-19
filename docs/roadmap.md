# Confetti roadmap

The roadmap records Confetti's product direction and intended delivery sequence. Later phases are refined as the product evolves.

## V1 — Core workflow

V1 delivers one end-to-end workflow: a user creates a private project with a prefix, manages stable-keyed cards in an explicitly ordered backlog, moves them through one implicit board, manages card tasks and reviews a transactional activity timeline.

The same core operations are available through a small authenticated REST API. The release includes focused authorization, application-service and browser tests, CI, a reproducible deployment and user and operator documentation. The workflow stays fixed: `Inbox`, `Refined` and `Ready` in the backlog, and `To Do`, `In Progress` and `Done` on the board.

V1 should be usable without including every planned capability.

## After V1 — Organize expansion

After V1, backlog sections and statuses become configurable, with labels, planning fields, richer lifecycle management, card relationships, multiple saved boards and reusable board templates.

This expansion also brings cross-project transfers with historical key aliases, a broader REST API, OpenAPI documentation, persistent idempotency and MCP access to the same application services. Self-hosting hardening, administrator bootstrap, MFA and recovery follow when their operational cost is justified.

## Phase 2 — Collaborate & Deliver

Collaboration adds existing-account project membership, fixed project roles, groups, resource-scoped permission policies, multiple assignees, Markdown comments, mixed activity timelines, watchers, mentions and in-app notifications.

Sprints support one active sprint per project, explicit incomplete-work handling and preserved sprint history. Releases and milestones remain independent of board and sprint membership. An internal integration SDK prototype uses real application services and events.

## Phase 3 — Measure & Improve

Event-derived reporting supports availability and capacity planning, guided sprint planning, guided retrospectives, retrospective actions that become cards, burndown and burnup, velocity, cycle time, cumulative flow, release forecasting and contextual recommendations.

Planning and analytics remain useful without requiring an AI provider. Compatibility tests stabilize internal SDK contracts.

## Phase 4 — Connect & Extend

The public REST API expands and stabilizes alongside signed webhooks, reliable event delivery and independently versioned TypeScript API-client and integration-SDK packages.

The extension ecosystem includes manifests, declared capabilities, lifecycle management, encrypted secrets, isolated execution outside the Nuxt/Nitro process, private and community integrations, discovery, developer tooling and compatibility tests. Official integrations use the same contracts.

## Phase 5 — Intelligence

An embedded, provider-independent AI assistant reuses existing application services and tool contracts. It supports conversational card and task management, backlog refinement, sprint-planning assistance, analytics explanations, retrospective summaries and controlled automation.

Every mutation remains subject to existing permissions, scoped credentials, explicit approval where appropriate and an auditable domain event.
