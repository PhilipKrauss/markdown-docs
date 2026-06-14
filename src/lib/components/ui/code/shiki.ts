// Follows the best practices established in https://shiki.matsu.io/guide/best-performance
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript';
import { createHighlighterCore } from 'shiki/core';

const bundledLanguages = {
	bash: () => import('@shikijs/langs/bash'),
	c: () => import('@shikijs/langs/c'),
	cpp: () => import('@shikijs/langs/cpp'),
	csharp: () => import('@shikijs/langs/csharp'),
	css: () => import('@shikijs/langs/css'),
	diff: () => import('@shikijs/langs/diff'),
	docker: () => import('@shikijs/langs/docker'),
	go: () => import('@shikijs/langs/go'),
	graphql: () => import('@shikijs/langs/graphql'),
	html: () => import('@shikijs/langs/html'),
	ini: () => import('@shikijs/langs/ini'),
	java: () => import('@shikijs/langs/java'),
	javascript: () => import('@shikijs/langs/javascript'),
	json: () => import('@shikijs/langs/json'),
	json5: () => import('@shikijs/langs/json5'),
	jsonc: () => import('@shikijs/langs/jsonc'),
	jsx: () => import('@shikijs/langs/jsx'),
	kotlin: () => import('@shikijs/langs/kotlin'),
	lua: () => import('@shikijs/langs/lua'),
	makefile: () => import('@shikijs/langs/makefile'),
	markdown: () => import('@shikijs/langs/markdown'),
	nginx: () => import('@shikijs/langs/nginx'),
	perl: () => import('@shikijs/langs/perl'),
	php: () => import('@shikijs/langs/php'),
	powershell: () => import('@shikijs/langs/powershell'),
	prisma: () => import('@shikijs/langs/prisma'),
	python: () => import('@shikijs/langs/python'),
	r: () => import('@shikijs/langs/r'),
	regexp: () => import('@shikijs/langs/regexp'),
	ruby: () => import('@shikijs/langs/ruby'),
	rust: () => import('@shikijs/langs/rust'),
	scala: () => import('@shikijs/langs/scala'),
	scss: () => import('@shikijs/langs/scss'),
	sh: () => import('@shikijs/langs/sh'),
	shell: () => import('@shikijs/langs/shell'),
	sql: () => import('@shikijs/langs/sql'),
	svelte: () => import('@shikijs/langs/svelte'),
	swift: () => import('@shikijs/langs/swift'),
	toml: () => import('@shikijs/langs/toml'),
	tsx: () => import('@shikijs/langs/tsx'),
	typescript: () => import('@shikijs/langs/typescript'),
	vue: () => import('@shikijs/langs/vue'),
	xml: () => import('@shikijs/langs/xml'),
	yaml: () => import('@shikijs/langs/yaml')
};

/** The languages configured for the highlighter (`text` is handled by Shiki without a bundled grammar). */
export type SupportedLanguage = keyof typeof bundledLanguages | 'text';

/** A preloaded highlighter instance. */
export const highlighter = createHighlighterCore({
	themes: [
		import('@shikijs/themes/github-light-default'),
		import('@shikijs/themes/github-dark-default')
	],
	langs: Object.entries(bundledLanguages).map(([_, lang]) => lang),
	engine: createJavaScriptRegexEngine()
});
