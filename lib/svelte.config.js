import { mdsvex } from 'mdsvex';
import adapter from 'svelte-adapter-bun';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [vitePreprocess(), mdsvex()],
	kit: {
		adapter: adapter(),
		env: { dir: '..' },
		experimental: {
			remoteFunctions: true
		}
	},
	extensions: ['.svelte', '.svx'],
	compilerOptions: {
		experimental: {
			async: true
		},
		runes: true
	}
};

export default config;
