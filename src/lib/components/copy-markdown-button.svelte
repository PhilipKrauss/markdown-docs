<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { buttonVariants } from '$lib/components/ui/button';
	import { cn } from '$lib/utils';
	import { page } from '$app/state';
	import { useDocs } from '$lib/features/docs/docs-context.svelte';
	import { UseClipboard } from '$lib/hooks/use-clipboard.svelte';
	import { scale } from 'svelte/transition';
	import { IconCode, IconCheck, IconChevronDown, IconLink, IconMarkdown } from "@tabler/icons-svelte";
	import { PUBLIC_CONTENT_SOURCE_URL } from '$env/static/public';

	const docs = useDocs();

	const pageHref = $derived(new URL(`/docs/${docs.version}/${docs.doc.doc.slug}`, page.url.origin).href);

	const markdownViewHref = $derived(new URL(`/docs/${docs.version}/${docs.doc.doc.slug}.md`, page.url.origin).href);

	const source = $derived(`${PUBLIC_CONTENT_SOURCE_URL.replace(/\/$/, '')}/${docs.doc.doc.path}.md`);

	const clipboard = new UseClipboard({ delay: 1000 });
</script>

<div class="flex items-center gap-0">
	<button
		type="button"
		class={cn(
			buttonVariants({ variant: 'secondary', size: 'sm' }),
			'flex items-center gap-2 rounded-r-none md:text-[0.8rem]'
		)}
		onclick={() => clipboard.copy(pageHref)}
	>
		{#if clipboard.copied}
			<div in:scale={{ duration: 500, start: 0.85 }}>
				<IconCheck tabindex={-1} />
			</div>
		{:else}
			<div in:scale={{ duration: 500, start: 0.85 }}>
				<IconLink tabindex={-1} />
			</div>
		{/if}
		Copy Link
	</button>
	<DropdownMenu.Root>
		<DropdownMenu.Trigger
			class={cn(
				buttonVariants({ variant: 'secondary', size: 'icon-sm' }),
				'rounded-l-none border-l-0'
			)}
		>
			<IconChevronDown class="size-4" />
		</DropdownMenu.Trigger>
		<DropdownMenu.Content align="end" class="min-w-48">
			<DropdownMenu.Item>
				{#snippet child({ props })}
					<a {...props} href={markdownViewHref} target="_blank" rel="noopener noreferrer">
						<IconMarkdown class="text-muted-foreground size-4 shrink-0" />
						View as Markdown
					</a>
				{/snippet}
			</DropdownMenu.Item>
			<DropdownMenu.Separator />
			<DropdownMenu.Item>
				{#snippet child({ props })}
					<a {...props} href={source} target="_blank" rel="noopener noreferrer">
						<IconCode class="text-muted-foreground size-4 shrink-0" />
						View Source
					</a>
				{/snippet}
			</DropdownMenu.Item>
		</DropdownMenu.Content>
	</DropdownMenu.Root>
</div>
