<script lang="ts">
	import Button from '$lib/components/button.svelte';
	import ArrowRight from "@tabler/icons-svelte/icons/arrow-right";
	import { PUBLIC_SITE_TITLE, PUBLIC_SITE_DESCRIPTION } from '$env/static/public';
</script>

<div class="flex flex-col items-center gap-8">
	<div class="flex flex-col items-center gap-2 py-6 md:py-10 lg:py-20">
		<h1 class="text-center text-5xl font-medium">
			{@html PUBLIC_SITE_TITLE}
		</h1>
		<p class="text-center text-lg text-muted-foreground">
			{@html PUBLIC_SITE_DESCRIPTION}
		</p>
		<div class="mt-2 flex place-items-center gap-2">
			<Button href="/docs" class="group">
				Get Started
				<ArrowRight class="group-hover:translate-x-2 transition-transform duration-300 ease-in-out" />
			</Button>
		</div>
	</div>
</div>
