import tailwindcss from '@tailwindcss/vite';
import adapter from 'svelte-adapter-bun';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import {readdirSync, statSync} from "node:fs";
import path, {join, relative} from "node:path";
import { mdsxConfig } from './mdsx.config.js';
import {mdsx} from "mdsx";
import {fileURLToPath} from "node:url";

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const contentDirPath = path.join(__dirname, 'content');
export const veliteDirPath = path.join(__dirname, '.velite');

function markdownPrerenderEntries(contentRoot: string) {
	const paths: string[] = [];
	function walk(dir: string) {
		for (const name of readdirSync(dir)) {
			const full = join(dir, name);
			if (statSync(full).isDirectory()) {
				walk(full);
			} else if (name.endsWith('.md')) {
				let rel = relative(contentRoot, full).replaceAll('\\', '/');
				rel = rel.replace(/\.md$/, '');
				if (rel.endsWith('/index')) {
					rel = rel.slice(0, -'/index'.length);
				}
				paths.push(`/docs/${rel}.md`);
			}
		}
	}
	walk(contentRoot);
	return paths;
}

const mdPrerenderPaths: any = markdownPrerenderEntries(join(__dirname, 'content'));

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit({
			preprocess: [mdsx(mdsxConfig)],

			extensions: ['.svelte', '.md'],

			prerender: {
				origin: 'http://localhost:5173',
				entries: mdPrerenderPaths
			},

			alias: {
				$content: '.velite',
				'$content/*': '.velite/*'
			},

			compilerOptions: {
				runes: ({ filename }) => (filename.split(/[/\\]/).includes('node_modules') ? undefined : true),
			},

			adapter: adapter(),
		}),
	],
	server: {
		fs: {
			allow: [veliteDirPath, contentDirPath]
		}
	}
});
