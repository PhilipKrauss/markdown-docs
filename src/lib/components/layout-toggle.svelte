<script lang="ts">
    import Button from '$lib/components/button.svelte';
    import { UserConfigContext } from '$lib/user-config.svelte';
    import { IconLayoutDistributeVertical } from '@tabler/icons-svelte';
    import type { ComponentProps } from 'svelte';

    let { ...restProps }: ComponentProps<typeof Button> = $props();

    const userConfig = UserConfigContext.get();
</script>

<Button
    variant="ghost"
    size="icon"
    onclick={() => userConfig.setConfig({ layout: userConfig.current.layout === 'full' ? 'fixed' : 'full' })}
    {...restProps}
    title="Toggle layout"
    class="hidden 2xl:block"
>
    <IconLayoutDistributeVertical />
    <span class="sr-only">Toggle layout</span>
</Button>
