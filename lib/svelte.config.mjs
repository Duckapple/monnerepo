import { mdsvex } from 'mdsvex';
import adapter from 'svelte-adapter-bun';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [vitePreprocess(), mdsvex()],
	kit: { adapter: adapter(), alias: { $ui: 'src/lib/ui/index.ts' } },
	extensions: ['.svelte', '.svx'],
	compilerOptions: {
		runes: true
	}
};

export default config;
