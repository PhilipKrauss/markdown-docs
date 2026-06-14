<script lang="ts" module>
	import type { Size } from '$lib/components/button.svelte';

	export type LightSwitchProps = {
		variant?: 'outline' | 'ghost';
		size?: Size;
	};
</script>

<script lang="ts">
	import { toggleMode } from 'mode-watcher';
	import Button, { sizeMap } from '$lib/components/button.svelte';
	import {IconSun, IconMoonStars} from "@tabler/icons-svelte";

	let { variant = 'outline', size = 'default' }: LightSwitchProps = $props();
</script>

<Button onclick={toggleMode} {variant} size={sizeMap[size].icon}>
	<IconSun class="scale-100 rotate-0 !transition-all dark:scale-0 dark:-rotate-90" />
	<IconMoonStars class="absolute scale-0 rotate-90 !transition-all dark:scale-100 dark:rotate-0" />
	<span class="sr-only">Toggle theme</span>
</Button>
