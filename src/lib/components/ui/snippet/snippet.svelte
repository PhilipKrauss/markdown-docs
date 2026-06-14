<script lang="ts" module>
	import { cn } from '$lib/utils.js';
	import { tv, type VariantProps } from 'tailwind-variants';
	import { CopyButton } from '$lib/components/ui/copy-button';
	import type { UseClipboard } from '$lib/hooks/use-clipboard.svelte';
	const style = tv({
		base: 'bg-background relative flex w-full max-w-full items-center rounded-md border py-2.5 pr-12 pl-3',
		variants: {
			variant: {
				default: 'border-border bg-card',
				secondary: 'border-border bg-accent',
				destructive: 'border-destructive bg-destructive',
				primary: 'border-primary bg-primary text-primary-foreground'
			}
		}
	});
	type Variant = VariantProps<typeof style>['variant'];
	export type SnippetProps = {
		variant?: Variant;
		text: string | string[];
		class?: string;
		onCopy?: (status: UseClipboard['status']) => void;
	};
</script>
<script lang="ts">
	let { text, variant = 'default', onCopy, class: className }: SnippetProps = $props();
</script>
<div class={cn(style({ variant, className: className }))}>
	<div class="min-w-0 flex-1 overflow-x-auto">
		{#if typeof text == 'string'}
			<pre class={cn('text-left font-mono text-sm font-light whitespace-nowrap')}>{text}</pre>
		{:else}
			{#each text as line, i (i)}
				<pre class={cn('text-left font-mono text-sm font-light whitespace-nowrap')}>{line}</pre>
			{/each}
		{/if}
	</div>
	<CopyButton
			class="hover:text-opacity-80 absolute right-2 size-7 transition-opacity ease-in-out hover:bg-transparent dark:hover:bg-transparent"
			text={typeof text === 'string' ? text : text.join('\n')}
			{onCopy}
	/>
</div>