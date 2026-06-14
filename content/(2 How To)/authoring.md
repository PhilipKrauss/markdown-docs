---
since: '1.0.0'
title: 'Create Pages'
description: 'How to add documents, groups, and rich content to this docs site.'
order: 2
---

<script lang="ts">
	import * as Accordion from '$lib/components/ui/accordion';
	import * as Avatar from '$lib/components/ui/avatar';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import * as Collapsible from '$lib/components/ui/collapsible';
	import * as Kbd from '$lib/components/ui/kbd';
	import { Link } from '$lib/components/ui/link';
	import { Progress } from '$lib/components/ui/progress';
	import { Separator } from '$lib/components/ui/separator';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import { Snippet } from '$lib/components/ui/snippet';
	import * as Tabs from '$lib/components/ui/tabs';
	import * as Terminal from '$lib/components/ui/terminal';
	import { Toggle } from '$lib/components/ui/toggle';
	import * as ToggleGroup from '$lib/components/ui/toggle-group';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import * as TreeView from '$lib/components/ui/tree-view';
	import { Window } from '$lib/components/ui/window';
	import {
		IconMarkdown,
		IconBrandSvelte,
		IconFolderOpen,
		IconFolderCode,
		IconBold,
		IconItalic,
		IconUnderline,
        IconSparkleHighlight, 
        IconDownload
	} from '@tabler/icons-svelte';
	import Tab1Page from '../(1 Getting Started)/tab1.md';
	import Tab2Page from '../(1 Getting Started)/tab2.md';
	import { PUBLIC_CONTENT_SOURCE_URL } from '$env/static/public';
</script>

> [!TIP] AI Authoring
> Working with an AI assistant (Claude Code, Cursor, Copilot …)? Point it at [`SKILL.md`]({PUBLIC_CONTENT_SOURCE_URL}/blob/main/SKILL.md) in the repo root — it's a machine-readable version of this page that teaches any LLM how to author content for this site.
> ```
> Read SKILL.md, then add a new page under content/(2 How To)/ about X.
> ```

## 1. Adding Content

### 1.1 File Structure

All content lives under `content/`. Each `.md` file becomes a docs page.

<TreeView.Root class="my-4 rounded-lg border p-4 font-mono text-sm">
<TreeView.Folder name="content">
<TreeView.Folder name="(1 Getting Started)">
<TreeView.File name="index.md">
{#snippet icon()}
<IconMarkdown class="size-4 stroke-orange-500" />
{/snippet}
</TreeView.File>
<TreeView.File name="installation.md">
{#snippet icon()}
<IconMarkdown class="size-4 stroke-orange-500" />
{/snippet}
</TreeView.File>
<TreeView.File name="authoring.md">
{#snippet icon()}
<IconMarkdown class="size-4 stroke-orange-500" />
{/snippet}
</TreeView.File>
</TreeView.Folder>
<TreeView.Folder name="(2 Components)">
<TreeView.File name="button.md">
{#snippet icon()}
<IconMarkdown class="size-4 stroke-orange-500" />
{/snippet}
</TreeView.File>
</TreeView.Folder>
<TreeView.File name="version.yaml" />
</TreeView.Folder>
</TreeView.Root>

### 1.2 Groups

Directories wrapped in parentheses define a **group**. The group name appears in the sidebar and on the `/docs` overview, but never in the URL.

```text
(1 Getting Started)/   ? group "Getting Started"
(2 Components)/        ? group "Components"
```

The leading number controls the **group order** in the sidebar. Without a number, the group sorts alphabetically after all numbered groups.

### 1.3 Sorting Documents Within a Group

By default, documents inside a group sort alphabetically. Use the `order` frontmatter field to set an explicit position:

```md
---
title: 'Installation'
order: 1
---
```

Lower numbers appear first. Documents without `order` sort alphabetically after those with `order`.

### 1.4 Frontmatter Reference

Every document requires at minimum `title`, `description`, and `since`.

```md
---
title: 'My Page'            # required – shown as heading and in nav
description: 'Short blurb.' # required – shown in overview cards and meta
since: '1.0.0'              # required – first version this page appears in
until: '2.0.0'              # optional – exclusive upper bound; omit = no limit
order: 1                    # optional – explicit sort position within group
navLabel: 'Short Name'      # optional – overrides title in sidebar/nav only
indicator: 'new'            # optional – 'new', 'updated', 'deprecated', 'removed' badge
hidden: false               # optional – hide page from the sidenav
tocLevel: 3                 # optional – max header level shown in table of contents
links:
  source: 'https://...'     # optional – source code link
---
```

### 1.5 Special Case: index.md

A file named `index.md` inside a group maps to the **group's root URL**, not to a path with `/index`.

| File | URL |
|------|-----|
| `(1 Getting Started)/index.md` | `/docs` |
| `(2 Components)/index.md` | `/docs/components` _(if that were the slug)_ |
| `(1 Getting Started)/installation.md` | `/docs/installation` |

> `index.md` in the first group maps directly to `/docs` since there is no sub-path prefix per group ? slugs are flat.

---

## 2. Markdown

Standard [GitHub Flavored Markdown](https://github.github.com/gfm/) is supported, along with several typographic extensions.

### 2.1 Text Formatting

Headers, paragraphs, emphasis, blockquotes, and lists all work as standard Markdown. GFM additionally adds:

- ~~Strikethrough~~ `~~Strikethrough~~`
- Task lists: `- [ ] <Item>` / `- [x] <Item>`
- Autolinks

### 2.2 Code Blocks

Fenced code blocks are syntax-highlighted via Shiki.

````md
```ts
const greeting = 'Hello, world!';
```
````

```ts
const greeting = 'Hello, world!';
```

#### Line Highlighting

Highlight specific lines by adding a range in curly braces after the language tag:

````md
```ts {2,4-6}
const a = 1;
const b = 2;
const c = 3;
const d = 4;
const e = 5;
const f = 6;
```
````

```ts {2,4-6}
const a = 1;
const b = 2;
const c = 3;
const d = 4;
const e = 5;
const f = 6;
```

#### Diff Highlighting

Mark lines as added or removed by appending `// [!code ++]` or `// [!code --]` after the line content. The comment is stripped from the rendered output.

````md
```ts
export function greet(name: string) {
  return `Hello, ${name}!`; // [!code --]
  return `Hi, ${name}!`; // [!code ++]
}
```
````

```ts
export function greet(name: string) {
  return `Hello, ${name}!`; // [!code --]
  return `Hi, ${name}!`; // [!code ++]
}
```

Can be combined with `{n}` line highlighting:

````md
```svelte {1}
<script lang="ts"> // [!code --]
<script lang="ts" generics="T"> // [!code ++]
  let { value }: { value: T } = $props();
</script>
```
````

```svelte {1}
<script lang="ts"> // [!code --]
<script lang="ts" generics="T"> // [!code ++]
  let { value }: { value: T } = $props();
</script>
```

#### Import Code From a File

Use `remark-code-import` to pull in a file's content directly:

````md
```ts
// file=./src/lib/utils/url.ts
```
````

The path is relative to the markdown file.

### 2.3 Links

Standard Markdown links and autolinks (from GFM) work as expected. For an internal link styled as a UI component, see the [Link](#link) component in the Svelte Components section.

### 2.4 Images

Standard Markdown image syntax (`![alt](src)`) is supported.

### 2.5 Tables

```md
| Column A | Column B |
|----------|----------|
| value    | value    |
```

| Column A | Column B |
|----------|----------|
| value 1  | value 2  |
| value 3  | value 4  |

---

## 3. Custom Markdown Extensions

### 3.1 Callout Blocks

Add contextual callouts using GitHub-style blockquote syntax ? no import required.

#### Default Variants

```md
> [!INFO]
> This is an informational message.

> [!SUCCESS]
> Operation completed successfully.

> [!WARNING]
> Be careful with this approach.

> [!ERROR]
> Something went wrong.
```

> [!INFO]
> This is an informational message. Use `INFO` for general context.

> [!SUCCESS]
> Operation completed successfully. Use `SUCCESS` to confirm outcomes.

> [!WARNING]
> Be careful with this approach. Use `WARNING` to flag potential issues.

> [!ERROR]
> Something went wrong. Use `ERROR` to highlight critical problems.

#### Additional Variants

Additional variants with same stylings contain: `NOTE`, `TIP`, `IMPORTANT`.

```md
> [!NOTE]
> A neutral note with the same style as Info.

> [!TIP]
> A helpful tip or shortcut for the reader.

> [!IMPORTANT]
> An important note.
```

> [!NOTE]
> A neutral note with the same style as Info.

> [!TIP]
> A helpful tip or shortcut for the reader.

> [!IMPORTANT]
> An important note.

#### Custom Title

```md
> [!INFO] Custom Title
> This is an informational message.

> [!SUCCESS] Custom Title
> Operation completed successfully.

> [!WARNING] Custom Title
> Be careful with this approach.

> [!ERROR] Custom Title
> Something went wrong.
```

> [!INFO] Custom Title
> This is an informational message.

> [!SUCCESS] Custom Title
> Operation completed successfully.

> [!WARNING] Custom Title
> Be careful with this approach.

> [!ERROR] Custom Title
> Something went wrong.

### 3.2 Definition Lists

Use pandoc-style definition list syntax:

```md
Term
: Definition text.

Another term
: First definition.
: Second definition.
```

Term
: Definition text.

Another term
: First definition.
: Second definition.

### 3.3 Abbreviations

Define abbreviations once at the bottom of the file ? every occurrence in the text gets an `<abbr>` tooltip automatically:

```md
The HTML spec defines how CSS works.

*[HTML]: HyperText Markup Language
*[CSS]: Cascading Style Sheets
```

The HTML spec defines how CSS works.

*[HTML]: HyperText Markup Language
*[CSS]: Cascading Style Sheets

### 3.4 Symbols & Smart Punctuation

`remark-smartypants` converts ASCII punctuation to proper typographic characters:

| Input | Output |
|-------|--------|
| `"quotes"` | "quotes" |
| `'single'` | 'single' |
| `--` | -- |
| `---` | --- |
| `...` | ... |

Additional symbol replacements:

| Input | Output |
|-------|--------|
| `(c)` | (c) |
| `(r)` | (r) |
| `(tm)` | (tm) |

### 3.5 Subscript & Superscript

```md
H~2~O reacts with Na to form NaOH.

E = mc^2^ is Einstein's famous equation.
```

H~2~O reacts with Na to form NaOH.

E = mc^2^ is Einstein's famous equation.

---

## 4. Svelte Components

Markdown files support a `<script>` block at the top. Import components and use them inline anywhere in the file.

```svelte
<script lang="ts">
  import { Button } from '$lib/components/ui/button';
</script>
```

Components must be placed **outside** paragraph blocks ? put them on their own lines.

### Accordion

```svelte {2, 5-15}
<script lang="ts">
	import * as Accordion from '$lib/components/ui/accordion';
</script>

<Accordion.Root type="single">
  <Accordion.Item value="q1">
    <Accordion.Trigger>What is this?</Accordion.Trigger>
    <Accordion.Content>A docs site for your project.</Accordion.Content>
  </Accordion.Item>
  <Accordion.Item value="q2">
    <Accordion.Trigger>How do I add pages?</Accordion.Trigger>
    <Accordion.Content>Drop a .md file into a group directory.</Accordion.Content>
  </Accordion.Item>
</Accordion.Root>
```

<div class="not-prose my-4 rounded-lg border p-4">
	<Accordion.Root type="single">
		<Accordion.Item value="q1">
			<Accordion.Trigger>What is this?</Accordion.Trigger>
			<Accordion.Content>A docs site for your project.</Accordion.Content>
		</Accordion.Item>
		<Accordion.Item value="q2">
			<Accordion.Trigger>How do I add pages?</Accordion.Trigger>
			<Accordion.Content>Drop a .md file into a group directory.</Accordion.Content>
		</Accordion.Item>
	</Accordion.Root>
</div>

---

### Avatar

```svelte {2, 5-14}
<script lang="ts">
	import * as Avatar from '$lib/components/ui/avatar';
</script>

<Avatar.Root>
  <Avatar.Fallback>AB</Avatar.Fallback>
</Avatar.Root>

<Avatar.Group>
  <Avatar.Root><Avatar.Fallback>AB</Avatar.Fallback></Avatar.Root>
  <Avatar.Root><Avatar.Fallback>CD</Avatar.Fallback></Avatar.Root>
  <Avatar.Root><Avatar.Fallback>EF</Avatar.Fallback></Avatar.Root>
  <Avatar.GroupCount count={12} />
</Avatar.Group>
```

<div class="not-prose my-4 flex flex-wrap items-center gap-6 rounded-lg border p-4">
	<Avatar.Root size="lg">
		<Avatar.Fallback>AB</Avatar.Fallback>
	</Avatar.Root>
	<Avatar.Group>
		<Avatar.Root><Avatar.Fallback>AB</Avatar.Fallback></Avatar.Root>
		<Avatar.Root><Avatar.Fallback>CD</Avatar.Fallback></Avatar.Root>
		<Avatar.Root><Avatar.Fallback>EF</Avatar.Fallback></Avatar.Root>
		<Avatar.GroupCount count={12} />
	</Avatar.Group>
</div>

---

### Badge

```svelte {2, 5-8}
<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';
</script>

<Badge>Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="outline">Outline</Badge>
<Badge variant="destructive">Destructive</Badge>
```

<div class="not-prose my-4 flex flex-wrap items-center gap-2 rounded-lg border p-4">
	<Badge>Default</Badge>
	<Badge variant="secondary">Secondary</Badge>
	<Badge variant="outline">Outline</Badge>
	<Badge variant="destructive">Destructive</Badge>
</div>

---

### Button

```svelte {2, 5-9}
<script lang="ts">
	import { Button } from '$lib/components/ui/button';
</script>

<Button>Default</Button>
<Button variant="outline">Outline</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Destructive</Button>
```

<div class="not-prose my-4 flex flex-wrap items-center gap-2 rounded-lg border p-4">
	<Button>Default</Button>
	<Button variant="outline">Outline</Button>
	<Button variant="secondary">Secondary</Button>
	<Button variant="ghost">Ghost</Button>
	<Button variant="destructive">Destructive</Button>
</div>

---

### Card

```svelte {2, 5-17}
<script lang="ts">
	import * as Card from '$lib/components/ui/card';
</script>

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

<div class="not-prose my-4 rounded-lg border p-4">
	<Card.Root>
		<Card.Header>
			<Card.Title>Card Title</Card.Title>
			<Card.Description>Card Description</Card.Description>
		</Card.Header>
		<Card.Content>
			<p class="text-muted-foreground text-sm">Card Content</p>
		</Card.Content>
		<Card.Footer>
			<p class="text-muted-foreground text-sm">Card Footer</p>
		</Card.Footer>
	</Card.Root>
</div>

---

### Collapsible

```svelte {2, 5-12}
<script lang="ts">
	import * as Collapsible from '$lib/components/ui/collapsible';
</script>

<Collapsible.Root class="rounded-lg border p-4 space-y-2">
  <Collapsible.Trigger class="flex w-full items-center justify-between text-sm font-medium cursor-pointer">
    Show advanced options
    <span class="text-muted-foreground text-xs">?</span>
  </Collapsible.Trigger>
  <Collapsible.Content class="text-muted-foreground text-sm pt-2 border-t">
    These options are hidden by default and revealed on demand.
  </Collapsible.Content>
</Collapsible.Root>
```

<div class="not-prose my-4 rounded-lg border p-4">
	<Collapsible.Root class="space-y-2">
		<Collapsible.Trigger class="flex w-full items-center justify-between text-sm font-medium cursor-pointer">
			Show advanced options
			<span class="text-muted-foreground text-xs">?</span>
		</Collapsible.Trigger>
		<Collapsible.Content class="text-muted-foreground text-sm pt-2 border-t">
			These options are hidden by default and revealed on demand.
		</Collapsible.Content>
	</Collapsible.Root>
</div>

---

### Icons

You can use Icons from `@tabler/icons-svelte`. They can be viewed at https://tabler.io/icons.

```svelte {2, 5-6}
<script lang="ts">
	import { IconSparkleHighlight, IconDownload } from '@tabler/icons-svelte'; 
</script>

<IconSparkleHighlight class="size-5" />
<IconDownload class="size-5 stroke-muted-foreground" />
```

<div class="not-prose my-4 rounded-lg flex flex-row gap-4 border p-4">
	<IconSparkleHighlight class="size-5" />
    <IconDownload class="size-5 stroke-muted-foreground" />
</div>

---

### Kbd

```svelte {2, 5-9}
<script lang="ts">
	import * as Kbd from '$lib/components/ui/kbd';
</script>

<Kbd.Group>
  <Kbd.Root>Ctrl</Kbd.Root>
  <span>+</span>
  <Kbd.Root>K</Kbd.Root>
</Kbd.Group>
```

<div class="not-prose my-4 rounded-lg border p-4">
	<Kbd.Group>
		<Kbd.Root>Ctrl</Kbd.Root>
		<span>+</span>
		<Kbd.Root>K</Kbd.Root>
	</Kbd.Group>
</div>

---

### Link

```svelte {2, 5}
<script lang="ts">
	import { Link } from '$lib/components/ui/link';
</script>

<Link href="/docs">Back to docs</Link>
```

<div class="not-prose my-4 rounded-lg border p-4">
	<Link href="/docs">Back to docs</Link>
</div>

---

### Progress

```svelte {2, 5-7}
<script lang="ts">
	import { Progress } from '$lib/components/ui/progress';
</script>

<Progress value={33} />
<Progress value={66} class="mt-2" />
<Progress value={100} class="mt-2" />
```

<div class="not-prose my-4 flex flex-col gap-3 rounded-lg border p-4">
	<Progress value={33} />
	<Progress value={66} />
	<Progress value={100} />
</div>

---

### Separator

```svelte {2, 5-6}
<script lang="ts">
	import { Separator } from '$lib/components/ui/separator';
</script>

<Separator />
<Separator orientation="vertical" class="h-6" />
```

<div class="not-prose my-4 flex flex-col gap-4 rounded-lg border p-4">
	<Separator />
	<div class="flex h-6 items-center gap-4">
		<span class="text-sm">Left</span>
		<Separator orientation="vertical" />
		<span class="text-sm">Right</span>
	</div>
</div>

---

### Skeleton

Represents loading state placeholders.

```svelte {2, 5-10}
<script lang="ts">
	import { Skeleton } from '$lib/components/ui/skeleton';
</script>

<div class="flex items-center gap-4">
  <Skeleton class="size-10 rounded-full" />
  <div class="space-y-2">
    <Skeleton class="h-4 w-48" />
    <Skeleton class="h-4 w-32" />
  </div>
</div>
```

<div class="not-prose my-4 rounded-lg border p-4">
	<div class="flex items-center gap-4">
		<Skeleton class="size-10 rounded-full" />
		<div class="space-y-2">
			<Skeleton class="h-4 w-48" />
			<Skeleton class="h-4 w-32" />
		</div>
	</div>
</div>

---

### Snippet

Renders a copyable command or code string.

```svelte {2, 5-6}
<script lang="ts">
	import { Snippet } from '$lib/components/ui/snippet';
</script>

<Snippet text="bun add shadcn-svelte" />
<Snippet text="npm install shadcn-svelte" variant="secondary" />
```

<div class="not-prose my-4 flex flex-col gap-2 rounded-lg border p-4">
	<Snippet text="bun add shadcn-svelte" />
	<Snippet text="npm install shadcn-svelte" variant="secondary" />
</div>

---

### Tabs

```svelte {2, 5-16}
<script lang="ts">
	import * as Tabs from '$lib/components/ui/tabs';
</script>

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

<div class="not-prose my-4 rounded-lg border p-4">
	<Tabs.Root value="tab-1">
		<Tabs.List>
			<Tabs.Trigger value="tab-1">Tab 1</Tabs.Trigger>
			<Tabs.Trigger value="tab-2">Tab 2</Tabs.Trigger>
		</Tabs.List>
		<Tabs.Content value="tab-1">
			<p class="text-muted-foreground pt-2 text-sm">Content of Tab 1</p>
		</Tabs.Content>
		<Tabs.Content value="tab-2">
			<p class="text-muted-foreground pt-2 text-sm">Content of Tab 2</p>
		</Tabs.Content>
	</Tabs.Root>
</div>

#### Markdown Tabs

Import `.md` files and render them inside tab panels:

```svelte {2-4, 7-18}
<script lang="ts">
	import * as Tabs from '$lib/components/ui/tabs';
	import Tab1Page from './(tabs)/tab1.md';
	import Tab2Page from './(tabs)/tab2.md';
</script>

<Tabs.Root value="tab-1">
  <Tabs.List>
    <Tabs.Trigger value="tab-1">Tab 1</Tabs.Trigger>
    <Tabs.Trigger value="tab-2">Tab 2</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value="tab-1">
    <Tab1Page />
  </Tabs.Content>
  <Tabs.Content value="tab-2">
    <Tab2Page />
  </Tabs.Content>
</Tabs.Root>
```

<div class="not-prose my-4 rounded-lg border p-4">
	<Tabs.Root value="tab-1">
		<Tabs.List>
			<Tabs.Trigger value="tab-1">Tab 1</Tabs.Trigger>
			<Tabs.Trigger value="tab-2">Tab 2</Tabs.Trigger>
		</Tabs.List>
		<Tabs.Content value="tab-1">
			<Tab1Page />
		</Tabs.Content>
		<Tabs.Content value="tab-2">
			<Tab2Page />
		</Tabs.Content>
	</Tabs.Root>
</div>

---

### Terminal

Animated terminal with typewriter effects.

```svelte {2, 5-10}
<script lang="ts">
	import * as Terminal from '$lib/components/ui/terminal';
</script>

<Terminal.Root>
  <Terminal.TypingAnimation>$ bun add shadcn-svelte</Terminal.TypingAnimation>
  <Terminal.AnimatedSpan delay={200} class="text-green-400">
    ? Packages installed successfully.
  </Terminal.AnimatedSpan>
</Terminal.Root>
```

<div class="not-prose my-4 rounded-lg border p-4 py-6">
	<Terminal.Root>
		<Terminal.TypingAnimation>$ bun add shadcn-svelte</Terminal.TypingAnimation>
		<Terminal.AnimatedSpan delay={200} class="text-green-400">
			? Packages installed successfully.
		</Terminal.AnimatedSpan>
		<Terminal.AnimatedSpan delay={400} class="text-muted-foreground">
			Ready in 0.8s.
		</Terminal.AnimatedSpan>
	</Terminal.Root>
</div>

---

### Toggle

```svelte {2, 5-7}
<script lang="ts">
	import { Toggle } from '$lib/components/ui/toggle';
</script>

<Toggle>Default</Toggle>
<Toggle variant="outline">Outline</Toggle>
<Toggle pressed>Pressed</Toggle>
```

<div class="not-prose my-4 flex flex-wrap items-center gap-2 rounded-lg border p-4">
	<Toggle>Default</Toggle>
	<Toggle variant="outline">Outline</Toggle>
	<Toggle pressed>Pressed</Toggle>
</div>

---

### ToggleGroup

```svelte {2-3, 6-14}
<script lang="ts">
	import * as ToggleGroup from '$lib/components/ui/toggle-group';
	import { IconBold, IconItalic, IconUnderline } from '@tabler/icons-svelte';
</script>

<ToggleGroup.Root type="single">
  <ToggleGroup.Item value="bold">
    <IconBold class="size-4" />
  </ToggleGroup.Item>
  <ToggleGroup.Item value="italic">
    <IconItalic class="size-4" />
  </ToggleGroup.Item>
  <ToggleGroup.Item value="underline">
    <IconUnderline class="size-4" />
  </ToggleGroup.Item>
</ToggleGroup.Root>
```

<div class="not-prose my-4 flex flex-wrap items-center gap-4 rounded-lg border p-4">
	<ToggleGroup.Root type="single" value="bold">
		<ToggleGroup.Item value="bold"><IconBold class="size-4" /></ToggleGroup.Item>
		<ToggleGroup.Item value="italic"><IconItalic class="size-4" /></ToggleGroup.Item>
		<ToggleGroup.Item value="underline"><IconUnderline class="size-4" /></ToggleGroup.Item>
	</ToggleGroup.Root>
	<ToggleGroup.Root type="multiple" variant="outline">
		<ToggleGroup.Item value="bold"><IconBold class="size-4" /></ToggleGroup.Item>
		<ToggleGroup.Item value="italic"><IconItalic class="size-4" /></ToggleGroup.Item>
		<ToggleGroup.Item value="underline"><IconUnderline class="size-4" /></ToggleGroup.Item>
	</ToggleGroup.Root>
</div>

---

### Tooltip

```svelte {2, 5-8}
<script lang="ts">
	import * as Tooltip from '$lib/components/ui/tooltip';
</script>

<Tooltip.Root>
  <Tooltip.Trigger>Hover me</Tooltip.Trigger>
  <Tooltip.Content>This is a tooltip</Tooltip.Content>
</Tooltip.Root>
```

<div class="not-prose my-4 rounded-lg border p-4">
	<Tooltip.Root>
		<Tooltip.Trigger>
			<Button variant="outline">Hover me</Button>
		</Tooltip.Trigger>
		<Tooltip.Content>This is a tooltip</Tooltip.Content>
	</Tooltip.Root>
</div>

---

### TreeView

```svelte {2-3, 6-22}
<script lang="ts">
	import * as TreeView from '$lib/components/ui/tree-view';
	import { IconBrandSvelte, IconFolderOpen, IconFolderCode } from '@tabler/icons-svelte';
</script>

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

<TreeView.Root class="my-4 rounded-lg border p-4 font-mono text-sm">
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

---

### Window

```svelte {2, 5-7}
<script lang="ts">
	import { Window } from '$lib/components/ui/window';
</script>

<Window>
  <p>Window content goes here.</p>
</Window>
```

<div class="not-prose my-4 rounded-lg py-4">
	<Window>
		<p>Window content goes here.</p>
	</Window>
</div>