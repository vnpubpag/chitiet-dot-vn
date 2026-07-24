# OpenCV.js self-hosted asset

Asset OpenCV.js cho **scan pipeline** của `office/pdf-to-docx` (TASK-012).
Self-host để chạy offline, không phụ thuộc CDN (đồng bộ chính sách với tesseract).

| File | Nguồn | Version |
| ---- | ----- | ------- |
| `opencv.js` | `node_modules/@techstark/opencv-js/dist/opencv.js` | `@techstark/opencv-js` **5.0.0-release.1** |

Ghi chú:

- **WASM nhúng sẵn** trong `opencv.js` (base64) → không có file `.wasm` riêng;
  chỉ cần 1 file này. Kích thước ~13MB → **lazy-load** (chỉ tải khi có trang scan).
- **Version coupling**: khi nâng cấp `@techstark/opencv-js` trong `package.json`,
  copy lại `dist/opencv.js` vào đây.
- **Trạng thái (TASK-012 M3)**: OpenCV được nạp qua `scan/opencv-loader.ts` như
  **accelerator tùy chọn**. Đường xử lý ảnh chính hiện là **pure-TS**
  (`scan/image-ops.ts`) — đã kiểm thử — nên feature vẫn chạy nếu OpenCV không
  init được. Xem giới hạn trong `.ai/tasks/TASK-012.md`.
