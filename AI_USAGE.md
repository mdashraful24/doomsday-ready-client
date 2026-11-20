# AI Tool Usage — Doomsday Ready Client

This file discloses AI tool usage in this repository, as required by the assessment brief.

AI tool used: `opencode` CLI.

## How AI was used

1. Read the client source tree, `package.json`, lockfiles, Vite/TypeScript/Biome config, env template, README, and API wrapper.
2. Compared the three required views (Movies, Rewatch Plan, Booking) with the assessment brief.
3. Identified documentation issues and a stale npm lockfile that did not include `lucide-react`.
4. Drafted and reviewed README corrections, AI-usage documentation, and local verification instructions.
5. Ran the project's own typecheck, formatter, linter, and build scripts to validate the final state.

Prompts used included:

```text
Analyze the client project, list the exact features, API calls, setup commands, environment
variables, and documentation inconsistencies, with file paths and line numbers.
```

```text
Compare the client with the assessment PDF and identify missing README/setup/AI-usage items.
```

## What was not delegated

- No Feature 1 or Feature 2 algorithm lives in this repository; both are hand-written in the separate server repository.
- No external solver, graph, or scheduling library was added.
- No runtime AI dependency, API key, secret, or deployment account was generated.
- The final documentation and command outputs were reviewed against the source code.

## Files produced or revised

- `README.md` — setup, scripts, routes, API integration, data model, deployment, and AI-usage summary.
- `AI_USAGE.md` — this detailed record.
- `package-lock.json` — refreshed so npm installs match `package.json` and `bun.lock`.
- `src/components/AppShell.tsx` — one formatting fix found by `bun run format:check`.

## Verification

```bash
bun run typecheck
bun run format:check
bun run lint:check
bun run build
npm ci --ignore-scripts --dry-run
```

Result: all checks passed, and the npm lockfile is consistent.
