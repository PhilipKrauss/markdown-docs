import { USER_CONFIG_COOKIE_NAME, userConfigSchema } from '$lib/user-config.svelte';

export async function load({ cookies }) {
	const userConfigCookie = cookies.get(USER_CONFIG_COOKIE_NAME);
	const parsedUserConfig = userConfigCookie ? JSON.parse(userConfigCookie) : {};
	const userConfig = userConfigSchema.parse(parsedUserConfig);

	return { userConfig };
}
