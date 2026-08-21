# Astro Starter — Toledo Interactive

Esqueleto de projeto para os sites que construo em [Astro](https://astro.build). Não é o
starter oficial do Astro: é o resultado do que ficou de pé depois de alguns projetos em
produção — SEO, fontes, cabeçalhos de segurança, cache e formatação já resolvidos, para não
refazer as mesmas quatro horas de setup a cada site novo.

**Astro 7** · **Tailwind CSS 4** · **Alpine.js 3** · **Lenis** · saída estática (SSG),
deploy em Cloudflare Workers (Static Assets).

---

## Começando

```bash
pnpm install
pnpm dev
```

O dev server sobe em `localhost:4321`.

| Comando             | O que faz                             |
| :------------------ | :------------------------------------ |
| `pnpm dev`          | Dev server com HMR                    |
| `pnpm build`        | Build de produção em `./dist/`        |
| `pnpm preview`      | Serve o build local, antes do deploy  |
| `pnpm check`        | `astro check` — type checking         |
| `pnpm format`       | Prettier em tudo                      |
| `pnpm format:check` | Verifica formatação sem escrever (CI) |
| `pnpm deploy`       | Build + `wrangler deploy`             |

Requer Node ≥ 22.12 (há um `.nvmrc`) e pnpm. O pnpm é obrigatório — o `pnpm-workspace.yaml`
libera os scripts de instalação do `sharp`, `esbuild` e `workerd`, que o pnpm 10+ bloqueia
por padrão.

---

## Checklist de projeto novo

1. `name` no `package.json` e no `wrangler.jsonc`
2. `SITE` no `astro.config.mjs` — é daqui que saem canonical, Open Graph e sitemap
3. `src/data/site.json` — nome, título, descrição, contato, redes, GA4
4. `src/styles/global.css` — a paleta e os tokens em `@theme`
5. As fontes no `astro.config.mjs` (e os tokens `--font-*` que apontam para elas)
6. `public/favicon.svg`, `favicon.ico`, `apple-touch-icon.png`
7. `public/images/og-image.jpg` — 1200×630
8. `compatibility_date` no `wrangler.jsonc`, se for um projeto novo mesmo

---

## Estrutura

```
src/
├── assets/            # imagens processadas no build (astro:assets)
├── components/        # Seo.astro, Analytics.astro, Credits.astro
├── data/site.json     # metadados, contato, redes, analytics, menu
├── layouts/           # Layout.astro — <head>, fontes, skip link
├── pages/             # roteamento por arquivo + robots.txt.ts
├── scripts/           # anchor-scroll.ts
└── styles/global.css  # tokens do design system via @theme
public/                # servido sem processamento (_headers, favicons, OG)
```

Alias de import: `@/` → `src/`. Sempre `@/components/Seo.astro`, nunca caminho relativo.

---

## O que já vem resolvido

**SEO.** `Seo.astro` monta title, description, canonical, Open Graph e Twitter Card a partir
do `site.json`, com a URL da imagem resolvida em absoluto (o WhatsApp e o Facebook não
seguem caminho relativo). `robots.txt` é gerado no build a partir do `site` do config — um
arquivo estático em `public/` aponta para o domínio errado no primeiro clone. O sitemap
exclui as páginas marcadas com `noindex`.

**Fontes self-hosted.** Via `astro:fonts`: o Astro baixa os arquivos no build, gera as
métricas de fallback (que matam o pulo de layout na troca da fonte de sistema pela real) e
emite o `preload`. Um round-trip a menos que o `<link>` para o `fonts.googleapis.com`.

**Cabeçalhos.** `public/_headers` traz HSTS, `Referrer-Policy`, `nosniff`, `X-Frame-Options`
e `Permissions-Policy`, mais `immutable` no `/_astro/*`. Cada bloco explica por que está ali
— inclusive a ausência deliberada de CSP, que é uma decisão e não um esquecimento.

**Acessibilidade.** Skip link, landmarks e a base de contraste montada para WCAG AA.

**Rastreamento de origem.** `Analytics.astro` captura UTMs e click-ids na entrada da visita,
guarda na sessão e injeta como campos ocultos em todo `<form>` — o lead chega no destino
sabendo de onde veio. O GA4 só sobe se `analytics.ga4` estiver preenchido.

**Formatação.** Prettier com tabs, aspas simples, sem ponto e vírgula, 100 colunas, ordenação
de classes do Tailwind. `.gitattributes` normaliza para LF, senão o Windows e o Prettier
brigam a cada `pnpm format`.

---

## Decisões que vale conhecer antes de mexer

- **Não existe `tailwind.config.mjs`** e não deve existir. O Tailwind 4 configura por CSS:
  os tokens vivem no `@theme` do `global.css`.
- **`trailingSlash: 'always'`.** O que importa é escolher um e manter — servir `/sobre` e
  `/sobre/` como páginas distintas duplica conteúdo.
- **`scroll-behavior: smooth` está fora do CSS de propósito.** O Lenis já anima a rolagem e
  o `anchor-scroll.ts` desconta o header fixo; ligar os dois faz a rolagem brigar consigo
  mesma.
- **Comentários longos dentro do markup usam `{/* */}`**, não `<!-- -->`. Os primeiros o
  Astro remove no build; os segundos vão parar no HTML do visitante.
- **`noindex` e sitemap andam juntos.** Ao marcar uma página, acrescente o caminho a
  `EXCLUDED` no `astro.config.mjs`.

---

## Deploy

Estático, sem adapter. O `wrangler.jsonc` descreve o Worker de Static Assets — sem campo
`main`, o Cloudflare serve os arquivos direto da borda sem invocar Worker nenhum.

- **Local:** `pnpm deploy`
- **Contínuo:** Workers Builds pela integração Git — o Cloudflare roda `pnpm build` e publica
  `dist/` sozinho. Nesse caso o `wrangler` vira descritor, não CLI.

Quando alguma rota sair do prerender (form handler, API), instale `@astrojs/cloudflare`,
declare o adapter e acrescente `main` mais um binding em `assets.binding`.

---

## Sobre

Feito por **Márcio Toledo** — desenvolvedor e consultor, tocando a
[Toledo Interactive](https://toledointeractive.com).

- Site e portfólio: [marciotoledo.com](https://marciotoledo.com)
- Blog: [marciotoledo.com/blog](https://marciotoledo.com/blog)
- Ferramentas e indicações: [marciotoledo.com/links](https://marciotoledo.com/links)
- GitHub: [@toledox82](https://github.com/toledox82)
- LinkedIn: [in/toledox82](https://linkedin.com/in/toledox82)
- Instagram: [@toledox82](https://instagram.com/toledox82)
- X: [@toledox82](https://x.com/toledox82)

Use à vontade. Se este starter te poupar uma tarde, me conta.
