import { redirect } from '@sveltejs/kit';
import { latestStable } from '$lib/features/docs/versions';

export function load() {
	throw redirect(302, `/docs/${latestStable.version}`);
}
