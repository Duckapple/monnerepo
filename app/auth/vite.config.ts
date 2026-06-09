/// <reference types="vitest/config" />
import Icons from 'unplugin-icons/vite';
import { defineConfig } from 'vite';
import { createConfig } from '../../lib/vite.config.ts';

const base = createConfig(Number(process.env.AUTH_PORT));

export default defineConfig({
	...base,
	plugins: [...(base.plugins ?? []), Icons({ compiler: 'svelte' })],
});
