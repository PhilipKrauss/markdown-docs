import { browser } from '$app/environment';
import { parseUserConfig } from '$lib/user-config.svelte';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = ({ data }) => {
	if (!browser) return data;

	// @ts-ignore
	return { ...data, userConfig: parseUserConfig(document.cookie) };
};
