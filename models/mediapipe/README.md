# MediaPipe models (tools/gesture-lab)

| File | Nguồn | Kích thước |
| ---- | ----- | ---------- |
| `hand_landmarker.task` | https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task | 7.8 MB |
| `pose_landmarker_lite.task` | https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task | 5.8 MB |

- Nạp bởi `scripts/tools/gesture-lab/pipeline/landmark-detector.ts` qua
  `modelAssetPath` (đường dẫn trong `config.ts` `MEDIAPIPE_ASSETS`).
- Root service worker cache-first `/models/` có guard quota: lần đầu cần
  mạng, lần sau chạy offline.
- Đổi model (vd `pose_landmarker_full`) thì đổi tên file + đường dẫn trong
  config; các model phải tương thích runtime `@mediapipe/tasks-vision` đang
  self-host ở `/libs/mediapipe/`.
- License: Apache-2.0 (MediaPipe models).
