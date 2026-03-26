---
name: create-reducer-action
description: Add a new reducer action to the Puck editor state system. Use when the user wants to add a new state mutation, action type, or data operation that modifies the editor's AppState.
---

# Create a Puck Reducer Action

Guide for adding a new `PuckAction` to the editor's Zustand + reducer state system.

## When to Use

- User asks to add a new way to mutate editor state
- User wants a new action type (e.g. "swap", "transform", "batch update")
- User mentions "reducer", "action", "dispatch", or "state mutation"

## Architecture Context

All state mutations flow through `appStore.dispatch(action)` → `createReducer` →
action handler → `walkAppState` → new immutable state. History recording wraps
the reducer automatically.

## Step-by-Step

### 1. Define the action type (`reducer/actions.tsx`)

Add a new exported type following the existing discriminated union pattern:

```typescript
export type YourAction = {
  type: "yourAction";
  targetZone: string;
  targetIndex: number;
  // Add whatever fields your action needs
};
```

Then add it to the `PuckAction` union at the bottom of the file:

```typescript
export type PuckAction = { recordHistory?: boolean } & (
  | ReorderAction
  | InsertAction
  // ... existing actions ...
  | YourAction
); // Add here
```

### 2. Create the action handler (`reducer/actions/your-action.ts`)

Every handler has the same signature:

```typescript
import { Data } from "../../types";
import { PrivateAppState } from "../../types/Internal";
import { walkAppState } from "../../lib/data/walk-app-state";
import { AppStore } from "../../store";
import { YourAction } from "../actions";

export function yourAction<UserData extends Data>(
  state: PrivateAppState<UserData>,
  action: YourAction,
  appStore: AppStore
): PrivateAppState<UserData> {
  return walkAppState<UserData>(
    state,
    appStore.config,
    // mapContent: transform zone content arrays
    (content, zoneCompound) => {
      if (zoneCompound === action.targetZone) {
        // Modify the content array here
        // e.g. insert(), remove(), splice, map, etc.
        return modifiedContent;
      }
      return content;
    },
    // mapNodeOrSkip: transform individual nodes (optional optimization)
    // Return null to skip re-indexing for unchanged nodes
    (childItem, path) => {
      if (path.includes(action.targetZone)) {
        return childItem; // Re-index nodes in the affected zone
      }
      return null; // Skip others for performance
    }
  );
}
```

**Key patterns for `mapContent`**:

- **Insert**: `insert(content, index, newItem)` (from `lib/data/insert`)
- **Remove**: `remove(content, index)` (from `lib/data/remove`)
- **Replace**: `content.map((item, i) => i === index ? newItem : item)`
- **Reorder**: remove from source index, insert at destination index

**Key patterns for `mapNodeOrSkip`**:

- Return the `childItem` unchanged to re-index it (needed for nodes in affected zones)
- Return `null` to skip re-indexing (performance optimization for unaffected nodes)
- Return a modified `childItem` to transform the node itself

### 3. Register in the reducer (`reducer/index.ts`)

Import and add your handler to the `createReducer` switch chain:

```typescript
import { yourAction } from "./actions/your-action";

// Inside createReducer's returned function:
if (action.type === "yourAction") {
  return yourAction(state, action, appStore);
}
```

### 4. Control history recording

By default, actions record history (for undo/redo). Actions with types listed in
the `storeInterceptor`'s exclusion list (`registerZone`, `unregisterZone`, `setData`,
`setUi`, `set`) do NOT record history unless `action.recordHistory` is explicitly `true`.

If your action should not record history by default, add its type to that exclusion
array in `reducer/index.ts`.

### 5. Add tests (`reducer/actions/__tests__/your-action.spec.ts`)

Follow the existing test patterns:

```typescript
import { yourAction } from "../your-action";
import { createAppStore } from "../../../store";

describe("yourAction", () => {
  it("should modify state as expected", () => {
    const appStore = createAppStore({
      config: {
        components: {
          /* test config */
        },
      },
      state: {
        /* initial test state */
      },
    });

    const result = yourAction(
      appStore.getState().state,
      { type: "yourAction", targetZone: "root:default", targetIndex: 0 },
      appStore
    );

    expect(result.data.content).toEqual(/* expected */);
    expect(result.indexes.zones).toBeDefined();
  });
});
```

### 6. Dispatch from the UI

Wherever the action is triggered (component, hook, event handler):

```typescript
const appStore = useAppStoreApi();
appStore.getState().dispatch({
  type: "yourAction",
  targetZone: "root:default",
  targetIndex: 0,
});
```

## Checklist

- [ ] Action type defined in `reducer/actions.tsx`
- [ ] Type added to the `PuckAction` union
- [ ] Handler created in `reducer/actions/`
- [ ] Handler uses `walkAppState` for tree mutations
- [ ] Handler registered in `reducer/index.ts`
- [ ] History recording behavior is correct
- [ ] Test file created in `reducer/actions/__tests__/`
- [ ] TypeScript types -- no `any`

## Reference Files

- `packages/core/reducer/actions.tsx` -- all action type definitions and `PuckAction` union
- `packages/core/reducer/index.ts` -- `createReducer` with handler dispatch and `storeInterceptor`
- `packages/core/reducer/actions/insert.ts` -- canonical example (walkAppState + insert utility)
- `packages/core/reducer/actions/move.ts` -- cross-zone move (remove + insert in mapContent)
- `packages/core/reducer/actions/remove.ts` -- simple removal
- `packages/core/reducer/actions/duplicate.ts` -- clone with ID regeneration
- `packages/core/lib/data/walk-app-state.ts` -- the foundational tree walker
- `packages/core/lib/data/insert.ts` -- array insert utility
- `packages/core/lib/data/remove.ts` -- array remove utility
