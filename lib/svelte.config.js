// @ts-check
import adapter from 'svelte-adapter-bun';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/**
 * Creates SvelteKit configuration with the specified prefix
 * @param {string|null} prefix - The prefix for the configuration
 * @returns {import('@sveltejs/kit').Config['kit']} The SvelteKit configuration object
 */
export function kit(prefix) {
	return {
		adapter: adapter(prefix ? { envPrefix: `${prefix}_` } : undefined),
		env: { dir: prefix ? '../..' : '..' },
		experimental: {
			remoteFunctions: true,
		},
	};
}

/** @type {import('@sveltejs/kit').Config['compilerOptions']} */
export const compilerOptions = {
	experimental: {
		async: true,
	},
	runes: true,
};

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [vitePreprocess()],
	kit: kit(null),
	extensions: ['.svelte', '.md', '.svx'],
	compilerOptions,
};

export default config;
