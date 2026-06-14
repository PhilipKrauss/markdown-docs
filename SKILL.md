---
name: docs-content-authoring
description: "Use this skill whenever creating, editing, or restructuring content (.md files) for this SvelteKit-based docs site under content/. This includes writing new docs pages, adding frontmatter, organizing content into groups, or adding interactive Svelte UI components (Accordion, Card, Tabs, Callouts, TreeView, Icons, etc.) to a markdown page. Trigger this skill for any request involving 'docs page', 'documentation', 'content/' folder, frontmatter (title/description/order/navLabel/indicator/hidden/tocLevel/links), groups in parentheses like '(1 Getting Started)', callout blocks ([!INFO]/[!WARNING]/etc.), or any of the UI components listed below — even if the user just says 'add a card' or 'show this in tabs' without mentioning markdown explicitly."
---

# Docs Content Authoring

This skill teaches how to write and structure `.md` content pages for this docs site, including the file/group structure, frontmatter, supported markdown extensions, and the full catalog of interactive Svelte components available inline in markdown.

## 1. File & Page Structure

- All content lives under `content/`. Every `.md` file becomes a docs page.
- Directories wrapped in parentheses, e.g. `(1 Getting Started)/`, define a **group**. The group name shows in the sidebar and `/docs` overview, never in the URL. A leading number sets the group's sort order; unnumbered groups sort alphabetically after numbered ones.
- Within a group, documents sort alphabetically by default. Use frontmatter `order` to set an explicit position (lower = first).
- `index.md` inside a group maps to that group's root URL (e.g. `(1 Getting Started)/index.md` → `/docs`), not to `/index`.

## 2. Frontmatter

Every document requires at minimum `title` and `description`.

```md
---
title: 'My Page'            # required – shown as heading and in nav
description: 'Short blurb.' # required – shown in overview cards and meta
order: 1                     # optional – explicit sort position within group
navLabel: 'Short Name'       # optional – overrides title in sidebar/nav only
indicator: 'new'             # optional – 'new' | 'updated' | 'deprecated' | 'removed'
hidden: false                # optional – hide page from the sidenav
tocLevel: 3                  # optional – max header level shown in the table of contents
links:
  source: 'https://...'      # optional – source code link shown in header
---
```

## 3. Markdown Basics

Standard [GitHub Flavored Markdown](https://github.github.com/gfm/) is supported, plus typographic extensions:

- Strikethrough (`~~text~~`), task lists (`- [ ]` / `- [x]`), autolinks, tables — all standard GFM.
- Inline code via single backticks.
- Fenced code blocks are syntax-highlighted via Shiki.
    - Line highlighting: ` ```ts {2,4-6} `
    - Diff highlighting: append `// [!code ++]` or `// [!code --]` to a line (stripped from render).
    - File import: ` ```ts\n// file=./src/lib/utils/url.ts\n``` ` (path relative to the markdown file).
- Definition lists (pandoc style):
  ```md
  Term
  : Definition text.
  ```
- Abbreviations: define once at the bottom of the file, every occurrence gets an `<abbr>` tooltip:
  ```md
  The HTML spec defines how CSS works.

  *[HTML]: HyperText Markup Language
  *[CSS]: Cascading Style Sheets
  ```
- Smart punctuation (`remark-smartypants`): `"`, `'`, `--`, `---`, `...`, `(c)`, `(r)`, `(tm)` get converted to typographic equivalents automatically.
- Superscript: `E = mc^2^`.

### Callout Blocks

GitHub-style blockquote syntax, no import required:

```md
> [!INFO]
> Informational message.

> [!SUCCESS]
> Confirms an outcome.

> [!WARNING]
> Flags a potential issue.

> [!ERROR]
> Highlights a critical problem.
```

`NOTE` and `TIP` share the INFO style; `IMPORTANT` shares the ERROR/WARNING style. Add a custom title: `> [!INFO] Custom Title`.

## 4. Interactive Svelte Components

Markdown files support a `<script lang="ts">` block at the top for imports. **Components must sit outside paragraph blocks — give them their own lines.** Below is the full alphabetical catalog. Always check this list before reaching for raw HTML; if a component exists for the use case, use it.

For each component: import path, minimal usage, and when to reach for it.

### Accordion
```svelte
import * as Accordion from '$lib/components/ui/accordion';
```
```svelte
<Accordion.Root type="single">
  <Accordion.Item value="q1">
    <Accordion.Trigger>What is this?</Accordion.Trigger>
    <Accordion.Content>A docs site for your project.</Accordion.Content>
  </Accordion.Item>
</Accordion.Root>
```
Use for FAQs or collapsible groups of related Q&A items.

### Avatar
```svelte
import * as Avatar from '$lib/components/ui/avatar';
```
```svelte
<Avatar.Root><Avatar.Fallback>AB</Avatar.Fallback></Avatar.Root>

<Avatar.Group>
  <Avatar.Root><Avatar.Fallback>AB</Avatar.Fallback></Avatar.Root>
  <Avatar.Root><Avatar.Fallback>CD</Avatar.Fallback></Avatar.Root>
  <Avatar.GroupCount count={12} />
</Avatar.Group>
```
Use for user/team representations; `Avatar.Group` + `Avatar.GroupCount` for "+N more" overflow.

### Badge
```svelte
import { Badge } from '$lib/components/ui/badge';
```
```svelte
<Badge>Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="outline">Outline</Badge>
<Badge variant="destructive">Destructive</Badge>
```
Use for status labels, tags, or short inline indicators (e.g. "beta", "v2").

### Button
```svelte
import { Button } from '$lib/components/ui/button';
```
```svelte
<Button>Default</Button>
<Button variant="outline">Outline</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Destructive</Button>
```
Use for primary actions or as a styled trigger inside other components (e.g. `Tooltip.Trigger`).

### Card
```svelte
import * as Card from '$lib/components/ui/card';
```
```svelte
<Card.Root>
  <Card.Header>
    <Card.Title>Card Title</Card.Title>
    <Card.Description>Card Description</Card.Description>
  </Card.Header>
  <Card.Content>
    <p>Card Content</p>
  </Card.Content>
  <Card.Footer>
    <p>Card Footer</p>
  </Card.Footer>
</Card.Root>
```
Use to group related content into a bordered, titled block — feature highlights, summaries, "next steps" panels. `Card.Header`/`Card.Footer` are optional; omit if not needed.

### Collapsible
```svelte
import * as Collapsible from '$lib/components/ui/collapsible';
```
```svelte
<Collapsible.Root class="rounded-lg border p-4 space-y-2">
  <Collapsible.Trigger class="flex w-full items-center justify-between text-sm font-medium cursor-pointer">
    Show advanced options
  </Collapsible.Trigger>
  <Collapsible.Content class="text-muted-foreground text-sm pt-2 border-t">
    Hidden by default, revealed on demand.
  </Collapsible.Content>
</Collapsible.Root>
```
Use for a single show/hide section (vs. Accordion's multi-item list).

### Icons
```svelte
import { IconSparkleHighlight, IconDownload } from '@tabler/icons-svelte';
```
```svelte
<IconSparkleHighlight class="size-5" />
<IconDownload class="size-5 stroke-muted-foreground" />
```
Browse available icons at https://tabler.io/icons. Common sizing: `size-4` (16px, inline with text/buttons) or `size-5` (20px, standalone).

### Kbd
```svelte
import * as Kbd from '$lib/components/ui/kbd';
```
```svelte
<Kbd.Group>
  <Kbd.Root>Ctrl</Kbd.Root>
  <span>+</span>
  <Kbd.Root>K</Kbd.Root>
</Kbd.Group>
```
Use for keyboard shortcuts.

### Link
```svelte
import { Link } from '$lib/components/ui/link';
```
```svelte
<Link href="/docs">Back to docs</Link>
```
Use for a styled internal/external link as a UI element (distinct from plain markdown `[text](url)` links, which also work).

### Progress
```svelte
import { Progress } from '$lib/components/ui/progress';
```
```svelte
<Progress value={33} />
```
Use to visualize completion percentages (e.g. setup steps, loading states in a guide).

### Separator
```svelte
import { Separator } from '$lib/components/ui/separator';
```
```svelte
<Separator />
<Separator orientation="vertical" class="h-6" />
```
Use for visual dividers within a section (markdown `---` already creates a horizontal rule between sections; use `Separator` for finer-grained dividers inside custom layouts).

### Skeleton
```svelte
import { Skeleton } from '$lib/components/ui/skeleton';
```
```svelte
<div class="flex items-center gap-4">
  <Skeleton class="size-10 rounded-full" />
  <div class="space-y-2">
    <Skeleton class="h-4 w-48" />
    <Skeleton class="h-4 w-32" />
  </div>
</div>
```
Use to illustrate loading states in UI walkthroughs.

### Snippet
```svelte
import { Snippet } from '$lib/components/ui/snippet';
```
```svelte
<Snippet text="bun add shadcn-svelte" />
<Snippet text="npm install shadcn-svelte" variant="secondary" />
```
Use for copyable single-line commands (preferred over a fenced code block for one-liners users will copy/paste).

### Tabs
```svelte
import * as Tabs from '$lib/components/ui/tabs';
```
```svelte
<Tabs.Root value="tab-1">
  <Tabs.List>
    <Tabs.Trigger value="tab-1">Tab 1</Tabs.Trigger>
    <Tabs.Trigger value="tab-2">Tab 2</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value="tab-1">
    <p>Content of Tab 1</p>
  </Tabs.Content>
  <Tabs.Content value="tab-2">
    <p>Content of Tab 2</p>
  </Tabs.Content>
</Tabs.Root>
```
Use for grouping alternative content (e.g. package manager commands, OS-specific instructions). For longer per-tab content, import separate `.md` files and render them inside `Tabs.Content`:
```svelte
import Tab1Page from './(tabs)/tab1.md';
import Tab2Page from './(tabs)/tab2.md';
```
```svelte
<Tabs.Content value="tab-1"><Tab1Page /></Tabs.Content>
```

### Terminal
```svelte
import * as Terminal from '$lib/components/ui/terminal';
```
```svelte
<Terminal.Root>
  <Terminal.TypingAnimation>$ bun add shadcn-svelte</Terminal.TypingAnimation>
  <Terminal.AnimatedSpan delay={200} class="text-green-400">
    Packages installed successfully.
  </Terminal.AnimatedSpan>
</Terminal.Root>
```
Use for animated, typewriter-style terminal demos in getting-started/installation flows. `delay` is in ms and staggers each `AnimatedSpan`.

### Toggle
```svelte
import { Toggle } from '$lib/components/ui/toggle';
```
```svelte
<Toggle>Default</Toggle>
<Toggle variant="outline">Outline</Toggle>
<Toggle pressed>Pressed</Toggle>
```
Use for a single on/off control.

### ToggleGroup
```svelte
import * as ToggleGroup from '$lib/components/ui/toggle-group';
import { IconBold, IconItalic, IconUnderline } from '@tabler/icons-svelte';
```
```svelte
<ToggleGroup.Root type="single">
  <ToggleGroup.Item value="bold"><IconBold class="size-4" /></ToggleGroup.Item>
  <ToggleGroup.Item value="italic"><IconItalic class="size-4" /></ToggleGroup.Item>
</ToggleGroup.Root>
```
Use for a set of mutually exclusive (`type="single"`) or independent (`type="multiple"`) toggles, e.g. a mock toolbar.

### Tooltip
```svelte
import * as Tooltip from '$lib/components/ui/tooltip';
```
```svelte
<Tooltip.Root>
  <Tooltip.Trigger>Hover me</Tooltip.Trigger>
  <Tooltip.Content>This is a tooltip</Tooltip.Content>
</Tooltip.Root>
```
`Tooltip.Trigger` can wrap any element, including `<Button>`. Use for short contextual hints on hover.

### TreeView
```svelte
import * as TreeView from '$lib/components/ui/tree-view';
import { IconMarkdown, IconBrandSvelte, IconFolderOpen, IconFolderCode } from '@tabler/icons-svelte';
```
```svelte
<TreeView.Root class="rounded-lg border p-4 font-mono text-sm">
  <TreeView.Folder name="Root">
    <TreeView.Folder name="Folder-1">
      {#snippet icon({ open })}
        {#if open}
          <IconFolderOpen class="size-4" />
        {:else}
          <IconFolderCode class="size-4" />
        {/if}
      {/snippet}
      <TreeView.File name="installation.md" />
      <TreeView.File name="+page.svelte">
        {#snippet icon()}
          <IconBrandSvelte class="size-4 stroke-orange-500" />
        {/snippet}
      </TreeView.File>
    </TreeView.Folder>
  </TreeView.Folder>
</TreeView.Root>
```
Use to illustrate file/folder structures. Custom `icon` snippets are optional per-folder (with `{ open }` state) or per-file.

### Window
```svelte
import { Window } from '$lib/components/ui/window';
```
```svelte
<Window>
  <p>Window content goes here.</p>
</Window>
```
Use to frame a preview/demo inside a window-chrome container.

## 5. Versioning

The site supports multiple documentation versions. Versions are defined in `content/versions.yaml` and sorted automatically using Semantic Versioning. **No code changes are needed to add a new version.**

### Version Registry — `content/versions.yaml`

```yaml
- version: '1.0.0'   # full semver string, used in URLs: /docs/1.0.0/...
  label: '1.0.0'     # optional display name (defaults to version)
  stable: true        # false = shown as pre-release in the version picker

- version: '2.0.0-RC1'
  label: '2.0.0-RC1'
  stable: false
```

- **Latest stable** = highest `stable: true` entry by semver. Determined automatically — no extra config.
- **`/docs/latest/...`** redirects to the current latest stable version automatically.
- **Unknown version in URL** → auto-redirected to `/docs/latest/`.
- Version format: always use three numeric parts (`1.0.0`, not `1.0`). Pre-release identifiers: `1.0.0-SNAPSHOT`, `2.1.0-RC1`, `3.0.0-alpha.1`.

### Per-Page Version Frontmatter

Control which versions a page appears in using `since` and `until`:

```yaml
---
title: 'My Page'
since: '1.0.0'   # available from this version onwards (default: '0.0.0' = always)
until: '2.0.0'   # exclusive upper bound: hidden from 2.0.0 onwards (omit = no upper limit)
---
```

Visibility rule: `since <= requestedVersion < until`. `until` is exclusive.

| Scenario | Frontmatter |
|----------|-------------|
| Available in all versions | `since: '1.0.0'` (no `until`) |
| New in v2 | `since: '2.0.0'` |
| Removed in v2 | `since: '1.0.0'` + `until: '2.0.0'` |
| Always visible (no versioning) | omit both (defaults to `since: '0.0.0'`) |

### Adding a New Version — Checklist

1. Add entry to `content/versions.yaml`
2. New pages: add `since: 'x.y.z'`
3. Removed pages: add `until: 'x.y.z'`
4. Unchanged pages: nothing to do
5. Restart dev server (Velite output is cached at startup)

## 6. Workflow Checklist

When asked to create or edit a docs page:

1. Confirm/create the correct location under `content/<group>/<name>.md`, respecting group numbering and `order`.
2. Write frontmatter with `title`, `description`, and `since` at minimum; add other fields only if relevant.
3. Add a `<script lang="ts">` block importing only the components actually used.
4. Write content using standard markdown + the custom extensions in section 3 where they fit better than plain markdown (e.g. callouts instead of plain blockquotes for warnings/tips).
5. For "make this interactive" / "show this visually" requests, pick the most fitting component from section 4 rather than defaulting to plain text or raw `<div>`s — e.g. command sequences → `Snippet` or `Terminal`; alternatives → `Tabs`; FAQs → `Accordion`; file layouts → `TreeView`; grouped info → `Card`.
6. Keep components on their own lines, outside paragraph text.