<script lang="ts">
	import { cn } from '$lib/utils.js';
	import type {HTMLAttributes} from "svelte/elements";
	import {IconCode} from "@tabler/icons-svelte";

	interface Props extends HTMLAttributes<SVGElement> {
		class?: string;
		width?: number;
		height?: number;
	}

	let { class: className, ...rest }: Props = $props();
</script>

<IconCode class="size-5 stroke-primary" />