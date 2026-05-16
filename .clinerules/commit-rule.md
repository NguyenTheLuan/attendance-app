# Git Commit Rules

## ❗ Critical: MUST ask user before pushing

**NEVER push to remote without user approval first.**

Before any push, present a review report to user and wait for explicit approval. If user says no → adjust and re-present.

## Review Report Format

```
## 📋 Push Review

### Features/Changes
- bullet list of what was done

### Concept
- why this approach, high-level reasoning

### Files Changed
- `path/to/file` — what changed
```

## Commit Format

Follow [Conventional Commits 1.0.0](https://www.conventionalcommits.org/en/v1.0.0/).

```
<emoji> <type>(<scope>): <description>

[optional body with bullet points]

[optional footer(s)]
```

## Type & Emoji

| Type     | Emoji | When to use                     |
| -------- | ----- | ------------------------------- |
| feat     | ✨    | New feature                     |
| fix      | 🐛    | Bug fix                         |
| refactor | ♻️    | Code change (no bugfix/feature) |
| style    | 💄    | Formatting, CSS, UI polish      |
| docs     | 📝    | Documentation only              |
| perf     | ⚡️   | Performance improvement         |
| chore    | 🔧    | Maintenance, deps, config       |
| build    | 🏗️    | Build system, dependencies      |
| ci       | 👷    | CI/CD config & scripts          |
| test     | ✅    | Adding/fixing tests             |
| revert   | ⏪️   | Revert a previous commit        |

## Rules

- **Scope** (optional): use when a specific component changes e.g. `feat(auth): ...`
- **Description**: imperative mood, no caps, no period, max 100 chars
- **Body**: bullet points (`- `), explain what & why, max 100 chars/line
- **Write in English only**

## Single vs Multiple

- **Single format**: all changes serve one purpose → one commit message
- **Multiple format**: changes address separate concerns → separate subject per change

## Example

```
✨ feat(stats): add month-over-month comparison chart

- add total sessions, participants, months count
- show month vs previous month diff with increase/decrease
- add top ranking with 🥇🥈🥉 badges
```
