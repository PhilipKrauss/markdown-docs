<script lang="ts">
	import * as Select from '$lib/components/ui/select';
	import { allVersions, latestStable } from '$lib/features/docs/versions';
	import { getDocsForVersion } from '$lib/features/docs/docs';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { IconTags } from '@tabler/icons-svelte';

	let { version }: { version: string } = $props();

	function switchVersion(targetVersion: string) {
		const currentSlug = page.params.slug ?? '';
		const targetDocs = getDocsForVersion(targetVersion);
		const exists = targetDocs.some((doc) =>
			doc.href === '/docs' ? currentSlug === '' : doc.href.replace(/^\/docs\//, '') === currentSlug
		);
		goto(exists ? `/docs/${targetVersion}/${currentSlug}` : `/docs/${targetVersion}`);
	}

	const isLatest = $derived(version === latestStable.version);
	const currentVersion = $derived(allVersions.find((v) => v.version === version));
	const isStable = $derived(currentVersion?.stable ?? true);
	const isOutdated = $derived(currentVersion?.outdated ?? false);
	const versionLabel = $derived(currentVersion?.label ?? version);

	const groupedVersions = $derived.by(() => {
		const groups = new Map<string, typeof allVersions>();
		for (const v of [...allVersions].reverse()) {
			const major = `v${v.version.split('.')[0]}`;
			if (!groups.has(major)) groups.set(major, []);
			groups.get(major)!.push(v);
		}
		return groups;
	});
</script>

<div class="px-2 pb-2">
	<Select.Root type="single" value={version} onValueChange={(v) => v && switchVersion(v)}>
		<Select.Trigger size="sm" class="h-7 w-full gap-1.5 border-transparent bg-transparent px-1.5 text-xs font-medium shadow-none hover:border-border hover:bg-accent">
			<div class="flex flex-row gap-2 w-full">
				<IconTags class="text-muted-foreground size-3.5 shrink-0" />
				<span class="truncate">{versionLabel}</span>
				<div class="flex flex-row gap-2 ml-auto">
					{#if isLatest}
						<span class="ml-auto text-muted-foreground">latest</span>
					{/if}
					{#if !isStable}
						<span class="ml-auto text-warning">unstable</span>
					{/if}
					{#if isOutdated}
						<span class="ml-auto text-destructive">outdated</span>
					{/if}
				</div>
			</div>
		</Select.Trigger>
		<Select.Content>
			{#each groupedVersions as [major, versions] (major)}
				<Select.Group>
					<Select.GroupHeading>{major}</Select.GroupHeading>
					{#each versions as v (v.version)}
						<Select.Item value={v.version} label={v.label ?? v.version}>
							<span class="flex-1">{v.label ?? v.version}</span>
							{#if v.version === latestStable.version}
								<span class="text-muted-foreground ml-2 text-xs">latest</span>
							{/if}
							{#if !v.stable}
								<span class="text-warning ml-1 text-xs">unstable</span>
							{/if}
							{#if v.outdated}
								<span class="text-destructive ml-1 text-xs">outdated</span>
							{/if}
						</Select.Item>
					{/each}
				</Select.Group>
			{/each}
		</Select.Content>
	</Select.Root>
</div>