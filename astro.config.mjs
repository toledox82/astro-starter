// @ts-check
import { defineConfig } from 'astro/config'
import tailwindcss from '@tailwindcss/vite'
import sitemap from '@astrojs/sitemap'
import lenis from 'astro-lenis'
import alpinejs from '@astrojs/alpinejs'

// https://astro.build/config
export default defineConfig({
	site: 'https://marciotoledo.com',
	trailingSlash: 'never',
	vite: {
		plugins: [tailwindcss()],
	},
	integrations: [sitemap(), lenis(), alpinejs()],
})
