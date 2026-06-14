<script lang="ts">
	import Logo from './logo.svelte';
	import { LightSwitch } from './ui/light-switch';
	import { Separator } from './ui/separator';
	import MobileSheet from './mobile-sheet.svelte';
	import SearchButton from './search-button.svelte';
	import { UserConfigContext } from '$lib/user-config.svelte';
	import LayoutToggle from './layout-toggle.svelte';
	import {cn} from "$lib/utils";

	const userConfig = UserConfigContext.get();
	const isWide = $derived(userConfig.current.layout === 'full');
</script>

<header class="bg-background/80 backdrop-blur-2xl sticky top-0 z-10 flex flex-col items-center">
	<div class={cn('flex h-(--header-height) items-center justify-between', isWide ? 'w-full px-4 sm:px-6 lg:px-8' : 'site-container')}>
		<MobileSheet />
		<div class="hidden items-center md:flex gap-2">
			<a href="/">
				<Logo class="mr-2 size-6" />
			</a>
			{@render HeaderLink({ href: '/docs', name: 'Docs' })}
		</div>
		<div class="flex items-center gap-2 **:data-[slot=separator]:h-4!">
			<SearchButton />
			<Separator orientation="vertical" class="hidden 2xl:block" />
			<LayoutToggle variant="ghost" size="sm" />
			<Separator orientation="vertical" class="hidden xl:block" />
			<LightSwitch variant="ghost" size="sm" />
		</div>
	</div>
</header>

{#snippet HeaderLink({ href, name }: { href: string; name: string })}
	<a {href} class="hover:bg-secondary flex h-7 items-center justify-center rounded-md px-2.5 text-sm transition-all">
		{name}
	</a>
{/snippet}
