/** Bundled at build time so doc `<Code />` expansion works on Cloudflare (no `node:fs`). */
const rawLibLoaders = import.meta.glob('/src/lib/**/*', {
	query: '?raw',
	import: 'default'
}) as Record<string, () => Promise<string>>;

function normalizeLibRelPath(path: string): string {
	return path.replace(/\\/g, '/').replace(/^\/+/, '');
}

/** Match Vite glob keys (`/src/lib/...`) to a repo-relative path (`src/lib/...`). */
function findRawLoader(relPath: string): (() => Promise<string>) | undefined {
	const n = normalizeLibRelPath(relPath);
	for (const key of [`/${n}`, n]) {
		const load = rawLibLoaders[key];
		if (load) return load;
	}
	return undefined;
}

function stripDemoAddImports(markdown: string): string {
	return markdown
		.replace(/^\s*import Demo from '\$lib\/components\/demo\.svelte';\s*\n/gm, '')
		.replace(/^\s*import Add from '\$lib\/components\/add\.svelte';\s*\n/gm, '');
}

function removeEmptyScriptBlocks(markdown: string): string {
	return markdown.replace(/<script lang="ts">([\s\S]*?)<\/script>\s*/g, (_, inner: string) => {
		if (!inner.replace(/^\s*$/gm, '').trim()) return '';
		return `<script lang="ts">${inner}</script>\n\n`;
	});
}

/** Map `$lib/…` specifiers (without `?raw`) to `src/lib/…` paths (Vite glob keys). */
function resolveLibImportPath(specifier: string): string {
	if (specifier.startsWith('$lib/')) {
		return `src/lib/${specifier.slice('$lib/'.length)}`.replace(/\\/g, '/');
	}
	throw new Error(`Unsupported raw import (expected \$lib/…): ${specifier}`);
}

/** Variable name → `src/lib/…` path for `import x from '…?raw'` in doc markdown. */
function parseRawImportMap(markdown: string): Map<string, string> {
	const map = new Map<string, string>();
	const re = /^\s*import\s+(\w+)\s+from\s+['"]([^'"]+)\?raw['"];\s*$/gm;
	let m: RegExpExecArray | null;
	while ((m = re.exec(markdown)) !== null) {
		const [, name, spec] = m;
		map.set(name, resolveLibImportPath(spec));
	}
	return map;
}

function extractHighlightRanges(attrs: string): number[][] | undefined {
	const match = attrs.match(/\bhighlight\s*=\s*\{/);
	if (!match || match.index === undefined) return undefined;
	let i = match.index + match[0].length - 1;
	if (attrs[i] !== '{') return undefined;
	let depth = 0;
	const start = i;
	for (; i < attrs.length; i++) {
		const c = attrs[i];
		if (c === '{') depth++;
		else if (c === '}') {
			depth--;
			if (depth === 0) {
				const inner = attrs.slice(start + 1, i);
				try {
					const parsed = JSON.parse(inner) as unknown;
					if (!Array.isArray(parsed)) return undefined;
					return parsed as number[][];
				} catch {
					return undefined;
				}
			}
		}
	}
	return undefined;
}

function parseCodeAttrs(attrs: string): {
	lang: string;
	codeVar: string;
	highlight?: number[][];
} | null {
	const langM = attrs.match(/\blang\s*=\s*["']([^"']+)["']/);
	const codeM = attrs.match(/\bcode\s*=\s*\{(\w+)\}/);
	if (!langM || !codeM) return null;
	const highlight = extractHighlightRanges(attrs);
	return { lang: langM[1], codeVar: codeM[1], highlight };
}

function highlightToFenceMeta(ranges: number[][]): string {
	if (!ranges.length) return '';
	const parts = ranges.map(([a, b]) => (a === b ? `${a}` : `${a}-${b}`));
	return ` {${parts.join(',')}}`;
}

function formatCodeFence(lang: string, content: string, highlight?: number[][]): string {
	const meta = highlight && highlight.length ? highlightToFenceMeta(highlight) : '';
	const body = content.replace(/\r\n/g, '\n').replace(/\n$/, '');
	return '```' + lang + meta + '\n' + body + '\n```\n';
}

async function replaceAsync(
	str: string,
	re: RegExp,
	replacer: (match: RegExpExecArray) => Promise<string>
): Promise<string> {
	const flags = re.flags.includes('g') ? re.flags : `${re.flags}g`;
	const globalRe = new RegExp(re.source, flags);
	const parts: string[] = [];
	let lastIndex = 0;
	let m: RegExpExecArray | null;
	while ((m = globalRe.exec(str)) !== null) {
		parts.push(str.slice(lastIndex, m.index));
		parts.push(await replacer(m));
		lastIndex = globalRe.lastIndex;
	}
	parts.push(str.slice(lastIndex));
	return parts.join('');
}

async function replaceCodeTags(
	markdown: string,
	rawMap: Map<string, string>,
	usedRawVars: Set<string>
): Promise<string> {
	const expand = async (attrs: string): Promise<string | null> => {
		const parsed = parseCodeAttrs(attrs);
		if (!parsed) return null;
		const relPath = rawMap.get(parsed.codeVar);
		if (!relPath) return null;
		const load = findRawLoader(relPath);
		if (!load) return null;
		let fileContent: string;
		try {
			fileContent = await load();
		} catch {
			return null;
		}
		usedRawVars.add(parsed.codeVar);
		return formatCodeFence(parsed.lang, fileContent, parsed.highlight);
	};

	let out = await replaceAsync(
		markdown,
		/<div>\s*<Code\s+([\s\S]*?)\/\s*>\s*<\/div>/gi,
		async (m) => (await expand(m[1]!)) ?? m[0]!
	);

	out = await replaceAsync(
		out,
		/<Code\s+([\s\S]*?)\/\s*>/g,
		async (m) => (await expand(m[1]!)) ?? m[0]!
	);

	return out;
}

function stripCodeDocImport(markdown: string): string {
	return markdown.replace(
		/^\s*import Code from '\$lib\/components\/docs\/code\.svelte';\s*\n/gm,
		''
	);
}

/** String literals inside `args={[ ... ]}` in doc markdown. */
function parseBracketStringArray(inner: string): string[] {
	const parts: string[] = [];
	const re = /'([^']*)'|"([^"]*)"/g;
	let m: RegExpExecArray | null;
	while ((m = re.exec(inner)) !== null) {
		parts.push((m[1] ?? m[2] ?? '').trim());
	}
	return parts;
}

function stripRawImports(markdown: string, vars: Set<string>): string {
	let out = markdown;
	for (const v of vars) {
		out = out.replace(
			new RegExp(`^\\s*import\\s+${v}\\s+from\\s+['"][^'"]+\\?raw['"];\\s*\\n`, 'gm'),
			''
		);
	}
	return out;
}

export async function transformDocMarkdown(markdown: string, docSlug?: string): Promise<string> {
	const rawImportMap = parseRawImportMap(markdown);
	const usedRawVars = new Set<string>();

	let merged = markdown;
	merged = await replaceCodeTags(merged, rawImportMap, usedRawVars);
	merged = stripDemoAddImports(merged);
	merged = stripCodeDocImport(merged);
	merged = stripRawImports(merged, usedRawVars);
	merged = removeEmptyScriptBlocks(merged);

	return merged.replace(/\n{3,}/g, '\n\n').trimEnd() + '\n';
}
