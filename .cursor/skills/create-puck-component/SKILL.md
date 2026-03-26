---
name: create-puck-component
description: Add a new React component to the Puck core editor library. Use when the user wants to create an editor UI component, add a new field type, or extend the editor chrome with new panels or controls.
---

# Create a Puck Core Component

Guide for adding a new React component to `packages/core`.

## When to Use

- User asks to add a new component to the editor UI
- User wants a new field type, panel, toolbar control, or layout element
- User mentions "editor component", "core component", or "new UI element"

## Directory Convention

Every component gets its own directory under `packages/core/components/`:

```
packages/core/components/YourComponent/
├── index.tsx           # Component implementation + export
├── styles.module.css   # CSS Module (SUIT CSS naming)
└── types.ts            # Optional: component-specific types
```

## Step-by-Step

### 1. Create the component directory and files

```
mkdir packages/core/components/YourComponent
```

### 2. Write the component (`index.tsx`)

Follow existing patterns -- use `getClassNameFactory` (never raw `styles[...]` access):

```tsx
import { getClassNameFactory } from "../../lib/get-class-name-factory";
import styles from "./styles.module.css";

const getClassName = getClassNameFactory("YourComponent", styles);

export const YourComponent = ({ children, isActive }: YourComponentProps) => {
  return (
    <div className={getClassName({ isActive })}>
      <div className={getClassName("header")}>{children}</div>
    </div>
  );
};
```

The `getClassNameFactory` utility bridges SUIT CSS names to hashed module classes:

- `getClassName()` → root class (`styles["YourComponent"]`)
- `getClassName("header")` → descendant (`styles["YourComponent-header"]`)
- `getClassName({ isActive: true })` → root + modifier (`styles["YourComponent--isActive"]`)

Key conventions:

- Use named exports (not default exports) for public components
- Always use `getClassNameFactory` — never access `styles[...]` directly
- Access the app store via `useAppStore()` if you need editor state
- Use `usePuck()` for consumer-facing hooks
- Use `--puck-*` CSS custom properties for design tokens
- Never use inline styles or global CSS classes

### 3. Create the CSS Module (`styles.module.css`)

Follow SUIT CSS naming:

```css
.YourComponent {
  /* Component root */
}

.YourComponent-header {
  /* Descendant element */
}

.YourComponent--active {
  /* Modifier */
}

.YourComponent.is-disabled {
  /* State */
}
```

### 4. Export from the bundle (if public API)

If the component should be available to consumers of `@puckeditor/core`, add it to
`packages/core/bundle/core.ts`:

```typescript
export { YourComponent } from "../components/YourComponent";
```

Internal-only components do NOT need a bundle export. They are imported directly
within `packages/core` by other components.

### 5. Wire into the editor tree (if applicable)

Components plug into the editor at different points:

- **Editor chrome** (header, sidebar, canvas) -- nested under `components/Puck/components/`
  (e.g. `components/Puck/components/Layout/index.tsx`, `components/Puck/components/Sidebar/`)
- **Field types** -- registered in `components/AutoField/` field type map
- **Plugin panels** -- rendered by plugins via `Plugin.render()`
- **Render pipeline** -- used in `components/Render/` or `components/ServerRender/`

### 6. For field-related components

If you are creating a new field type or modifying how fields render:

- Register it in the `defaultFields` map in `components/AutoField/index.tsx`
- The field receives `FieldProps<F, ValueType>` with `value`, `onChange`, `field`, `readOnly`
- Slot fields (`type: "slot"`) are never rendered in the fields panel — they are transformed
  into `<DropZoneEdit>` components via the field transforms pipeline (`useSlots` →
  `useFieldTransforms` → `getSlotTransform` → `buildMappers` → `mapFields`)
- Users can override any field type via `overrides.fieldTypes` in their config
- Each field gets its own micro Zustand store (`fieldContextStore`) for performance —
  changes to one field do not re-render others

### 7. Add tests (if complex)

Create a `__tests__/` directory or a `.spec.tsx` file:

```
packages/core/components/YourComponent/__tests__/
└── index.spec.tsx
```

Use `@testing-library/react` for rendering and assertions.

## Checklist

- [ ] Directory created under `packages/core/components/`
- [ ] `index.tsx` with named export
- [ ] `styles.module.css` with SUIT CSS class names
- [ ] No global styles, no inline styles, no CSS-in-JS
- [ ] Exported from `bundle/core.ts` if it is a public API
- [ ] TypeScript types -- no `any`
- [ ] Tests for non-trivial logic

## Reference Files

- `packages/core/components/Drawer/` -- simple component with index.tsx + styles.module.css
- `packages/core/components/ActionBar/` -- public API component with exports
- `packages/core/components/AutoField/` -- complex component with field type registry
- `packages/core/bundle/core.ts` -- public API barrel
