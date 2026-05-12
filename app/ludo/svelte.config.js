// @ts-check
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { compilerOptions, kit } from '../../lib/svelte.config.js';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [vitePreprocess()],
	kit: kit('LUDO'),
	extensions: ['.svelte', '.svx'],
	compilerOptions: compilerOptions,
};

export default config;
