<script lang="ts">
	import type { Snippet as SnippetType } from 'svelte';
	import { Badge } from '$lib/components/ui/badge';
	import * as Navigation from '$lib/components/ui/prev-next';
	import { UseToc, filterTocByLevel } from '$lib/hooks/use-toc.svelte';
	import * as Toc from '$lib/components/ui/toc';
	import * as ScrollArea from '$lib/components/ui/scroll-area';
	import Button from '$lib/components/button.svelte';
	import * as Tooltip from './ui/tooltip';
	import { useDocs } from '$lib/features/docs/docs-context.svelte';
	import { versionedHref } from '$lib/features/docs/docs';
	import {IconArrowLeft, IconArrowRight, IconCode} from "@tabler/icons-svelte";
	import CopyMarkdownButton from './copy-markdown-button.svelte';
	import { UserConfigContext } from '$lib/user-config.svelte';
	import {cn} from "$lib/utils";

	const userConfig = UserConfigContext.get();
	const isWide = $derived(userConfig.current.layout === 'full');

	type Props = {
		children: SnippetType;
	};

	let { children }: Props = $props();

	const toc = new UseToc();

	const docsState = useDocs();
	const version = $derived(docsState.version);

	const visibleToc = $derived.by(() => {
		const level = docsState.doc?.doc.tocLevel;
		return level != null ? filterTocByLevel(toc.current, level) : toc.current;
	});
</script>

<div class={cn('relative flex w-full justify-center gap-4 px-6 py-6 lg:gap-10 lg:py-8', !isWide ? 'xl:grid xl:grid-cols-[1fr_300px]' : '')}>
	<div class={cn('mx-auto w-full min-w-0', !isWide ? 'max-w-4xl' : '')} style="min-height: calc(100dvh - var(--header-height) - 4rem);">
		<div class="flex flex-col">
			<div class="mb-5 flex flex-col gap-1">
				<div class="flex items-start justify-between gap-2">
					<h1 class="text-4xl font-bold">
						{docsState.doc?.doc.title}
					</h1>
					<div class="hidden items-center gap-2 md:flex">
						<CopyMarkdownButton />
						<Tooltip.Root>
							<Tooltip.Trigger>
								{#snippet child({ props })}
									<Button
										{...props}
										variant="secondary"
										size="icon"
										class="size-8"
										href={docsState.doc?.prev ? versionedHref(docsState.doc.prev.href, version) : undefined}
										data-umami-event="Navigate backward arrow"
										disabled={!docsState.doc?.prev}
									>
										<IconArrowLeft class="size-4" />
									</Button>
								{/snippet}
							</Tooltip.Trigger>
							<Tooltip.Content>
								{docsState.doc?.prev?.title ?? ''}
							</Tooltip.Content>
						</Tooltip.Root>
						<Tooltip.Root>
							<Tooltip.Trigger>
								{#snippet child({ props })}
									<Button
										{...props}
										variant="secondary"
										size="icon"
										class="size-8"
										href={docsState.doc?.next ? versionedHref(docsState.doc.next.href, version) : undefined}
										data-umami-event="Navigate forward arrow"
										disabled={!docsState.doc?.next}
									>
										<IconArrowRight class="size-4" />
									</Button>
								{/snippet}
							</Tooltip.Trigger>
							<Tooltip.Content>
								{docsState.doc?.next?.title ?? ''}
							</Tooltip.Content>
						</Tooltip.Root>
					</div>
				</div>
				<p class="text-muted-foreground! text-lg pt-2">
					{docsState.doc?.doc.description}
				</p>
				<div class="flex flex-wrap place-items-center gap-1">
					{#if docsState.doc?.doc.links?.source}
						<Badge
							href={docsState.doc?.doc.links?.source}
							variant="secondary"
							target="_blank"
							class="flex w-fit place-items-center gap-1 rounded-md"
						>
							<span class="font-semibold">Source</span>
							<IconCode class="size-3.5" />
						</Badge>
					{/if}
				</div>
			</div>
			<div bind:this={toc.ref} style="display: contents;" class="page-wrapper">
				{@render children()}
			</div>
		</div>
		<Navigation.Root class="pt-10">
			{#snippet previous()}
				{#if docsState.doc?.prev}
					<Navigation.Previous href={versionedHref(docsState.doc.prev.href, version)}>
						{docsState.doc?.prev.title}
					</Navigation.Previous>
				{/if}
			{/snippet}
			{#snippet next()}
				{#if docsState.doc?.next}
					<Navigation.Next href={versionedHref(docsState.doc.next.href, version)}>
						{docsState.doc?.next.title}
					</Navigation.Next>
				{/if}
			{/snippet}
		</Navigation.Root>
	</div>
	<div class={cn('hidden xl:block min-w-56', isWide ? 'pr-4' : '')}>
		<div class="sticky top-[calc(var(--header-height)+2rem)] flex h-[calc(100vh-var(--header-height)-4rem)] flex-col gap-2">
			<span class="text-foreground text-base font-medium py-2 mt-2 whitespace-nowrap">Table of Contents</span>
			<ScrollArea.Root class="min-h-0 flex-1">
				<div class="pb-10 pr-6">
					<Toc.Root toc={visibleToc} />
				</div>
			</ScrollArea.Root>
		</div>
	</div>
</div>
