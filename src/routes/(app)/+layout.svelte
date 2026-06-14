<script lang="ts">
	import { commandContext } from '$lib/context';
	import { shortcut } from '$lib/actions/shortcut.svelte';
	import { Command } from '$lib/components/docs/command';
	import { UseBoolean } from '$lib/hooks/use-boolean.svelte';
	import { UserConfigContext } from '$lib/user-config.svelte';
	import SiteHeader from '$lib/components/site-header.svelte';

	let { children } = $props();

	const commandState = commandContext.set(new UseBoolean(false));
	const userConfig = UserConfigContext.get();
</script>

<svelte:window
	use:shortcut={{
		ctrl: true,
		key: 'k',
		callback: commandState.setTrue
	}}
/>

<Command />

<SiteHeader />
<div class="flex flex-col items-center">
	<div class={userConfig.current.layout === 'full' ? 'w-full px-4 sm:px-6 lg:px-8' : 'site-container'}>
		{@render children()}
	</div>
</div>
