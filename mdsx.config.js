// @ts-check
import { resolve } from 'node:path';
import { fileURLToPath, URL } from 'node:url';
import { toString } from 'hast-util-to-string';
import parseNumericRange from 'parse-numeric-range';
import rehypeSlug from 'rehype-slug';
import { codeImport } from 'remark-code-import';
import remarkGfm from 'remark-gfm';
import remarkSmartypants from 'remark-smartypants';
import remarkSupersub from 'remark-supersub';
import remarkAbbr from '@syenchuk/remark-abbr';
import remarkDeflist from 'remark-deflist';
import { visit } from 'unist-util-visit';
import { defineConfig } from 'mdsx';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

/**
 * @typedef {import('mdast').Root} MdastRoot
 * @typedef {import('hast').Root} HastRoot
 * @typedef {import('unified').Transformer<HastRoot, HastRoot>} HastTransformer
 * @typedef {import('unified').Transformer<MdastRoot, MdastRoot>} MdastTransformer
 */
export const mdsxConfig = defineConfig({
	extensions: ['.md'],
	remarkPlugins: [remarkGfm, remarkSmartypants, remarkSupersub, remarkDeflist, remarkAbbr, codeImport, remarkRemovePrettierIgnore, remarkTypographicSymbols, remarkDiffNotation, remarkCallout],
	rehypePlugins: [rehypeSlug, rehypePreData, rehypeAttachMdsxCodeProps],
	blueprints: {
		default: {
			path: resolve(__dirname, './src/lib/components/mdsx/blueprint.svelte'),
		},
	},
});

/**
 * Strips `// [!code ++]` / `// [!code --]` markers from code blocks before shiki sees them,
 * recording which lines are add/remove in the node meta as `add={n,...}` / `remove={n,...}`.
 * @returns {MdastTransformer}
 */
function remarkDiffNotation() {
	const SKIP = new Set(['md', 'markdown', 'text', 'plaintext', '']);
	return (tree) => {
		visit(tree, 'code', (node) => {
			if (SKIP.has(node.lang ?? '')) return;
			const lines = node.value.split('\n');
			/** @type {number[]} */
			const addLines = [];
			/** @type {number[]} */
			const removeLines = [];

			const cleanLines = lines.map((line, i) => {
				if (line.includes('[!code ++]')) {
					addLines.push(i + 1);
					return line.replace(/\s*(\/\/|#)\s*\[!code \+\+\].*$/, '');
				}
				if (line.includes('[!code --]')) {
					removeLines.push(i + 1);
					return line.replace(/\s*(\/\/|#)\s*\[!code --\].*$/, '');
				}
				return line;
			});

			if (addLines.length || removeLines.length) {
				node.value = cleanLines.join('\n');
				const existing = node.meta ?? '';
				const addMeta = addLines.length ? ` add={${addLines.join(',')}}` : '';
				const removeMeta = removeLines.length ? ` remove={${removeLines.join(',')}}` : '';
				node.meta = (existing + addMeta + removeMeta).trim();
			}
		});
	};
}

/**
 * @returns {MdastTransformer}
 */
function remarkTypographicSymbols() {
	return (tree) => {
		visit(tree, 'text', (node) => {
			node.value = node.value
				.replace(/\(c\)/gi, '©')
				.replace(/\(r\)/gi, '®')
				.replace(/\(tm\)/gi, '™')
				.replace(/\(p\)/gi, '℗');
		});
	};
}

/**
 * Converts `> [!TYPE]` blockquotes into callout blocks by attaching `data-callout` to the HAST element.
 * Supports: note, tip, info, warning, error, success, important
 * @returns {MdastTransformer}
 */
function remarkCallout() {
	const TYPES = new Set(['note', 'tip', 'info', 'warning', 'error', 'success', 'important']);
	return (tree) => {
		visit(tree, 'blockquote', (node) => {
			if (!node.children.length) return;
			const first = node.children[0];
			if (first.type !== 'paragraph' || !first.children.length) return;
			const firstText = first.children[0];
			if (firstText.type !== 'text') return;
			const match = firstText.value.match(/^\[!([A-Za-z]+)\][ \t]*/);
			if (!match) return;
			const type = match[1].toLowerCase();
			if (!TYPES.has(type)) return;
			const remainder = firstText.value.slice(match[0].length);
			// Split on first newline: anything before it is an inline custom title
			const nl = remainder.indexOf('\n');
			const inlineTitle = nl === -1 ? remainder.trim() : remainder.slice(0, nl).trim();
			const bodyText = nl === -1 ? '' : remainder.slice(nl + 1);
			if (bodyText) {
				firstText.value = bodyText;
			} else {
				first.children.splice(0, 1);
				if (first.children[0]?.type === 'break') first.children.splice(0, 1);
			}
			if (first.children.length === 0) node.children.splice(0, 1);
			node.data = node.data ?? {};
			node.data.hProperties = {
				...(node.data.hProperties ?? {}),
				'data-callout': type,
				...(inlineTitle ? { 'data-callout-title': inlineTitle } : {}),
			};
		});
	};
}

/**
 * @returns {MdastTransformer}
 */
function remarkRemovePrettierIgnore() {
	return async (tree) => {
		visit(tree, 'code', (node) => {
			node.value = node.value.replaceAll('<!-- prettier-ignore -->\n', '').replaceAll('// prettier-ignore\n', '');
		});
	};
}

/**
 * @returns {HastTransformer}
 */
function rehypePreData() {
	return (tree) => {
		visit(tree, (node) => {
			if (node?.type === 'element' && node?.tagName === 'pre') {
				const [codeEl] = node.children;
				if (codeEl.type !== 'element') return;
				if (codeEl.tagName !== 'code') return;

				if (codeEl.data && 'meta' in codeEl.data && codeEl.data.meta && typeof codeEl.data.meta === 'string') {
					const regex = /event="([^"]*)"/;
					const match = codeEl.data?.meta.match(regex);
					if (match) {
						// @ts-expect-error custom field for optional integrations
						node.__event__ = match ? match[1] : null;
						codeEl.data.meta = codeEl.data.meta.replace(regex, '');
					}
				}

				// @ts-expect-error custom fields consumed by markdown pre component
				node.__rawString__ = codeEl.children?.[0].value;
				// @ts-expect-error unknown properties on pre element
				node.__src__ = node.properties?.__src__;
				// @ts-expect-error unknown properties on pre element
				node.__style__ = node.properties?.__style__;
			}
		});
	};
}

/**
 * Fenced blocks are highlighted by the blueprint `pre` → ui `Code.Root`. Pass source + line meta as data attributes.
 * @returns {HastTransformer}
 */
function rehypeAttachMdsxCodeProps() {
	return (tree) => {
		visit(tree, 'element', (node) => {
			if (node.tagName !== 'pre') return;
			const codeEl = node.children?.[0];
			if (!codeEl || codeEl.type !== 'element' || codeEl.tagName !== 'code') return;

			const raw = toString(codeEl);
			const className = codeEl.properties?.className;
			let lang = 'plaintext';
			if (Array.isArray(className)) {
				const langClass = className.find((c) => typeof c === 'string' && c.startsWith('language-'));
				if (typeof langClass === 'string') lang = langClass.replace(/^language-/, '');
			}

			const meta = codeEl.data && 'meta' in codeEl.data && typeof codeEl.data.meta === 'string' ? codeEl.data.meta : '';

			/** @type {number[]} */
			const highlights = [];
			if (meta) {
				for (const m of meta.matchAll(/(?<!=)\{([^}]*)}/g)) {
					const inner = m[1]?.trim();
					if (!inner) continue;
					try {
						highlights.push(...parseNumericRange(inner));
					} catch {
						/* ignore invalid ranges */
					}
				}
			}

			const addLines = parseMetaRange(meta, 'add');
			const removeLines = parseMetaRange(meta, 'remove');

			const p = node.properties ?? (node.properties = {});
			p['data-mdsx-raw'] = Buffer.from(raw, 'utf8').toString('base64url');
			p['data-mdsx-lang'] = lang;
			const uniq = [...new Set(highlights)].sort((a, b) => a - b);
			if (uniq.length) p['data-mdsx-highlight'] = uniq.join(',');
			if (addLines.length) p['data-mdsx-add'] = addLines.join(',');
			if (removeLines.length) p['data-mdsx-remove'] = removeLines.join(',');
		});
	};
}

/**
 * @param {string} meta
 * @param {string} key
 * @returns {number[]}
 */
function parseMetaRange(meta, key) {
	const m = meta.match(new RegExp(key + '=\\{([^}]*)\\}'));
	if (!m) return [];
	try {
		return parseNumericRange(m[1].trim());
	} catch {
		return [];
	}
}
