# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Astro starter template used as the base for Toledo Interactive websites. It is a **skeleton**:
everything here should stay generic. Resist adding project-specific components, copy, or data —
if it wouldn't make sense in the next three sites, it doesn't belong.

- **Language**: Brazilian Portuguese (`lang` comes from `src/data/site.json`)
- **Output**: static (SSG), no adapter. Deployed to Cloudflare Workers (Static Assets).

**Stack:**

- **Astro** 7 — framework
- **Tailwind CSS** 4 — via the Vite plugin, tokens in `@theme`
- **Alpine.js** 3 — client-side interactivity
- **Lenis** (via `astro-lenis`) — smooth scrolling
- **Sharp** — image optimization
- **TypeScript** — strict mode (`astro/tsconfigs/strict`)
- **pnpm** — mandatory, do not use npm/yarn

## Commands

- `pnpm dev` — dev server at localhost:4321
- `pnpm build` — production build to `./dist/`
- `pnpm preview` — preview the production build
- `pnpm check` — `astro check`, TypeScript type checking (the only automated verification; there is no test suite)
- `pnpm format` / `pnpm format:check` — Prettier
- `pnpm deploy` — build + `wrangler deploy`

Node ≥ 22.12 (`.nvmrc`). `pnpm-workspace.yaml` allow-lists the install scripts for `sharp`,
`esbuild` and `workerd` — pnpm 10+ blocks them by default and the build breaks without it.

## Architecture

### Import aliases

`@/` maps to `src/` (in `tsconfig.json`). Always use it — never relative paths. Note the
slash: npm-scoped packages like `@astrojs/*` are unaffected.

### Layout flow

Pages → `Layout.astro` (props: `title`, `ogTitle`, `description`, `image`, `type`, `noindex`)
→ `Seo.astro` for meta tags. `Layout.astro` also owns the `<head>`, the `<Font>` tags, the
skip link and the `preload-transitions` removal.

### Site data

Global metadata lives in `src/data/site.json` (siteName, siteUrl, title, description, lang,
author, OG image, contact, social, analytics, menu). Imported as `site`. Nothing that belongs
there should be hardcoded in a component.

### Design system

Tokens live in `@theme` in `src/styles/global.css` — colors (`primary`, `secondary`,
`accent`, `accent2`, `background`, `alternative`), fonts (`title`, `sans`), `radius-default`,
`shadow-default`. **There is no `tailwind.config.mjs` and there must not be one** — Tailwind 4
configures through CSS.

### Fonts

Self-hosted through `astro:fonts`: declared in the `fonts` array in `astro.config.mjs`
(Google provider, downloaded at build time), emitted by `<Font>` in `Layout.astro`. The
`@theme` tokens point at the generated CSS variables (`var(--font-outfit)`) — do **not**
hardcode family names there, or Astro's fallback metrics are bypassed and layout shift comes
back. Trim `weights` to what the site actually renders.

### Endpoints

`src/pages/robots.txt.ts` generates robots.txt from `site` in the config, with a
`Content-Signal` line opting out of AI training.

## Non-obvious decisions

- **`trailingSlash: 'always'`.** Changing it means updating the `href`s in `site.json` too.
- **`scroll-behavior: smooth` is deliberately absent from `global.css`.** Lenis animates the
  scroll and `src/scripts/anchor-scroll.ts` offsets the fixed header; enabling both makes the
  scroll fight itself. `anchor-scroll` finds the header via `[data-header]` — mark yours.
- **`noindex` and the sitemap go together.** Marking a page `noindex` means adding its path to
  `EXCLUDED` in `astro.config.mjs`; signalling both at once contradicts itself for crawlers.
- **Long comments inside markup use `{/* */}`, not `<!-- -->`.** Astro strips the first at
  build time; the second ships to the visitor.
- **`public/_headers` has no CSP, on purpose.** The reasoning is written in the file — read it
  before "fixing" the omission.
- **`Analytics.astro` is config-gated.** It ships nothing unless `analytics.ga4` is filled in;
  the UTM capture runs regardless and is intentionally inline.

## Code patterns

### Formatting (Prettier)

Tabs, single quotes, no semicolons, 100 columns, `htmlWhitespaceSensitivity: "strict"`,
`bracketSameLine: true`, Tailwind class sorting via plugin. Write natural markup and let
Prettier wrap it — do NOT hand-write `{' '}` spacers. `.gitattributes` forces LF; without it
Git checks out CRLF on Windows while Prettier writes LF, and every `pnpm format` marks files
as changed for nothing.

### Props in Astro components

```astro
---
interface Props {
	name: string
	size?: number
}

const { name, size = 44 } = Astro.props
---
```

Interface always named `Props`, optional props with `?`, defaults in the destructuring right
below it.

### Naming

- Components: PascalCase; page sections prefixed with `Section`
- Data files, scripts, libs, assets: kebab-case

## Toledo Interactive conventions

- Code in English (variables, functions, components); content in Brazilian Portuguese
- **Performance and SEO are the priority**
- **WCAG AA accessibility** — contrast, landmarks, alt text, keyboard navigation
- Utility-first Tailwind; avoid custom CSS. Exception: theme tokens and the few base rules in
  `global.css`
- Comment the _why_, never the _what_ — a comment that restates the code is noise, one that
  records a decision or a trap is the point
- Prefer editing existing files over creating new ones
- Don't over-engineer — the minimum necessary for the task
- Optimized images in `src/assets/` through `astro:assets`; static files (favicons, OG images)
  in `public/`
- Mobile-first responsive
- SSG wherever possible
