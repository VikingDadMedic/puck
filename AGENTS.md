# AGENTS.md — Puck Visual Editor

## Project Identity

Puck is an open-source, modular visual page/component editor for React.
Published as `@puckeditor/core` on npm. MIT license (The Puck Contributors).
Current version: **0.21.1**.

- Docs: `apps/docs` (Nextra) / [puckeditor.com](https://puckeditor.com)
- Demo: `apps/demo` (Next.js) / [demo.puckeditor.com](https://demo.puckeditor.com)
- Discord: https://discord.gg/D9e4E3MQVZ

---

## Monorepo Structure

Yarn 1.x workspaces + Turborepo (build orchestration) + Lerna (versioning/publishing).

```
puck/
├── packages/
│   ├── core/                  # @puckeditor/core — the editor library (PUBLISHED)
│   ├── create-puck-app/       # create-puck-app CLI scaffolding tool (PUBLISHED)
│   ├── field-contentful/      # @puckeditor/field-contentful (PUBLISHED)
│   ├── plugin-emotion-cache/  # @puckeditor/plugin-emotion-cache (PUBLISHED)
│   ├── plugin-heading-analyzer/ # @puckeditor/plugin-heading-analyzer (PUBLISHED)
│   ├── eslint-config-custom/  # Shared ESLint config (PRIVATE)
│   ├── tsconfig/              # Shared TypeScript presets (PRIVATE)
│   └── tsup-config/           # Shared tsup + PostCSS build config (PRIVATE)
├── apps/
│   ├── demo/                  # Next.js 16 demo app (PRIVATE)
│   └── docs/                  # Nextra documentation site (PRIVATE)
├── recipes/                   # Starter templates — each is a standalone app
│   ├── next/                  # Next.js recipe
│   ├── next-ai/               # Next.js + AI recipe
│   ├── remix/                 # Remix recipe
│   ├── remix-ai/              # Remix + AI recipe
│   ├── react-router/          # React Router 7 + Vite recipe
│   └── react-router-ai/       # React Router + AI recipe
├── scripts/                   # Release tooling, changelog gen, e2e smoke tests
├── .cursor/                   # Cursor AI config (rules, skills, commands, hooks)
├── Dockerfile                 # Multi-stage Docker build for demo app
├── docker-compose.yml         # One-command Docker preview
├── turbo.json                 # Turborepo task config
├── lerna.json                 # Lerna publish subset
└── package.json               # Root workspace config
```

Lerna only manages a subset for publishing: `packages/core`, `create-puck-app`,
`field-contentful`, `plugin-emotion-cache`, `plugin-heading-analyzer`, and `apps/docs`.

---

## Core Library Architecture (`packages/core`)

### Source Layout

```
packages/core/
├── bundle/          # Build entrypoints
│   ├── index.ts     # Client entry (imports CSS, re-exports core.ts)
│   ├── core.ts      # Public API barrel — all exported types, components, hooks
│   ├── rsc.tsx      # React Server Component entry (Render, data utils only)
│   ├── internal.ts  # Internal-only exports (createReducer)
│   └── no-external.ts
├── components/      # React UI components (~32 top-level directories)
│   ├── Puck/        # Editor shell (providers, layout, sub-components)
│   │   └── components/  # Nested: Layout, Header, Sidebar, Canvas, Preview, Fields, etc.
│   ├── Render/      # Client-side read-only renderer ("use client")
│   ├── ServerRender/# RSC-compatible renderer
│   ├── DropZone/    # Drag-and-drop zones (edit + render paths)
│   ├── AutoField/   # Dynamic field renderer
│   ├── Drawer/      # Component picker drawer
│   └── ...          # ActionBar, Button, DraggableComponent, LayerTree, Modal, etc.
├── store/           # Zustand AppStore + slices
│   ├── index.ts     # createAppStore (Zustand create + subscribeWithSelector)
│   ├── default-app-state.ts
│   └── slices/      # history, nodes, permissions, fields
├── reducer/         # Pure reducer for PuckAction dispatch
│   ├── index.ts     # createReducer wrapper
│   └── actions/     # Per-action modules
├── lib/             # Utilities
│   ├── use-puck.ts  # usePuck / createUsePuck / useGetPuck hooks
│   ├── data/        # Data helpers (walk-tree, set-deep, get-item, etc.)
│   ├── resolve-component-data.ts
│   ├── resolve-all-data.ts
│   ├── transform-props.ts
│   ├── migrate.ts
│   └── ...          # DnD helpers, overlay portal, debounce, etc.
├── types/           # TypeScript type definitions
│   ├── Config.tsx   # Config, ComponentConfig, RootConfig
│   ├── Data.tsx     # Data, ComponentData, Content, RootData
│   ├── AppState.tsx # AppState (data + UiState)
│   ├── Fields.ts    # Field type definitions
│   ├── Props.tsx    # DefaultComponentProps, DefaultRootFieldProps
│   └── API/         # Plugin, Permissions, Overrides, Viewports, etc.
└── plugins/         # Built-in plugins
    ├── blocks/      # Component picker panel
    ├── fields/      # Properties/fields panel
    ├── outline/     # Layer tree outline panel
    └── legacy-side-bar/
```

### State Management

- **Zustand** — primary app store created via `createAppStore()` with `subscribeWithSelector`.
  Slices: `HistorySlice`, `NodesSlice`, `PermissionsSlice`, `FieldsSlice`.
- **React Context** — `appStoreContext` for store propagation; additional contexts for
  render mode, dropzones, fields, frames.
- **Reducer** — `createReducer` wraps a `(state, PuckAction) => newState` pipeline with
  history recording and `onAction` hooks.
- **Consumer hook** — `usePuck` / `createUsePuck` / `useGetPuck` bridge Zustand to a typed `PuckApi`.

### Data Model (key types)

- **`Data`** — `{ root, content, zones? }`. The document shape.
  - `root`: `RootData` (props + readOnly flags)
  - `content`: `Content` (array of `ComponentData`)
  - `zones`: named zone → `Content` mapping
- **`ComponentData`** — `{ type, props: WithId<Props> }` + `readOnly` flags. Props may contain nested slot content.
- **`AppState`** — `{ data: Data, ui: UiState }`. Full editor state.
- **`UiState`** — sidebar visibility, item selection, array state, preview mode, viewports, drag state, plugin state.
- **`Config`** — `{ components, root?, categories? }`. Maps component names to `ComponentConfig`.
- **`ComponentConfig`** — `{ render, fields?, defaultProps?, resolveData?, resolveFields?, resolvePermissions?, permissions?, inline?, label? }`.

### PuckAction Union

All state mutations flow through `appStore.dispatch(action)`. The `PuckAction` type
(defined in `reducer/actions.tsx`) is a discriminated union:

| Action                 | Purpose                                                  |
| ---------------------- | -------------------------------------------------------- |
| `InsertAction`         | Add a new component to a zone                            |
| `MoveAction`           | Move a component between or within zones                 |
| `ReorderAction`        | Reorder within the same zone (delegates to move)         |
| `ReplaceAction`        | Replace a component's data (field edits, resolved props) |
| `ReplaceRootAction`    | Replace root-level data                                  |
| `RemoveAction`         | Delete a component from a zone                           |
| `DuplicateAction`      | Clone a component (new IDs for all descendants)          |
| `SetAction`            | Wholesale replace `AppState` (or parts via callback)     |
| `SetDataAction`        | Replace the entire `Data` object                         |
| `SetUiAction`          | Update `UiState` (selection, sidebar, drag state, etc.)  |
| `RegisterZoneAction`   | Register a zone compound for tracking                    |
| `UnregisterZoneAction` | Remove a zone compound from tracking                     |

All actions accept an optional `recordHistory?: boolean` flag. Handlers live in
`reducer/actions/` (one file per action). Each handler typically uses `walkAppState`
to immutably traverse and modify the data tree.

### Plugin System

```typescript
type Plugin = {
  name?: string;
  label?: string;
  icon?: ReactNode;
  render?: () => ReactElement; // sidebar panel UI
  overrides?: Partial<Overrides>; // replace editor UI pieces
  fieldTransforms?: FieldTransforms; // transform field behavior
  mobilePanelHeight?: "toggle" | "min-content";
};
```

Plugins are passed as `plugins?: Plugin[]` to the `<Puck>` component.
Built-in plugins: `blocksPlugin`, `fieldsPlugin`, `outlinePlugin`, `legacy-side-bar`.
The `Overrides` system lets plugins/apps replace any editor UI component.

### Rendering Pipeline

- **Client `<Render>`** (`"use client"`) — wraps content with `renderContext` + `DropZoneProvider`
  in `mode: "render"`, iterates `content` array, calls `config.components[type].render`.
  Slots are resolved via `useSlots` + `<SlotRender>`.
- **`<ServerRender>`** (RSC) — same idea but avoids client hooks; imported from `@puckeditor/core/rsc`.
- **Editor mode** — `<Puck>` → `<Layout>` → `<Preview>` / `<Canvas>` uses `<DropZoneEdit>`,
  `<DraggableComponent>`, app store; dispatches `PuckAction` for mutations.

### Drag-and-Drop Architecture

Puck uses `@dnd-kit/react` with three actor types:

| Actor                | Hook           | DnD Type      | Key File                                  |
| -------------------- | -------------- | ------------- | ----------------------------------------- |
| Sidebar drawer items | `useDraggable` | `"drawer"`    | `components/Drawer/index.tsx`             |
| Drop zones in canvas | `useDroppable` | `"dropzone"`  | `components/DropZone/index.tsx`           |
| Placed components    | `useSortable`  | `"component"` | `components/DraggableComponent/index.tsx` |

**DragDropContext** (`components/DragDropContext/index.tsx`) wraps the editor in
`<DragDropProvider>` with four lifecycle handlers:

- `onBeforeDragStart` — detects "new" (drawer) vs "existing" (reorder) drag, sets `isDragging`.
- `onDragStart` — creates initial preview in `ZoneStore`.
- `onDragOver` — calculates target zone + index, updates `ZoneStore.previewIndex`
  (picked up by `useContentIdsWithPreview` to render a ghost placeholder).
- `onDragEnd` — finalizes: dispatches `insert` or `move` action, clears drag state.

**NestedDroppablePlugin** (`lib/dnd/NestedDroppablePlugin.ts`) — custom `@dnd-kit` plugin
for nested drop zones. Uses `elementsFromPoint` + depth sorting to find the deepest valid
zone under the cursor. Filters out the dragged item and its descendants to prevent
self-nesting. A 6px buffer contraction prevents edge mis-hits.

**GlobalPosition** (`lib/global-position.ts`) — maps coordinates between the parent
document and the scaled iframe, accounting for `transform: scale(zoom)`.

**Dynamic collision detector** (`lib/dnd/collision/dynamic/index.ts`) — factory
(`createDynamicCollisionDetector`) combining midpoint-based detection (snap effect),
directional collision (prevents flicker on self-drag), and `closestCorners` fallback.

**ZoneStore** (`components/DropZone/context.tsx`) — Zustand store for drag state:
`previewIndex` (ghost position), `zoneDepthIndex`/`areaDepthIndex` (which zones are
enabled), `draggedItem`.

### Iframe Architecture

By default, the editor preview renders inside an `<iframe>`:

- **AutoFrame** (`components/AutoFrame/index.tsx`) — creates an iframe with `srcDoc`,
  then uses React `createPortal` to render the React subtree into `#frame-root`.
  This maintains a **single React tree** spanning parent and iframe.
- **CopyHostStyles** — `MutationObserver` mirrors all `<style>` and `<link>` elements
  from the parent `<head>` into the iframe's `<head>`, keeping editor overlay styles
  in sync. Dynamically-added styles are also mirrored in real time.
- **useBubbleIframeEvents** — re-dispatches `pointermove` events from inside the iframe
  back to the parent document so `@dnd-kit` can track pointer position across the boundary.
- When `iframe.enabled = false`, user components render inline with no document isolation;
  only CSS Module hashing and `--puck-*` custom property prefixing protect against collisions.

### Core Data Utilities

- **`walkAppState`** (`lib/data/walk-app-state.ts`) — the foundational tree walker used
  by every reducer action. Walks root content, slots, and zones; applies `mapContent` and
  `mapNodeOrSkip` callbacks; rebuilds `NodeIndex` and `ZoneIndex` immutably. Reducer
  actions pass specific callbacks (e.g., `insert()` at target index for `insertAction`,
  `remove()` from source + `insert()` at destination for `moveAction`).
- **`mapFields`** (`lib/data/map-fields.ts`) — recursive field walker that traverses
  component props by field type. Handles `slot` (as `Content[]`), `array` (via
  `arrayFields`), `object` (via `objectFields`), and arbitrary nesting. Used by
  `walkAppState` (for slot indexing), `resolveComponentData` (for slot resolution),
  and the field transforms system.
- **`flattenNode` / `expandNode`** (`lib/data/flatten-node.ts`) — dot-notation flattening
  of component props (stripping slots) for efficient diff detection via `getChanged`.
- **`forRelatedZones`** (`lib/data/for-related-zones.ts`) — iterates `data.zones` entries
  owned by a given component (matching `parentId`).

### Resolve Pipeline

Async data resolution hooks run at various lifecycle points:

- **`resolveComponentData`** (`lib/resolve-component-data.ts`) — per-component resolution.
  Calls `configForItem.resolveData(item, { changed, lastData, metadata, trigger, parent })`.
  Caches results per component ID; skips if data unchanged (deep equality via `fast-equals`).
  Triggers: `"insert"`, `"replace"`, `"move"`, `"load"`, `"force"`.
  Recursively resolves slot children via `mapFields`.
- **`resolveAllData`** (`lib/resolve-all-data.ts`) — public API for bulk resolution of an
  entire `Data` tree. Uses `trigger: "force"` (always runs). Resolves root, content, slots,
  and zones concurrently via `Promise.all`.
- **`resolveAndCommitData`** (`store/index.ts`) — store method called once on mount.
  Walks the full state via `walkAppState`, calls `resolveComponentData(item, "load")` for
  each node, and dispatches `replace`/`replaceRoot` if resolution produced changes.
- **`resolveAndReplaceData`** (`lib/data/resolve-and-replace-data.ts`) — convenience
  helper used after insert/move: resolves a single component and dispatches `replace`.

### Slot System

Slots are component props of type `SlotField` (`{ type: "slot", allow?, disallow? }`).

- **In the fields panel**: `AutoField` returns `null` for `field.type === "slot"` — slots
  are never rendered as form fields.
- **In the canvas**: slots are transformed from `Content[]` data into `<DropZoneEdit>`
  components via the pipeline: `useSlots` → `useFieldTransforms` → `getSlotTransform` →
  `buildMappers` → `mapFields`. The transform replaces each slot prop value with a React
  component that renders a `DropZoneEdit` (in edit mode) or `DropZoneRender` (in read-only).
- **Data model**: slot content lives inline in component props as arrays of `ComponentData`.
  `walkAppState` creates zone index entries for each slot (e.g., `componentId:slotPropName`).
- **Filtering**: `allow`/`disallow` on `SlotField` restrict which component types can be
  dropped into the slot, enforced via `isDroppableTarget` in the DropZone DND data.

### Overrides System

The `Overrides` type (`types/API/Overrides.ts`) defines replaceable UI pieces. Each override
is a `RenderFunc<Props>` — `(props: Props) => ReactElement` — where props include `children`
representing the default UI.

| Override Key       | Props                                                         | What It Replaces                |
| ------------------ | ------------------------------------------------------------- | ------------------------------- |
| `header`           | `{ actions, children }`                                       | Editor header bar               |
| `headerActions`    | `{ children }`                                                | Header action buttons           |
| `actionBar`        | `{ label?, children, parentAction }`                          | Per-component action bar        |
| `preview`          | `{}`                                                          | Canvas preview wrapper          |
| `fields`           | `{ children, isLoading, itemSelector? }`                      | Fields panel container          |
| `fieldLabel`       | `{ children?, icon?, label, el?, readOnly?, className? }`     | Individual field labels         |
| `drawer`           | `{}`                                                          | Component picker drawer         |
| `drawerItem`       | `{ children, name }`                                          | Drawer item                     |
| `iframe`           | `{ children, document? }`                                     | Iframe content wrapper          |
| `outline`          | `{}`                                                          | Layer tree outline              |
| `componentOverlay` | `{ children, hover, isSelected, componentId, componentType }` | Component overlay               |
| `puck`             | `{}`                                                          | Entire editor shell             |
| `fieldTypes`       | Per-type: `FieldProps & { children, name }`                   | Individual field type renderers |

**Composition**: `loadOverrides` (`lib/load-overrides.ts`) merges user overrides with plugin
overrides. Each plugin wraps the previous layer, receiving it as `children`. This creates a
chain: Plugin B wraps Plugin A wraps the default.

### Field Transforms

`FieldTransforms` (`types/API/FieldTransforms.ts`) — a partial map of `field.type` →
transform function. Transforms receive `{ value, parentId, propName, field, isReadOnly, componentId }`
and return transformed values.

- **`buildMappers`** (`lib/field-transforms/build-mappers.ts`) converts `FieldTransforms`
  into `mapFields` mappers, injecting `isReadOnly` awareness from the component's `readOnly` map.
- **Slot transform** (`lib/field-transforms/default-transforms/slot-transform.tsx`) is the
  primary built-in transform — converts `Content[]` slot data into `<DropZoneEdit>` or
  `<DropZoneRender>` React components.
- Plugins and users can add custom transforms via `Plugin.fieldTransforms`.
- The fields panel uses per-field Zustand stores (`fieldContextStore` in
  `components/AutoField/store.ts`) for O(1) re-renders on individual field changes.

### Public API Exports (from `bundle/core.ts`)

Components: `Puck`, `Render`, `DropZone`, `AutoField`, `FieldLabel`, `Drawer`,
`ActionBar`, `Button`, `IconButton`, `RichTextMenu`.

Hooks: `usePuck`, `createUsePuck`, `useGetPuck`.

Utilities: `walkTree`, `setDeep`, `resolveAllData`, `transformProps`, `migrate`,
`registerOverlayPortal`.

Types: `PuckAction`, `Config`, `Data`, `AppState`, `ComponentData`, `Permissions`,
`Plugin`, `Overrides`, `Field`, `Slot`, `RichText`, etc.

---

## Key Dependencies

| Concern       | Package                                                                         |
| ------------- | ------------------------------------------------------------------------------- |
| Drag and drop | `@dnd-kit/react`, `@dnd-kit/helpers`                                            |
| Rich text     | `@tiptap/react`, `@tiptap/extension-*` (individual extensions, not starter-kit) |
| State         | `zustand`                                                                       |
| Popovers      | `@radix-ui/react-popover`                                                       |
| Hotkeys       | `react-hotkeys-hook`                                                            |
| Diffing       | `deep-diff`, `fast-equals`, `object-hash`                                       |
| Build         | `tsup` (esbuild), `postcss`, `postcss-modules`                                  |
| Monorepo      | `turbo`, `lerna`, Yarn 1.x workspaces                                           |

---

## Coding Conventions

### TypeScript

- Avoid `any`. Use strict typing throughout.
- Peer dependency: React ^18 || ^19.

### CSS

- **CSS Modules only** — no global styles. Puck runs in hostile third-party environments.
- **SUIT CSS** naming convention for all class names (e.g. `.Puck-header`, `.DropZone--isActive`).
- PostCSS pipeline configured in `packages/tsup-config`.

### Commits

- **Angular-style conventional commits** (e.g. `feat:`, `fix:`, `chore:`).
- PRs should be focused on a **single issue**.
- PRs are squash-merged; the team rewrites commit messages on merge.

### Public API Changes

Any PR introducing or changing public APIs receives additional scrutiny.

---

## Development Commands

| Command             | What it does                                                               |
| ------------------- | -------------------------------------------------------------------------- |
| `yarn`              | Install all workspace dependencies                                         |
| `yarn dev`          | Clears `packages/core/dist`, starts demo app via Turbo                     |
| `yarn build`        | Build all packages (Turbo, outputs to `dist/` and `.next/`)                |
| `yarn test`         | Run workspace Jest tests (`packages/core` + `apps/travel-studio`)          |
| `yarn lint`         | Lint all packages                                                          |
| `yarn format`       | Format with Prettier                                                       |
| `yarn format:check` | Check formatting                                                           |
| `yarn smoke`        | Puppeteer e2e smoke tests (needs demo on :3000 and travel-studio on :3001) |

To work on the demo app directly:

```sh
cd apps/demo && yarn dev
```

### Requirements

- Node.js >= 20 (`.nvmrc`: 20)
- Yarn 1.x (`packageManager: yarn@1.22.19`)

---

## Testing

- **Framework:** Jest + ts-jest.
- **Assertion/utilities:** `@testing-library/react`, `@testing-library/jest-dom` (core package tests).
- **Core test location:** spec files under `packages/core/`:
  - `lib/__tests__/`, `lib/data/__tests__/`
  - `reducer/actions/__tests__/`
  - `store/slices/__tests__/`
  - `types/__tests__/`
  - `components/Puck/__tests__/`
- **Travel-studio test location:** route and library tests under `apps/travel-studio/**/**.test.ts`.
- **Configs:** `packages/core/jest.config.ts`, `apps/travel-studio/jest.config.cjs`.
- **CSS Modules:** Mapped to `identity-obj-proxy` in tests.
- Run:
  - `yarn test` (root, all workspaces with a `test` script)
  - `yarn workspace travel-studio test`
  - `cd packages/core && yarn test`

---

## CI/CD

- **GitHub Actions** (`.github/workflows/`):
  - `ci.yml` — on push/PR to `main`: `yarn test`, `yarn lint`, `yarn format:check`, `yarn build`.
  - `publish-canary.yml` — on merge to `main` (non-release commits): auto-publishes canary versions.
  - `publish.yml` — on push to `releases/**` with `release: ` prefix: tags + publishes `latest`.

---

## Release Process

1. **Canary**: auto-published after each merge to `main` (e.g. `0.21.1-canary.a1b2c3d`).
2. **Latest**: triggered manually when `main` is stable. Uses Lerna for versioning,
   `standard-changelog` for changelog generation, `scripts/publish.sh` for npm publish.
3. Published packages: `@puckeditor/core`, `create-puck-app`, `@puckeditor/field-contentful`,
   `@puckeditor/plugin-emotion-cache`, `@puckeditor/plugin-heading-analyzer`.

---

## Docker

The demo app can be built and run as a production Docker image:

```sh
docker compose up --build      # build + run at http://localhost:3000
docker compose down             # stop + cleanup
```

- `Dockerfile` uses a multi-stage build: install deps, build core + demo via Turbo, copy standalone output to a minimal `node:20-alpine` runner.
- `apps/demo/next.config.js` has `output: "standalone"` and `outputFileTracingRoot` pointing to the monorepo root, which enables Next.js to trace dependencies across workspace boundaries.
- The production image runs as a non-root `nextjs` user on port 3000.
- Build context excludes `node_modules`, `.next`, `.turbo`, `.git` via `.dockerignore`.

---

## Key File Paths

| What                  | Path                                                            |
| --------------------- | --------------------------------------------------------------- |
| Package entry         | `packages/core/index.ts` → `bundle/index.ts` → `bundle/core.ts` |
| RSC entry             | `packages/core/bundle/rsc.tsx`                                  |
| Editor root component | `packages/core/components/Puck/index.tsx`                       |
| Client renderer       | `packages/core/components/Render/index.tsx`                     |
| Server renderer       | `packages/core/components/ServerRender/index.tsx`               |
| Zustand store         | `packages/core/store/index.ts`                                  |
| Reducer               | `packages/core/reducer/index.ts`                                |
| Config types          | `packages/core/types/Config.tsx`                                |
| Data types            | `packages/core/types/Data.tsx`                                  |
| AppState types        | `packages/core/types/AppState.tsx`                              |
| Plugin/API types      | `packages/core/types/API/index.ts`                              |
| Field types           | `packages/core/types/Fields.ts`                                 |
| usePuck hook          | `packages/core/lib/use-puck.ts`                                 |
| Demo app              | `apps/demo/`                                                    |
| Docs site             | `apps/docs/`                                                    |
| Jest config           | `packages/core/jest.config.ts`                                  |
| Turbo config          | `turbo.json`                                                    |
| CI workflow           | `.github/workflows/ci.yml`                                      |
| Dockerfile            | `Dockerfile`                                                    |
| Docker Compose        | `docker-compose.yml`                                            |
| DragDropContext       | `packages/core/components/DragDropContext/index.tsx`            |
| NestedDroppablePlugin | `packages/core/lib/dnd/NestedDroppablePlugin.ts`                |
| AutoFrame (iframe)    | `packages/core/components/AutoFrame/index.tsx`                  |
| walkAppState          | `packages/core/lib/data/walk-app-state.ts`                      |
| mapFields             | `packages/core/lib/data/map-fields.ts`                          |
| resolveComponentData  | `packages/core/lib/resolve-component-data.ts`                   |
| resolveAllData        | `packages/core/lib/resolve-all-data.ts`                         |
| Overrides type        | `packages/core/types/API/Overrides.ts`                          |
| getClassNameFactory   | `packages/core/lib/get-class-name-factory.ts`                   |
| CSS design tokens     | `packages/core/styles/color.css`, `styles/typography.css`       |

---

## Travel Composition Studio (`apps/travel-studio`)

A domain-specific composition app built on top of Puck, implementing the Travel
Composition Studio PRD. It turns Puck into a constrained travel-document authoring
system rather than a generic page builder.

### Architecture

- **Layer 1 (Domain)**: TypeScript types in `config/schema.ts` -- TripDocument, DocumentMode, VisibilityRule
- **Layer 2 (Composition)**: Puck config in `config/index.ts` with 21 travel-specific components organized into 5 categories
- **Layer 3 (Render)**: Mode-aware rendering via `metadata.target` (itinerary/proposal/client_view)
- **Layer 4 (Shell)**: Custom `headerActions` override with save status indicator, autosave (4s debounce), conflict resolution modal, toast notifications, and `beforeunload` guard
- **Layer 5 (Design System)**: Design tokens in `config/tokens.ts` with CSS custom properties and dark mode support
- **Layer 6 (Template/Fill Mode)**: `documentType` discriminator (`"template"` vs `"itinerary"`) in root props; permissions-based structural lock in fill mode; `cloneAndReId` for template instantiation
- **Layer 7 (Editor UX Polish)**: Dark editor chrome via `--puck-color-grey-*` overrides in `styles.css`; canvas dot grid background; Cmd+S manual save shortcut; Escape-to-deselect; drawer search filter via Puck `drawer` override; `DrawerSearchWrapper` + `FilteredDrawer` using `Drawer.Item` for draggable results

### Component Taxonomy

| Category     | Components                                                                                                                                 |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Structure    | DocumentSection, DaySection, SidebarLayout, CardGroup, Spacer, Divider                                                                     |
| Trip Content | TripHeader, TripOverview, StayCard, ActivityCard, TransportCard, RestaurantCard, CruiseCard, ItineraryMap, InfoCard, TourCard, BookingCard |
| Pricing      | PricingSummary                                                                                                                             |
| Context      | AdvisorInsight, IncludedFeatures                                                                                                           |
| Actions      | PrimaryCTA                                                                                                                                 |

### Slot Rules

- DaySection: `morning`/`afternoon`/`evening` slots allow only card-type components (StayCard, ActivityCard, TransportCard, RestaurantCard, CruiseCard, InfoCard, TourCard, BookingCard)
- SidebarLayout: `main` allows narrative content; `sidebar` allows pricing/context/CTA
- DocumentSection: `content` allows all travel/context/conversion components
- CardGroup: `items` allows only card-type components (StayCard, ActivityCard, TransportCard, RestaurantCard, CruiseCard, InfoCard, TourCard, BookingCard)

### Key Paths

| What             | Path                                                              |
| ---------------- | ----------------------------------------------------------------- |
| App root         | `apps/travel-studio/`                                             |
| Config barrel    | `apps/travel-studio/config/index.ts`                              |
| Root config      | `apps/travel-studio/config/root.tsx`                              |
| Schema types     | `apps/travel-studio/config/schema.ts`                             |
| Seed data        | `apps/travel-studio/config/seed-data.ts`                          |
| Dashboard page   | `apps/travel-studio/app/page.tsx` + `app/dashboard.tsx`           |
| Editor client    | `apps/travel-studio/app/[...puckPath]/client.tsx`                 |
| Documents API    | `apps/travel-studio/app/api/documents/route.ts` (GET/POST/DELETE) |
| Design tokens    | `apps/travel-studio/config/tokens.ts`                             |
| ItineraryMap     | `apps/travel-studio/config/components/travel/ItineraryMap.tsx`    |
| Geocode API      | `apps/travel-studio/app/api/geocode/route.ts`                     |
| Login page       | `apps/travel-studio/app/auth/login/page.tsx`                      |
| Docker Compose   | `docker-compose.travel-studio.yml`                                |
| DB migrations    | `docker/travel-studio/migrations/`                                |
| Directus client  | `apps/travel-studio/lib/directus/client.ts`                       |
| Directus adapter | `apps/travel-studio/lib/persistence/directus-adapter.ts`          |
| Supabase client  | `apps/travel-studio/lib/supabase/client.ts`                       |
| Auth middleware  | `apps/travel-studio/lib/auth/middleware.ts`                       |
| cloneAndReId     | `apps/travel-studio/lib/get-document.ts`                          |

### Running

```sh
cd apps/travel-studio && yarn dev    # http://localhost:3001
```

Docker Compose (full stack with Postgres, Directus, Supabase, Redis):

```sh
docker compose -f docker-compose.travel-studio.yml up -d
```

The home page shows a document dashboard with separate **Templates** and **Itineraries** sections. "Use Template" clones a template with fresh IDs (via `cloneAndReId`) and sets `documentType` to `"itinerary"`. Editing a document navigates to `/{path}/edit`. Seed data includes 7 templates (all `documentType: "template"`): "Mediterranean Cruise Escape" (`/trip`, luxury/itinerary), "Weekend in Paris" (`/city-break`, default/itinerary), "Tokyo Client Meeting" (`/business-proposal`, default/proposal), "Greek Islands Cruise" (`/cruise-adventure`, luxury/itinerary), "Cancun Family Getaway" (`/family-beach`, adventure/itinerary), "European Rail Adventure" (`/rail-europe`, default/itinerary), "Maldives Honeymoon" (`/honeymoon`, luxury/proposal).

**Fill mode** (itineraries): structural operations are locked (drag/delete/duplicate/insert disabled) while field editing remains enabled, enforced via Puck global permissions `{ drag: false, delete: false, duplicate: false, insert: false, edit: true }`. The Drawer is hidden in fill mode via a Puck `drawer` override. Visual mode badges appear in the header: amber "TEMPLATE" badge in design mode, blue "ITINERARY" badge in fill mode.

Operational runbooks live under `docs/devex/runbooks/` for API contracts, cache handling, migrations, and testing/CI workflows.

### Data Feed Architecture

Components connect to live travel data through a three-layer architecture:

1. **SerpAPI/image engine wrappers** (`lib/serp/engines/`) -- typed functions for each data source
   (hotels, flights, activities, restaurants, places, images, explore, events, yelp, google-light, maps reviews, opentable reviews, finance)
2. **Next.js API routes** (`app/api/search/` + `app/api/`) -- 16 endpoints (13 search + documents + health + geocode)
3. **Puck `external` fields** (`config/fields/`) -- picker configs that call API routes
   via `fetchList` and hydrate component props via `resolveData`

Caching: search responses are file-cached in `.cache/serp/` with TTL + stale-if-error fallback semantics.
Image search (Pexels/Unsplash) also uses the shared file cache layer.

Components using external fields: `StayCard` (hotel picker), `ActivityCard` (activity picker + event picker),
`TransportCard` (flight picker via resolveFields), `TripHeader` (image picker),
`RestaurantCard` (restaurant picker), plus `place-picker` for location enrichment.

Components using richtext: `StayCard.notes`, `ActivityCard.description`, `TransportCard.notes`,
`AdvisorInsight.content`, `TripOverview.summary`, `PricingSummary.notes`.

Components using resolveFields: `TransportCard` (polymorphic detail fields based on transport type).

Components using resolveData: `StayCard` (hydrates from hotel search), `ActivityCard` (hydrates
from activity search), `TransportCard` (hydrates from flight search), `RestaurantCard` (hydrates
from restaurant search).

### Domain Model (Itinerary Event Schema)

The travel studio has a canonical domain model separate from Puck composition types.

**Architecture:** JSON Schemas (`schemas/`) are the source of truth. Hand-written
TypeScript types (`domain/`) mirror them exactly. Puck components consume these
types but are not yet fully aligned (see `domain/MAPPING.md` for the gap analysis).

**Event model:** Polymorphic discriminated union with 9 variants:

- `InfoEvent`, `ActivityEvent`, `LodgingEvent`, `FlightEvent`, `CruiseEvent`
- `RailEvent`, `CarRentalEvent`, `OtherTransportEvent` (transportation sub-family)
- `GenericUnmodeledEvent` (smartImport, tour, booking -- placeholders)

**Shared base:** Every event has `id`, `category` (discriminator), optional
`subCategory`/`type`, `title`, `notes` (RichText), `media[]`, `attachments[]`, `documents[]`.

**Reusable sub-objects:** `Money`, `SupplierRef`, `EventTiming`, `MediaAsset`,
`AttachmentRef`, `UploadedDocument`, `RichText`, `Visibility`.

**Key paths:**

| What              | Path                                     |
| ----------------- | ---------------------------------------- |
| JSON Schemas      | `apps/travel-studio/schemas/` (21 files) |
| TypeScript types  | `apps/travel-studio/domain/` (13 files)  |
| Type guards       | `apps/travel-studio/domain/guards.ts`    |
| Barrel export     | `apps/travel-studio/domain/index.ts`     |
| Component mapping | `apps/travel-studio/domain/MAPPING.md`   |

---

## Learned User Preferences

- Prefers thorough codebase exploration before making changes
- Values iterative refinement — multiple "step back and evaluate" passes after implementation
- Wants comprehensive `.cursor/` configuration (rules, skills, hooks, commands) for AI agent productivity
- Imports external domain analysis (e.g., ChatGPT schema discussions) into Cursor as structured input for architecture and modeling work
- Follows structured phase workflow with intermediate stabilization sub-phases (e.g., 5.5, 5.5b) and post-implementation audits before advancing

## Learned Workspace Facts

- The docs app (`apps/docs`) build fails under Node 22 due to `import assert` syntax in `next.config.mjs` — not needed for local development workflow
- Use `yarn prettier` (not `npx prettier`) for formatting; Prettier is a root devDependency
- `.cursor/` has 8 rules, 5 skills, 3 commands, and 2 hooks configured for this workspace
- `create-reducer-action` skill exists at `.cursor/skills/create-reducer-action/SKILL.md` for adding new PuckAction types
- Docker build for the demo app cannot use `turbo prune --docker` because `@puckeditor/core` is resolved via tsconfig path aliases, not `package.json` dependencies — requires full monorepo copy instead
- Travel-studio app shell: autosave (4s debounce), `beforeunload` guard, conflict resolution modal on 409, toast notifications, `error.tsx`/`loading.tsx` at both levels, documents API (GET/POST/DELETE) with dashboard
- All 18 travel-studio components are mode-aware via `puck.metadata.target`; design tokens in `config/tokens.ts` with `--ts-*` CSS custom properties and `[data-theme="dark"]` dark mode
- Travel-studio Docker Compose (9 services: Postgres, Kong, GoTrue, Realtime, Storage, Studio, Redis, Directus, travel-studio); Directus adapter falls back to file-based when `DIRECTUS_URL` unset; Supabase auth falls back to API-key when unconfigured
- Mapbox integration: ItineraryMap uses `react-map-gl` (v7 root import, not `/mapbox` subpath) with dynamic import; geocode route proxies Mapbox server-side geocoding
- Azure deployment: resource group `rg-travel-studio-westus`, ACR `travstudiocr.azurecr.io`, Container App `travel-studio` at `travel-studio.bravepebble-29dca480.westus.azurecontainerapps.io`; deploy via `az acr build` + `az containerapp update --revision-suffix`
- Puck core CSS imports Inter font from `https://rsms.me/inter/inter.css` — deployed Puck apps must allow `https://rsms.me` in both `style-src` and `font-src` CSP directives
- Travel-studio Dockerfile uses `node:22-alpine` (not 20) because `@directus/sdk@19.1.0` requires Node 22; Azure ACR builds don't support glob patterns in Dockerfile COPY
- Puck's RichTextRender handles string HTML values natively (parses via `generateJSON` from `@tiptap/html`); components should render richtext as JSX children `{value}` not `dangerouslySetInnerHTML`
- Template/itinerary split: `documentType` in `root.props` discriminates; fill mode uses Puck global permissions `{ drag: false, delete: false, duplicate: false, insert: false, edit: true }`
- `lib/render/richtext.ts` was deleted (dead code after richtext rendering fix)
- Travel-studio test suite: ~73 tests across 8 test files; `cloneAndReId` has 8 dedicated test cases
- Editor dark mode: override Puck's `--puck-color-grey-*` CSS custom properties within `[data-puck-editor]` selector -- do NOT modify Puck core CSS files
- Drawer search: Puck's `drawer` override wraps the component list; `Drawer.Item` from `@/core` is required for drag-and-drop (plain divs are not draggable)
- Keyboard shortcuts: `Cmd+S`/`Ctrl+S` for save and `Escape` for deselect are implemented in HeaderActions via `useEffect` + `window.addEventListener("keydown")`; the `dispatch({ type: "setUi", ui: { itemSelector: null } })` pattern deselects the active component
- Puck-to-itinerary mapper (`lib/itinerary/puck-to-itinerary.ts`): `mapCard` switch dispatches per component type; `mapMoney`/`supplierRef` helpers for common conversions; pipeline test at `lib/itinerary/pipeline.test.ts` exercises all card types
