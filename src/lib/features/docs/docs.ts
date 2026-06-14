import type { Component } from 'svelte';
import { docs } from '$content/index.js';
import type { CurrentDoc } from './types';
import { join } from '$lib/utils/url';

export const allDocs = [...docs]
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

export const groupedDocs: Record<string, typeof allDocs> = {};
for (const doc of allDocs) {
	const group = doc.group ?? 'Other';
	if (!groupedDocs[group]) groupedDocs[group] = [];
	groupedDocs[group].push(doc);
}

export async function getDoc(path: string): Promise<CurrentDoc | null> {
	const index = allDocs.findIndex((doc) => {
		return doc.slug === path || doc.slug === join(path, 'index');
	});

	if (index === -1) return null;

	const doc = allDocs[index];
	const docComponent = await getComponent(doc.slug);

	if (!docComponent) return null;

	return {
		doc: allDocs[index],
		next: allDocs[index + 1] || null,
		prev: allDocs[index - 1] || null,
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