---
name: create-travel-component
description: Add a new component to the Travel Composition Studio. Use when the user wants to add a travel card, layout, or block to the travel-studio app.
---

# Create a Travel Component

Guide for adding a new component to `apps/travel-studio`.

## When to Use

- User asks to add a new travel component (card, layout, block)
- User mentions "travel component", "trip block", "itinerary card"

## Step-by-Step

### 1. Choose the family

| Family     | Directory                       | Use for                      |
| ---------- | ------------------------------- | ---------------------------- |
| structural | `config/components/structural/` | Layout containers with slots |
| travel     | `config/components/travel/`     | Trip content cards           |
| context    | `config/components/context/`    | Interpretive/advisory blocks |
| conversion | `config/components/conversion/` | Action/CTA blocks            |

### 2. Create the component file

```tsx
import type { ComponentConfig } from "@/core";

export type YourComponentProps = {
  // fields
};

export const YourComponent: ComponentConfig<YourComponentProps> = {
  fields: {
    // field definitions
  },
  defaultProps: {
    // defaults for all fields
  },
  render: ({ fieldName, puck }) => {
    const isProposal = puck.metadata?.target === "proposal";
    return <div>...</div>;
  },
};

export default YourComponent;
```

### 3. Register in the config barrel

Edit `apps/travel-studio/config/index.ts`:

1. Import the component
2. Add to the appropriate category in `categories`
3. Add to `components` with an optional `label`
4. If it has slots, override the slot fields with `allow`/`disallow` rules

### 4. Update the types file

Edit `apps/travel-studio/config/types.ts`:

1. Import the Props type
2. Add to the `Components` type union

### 5. Add seed data (optional)

If the component should appear in the sample document, add it to `config/seed-data.ts`.

## Conventions

- Use inline styles (no CSS Modules)
- Export both named and default
- Export the Props type for the types barrel
- Slot defaults must be `[]`
- For mode-aware rendering, check `puck.metadata?.target`
- Slot `allow`/`disallow` rules go in `config/index.ts`, not in the component file

## Reference Files

- `apps/travel-studio/config/components/travel/StayCard.tsx` -- standard travel card
- `apps/travel-studio/config/components/structural/DaySection.tsx` -- multi-slot container
- `apps/travel-studio/config/index.ts` -- config barrel with slot rules
