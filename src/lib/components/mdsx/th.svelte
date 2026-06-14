<script lang="ts">
	import { cn } from '$lib/utils.js';
	import type { HTMLThAttributes } from 'svelte/elements';

	let { class: className, children, ...restProps }: HTMLThAttributes = $props();
</script>

<th
	class={cn(
		'h-10 px-4 text-left align-middle font-medium text-muted-foreground [&[align=center]]:text-center [&[align=right]]:text-right',
		className
	)}
	{...restProps}
>
	{@render children?.()}
</th>
