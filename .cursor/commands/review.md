# Code Review

Review the current changes against Puck's project conventions and coding standards.

## Review Checklist

### TypeScript

- [ ] No use of `any` -- use `unknown` or proper types instead
- [ ] Explicit return types on exported functions
- [ ] No unused imports or variables

### CSS

- [ ] All styles use CSS Modules (`.module.css` files)
- [ ] Class names follow SUIT CSS naming (`.ComponentName`, `.ComponentName-descendant`, `.ComponentName--modifier`)
- [ ] Uses `getClassNameFactory` -- never raw `styles[...]` access
- [ ] Uses `--puck-*` custom properties for design tokens -- no hard-coded colors/sizes
- [ ] No global stylesheets or inline styles
- [ ] No CSS-in-JS in core packages (Emotion, styled-components, etc.)

### Architecture

- [ ] State changes go through `dispatch(PuckAction)`, never direct mutation
- [ ] Reducer actions use `walkAppState` for tree mutations -- never manually walk data
- [ ] New reducer actions defined in `reducer/actions.tsx` and registered in `reducer/index.ts`
- [ ] `resolveData`/`resolveFields` hooks follow the trigger convention (`"insert"`, `"replace"`, `"move"`, `"load"`, `"force"`)
- [ ] New public API exports are added to `packages/core/bundle/core.ts`
- [ ] Internal components are NOT exported from the bundle
- [ ] Plugin integration uses the `Plugin` type and `overrides` / `fieldTransforms` patterns

### Testing

- [ ] Complex logic has test coverage (`*.spec.ts` or `*.spec.tsx`)
- [ ] Tests use `@testing-library/react` and `jest`
- [ ] No snapshot tests unless specifically justified

### Commit and PR

- [ ] Changes are focused on a single issue
- [ ] Commit messages follow angular-style conventional format (`feat:`, `fix:`, `chore:`, etc.)
- [ ] Breaking changes are clearly marked with `BREAKING CHANGE:` footer
- [ ] Public API changes receive extra scrutiny -- document the rationale

### Monorepo

- [ ] No `npm` or `pnpm` commands -- only `yarn`
- [ ] Workspace dependencies use `"*"` for internal packages
- [ ] Build succeeds: `yarn turbo run build --filter=<affected-package>`

## Output

For each issue found, report:

1. File path and line number
2. The convention being violated
3. A suggested fix with code
