import { versions as rawVersions } from '$content/index.js';
import semver from 'semver';

export type Version = (typeof rawVersions)[number];

export const allVersions: Version[] = [...rawVersions].sort((a, b) => {
	const av = semver.coerce(a.version);
	const bv = semver.coerce(b.version);
	if (!av && !bv) return a.version.localeCompare(b.version);
	if (!av) return -1;
	if (!bv) return 1;
	return semver.compare(av, bv);
});

export const stableVersions = allVersions.filter((v) => v.stable);

export const latestStable: Version = stableVersions.at(-1) ?? allVersions.at(-1)!;

export const latestVersion: Version = allVersions.at(-1)!;

export function isValidVersion(v: string): boolean {
	return v === 'latest' || allVersions.some((ver) => ver.version === v);
}

export function resolveVersion(v: string): string {
	if (v === 'latest') return latestStable.version;
	return v;
}
