---
name: awesome-design-md
description: Library of 74 DESIGN.md files describing the visual design systems of well-known products (Stripe, Linear, Vercel, Apple, Notion, Figma, Spotify, Airbnb, ElevenLabs, Claude and more) — colours, type, spacing, components and rules. Use when the user wants a page, UI, deck or video styled "like <brand>", asks for a DESIGN.md starting point, or wants a reference design language to keep generated UI visually consistent.
---

# Awesome DESIGN.md

`design-md/<brand>/DESIGN.md` holds one plain-text design system per product (source:
VoltAgent/awesome-design-md, MIT). List the folders to see every brand.

## Use

1. Pick the closest brand (`ls design-md`), read its `DESIGN.md` in full.
2. Treat it as a style reference: palette, typography scale, spacing, radii, shadows,
   component patterns, do/don't rules. Translate tokens into the project's own theme file
   rather than inlining values.
3. If the user wants it as the project's design contract, copy it to the project root as
   `DESIGN.md` and follow it for all UI work.

Do not reproduce a brand's logo, name or trademarked assets in the user's product. Borrow
the design language, not the identity.
