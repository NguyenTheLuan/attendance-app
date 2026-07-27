# Commit Rules

## Commit Message Convention

We follow **Conventional Commits** with custom scopes tailored to the Attendance App.

### Format

```
<type>(<scope>): <subject>

[optional body]

[optional footer(s)]
```

### Types

| Type | Description |
|------|-------------|
| `feat` | A new feature (e.g., batch entry, CSV export) |
| `fix` | A bug fix |
| `docs` | Documentation only changes |
| `style` | Code style changes (formatting, semicolons, etc.) |
| `refactor` | Code change that neither fixes a bug nor adds a feature |
| `perf` | Performance improvement |
| `test` | Adding or correcting tests |
| `chore` | Build process, dependencies, tooling |
| `ci` | CI/CD configuration changes |

### Scopes

| Scope | Description |
|-------|-------------|
| `attendance` | Attendance input & management features |
| `viewer` | Attendance viewer page |
| `analytics` | Stats, charts, dashboards |
| `auth` | Authentication, roles, password protection |
| `api` | Backend API integration |
| `ui` | Shared UI components, design system |
| `types` | TypeScript types, interfaces |
| `config` | Project configuration |
| `deps` | Dependencies |

### Examples

```bash
# Feature
feat(attendance): add batch entry with comma-separated names

# Fix
fix(viewer): resolve month filter not resetting on search

# Refactor
refactor(analytics): lazy-load chart components for performance

# Breaking change
feat(auth): replace session-based auth with JWT

BREAKING CHANGE: requires updating all API calls to include Bearer token
```

### Rules

1. **Subject line must be ≤ 72 characters**
2. **Use imperative mood**: "add" not "added", "fix" not "fixed"
3. **No period at the end of subject**
4. **Body should explain WHAT and WHY, not HOW**
5. **Reference issues in footer**: `Closes #123`, `Refs #456`
6. **Breaking changes must include `BREAKING CHANGE:` in body or footer**

### Pre-commit Checklist

- [ ] Code passes `tsc --noEmit`
- [ ] ESLint and Prettier checks pass
- [ ] Tests pass (`npm test`)
- [ ] Commit message follows convention
- [ ] No `console.log` or `debugger` left in code
- [ ] No `.env` files or secrets committed

### Branch Naming

```
feature/attendance-batch-entry
fix/viewer-search-debounce
refactor/analytics-lazy-load
hotfix/auth-token-expiry
```
