# AI Assistant Instructions

## 🚨 Critical: Before Every CODE

1. **READ `.clinerules/code-style.md`** carefully
2. **READ `.clinerules/react-vibe.md`** carefully
3. Analyze requirement and make plan

## 🚨 Critical: Before Every Commit

1. **READ `.clinerules/commit-rule.md`** before writing any commit message
2. Format MUST be: `<emoji> <type>(<scope>): <description>`
3. If commit fails lint → fix the message, do NOT skip the hook
4. NEVER push without asking user first

## Commands Reference

- `npm run dev` — start dev server
- `npm run build` — full TS build + vite build
- `npx commitlint` — check commit message manually
- `npx eslint .` — lint check

## Project Structure

- `src/components/` — reusable components (EditModal, PersonCard, DayGroup, etc.)
- `src/pages/` — page components (ViewPage, AdminPage, LoginPage)
- `src/hooks/` — custom hooks (useRecords)
- `src/services/` — Firebase, Cloudinary, db
- `src/utils/` — helpers (formatDate, exportCsv)
- `.clinerules/` — project coding rules
