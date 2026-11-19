# CineQuest Client

Vite + React + TypeScript + Tailwind CSS frontend for CineQuest.

## Movies View

- Add a movie with title, release year, runtime, prerequisites, and watched state.
- Edit prerequisites from the movie library.
- Tick movies as watched.
- Delete movies with a confirmation step.

## Rewatch Plan View

- Pick a target movie.
- See prerequisites in rewatch order with watched ticks.
- Track progress as “X of Y watched” with a progress bar.
- See remaining watch time for unwatched prerequisites.

## Run Locally

```bash
bun install
cp .env.example .env
bun run dev
```

On Windows PowerShell, use `Copy-Item .env.example .env`.

The client runs at `http://localhost:3000`. Set `VITE_API_BASE_URL` to the backend API base URL.

## Useful Commands

```bash
bun run typecheck
bun run build
bun run format:check
bun run lint:check
```
