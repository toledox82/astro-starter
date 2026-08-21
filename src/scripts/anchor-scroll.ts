/**
 * Rolagem para âncoras da própria página passando pelo Lenis, descontando a
 * altura do header fixo.
 *
 * Sem isto, o clique num `href="#secao"` usa o scroll nativo do navegador, que
 * o Lenis não conhece — a página salta e a animação some. E o destino fica sob
 * o header, escondendo o título da seção.
 *
 * O header é localizado por `[data-header]`; marque o seu com esse atributo
 * (ou ajuste o seletor abaixo) para o offset entrar na conta.
 */

const HEADER_SELECTOR = '[data-header]'

function headerOffset(): number {
	const header = document.querySelector<HTMLElement>(HEADER_SELECTOR)
	return header ? header.offsetHeight : 0
}

function scrollToHash(hash: string, immediate = false) {
	const target = document.querySelector<HTMLElement>(hash)
	if (!target) return

	const offset = -headerOffset()

	if (window.lenis) {
		window.lenis.scrollTo(target, { offset, immediate })
		return
	}

	// Fallback para quando o Lenis não subiu (prefers-reduced-motion, erro de
	// carregamento): a âncora continua funcionando, só sem a animação.
	const top = target.getBoundingClientRect().top + window.scrollY + offset
	window.scrollTo({ top, behavior: immediate ? 'auto' : 'smooth' })
}

document.addEventListener('click', (event) => {
	const link = (event.target as HTMLElement)?.closest?.('a[href^="#"]')
	if (!(link instanceof HTMLAnchorElement)) return

	const hash = link.getAttribute('href')
	if (!hash || hash === '#') return
	if (!document.querySelector(hash)) return

	event.preventDefault()
	scrollToHash(hash)
	history.pushState(null, '', hash)
})

// Chegada direta por URL com hash: o navegador posiciona antes das fontes e
// imagens entrarem, então a posição fica errada. Reposiciona sem animação.
if (location.hash) {
	window.addEventListener('load', () => scrollToHash(location.hash, true))
}
