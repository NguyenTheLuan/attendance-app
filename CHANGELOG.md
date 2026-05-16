# Changelog

## [0.0.25] - 2026-05-16


---

## [0.0.24] - 2026-05-15

### ✨ Features
- feat(stats): increase pie chart height for better readability
- feat: Add sticky header to ViewPage for improved navigation
- feat(stats): add absence tab, bar chart, and hideImages prop
- feat(scripts): add all April + May 2026 attendance records

### 🐛 Bug Fixes
- fix: move toast out of modal to prevent unmount before showing
- fix: prevent undefined note from being sent to Firestore
- fix: resolve potential undefined values and improve type safety

### ♻️ Refactoring
- refactor: add show prop to Toast for external show/hide control

### 🔧 Maintenance
- chore: bump version to v0.0.20

### Other
- 🔧 chore: bump version to v0.0.23
- 🔧 chore: bump version to v0.0.22
- 🔧 chore: bump version to v0.0.21


---

## [0.0.23] - 2026-05-15

### ✨ Features
- feat(stats): increase pie chart height for better readability
- feat: Add sticky header to ViewPage for improved navigation
- feat(stats): add absence tab, bar chart, and hideImages prop
- feat(scripts): add all April + May 2026 attendance records

### 🐛 Bug Fixes
- fix: move toast out of modal to prevent unmount before showing
- fix: prevent undefined note from being sent to Firestore
- fix: resolve potential undefined values and improve type safety

### ♻️ Refactoring
- refactor: add show prop to Toast for external show/hide control

### 🔧 Maintenance
- chore: bump version to v0.0.20

### Other
- 🔧 chore: bump version to v0.0.22
- 🔧 chore: bump version to v0.0.21


---

## [0.0.22] - 2026-05-15

### ✨ Features
- feat(stats): increase pie chart height for better readability
- feat: Add sticky header to ViewPage for improved navigation
- feat(stats): add absence tab, bar chart, and hideImages prop
- feat(scripts): add all April + May 2026 attendance records

### 🐛 Bug Fixes
- fix: move toast out of modal to prevent unmount before showing
- fix: prevent undefined note from being sent to Firestore
- fix: resolve potential undefined values and improve type safety

### ♻️ Refactoring
- refactor: add show prop to Toast for external show/hide control

### 🔧 Maintenance
- chore: bump version to v0.0.20

### Other
- 🔧 chore: bump version to v0.0.21


---

## [0.0.21] - 2026-05-15

### ✨ Features
- feat(stats): increase pie chart height for better readability
- feat: Add sticky header to ViewPage for improved navigation
- feat(stats): add absence tab, bar chart, and hideImages prop
- feat(scripts): add all April + May 2026 attendance records

### 🐛 Bug Fixes
- fix: move toast out of modal to prevent unmount before showing
- fix: prevent undefined note from being sent to Firestore
- fix: resolve potential undefined values and improve type safety

### ♻️ Refactoring
- refactor: add show prop to Toast for external show/hide control

### 🔧 Maintenance
- chore: bump version to v0.0.20


---

## [0.0.20] - 2026-05-14

### ✨ Features

- feat(stats): add password-protected absence tab with search and month filter
- feat(stats): replace pie chart with horizontal bar chart for person distribution
- feat(stats): add hideImages prop to DayGroup and PersonCard for image-less views

---

## [0.0.19] - 2026-05-14

### ✨ Features

- feat(scripts): add seed-data.mjs for May 2026 attendance records

---

## [0.0.18] - 2026-05-14

### ✨ Features

- feat(scripts): add seed-data script for May 2026 attendance records
- feat(App): pass isLoggedIn prop to StatsPage

### 🐛 Bug Fixes

- fix(ViewPage): show export CSV only when logged in, use groupByDate utility
- fix(StatsPage): show export CSV only when logged in, accept isLoggedIn prop
- fix(LoginPage): change fallback icon from � to �
- fix(AdminPage): remove capture='environment', allow gallery selection
- fix(Navbar): hide export CSV button when not logged in

### ♻️ Refactoring

- refactor(MonthDetail): use PersonImage component for consistent avatar display
- refactor(DayGroup): extract groupByDate import, improve day grouping styles
- refactor: extract groupByDate utility from ViewPage

### 💄 Styling

- style(PersonImage): add dedicated styles for fallback and avatar
- style(App.css): add CSS variables for light/dark mode, rewrite styles

---

## [0.0.17] - 2026-05-14

### ✨ Features

- feat: refactor PersonCard to use PersonImage, extract card styles into dedicated CSS
- feat: create reusable PersonImage component with fallback avatar and clickable support
- feat: improve person card layout with responsive grid and enhanced styling

### 🐛 Bug Fixes

- fix(attendance): show fallback avatar when imageUrl is missing

### ♻️ Refactoring

- refactor: rewrite App.css with global CSS variables for light/dark mode
- refactor: MonthDetail now uses PersonCard component for consistent UI
- refactor: extract DayGroup styles into dedicated CSS file
- refactor: restructure DayGroup and migrate to Cloudinary for image upload

### 📝 Documentation

- docs: translate Vietnamese changelog entries to English

### Other

- Merge branch 'main' of https://github.com/NguyenTheLuan/attendance-app
- 🔧 chore: bump version to v0.0.16

---

## [0.0.16] - 2026-05-14

### ♻️ Refactoring

- refactor: restructure DayGroup and migrate to Cloudinary for image upload

### 📝 Documentation

- docs: translate Vietnamese changelog entries to English

---

## [0.0.15] - 2026-05-13

---

## [0.0.14] - 2026-05-14

### 🔧 Maintenance

- 🔧 chore: bump version to v0.0.14

---

## [0.0.13] - 2026-05-13

### ✨ Features

- feat: simplify pie chart - show person name + pct directly on chart, remove person list on right
- feat: pie chart section now uses 2-col layout - chart left, person list right
- feat: responsive navbar with drawer on mobile
- feat: replace alert() with Toast component for save error
- feat: improve ImageUploader with drag & drop UI and update title
- feat: add All/Month view modes and change title to Xem Khu pho 3-6
- feat: improve delete confirmation dialog replacing window.confirm
- feat: add note feature and improve StatsPage with 2 view modes
- feat: add admin edit/delete records on ViewPage via click-to-edit modal
- feat: refactor attendance stats to use new MonthList and MonthDetail components

### 🐛 Bug Fixes

- fix: use text-overflow ellipsis instead of scroll for person-note
- fix: add max-height for .person-note to prevent content overflow
- fix: update HTML title to shortened form
- fix: improve Edit Modal layout
- fix: add ConfirmDialog for PersonCard and EditModal, fix scroll
- fix: improve tooltip chart dark mode and increase PieChart size
- fix: login navigate to /admin after success & add missing stat-card css
- fix: correct firebase project id to attendance-app-d215e
- fix: restore cloudinary config to working cloud name and upload preset with image compression

### ♻️ Refactoring

- refactor: move code splitting & DRY rules to code-style.md (English), simplify reusability.md
- refactor: extract Field component, reuse ImageUploader in EditModal
- refactor: replace remaining relative imports with tilde alias in statspage

### 📝 Documentation

- docs: add rules about code splitting and using map/filter when iterating >3 times

### 🔧 Maintenance

- chore: remove stray orphan file 'e'
- chore: update AGENT.md with English-only rule and improve navbar mobile styling
- chore: add agent.md with project overview and ai instructions
- chore: add commitlint + husky to enforce conventional commit format

### Other

- Persist login state via localStorage so F5 doesn't log out

---

## [0.0.12] - 2026-05-13

### ✨ Features

- feat: admin edit/delete records on ViewPage via click-to-edit modal
- feat: EditModal component for editing name, date, imageUrl + delete record
- feat: clickable image in PersonCard to trigger edit modal

### ♻️ Refactoring

- refactor: hardcode Firebase & Cloudinary API config (no .env needed)
- refactor: clean up ViewPage layout, fix TypeScript types

---

## [0.0.11] - 2026-05-13

### ♻️ Refactoring

- Refactor: move flat files into folder/index pattern for pages, components, hooks, utils

## [0.0.10] - 2026-05-13

### ✨ Features

- feat: add React best practices documentation for component architecture and coding standards

### Other

- � fix(login): add CSS for input[type=password]

---

## [0.0.9] - 2026-05-13

### Other

- ♿️ fix(nav): show navbar always with 3 menu items, login required only for entry

---

## [0.0.8] - 2026-05-13

### Other

- � fix(stats): fix TS errors - unused vars, possibly undefined percent

---

## [0.0.7] - 2026-05-13

### Other

- � ci(deploy): auto-create GitHub Release with changelog notes when tagging

---

## [0.0.6] - 2026-05-13

### Other

- � chore: bump version to v0.0.5
- � docs: add comprehensive README with features, tech stack, and setup guide
- ✨ feat: add login page, stats charts with recharts, and admin improvements
- 🔧 chore: bump version to v0.0.4
- 📝 docs: remove default Vite template README, use CHANGELOG.md as project info
- 🔧 chore: bump version to v0.0.3
- 📝 docs(commit-rule): simplify and add mandatory user review before push
- 🔧 chore: bump version to v0.0.2
- 👷 ci(deploy): improve changelog with categorized commits per Conventional Commits
- 📝 docs: add commit message generation rules and guidelines
- 👷 ci(deploy): generate changelog with categorized commits using Node.js
- 🔧 chore: bump version to v0.0.1
- 👷 ci: auto update CHANGELOG.md and bump version on push
- ✨ feat: add stats page, active nav underline, image compression
- 🐛 fix: add 404.html for SPA routing on GitHub Pages
- 🐛 fix(deploy): use gh-pages branch for deployment
- ♻️ refactor: extract reusable components, add search, CSV export, error boundary

---

## [0.0.5] - 2026-05-13

### ✨ Features

- feat: add login page, stats charts with recharts, and admin improvements

### 📝 Documentation

- docs: add comprehensive README with features, tech stack, and setup guide

---

## [0.0.4] - 2026-05-13

### Other

- docs: remove default Vite template README, use CHANGELOG.md as project info
- chore: bump version to v0.0.4
- docs(commit-rule): simplify and add mandatory user review before push
- chore: bump version to v0.0.3
- ci(deploy): improve changelog with categorized commits
- docs: add commit message generation rules and guidelines
- ci(deploy): generate changelog with categorized commits
- chore: bump version to v0.0.2
- ci: auto update CHANGELOG.md and bump version on push
- feat: add stats page, active nav underline, image compression
- fix: add 404.html for SPA routing on GitHub Pages
- fix(deploy): use gh-pages branch for deployment
- refactor: extract reusable components, add search, CSV export, error boundary

---

## [0.0.3] - 2026-05-13

### 📝 Documentation

- docs: replace detailed commit message guide with simplified commit rules

---

## [0.0.2] - 2026-05-13

### ✨ Features

- feat: add commit message generation rules and guidelines

### 🔧 Maintenance

- ci: update deploy workflow to generate categorized changelog and use Node.js for safer file operations

---

## [0.0.1] - 2026-05-13

### ✨ Features

- feat: initial attendance app with React + TypeScript
- feat: add stats page, active nav underline, image compression
- feat: add 404.html for SPA routing on GitHub Pages

### ♻️ Refactor

- refactor: extract reusable components, add search, CSV export, error boundary, confirm dialog

### 🐛 Fixes

- fix: deploy script to use gh-pages branch

### 👷 CI

- ci: auto update CHANGELOG.md & bump version on push
