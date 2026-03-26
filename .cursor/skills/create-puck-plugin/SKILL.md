---
name: create-puck-plugin
description: Scaffold a new Puck editor plugin package. Use when the user wants to create a plugin, extend the editor with a sidebar panel, override editor UI, or add field transforms.
---

# Create a Puck Plugin

Guide for creating a new `@puckeditor/plugin-*` package in this monorepo.

## When to Use

- User asks to create a new Puck plugin
- User wants to add a sidebar panel, override editor components, or add field transforms
- User mentions "plugin package" or "extend the editor"

## Plugin Type Reference

The `Plugin` type is defined in `packages/core/types/API/index.ts`:

```typescript
type Plugin<UserConfig extends Config = Config> = {
  name?: string;
  label?: string;
  icon?: ReactNode;
  render?: () => ReactElement; // Renders a sidebar panel
  overrides?: Partial<Overrides<UserConfig>>; // Replace editor UI components
  fieldTransforms?: FieldTransforms<UserConfig>; // Transform field behavior
  mobilePanelHeight?: "toggle" | "min-content";
};
```

## Step-by-Step

### 1. Create the package directory

```
packages/plugin-<name>/
├── index.ts          # or index.tsx if JSX is needed
├── src/              # optional: source subdirectory
│   └── PluginName.tsx
├── package.json
├── tsconfig.json
└── tsup.config.ts    # optional: only if overriding shared config
```

### 2. Create `package.json`

Model after `packages/plugin-heading-analyzer/package.json`:

```json
{
  "name": "@puckeditor/plugin-<name>",
  "version": "0.21.1",
  "author": "Your Name",
  "repository": "puckeditor/puck",
  "private": false,
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.mjs",
      "types": "./dist/index.d.ts"
    },
    "./dist/index.css": "./dist/index.css"
  },
  "license": "MIT",
  "scripts": {
    "lint": "eslint \"**/*.ts*\"",
    "build": "rm -rf dist && tsup index.ts",
    "prepare": "yarn build"
  },
  "files": ["dist"],
  "devDependencies": {
    "@puckeditor/core": "^0.21.1",
    "@types/react": "^19.0.1",
    "@types/react-dom": "^19.0.2",
    "eslint": "^7.32.0",
    "eslint-config-custom": "*",
    "tsconfig": "*",
    "tsup": "^8.2.4",
    "tsup-config": "*",
    "typescript": "^5.5.4"
  },
  "peerDependencies": {
    "react": "^17.0.0 || ^18.0.0 || ^19.0.0"
  }
}
```

Key points:

- `@puckeditor/core` is a **devDependency**, not a regular dependency
- React is a **peerDependency**
- Use workspace references for `tsconfig`, `tsup-config`, `eslint-config-custom`

### 3. Create `tsconfig.json`

```json
{
  "extends": "tsconfig/react-library.json",
  "include": ["."],
  "exclude": ["dist", "node_modules"]
}
```

### 4. Implement the plugin

```typescript
// index.ts
import { Plugin } from "@puckeditor/core";

const MyPlugin: Plugin = {
  name: "my-plugin",
  label: "My Plugin",
  render: () => <div>Plugin panel content</div>,
};

export default MyPlugin;
```

If the plugin has overrides:

```typescript
const MyPlugin: Plugin = {
  name: "my-plugin",
  overrides: {
    header: ({ children }) => <div className="custom-header">{children}</div>,
  },
};
```

### 5. Wire into the monorepo

1. Add to `lerna.json` packages array:

   ```json
   "packages": [..., "packages/plugin-<name>"]
   ```

2. Add to `scripts/publish.sh` publish list

3. Run `yarn` from root to link the new workspace

### 6. Test the plugin

In the demo app or a recipe, import and pass to `<Puck>`:

```tsx
import MyPlugin from "@puckeditor/plugin-<name>";

<Puck config={config} data={data} plugins={[MyPlugin]} />;
```

## Reference Files

- `packages/plugin-heading-analyzer/` -- full plugin with CSS, source subdirectory
- `packages/plugin-emotion-cache/` -- minimal plugin wrapping a third-party library
- `packages/core/types/API/index.ts` -- Plugin type definition
- `packages/core/types/API/Overrides.ts` -- available UI overrides
