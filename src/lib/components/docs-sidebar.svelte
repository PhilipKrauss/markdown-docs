<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import {groupedDocs} from '$lib/features/docs/docs';
	import { page } from '$app/state';
	import type { ComponentProps } from 'svelte';
	import { Badge } from './ui/badge';

	let { ref = $bindable(null), ...restProps }: ComponentProps<typeof Sidebar.Root> = $props();

	const pathname = $derived(page.url.pathname);
</script>

{#snippet Indicator(key: string)}
	{#if key === 'new'}
		<span class="bg-success flex size-2 shrink-0 rounded-full" title="New"></span>
	{:else if key === 'updated'}
		<span class="bg-info flex size-2 shrink-0 rounded-full" title="Updated"></span>
	{:else if key === 'deprecated'}
		<span class="bg-warning flex size-2 shrink-0 rounded-full" title="Deprecated"></span>
	{:else if key === 'removed'}
		<span class="bg-error flex size-2 shrink-0 rounded-full" title="Removed"></span>
	{/if}
{/snippet}

{#snippet MenuButton(doc: any)}
	<Sidebar.MenuItem class="w-full">
		<Sidebar.MenuButton
				isActive={doc.href === pathname}
				class="data-[active=true]:bg-accent data-[active=true]:border-accent 3xl:fixed:w-full 3xl:fixed:max-w-48 relative h-7.5 w-fit overflow-clip border border-transparent text-[0.8rem] font-medium after:absolute after:inset-x-0 after:-inset-y-1 after:z-0 after:rounded-md"
				tooltipContent={doc.title}
		>
			{#snippet child({ props })}
				<a href={doc.href} {...props}>
					<span class="absolute inset-0 flex w-(--sidebar-width) bg-transparent"></span>
					<span class="max-w-36 truncate">{doc.navLabel ?? doc.title}</span>
					{@render Indicator(doc.indicator)}
				</a>
			{/snippet}
		</Sidebar.MenuButton>
	</Sidebar.MenuItem>
{/snippet}

<Sidebar.Root
	bind:ref
	class="sticky top-[calc(var(--header-height)+1px)] z-30 hidden h-[calc(100dvh-var(--header-height)-4rem)] overscroll-none bg-transparent lg:flex"
	collapsible="none"
	{...restProps}
>
	<Sidebar.Content class="no-scrollbar overflow-x-hidden px-2">
		<div
			class="from-background via-background/80 to-background/50 sticky -top-1 z-10 h-8 shrink-0 bg-linear-to-b blur-xs"
		></div>
		{#each Object.entries(groupedDocs) as [groupTitle, routes] (groupTitle)}
			<Sidebar.Group>
				<Sidebar.GroupLabel class="text-muted-foreground font-medium">
					{groupTitle}
				</Sidebar.GroupLabel>
				<Sidebar.GroupContent>
					{#if routes.length}
						<Sidebar.Menu class="gap-1">
							{#each routes as doc (doc.href)}
								{@render MenuButton(doc)}
							{/each}
						</Sidebar.Menu>
					{/if}
				</Sidebar.GroupContent>
			</Sidebar.Group>
		{/each}
		<div
			class="from-background via-background/80 to-background/50 sticky -bottom-1 z-10 h-16 shrink-0 bg-linear-to-t blur-xs"
		></div>
	</Sidebar.Content>
</Sidebar.Root>
