import type { Component } from 'svelte';
import { docs } from '$content/index.js';
import type { CurrentDoc } from './types';
import { join } from '$lib/utils/url';
import semver from 'semver';

const sortedDocs = [...docs]
	.filter((doc) => !doc.hidden)
	.sort((a, b) => {
		const goA = a.groupOrder ?? Infinity;
		const goB = b.groupOrder ?? Infinity;
		if (goA !== goB) return goA - goB;
		const oA = a.order ?? Infinity;
		const oB = b.order ?? Infinity;
		if (oA !== oB) return oA - oB;
		return a.slug.localeCompare(b.slug);
	});

export function getDocsForVersion(version: string) {
	return sortedDocs.filter((doc) => {
		const since = doc.since ?? '0.0.0';
		const until = doc.until;
		const coercedVersion = semver.coerce(version);
		const coercedSince = semver.coerce(since);
		if (!coercedVersion || !coercedSince) return true;
		if (semver.lt(coercedVersion, coercedSince)) return false;
		if (until) {
			const coercedUntil = semver.coerce(until);
			if (coercedUntil && semver.gte(coercedVersion, coercedUntil)) return false;
		}
		return true;
	});
}

export function getGroupedDocs(version: string): Record<string, typeof sortedDocs> {
	const grouped: Record<string, typeof sortedDocs> = {};
	for (const doc of getDocsForVersion(version)) {
		const group = doc.group ?? 'Other';
		if (!grouped[group]) grouped[group] = [];
		grouped[group].push(doc);
	}
	return grouped;
}

export function getDocsNotInVersion(
	version: string,
	allVersions: { version: string }[]
): Array<{ doc: (typeof sortedDocs)[number]; version: string }> {
	const currentSlugs = new Set(getDocsForVersion(version).map((d) => d.slug));
	const seen = new Set<string>();
	const result: Array<{ doc: (typeof sortedDocs)[number]; version: string }> = [];
	for (const v of [...allVersions].reverse()) {
		if (v.version === version) continue;
		for (const doc of getDocsForVersion(v.version)) {
			if (!currentSlugs.has(doc.slug) && !seen.has(doc.slug)) {
				seen.add(doc.slug);
				result.push({ doc, version: v.version });
			}
		}
	}
	return result;
}

export function versionedHref(href: string, version: string): string {
	return href.replace(/^\/docs/, `/docs/${version}`);
}

export async function getDoc(slug: string, version: string): Promise<CurrentDoc | null> {
	const versionedDocs = getDocsForVersion(version);
	const index = versionedDocs.findIndex((doc) => {
		return doc.slug === slug || doc.slug === join(slug, 'index');
	});

	if (index === -1) return null;

	const doc = versionedDocs[index];
	const docComponent = await getComponent(doc.slug);

	if (!docComponent) return null;

	return {
		doc: versionedDocs[index],
		next: versionedDocs[index + 1] || null,
		prev: versionedDocs[index - 1] || null,
		component: docComponent
	};
}

export function slugFromPath(path: string) {
	return path
		.replace('/content/', '')
		.replace('.md', '')
		.split('/')
		.filter((seg) => !/^\(.+\)$/.test(seg))
		.join('/')
		.replace(/^index$|\/index$/, '')
		.trim();
}

export async function getComponent(slug: string): Promise<Component | null> {
	const modules = import.meta.glob<{ default: Component }>('/content/**/*.md');

	for (const [path, load] of Object.entries(modules)) {
		if (slugFromPath(path) === slug) {
			const mod = await load();
			return mod.default;
		}
	}

	return null;
}
