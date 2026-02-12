# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `pnpm dev` — Start local dev server
- `pnpm build` — Build production site to `./dist/`
- `pnpm preview` — Preview production build locally
- `pnpm astro check` — Type checking via @astrojs/check

No test runner or linter configured. Prettier handles formatting.

## Stack

- **Astro** 5.x — Framework (static site generation)
- **Tailwind CSS** 4.x — Styling (via `@tailwindcss/vite` plugin)
- **Alpine.js** 3.x — Interatividade client-side (`@astrojs/alpinejs`)
- **Lenis** 1.x — Smooth scrolling (`astro-lenis`)
- **Sharp** — Otimização de imagens
- **TypeScript** — Modo strict (`astro/tsconfigs/strict`)
- **pnpm** — Package manager

## Estrutura do Projeto

```
src/
├── assets/          # Assets processados pelo build (ex: logo.svg)
├── components/      # Componentes Astro reutilizáveis
├── data/            # Dados estáticos em JSON (site.json)
├── layouts/         # Templates de página (Layout.astro)
├── pages/           # Roteamento file-based
└── styles/          # CSS global (global.css com @theme do Tailwind)
public/              # Arquivos estáticos servidos sem processamento
```

## Arquitetura

**Fluxo de layout:** Pages → `Layout.astro` (props: `title`, `description`, `image`, `noindex`, `frontmatter`) → inclui `Seo.astro` para meta tags.

**Dados do site:** Metadados globais (siteName, siteUrl, title, description, OG image) ficam em `src/data/site.json`. Importado como `site` nos componentes.

**Import aliases:** `@*` → `src/*` (ex: `@components/Seo.astro`, `@data/site.json`, `@layouts/Layout.astro`).

**Endpoints dinâmicos:** `robots.txt.ts` gera robots.txt com opt-out de AI training via Content-Signal.

**Idioma:** Site em português (pt-br). `<html lang="pt-br">`.

## Padrões de Código

**Prettier (`.prettierrc`):**
- Tabs (não spaces)
- Single quotes, sem semicolons
- Print width: 100
- `bracketSameLine: true`
- Plugins: `prettier-plugin-astro` + `prettier-plugin-tailwindcss`

**Componentes Astro:**
- Frontmatter entre `---` fences com TypeScript
- Props desestruturadas diretamente de `Astro.props`
- Imports usando alias `@*` sempre (nunca caminhos relativos)

**Alpine.js:**
- Diretiva `x-cloak` suportada globalmente (estilo em Layout.astro)
- Usar atributos Alpine (`x-data`, `x-bind`, etc.) diretamente no markup

## Convenções Toledo Interactive

- **Stack padrão:** Astro + Tailwind CSS + Alpine.js
- **Performance e SEO são prioridade** — Componente `Seo.astro` gerencia Open Graph, Twitter Cards, canonical URLs e robots
- **Acessibilidade WCAG AA** — Garantir contraste, landmarks, alt texts e navegação por teclado
- **Tailwind utilitário** — Usar classes utilitárias do Tailwind; evitar CSS custom. Exceção: variáveis de tema em `global.css` via `@theme`
- **TypeScript** nos componentes — Modo strict habilitado
- **Tema:** Cores e fontes definidas em `src/styles/global.css` via diretiva `@theme` do Tailwind 4:
  - Cores: `primary`, `secondary`, `accent`, `accent2`, `background`, `alternative`
  - Fontes: `font-title` (Outfit) para títulos, `font-sans` (Inter) para corpo
