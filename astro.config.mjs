// @ts-check
import { defineConfig } from 'astro/config'
import tailwindcss from '@tailwindcss/vite'
import sitemap from '@astrojs/sitemap'
import lenis from 'astro-lenis'

import alpinejs from '@astrojs/alpinejs';

// https://astro.build/config
export default defineConfig({
    site: 'https://bootcampiaparanegocios.com.br',
    trailingSlash: 'never',
    server: {
        host: false, // faz bind em 0.0.0.0 para funcionar no WSL
        port: 3000, // porta padrão que você quer
    },
    vite: {
        plugins: [tailwindcss()],
    },
    integrations: [sitemap({
        filter: (page) => !page.includes('404'),
		}), lenis(), alpinejs()],
})