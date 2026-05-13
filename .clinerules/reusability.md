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
