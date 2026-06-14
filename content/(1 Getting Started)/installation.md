---
since: '1.0.0'
title: 'Installation'
description: 'Clone the repository, install dependencies, and start the dev server.'
order: 2
---

<script lang="ts">
	import { Snippet } from '$lib/components/ui/snippet';
	import { Badge } from '$lib/components/ui/badge';
	import { PUBLIC_REPO_URL } from '$env/static/public';
</script>

## Requirements

<div class="not-prose my-4 flex flex-wrap gap-2">
	<Badge variant="outline">Bun ≥ 1.2</Badge>
	<Badge variant="outline">Node.js ≥ 20 (alternative)</Badge>
	<Badge variant="outline">Git</Badge>
</div>

> [!TIP]
> Bun is recommended — it's significantly faster than npm/yarn for both install and dev server startup.

## 1. Clone

<Snippet text="git clone {PUBLIC_REPO_URL}" class="mt-4" />

Or download as a ZIP and extract it.

## 2. Configure Environment

Copy the example env file and fill in your values:

<Snippet text="cp .env.example .env" class="mt-4" />

Open `.env` and set at minimum:

| Variable | Description |
|----------|-------------|
| `PUBLIC_REPO_URL` | Git clone URL of this repo |
| `PUBLIC_CONTENT_SOURCE_URL` | Base URL for "View Source" links (GitHub/Bitbucket root, no trailing slash) |
| `PUBLIC_SITE_TITLE` | Site name shown on the homepage |
| `PUBLIC_SITE_DESCRIPTION` | Tagline shown below the site name |

## 3. Install Dependencies

<Snippet text="bun install" class="mt-4" />

## 4. Start the Dev Server

The dev script runs Velite (content layer) and Vite in parallel:

<Snippet text="bun run dev" class="mt-4" />

The site is now available at `http://localhost:5173`.

> [!INFO]
> Velite must run before Vite so that the content index is available. The `bun run dev` command handles this automatically — it runs `velite` once first, then starts both `velite --watch` and `vite dev` concurrently.

## 5. Add Your First Page

Create a markdown file anywhere under `content/`:

```md
---
title: 'My First Page'
description: 'A short description shown in the sidebar and overview.'
until: '1.0.0'
order: 1
---

## Hello

This is my first docs page.
```

Velite picks it up automatically and the page appears in the sidebar on the next hot-reload.

## Building for Production

```bash
bun run build
```

Preview the production build locally:

```bash
bun run preview
```

## Project Structure

```text
content/              ← all docs pages (.md files)
  (1 Getting Started)/
    index.md
    installation.md
src/
  lib/
    components/
      mdsx/           ← markdown element overrides (blockquote, pre, table, …)
      ui/             ← shadcn-svelte components
    features/docs/    ← routing helpers, docs context
  routes/
    (app)/docs/       ← SvelteKit route for /docs/[...slug]
velite.config.ts      ← content schema & collection config
mdsx.config.js        ← remark/rehype plugins, mdsx blueprint
```

## Useful Scripts

| Command | Description |
|---------|-------------|
| `bun run dev` | Start dev server with live reload |
| `bun run build` | Production build |
| `bun run preview` | Preview production build |
| `bun run check` | Run `svelte-check` for type errors |
| `bun run format` | Format all files with Prettier |
