import type { APIRoute } from 'astro'

/**
 * robots.txt gerado no build para que a URL do sitemap saia de `site` no
 * astro.config.mjs — um arquivo estático em public/ acaba apontando para o
 * domínio errado quando o projeto é clonado.
 *
 * `Content-Signal` é a sinalização de uso do conteúdo proposta pela
 * Cloudflare: liberado para busca e para responder perguntas com citação
 * (`ai-input`), negado para treinar modelo (`ai-train`). Ajuste conforme o
 * cliente — e note que é uma declaração de intenção, não um bloqueio técnico.
 */
const getRobotsTxt = (sitemapURL: URL) => `\
User-agent: *
Content-Signal: search=yes,ai-input=yes,ai-train=no
Allow: /

Sitemap: ${sitemapURL.href}
`

export const GET: APIRoute = ({ site }) => {
	const sitemapURL = new URL('sitemap-index.xml', site)
	return new Response(getRobotsTxt(sitemapURL), {
		headers: { 'Content-Type': 'text/plain; charset=utf-8' },
	})
}
