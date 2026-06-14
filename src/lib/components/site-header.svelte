<script lang="ts">
	import Logo from './logo.svelte';
	import { LightSwitch } from './ui/light-switch';
	import { Separator } from './ui/separator';
	import MobileSheet from './mobile-sheet.svelte';
	import SearchButton from './search-button.svelte';
</script>

<header class="bg-background sticky top-0 z-10 flex flex-col items-center">
	<div class="site-container flex h-(--header-height) w-full max-w-full items-center justify-between">
		<MobileSheet />
		<div class="hidden items-center md:flex gap-2">
			<a href="/">
				<Logo class="mr-2 size-6" />
			</a>
			{@render HeaderLink({ href: '/docs', name: 'Docs' })}
		</div>
		<div class="flex items-center gap-2 **:data-[slot=separator]:h-4!">
			<SearchButton />
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
