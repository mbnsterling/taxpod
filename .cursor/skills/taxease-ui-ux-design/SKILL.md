---
name: taxease-ui-ux-design
description: Designs modern, award-level pages and components for the TaxEase app using the updated emerald glass SaaS design system (Tailwind CSS + shadcn/ui + framer-motion) defined in taxease-design-system-tailwind-shadcn.json. Use when creating or modifying any UI layout, page, or component.
---

# TaxEase UI/UX Design

## Role

Act as the dedicated UI/UX designer for the TaxEase product. All visual and interaction decisions must:

- **Follow** the emerald-glass SaaS design tokens and layout patterns defined in `taxease-design-system-tailwind-shadcn.json` under `design_system`.
- **Use** Tailwind CSS utility classes and shadcn/ui primitives, styled via the provided button, card, navbar, typography, and glassmorphism specs.
- **Incorporate** subtle, purposeful micro-animations via `framer-motion` using the `motion` section (`variants`, `stagger`, `recommended_usage`).

Always read or re-skim `taxease-design-system-tailwind-shadcn.json` before designing a new page or complex component to stay aligned with the latest tokens and patterns.

## When to Apply This Skill

Use this skill whenever:

- **Designing a new page** (marketing, dashboard, onboarding, settings, flows).
- **Implementing or refactoring components** that users see or interact with (forms, cards, tables, navigation, modals, banners).
- **Adding micro-interactions** (scroll reveals, hover states, button feedback, staggered grids).
- **Ensuring consistency** with existing TaxEase visuals and interaction patterns.

If a task touches anything visual in the app, assume this skill is relevant.

## Core Design Principles

1. **Emerald-glass visual language**
   - Default aesthetic is a light, breathable SaaS look:
     - Background base from `colors.background.primary` (currently `#F8FAFC`).
     - Brand color is emerald (`colors.brand.primary` with shades `emerald-400` → `emerald-900`).
     - Surfaces use glassmorphism from `glassmorphism`:
       - `bg-white/60`, `backdrop-blur-xl`, `border border-white/40`, and soft card shadows from `shadows.card`.
   - Never introduce new hex colors or arbitrary radii/shadows; always derive from:
     - `colors`, `glassmorphism`, `radius`, `shadows`, and `gradients`.

2. **Use the provided layout structure**
   - Structure pages using `layout`:
     - Container: `layout.container.max_width`, `layout.container.padding_x`, `layout.container.center`.
     - Sections: vertical spacing from `layout.sections.padding_y`, centered via `layout.sections.max_content_width` + `layout.sections.center`.
   - For core marketing and dashboard layouts, lean on `layout.grid_patterns`:
     - `hero`, `features`, `stats`, `testimonials`, `steps`.
   - When designing new screens, pick the closest grid pattern and adjust content while preserving spacing and hierarchy.

3. **Use shared UI primitives (no bespoke controls)**
   - For all interactive or content surfaces:
     - Use `~/components/ui/button`, `~/components/ui/card`, `~/components/ui/badge`, `~/components/ui/avatar`, `~/components/ui/separator`, `~/components/ui/navigation-menu`.
   - Visually align these primitives with tokens:
     - Cards: `cards.base` and `cards.padding` + `radius.card` or `radius.large_card`.
     - Buttons: see “Button System” section below, mapping to `buttons.primary` and `buttons.secondary`.
     - Navbar: `navbar.base`, `navbar.background`, `navbar.border`, `navbar.shadow`.
   - Avoid building new ad-hoc button/card styles when an existing primitive plus tokens can express the design.

4. **Micro-animations and interactions are default, but subtle**
   - Motion is defined under `motion`:
     - Library: `framer-motion`.
     - Philosophy: “very subtle, minimal movement, fast transitions”.
   - Use `motion.variants`:
     - `fade_in`, `fade_up`, `fade_down`, `scale_in`, `card_hover`, `button_tap`.
   - Respect timing and easing from `motion.transition`:
     - `duration_fast` (0.2), `duration_normal` (0.35), `easeOut`.
   - Use `motion.stagger.container` for grids and lists, and follow `motion.recommended_usage`:
     - Sections & hero content → `fade_up`.
     - Cards → `scale_in` + `card_hover`.
     - Buttons → `button_tap`.

5. **Ambient background effects and depth**
   - Use `background_effects.ambient_blobs` sparingly to add depth:
     - Large, blurred, low-opacity blobs at corners (e.g. `bg-emerald-200`, `bg-blue-200`, `bg-amber-100`).
   - Combine with `gradients.brand_text` and other gradient tokens for premium-feeling headings and icon backgrounds:
     - Brand text: `gradients.brand_text`.
     - Icons: `gradients.icon_blue`, `icon_orange`, `icon_pink`, `icon_purple` or `colors.icon_gradients`.
   - Ensure ambient effects never overwhelm legibility or primary CTAs.

6. **Typography and hierarchy**
   - Use `typography`:
     - Base font: `font-sans`.
     - Weights from `typography.weights` (`font-medium`, `font-bold`, `font-extrabold`, `font-black`).
     - Sizes: hero (`typography.sizes.hero`), section titles (`section_title`), card titles (`card_title`), body and small (`body`, `small`).
   - Create a clear hierarchy:
     - Eyebrow (optional, small & muted) → headline (bold/extra-bold) → supporting text (body) → primary action.
   - Use `colors.text.primary/secondary/muted` to control emphasis instead of arbitrary gray classes.

7. **Iconography and trust**
   - Use `lucide-react` icons inside the icon container pattern from `icons.container`:
     - Size (`w-12 h-12`), radius (`rounded-xl`), and flex centering.
   - Use gradients from `gradients` or `colors.icon_gradients` for icon backgrounds to signal interactivity and category.
   - Reinforce trust and compliance visually:
     - Use emerald tones and subtle gradients for “secure”, “compliant”, and “trusted by” elements.
     - Combine icons, short copy, and supporting stats where appropriate.

## Page and Section Workflow

When designing a new page or major section:

1. **Frame the objective**
   - Identify the primary user action (e.g. start filing, complete onboarding step, configure settings).
   - Decide which existing pattern (hero, feature grid, stats bar, testimonials, steps, CTA banner, etc.) best supports this goal.

2. **Choose a structural pattern**
   - Start from `design_system.layout`:
     - Wrap content in the main container (`max_width`, `padding_x`, centered).
     - Use `layout.sections.padding_y` for vertical rhythm.
     - Choose a grid from `layout.grid_patterns` (`hero`, `features`, `stats`, `testimonials`, `steps`) as the base.
   - For dashboard-style screens, adapt the `features` or `stats` grids to show key metrics and cards.

3. **Wire up shadcn primitives**
   - Wrap content in `Card`, `Button`, `Badge`, `Avatar`, and `NavigationMenu` components from `~/components/ui`.
   - For any new card- or tile-like component:
     - Use `cards.base` + `cards.padding` with `radius.card` or `radius.large_card`.
     - Apply `glassmorphism.blur` and `glassmorphism.border` for premium surfaces where appropriate.

4. **Apply tokens and typography**
   - Use `typography.sizes.hero` for hero headlines, `section_title` for section headers, `card_title` and `body` inside cards.
   - Use text colors from `colors.text` to control emphasis.
   - Keep margins and gaps consistent with `spacing.section_gap`, `spacing.card_gap`, and `spacing.large_margin`.

5. **Add interactions and motion**
   - Use reusable animation helpers (e.g. `ScrollReveal`, `StaggerGrid`) implemented via `motion.variants`:
     - Sections and hero text → `fade_up`.
     - Cards and tiles → `scale_in` with `card_hover` on hover.
     - Buttons → `button_tap` on press.
   - Keep transitions fast and subtle (`duration_fast` or `duration_normal`), never bouncy or slow.

6. **Polish for responsiveness**
   - Use Tailwind responsive utilities (`md:`, `lg:`) in combination with `layout.grid_patterns` to define breakpoints.
   - Ensure content stacks gracefully on mobile while preserving hierarchy and breathing room; avoid cramped mobile layouts.

## Homepage Layout Blueprint (marketing landing)

The main marketing homepage should follow this emerald-glass structure and section order:

- **Navbar**
  - Fixed top bar using `navbar.base`, `navbar.background`, `navbar.border`, `navbar.shadow`.
  - Left: TaxEase logo (green rounded square icon + wordmark).
  - Center/right: text nav links (`Features`, `Pricing`, `About`) styled with `typography.sizes.body` and `colors.text.secondary`.
  - Right: `Log in` text link + **primary emerald CTA button** (“Start filing free”) using the primary button spec.

- **Hero**
  - Two-column layout on desktop using `layout.grid_patterns.hero`: text left, product widget card right; stacked on mobile.
  - Left text column:
    - Compliance pill badge above the headline (badge using emerald + glassmorphism hints).
    - Two-line hero headline using `typography.sizes.hero`:
      - First line bold/extra-bold.
      - Second line can use `gradients.brand_text` or accent color and optional italic.
    - Short supporting paragraph in `colors.text.secondary`.
    - Row of CTAs: solid emerald primary CTA + ghost/secondary CTA (“Watch demo”).
  - Right column:
    - Floating glassmorphism card (`cards.base`) showing a naira amount, progress indicator, and a small emerald “verified 100% secure” badge.
    - Use `motion.variants.scale_in` and subtle `card_hover` on this hero widget.

- **Stats bar**
  - Full-width light strip with subtle separators, using `layout.sections` spacing and `layout.grid_patterns.stats`.
  - 3–4 evenly spaced stat items: large bold number (`typography.weights.bold` + larger size) + tiny uppercase label (small text, `colors.text.muted`).

- **Capabilities / features grid**
  - Light brand background (`colors.background.primary`) with ambient blobs if desired.
  - Centered section header: eyebrow “CAPABILITIES”, headline “Everything you need to stay compliant”, short subcopy.
  - 3-column `layout.grid_patterns.features` grid of feature cards on desktop (1 column on mobile).
  - Use glassmorphism cards with icon containers at the top and concise body copy.
  - Optionally, include a featured darker or higher-emphasis card for enterprise messaging, using deeper emerald shades.

- **3-step process**
  - White or very light background.
  - Centered header “Tax filing in 3 simple steps”.
  - 3 columns using `layout.grid_patterns.steps`, each a step card:
    - Large, low-opacity step number (01/02/03).
    - Step title + short description.

- **Testimonials / social proof**
  - Back to light brand background with subtle blobs or gradients behind cards.
  - Left-aligned header: eyebrow “SOCIAL PROOF” + 2-line headline “Built by Nigerians, trusted by Nigerians”.
  - 3-card `layout.grid_patterns.testimonials` grid:
    - Each testimonial card uses glassmorphism (`cards.base`), avatar with `Avatar`, star rating row, quote, and name/role/location.

- **CTA banner**
  - Light brand background, with a centered deep-emerald rounded card using `radius.large_card`.
  - Inside the card: large white headline (“Join the future of Nigerian tax filing.”), supporting text, **high-contrast CTA button**, and a trust row (“No credit card · Cancel anytime”).
  - Use gradients on the CTA background or subtle noise to elevate this section.

- **Footer**
  - Light brand background with top border and soft separators.
  - 4-column grid: brand + description + social icons on the left, then “Solutions”, “Company”, and “Legal” link columns.
  - Bottom bar with copyright and small policy links.

All future marketing pages (including the Features page) should reuse this section rhythm, spacing, and emerald-glass aesthetic (alternating emphasis, consistent card and button treatments).

## Button System for Marketing Pages

Buttons must visually match the landing design and be implemented via `~/components/ui/button` (Base UI + Tailwind), **never** ad-hoc `<button>` or `<a>` styles.

- **Primary CTA (solid green)**
  - Usage: navbar “Start filing free”, hero primary CTA, key actions on cards, critical dashboard CTAs.
  - Implementation: `variant="default"` (or mapped to primary) and `size="default"` or `size="lg"` on `Button`.
  - Visual spec:
    - Based on `buttons.primary`:
      - `bg-emerald-800 text-white hover:bg-emerald-900`
      - `rounded-xl` radius with `px-6 py-3` and `font-bold`.
    - Add subtle elevation and motion:
      - Slight translate and scale on hover using `motion.variants.card_hover`.
      - `button_tap` variant on press for tactile feel.

- **Secondary / ghost CTA**
  - Usage: hero “Watch demo”, alternative actions beside a primary CTA, low-risk navigation.
  - Implementation: `variant="ghost"` or `variant="secondary"` mapped to `buttons.secondary`.
  - Visual spec:
    - From `buttons.secondary`:
      - `bg-white text-slate-900 border border-slate-200 hover:bg-slate-50`
      - Same `rounded-xl`, `px-6 py-3`, `font-bold`.
    - Works on light or glass backgrounds with strong contrast.

- **Outline on dark (white outline)**
  - Usage: outline button on dark-green cards (enterprise tile, inside CTA banner if needed).
  - Implementation: `variant="outline"` plus `className` tweaks when on dark/emerald background.
  - Visual spec:
    - `border-white/50 text-white bg-transparent hover:bg-white/10`
    - Same `rounded-xl`, font, and padding as primary CTA for consistency.

- **CTA banner button (white on green)**
  - Usage: main button inside the dark CTA banner.
  - Implementation: primary button on a deep-emerald or gradient card, styled to stand out while matching `buttons.primary` proportions.
  - Visual spec:
    - `bg-white text-emerald-800 hover:bg-slate-100`
    - `rounded-xl px-8 py-3 font-semibold`

Guidelines:

- **Consistency first**: all CTAs on a page should share the same width, height, radius, and font style; do not mix different button shapes or unrelated Tailwind styles.
- **Use `render={...}` with links**: when the CTA navigates, use `<Button render={<Link href=\"...\" />} />` so semantics stay correct while visuals stay consistent.
- **One primary action per area**: each section or card should have at most one primary CTA; anything else should be ghost or link-style.

## Component-Level Workflow

When crafting or refactoring a single component (card, widget, banner, form section):

1. **Check for an existing recipe**
   - Look for existing components and patterns in `src/components/marketing` and `src/components/ui` that match the desired outcome (e.g. feature cards, testimonial cards, CTA banners, process steps).
   - Start from these, then adapt copy, icons, and layout minimally while preserving tokens and motion patterns.

2. **Align with tokens**
   - Colors: use `colors.brand`, `colors.text`, and `colors.background` mapped to Tailwind classes.
   - Radius: use `radius.card`, `radius.large_card`, `radius.button`, or `radius.icon`.
   - Shadows: use `shadows.soft` or `shadows.card` depending on prominence.

3. **Add motion thoughtfully**
   - Decide if the component:
     - Should animate on scroll (wrap with `ScrollReveal` using `fade_up` or `fade_in`).
     - Needs hover/tap feedback (apply `card_hover` on cards and `button_tap` on buttons).

4. **Validate hierarchy and clarity**
   - Ensure there is a clear visual path:
     - Eyebrow (optional) → heading → supporting text → primary action → optional secondary link.
   - Keep noise low; one primary CTA per card or section.

## Examples of How to Use This Skill

- **Design a new marketing section**
  - Use `layout.sections` spacing and `layout.grid_patterns.features` for layout.
  - Compose each tile as a glassmorphism `Card` with an icon container, title, and short description.
  - Wrap the grid in a `StaggerGrid` helper wired to `motion.stagger.container` and `motion.variants.scale_in`.

- **Create a dashboard “insights” widget**
  - Base container on `Card` with `cards.base`, `cards.padding`, and `radius.card`.
  - Use larger bold numbers (`typography.weights.bold` + slightly larger size) and muted labels.
  - Add gentle hover elevation and entrance animation using `scale_in` + `card_hover`.

- **Add an in-app CTA panel**
  - Adapt the CTA banner pattern:
    - Deep-emerald or gradient background with `radius.large_card` and strong contrast.
    - White or near-white headline and supporting text; trust copy row beneath the CTA.
    - Use the primary or CTA banner button spec for the main action.

In all cases, prioritize clarity, consistency with the emerald-glass design system, and subtle, meaningful motion over flashy or distracting effects.

