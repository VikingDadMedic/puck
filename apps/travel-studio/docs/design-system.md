# Travel Studio Design System

A reverse-engineered reference for the color palette, brand themes, component
color taxonomy, and semantic patterns used across the Travel Studio editor and
its 21 Puck components.

---

## 1. Overview

**Character:** "Tailwind Slate/Blue Professional" — the palette draws from
Tailwind CSS color families (Slate, Blue, Emerald, Amber, Violet) to create
a trust-forward, content-first travel document system.

**Architecture:** Three files form the design system:

| File               | Role                                                                                |
| ------------------ | ----------------------------------------------------------------------------------- |
| `config/tokens.ts` | Raw constants — color, radius, spacing, fontSize, shadow, fontFamily, paddingScale  |
| `config/theme.ts`  | `resolveTheme()` — resolves brand presets + agency overrides into a `ResolvedTheme` |
| `config/format.ts` | `formatPrice()` — Intl-based currency formatting for all pricing cards              |

All values are consumed as inline `style={{}}` props (JS constants, not CSS
custom properties). This is deliberate — Puck components render inside an
iframe, so JS tokens work reliably across both the editor canvas and the
public-facing render without stylesheet injection.

---

## 2. Token Palette

### Text Colors

| Token                  | Hex       | Purpose                                                                 |
| ---------------------- | --------- | ----------------------------------------------------------------------- |
| `color.text.primary`   | `#111827` | Card titles, section headings, primary body text                        |
| `color.text.secondary` | `#374151` | Detail labels, description text, PricingSummary line items              |
| `color.text.tertiary`  | `#4b5563` | TransportCard route labels, editor subtitles                            |
| `color.text.muted`     | `#6b7280` | Card metadata (dates, times, locations), loading/error text             |
| `color.text.faint`     | `#9ca3af` | Fine print, divider labels, footer text, count badges                   |
| `color.text.inverse`   | `#ffffff` | White text on colored backgrounds (buttons, hero overlays, map markers) |

### Accent Colors

| Token                      | Hex       | Family | Purpose                                                              |
| -------------------------- | --------- | ------ | -------------------------------------------------------------------- |
| `color.accent.blue`        | `#2563eb` | Blue   | Primary action buttons, default brand theme accent                   |
| `color.accent.blueDark`    | `#1d4ed8` | Blue   | Price text on cards, edit link text                                  |
| `color.accent.blueDeep`    | `#1e40af` | Blue   | PricingSummary header, StayCard badges, TripHeader gradient          |
| `color.accent.green`       | `#059669` | Green  | CruiseCard included tag, RestaurantCard price range                  |
| `color.accent.greenDark`   | `#065f46` | Green  | Confirmation badge text, "Published" status text                     |
| `color.accent.greenBright` | `#10b981` | Green  | ActivityCard/TourCard left border accent, IncludedFeatures underline |
| `color.accent.greenLeaf`   | `#166534` | Green  | Adventure brand theme accent, IncludedFeatures title                 |
| `color.accent.greenMedium` | `#16a34a` | Green  | PrimaryCTA secondary variant, IncludedFeatures check icon            |
| `color.accent.amber`       | `#f59e0b` | Amber  | RestaurantCard/BookingCard left border accent                        |
| `color.accent.amberDark`   | `#d97706` | Amber  | Conflict warning icon, unsaved indicator                             |
| `color.accent.amberDeep`   | `#92400e` | Amber  | AdvisorInsight advisor label, template badge text                    |
| `color.accent.amberBrown`  | `#854d0e` | Amber  | Luxury brand theme accent                                            |
| `color.accent.red`         | `#dc2626` | Red    | Error states, delete confirmations, IncludedFeatures exclusion       |

### Background Colors

| Token                 | Hex       | Purpose                                                 |
| --------------------- | --------- | ------------------------------------------------------- |
| `color.bg.page`       | `#f8fafc` | Page-level background, default brand theme bg           |
| `color.bg.card`       | `#ffffff` | White card surfaces, modal backgrounds, form panels     |
| `color.bg.muted`      | `#f3f4f6` | Info rows, detail badges, amenity tags                  |
| `color.bg.subtle`     | `#f1f5f9` | Icon panels, skeleton loaders, editor pills             |
| `color.bg.blueLight`  | `#eff6ff` | Blue badge backgrounds, type detail pills               |
| `color.bg.blueSubtle` | `#dbeafe` | Itinerary mode badge, disabled button bg                |
| `color.bg.greenLight` | `#f0fdf4` | Included tags, success states, adventure brand theme bg |
| `color.bg.greenPale`  | `#ecfdf5` | Pricing pill backgrounds (confirmation + price badges)  |
| `color.bg.amberLight` | `#fef3c7` | AdvisorInsight advisor bg, template badge bg            |
| `color.bg.amberPale`  | `#fefce8` | Luxury brand theme bg                                   |
| `color.bg.amberWarm`  | `#fffbeb` | Warning toast bg                                        |
| `color.bg.redLight`   | `#fef2f2` | Error toast bg, error banner bg, delete confirm bg      |

### Border Colors

| Token                  | Hex       | Purpose                                              |
| ---------------------- | --------- | ---------------------------------------------------- |
| `color.border.default` | `#e5e7eb` | Universal card borders, divider rules, table borders |
| `color.border.subtle`  | `#e2e8f0` | Dashboard content area borders                       |
| `color.border.muted`   | `#d1d5db` | Form input borders, modal borders                    |
| `color.border.strong`  | `#cbd5e1` | Keyboard shortcut pills, skeleton borders            |
| `color.border.red`     | `#fca5a5` | Error toast border, error input border               |
| `color.border.amber`   | `#fde68a` | Warning toast border, AdvisorInsight advisor border  |
| `color.border.green`   | `#86efac` | Success toast border                                 |

### Semantic Colors

| Token             | Hex       | Purpose                                                 |
| ----------------- | --------- | ------------------------------------------------------- |
| `color.star`      | `#f59e0b` | Star rating glyphs (StayCard, RestaurantCard)           |
| `color.morning`   | `#3b82f6` | DaySection morning slot border, TripHeader gradient end |
| `color.afternoon` | `#f59e0b` | DaySection afternoon slot border                        |
| `color.evening`   | `#8b5cf6` | DaySection evening slot border, CruiseCard map marker   |

---

## 3. Brand Themes

Three presets defined in `config/theme.ts`, selected via the root `brandTheme` field:

### Default — "Professional Blue"

| Property   | Token               | Hex       |
| ---------- | ------------------- | --------- |
| Accent     | `color.accent.blue` | `#2563eb` |
| Background | `color.bg.page`     | `#f8fafc` |

**Seed templates:** Weekend in Paris, Tokyo Client Meeting, European Rail Adventure

**Mood:** Clean, modern, no-nonsense. The cool slate background and blue accent
are neutral enough for any trip type. Communicates competence without lifestyle
aspiration.

### Luxury — "Warm Cognac"

| Property   | Token                     | Hex       |
| ---------- | ------------------------- | --------- |
| Accent     | `color.accent.amberBrown` | `#854d0e` |
| Background | `color.bg.amberPale`      | `#fefce8` |

**Seed templates:** Mediterranean Cruise Escape, Greek Islands Cruise, Maldives Honeymoon

**Mood:** Warm, rich, elevated. The cognac accent on champagne background evokes
leather-bound menus and gilt-edged stationery. Appropriate for high-touch proposals
where the document itself should feel like a luxury artifact.

### Adventure — "Forest Green"

| Property   | Token                    | Hex       |
| ---------- | ------------------------ | --------- |
| Accent     | `color.accent.greenLeaf` | `#166534` |
| Background | `color.bg.greenLight`    | `#f0fdf4` |

**Seed templates:** Cancun Family Getaway

**Mood:** Fresh, natural, active. Deep forest green on pale mint signals outdoor
experiences and exploration. Suited for family adventure, eco-tourism, and active
travel.

### Agency Override

The `agencyAccentColor` root field lets a travel agency replace the preset accent
with their brand color while keeping the preset's background. Applied via
`resolveTheme()`.

---

## 4. Component Color Map

### By Color Family

**Blue Family** — trust, information, primary actions:

- TripHeader (fallback gradient `blueDeep` to `morning`)
- TripOverview (duration badge `blueDeep` on `blueLight`)
- InfoCard (left border `blueDark` or `blueDeep`)
- PricingSummary (header bg `blueDeep`, totals)
- PrimaryCTA primary variant (bg `blue`)
- TransportCard (type badge `blueDeep` on `blueLight`)
- StayCard (room badge `blueDeep` on `blueLight`)

**Green Family** — activities, nature, success:

- ActivityCard (left border `greenBright`)
- TourCard (left border `greenBright`)
- IncludedFeatures (header border `greenBright`, title `greenLeaf`)
- PrimaryCTA secondary variant (bg `greenMedium`)

**Amber Family** — dining, warmth, advisor notes:

- RestaurantCard (left border `amber`)
- BookingCard (left border `amber`)
- AdvisorInsight advisor-only mode (`amberDeep` on `amberLight`)
- Star ratings via `color.star`

**Purple Family** — evening, cruise:

- DaySection evening slot (border `evening`)
- CruiseCard map marker (`evening`)

**Red Family** — errors and exclusions only:

- ItineraryMap departure markers
- IncludedFeatures "not included" icon

**Neutral** — structural containers:

- DocumentSection, SidebarLayout, CardGroup, Divider, Spacer
- CruiseCard (render body), TransportCard (base body)

### By Component

| Component        | Family           | Primary Accent                                |
| ---------------- | ---------------- | --------------------------------------------- |
| TripHeader       | Blue             | Gradient `blueDeep → morning`                 |
| TripOverview     | Blue             | Badge `blueDeep`                              |
| StayCard         | Blue             | Badge `blueDeep` + stars `amber`              |
| ActivityCard     | Green            | Left border `greenBright`                     |
| TransportCard    | Neutral + Blue   | Base neutral, badge `blueDeep`                |
| RestaurantCard   | Amber            | Left border `amber` + stars                   |
| CruiseCard       | Neutral + Purple | Base neutral, map marker `evening`            |
| InfoCard         | Blue             | Left border `blueDark`/`blueDeep`             |
| TourCard         | Green            | Left border `greenBright`                     |
| BookingCard      | Amber            | Left border `amber`                           |
| ItineraryMap     | Multi            | Markers by component type                     |
| PricingSummary   | Blue             | Header `blueDeep`                             |
| DaySection       | Multi            | Morning=blue, Afternoon=amber, Evening=purple |
| DocumentSection  | Neutral          | `text.primary` + `border.default`             |
| SidebarLayout    | Neutral          | No color tokens                               |
| CardGroup        | Neutral          | `text.primary` only                           |
| Spacer           | Neutral          | No colors                                     |
| Divider          | Neutral          | `text.faint` + `border.default`               |
| AdvisorInsight   | Dual             | Advisor=amber, Client-visible=blue            |
| IncludedFeatures | Green            | Header `greenBright`, title `greenLeaf`       |
| PrimaryCTA       | Blue/Green       | Primary=blue, Secondary=green                 |

---

## 5. Cross-Cutting Patterns

### Confirmation Badges

All cards render confirmation numbers identically:

- Text: `color.accent.greenDark` (`#065f46`)
- Background: `color.bg.greenPale` (`#ecfdf5`)
- Used by: StayCard, ActivityCard, TransportCard, RestaurantCard, CruiseCard, TourCard, BookingCard

### Price Display

When `showPricing` is enabled, price text is:

- Color: `color.accent.blueDark` (`#1d4ed8`)
- Formatted via `formatPrice()` from `config/format.ts`
- Exception: TransportCard in proposal mode uses `color.accent.green` on `greenPale` bg

### Star Ratings

StayCard and RestaurantCard render star glyphs in:

- Color: `color.star` (`#f59e0b`)
- Pattern: `"★".repeat(rating) + "☆".repeat(5 - rating)`

### Time-of-Day (DaySection)

Three time slots with left border accents creating a dawn-to-dusk progression:

| Slot      | Token             | Hex       | Visual      |
| --------- | ----------------- | --------- | ----------- |
| Morning   | `color.morning`   | `#3b82f6` | Cool blue   |
| Afternoon | `color.afternoon` | `#f59e0b` | Warm amber  |
| Evening   | `color.evening`   | `#8b5cf6` | Deep violet |

---

## 6. Editor Chrome

The editor shell uses a dark indigo-grey theme (not pure neutral grey) to make
the travel document content the focal point.

**Dark shell** — `[data-puck-editor]` in `app/styles.css` overrides Puck's
12-step grey scale with purple-tinted values:

| Step    | Hex       | Role                    |
| ------- | --------- | ----------------------- |
| grey-01 | `#f0f0f4` | Lightest (text on dark) |
| grey-05 | `#6a6a7a` | Mid-tone dividers       |
| grey-09 | `#232330` | Panel backgrounds       |
| grey-12 | `#16161e` | Darkest surfaces        |

Every step has a subtle blue-purple undertone (note the hex endings: `f4`, `e0`,
`bc`, `99`, `7a`, `5e`, `48`, `36`, `30`, `2a`, `24`, `1e`).

**Canvas** — the preview area uses `#f0f0f4` background with a dot grid pattern
(`#c8c8d0` dots, 16px spacing) for spatial orientation.

**Rationale:** Dark editor chrome + light canvas creates strong contrast that
makes the document content unmistakable. The editor recedes into the periphery,
following page-builder UX best practices.

---

## 7. Tailwind Equivalents

For reference, the key token-to-Tailwind mappings:

| Token                                | Tailwind Class     |
| ------------------------------------ | ------------------ |
| `color.text.primary` (#111827)       | `text-gray-900`    |
| `color.text.muted` (#6b7280)         | `text-gray-500`    |
| `color.accent.blue` (#2563eb)        | `text-blue-600`    |
| `color.accent.greenBright` (#10b981) | `text-emerald-500` |
| `color.accent.amber` (#f59e0b)       | `text-amber-500`   |
| `color.accent.red` (#dc2626)         | `text-red-600`     |
| `color.bg.page` (#f8fafc)            | `bg-slate-50`      |
| `color.bg.card` (#ffffff)            | `bg-white`         |
| `color.morning` (#3b82f6)            | `text-blue-500`    |
| `color.evening` (#8b5cf6)            | `text-violet-500`  |
