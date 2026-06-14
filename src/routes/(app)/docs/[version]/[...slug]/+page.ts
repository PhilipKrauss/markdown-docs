import { getDoc, getDocsForVersion } from '$lib/features/docs/docs';
import { allVersions, latestStable, isValidVersion, resolveVersion } from '$lib/features/docs/versions';
import { error, redirect } from '@sveltejs/kit';
import type { EntryGenerator } from './$types';

export const prerender = true;

export const entries: EntryGenerator = () => {
	const versioned = allVersions.flatMap((v) =>
		getDocsForVersion(v.version).map((doc) => ({
			version: v.version,
			slug: doc.href === '/docs' ? '' : doc.href.replace(/^\/docs\//, '')
		}))
	);

	const latestRedirects = getDocsForVersion(latestStable.version).map((doc) => ({
		version: 'latest',
		slug: doc.href === '/docs' ? '' : doc.href.replace(/^\/docs\//, '')
	}));

	return [...versioned, { version: 'latest', slug: '' }, ...latestRedirects];
};

export async function load({ params }) {
	const { version, slug } = params;

	if (version === 'latest') {
		throw redirect(301, `/docs/${latestStable.version}/${slug}`);
	}

	if (!isValidVersion(version)) {
		throw redirect(302, `/docs/latest/${slug}`);
	}

	const doc = await getDoc(slug, resolveVersion(version));

	if (!doc) error(404, 'Not found');

	return { doc };
}
