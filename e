# Reusability Rules

Always reuse existing components before writing inline JSX. Check these first:

## Components to always reuse

| Component       | Path                           | Usage                                                                     |
| --------------- | ------------------------------ | ------------------------------------------------------------------------- |
| `Field`         | `src/components/Field`         | Label + input/textarea wrapper. Supports `row` prop for horizontal layout |
| `DateSelector`  | `src/components/DateSelector`  | Date picker with today/tomorrow/custom buttons                            |
| `ImageUploader` | `src/components/ImageUploader` | File picker with drag-and-drop + preview                                  |
| `ConfirmDialog` | `src/components/ConfirmDialog` | Confirmation modal with title + message + confirm/cancel                  |
| `Toast`         | `src/components/Toast`         | Inline toast notification (success/error)                                 |

## What NOT to do

- ❌ Do not write inline `<label className="field"><span>...</span><input .../></label>` — use `Field` instead
- ❌ Do not write inline file input with preview logic — use `ImageUploader` instead
- ❌ Do not write inline date picker buttons — use `DateSelector` instead
- ❌ Do not write inline confirm dialogs — use `ConfirmDialog` instead
- ❌ Do not write inline toast messages — use `Toast` instead

## Field component examples

```tsx
// Simple input (vertical layout - default)
<Field label="Tên người trực" type="text" value={name} onChange={...} />

// Input with row layout (label + input on same line)
<Field label="Tên người trực" row type="text" value={name} onChange={...} />

// Textarea
<Field as="textarea" label="Ghi chú" value={note} onChange={...} rows={3} />
```

---

## 📐 Code Splitting & DRY Rules

### 1. Chia code càng nhỏ càng tốt

Mỗi file/component chỉ nên làm **một việc duy nhất**. Nếu một file bắt đầu làm nhiều hơn một việc → tách ra.

```
❌ Bad:   Một component vừa hiển thị form, vừa xử lý logic upload, vừa quản lý toast
✅ Good:  FormComponent + useUploadLogic + Toast
```

**Quy tắc cụ thể:**
- Mỗi component không quá ~100 dòng JSX return
- Mỗi custom hook nên chỉ quản lý một loại state/logic
- Utility functions → tách vào `src/utils/`
- Các kiểu dữ liệu → tách vào `src/types/`
- Nếu một component có thể dùng lại được → tách thành component riêng ngay

### 2. Nếu code lặp > 3 lần → dùng map / filter / reduce

Khi render JSX mà thấy lặp lại một pattern > 3 lần, phải dùng vòng lặp:

```tsx
// ❌ Bad — lặp code > 3 lần
<NavLink to="/admin">✏️ Nhập điểm danh</NavLink>
<NavLink to="/view">👁️ Xem lịch trực</NavLink>
<NavLink to="/stats">📊 Thống kê</NavLink>
<button>🚪 Thoát</button>

// ✅ Good — dùng map
const links = [
  { to: "/admin", label: "✏️ Nhập điểm danh" },
  { to: "/view", label: "👁️ Xem lịch trực" },
  { to: "/stats", label: "📊 Thống kê" },
];
{links.map((link) => <NavLink key={link.to} to={link.to}>{link.label}</NavLink>)}
<button key="logout" onClick={onLogout}>🚪 Thoát</button>
```

**Áp dụng cho:**
- Nav links, tabs, buttons lặp
- Danh sách items, cards, grid cells
- Form fields, options, select choices

### 3. DOM tối thiểu

- Không render component nếu không cần → dùng conditional rendering sớm (`if` guard)
- Ưu tiên `map` + `filter` thay vì `forEach` + `push`
- Tránh `div` wrapper không cần thiết → dùng Fragment (`<>...</>`) khi có thể
- Nếu list dài > 50 items → cân nhắc virtual list

---

## File structure khuyến nghị

```
src/
  components/
    Navbar/
      index.tsx        # component chính
    Field/
      index.tsx
    ImageUploader/
      index.tsx
  hooks/
    useAuth.ts         # login/logout logic
    useRecords.ts      # fetch records
  utils/
    formatDate.ts
    exportCsv.ts
  types/
    index.ts           # AttendanceRecord, ...
```
