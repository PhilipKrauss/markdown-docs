<script lang="ts">
	import { Kbd, KbdGroup } from '$lib/components/ui/kbd';
	import Button from '$lib/components/button.svelte';
	import { cn } from '$lib/utils.js';
	import { commandContext } from '$lib/context';
	import { cmdOrCtrl } from '$lib/hooks/is-mac.svelte';
	import {IconSearch} from "@tabler/icons-svelte";

	type Props = {
		class?: string;
	};

	let { class: className }: Props = $props();

	const commandState = commandContext.get();
</script>

<Button
	variant="outline"
	class={cn('flex place-items-center gap-4 px-2', className)}
	onclick={commandState.setTrue}
>
	<span class="text-muted-foreground flex place-items-center gap-2">
		<IconSearch class="inline size-4" />
		Search...
	</span>
	<KbdGroup>
		<Kbd>
			{cmdOrCtrl}
		</Kbd>
		<span>+</span>
		<Kbd>K</Kbd>
	</KbdGroup>
</Button>
