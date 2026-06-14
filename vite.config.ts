import tailwindcss from '@tailwindcss/vite';
import adapter from 'svelte-adapter-bun';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import path, {join} from "node:path";
import { mdsxConfig } from './mdsx.config.js';
import {mdsx} from "mdsx";
import {fileURLToPath} from "node:url";

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const contentDirPath = path.join(__dirname, 'content');
export const veliteDirPath = path.join(__dirname, '.velite');

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit({
			preprocess: [mdsx(mdsxConfig)],

			extensions: ['.svelte', '.md'],

			prerender: {
				origin: 'http://localhost:5173',
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
