# Tesseract self-hosted assets

Asset cho OCR của `office/pdf-to-docx` (`scripts/office/pdf-to-docx/ocr.ts`),
self-host để OCR chạy offline thay vì tải từ CDN jsdelivr.

| File | Nguồn | Version |
| ---- | ----- | ------- |
| `worker.min.js` | `node_modules/tesseract.js/dist/worker.min.js` | tesseract.js **7.0.0** |
| `core/tesseract-core-simd-lstm.wasm.js` | `node_modules/tesseract.js-core/` | tesseract.js-core **7.0.0** |
| `core/tesseract-core-relaxedsimd-lstm.wasm.js` | `node_modules/tesseract.js-core/` | tesseract.js-core **7.0.0** |
| `../../models/tessdata/{vie,eng}.traineddata.gz` | `https://cdn.jsdelivr.net/npm/@tesseract.js-data/{lang}/4.0.0_best_int/` | 4.0.0_best_int |

Ghi chú:

- **Version coupling**: `worker.min.js` và core phải cùng version với package
  `tesseract.js` trong `package.json`. Khi nâng cấp tesseract.js, copy lại
  worker + 2 file core từ node_modules.
- Chỉ cần 2 variant core `-lstm` vì `createWorker` dùng OEM mặc định
  (LSTM_ONLY); tesseract.js tự chọn simd/relaxedsimd theo trình duyệt.
- Thêm ngôn ngữ OCR mới: tải `<lang>.traineddata.gz` (bản `4.0.0_best_int`)
  vào `public/models/tessdata/` và sửa chuỗi lang trong `ocr.ts`.
