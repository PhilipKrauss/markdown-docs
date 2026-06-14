# Markdown Docs

A markdown-first documentation site built with **SvelteKit**, **Velite**, **mdsx**, and **shadcn-svelte**. Drop a `.md` file into `content/` and it becomes a styled, navigable page — no config required.

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | SvelteKit 2 + Svelte 5 (runes) |
| Content layer | Velite |
| Markdown → Svelte | mdsx |
| Syntax highlighting | Shiki |
| Components | shadcn-svelte + bits-ui |
| Styling | Tailwind CSS v4 |
| Package manager | Bun |

## Getting Started

```sh
git clone git@github.com:PhilipKrauss/markdown-docs.git
cd markdown-docs
cp .env.example .env   # fill in your values
bun install
bun run dev
```

The site is available at `http://localhost:5173`.

## Environment Variables

Copy `.env.example` to `.env` and configure:

| Variable | Description |
|----------|-------------|
| `PUBLIC_REPO_URL` | Git clone URL shown in the installation docs |
| `PUBLIC_CONTENT_SOURCE_URL` | Base URL for "View Source" links (GitHub/Bitbucket root, no trailing slash) |
| `PUBLIC_SITE_TITLE` | Site name shown on the homepage |
| `PUBLIC_SITE_DESCRIPTION` | Tagline shown below the site name |

## Scripts

| Command | Description |
|---------|-------------|
| `bun run dev` | Start dev server (Velite + Vite) |
| `bun run build` | Production build |
| `bun run preview` | Preview production build |
| `bun run check` | Type-check with `svelte-check` |
| `bun run format` | Format with Prettier |

## Adding Content

Create a `.md` file anywhere under `content/`. Directories in parentheses define sidebar groups:

```
content/
  (1 Getting Started)/   ← group, sorted by leading number
    index.md             → /docs
    installation.md      → /docs/installation
  (2 How To)/
    authoring.md         → /docs/authoring
```

Frontmatter fields: `title`, `description`, `order`, `navLabel`, `indicator`, `hidden`, `tocLevel`, `links.source`.

## LLM / AI Authoring

The file [`SKILL.md`](./SKILL.md) is a machine-readable skill document that teaches an LLM how to author content for this docs site. It covers:

- File and group structure
- All supported frontmatter fields
- Markdown extensions (callouts, diff highlighting, definition lists, abbreviations, …)
- The full component catalog with import paths and usage examples (Accordion, Badge, Card, Tabs, Terminal, TreeView, …)
- A workflow checklist for creating or editing pages

**When working with an AI assistant** (Claude Code, Cursor, Copilot, etc.), point it at `SKILL.md`:

> "Read SKILL.md, then add a new page under content/(2 How To)/ about X."

The assistant will follow the correct file structure, frontmatter schema, and component conventions without needing further guidance.
