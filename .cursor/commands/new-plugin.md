# New Plugin

Scaffold a new Puck editor plugin package in this monorepo.

## Gather Requirements

Ask the user:
1. What is the plugin name? (e.g. `plugin-my-feature` -- will become `@puckeditor/plugin-my-feature`)
2. What does the plugin do? (sidebar panel, overrides, field transforms, or combination)
3. Does the plugin have external dependencies beyond React and `@puckeditor/core`?

## Scaffold Steps

1. Create directory `packages/plugin-<name>/`

2. Create `package.json` following the pattern in `packages/plugin-heading-analyzer/package.json`:
   - Name: `@puckeditor/plugin-<name>`
   - Version: match current monorepo version (check root `package.json`)
   - `@puckeditor/core` as devDependency, React as peerDependency
   - Shared workspace configs: `tsconfig`, `tsup-config`, `eslint-config-custom`

3. Create `tsconfig.json` extending `tsconfig/react-library.json`

4. Create `index.ts` (or `index.tsx` if using JSX) with a skeleton `Plugin` export

5. Add the package path to `lerna.json` packages array

6. Run `yarn` from the repo root to link the new workspace

7. Run `yarn turbo run build --filter=@puckeditor/plugin-<name>` to verify the build works

8. Show the user how to use the plugin:
   ```tsx
   import MyPlugin from "@puckeditor/plugin-<name>";
   <Puck config={config} data={data} plugins={[MyPlugin]} />
   ```
