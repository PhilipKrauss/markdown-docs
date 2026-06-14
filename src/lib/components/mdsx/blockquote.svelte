<script lang="ts">
	import { cn } from '$lib/utils.js';
	import type { HTMLAttributes } from 'svelte/elements';
	import {
		IconInfoCircle,
		IconBulb,
		IconAlertTriangle,
		IconAlertCircle,
		IconCircleCheck, IconMessageExclamation
	} from '@tabler/icons-svelte';

	type Props = HTMLAttributes<HTMLElement> & {
		'data-callout'?: string;
		'data-callout-title'?: string;
	};

	let {
		class: className,
		children,
		'data-callout': callout,
		'data-callout-title': customTitle,
		...restProps
	}: Props = $props();

	const VARIANTS = {
		note:      { icon: IconInfoCircle,    label: 'Note',      color: 'var(--info)' },
		tip:       { icon: IconBulb,          label: 'Tip',       color: 'var(--success)' },
		info:      { icon: IconInfoCircle,    label: 'Info',      color: 'var(--info)' },
		warning:   { icon: IconAlertTriangle, label: 'Warning',   color: 'var(--warning)' },
		important: { icon: IconMessageExclamation, label: 'Important', color: 'var(--important)' },
		error:     { icon: IconAlertCircle,   label: 'Error',     color: 'var(--error)' },
		success:   { icon: IconCircleCheck,   label: 'Success',   color: 'var(--success)' },
	} as const;

	const variant = callout ? VARIANTS[callout as keyof typeof VARIANTS] : null;
</script>

{#if variant}
	{@const Icon = variant.icon}
	{@const title = customTitle || variant.label}
	<div
		class={cn('not-prose my-4 flex items-start gap-2.5 rounded-lg border px-3 py-2.5', className)}
		style="background-color:color-mix(in oklab,{variant.color} 10%,transparent);border-color:color-mix(in oklab,{variant.color} 30%,transparent);"
		role="note"
		{...restProps}
	>
		<Icon class="mt-[3px] size-4 shrink-0" style="color:{variant.color};" />
		<div class="min-w-0 flex-1 text-sm [&_p]:mt-0.5! [&_p]:leading-normal! [&_p:first-child]:mt-0!">
			<p class="font-semibold leading-snug" style="color:{variant.color};">{title}</p>
			{@render children?.()}
		</div>
	</div>
{:else}
	<blockquote class={cn('border-border mt-6 border-l-2 pl-4 italic', className)} {...restProps}>
		{@render children?.()}
	</blockquote>
{/if}
