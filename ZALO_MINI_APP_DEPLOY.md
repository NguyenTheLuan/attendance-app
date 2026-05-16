# Zalo Mini App Deploy

## Cách 1: VS Code Extension (nhanh)

1. Build: `npm run build` (output: `dist/`)
2. Mở VS Code → tab **Zalo Mini App** → Đăng nhập → Deploy

## Cách 2: Build + Upload (Web Dashboard)

```bash
npm run zip:zma
# Output: scripts/zma-package/attendance-app-zma.zip
```

Upload lên https://mini.zalo.me → **Quản lý phiên bản** → **Tải lên**.

## Cấu trúc config

| File                      | Dùng cho                            | Ghi chú                                    |
| ------------------------- | ----------------------------------- | ------------------------------------------ |
| `app-config.json` (root)  | VS Code Extension                   | Format giống plugin output                 |
| `scripts/zma-config.json` | `npm run zip:zma` (source of truth) | Chứa `mpId`, `name`, `version`             |
| `www/app-config.json`     | Generated bởi `build-zma.mjs`       | Merge từ `zma-config.json` + plugin output |

## Lưu ý

- Extension dùng root `app-config.json`, không dùng `scripts/zma-config.json`.
- Script `build-zma.mjs` tự merge `list*` fields từ plugin output.
