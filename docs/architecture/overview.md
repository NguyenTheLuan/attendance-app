# 🏗️ Technical Architecture Document (TAD)

This document dives deep into the technical design, architectural patterns, and database schema of the **Attendance App**. Unlike the README (which focuses on getting started), this document explains *how* and *why* the system is built the way it is.

---

## 1. System Context & Infrastructure

The application uses a lightweight Serverless / Backend-as-a-Service (BaaS) architecture to minimize DevOps overhead while maximizing scalability.

*   **Client (Frontend):** React 19 SPA built with Vite. Hosted on GitHub Pages.
*   **Primary Database (Supabase):** PostgreSQL database used via Supabase's REST API (PostgREST). Handles all structured data (attendance records).
*   **Media Storage (Cloudinary):** Handles image uploads (Base64 from device cameras). Offloading images to Cloudinary prevents database bloat and leverages a global CDN for faster image delivery.

---

## 2. Database Schema (Supabase PostgreSQL)

The core data model is intentionally simple, revolving around a single `records` table.

### Table: `records`
| Column Name | Data Type | Constraints / Notes | Description |
| :--- | :--- | :--- | :--- |
| `id` | `uuid` | Primary Key, Default: `gen_random_uuid()` | Unique identifier for each check-in. |
| `name` | `text` | Not Null | The name of the person checking in. |
| `imageUrl` | `text` | Nullable | Cloudinary Secure URL of the captured photo. |
| `date` | `text` | Not Null | Formatted as `YYYY-MM-DD` (e.g., `2025-09-01`). Used for grouping and charting. |
| `note` | `text` | Nullable | Optional notes (e.g., "vắng", "hỗ trợ", "trực thay"). |
| `createdAt` | `int8` | Not Null | Unix timestamp in milliseconds (`Date.now()`). Used for chronological sorting. |

> **Design Decision:** `date` is stored as a `text` string (`YYYY-MM-DD`) rather than a strict PostgreSQL `DATE` type to simplify client-side timezone handling and grouping logic without complex date parsing.

---

## 3. Frontend Architecture & Patterns

The frontend strictly adheres to a **Feature-Sliced / Component-Driven** approach.

### 3.1. State Management Strategy
We intentionally avoid heavy state management libraries like Redux or Zustand.
*   **Global UI State (Theme):** Managed via React Context API (`ThemeContext` + `useTheme` hook). It manipulates the `data-theme` attribute on the `<html>` tag.
*   **Server State (Data Fetching):** Managed via dedicated custom hooks (e.g., `useRecords`). These hooks encapsulate the Supabase API calls and expose `data`, `loading`, and `error` states to the UI.
*   **Local UI State:** Managed via standard `useState` and `useReducer` at the component level.

### 3.2. Performance Optimizations
*   **Lazy Loading for Charts:** Data visualization libraries (Recharts) are heavy. Chart components (`MonthOverviewChart`, `WeeklyChart`) are wrapped in `React.lazy()` and `<Suspense>`. They are only downloaded when the user navigates to the `/stats` route.
*   **Image Optimization:** The native camera captures raw Base64. Cloudinary automatically compresses and converts these to WebP/AVIF formats before serving them to the client.

---

## 4. Design System & Theming Engine

We use **Vanilla CSS with CSS Variables** instead of utility-first frameworks like TailwindCSS.

### Why Vanilla CSS + CSS Variables?
1.  **Zero-Runtime Overhead:** No CSS-in-JS parsing costs.
2.  **Instant Theme Switching:** Themes are defined as CSS Variable maps under specific `data-theme` selectors. Switching a theme only requires updating one attribute on the root HTML element.
    ```css
    /* Example Implementation */
    html[data-theme="dark-oled"] {
      --bg-page: #000000;
      --text-primary: #ffffff;
      --primary: #FFD700; /* Gold */
    }
    ```
3.  **Strict Component Scoping:** CSS is co-located with its component (e.g., `PersonCard/styles.css`).

---

## 5. Security & Authentication Model

Currently, the app uses a **Client-Side Flag** for authentication (Admin mode).

*   **Current State:** A `localStorage` flag determines if the user sees the Admin UI. This is a deliberate "soft-lock" for convenience in a trusted internal environment.
*   **Data Protection:** The `utils/absence.ts` utility filters out sensitive notes (e.g., medical reasons) when rendering the public `/view` page.
*   **Future Migration (Supabase Auth & RLS):** The roadmap includes migrating to Supabase Auth. We will implement PostgreSQL Row Level Security (RLS) policies so that `INSERT`, `UPDATE`, and `DELETE` operations are strictly rejected at the database level unless accompanied by a valid Admin JWT.
