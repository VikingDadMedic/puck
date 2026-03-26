---
name: create-recipe
description: Scaffold a new framework recipe (starter template) for Puck. Use when the user wants to create a new starter app, add a framework integration, or set up a recipe for Next.js, Remix, React Router, or another framework.
---

# Create a Puck Recipe

Guide for adding a new framework recipe/starter template to the monorepo.

## When to Use

- User asks to create a new starter template or recipe
- User wants to integrate Puck with a new framework
- User mentions "recipe", "starter", "template", or "framework integration"

## What is a Recipe?

Recipes are standalone apps under `recipes/` that demonstrate how to integrate Puck with a
specific framework. They also serve as templates for `create-puck-app` CLI scaffolding.

Existing recipes: `next`, `next-ai`, `remix`, `remix-ai`, `react-router`, `react-router-ai`.

## Directory Structure

```
recipes/<framework>/
├── app/                    # Framework-specific app directory
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page (renders published content)
│   ├── [... puckPath]/     # Catch-all for content pages
│   │   ├── page.tsx        # Server component (data loading)
│   │   └── client.tsx      # Client component (Puck editor/render)
│   └── puck/               # Editor routes (optional separate prefix)
│       ├── [...puckPath]/
│       │   ├── page.tsx
│       │   └── client.tsx
│       └── api/
│           └── route.ts    # Save endpoint
├── package.json
├── tsconfig.json
├── next.config.js          # or vite.config.ts, remix.config.js
└── README.md
```

## Step-by-Step

### 1. Create `package.json`

Model after `recipes/next/package.json`:

```json
{
  "name": "<framework>-recipe",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "<framework dev command>",
    "build": "<framework build command>",
    "start": "<framework start command>",
    "lint": "eslint"
  },
  "dependencies": {
    "@puckeditor/core": "*",
    "<framework>": "<version>",
    "react": "^19.2.1",
    "react-dom": "^19.2.1"
  },
  "devDependencies": {
    "@types/node": "^17.0.12",
    "@types/react": "^19.2.7",
    "@types/react-dom": "^19.2.3",
    "eslint-config-custom": "*",
    "typescript": "^5.5.4"
  }
}
```

Key points:

- Use `"@puckeditor/core": "*"` for workspace resolution
- Set `"private": true` -- recipes are not published
- Include `eslint-config-custom` from workspaces

### 2. Implement the routing pattern

Every recipe needs two route types:

**Content rendering** (e.g. `app/[...puckPath]/page.tsx`):

- Load saved Puck data for the path
- Render with `<Render config={config} data={data} />`

**Editor** (e.g. `app/puck/[...puckPath]/client.tsx`):

- Load saved Puck data
- Render `<Puck config={config} data={data} onPublish={save} />`
- Include a save mechanism (API route, server action, filesystem, etc.)

### 3. Create a Puck config

Add example components so the recipe works out of the box:

```tsx
import { Config } from "@puckeditor/core";

const config: Config = {
  components: {
    Heading: {
      fields: { text: { type: "text" } },
      defaultProps: { text: "Heading" },
      render: ({ text }) => <h1>{text}</h1>,
    },
    Paragraph: {
      fields: { content: { type: "textarea" } },
      defaultProps: { content: "Paragraph text" },
      render: ({ content }) => <p>{content}</p>,
    },
  },
};
```

### 4. Register in the monorepo

1. The recipe is automatically included in Yarn workspaces via `recipes/*` glob
2. Run `yarn` from root to link dependencies

### 5. Add to `create-puck-app` (optional)

If the recipe should be available via `npx create-puck-app`:

1. Create a Handlebars template under `packages/create-puck-app/templates/<framework>/`
2. Add the framework option to the CLI inquirer prompts in `packages/create-puck-app/index.js`

### 6. For AI variants

AI recipes add `@puckeditor/cloud-client` and `@puckeditor/plugin-ai` to dependencies.
Follow the pattern in `recipes/next-ai/` -- it mirrors `recipes/next/` with additional
AI-powered generation features.

## Checklist

- [ ] `package.json` with `@puckeditor/core: "*"` workspace dep
- [ ] Framework-specific config (next.config.js, vite.config.ts, etc.)
- [ ] Content rendering route
- [ ] Editor route with save mechanism
- [ ] Example Puck config with at least 2-3 components
- [ ] README.md with setup instructions
- [ ] `yarn` from root succeeds

## Reference Files

- `recipes/next/` -- Next.js 16 App Router recipe (canonical reference)
- `recipes/react-router/` -- Vite + React Router 7 recipe
- `recipes/remix/` -- Remix recipe
- `packages/create-puck-app/` -- CLI scaffolding tool and templates
