// @ts-check
import { defineConfig, fontProviders } from 'astro/config'
import tailwindcss from '@tailwindcss/vite'
import sitemap from '@astrojs/sitemap'
import alpinejs from '@astrojs/alpinejs'
import lenis from 'astro-lenis'

// Domínio de produção. Precisa ser absoluto: é daqui que saem canonical,
// Open Graph e as URLs do sitemap.
const SITE = 'https://example.com'

// Páginas sem valor de busca (agradecimento pós-formulário, telas internas).
// Caminhos sem a barra final — o filtro abaixo normaliza.
const EXCLUDED = ['/404']

// https://astro.build/config
export default defineConfig({
	site: SITE,

	// Barra no final em todas as URLs. O importante é escolher uma e manter:
	// servir /sobre e /sobre/ como páginas distintas duplica conteúdo. Se mudar
	// para 'never' aqui, ajuste também os hrefs do menu em src/data/site.json.
	trailingSlash: 'always',

	// 'constrained' é o comportamento que se espera de imagem em site: nunca
	// passa da largura original, encolhe junto com o container. Sem isto cada
	// <Image> precisa repetir width/height.
	image: {
		layout: 'constrained',
	},

	// Fontes self-hosted via astro:fonts. O Astro baixa os arquivos no build,
	// gera @font-face com métricas de fallback (evita o pulo de layout ao
	// trocar a fonte de sistema pela real) e emite o preload através do
	// componente <Font> no Layout.
	//
	// Isto substitui o <link> para fonts.googleapis.com: um round-trip a menos
	// em outro domínio antes de poder pintar o texto.
	//
	// Declare só os pesos que o site usa — '400 700' é a faixa variável, uma
	// lista como [400, 700] baixa arquivos estáticos separados. `latin-ext`
	// cobre os acentos do português.
	//
	// Para trocar de fonte: mude `name`, `cssVariable`, e aponte o token
	// correspondente em src/styles/global.css. Alternativa ao provider google():
	// fontProviders.fontsource(), útil quando a fonte não está no Google Fonts.
	fonts: [
		{
			name: 'Outfit',
			cssVariable: '--font-outfit',
			provider: fontProviders.google(),
			weights: ['100 900'],
			styles: ['normal'],
			subsets: ['latin', 'latin-ext'],
			fallbacks: ['Arial', 'sans-serif'],
		},
		{
			name: 'Inter',
			cssVariable: '--font-inter',
			provider: fontProviders.google(),
			weights: ['400 700'],
			styles: ['normal'],
			subsets: ['latin', 'latin-ext'],
			fallbacks: ['Arial', 'sans-serif'],
		},
	],

	vite: {
		plugins: [tailwindcss()],
	},

	integrations: [
		alpinejs(),
		// Páginas com noindex ficam fora do sitemap — sinalizar as duas coisas ao
		// mesmo tempo é contraditório para os buscadores.
		sitemap({
			filter: (page) => {
				const path = new URL(page).pathname.replace(/\/$/, '')
				return !EXCLUDED.includes(path)
			},
		}),
		lenis(),
	],
})
