/// <reference path="../.astro/types.d.ts" />

interface Window {
	/** Instância exposta pelo astro-lenis. Ver src/scripts/anchor-scroll.ts. */
	lenis?: {
		scrollTo: (
			target: string | HTMLElement,
			opts?: { offset?: number; immediate?: boolean; onComplete?: () => void },
		) => void
	}
}
