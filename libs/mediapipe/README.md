# MediaPipe Tasks Vision self-hosted assets

Asset cho nhận diện bàn tay + tư thế của `tools/gesture-lab`
(`scripts/tools/gesture-lab/pipeline/landmark-detector.ts`), self-host để
không gọi CDN và để root service worker cache (cache-first `/libs/`).

| File | Nguồn | Version |
| ---- | ----- | ------- |
| `vision_bundle.mjs` | `node_modules/@mediapipe/tasks-vision/vision_bundle.mjs` | @mediapipe/tasks-vision **1.0.1** |
| `wasm/vision_wasm_internal.{js,wasm}` | `node_modules/@mediapipe/tasks-vision/wasm/` | 1.0.1 (SIMD) |
| `wasm/vision_wasm_nosimd_internal.{js,wasm}` | `node_modules/@mediapipe/tasks-vision/wasm/` | 1.0.1 (không SIMD) |
| `../../models/mediapipe/*.task` | storage.googleapis.com/mediapipe-models | xem README bên đó |

Ghi chú:

- **Version coupling**: `vision_bundle.mjs` và thư mục `wasm/` phải cùng
  version với package trong `package.json` (package chỉ dùng để lấy type +
  làm nguồn copy). Nâng cấp: copy lại cả 3 file trên + kiểm tra tên file mà
  `FilesetResolver.forVisionTasks` sinh ra (`vision_wasm_internal` /
  `vision_wasm_nosimd_internal`; variant `_module_` chỉ dùng khi
  `useModule = true`, không copy).
- Bundle nạp bằng dynamic `import()` với `@vite-ignore` (không đi qua Vite/
  obfuscator). Đường dẫn khai báo tại `scripts/tools/gesture-lab/config.ts`
  (`MEDIAPIPE_ASSETS`).
- License: Apache-2.0 (MediaPipe).
