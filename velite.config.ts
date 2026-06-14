import { defineConfig, defineCollection, s } from 'velite';
import { addLeadingSlash, join, removeLeadingSlash, removeTrailingSlash } from './src/lib/utils/url';

const docSchema = s
	.object({
		title: s.string(),
		description: s.string(),
		path: s.path(),
		order: s.number().optional(),
		navLabel: s.string().optional(),
		links: s
			.object({
				doc: s.string().optional(),
				api: s.string().optional(),
				source: s.string().optional(),
			})
			.optional(),
		component: s.boolean().default(false),
		toc: s.toc(),
		hidden: s.boolean().default(false),
		tocLevel: s.number().optional(),
		indicator: s.union([s.literal('new'), s.literal('updated')]).optional(),
	})
	.transform((data) => {
		const segments = data.path.split('/');
		let group: string | undefined;
		let groupOrder: number | undefined;
		const cleanSegments = segments.filter((seg) => {
			const numbered = seg.match(/^\((\d+)\s+(.+)\)$/);
			if (numbered) {
				groupOrder = parseInt(numbered[1]);
				group = numbered[2];
				return false;
			}
			const plain = seg.match(/^\((.+)\)$/);
			if (plain) {
				group = plain[1];
				return false;
			}
			return true;
		});
		const cleanPath = cleanSegments.join('/');
		return {
			...data,
			group,
			groupOrder,
			slug: removeLeadingSlash(cleanPath),
			href: addLeadingSlash(removeTrailingSlash(join('/docs', cleanPath).replace('index', ''))),
		};
	});

const docs = defineCollection({
	name: 'docs',
	pattern: './**/*.md',
	schema: docSchema,
});

export default defineConfig({
	root: './content',
	collections: {
		docs,
	},
	output: { assets: 'static' },
});