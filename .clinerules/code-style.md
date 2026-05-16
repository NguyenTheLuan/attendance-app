# Code Style & Architecture Standards

## Purpose

Keep code predictable, reviewable, and maintainable.

---

## 1. General Rules

1. Clarify the requested outcome and constraints before editing.
2. Prefer small, focused changes over broad refactors.
3. Preserve existing behavior unless a behavior change is requested.
4. Keep naming, structure, and style consistent with nearby code.
5. Add or update tests when behavior changes.
6. Handle edge cases and explicit failure paths.
7. Avoid speculative abstractions and dead code.
8. Add concise comments only where intent is not obvious.
9. Run available validation steps before finalizing.

---

## 2. Code Splitting — Split early, split small

Each file/component should do **one thing only**. If a file starts doing more than one thing → split it.

```
❌ Bad:   A component that renders a form, handles upload logic, AND manages toast state
✅ Good:  FormComponent + useUploadLogic + Toast
```

**Specific rules:**

- Each component should not exceed ~100 lines of JSX return
- Each custom hook should manage only one type of state/logic
- Utility functions → put in `src/utils/`
- Type definitions → put in `src/types/`
- If a component can be reused → extract it into its own file immediately

**Recommended file structure:**

```
src/
  components/
    Navbar/
      index.tsx
    Field/
      index.tsx
    ImageUploader/
      index.tsx
  hooks/
    useAuth.ts
    useRecords.ts
  utils/
    formatDate.ts
    exportCsv.ts
  types/
    index.ts
```

---

## 3. DRY — If code repeats > 3 times, use map / filter / reduce

When rendering JSX and the same pattern appears > 3 times, use a loop:

```tsx
// ❌ Bad — repeated code > 3 times
<NavLink to="/admin">✏️ Attendance</NavLink>
<NavLink to="/view">👁️ View</NavLink>
<NavLink to="/stats">📊 Stats</NavLink>
<button>🚪 Logout</button>

// ✅ Good — use map
const links = [
  { to: "/admin", label: "✏️ Attendance" },
  { to: "/view", label: "👁️ View" },
  { to: "/stats", label: "📊 Stats" },
];
{links.map((link) => <NavLink key={link.to} to={link.to}>{link.label}</NavLink>)}
<button key="logout" onClick={onLogout}>🚪 Logout</button>
```

**Apply to:**

- Nav links, tabs, repeated buttons
- Lists of items, cards, grid cells
- Form fields, options, select choices

---

## 4. Minimal DOM

- Don't render a component if not needed → use early conditional (`if` guard)
- Prefer `map` + `filter` over `forEach` + `push`
- Avoid unnecessary `div` wrappers → use Fragment (`<>...</>`) when possible
- If a list > 50 items → consider virtual list

---

## 5. Delivery Format

When reporting completion:

- What changed (files and intent).
- Why it changed (problem solved or risk reduced).
- How it was verified (tests, checks, or manual validation).
- Remaining risks, assumptions, or follow-ups.
