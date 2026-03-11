---
name: email-react-templates
description: Designs consistent, modern, and robust email templates using React Email components that render correctly across major email clients while being delivered via SMTP in development and AWS SES in production. Use when creating, reviewing, or updating transactional or marketing email designs in this project.
---

# React Email Templates for SMTP & SES

## Purpose

This skill guides the agent to design and review HTML emails implemented with React Email, optimized for:

- Development: local SMTP / preview (for example, MailDev, mailpit, or React Email preview tools)
- Production: AWS SES (sandbox and production)
- Clients: Gmail (web/mobile), Outlook (desktop/web), Apple Mail, iOS Mail, Android, Yahoo, and similar clients

Focus on robust rendering over “fancy” CSS, with modern, clean aesthetics that still respect email client limitations.

## Core Principles

1. **Tables-first layout**
   - Always use `<table>`-based layout for main structure (rows/columns, side-by-side blocks).
   - Use nested tables for sections (header, hero, body, footer).
   - Avoid relying on CSS Grid, absolute positioning, or complex Flexbox for critical layout.
   - If Flexbox is used, treat it as progressive enhancement; ensure table-only fallback is acceptable.

2. **Inline styles and minimal `<style>`**
   - Prefer inline styles on elements for core styling (colors, spacing, typography).
   - Keep any `<style>` blocks small; avoid complex selectors since some clients strip or truncate long styles.
   - Never depend on external CSS files or `<link>` tags.

3. **Conservative CSS**
   - Widely safe:
     - `background-color`, `color`, `border`, `border-radius`
     - `padding`, `margin` (margin may be inconsistent in some Outlook versions; prefer table cell padding where needed)
     - `font-family`, `font-size`, `line-height`, `text-align`
     - `max-width`, `width`, `height` (with explicit table cell widths)
   - Use cautiously:
     - `display: flex` (supported in many modern clients, but sub-properties can be dropped, especially in Gmail; never required for layout correctness).
     - `@media` queries for responsiveness (good for mobile clients, but not supported in Gmail desktop and some Outlook versions; design should be legible without them).
   - Avoid or do not rely on:
     - `background-image`, gradients, complex shadows, filters.
     - CSS Grid, `position: absolute` or `fixed`, `clip-path`, complex transforms.
     - Large or complex keyframe animations.

4. **Typography and fonts**
   - Default to system-safe fonts, for example:
     - `-apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif`
   - Web fonts (`@font-face`, Google Fonts) are not consistently supported; treat them as optional only.
   - Use comfortable line-height (about `1.4`–`1.6`) and minimum body size around `14`–`16px` for readability.

5. **Color, branding, and spacing**
   - Keep design clean and high-contrast for accessibility.
   - Ensure sufficient padding around sections and clickable elements.
   - Use simple brand accents (solid background sections, simple borders); avoid intricate gradients that may not render well.

6. **Responsiveness strategy**
   - Primary: fluid, single-column-friendly layout with a max-width wrapper (for example, `600px`) and generous padding.
   - Secondary: optional media queries to tweak font sizes or stack multi-column elements on mobile.
   - Assume that some clients ignore media queries; the non-media-query version must still look acceptable.

## React Email and JSX Patterns

When building with React Email (for example, `@react-email/components`):

- Use the provided primitives where possible:
  - `Html`, `Head`, `Preview`, `Body`, `Container`, `Section`, `Row`, `Column`, `Img`, `Text`, `Button`, and similar components.
- Structure:
  - Wrap content in a centered container with fixed `maxWidth` (commonly `600px`) and `width: '100%'`.
  - Use `Section` and `Row` or `Column` to mimic table layouts, and confirm that generated HTML uses tables or provide custom table markup when necessary.

### Recommended layout skeleton

- Outer `Body` with neutral background color.
- Centered `Container` for the main email card.
- Clear sections:
  - Brand or header
  - Hero or key message
  - Detailed content
  - Call-to-action
  - Footer (legal, contact, unsubscribe or preferences link when relevant)

## SMTP (development) and AWS SES (production)

1. **Content neutrality**
   - Do not include environment-specific URLs or secrets directly in templates; pull from configuration or environment variables in the application layer.
   - Ensure links are absolute (`https://…`) for production; development can use local or staging hosts.

2. **SES requirements**
   - Assume a clear subject line and recognizable from identity are configured by the sending layer.
   - For marketing-style emails, include:
     - Physical mailing address.
     - Unsubscribe or preferences link where compliance requires it.

3. **Plain-text fallback**
   - Where possible, maintain or generate a plain-text version of key information (even if done by the sending layer rather than inside the JSX component).
   - Avoid encoding critical instructions only in images.

## Compatibility Rules (2026 Snapshot)

Use these assumptions for major email clients:

- Layout:
  - Tables are universally supported and should be the backbone of layout.
  - Flexbox may be partially supported in modern clients, but Gmail can strip some flex properties; design must remain correct without flex.
- Media queries:
  - Mobile Gmail and iOS or Apple Mail support media queries; Gmail desktop and older Outlook versions do not.
  - Use media queries to improve mobile experience, not to fix a broken default.
- CSS limits:
  - Some clients strip unsupported properties and may clip long style blocks.
  - Keep HTML reasonably small and avoid huge embedded CSS blocks.

When uncertain, prefer simpler markup and styles over clever CSS.

## Design Checklist

Use this checklist when creating or reviewing an email:

- Layout:
  - [ ] Main structure is table-based (or uses React Email components that output tables).
  - [ ] Email width is constrained to about `600px` and centered.
  - [ ] Sections are clearly separated with padding and, where helpful, background colors.
- Typography and colors:
  - [ ] Uses system-safe fonts with fallbacks.
  - [ ] Text is legible (at least `14px`, with good contrast).
  - [ ] Links and buttons are visually distinct and clearly clickable.
- Buttons and calls to action:
  - [ ] Buttons use bulletproof markup (for example, table-based buttons with inline styles).
  - [ ] Calls to action still work if images are blocked.
- Images:
  - [ ] All `img` tags have `alt` attributes.
  - [ ] Critical information is not solely in images.
  - [ ] Images have explicit `width` and `height` attributes for predictable layout.
- Responsiveness:
  - [ ] Layout remains readable on small screens, even if media queries are ignored.
  - [ ] No content forces horizontal scrolling due to inflexible widths.
- Links and footer:
  - [ ] All links use proper `https://` URLs where applicable.
  - [ ] Footer includes brand name and any required legal or compliance information.
  - [ ] For promotional emails, includes unsubscribe or preference link and address where required.
- Deliverability hygiene:
  - [ ] Avoid spammy phrases and excessive punctuation in headings or calls to action.
  - [ ] Code is clean and free from unnecessary inline JavaScript or unusual attributes.

## Usage Examples

### Creating a new transactional email

When implementing a password reset email, invoice email, or similar:

1. Define a React Email component using `Html`, `Head`, `Preview`, `Body`, `Container`, `Section`, `Text`, `Img`, `Button`, and related components.
2. Use table or section-based layout and inline styles following the principles in this skill.
3. Accept URL props and dynamic data from the caller (for example, reset link, invoice URL).
4. Verify the design against the design checklist.

### Reviewing an existing email template

When reviewing or refactoring an existing template:

1. Inspect the React Email component usage or the generated HTML.
2. Check for overuse of Flexbox or Grid, or reliance on complex CSS properties with weak support.
3. Ensure alt text, adequate contrast, and sensible font sizes.
4. Propose a revised version using the layout and compatibility rules from this skill.

## Summary

- Default to table-based, inline-styled, centered layouts with a maximum width around `600px`.
- Treat Flexbox, media queries, and advanced CSS as progressive enhancement, not requirements.
- Aim for clean, brand-aligned, readable designs that render correctly in Gmail, Outlook, Apple Mail, mobile clients, and when delivered via both local SMTP and AWS SES.

