<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Command from '$lib/components/ui/command';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { commandContext } from '$lib/context';
	import { getGroupedDocs, getDocsNotInVersion, versionedHref } from '$lib/features/docs/docs';
	import { allVersions, latestStable } from '$lib/features/docs/versions';

	const version = $derived(page.params.version ?? '');
	const groupedDocs = $derived(getGroupedDocs(version));
	const otherDocs = $derived(getDocsNotInVersion(version, allVersions));
	const currentVersionMeta = $derived(allVersions.find((v) => v.version === version));

	const commandState = commandContext.get();

	function versionLabel(v: string) {
		return v === latestStable.version ? 'latest' : v;
	}

	function versionTags(v: string) {
		const meta = allVersions.find((ver) => ver.version === v);
		return {
			isLatest: v === latestStable.version,
			isUnstable: !(meta?.stable ?? true),
			isOutdated: meta?.outdated ?? false,
		};
	}
</script>

<Dialog.Root bind:open={commandState.current}>
	<Dialog.Content class="top-[35%] p-0" showCloseButton={false}>
		<Command.Root>
			<Command.Input placeholder="Search for Documentation..." />
			<Command.List class="min-h-75">
				<Command.Empty>No results found.</Command.Empty>
				{#each Object.entries(groupedDocs) as [group, routes] (group)}
					<Command.Group heading={group}>
						{#each routes as route (route.title)}
							<Command.Item
								onclick={async () => {
									await goto(versionedHref(route.href, version));
									commandState.setFalse();
								}}
							>
								<span class="flex-1">{route.title}</span>
								<div class="ml-2 -mr-6 flex gap-1 text-xs">
									<span class="text-muted-foreground">{versionLabel(version)}</span>
									{#if currentVersionMeta?.outdated}
										<span class="text-destructive">outdated</span>
									{/if}
								</div>
							</Command.Item>
						{/each}
					</Command.Group>
				{/each}
				{#if otherDocs.length > 0}
					<Command.Group heading="Other Versions">
						{#each otherDocs as { doc, version: docVersion } (doc.slug)}
							<Command.Item
								onclick={async () => {
									await goto(versionedHref(doc.href, docVersion));
									commandState.setFalse();
								}}
							>
								<span class="flex-1">{doc.title}</span>
								{@const tags = versionTags(docVersion)}
								<div class="ml-2 -mr-6 flex gap-1 text-xs">
									<span class="text-muted-foreground">{versionLabel(docVersion)}</span>
									{#if tags.isUnstable}
										<span class="text-warning">unstable</span>
									{/if}
									{#if tags.isOutdated}
										<span class="text-destructive">outdated</span>
									{/if}
								</div>
							</Command.Item>
						{/each}
					</Command.Group>
				{/if}
			</Command.List>
		</Command.Root>
	</Dialog.Content>
</Dialog.Root>
