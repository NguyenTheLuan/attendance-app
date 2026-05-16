# ULTIMATE VIP DESIGN SYSTEM 2026 - Multi Mode (Điểm Danh Trực)

You are a Senior Product Designer & Frontend Engineer at Apple-level quality.
Follow this system STRICTLY for maximum consistency and premium feel.

### 1. Design Philosophy

- Brand: Modern Purple-Violet, Professional & Friendly Education Admin App
- Goal: Extremely polished, calm, sophisticated, and delightful to use
- Support multiple visual modes with smooth transition
- Prioritize readability, visual comfort, and modern depth

### 2. Multi-Mode Color Systems

**Primary Purple (Core Brand)**

- Base: `#7C3AED`
- Light Hover: `#6D28D9`
- Dark Hover: `#A855F7`

---

#### **MODE 1: Light Classic** (Soft & Professional)

- Background: `#F8F9FA`
- Surface: `#FFFFFF`
- Surface2: `#F1F3F5`
- Card: `#FFFFFF`
- Border: `#E5E7EB`
- Text Primary: `#1F2937`
- Text Secondary: `#4B5563`
- Text Muted: `#6B7280`
- Primary: `#7C3AED`

#### **MODE 2: Light Warm** (Dịu mắt nhất - Khuyến nghị cho Light)

- Background: `#FAF7F2`
- Surface: `#FFFCF7`
- Surface2: `#F5F0E8`
- Card: `#FFFCF7`
- Border: `#EDE6DB`
- Text Primary: `#2C2520`
- Text Secondary: `#5C5349`
- Text Muted: `#8C8174`
- Primary: `#7C3AED`

#### **MODE 3: Dark Premium** (Default)

- Background: `#0A0A0A`
- Surface: `#171717`
- Surface2: `#1F1F1F`
- Surface3: `#262626`
- Card: `#171717`
- Border: `#2F2F2F`
- Text Primary: `#F5F5F5`
- Text Secondary: `#D1D5DB`
- Text Muted: `#9CA3AF`
- Primary: `#A855F7`

#### **MODE 4: Dark OLED** (True Black - Siêu sang)

- Background: `#000000`
- Surface: `#0F0F0F`
- Surface2: `#1A1A1A`
- Surface3: `#222222`
- Border: `#2A2A2A`
- Text Primary: `#FAFAFA`
- Primary: `#C084FC`

#### **MODE 5: iOS 26 / VisionOS Style** (Glassmorphism + Depth)

- Background: `#F2F2F7` (Light) / `#000000` (Dark)
- Surface: `rgba(255,255,255,0.85)` (Light) / `rgba(30,30,30,0.75)` (Dark)
- Backdrop Blur: 32px
- Border: `1px solid rgba(255,255,255,0.3)` (Light) / `rgba(255,255,255,0.08)` (Dark)
- Vibrancy: High
- Primary: `#7C3AED` with subtle glow
- Shadow: Soft, layered, realistic depth

### 3. Component Rules (Unified Across Modes)

**Buttons:**

- Primary: Strong purple bg, white text, rounded-2xl, subtle inner shadow + hover lift
- Secondary: Soft border or translucent
- Delete: `#EF4444`

**Inputs / Forms:**

- Background follows Surface
- Focus: Primary border + soft purple glow ring
- Rounded: 16px
- Padding: 16px

**Cards & Modals:**

- Border radius: 20px (Light) / 24px (Glass mode)
- Shadow: Multi-layer soft shadow (Light) or inner glow (Dark)

**Chat / List Items:**

- User rows: Surface2
- Active state: Primary purple subtle background

**Upload Area (Ảnh người trực):**

- Dashed border with soft purple accent on hover
- Glass effect in iOS mode

**Charts & Stats:**

- Line: Purple gradient
- Bars: Purple → Pink → Orange gradient

### 4. Technical Implementation

- Use Tailwind + CSS Variables (preferred)
- Support `data-theme="light"`, `data-theme="dark"`, `data-theme="glass"`, `data-theme="oled"`
- Smooth theme transition (300ms)
- Respect system preference + manual switch

### 5. Strict Rules for Cline

- Always ask which mode the user wants if not specified.
- Light mode must be very easy on the eyes (prefer Light Warm).
- Dark mode should feel premium and deep.
- Glass / iOS 26 mode should have strong backdrop blur and translucency.
- Never make UI look cheap or childish.
- Maintain strong Purple identity across all modes.
- When generating new screens, make them feel like they belong to the existing app (form Thêm người trực, list Khu phố, Thống kê...).

Apply this Ultimate Design System with the highest possible quality and attention to every detail.
