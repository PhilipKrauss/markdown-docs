<script lang="ts">
	import { cn } from '$lib/utils.js';
	import type { HTMLAttributes } from 'svelte/elements';

	let { class: className, children, ...restProps }: HTMLAttributes<HTMLTableRowElement> = $props();
</script>

<tr class={cn('border-border border-b transition-colors hover:bg-muted/50', className)} {...restProps}>
	{@render children?.()}
</tr>
