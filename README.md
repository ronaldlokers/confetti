# Confetti

**Bring order to the party.**

Confetti is a simple project-management application with ordered backlogs, focused boards, stable card keys, and an API for people and AI tools.

See [the project decisions](docs/project-decisions.md) for the product scope and architecture and [the roadmap](docs/roadmap.md) for the planned delivery phases.

## Setup

Install the pinned Node.js and pnpm versions with [mise](https://mise.jdx.dev/), then install dependencies:

```sh
mise install
pnpm install
```

Start the development server:

```sh
pnpm dev
```

## Checks

```sh
pnpm lint
pnpm typecheck
pnpm build
```
