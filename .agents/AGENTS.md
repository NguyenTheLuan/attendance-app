# Attendance App — Agent Rules (Antigravity)

> These rules are **automatically loaded** for every session. Follow them strictly. No exceptions.

---

## 1. Core Mindset

- **Ask first, code second**: If requirements are unclear, ask until they are clear. Never assume.
- **Reuse first**: Always check if a component, hook, or util already exists before creating a new one.
- **Compose, don't copy**: Prefer composition and custom hooks over duplicating logic.
- **Style is co-located**: CSS lives next to its component, never in `App.css`.
- **Report-driven improvement**: Any generated analysis/report goes to the `report/` directory.

---

## 2. Commit Rules

Follow **Conventional Commits** with emojis.

### Format
```
<emoji> <type>(<scope>): <subject>

[optional body — bullet points, explain WHAT and WHY]
```

### Types & Emojis
| Emoji | Type | When |
|-------|------|------|
| ✨ | `feat` | New feature |
| 🐛 | `fix` | Bug fix |
| ♻️ | `refactor` | Code restructure, no behavior change |
| 💄 | `style` | CSS, formatting, UI polish |
| 📝 | `docs` | Documentation only |
| ⚡️ | `perf` | Performance improvement |
| 🔧 | `chore` | Maintenance, config, deps |
| 🏗️ | `build` | Build system, dependencies |
| 👷 | `ci` | CI/CD config & scripts |
| ✅ | `test` | Adding or fixing tests |
| ⏪️ | `revert` | Revert a previous commit |

### Scopes
`attendance` · `viewer` · `stats` · `auth` · `db` · `ui` · `types` · `config` · `deps`

### Rules
- **Subject ≤ 72 chars**, imperative mood, no period
- **Body**: bullet points `- `, explain what & why, max 100 chars/line
- **Write in English only**
- **NEVER push to remote without user approval first**

### Pre-push Checklist
- [ ] `tsc --noEmit` passes (no TypeScript errors)
- [ ] ESLint passes
- [ ] No `console.log` or `debugger` left in code
- [ ] No `.env` file or secrets committed

### Example
```
✨ feat(stats): add month-over-month comparison chart

- add total sessions, participants, months count
- show month vs previous month diff with increase/decrease
- lazy-load chart component for performance
```

---

## 3. Project Structure (Feature-Sliced)

```
src/
  components/         # Reusable, shared UI primitives
    Button/
      index.tsx
      styles.css
    Card/
    Modal/
    ...
  pages/              # Route-level page components
    AdminPage/
      index.tsx
      styles.css
    ViewPage/
    StatsPage/
    LoginPage/
  hooks/              # Global custom hooks
    useRecords/
    useTheme.tsx
    useLocalStorage/
  services/           # All external integrations
    db.ts             # Supabase CRUD
    supabase.ts       # Supabase client init
    cloudinary.ts     # Image upload
  types/              # Global TypeScript types
    attendance.ts
    stats.ts
    index.ts
  utils/              # Pure utility functions
    groupByDate.ts
    exportCsv.ts
    absence.ts
  index.css           # Design tokens + global base styles
  App.tsx             # Router + auth state
  main.tsx            # Entry point + providers
```

### Structure Rules
- **Page components**: business logic + layout; import from `components/`
- **`components/`**: pure UI, no business logic, no direct DB calls
- **`hooks/`**: reusable state + side effects; one concern per hook
- **`services/`**: external API calls only — no React, no state
- **`utils/`**: pure functions — no side effects, no React

---

## 4. Code Style

### General
- No `any` — strict TypeScript always
- Always define explicit interface/type for props
- No god components (> ~100 JSX lines → split it)
- Early returns over deeply nested conditionals
- `useMemo` / `useCallback` only when actually needed — don't over-optimize
- Avoid speculative abstractions (YAGNI)
- Concise comments only where intent is non-obvious

### Component File Pattern
```
ComponentName/
  index.tsx     ← component logic + JSX
  styles.css    ← scoped CSS for this component only
```

### Naming
- Components: `PascalCase`
- Hooks: `camelCase`, always start with `use`
- Utils: `camelCase`
- CSS classes: `kebab-case`
- Types/Interfaces: `PascalCase`, no `I` prefix

### DRY Rule
If the same JSX pattern repeats **> 2 times**, extract it:
```tsx
// ❌ Bad — 3 repeated NavLink blocks
// ✅ Good — map over a config array
const NAV_LINKS = [
  { to: "/admin", label: "Nhập điểm danh", icon: "✏️" },
  { to: "/view",  label: "Xem lịch trực",  icon: "👁️" },
  { to: "/stats", label: "Thống kê",        icon: "📊" },
];
```

### Error Handling
- All async calls must have `try/catch`
- Show user-visible error messages (Toast, inline `msg err`)
- Never swallow errors silently without logging

---

## 5. React Architecture

### Component Rules
- **Always**: define clear TypeScript interface for props
- **Always**: handle loading, error, and empty states
- **Always**: mobile-first responsive layouts
- **Prefer**: controlled components for forms
- **Prefer**: composition over prop drilling > 2 levels (use Context)
- **Prefer**: `forwardRef` for reusable primitive components

### Custom Hook Pattern
Each hook owns exactly one slice of logic:
```typescript
// ✅ Good — one concern
export function useRecords() { /* fetch, load, error */ }
export function useTheme()   { /* theme state + apply */ }

// ❌ Bad — multiple concerns in one hook
export function useEverything() { /* auth + records + theme */ }
```

### Lazy Loading for Heavy Components
```typescript
// Charts and heavy third-party components must be lazy-loaded
const MonthOverviewChart = lazy(() => import("~/components/stats/MonthOverviewChart"));
const WeeklyChart = lazy(() => import("~/components/stats/WeeklyChart"));
```

### State Strategy
| Scope | Tool |
|-------|------|
| Local UI state | `useState` / `useReducer` |
| Shared logic | Custom hooks |
| Global theme | `ThemeContext` (already implemented in `useTheme.tsx`) |
| Server/data state | Direct service calls + `useState` in hooks |

### Performance
- `useMemo` for expensive computations (filtering, grouping large lists)
- `useCallback` for callbacks passed to child components that re-render often
- Virtualize lists with > 50 items

---

## 6. Design System

### Brand Identity
- **Primary Color**: Purple-Violet `#7C3AED` (not blue!)
- **Style**: Modern, professional, premium education admin app
- **Font**: System sans-serif stack (Inter preferred)
- **Multi-theme**: 5 themes must all work correctly

### Multi-Mode Themes (CSS Variables)

The app uses `data-theme` attribute on `<html>` to switch themes. All components **must use CSS variables only** — never hardcode colors.

| Theme | `data-theme` value | Feel |
|---|---|---|
| Light Classic | `light-classic` | Soft & professional |
| Light Warm | `light-warm` | Eye-friendly beige |
| Dark Premium | `dark-premium` | Deep charcoal (default dark) |
| Dark OLED | `dark-oled` | True black, luxury |
| Glassmorphism | `glass` | iOS/VisionOS style |

### Core CSS Variables (use these — never raw hex)
```css
/* Backgrounds */
var(--bg-page)       /* page background */
var(--bg-surface)    /* card/panel background */
var(--bg-surface-2)  /* secondary surface */
var(--bg-input)      /* input fields */

/* Text */
var(--text-primary)    /* main text */
var(--text-secondary)  /* supporting text */
var(--text-muted)      /* labels, placeholders */

/* Brand */
var(--primary)         /* primary buttons, links, accents */
var(--primary-hover)   /* hover state for primary */
var(--primary-soft)    /* subtle primary background tint */
var(--primary-glow)    /* focus ring box-shadow */

/* Borders */
var(--border)          /* default border */
var(--border-focus)    /* focused input border */

/* Shadows */
var(--shadow-sm) / var(--shadow) / var(--shadow-md) / var(--shadow-lg)

/* Semantic */
var(--danger)    /* #ef4444 */
var(--success)   /* #10b981 */
```

### Component Design Rules
- **Buttons**: `var(--primary)` bg, white text, `border-radius: var(--radius-md)`, hover lift + shadow
- **Inputs**: `var(--bg-input)` bg, `border-radius: var(--radius-md)`, focus = `var(--primary-glow)`
- **Cards**: `var(--bg-surface)` bg, `border-radius: var(--radius-lg)`, `var(--shadow)` shadow
- **Modals**: `var(--radius-xl)` corners, `var(--bg-overlay)` backdrop, smooth fade-in animation
- **Charts**: Purple → Pink → Orange gradient palette (`var(--chart-1)` … `var(--chart-8)`)

### Animation
- Theme transitions: `300ms ease`
- Hover/interactive: `150–250ms ease`
- Modal entrance: scale + fade (`transform: scale(0.95) → 1`)
- Toast: slide in from top

### Quality Bar
- Never use plain generic colors (no raw `red`, `blue`, `green`)
- Never make UI look cheap or unpolished
- Maintain strong purple identity across all 5 themes
- Always handle dark/light contrast — test all themes

---

## 7. Database (Supabase)

The app uses **Supabase** (PostgreSQL) as the backend database.

### Table: `records`
| Column | Type | Notes |
|--------|------|-------|
| `id` | `UUID` | Primary key, auto-generated |
| `name` | `TEXT` | Person's name, required |
| `imageUrl` | `TEXT` | Cloudinary URL (nullable) |
| `date` | `TEXT` | Format: `YYYY-MM-DD` |
| `note` | `TEXT` | Optional notes |
| `createdAt` | `BIGINT` | Unix timestamp ms (`Date.now()`) |

### Service Layer (`src/services/db.ts`)
All DB operations must go through the service layer. Components and hooks must **never** import `supabase` directly — always use `db.ts` functions.

```typescript
// Correct pattern
import { getAllRecords, addRecord, deleteRecordById, updateRecordById } from "~/services/db";
```

### Image Storage
- Images are uploaded to **Cloudinary** (not Supabase Storage)
- Upload via `src/services/cloudinary.ts`
- Store only the `secure_url` string in the `records.imageUrl` column

---

## 8. Auth Pattern

Authentication is intentionally simple (localStorage flag):
- `localStorage.getItem("attendance_logged_in") === "true"` → admin
- Admin = can add, edit, delete records, export CSV, view absences
- Public = can view non-absent records, click for photo detail

> Do NOT add Firebase Auth, JWT, or complex auth unless explicitly requested. Keep it simple.

---

## 9. Key Utilities to Know

| Utility | Path | Purpose |
|---------|------|---------|
| `isAbsentNote(note)` | `~/utils/absence` | Checks if a note marks someone as absent |
| `groupByDate(records)` | `~/utils/groupByDate` | Groups records into `[date, records[]]` pairs |
| `exportRecordsToCsv(records)` | `~/utils/exportCsv` | Downloads records as CSV file |
| `getMonthlyDailyData(records, month)` | `~/utils/weeklyCounts` | Aggregates daily counts for chart |

---

## 10. Accessibility Checklist (every component)

- [ ] Interactive elements have visible focus states
- [ ] Color is not the only means of conveying information
- [ ] Form inputs have associated `<label>`
- [ ] Error messages linked via `aria-describedby`
- [ ] Images have meaningful `alt` text
- [ ] Modals use `role="dialog"` and `aria-modal="true"`
- [ ] Touch targets ≥ 44×44px
- [ ] Keyboard navigation works
