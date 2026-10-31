# Evil Buttons Registry Checklist

Use this checklist when debugging registry/docs mismatches.

- `components/evil-buttons/<file>.tsx` exists and exports the component shown in docs.
- `content/docs/<slug>.mdx` includes `<Cmd>@evilbuttons/<registry-name></Cmd>`.
- `components/mdx-custom-components.tsx` imports and exposes every component used in MDX previews.
- `scripts/build-registry.mjs` reads the component source before building items.
- The registry item includes `$schema`, `name`, `type: "registry:ui"`, `title`, `description`, `files`, and dependency fields when needed.
- `index.items` includes the same registry `name` and source file path.
- The builder writes `public/r/<registry-name>.json` and `public/r/index.json`.
- Run `npm run registry:build` before `npm run registry:test`.
