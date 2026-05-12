/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import { createConfig } from '../../lib/vite.config.ts';

export default defineConfig({ ...createConfig(import.meta.env.LUDO_PORT) });
