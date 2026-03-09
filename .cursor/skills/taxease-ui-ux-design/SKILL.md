---
name: taxease-ui-ux-design
description: Designs modern, award-level pages and components for the TaxEase app using the Tailwind CSS + shadcn/ui design system defined in taxease-design-system-tailwind-shadcn.json, with purposeful micro-animations and interactions. Use when creating or modifying any UI layout, page, or component.
---

# TaxEase UI/UX Design

## Role

Act as the dedicated UI/UX designer for the TaxEase product. All visual and interaction decisions must:

- **Follow** the design tokens, layouts, and component recipes defined in `taxease-design-system-tailwind-shadcn.json`.
- **Use** Tailwind CSS utility classes and shadcn/ui primitives as mapped in that file.
- **Incorporate** subtle, purposeful micro-animations (mostly via `framer-motion` and the `animation` section of the design system).

Always read or re-skim `taxease-design-system-tailwind-shadcn.json` before designing a new page or complex component to stay aligned with the latest tokens and patterns.

## When to Apply This Skill

Use this skill whenever:

- **Designing a new page** (marketing, dashboard, onboarding, settings, flows).
- **Implementing or refactoring components** that users see or interact with (forms, cards, tables, navigation, modals, banners).
- **Adding micro-interactions** (scroll reveals, hover states, button feedback, staggered grids).
- **Ensuring consistency** with existing TaxEase visuals and interaction patterns.

If a task touches anything visual in the app, assume this skill is relevant.

## Core Design Principles

1. **Follow the design system, don’t improvise tokens**
   - Colors, spacing, typography, border radii, and shadows must come from:
     - `tailwind_config.extend` (colors, radii, shadows).
     - `colors.palette`, `typography.scale`, `spacing`, `border_radius`, `shadows`.
   - Prefer the Tailwind class mappings (e.g. `bg-primary`, `text-gray-600`, `rounded-card`, `shadow-card`) instead of raw hex values.

2. **Use the provided layout primitives**
   - For page and section structure, start from `layout_classes`:
     - **Page shell**: `page_wrapper`, `section_container`.
     - **Major sections**: `navbar`, `hero`, `stats_bar`, `features`, `process`, `testimonials`, `cta_banner`, `footer`.
   - When designing new pages/screens, compose them from these patterns, adapting:
     - Grid templates and responsive classes in `responsive_classes`.
     - `section_anatomy` and `contrast_breaks` to keep rhythm and visual hierarchy.

3. **Use shadcn/ui for all primitives**
   - For buttons, cards, badges, avatars, separators, and nav:
     - Consult `shadcn_components.component_map` for imports and variants.
   - Prefer the provided recipes:
     - `Button` variants like **primary**, **ghost**, **outline_white**, **cta_banner`.
     - `Card` variants like **feature_card**, **featured_dark_card**, **testimonial_card**, **hero_widget**, **stat_card**.
     - `Badge` variants for compliance and trust signals.
   - Avoid bespoke HTML+divs where a shadcn component recipe exists.

4. **Micro-animations and interactions are default, not optional**
   - Use `animation.motion_variants`, `section_animation_map`, and `hover_interactions`:
     - **Scroll entrance**: `fadeUpEnter`, `fadeIn`, `scaleIn`, `staggerContainer`, `slideInLeft`, `slideInRight`.
     - **Hover**: gentle elevation and translation on cards and key CTAs.
   - Prefer the reusable components from `animation.reusable_components`:
     - `ScrollReveal` for single blocks or headers.
     - `StaggerGrid` for grid-based content (features, testimonials, cards).
   - Treat animations as **purposeful**:
     - Highlight hierarchy (hero first, then primary CTAs, then supporting content).
     - Reinforce affordances (buttons and interactive cards feel alive on hover and tap).

5. **Iconography and trust**
   - Use `icon_system` (lucide-react) for consistent icon language:
     - Follow `container_pattern` for icon wraps and color variants.
   - Implement trust patterns from `design_patterns.trust_signals`:
     - Hero compliance badge, stats bar, testimonials, and CTA trust copy.

6. **Copy and tone**
   - Use `copywriting_patterns` to shape headings, eyebrows, stats, and CTAs:
     - Hero headline: bold claim + italic accent line with Nigerian context where appropriate.
     - Eyebrows: SCREAMING SNAKE CASE, max 4 words.
     - Stats: concise labels, use `₦` for currency.

## Page and Section Workflow

When designing a new page or major section:

1. **Frame the objective**
   - Identify the primary user action (e.g. start filing, complete onboarding step, configure settings).
   - Decide which existing pattern (hero, feature grid, process steps, CTA banner, etc.) best supports this goal.

2. **Choose a structural pattern**
   - Start from `layout_classes` and `responsive_classes`:
     - Use existing section patterns if the new UI is similar (e.g. a new “Benefits” section can reuse `features.section` and `features.grid`).
     - For dashboard-style screens, adapt container and grid patterns from `features`, `stats_bar`, or `process`.

3. **Wire up shadcn primitives**
   - Wrap content in the appropriate Card, Button, Badge, etc., as mapped in `shadcn_components`.
   - For any new card- or tile-like component, consider:
     - Using `feature_card` or `testimonial_card` styles as a base.
     - Maintaining consistent paddings from `spacing.card_padding`.

4. **Apply tokens and typography**
   - Use typography scale entries (e.g. `section_headline`, `section_subheading`, `card_title`, `card_body`) to pick text classes.
   - Use spacing tokens for margins (e.g. `headline_to_subtext`, `subtext_to_content`).

5. **Add interactions and motion**
   - Wrap headers and key content in `ScrollReveal` with appropriate `delay` values based on `section_animation_map`.
   - For grids, wrap in `StaggerGrid` to animate children in.
   - Apply hover and tap feedback to primary CTAs and interactive cards, using the patterns in `animation.hover_interactions`.

6. **Polish for responsiveness**
   - Use `responsive_classes` for grids and visibility helpers.
   - Ensure content stacks gracefully on mobile while preserving hierarchy and breathing room.

## Component-Level Workflow

When crafting or refactoring a single component (card, widget, banner, form section):

1. **Check for an existing recipe**
   - Look under `component_recipes` for a close match (e.g. `FeatureCard`, `TestimonialCard`, `SectionHeader`, `ProcessStep`, `CTABanner`).
   - If a recipe exists:
     - Start from it, then adapt copy, icons, and layout minimally.

2. **Align with tokens**
   - Colors: use `colors.palette` → Tailwind mappings.
   - Radius: pick from `border_radius.usage`.
   - Shadow: use `shadows.usage` entries.

3. **Add motion thoughtfully**
   - Decide if the component:
     - Should animate on scroll (use `ScrollReveal`).
     - Needs hover/tap feedback (apply framer-motion `whileHover` / `whileTap` from `hover_interactions` when appropriate).

4. **Validate hierarchy and clarity**
   - Ensure there is a clear visual path:
     - Eyebrow (optional) → heading → supporting text → primary action → optional secondary link.
   - Keep noise low; one primary CTA per card or section.

## Examples of How to Use This Skill

- **Design a new marketing section**
  - Use `features.section` and `features.grid` for layout.
  - Compose each tile from `FeatureCard` recipe.
  - Wrap the grid in `StaggerGrid` for staggered entrance.

- **Create a dashboard “insights” widget**
  - Base container on `Card.hero_widget` or `Card.feature_card`.
  - Use stats typography (`stat_number`, `stat_label`) for key metrics.
  - Add gentle hover elevation and optional entrance animation using `ScrollReveal`.

- **Add an in-app CTA panel**
  - Adapt the `CTABanner` recipe:
    - Maintain `bg-primary-dark` card, rounded `cta` radius, and trust copy row.
    - Use primary button variant from `Button.cta_banner`.

In all cases, prioritize clarity, consistency with the design system, and subtle, meaningful motion over flashy or distracting effects.

