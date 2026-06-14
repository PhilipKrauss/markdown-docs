---
since: '1.0.0'
title: 'Deployment'
description: 'Host the docs site as a Docker container using the included Dockerfile and docker-compose.yaml.'
order: 3
---

<script lang="ts">
	import { Snippet } from '$lib/components/ui/snippet';
	import { Badge } from '$lib/components/ui/badge';
</script>

## Requirements

<div class="not-prose my-4 flex flex-wrap gap-2">
	<Badge variant="outline">Docker ≥ 24</Badge>
	<Badge variant="outline">Docker Compose v2</Badge>
</div>

## How It Works

The build is **multi-stage**:

1. **Builder** — installs all dependencies, runs `velite build` to generate the content index, then `vite build` to produce the static + server output.
2. **Runner** — copies only the `build/` directory into a lean Bun image. No source, no `node_modules`.

> [!IMPORTANT]
> `PUBLIC_*` environment variables are **baked into the bundle at build time** by SvelteKit. They must be provided as Docker build arguments, not runtime environment variables. Changing them requires a rebuild.

## 1. Configure `.env`

All build-time variables are read from your `.env` file by Docker Compose automatically:

| Variable | When used | Description |
|----------|-----------|-------------|
| `PUBLIC_REPO_URL` | build | Clone URL shown in installation docs |
| `PUBLIC_CONTENT_SOURCE_URL` | build | Base URL for "View Source" links |
| `PUBLIC_SITE_TITLE` | build | Site name on the homepage |
| `PUBLIC_SITE_DESCRIPTION` | build | Tagline on the homepage |
| `ORIGIN` | runtime | Full public URL of the deployment (e.g. `https://docs.example.com`) |

Set `ORIGIN` to the actual public URL — SvelteKit uses it for CSRF protection and absolute URL generation:

```ini
ORIGIN=https://docs.example.com
```

## 2. Build & Run

<Snippet text="docker compose up --build -d" class="mt-4" />

The site is now available on port `3000`.

To stop:

<Snippet text="docker compose down" class="mt-4" />

## 3. Rebuild After Content Changes

Content is prerendered at build time. Any change to `.md` files or `.env` requires a rebuild:

<Snippet text="docker compose up --build -d" class="mt-4" />

> [!TIP]
> Use a CI/CD pipeline (GitHub Actions, Gitea Actions, …) to trigger `docker compose up --build -d` automatically on every push to `main`.

## Exposing on a Different Port

Change the port mapping in `docker-compose.yaml`:

```yaml
ports:
  - "8080:3000"   # host:container
```

## Putting It Behind a Reverse Proxy

When running behind nginx, Caddy, or Traefik, set `ORIGIN` to the external URL and remove the port exposure if the proxy handles it:

```ini
ORIGIN=https://docs.example.com
```

```yaml
# docker-compose.yaml
ports: []   # proxy connects directly to the container network
```
