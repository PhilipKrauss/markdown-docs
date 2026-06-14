<script lang="ts">
    import { ModeWatcher } from 'mode-watcher';
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
    import {UserConfig, UserConfigContext} from "$lib/user-config.svelte";

	let { data, children } = $props();

    // svelte-ignore state_referenced_locally
    UserConfigContext.set(new UserConfig(data.userConfig));
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<ModeWatcher />
{@render children()}
