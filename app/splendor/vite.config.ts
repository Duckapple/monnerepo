import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit(), tailwindcss()],
	server: {
		port: 5175,
	},
	// In dev, we just want normal deps, but when building,
	// we want a bundle with everything so we don't need to `bun i` on server
	ssr: { noExternal: !!process.env.BUILDING || undefined },
});
