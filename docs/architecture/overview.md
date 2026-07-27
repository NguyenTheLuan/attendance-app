# 🏗️ System Architecture Overview

This document describes the structure, technology stack, and data flow of the **Attendance App**. The system is designed using a lightweight **Feature-Sliced Design (FSD)** approach, combined with Backend-as-a-Service (BaaS) solutions to optimize costs and development speed.

---

## 1. 🛠️ Tech Stack

### Frontend (User Interface)
- **Framework:** React 19
- **Language:** TypeScript (Strict Mode)
- **Build Tool:** Vite (Optimized for HMR speed and production builds)
- **Styling:** Vanilla CSS combined with CSS Variables (Supports 5 dynamic themes without reloading)
- **Charts:** Recharts (Lazy loading)

### Backend & Storage
- **Database:** Supabase (PostgreSQL) — Stores attendance records (`records`).
- **Image Storage:** Cloudinary — Stores and optimizes photos taken from the camera, returning a CDN URL (reduces load on Supabase).

### CI/CD & DevOps
- **Auto-Review:** CodeRabbit AI (GitHub App) for automated code reviews.
- **Deployment:** GitHub Actions automatically builds and deploys to GitHub Pages whenever code is pushed to the `main` branch.

---

## 2. 📂 Project Structure

The project follows a component-driven architecture:

```text
src/
├── components/         # Reusable UI primitives (Button, Card, Chart...)
│   └── stats/          # Specific components for the Stats page (Lazy loaded)
├── pages/              # Route-level page components (Admin, View, Stats, Settings...)
├── hooks/              # Custom React Hooks containing business logic (useRecords, useTheme)
├── services/           # External API integration layer (Supabase API, Cloudinary API)
├── utils/              # Pure utility functions (exportCSV, Date utils)
├── types/              # Global TypeScript interface definitions
└── locales/            # i18n translation files (vi.ts)
```

---

## 3. 🔄 Data Flow

### 3.1. Check-in Flow
1. **User (Admin):** Opens `/admin`, enters a name, and clicks the capture button from the integrated Camera.
2. **Frontend:** Captures the image from the video stream and converts it to a Base64 format.
3. **Cloudinary Service:** Uploads the Base64 string to Cloudinary via API. Cloudinary returns a `secure_url`.
4. **Supabase Service:** Sends the `secure_url`, `name`, `date`, and `note` to be stored in the `records` table in Supabase's PostgreSQL database.
5. **UI Update:** The application automatically refreshes the list (State) without reloading the page.

### 3.2. Statistics Flow
1. **User:** Visits `/stats`.
2. **Frontend:** Triggers `React.lazy` to asynchronously load the chart chunks (Recharts).
3. **useRecords Hook:** Fetches all data from Supabase (or uses Mock Data if Test mode is enabled).
4. **Data Aggregation:** Utility functions (like `getMonthlyDailyData`) group the data by day/week/month.
5. **Charts:** Renders the Line Chart and Bar Chart.

---

## 4. 🎨 Design System

The project intentionally avoids heavy CSS frameworks (like Tailwind or Bootstrap) to keep the bundle size extremely lightweight.
Instead, all color rules are managed using **CSS Variables** in `src/index.css`.

The system supports 5 display modes (Themes) based on the `data-theme` attribute attached to the `<html>` tag:
- `light-classic`: Basic light theme
- `light-warm`: Warm light theme (Eye-friendly)
- `dark-premium`: Premium dark theme (Navy/Gold - Military style)
- `dark-oled`: True black (Battery saving for OLED screens)
- `glass`: Frosted glass effect (iOS style Glassmorphism)

*(For detailed color and class rules, see `.agents/rules/design-system.md`)*

---

## 5. 🔐 Authentication

The authentication system is designed to be minimal and exclusively for the internal Admin team:
- No JWT or OAuth is used to avoid unnecessary complexity.
- The login status is stored temporarily as a flag in `localStorage`.
- Authorization:
  - **Admin:** Has access to `/admin`, `/stats`, can Add/Edit/Delete records, and Export CSV.
  - **Public (Guest):** Can only view the attendance schedule at `/view` (sensitive absence notes are hidden).

---

## 6. 🛣️ Roadmap
- [ ] Migrate auth state from LocalStorage to Supabase Auth for strict security.
- [ ] Integrate Push Notifications (Service Worker) for attendance reminders.
- [ ] Implement multi-level role-based access control (Super Admin, Manager, User).
