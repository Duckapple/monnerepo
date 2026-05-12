import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit(), tailwindcss()],
	server: { port: import.meta.env.SPLENDOR_PORT },
	// In dev, we just want normal deps, but when building,
	// we want a bundle with everything so we don't need to `bun i` on server
	ssr: { noExternal: !!import.meta.env.BUILDING || undefined },
});
