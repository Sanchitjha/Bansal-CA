# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

- `npm run dev` — start the dev server (http://localhost:3000)
- `npm run build` — production build
- `npm run start` — run the production build
- `npm run lint` — ESLint (flat config, `eslint-config-next` core-web-vitals + typescript rules)

There is no test runner configured in this repo.

## Architecture

This is the marketing site for "Amit Bansal & Associates," a tax/accounting/compliance firm. It's a Next.js App Router project (`src/app`) that currently renders as a **single long-scrolling landing page** — `src/app/page.tsx` composes ten section components in order (Hero → TrustBanner → ServiceGrid → WhyChooseUs → HowItWorks → AboutSection → ServiceDetailPreview → ResourcesSection → FAQAccordion → FinalCTA). There is no routing beyond the root page; in-page navigation uses `#anchor` links (e.g. `#about`, `#faq`, `#final-cta`).

**Content is data-driven, not hardcoded in JSX.** `src/data/services.ts`, `src/data/faqs.ts`, and `src/data/articles.ts` export typed arrays (`ServiceItem`, `FAQItem`, etc.), each with `isActive` and `order` fields. Components filter on `isActive` and sort on `order` rather than rendering array order directly — follow this convention when adding/editing entries instead of deleting items or relying on array position.

**Cross-component communication uses native DOM CustomEvents, not React state/context.** `Navbar` dispatches a `select-preview-service` `CustomEvent` (with a service `id` as `detail`) on `window` when a user clicks a service in the dropdown; `ServiceDetailPreview` listens for it via `useEffect`/`window.addEventListener` to switch its selected tab and scroll itself into view. If you add new inter-section interactions, this is the established pattern (see `src/components/Navbar.tsx` and `src/components/ServiceDetailPreview.tsx`).

**Styling is global CSS with CSS custom properties, not Tailwind or CSS Modules.** All styles live in `src/app/globals.css`, keyed by class name (BEM-ish, e.g. `.hero-title`, `.service-card`, `.faq-item.open`). Design tokens (colors, spacing, shadows, font stacks) are defined as `:root` CSS variables at the top of that file. The layout is desktop-first with `@media (max-width: ...)` overrides for 1200px/991px/768px/480px breakpoints. When styling a new component, add rules to `globals.css` following the existing section-comment structure rather than introducing a new styling approach.

Only components with interactivity (`useState`/`useEffect`) are marked `"use client"` (`Navbar`, `FAQAccordion`, `ServiceGrid`, `ServiceDetailPreview`); everything else is a server component by default.

Fonts (`Cormorant Garamond` for serif/headings, `Plus Jakarta Sans` for sans/body) are loaded via `next/font/google` in `src/app/layout.tsx` and exposed as CSS variables (`--font-serif-google`, `--font-sans-google`) consumed by `globals.css`.

The `@/*` import alias maps to `src/*` (see `tsconfig.json`).
