---
title: 'Introduction'
description: 'A markdown-first documentation site powered by SvelteKit, Velite, and shadcn-svelte.'
order: 1
---

<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';
	import { Link } from '$lib/components/ui/link';
	import * as Accordion from '$lib/components/ui/accordion';
</script>

This is a fully self-contained documentation site. Drop a `.md` file into the `content/` directory and it becomes a styled, navigable page — no config required.

## How It Works

Content is processed through three layers:

**Velite** collects every `.md` file under `content/`, validates frontmatter against a schema, and generates typed slugs, TOC data, and metadata used for routing and the sidebar.

**mdsx** compiles each markdown file into a Svelte component. This means you can write standard markdown and drop in any Svelte component anywhere in the file using a `<script>` block — no MDX-style JSX required.

**Shiki** handles syntax highlighting at compile time using the GitHub Light / GitHub Dark dual-theme setup, so code blocks look great in both light and dark mode without any runtime overhead.

## Features

- <Badge variant="secondary">Markdown</Badge> Full GFM support — tables, strikethrough, task lists, autolinks
- <Badge variant="secondary">Components</Badge> Any shadcn-svelte component usable directly in `.md` files
- <Badge variant="secondary">Syntax</Badge> Shiki highlighting with diff support (`// [!code ++]` / `// [!code --]`)
- <Badge variant="secondary">Callouts</Badge> GitHub-style callouts via `> [!NOTE]`, `> [!WARNING]`, etc.
- <Badge variant="secondary">TOC</Badge> Auto-generated table of contents with active-heading tracking
- <Badge variant="secondary">Typography</Badge> Smart punctuation, subscript/superscript, definition lists, abbreviations
- <Badge variant="secondary">Navigation</Badge> Automatic prev/next links derived from content order
- <Badge variant="secondary">Dark mode</Badge> Full dark/light mode with smooth transitions

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

<Accordion.Root type="single" class="mt-8">
	<Accordion.Item value="q1">
		<Accordion.Trigger>Do I need to know Svelte to write content?</Accordion.Trigger>
		<Accordion.Content>
			No. Plain markdown works perfectly. Svelte components are optional — only needed when you want interactive demos, tabs, code snippets, etc. inside a page.
		</Accordion.Content>
	</Accordion.Item>
	<Accordion.Item value="q2">
		<Accordion.Trigger>Can I add my own components?</Accordion.Trigger>
		<Accordion.Content>
			Yes. Drop a component into <code>src/lib/components/ui/</code>, import it in your page's script block, and use it anywhere in the markdown.
		</Accordion.Content>
	</Accordion.Item>
	<Accordion.Item value="q3">
		<Accordion.Trigger>How are pages ordered in the sidebar?</Accordion.Trigger>
		<Accordion.Content>
			Groups are ordered by the leading number in their directory name (e.g. <code>(1 Getting Started)</code>). Pages within a group are ordered by the <code>order</code> frontmatter field, then alphabetically. Pages with <code>hidden: true</code> are excluded entirely.
		</Accordion.Content>
	</Accordion.Item>
</Accordion.Root>
