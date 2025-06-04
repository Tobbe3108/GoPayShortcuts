import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	base: process.env.BASE_PATH || (process.env.NODE_ENV === 'production' ? '/GoPayShortcuts' : '')
});
