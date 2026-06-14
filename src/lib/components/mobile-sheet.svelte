<script lang="ts">
	import * as Sheet from '$lib/components/ui/sheet';
	import {getGroupedDocs, versionedHref} from '$lib/features/docs/docs';
	import {page} from "$app/state";
	import {IconMenu2, IconX} from "@tabler/icons-svelte";

	let open = $state(false);

	const version = $derived(page.params.version ?? '');
	const groupedDocs = $derived(getGroupedDocs(version));

	const menuRoutes = [
		{ href: '/', title: 'Home' },
		{ href: '/docs', title: 'Docs' },
	];
</script>

<Sheet.Root bind:open>
	<Sheet.Trigger class="flex items-center gap-2 md:hidden">
		{#if open}
			<IconX class="size-5" />
		{:else}
			<IconMenu2 class="size-5" />
		{/if}
		Menu
	</Sheet.Trigger>
	<Sheet.Content
		showCloseButton={false}
		side="left"
		class="top-(--header-height)! h-[calc(100dvh-var(--header-height))] overflow-y-auto data-[side=left]:w-full"
	>
		<div class="flex flex-col gap-6 px-6 py-6">
			<div class="flex flex-col gap-2">
				<h3 class="text-muted-foreground text-xs">Menu</h3>
				<ul class="flex flex-col gap-2">
					{#each menuRoutes as route (route.href)}
						<li class="flex flex-col gap-2">
							<a href={route.href} class="text-xl" onclick={() => (open = false)}>
								{route.title}
							</a>
						</li>
					{/each}
				</ul>
			</div>
			{#each Object.entries(groupedDocs) as [groupTitle, routes] (groupTitle)}
				<div class="flex flex-col gap-2">
					<h3 class="text-muted-foreground text-xs">{groupTitle}</h3>
					<ul class="flex flex-col gap-2">
						{#each routes as route (route.href)}
							<li class="flex flex-col gap-2">
								<a href={versionedHref(route.href, version)} class="text-xl" onclick={() => (open = false)}>
									{route.title}
								</a>
							</li>
						{/each}
					</ul>
				</div>
			{/each}
		</div>
	</Sheet.Content>
</Sheet.Root>
