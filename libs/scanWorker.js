/**
 * scanWorker.js — Web Worker for OpenCV scan processing
 * Runs entirely off the main thread to prevent UI freezes.
 *
 * Protocol:
 *   Main → Worker:  { type: 'init' }
 *   Main → Worker:  { type: 'process', id, imageData, options, manualCorners }
 *   Main → Worker:  { type: 'detect', id, imageData, options }
 *   Worker → Main:  { type: 'ready' }
 *   Worker → Main:  { type: 'error', message }
 *   Worker → Main:  { type: 'result', id, imageData }
 *   Worker → Main:  { type: 'detectResult', id, corners, width, height }
 *   Worker → Main:  { type: 'processError', id, message }
 *   Worker → Main:  { type: 'detectError', id, message }
 */

/* global cv, self, importScripts, ImageData, Uint8ClampedArray */

/* ══════════════════════════════════════════
   OpenCV Init
   ══════════════════════════════════════════ */

function initOpenCV() {
    return new Promise(function (resolve, reject) {
        var timeout = setTimeout(function () {
            reject(new Error("OpenCV WASM init timeout (30s)"));
        }, 30000);

        try {
            importScripts("/libs/opencv.js");
        } catch (err) {
            clearTimeout(timeout);
            reject(new Error("importScripts failed: " + err.message));
            return;
        }

        // Poll for WASM initialization
        function poll() {
            if (typeof cv !== "undefined" && cv.Mat) {
                clearTimeout(timeout);
                resolve();
            } else if (
                typeof cv !== "undefined" &&
                typeof cv.then === "function"
            ) {
                // Some builds return a promise
                cv.then(function (instance) {
                    clearTimeout(timeout);
                    // eslint-disable-next-line no-global-assign
                    cv = instance;
                    resolve();
                }).catch(function (err) {
                    clearTimeout(timeout);
                    reject(err);
                });
            } else {
                setTimeout(poll, 50);
            }
        }
        poll();
    });
}

/* ══════════════════════════════════════════
   Scan Pipeline
   ══════════════════════════════════════════ */

function resizeNormalize(src, maxWidth) {
    var w = src.cols;
    var h = src.rows;
    if (w <= maxWidth) return src.clone();

    var scale = maxWidth / w;
    var dst = new cv.Mat();
    var dsize = new cv.Size(Math.round(w * scale), Math.round(h * scale));
    cv.resize(src, dst, dsize, 0, 0, cv.INTER_AREA);
    return dst;
}

function resizeForDetection(src, maxHeight) {
    var w = src.cols;
    var h = src.rows;
    if (h <= maxHeight) return src.clone();

    var scale = maxHeight / h;
    var dst = new cv.Mat();
    var dsize = new cv.Size(Math.round(w * scale), Math.round(h * scale));
    cv.resize(src, dst, dsize, 0, 0, cv.INTER_AREA);
    return dst;
}

function upscaleAfterWarp(src) {
    var shortEdge = Math.min(src.cols, src.rows);
    var longEdge = Math.max(src.cols, src.rows);
    var targetShortEdge = 2400;
    var maxLongEdge = 5200;

    if (shortEdge >= targetShortEdge) return src.clone();

    var scale = targetShortEdge / Math.max(1, shortEdge);
    if (longEdge * scale > maxLongEdge) {
        scale = maxLongEdge / Math.max(1, longEdge);
    }
    if (scale <= 1.01) return src.clone();

    var dst = new cv.Mat();
    var dsize = new cv.Size(
        Math.max(1, Math.round(src.cols * scale)),
        Math.max(1, Math.round(src.rows * scale)),
    );
    cv.resize(src, dst, dsize, 0, 0, cv.INTER_CUBIC);
    return dst;
}

/* ══════════════════════════════════════════
   Scan Filter — simple background-whitening
   Keeps text pixels untouched; only lightens
   the background toward paper-white.
   ══════════════════════════════════════════ */

/** Tunable defaults (exposed so they can be overridden later) */
var SCAN_FILTER_DILATION_SIZE = 3;     // base (min) dilation; scaled up with resolution in applyScanFilter
var SCAN_FILTER_MASK_SIGMA = 0;        // 0 = auto (2.5% of longest edge, min 18) — used to normalize gray before Otsu
var SCAN_FILTER_BG_NORMALIZE_SIGMA = 0; // 0 = auto — used to flatten lighting on output L channel
var SCAN_FILTER_BLEND_ALPHA = 1.0;     // 1.0 = background becomes exact PAPER_COLOR, matching padding perfectly
var SCAN_FILTER_SAT_PROTECT = 90;      // saturation > this = colored ink/stamp → protected as content (0 = off)

/* Ngưỡng tin cậy cho chiều xoay 90° (|lineHaloScore|). Đo trên bộ mẫu
   (scripts/scan-harness.mjs, label orient-baseline): mọi ca quyết định ĐÚNG
   đều ≥ 0.129 (8.jpg 0.223, 2-exif-6 0.161, 2-rot90 0.129); ca SAI duy nhất
   là 11.jpg 0.082. Đặt 0.11 nằm giữa 0.082 và 0.129.
   Dưới ngưỡng: vẫn xoay (chữ dọc không đọc được) nhưng đánh dấu
   rotationConfidence = "low" để UI cảnh báo. */
var SCAN_ROTATE_HALO_MIN = 0.11;

/* Biên độ chênh lệch (thang 0-255, không gian sáng+sắc độ) coi là "bám biên
   hoàn toàn" trong edgeSupportInfo. Thấp hơn bản cũ (40) vì điểm giờ đòi hỏi
   cả tính NHẤT QUÁN về dấu — nhiễu không còn cộng điểm nên không cần biên độ
   lớn để lọc nhiễu nữa. */
var EDGE_SUPPORT_NORM = 26;

/* Scan filter: "ink" = mô hình chia (D3, xem applyScanFilterInk) |
   "mask" = mô hình mask nhị phân cũ (applyScanFilterMask).
   So sánh A/B bằng `node scripts/scan-harness.mjs --filter-mode ink|mask`.

   MẶC ĐỊNH LÀ "ink": màu tự nhiên hơn, không cắt nét sâu làm mảnh chữ, không
   ngả vàng, và nhanh hơn 11-24× (filter 19-50s → 1.0-1.9s).

   Lần test tay đầu trên browser (2026-07-20) bản ink bị loại vì mất màu con
   dấu + chữ ký, nhưng đó là BUG chứ không phải giới hạn thuật toán:
   `MatVector.push_back` copy NÔNG nên việc tái dùng chung một Mat cho cả 3
   kênh làm R=G=B ở mọi pixel → ảnh trung tính hoàn toàn. Sau khi sửa (mỗi kênh
   một Mat riêng), đo lại giữ 94-127% pixel có màu, ngang mô hình mask (99-100%).
   Đổi mode thì phải chạy lại harness và XEM CHỈ SỐ "pixel có màu" — đừng chỉ
   nhìn ảnh thu nhỏ, chính cách nhìn đó đã để lọt bug này. */
var SCAN_FILTER_MODE = "ink";
/* Kernel close ước lượng nền, tính ở ảnh hạ mẫu 256px. 9px ở thang đó tương
   đương ~90px ở ảnh 2400px — đủ nuốt trọn dòng chữ và nét bút. */
var SCAN_INK_BG_KERNEL = 9;
/* Điểm trắng của mô hình ink: ink >= ngưỡng này coi như nền thuần.
   Không có nó, mọi vết nhạt hơn nền một chút đều được giữ trung thực — kể cả
   chữ hằn từ MẶT SAU tờ giấy (thấy rõ ở 9.jpg) mà mô hình mask cũ vô tình che
   được nhờ tô đè. Chuẩn hoá rồi cắt ngọn ở 1.0 thay vì để tràn lên 255, để nền
   ra ĐÚNG PAPER_COLOR — phải khớp màu pad A4 và nền trang PDF. */
var SCAN_INK_WHITE_POINT = 0.9;

/* Hook chẩn đoán: scripts/scan-harness.mjs gán hàm vào đây để xuất mask trung
   gian ra ảnh khi chỉnh thuật toán detect. Trên browser luôn null → không tốn
   gì. */
var DEBUG_MASK_SINK = null;

/** Unified paper tone — RGB (248, 246, 240) */
var PAPER_COLOR_R = 248;
var PAPER_COLOR_G = 246;
var PAPER_COLOR_B = 240;

/**
 * Lazily computed Lab values for PAPER_COLOR.
 * Filled once on first applyScanFilter call via _ensurePaperLab().
 */
var PAPER_LAB_L = 0;
var PAPER_LAB_A = 0;
var PAPER_LAB_B = 0;
var _paperLabReady = false;

function _ensurePaperLab() {
    if (_paperLabReady) return;
    // Build a 1×1 RGB mat, convert to Lab, read values
    var px = cv.matFromArray(1, 1, cv.CV_8UC3, [PAPER_COLOR_R, PAPER_COLOR_G, PAPER_COLOR_B]);
    var labPx = new cv.Mat();
    cv.cvtColor(px, labPx, cv.COLOR_RGB2Lab);
    PAPER_LAB_L = labPx.data[0];
    PAPER_LAB_A = labPx.data[1];
    PAPER_LAB_B = labPx.data[2];
    px.delete();
    labPx.delete();
    _paperLabReady = true;
}

/**
 * Scan filter pipeline — shadow-resistant mask + background-only processing.
 *
 * Mask path (shadow-resistant):
 *  1. RGBA → Gray
 *  2. Normalize gray to flatten shadows: normalizedGray = gray / blur(gray) * mean(blur)
 *  3. Otsu threshold on normalizedGray → textMask
 *  4. Dilate textMask → dilatedText; invert → bgMask
 *  NOTE: normalizedGray is ONLY used for mask — never for output.
 *
 * Output path (original quality):
 *  5a. Soft normalize L-channel on bgMask only
 *  5b. Blend background Lab toward PAPER_COLOR (unified paper tone)
 *  6.  Merge Lab → RGB; restore original text pixels; → RGBA
 *
 * @param {cv.Mat} src  RGBA input (from matFromImageData)
 * @returns {cv.Mat} RGBA output — caller must delete()
 */
/**
 * D3 — Scan filter theo mô hình "ink extraction" (divide model).
 *
 * Mô hình cũ (applyScanFilterMask) phân loại từng pixel thành chữ/nền bằng
 * mask nhị phân rồi TÔ nền bằng PAPER_COLOR. Ba điểm yếu cố hữu:
 *   - Vành nền quanh mỗi glyph nằm trong dilatedText nên được giữ NGUYÊN màu
 *     gốc → chữ có quầng bẩn khi giấy ngả vàng hoặc dính bóng đổ.
 *   - Pixel chữ giữ nguyên gốc, không bù sáng → cùng một dòng chữ nửa đậm
 *     nửa nhạt khi ảnh có bóng chéo.
 *   - Biên mask nhị phân không feather → răng cưa quanh vùng giữ gốc.
 *
 * Mô hình này thay bằng phép chia: ước lượng trường nền `bg` (màu giấy +
 * ánh sáng, đã loại chữ bằng morphological close ở độ phân giải thấp) rồi
 * tính `ink = src / bg`. Ở nền ink ≈ 1.0 bất kể giấy màu gì hay bóng đổ ra
 * sao; ở nét mực ink < 1.0 và giữ đúng biên anti-alias gốc. Ghép lại bằng
 * `out = PAPER_COLOR × ink` nên nền phẳng tuyệt đối, bóng đổ tự biến mất,
 * chữ trong vùng bóng được bù sáng — cả ba điểm yếu trên mất cùng lúc, không
 * cần mask cho nền nữa.
 *
 * Chia THEO TỪNG KÊNH nên mực màu tự giữ được sắc: con dấu đỏ trên giấy
 * trắng cho R/bgR ≈ 1 nhưng G/bgG và B/bgB < 1 → kết quả vẫn đỏ. Mask giờ
 * chỉ còn một nhiệm vụ: bảo vệ vùng bão hoà cao (con dấu đậm, ảnh in) khỏi
 * bị phép chia làm nhạt — và được feather nên hết răng cưa.
 */
function applyScanFilterInk(src) {
    var rgb = new cv.Mat();
    var small = new cv.Mat();
    var closed = new cv.Mat();
    var blurred = new cv.Mat();
    var bg = new cv.Mat();
    var srcChannels = new cv.MatVector();
    var bgChannels = new cv.MatVector();
    var outChannels = new cv.MatVector();
    var hsv = new cv.Mat();
    var hsvChannels = new cv.MatVector();
    var satChannel = null;
    var satMask = new cv.Mat();
    var alpha8 = new cv.Mat();
    var alpha32 = new cv.Mat();
    var invAlpha32 = new cv.Mat();
    /* Buffer 32F dùng lại cho cả 3 kênh — mỗi Mat CV_32F full-res đã ~32MB,
       cấp phát riêng cho từng bước sẽ vượt heap WASM (đo: bản 3 kênh
       CV_32FC3 cần ~95MB/Mat và OOM ngay ở ảnh 2400×3313). */
    var s32 = new cv.Mat();
    var b32 = new cv.Mat();
    var ink32 = new cv.Mat();
    var tmp32 = new cv.Mat();
    var result8 = new cv.Mat();
    var rgba = new cv.Mat();
    var closeKernel = null;
    var paper = [PAPER_COLOR_R, PAPER_COLOR_G, PAPER_COLOR_B];

    try {
        cv.cvtColor(src, rgb, cv.COLOR_RGBA2RGB);

        /* ── 1. Ước lượng trường nền ──
           Morphological close xoá các cấu trúc TỐI mảnh (chữ, nét bút) và giữ
           lại phần sáng = giấy + ánh sáng. Chạy ở độ phân giải thấp rồi phóng
           lại: close với kernel đủ lớn để nuốt chữ ở full-res (~90px) là một
           trong những phép đắt nhất của OpenCV, trong khi trường nền vốn rất
           mượt nên hạ mẫu không mất thông tin gì. */
        var scale = 256 / Math.max(rgb.cols, rgb.rows);
        cv.resize(
            rgb,
            small,
            new cv.Size(
                Math.max(8, Math.round(rgb.cols * scale)),
                Math.max(8, Math.round(rgb.rows * scale)),
            ),
            0,
            0,
            cv.INTER_AREA,
        );
        closeKernel = cv.getStructuringElement(
            cv.MORPH_ELLIPSE,
            new cv.Size(SCAN_INK_BG_KERNEL, SCAN_INK_BG_KERNEL),
        );
        cv.morphologyEx(small, closed, cv.MORPH_CLOSE, closeKernel);
        cv.GaussianBlur(closed, blurred, new cv.Size(0, 0), 3);
        cv.resize(
            blurred,
            bg,
            new cv.Size(rgb.cols, rgb.rows),
            0,
            0,
            cv.INTER_LINEAR,
        );

        /* ── 2. Mask bảo vệ vùng bão hoà màu, đã feather ──
           Phép chia làm nhạt những vùng màu ĐẬM chiếm diện tích lớn (con dấu
           đè lên nhau, ảnh in trong tài liệu) vì chính chúng kéo trường nền
           xuống. Trộn lại pixel gốc ở đó; feather để hết răng cưa mà mask nhị
           phân cứng của mô hình cũ để lại. */
        var protect = SCAN_FILTER_SAT_PROTECT > 0;
        if (protect) {
            cv.cvtColor(rgb, hsv, cv.COLOR_RGB2HSV);
            cv.split(hsv, hsvChannels);
            satChannel = hsvChannels.get(1);
            cv.threshold(
                satChannel,
                satMask,
                SCAN_FILTER_SAT_PROTECT,
                255,
                cv.THRESH_BINARY,
            );
            var featherSigma = Math.max(
                2,
                Math.round(Math.min(rgb.cols, rgb.rows) / 400),
            );
            cv.GaussianBlur(satMask, alpha8, new cv.Size(0, 0), featherSigma);
            alpha8.convertTo(alpha32, cv.CV_32F, 1 / 255, 0);
            /* invAlpha = 1 - alpha, viết bằng convertTo để khỏi cấp phát thêm
               một Mat hằng số 1.0 full-res */
            alpha32.convertTo(invAlpha32, -1, -1, 1);
        }

        /* ── 3. Theo TỪNG KÊNH: ink = src / bg, out = PAPER × ink ──
           Chia theo từng kênh nên mực màu tự giữ sắc: con dấu đỏ trên giấy
           trắng cho R/bgR ≈ 1 còn G,B < 1 → kết quả vẫn đỏ. */
        cv.split(rgb, srcChannels);
        cv.split(bg, bgChannels);

        for (var i = 0; i < 3; i++) {
            /* MatVector.get() cấp phát Mat MỚI mỗi lần gọi — không delete là
               rò rỉ heap WASM, tích luỹ qua nhiều ảnh sẽ OOM giữa lô. */
            var srcCh = srcChannels.get(i);
            var bgCh = bgChannels.get(i);
            srcCh.convertTo(s32, cv.CV_32F);
            bgCh.convertTo(b32, cv.CV_32F, 1, 1); // +1 epsilon
            srcCh.delete();
            bgCh.delete();
            cv.divide(s32, b32, ink32);
            /* Chuẩn hoá theo điểm trắng rồi cắt ngọn tại 1.0 */
            ink32.convertTo(ink32, -1, 1 / SCAN_INK_WHITE_POINT, 0);
            cv.threshold(ink32, ink32, 1, 0, cv.THRESH_TRUNC);
            ink32.convertTo(ink32, -1, paper[i], 0);

            if (protect) {
                cv.multiply(ink32, invAlpha32, tmp32);
                cv.multiply(s32, alpha32, ink32);
                cv.add(tmp32, ink32, ink32);
            }

            /* Mat MỚI cho mỗi kênh: MatVector.push_back của opencv.js copy
               NÔNG, nên tái dùng một Mat out8 chung sẽ khiến cả 3 kênh cùng trỏ
               vào một buffer → R=G=B ở mọi pixel → ảnh trung tính hoàn toàn,
               mất sạch màu con dấu/chữ ký. */
            var outCh = new cv.Mat();
            ink32.convertTo(outCh, cv.CV_8U); // convertTo tự bão hoà 0-255
            outChannels.push_back(outCh);
            outCh.delete();
        }

        cv.merge(outChannels, result8);
        cv.cvtColor(result8, rgba, cv.COLOR_RGB2RGBA);
        return rgba;
    } finally {
        rgb.delete();
        small.delete();
        closed.delete();
        blurred.delete();
        bg.delete();
        srcChannels.delete();
        bgChannels.delete();
        outChannels.delete();
        hsv.delete();
        hsvChannels.delete();
        if (satChannel) satChannel.delete();
        satMask.delete();
        alpha8.delete();
        alpha32.delete();
        invAlpha32.delete();
        s32.delete();
        b32.delete();
        ink32.delete();
        tmp32.delete();
        result8.delete();
        if (closeKernel) closeKernel.delete();
    }
}

function applyScanFilter(src) {
    if (SCAN_FILTER_MODE === "ink") return applyScanFilterInk(src);
    return applyScanFilterMask(src);
}

function applyScanFilterMask(src) {
    // -- Mask path variables --
    var gray = new cv.Mat();
    var maskBlur = new cv.Mat();
    var gray32 = new cv.Mat();
    var maskBlur32 = new cv.Mat();
    var normalizedGray = new cv.Mat();
    var textMask = new cv.Mat();
    var dilatedText = new cv.Mat();
    var bgMask = new cv.Mat();
    var hsvProtect = new cv.Mat();
    var hsvProtectChannels = new cv.MatVector();
    var satProtect = null;
    var satMask = new cv.Mat();
    /* Dilation theo độ phân giải: 3px cố định là quá mỏng sau upscale 2400px+
       → viền anti-alias của chữ rơi ra ngoài mask, bị tô màu giấy (chữ mỏng,
       gãy nét). Cap 7 để không giữ vành nền bẩn quá rộng quanh glyph. */
    var dilationSize = Math.max(
        SCAN_FILTER_DILATION_SIZE,
        Math.min(7, 2 * Math.round(Math.min(src.cols, src.rows) / 1600) + 1),
    );
    var dilateKernel = cv.getStructuringElement(
        cv.MORPH_ELLIPSE,
        new cv.Size(dilationSize, dilationSize),
    );
    // -- Output path variables --
    var rgb = new cv.Mat();
    var lab = new cv.Mat();
    var labChannels = new cv.MatVector();
    var l = null;
    var a = null;
    var b = null;
    var bgBlurL = new cv.Mat();
    var l32 = new cv.Mat();
    var bgBlur32 = new cv.Mat();
    var normalizedL = new cv.Mat();
    var paperL = null;
    var paperA = null;
    var paperB = null;
    var blendedL = new cv.Mat();
    var blendedA = new cv.Mat();
    var blendedB = new cv.Mat();
    var mergedChannels = new cv.MatVector();
    var mergedLab = new cv.Mat();
    var resultRgb = new cv.Mat();
    var rgba = new cv.Mat();

    try {
        /* ── MASK PATH ── */

        // Step 1 — Grayscale
        cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);

        // Step 2 — Normalize gray to remove shadows/gradients
        var maskSigma = SCAN_FILTER_MASK_SIGMA > 0
            ? SCAN_FILTER_MASK_SIGMA
            : Math.max(18, Math.round(Math.max(gray.cols, gray.rows) * 0.025));
        cv.GaussianBlur(gray, maskBlur, new cv.Size(0, 0), maskSigma);
        var maskMeanVal = cv.mean(maskBlur);
        var maskMean = Math.max(1, maskMeanVal[0]);
        gray.convertTo(gray32, cv.CV_32F);
        maskBlur.convertTo(maskBlur32, cv.CV_32F);
        maskBlur32.convertTo(maskBlur32, -1, 1, 1); // +1 epsilon
        cv.divide(gray32, maskBlur32, normalizedGray);
        normalizedGray.convertTo(normalizedGray, cv.CV_8U, maskMean, 0);

        // Step 3 — Otsu on shadow-free normalizedGray
        cv.threshold(
            normalizedGray,
            textMask,
            0,
            255,
            cv.THRESH_BINARY_INV + cv.THRESH_OTSU,
        );

        // Step 3.5 — Protect colored ink (stamps, highlights, colored pens):
        // Otsu only sees luminance, so pale-but-saturated pixels would be
        // classified as background and painted over. OR them into textMask.
        if (SCAN_FILTER_SAT_PROTECT > 0) {
            cv.cvtColor(src, rgb, cv.COLOR_RGBA2RGB);
            cv.cvtColor(rgb, hsvProtect, cv.COLOR_RGB2HSV);
            cv.split(hsvProtect, hsvProtectChannels);
            satProtect = hsvProtectChannels.get(1);
            cv.threshold(
                satProtect,
                satMask,
                SCAN_FILTER_SAT_PROTECT,
                255,
                cv.THRESH_BINARY,
            );
            cv.bitwise_or(textMask, satMask, textMask);
        }

        // Step 4 — Dilate text mask → bgMask
        cv.dilate(textMask, dilatedText, dilateKernel, new cv.Point(-1, -1), 1);
        cv.bitwise_not(dilatedText, bgMask);

        /* ── OUTPUT PATH (operates on original src, never on normalizedGray) ── */

        // Convert original to Lab
        cv.cvtColor(src, rgb, cv.COLOR_RGBA2RGB);
        cv.cvtColor(rgb, lab, cv.COLOR_RGB2Lab);
        cv.split(lab, labChannels);

        l = labChannels.get(0);
        a = labChannels.get(1);
        b = labChannels.get(2);

        // Step 5a — Soft normalize lighting on background L only.
        // With BLEND_ALPHA = 1.0 the background L is fully replaced by
        // PAPER_LAB_L in step 5b, so this (expensive full-res blur + divide)
        // would be dead work — only run it when some original L survives.
        if (SCAN_FILTER_BLEND_ALPHA < 1) {
            var bgSigma = SCAN_FILTER_BG_NORMALIZE_SIGMA > 0
                ? SCAN_FILTER_BG_NORMALIZE_SIGMA
                : Math.max(18, Math.round(Math.max(l.cols, l.rows) * 0.025));
            cv.GaussianBlur(l, bgBlurL, new cv.Size(0, 0), bgSigma);
            var bgMeanVal = cv.mean(bgBlurL, bgMask);
            var bgMean = Math.max(1, bgMeanVal[0]);
            l.convertTo(l32, cv.CV_32F);
            bgBlurL.convertTo(bgBlur32, cv.CV_32F);
            bgBlur32.convertTo(bgBlur32, -1, 1, 1);
            cv.divide(l32, bgBlur32, normalizedL);
            normalizedL.convertTo(normalizedL, cv.CV_8U, bgMean, 0);
            normalizedL.copyTo(l, bgMask);
        }

        // Step 5b — Blend background Lab toward PAPER_COLOR
        _ensurePaperLab();
        paperL = new cv.Mat(l.rows, l.cols, l.type(), new cv.Scalar(PAPER_LAB_L));
        paperA = new cv.Mat(a.rows, a.cols, a.type(), new cv.Scalar(PAPER_LAB_A));
        paperB = new cv.Mat(b.rows, b.cols, b.type(), new cv.Scalar(PAPER_LAB_B));

        cv.addWeighted(l, 1 - SCAN_FILTER_BLEND_ALPHA, paperL, SCAN_FILTER_BLEND_ALPHA, 0, blendedL);
        cv.addWeighted(a, 1 - SCAN_FILTER_BLEND_ALPHA, paperA, SCAN_FILTER_BLEND_ALPHA, 0, blendedA);
        cv.addWeighted(b, 1 - SCAN_FILTER_BLEND_ALPHA, paperB, SCAN_FILTER_BLEND_ALPHA, 0, blendedB);

        blendedL.copyTo(l, bgMask);
        blendedA.copyTo(a, bgMask);
        blendedB.copyTo(b, bgMask);

        // Step 6 — Merge Lab → RGB, restore text, output RGBA
        mergedChannels.push_back(l);
        mergedChannels.push_back(a);
        mergedChannels.push_back(b);
        cv.merge(mergedChannels, mergedLab);
        cv.cvtColor(mergedLab, resultRgb, cv.COLOR_Lab2RGB);

        // Restore original pixels where text lives
        var origRgb = new cv.Mat();
        cv.cvtColor(src, origRgb, cv.COLOR_RGBA2RGB);
        origRgb.copyTo(resultRgb, dilatedText);
        origRgb.delete();

        cv.cvtColor(resultRgb, rgba, cv.COLOR_RGB2RGBA);

        return rgba;
    } finally {
        // Mask path cleanup
        gray.delete();
        maskBlur.delete();
        gray32.delete();
        maskBlur32.delete();
        normalizedGray.delete();
        textMask.delete();
        dilatedText.delete();
        bgMask.delete();
        hsvProtect.delete();
        hsvProtectChannels.delete();
        if (satProtect) satProtect.delete();
        satMask.delete();
        dilateKernel.delete();
        // Output path cleanup
        rgb.delete();
        lab.delete();
        labChannels.delete();
        if (l) l.delete();
        if (a) a.delete();
        if (b) b.delete();
        bgBlurL.delete();
        l32.delete();
        bgBlur32.delete();
        normalizedL.delete();
        if (paperL) paperL.delete();
        if (paperA) paperA.delete();
        if (paperB) paperB.delete();
        blendedL.delete();
        blendedA.delete();
        blendedB.delete();
        mergedChannels.delete();
        mergedLab.delete();
        resultRgb.delete();
        // rgba is returned — caller deletes it
    }
}

/* ══════════════════════════════════════════
   Document Detection + Perspective Correction
   ══════════════════════════════════════════ */

var DEBUG_SCAN =
    typeof self !== "undefined" &&
    self.location &&
    /^(localhost|127\.0\.0\.1)$/.test(self.location.hostname || "");

function debugLog() {
    if (!DEBUG_SCAN || typeof console === "undefined") return;
    console.debug.apply(console, arguments);
}

function dist(a, b) {
    var dx = a.x - b.x;
    var dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
}

function clampPoint(value, limit) {
    return Math.max(0, Math.min(limit - 1, Math.round(value)));
}

function orderPoints(pts) {
    var sorted = pts.slice().sort(function (a, b) {
        if (a.y === b.y) return a.x - b.x;
        return a.y - b.y;
    });
    var top = sorted.slice(0, 2).sort(function (a, b) {
        return a.x - b.x;
    });
    var bottom = sorted.slice(2, 4).sort(function (a, b) {
        return a.x - b.x;
    });

    return [top[0], top[1], bottom[1], bottom[0]];
}

function polygonArea(points) {
    var area = 0;
    for (var i = 0; i < points.length; i++) {
        var next = points[(i + 1) % points.length];
        area += points[i].x * next.y - next.x * points[i].y;
    }
    return Math.abs(area) * 0.5;
}

function getPointBounds(points) {
    var minX = Infinity;
    var minY = Infinity;
    var maxX = -Infinity;
    var maxY = -Infinity;

    for (var i = 0; i < points.length; i++) {
        minX = Math.min(minX, points[i].x);
        minY = Math.min(minY, points[i].y);
        maxX = Math.max(maxX, points[i].x);
        maxY = Math.max(maxY, points[i].y);
    }

    return {
        x: minX,
        y: minY,
        width: maxX - minX,
        height: maxY - minY,
    };
}

function centroidOfPoints(points) {
    var x = 0;
    var y = 0;
    for (var i = 0; i < points.length; i++) {
        x += points[i].x;
        y += points[i].y;
    }
    return { x: x / points.length, y: y / points.length };
}

function rectContainsPoint(rect, point) {
    return (
        point.x >= rect.x &&
        point.x <= rect.x + rect.width &&
        point.y >= rect.y &&
        point.y <= rect.y + rect.height
    );
}

function buildPointArrayFromApprox(approx, offsetX, offsetY) {
    var points = [];
    for (var i = 0; i < approx.rows; i++) {
        points.push({
            x: approx.data32S[i * 2] + offsetX,
            y: approx.data32S[i * 2 + 1] + offsetY,
        });
    }
    return points;
}

function extractExtremeQuad(points) {
    if (!points.length) return null;

    var topLeft = points[0];
    var topRight = points[0];
    var bottomRight = points[0];
    var bottomLeft = points[0];

    for (var i = 0; i < points.length; i++) {
        var point = points[i];
        var sum = point.x + point.y;
        var diff = point.x - point.y;
        var topLeftSum = topLeft.x + topLeft.y;
        var bottomRightSum = bottomRight.x + bottomRight.y;
        var topRightDiff = topRight.x - topRight.y;
        var bottomLeftDiff = bottomLeft.x - bottomLeft.y;

        if (sum < topLeftSum) topLeft = point;
        if (sum > bottomRightSum) bottomRight = point;
        if (diff > topRightDiff) topRight = point;
        if (diff < bottomLeftDiff) bottomLeft = point;
    }

    var uniqueKeys = {};
    var ordered = [topLeft, topRight, bottomRight, bottomLeft];
    for (var j = 0; j < ordered.length; j++) {
        var key = ordered[j].x + ":" + ordered[j].y;
        if (uniqueKeys[key]) return null;
        uniqueKeys[key] = true;
    }

    return ordered;
}

function extractQuadrantQuad(points) {
    if (!points.length) return null;

    var center = centroidOfPoints(points);
    var buckets = {
        tl: null,
        tr: null,
        br: null,
        bl: null,
    };

    for (var i = 0; i < points.length; i++) {
        var point = points[i];
        var key;
        var dx = point.x - center.x;
        var dy = point.y - center.y;
        var distance = dx * dx + dy * dy;

        if (dx <= 0 && dy <= 0) key = "tl";
        else if (dx >= 0 && dy <= 0) key = "tr";
        else if (dx >= 0 && dy >= 0) key = "br";
        else key = "bl";

        if (!buckets[key] || distance > buckets[key].distance) {
            buckets[key] = { point: point, distance: distance };
        }
    }

    if (!(buckets.tl && buckets.tr && buckets.br && buckets.bl)) return null;

    return [
        buckets.tl.point,
        buckets.tr.point,
        buckets.br.point,
        buckets.bl.point,
    ];
}

function expandQuad(points, amount, maxCols, maxRows) {
    var center = centroidOfPoints(points);
    return points.map(function (point) {
        var dx = point.x - center.x;
        var dy = point.y - center.y;
        return {
            x: Math.max(0, Math.min(maxCols - 1, point.x + dx * amount)),
            y: Math.max(0, Math.min(maxRows - 1, point.y + dy * amount)),
        };
    });
}

function fitVerticalBoundary(points) {
    if (!points || points.length < 2) return null;

    var sumY = 0;
    var sumX = 0;
    var sumYY = 0;
    var sumYX = 0;
    var minY = Infinity;
    var maxY = -Infinity;

    for (var i = 0; i < points.length; i++) {
        var point = points[i];
        sumY += point.y;
        sumX += point.x;
        sumYY += point.y * point.y;
        sumYX += point.y * point.x;
        minY = Math.min(minY, point.y);
        maxY = Math.max(maxY, point.y);
    }

    var count = points.length;
    var denom = count * sumYY - sumY * sumY;
    var slope = Math.abs(denom) < 1e-5 ? 0 : (count * sumYX - sumY * sumX) / denom;
    var intercept = (sumX - slope * sumY) / count;

    return {
        x1: slope * minY + intercept,
        y1: minY,
        x2: slope * maxY + intercept,
        y2: maxY,
    };
}

function fitHorizontalBoundary(points) {
    if (!points || points.length < 2) return null;

    var sumX = 0;
    var sumY = 0;
    var sumXX = 0;
    var sumXY = 0;
    var minX = Infinity;
    var maxX = -Infinity;

    for (var i = 0; i < points.length; i++) {
        var point = points[i];
        sumX += point.x;
        sumY += point.y;
        sumXX += point.x * point.x;
        sumXY += point.x * point.y;
        minX = Math.min(minX, point.x);
        maxX = Math.max(maxX, point.x);
    }

    var count = points.length;
    var denom = count * sumXX - sumX * sumX;
    var slope = Math.abs(denom) < 1e-5 ? 0 : (count * sumXY - sumX * sumY) / denom;
    var intercept = (sumY - slope * sumX) / count;

    return {
        x1: minX,
        y1: slope * minX + intercept,
        x2: maxX,
        y2: slope * maxX + intercept,
    };
}

function buildBoundaryQuad(points, imageCols, imageRows) {
    if (!points || points.length < 8) return null;

    var bounds = getPointBounds(points);
    var leftLimit = bounds.x + bounds.width * 0.18;
    var rightLimit = bounds.x + bounds.width * 0.82;
    var topLimit = bounds.y + bounds.height * 0.18;
    var bottomLimit = bounds.y + bounds.height * 0.85;
    var leftPoints = [];
    var rightPoints = [];
    var topPoints = [];
    var bottomPoints = [];

    for (var i = 0; i < points.length; i++) {
        var point = points[i];
        if (point.x <= leftLimit) leftPoints.push(point);
        if (point.x >= rightLimit) rightPoints.push(point);
        if (point.y <= topLimit) topPoints.push(point);
        if (point.y >= bottomLimit) bottomPoints.push(point);
    }

    var leftLine = fitVerticalBoundary(leftPoints);
    var rightLine = fitVerticalBoundary(rightPoints);
    var topLine = fitHorizontalBoundary(topPoints);

    if (!(leftLine && rightLine && topLine)) return null;

    var bottomLine = null;
    var topLeft = computeLineIntersection(topLine, leftLine);
    var topRight = computeLineIntersection(topLine, rightLine);
    var bottomLeft = null;
    var bottomRight = null;

    if (
        bottomPoints.length >= 4 &&
        bounds.y + bounds.height < imageRows * 0.98
    ) {
        bottomLine = fitHorizontalBoundary(bottomPoints);
    }

    if (bottomLine) {
        bottomLeft = computeLineIntersection(bottomLine, leftLine);
        bottomRight = computeLineIntersection(bottomLine, rightLine);
    } else {
        var targetY = Math.min(imageRows - 1, bounds.y + bounds.height);
        bottomLeft = {
            x: leftLine.x1 + ((targetY - leftLine.y1) * (leftLine.x2 - leftLine.x1)) / Math.max(1e-5, leftLine.y2 - leftLine.y1),
            y: targetY,
        };
        bottomRight = {
            x: rightLine.x1 + ((targetY - rightLine.y1) * (rightLine.x2 - rightLine.x1)) / Math.max(1e-5, rightLine.y2 - rightLine.y1),
            y: targetY,
        };
    }

    var quad = [topLeft, topRight, bottomRight, bottomLeft];
    if (
        quad.some(function (point) {
            return (
                !point ||
                !isFinite(point.x) ||
                !isFinite(point.y) ||
                point.x < -imageCols * 0.2 ||
                point.x > imageCols * 1.2 ||
                point.y < -imageRows * 0.2 ||
                point.y > imageRows * 1.2
            );
        })
    ) {
        return null;
    }

    return orderPoints(quad);
}

function pointInRect(point, rect) {
    return (
        point.x >= rect.x &&
        point.x < rect.x + rect.width &&
        point.y >= rect.y &&
        point.y < rect.y + rect.height
    );
}

/* ══════════════════════════════════════════
   Edge support — quad phải bám biên thật
   ══════════════════════════════════════════ */

/**
 * Gray + RGBA của ảnh detect, set bởi detectDocument trước khi chấm điểm và
 * xoá ngay sau. evaluateQuadCandidate nhận điểm ở nhiều hệ toạ độ
 * (detect / full-res) nên khi lấy mẫu phải quy về toạ độ tương đối.
 */
var EDGE_GRAY_MAT = null;
var DETECT_RGBA_MAT = null;

/**
 * Độ "bám biên" của 4 cạnh quad: trả {mean, min, edges} trong [0..1].
 * Đo bằng BƯỚC NHẢY độ sáng giữa 2 phía của biên (giấy sáng vs nền) —
 * không dùng gradient thô vì đường chéo cắt qua vùng chữ cũng đầy gradient.
 * Đường kẻ bảng/dòng chữ bên trong giấy có 2 phía đều trắng → step ~0 ✓.
 */
function edgeSupportInfo(orderedPoints, imageCols, imageRows) {
    if (!EDGE_GRAY_MAT) return { mean: 1, min: 1, edges: [1, 1, 1, 1] };

    var gray = EDGE_GRAY_MAT;
    var rgba =
        DETECT_RGBA_MAT &&
        DETECT_RGBA_MAT.cols === gray.cols &&
        DETECT_RGBA_MAT.rows === gray.rows
            ? DETECT_RGBA_MAT
            : null;
    var scaleX = gray.cols / Math.max(1, imageCols);
    var scaleY = gray.rows / Math.max(1, imageRows);
    var SAMPLES_PER_EDGE = 24;
    var OFFSET = 4; // px ở thang detect, mỗi phía của biên
    var meanSum = 0;
    var minEdge = 1;
    var edgeMeans = [];
    var deltas = new Float64Array(SAMPLES_PER_EDGE * 3);
    var inner = [0, 0, 0];
    var outer = [0, 0, 0];

    /* Không gian đối lập: sáng + 2 trục sắc độ. Dùng màu chứ không chỉ gray
       vì biên giấy vàng / giấy màu trên nền xám có bước nhảy SẮC ĐỘ mạnh
       trong khi bước nhảy độ sáng gần bằng 0 (13.jpg — note vàng trên đá). */
    function sampleAt(x, y, out) {
        if (x < 0) x = 0;
        else if (x >= gray.cols) x = gray.cols - 1;
        if (y < 0) y = 0;
        else if (y >= gray.rows) y = gray.rows - 1;
        if (rgba) {
            var px = rgba.ucharPtr(y, x);
            out[0] = (px[0] + px[1] + px[2]) / 3;
            out[1] = px[0] - px[1];
            out[2] = (px[0] + px[1]) / 2 - px[2];
        } else {
            out[0] = gray.ucharPtr(y, x)[0];
            out[1] = 0;
            out[2] = 0;
        }
    }

    for (var e = 0; e < 4; e++) {
        var a = orderedPoints[e];
        var b = orderedPoints[(e + 1) % 4];
        var dxEdge = (b.x - a.x) * scaleX;
        var dyEdge = (b.y - a.y) * scaleY;
        var length = Math.sqrt(dxEdge * dxEdge + dyEdge * dyEdge) || 1;
        var normalX = -dyEdge / length;
        var normalY = dxEdge / length;
        var sumX = 0;
        var sumY = 0;
        var sumZ = 0;

        for (var s = 0; s < SAMPLES_PER_EDGE; s++) {
            var t = (s + 0.5) / SAMPLES_PER_EDGE;
            var x = (a.x + (b.x - a.x) * t) * scaleX;
            var y = (a.y + (b.y - a.y) * t) * scaleY;

            /* bước nhảy MẠNH NHẤT trong dải lệch ±2px quanh biên (dung sai
               toạ độ) — giữ nguyên DẤU, không lấy trị tuyệt đối */
            var bestMag = -1;
            var bx = 0;
            var by = 0;
            var bz = 0;
            for (var shift = -2; shift <= 2; shift += 2) {
                var cx = x + normalX * shift;
                var cy = y + normalY * shift;
                sampleAt(
                    Math.round(cx - normalX * OFFSET),
                    Math.round(cy - normalY * OFFSET),
                    inner,
                );
                sampleAt(
                    Math.round(cx + normalX * OFFSET),
                    Math.round(cy + normalY * OFFSET),
                    outer,
                );
                var d0 = inner[0] - outer[0];
                var d1 = inner[1] - outer[1];
                var d2 = inner[2] - outer[2];
                var mag = Math.sqrt(d0 * d0 + d1 * d1 + d2 * d2);
                if (mag > bestMag) {
                    bestMag = mag;
                    bx = d0;
                    by = d1;
                    bz = d2;
                }
            }
            deltas[s * 3] = bx;
            deltas[s * 3 + 1] = by;
            deltas[s * 3 + 2] = bz;
            sumX += bx;
            sumY += by;
            sumZ += bz;
        }

        /* Điểm cạnh = trung bình các mẫu CHIẾU lên hướng chênh lệch trung
           bình của cạnh. Trị tuyệt đối lấy SAU khi trung bình (không phải
           từng mẫu) nên cạnh chỉ ăn điểm khi bước nhảy VỪA đủ mạnh VỪA cùng
           chiều suốt cạnh: biên giấy thật (trong luôn sáng hơn/vàng hơn
           ngoài) cộng dồn, còn vân đá marble / nhiễu có dấu ngẫu nhiên thì
           triệt tiêu về ~0. Đây là điểm phân biệt then chốt trên nền sáng
           đồng màu, nơi biên độ tuyệt đối của giấy và của vân đá xấp xỉ nhau. */
        var norm = Math.sqrt(sumX * sumX + sumY * sumY + sumZ * sumZ);
        var edgeMean = 0;
        if (norm > 1e-6) {
            var ux = sumX / norm;
            var uy = sumY / norm;
            var uz = sumZ / norm;
            var proj = 0;
            for (s = 0; s < SAMPLES_PER_EDGE; s++) {
                var p =
                    deltas[s * 3] * ux +
                    deltas[s * 3 + 1] * uy +
                    deltas[s * 3 + 2] * uz;
                proj += Math.max(-1, Math.min(1, p / EDGE_SUPPORT_NORM));
            }
            edgeMean = Math.max(0, proj / SAMPLES_PER_EDGE);
        }

        meanSum += edgeMean;
        if (edgeMean < minEdge) minEdge = edgeMean;
        edgeMeans.push(edgeMean);
    }

    return { mean: meanSum / 4, min: minEdge, edges: edgeMeans };
}

/**
 * Tỉ lệ điểm lấy mẫu bên trong quad "giống giấy" (sáng + bão hoà thấp).
 * Quad bao trùm nền gỗ/vải màu sẽ có tỉ lệ thấp. Tài liệu có ảnh/hình in
 * vẫn đạt ~0.55+ vì phần lớn diện tích là giấy.
 */
function interiorPaperFraction(orderedPoints, imageCols, imageRows) {
    if (!DETECT_RGBA_MAT) return 1;

    var mat = DETECT_RGBA_MAT;
    var scaleX = mat.cols / Math.max(1, imageCols);
    var scaleY = mat.rows / Math.max(1, imageRows);
    var GRID = 10;
    var paperLike = 0;
    var total = 0;
    var tl = orderedPoints[0];
    var tr = orderedPoints[1];
    var br = orderedPoints[2];
    var bl = orderedPoints[3];

    for (var iu = 0; iu < GRID; iu++) {
        for (var iv = 0; iv < GRID; iv++) {
            var u = 0.08 + (0.84 * iu) / (GRID - 1);
            var v = 0.08 + (0.84 * iv) / (GRID - 1);
            var topX = tl.x + (tr.x - tl.x) * u;
            var topY = tl.y + (tr.y - tl.y) * u;
            var bottomX = bl.x + (br.x - bl.x) * u;
            var bottomY = bl.y + (br.y - bl.y) * u;
            var x = Math.round((topX + (bottomX - topX) * v) * scaleX);
            var y = Math.round((topY + (bottomY - topY) * v) * scaleY);
            if (x < 0 || x >= mat.cols || y < 0 || y >= mat.rows) continue;

            var px = mat.ucharPtr(y, x);
            var maxC = Math.max(px[0], px[1], px[2]);
            var minC = Math.min(px[0], px[1], px[2]);
            var saturation = maxC > 0 ? (maxC - minC) / maxC : 0;
            total++;
            if (maxC > 105 && saturation < 0.32) paperLike++;
        }
    }

    return total > 0 ? paperLike / total : 0;
}

/* ══════════════════════════════════════════
   D1a — Refine biên ở full-res
   Detect chạy ở ảnh ~500px → góc scale lên full-res sai nhiều px.
   Với mỗi cạnh: lấy mẫu điểm dọc cạnh thô, quét theo pháp tuyến tìm
   gradient mạnh GẦN vị trí thô nhất (không lấy max toàn cục — tránh khoá
   vào cạnh tờ giấy lót phía sau), fit đường thẳng (TLS + loại outlier),
   giao 4 đường → 4 góc chính xác.
   ══════════════════════════════════════════ */

function refineQuadFullRes(src, quad) {
    if (!quad || quad.length !== 4) return quad;

    var gray = new cv.Mat();
    try {
        cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);
        var ordered = orderPoints(quad);
        /* Bán kính hẹp: đủ bù sai số scale 500px + expandQuad, nhưng không
           với sang biên tờ giấy lót nằm lệch phía sau (~50-80px) */
        var radius = Math.max(
            10,
            Math.min(60, Math.round(Math.min(src.cols, src.rows) * 0.02)),
        );

        var lines = [];
        for (var e = 0; e < 4; e++) {
            var a = ordered[e];
            var b = ordered[(e + 1) % 4];
            lines.push(
                refineEdgeLine(gray, a, b, radius) || {
                    x1: a.x,
                    y1: a.y,
                    x2: b.x,
                    y2: b.y,
                },
            );
        }

        var refined = [];
        for (var c = 0; c < 4; c++) {
            /* Góc c = giao của cạnh (c-1) và cạnh c */
            var point = computeLineIntersection(lines[(c + 3) % 4], lines[c]);
            var original = ordered[c];
            if (
                !point ||
                !isFinite(point.x) ||
                !isFinite(point.y) ||
                dist(point, original) > radius * 1.2
            ) {
                point = original;
            }
            refined.push({
                x: Math.max(0, Math.min(src.cols - 1, point.x)),
                y: Math.max(0, Math.min(src.rows - 1, point.y)),
            });
        }

        return orderPoints(refined);
    } catch (err) {
        debugLog("refineQuadFullRes failed:", err);
        return quad;
    } finally {
        gray.delete();
    }
}

function refineEdgeLine(gray, pointA, pointB, radius) {
    var dx = pointB.x - pointA.x;
    var dy = pointB.y - pointA.y;
    var length = Math.sqrt(dx * dx + dy * dy);
    if (length < 60) return null;

    var normalX = -dy / length;
    var normalY = dx / length;
    var SAMPLES = 28;
    var found = [];

    for (var s = 0; s < SAMPLES; s++) {
        var t = 0.08 + (0.84 * s) / (SAMPLES - 1);
        var hit = findEdgeAlongNormal(
            gray,
            pointA.x + dx * t,
            pointA.y + dy * t,
            normalX,
            normalY,
            radius,
        );
        if (hit) found.push(hit);
    }
    if (found.length < SAMPLES * 0.45) return null;

    var fit = fitLineTLS(found);
    if (!fit) return null;

    /* Loại outlier 1 vòng theo khoảng cách vuông góc rồi fit lại */
    var residuals = found.map(function (p) {
        return Math.abs(
            (p.x - fit.cx) * fit.normalX + (p.y - fit.cy) * fit.normalY,
        );
    });
    var sorted = residuals.slice().sort(function (a, b) {
        return a - b;
    });
    var median = sorted[sorted.length >> 1];
    var limit = Math.max(2.5, median * 2.5);
    var kept = [];
    for (var i = 0; i < found.length; i++) {
        if (residuals[i] <= limit) kept.push(found[i]);
    }
    if (kept.length < SAMPLES * 0.4) return null;

    fit = fitLineTLS(kept);
    if (!fit) return null;

    /* Guard: đường fit xoay quá 3° so với cạnh thô = dấu hiệu trộn mẫu từ
       2 biên khác nhau (tờ trên + tờ lót) → bỏ, giữ cạnh thô */
    var coarseAngle = Math.atan2(dy, dx);
    var fitAngle = Math.atan2(fit.dirY, fit.dirX);
    var angleDelta = Math.abs(fitAngle - coarseAngle);
    if (angleDelta > Math.PI / 2) angleDelta = Math.abs(angleDelta - Math.PI);
    if (angleDelta > (3 * Math.PI) / 180) return null;

    return {
        x1: fit.cx - fit.dirX * 1000,
        y1: fit.cy - fit.dirY * 1000,
        x2: fit.cx + fit.dirX * 1000,
        y2: fit.cy + fit.dirY * 1000,
    };
}

/**
 * Quét gray dọc pháp tuyến quanh (px,py), trả điểm gradient mạnh nhất có
 * ưu tiên khoảng cách gần vị trí thô (score = |grad| / (1 + 0.05|k|)).
 */
function findEdgeAlongNormal(gray, px, py, normalX, normalY, radius) {
    var cols = gray.cols;
    var rows = gray.rows;
    var values = new Array(2 * radius + 1);

    for (var k = -radius; k <= radius; k++) {
        var x = Math.round(px + normalX * k);
        var y = Math.round(py + normalY * k);
        if (x < 0) x = 0;
        else if (x >= cols) x = cols - 1;
        if (y < 0) y = 0;
        else if (y >= rows) y = rows - 1;
        values[k + radius] = gray.ucharPtr(y, x)[0];
    }

    var bestOffset = null;
    var bestScore = 0;
    for (var i = 3; i < values.length - 3; i++) {
        var delta =
            values[i + 1] +
            values[i + 2] +
            values[i + 3] -
            (values[i - 1] + values[i - 2] + values[i - 3]);
        var magnitude = Math.abs(delta) / 3;
        if (magnitude < 10) continue;

        var offset = i - radius;
        /* Ưu tiên mạnh biên gần vị trí thô — biên tờ giấy khác nằm xa hơn
           phải mạnh vượt trội mới thắng được */
        var score = magnitude / (1 + 0.1 * Math.abs(offset));
        if (score > bestScore) {
            bestScore = score;
            bestOffset = offset;
        }
    }

    if (bestOffset === null) return null;
    return { x: px + normalX * bestOffset, y: py + normalY * bestOffset };
}

/** Fit đường thẳng total-least-squares (trục chính PCA) */
function fitLineTLS(points) {
    var n = points.length;
    if (n < 2) return null;

    var cx = 0;
    var cy = 0;
    for (var i = 0; i < n; i++) {
        cx += points[i].x;
        cy += points[i].y;
    }
    cx /= n;
    cy /= n;

    var sxx = 0;
    var sxy = 0;
    var syy = 0;
    for (i = 0; i < n; i++) {
        var ex = points[i].x - cx;
        var ey = points[i].y - cy;
        sxx += ex * ex;
        sxy += ex * ey;
        syy += ey * ey;
    }

    var theta = 0.5 * Math.atan2(2 * sxy, sxx - syy);
    var dirX = Math.cos(theta);
    var dirY = Math.sin(theta);

    return {
        cx: cx,
        cy: cy,
        dirX: dirX,
        dirY: dirY,
        normalX: -dirY,
        normalY: dirX,
    };
}

function scalePointsToSource(points, scaleX, scaleY, srcCols, srcRows) {
    return points.map(function (point) {
        return {
            x: clampPoint(point.x * scaleX, srcCols),
            y: clampPoint(point.y * scaleY, srcRows),
        };
    });
}

function scoreScaledQuad(points, area, scaleX, scaleY, srcCols, srcRows, detectCols, detectRows, focusRect, assumeCenteredDocument) {
    return evaluateQuadCandidate(
        scalePointsToSource(points, scaleX, scaleY, srcCols, srcRows),
        area * scaleX * scaleY,
        srcCols,
        srcRows,
        focusRect
            ? {
                  x: focusRect.x * scaleX,
                  y: focusRect.y * scaleY,
                  width: focusRect.width * scaleX,
                  height: focusRect.height * scaleY,
              }
            : null,
        assumeCenteredDocument,
    );
}

function computeLineIntersection(lineA, lineB) {
    var x1 = lineA.x1;
    var y1 = lineA.y1;
    var x2 = lineA.x2;
    var y2 = lineA.y2;
    var x3 = lineB.x1;
    var y3 = lineB.y1;
    var x4 = lineB.x2;
    var y4 = lineB.y2;
    var denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);

    if (Math.abs(denom) < 1e-5) return null;

    return {
        x:
            ((x1 * y2 - y1 * x2) * (x3 - x4) -
                (x1 - x2) * (x3 * y4 - y3 * x4)) /
            denom,
        y:
            ((x1 * y2 - y1 * x2) * (y3 - y4) -
                (y1 - y2) * (x3 * y4 - y3 * x4)) /
            denom,
    };
}

function findQuadFromLines(
    gray,
    scaleX,
    scaleY,
    srcCols,
    srcRows,
    focusRect,
    assumeCenteredDocument,
    offsetX,
    offsetY,
) {
    var edges = new cv.Mat();
    var lines = new cv.Mat();
    var kernel = cv.getStructuringElement(cv.MORPH_RECT, new cv.Size(3, 3));

    try {
        cv.Canny(gray, edges, 40, 120);
        cv.dilate(edges, edges, kernel);
        cv.HoughLinesP(
            edges,
            lines,
            1,
            Math.PI / 180,
            60,
            Math.round(Math.min(gray.cols, gray.rows) * 0.25),
            20,
        );

        if (!lines.rows) return { points: null, score: 0 };

        var topLine = null;
        var bottomLine = null;
        var leftLine = null;
        var rightLine = null;
        var topScore = 0;
        var bottomScore = 0;
        var leftScore = 0;
        var rightScore = 0;

        for (var i = 0; i < lines.rows; i++) {
            var x1 = lines.data32S[i * 4];
            var y1 = lines.data32S[i * 4 + 1];
            var x2 = lines.data32S[i * 4 + 2];
            var y2 = lines.data32S[i * 4 + 3];
            var dx = x2 - x1;
            var dy = y2 - y1;
            var length = Math.sqrt(dx * dx + dy * dy);
            var angle = Math.abs((Math.atan2(dy, dx) * 180) / Math.PI);
            var midX = (x1 + x2) * 0.5;
            var midY = (y1 + y2) * 0.5;
            var line = { x1: x1, y1: y1, x2: x2, y2: y2 };

            if (angle < 30 || angle > 150) {
                var candidateTopScore = length * (1.25 - midY / gray.rows);
                var candidateBottomScore = length * (0.25 + midY / gray.rows);
                if (midY < gray.rows * 0.55 && candidateTopScore > topScore) {
                    topScore = candidateTopScore;
                    topLine = line;
                }
                if (
                    midY > gray.rows * 0.45 &&
                    candidateBottomScore > bottomScore
                ) {
                    bottomScore = candidateBottomScore;
                    bottomLine = line;
                }
            } else if (angle > 60 && angle < 120) {
                var candidateLeftScore = length * (1.25 - midX / gray.cols);
                var candidateRightScore = length * (0.25 + midX / gray.cols);
                if (midX < gray.cols * 0.55 && candidateLeftScore > leftScore) {
                    leftScore = candidateLeftScore;
                    leftLine = line;
                }
                if (
                    midX > gray.cols * 0.45 &&
                    candidateRightScore > rightScore
                ) {
                    rightScore = candidateRightScore;
                    rightLine = line;
                }
            }
        }

        if (!(topLine && bottomLine && leftLine && rightLine)) {
            return { points: null, score: 0 };
        }

        var intersections = [
            computeLineIntersection(topLine, leftLine),
            computeLineIntersection(topLine, rightLine),
            computeLineIntersection(bottomLine, rightLine),
            computeLineIntersection(bottomLine, leftLine),
        ];

        if (intersections.some(function (point) { return !point; })) {
            return { points: null, score: 0 };
        }

        var detectPoints = intersections.map(function (point) {
            return {
                x: point.x + offsetX,
                y: point.y + offsetY,
            };
        });
        var expandedPoints = expandQuad(
            orderPoints(detectPoints),
            0.01,
            gray.cols + offsetX,
            gray.rows + offsetY,
        );
        var orderedExpanded = orderPoints(expandedPoints);
        var avgWidth =
            (dist(orderedExpanded[0], orderedExpanded[1]) +
                dist(orderedExpanded[3], orderedExpanded[2])) *
            0.5;
        var avgHeight =
            (dist(orderedExpanded[0], orderedExpanded[3]) +
                dist(orderedExpanded[1], orderedExpanded[2])) *
            0.5;
        if (
            gray.rows > gray.cols * 1.05 &&
            avgHeight < avgWidth * 1.05
        ) {
            return { points: null, score: 0 };
        }
        var score = evaluateQuadCandidate(
            expandedPoints,
            polygonArea(expandedPoints),
            gray.cols + offsetX,
            gray.rows + offsetY,
            focusRect,
            assumeCenteredDocument,
        );

        if (score <= 0) return { points: null, score: 0 };

        return {
            points: scalePointsToSource(
                orderedExpanded,
                scaleX,
                scaleY,
                srcCols,
                srcRows,
            ),
            score: score,
        };
    } finally {
        edges.delete();
        lines.delete();
        kernel.delete();
    }
}

function evaluateQuadCandidate(
    points,
    contourArea,
    imageCols,
    imageRows,
    focusRect,
    assumeCenteredDocument,
    sizeLimits,
) {
    var ordered = orderPoints(points);
    var topWidth = dist(ordered[0], ordered[1]);
    var bottomWidth = dist(ordered[3], ordered[2]);
    var leftHeight = dist(ordered[0], ordered[3]);
    var rightHeight = dist(ordered[1], ordered[2]);
    var avgWidth = (topWidth + bottomWidth) * 0.5;
    var avgHeight = (leftHeight + rightHeight) * 0.5;
    var quadArea = polygonArea(ordered);
    var bounds = getPointBounds(ordered);
    var fillRatio = quadArea / Math.max(1, avgWidth * avgHeight);
    var areaRatio = quadArea / Math.max(1, imageCols * imageRows);
    var borderPadding = Math.round(Math.min(imageCols, imageRows) * 0.015);
    var borderPenalty = 1;
    var centerWeight = 1;
    var borderTouches = 0;
    var centroid = centroidOfPoints(ordered);
    var dx = (centroid.x - imageCols / 2) / Math.max(1, imageCols / 2);
    var dy = (centroid.y - imageRows / 2) / Math.max(1, imageRows / 2);
    var centerDistance = Math.sqrt(dx * dx + dy * dy);

    /* Cổng kích thước tối thiểu. Mặc định giữ chặt (0.35 chiều / 0.18 diện
       tích): nới toàn cục cho quad nhỏ lọt vào pool khiến 5.jpg nhận nhầm
       một vùng nền lớn và 7/8.jpg tụt xuống quad nhỏ hơn quad đúng. Chỉ
       chiến lược "khác màu nền" được truyền hạn mức lỏng hơn, vì ở đó
       candidate còn phải lấp đầy ≥82% hình chữ nhật bao VÀ tương phản rõ với
       màu nền lấy từ viền khung — đủ bằng chứng để tin một tài liệu nhỏ
       (13.jpg — mẩu note chiếm 0.34 chiều rộng, 0.14 diện tích). */
    var minDimFactor = sizeLimits ? sizeLimits.dim : 0.35;
    var minAreaFactor = sizeLimits
        ? sizeLimits.area
        : assumeCenteredDocument
          ? 0.18
          : 0.12;
    if (
        avgWidth < imageCols * minDimFactor ||
        avgHeight < imageRows * minDimFactor ||
        fillRatio < 0.45 ||
        areaRatio < minAreaFactor
    ) {
        return 0;
    }

    for (var i = 0; i < ordered.length; i++) {
        var point = ordered[i];
        if (
            point.x <= borderPadding ||
            point.x >= imageCols - 1 - borderPadding ||
            point.y <= borderPadding ||
            point.y >= imageRows - 1 - borderPadding
        ) {
            borderTouches++;
            borderPenalty *= 0.92;
        }
    }

    /* Quad hợp lệ phải bám biên gradient thật — support tính NHÂN theo
       từng cạnh: một cạnh cắt qua vùng trống (nền gỗ/vải, giữa trang giấy)
       là điểm chết dù 3 cạnh kia hoàn hảo */
    var support = edgeSupportInfo(ordered, imageCols, imageRows);
    var supportWeight = 1;
    for (var se = 0; se < support.edges.length; se++) {
        supportWeight *= 0.3 + 0.7 * support.edges[se];
    }

    /* Ruột quad phải chủ yếu là giấy (sáng, bão hoà thấp) — loại quad ôm
       nền gỗ/vải màu. Tài liệu có ảnh in vẫn đạt ~0.55+. */
    var paperFraction = interiorPaperFraction(ordered, imageCols, imageRows);
    var paperWeight =
        0.15 + 0.85 * Math.max(0, Math.min(1, (paperFraction - 0.35) / 0.45));

    /* Chụp sát tài liệu → giấy chạm 2-3 mép ảnh là BÌNH THƯỜNG: chỉ phạt
       nặng full-frame khi cạnh không bám biên gradient thật */
    var hasRealEdges = support.min > 0.45;
    if (
        assumeCenteredDocument &&
        bounds.width > imageCols * 0.96 &&
        bounds.height > imageRows * 0.96
    ) {
        if (!hasRealEdges) return 0;
        borderPenalty *= 0.4;
    }
    if (
        assumeCenteredDocument &&
        borderTouches >= 2 &&
        (bounds.width > imageCols * 0.9 || bounds.height > imageRows * 0.94)
    ) {
        borderPenalty *= hasRealEdges ? 0.85 : 0.08;
    }
    if (borderTouches >= 3) {
        borderPenalty *= assumeCenteredDocument
            ? hasRealEdges
                ? 0.65
                : 0.2
            : 0.55;
    } else if (
        bounds.width > imageCols * 0.93 ||
        bounds.height > imageRows * 0.96
    ) {
        borderPenalty *= hasRealEdges ? 0.8 : 0.55;
    }

    if (assumeCenteredDocument && focusRect) {
        if (!rectContainsPoint(focusRect, centroid)) {
            centerWeight *= 0.75;
        }
        centerWeight *= Math.max(0.75, 1.15 - centerDistance * 0.25);
    }

    /* CHUẨN HOÁ theo diện tích ảnh: candidate được chấm ở nhiều hệ toạ độ
       (detect 500px lẫn full-res) — không chia thì candidate full-res luôn
       thắng áp đảo chỉ vì đơn vị to hơn ~60× */
    var normalizedArea = contourArea / Math.max(1, imageCols * imageRows);

    return (
        normalizedArea *
        1e6 *
        (0.7 + fillRatio * 0.3) *
        borderPenalty *
        centerWeight *
        supportWeight *
        paperWeight
    );
}

function rectOverlapRatio(rect, focusRect) {
    var x1 = Math.max(rect.x, focusRect.x);
    var y1 = Math.max(rect.y, focusRect.y);
    var x2 = Math.min(rect.x + rect.width, focusRect.x + focusRect.width);
    var y2 = Math.min(rect.y + rect.height, focusRect.y + focusRect.height);
    var overlapW = Math.max(0, x2 - x1);
    var overlapH = Math.max(0, y2 - y1);
    var overlapArea = overlapW * overlapH;
    var rectArea = rect.width * rect.height;

    return rectArea > 0 ? overlapArea / rectArea : 0;
}

function createCenterFocusRect(cols, rows) {
    return {
        x: Math.round(cols * 0.2),
        y: Math.round(rows * 0.15),
        width: Math.round(cols * 0.6),
        height: Math.round(rows * 0.7),
    };
}

function createDetectionRegions(cols, rows, assumeCenteredDocument) {
    var fullRegion = { x: 0, y: 0, width: cols, height: rows };
    return [fullRegion];
}

function centerDistanceScore(rect, imageCols, imageRows) {
    var cx = rect.x + rect.width / 2;
    var cy = rect.y + rect.height / 2;
    var dx = (cx - imageCols / 2) / (imageCols / 2);
    var dy = (cy - imageRows / 2) / (imageRows / 2);
    var distNorm = Math.sqrt(dx * dx + dy * dy);
    return Math.max(0.25, 1.25 - distNorm);
}

function scoreDocumentQuad(
    approx,
    area,
    imageCols,
    imageRows,
    focusRect,
    assumeCenteredDocument,
) {
    var rect = cv.boundingRect(approx);
    var rectArea = rect.width * rect.height;
    var rectangularity = rectArea > 0 ? area / rectArea : 0;
    var score = 0;
    var borderPadding = Math.max(
        10,
        Math.round(Math.min(imageCols, imageRows) * 0.015),
    );
    var borderPenalty = 1;
    var ratio = rect.width > 0 ? rect.height / rect.width : 0;
    var ratioPenalty = 1;

    if (rectangularity >= 0.65) {
        score = area * rectangularity;
    }

    if (rect.x <= borderPadding) borderPenalty *= rect.x <= 1 ? 0.2 : 0.6;
    if (rect.y <= borderPadding) borderPenalty *= rect.y <= 1 ? 0.2 : 0.6;
    if (rect.x + rect.width >= imageCols - borderPadding) {
        borderPenalty *= rect.x + rect.width >= imageCols - 1 ? 0.2 : 0.6;
    }
    if (rect.y + rect.height >= imageRows - borderPadding) {
        borderPenalty *= rect.y + rect.height >= imageRows - 1 ? 0.2 : 0.6;
    }

    if (ratio > 0) {
        if (ratio < 1.15 || ratio > 1.75) {
            ratioPenalty = 0.75;
        } else if (ratio < 1.22 || ratio > 1.62) {
            ratioPenalty = 0.88;
        }
    }

    score *= borderPenalty * ratioPenalty;

    if (assumeCenteredDocument && focusRect) {
        var focusOverlap = rectOverlapRatio(rect, focusRect);
        var centerScore = centerDistanceScore(rect, imageCols, imageRows);

        if (focusOverlap < 0.12) {
            score *= 0.2;
        } else if (focusOverlap < 0.2) {
            score *= 0.55;
        } else {
            score *= 1.1;
        }

        score *= centerScore;
    }

    if (
        rect.width >= imageCols * 0.98 &&
        rect.height >= imageRows * 0.98
    ) {
        score *= 0.1;
    }

    return score;
}

function extractQuadPoints(approx, scaleX, scaleY, srcCols, srcRows) {
    var offsetX =
        arguments.length > 5 && typeof arguments[5] === "number" ? arguments[5] : 0;
    var offsetY =
        arguments.length > 6 && typeof arguments[6] === "number" ? arguments[6] : 0;
    var points = [];
    for (var j = 0; j < 4; j++) {
        points.push({
            x: clampPoint((approx.data32S[j * 2] + offsetX) * scaleX, srcCols),
            y: clampPoint(
                (approx.data32S[j * 2 + 1] + offsetY) * scaleY,
                srcRows,
            ),
        });
    }
    return points;
}

function findBestQuadFromMask(
    mask,
    scaleX,
    scaleY,
    srcCols,
    srcRows,
    minArea,
    epsilonFactor,
    focusRect,
    assumeCenteredDocument,
    offsetX,
    offsetY,
    detectCols,
    detectRows,
) {
    var workingMask = mask.clone();
    var contours = new cv.MatVector();
    var hierarchy = new cv.Mat();
    var bestPoints = null;
    var bestScore = 0;
    var epsilonFactors = [0.015, 0.02, 0.03, 0.05];
    var contourOrder = [];

    try {
        cv.findContours(
            workingMask,
            contours,
            hierarchy,
            cv.RETR_LIST,
            cv.CHAIN_APPROX_SIMPLE,
        );

        for (var i = 0; i < contours.size(); i++) {
            var contourForArea = contours.get(i);
            var contourArea = Math.abs(cv.contourArea(contourForArea));
            contourForArea.delete();
            if (contourArea >= minArea * 0.6) {
                contourOrder.push({ index: i, area: contourArea });
            }
        }

        contourOrder.sort(function (a, b) {
            return b.area - a.area;
        });

        for (
            var contourIndex = 0;
            contourIndex < contourOrder.length && contourIndex < 14;
            contourIndex++
        ) {
            var contour = contours.get(contourOrder[contourIndex].index);
            var area = contourOrder[contourIndex].area;
            var peri = cv.arcLength(contour, true);
            var hull = new cv.Mat();

            cv.convexHull(contour, hull, false, true);
            var hullPeri = cv.arcLength(hull, true);

            for (var epsIndex = 0; epsIndex < epsilonFactors.length; epsIndex++) {
                var approxSources = [
                    { mat: contour, epsilon: epsilonFactors[epsIndex] * peri },
                    { mat: hull, epsilon: epsilonFactors[epsIndex] * hullPeri },
                ];

                for (var sourceIndex = 0; sourceIndex < approxSources.length; sourceIndex++) {
                    var approx = new cv.Mat();
                    cv.approxPolyDP(
                        approxSources[sourceIndex].mat,
                        approx,
                        approxSources[sourceIndex].epsilon,
                        true,
                    );

                    if (
                        approx.rows === 4 &&
                        area > minArea &&
                        cv.isContourConvex(approx)
                    ) {
                        var detectPoints = buildPointArrayFromApprox(
                            approx,
                            offsetX,
                            offsetY,
                        );
                        var score = evaluateQuadCandidate(
                            detectPoints,
                            area,
                            detectCols,
                            detectRows,
                            focusRect,
                            assumeCenteredDocument,
                        );

                        if (score > bestScore) {
                            bestScore = score;
                            bestPoints = scalePointsToSource(
                                orderPoints(detectPoints),
                                scaleX,
                                scaleY,
                                srcCols,
                                srcRows,
                            );
                        }
                    }

                    approx.delete();
                }
            }

            var hullPoints = buildPointArrayFromApprox(hull, offsetX, offsetY);
            var extremeQuad = extractExtremeQuad(hullPoints);
            var quadrantQuad = extractQuadrantQuad(hullPoints);
            if (extremeQuad) {
                var extremeScore = evaluateQuadCandidate(
                    extremeQuad,
                    area,
                    detectCols,
                    detectRows,
                    focusRect,
                    assumeCenteredDocument,
                );
                if (extremeScore > bestScore) {
                    bestScore = extremeScore;
                    bestPoints = scalePointsToSource(
                        orderPoints(extremeQuad),
                        scaleX,
                        scaleY,
                        srcCols,
                        srcRows,
                    );
                }
            }
            if (quadrantQuad) {
                var expandedQuadrantQuad = expandQuad(
                    orderPoints(quadrantQuad),
                    0.01,
                    detectCols,
                    detectRows,
                );
                var quadrantScore = evaluateQuadCandidate(
                    expandedQuadrantQuad,
                    area,
                    detectCols,
                    detectRows,
                    focusRect,
                    assumeCenteredDocument,
                );
                if (quadrantScore > bestScore) {
                    bestScore = quadrantScore;
                    bestPoints = scalePointsToSource(
                        orderPoints(expandedQuadrantQuad),
                        scaleX,
                        scaleY,
                        srcCols,
                        srcRows,
                    );
                }
            }

            hull.delete();
            contour.delete();
        }
    } finally {
        workingMask.delete();
        contours.delete();
        hierarchy.delete();
    }

    return { points: bestPoints, score: bestScore };
}

function findCenterPaperQuad(
    detectRegion,
    scaleX,
    scaleY,
    srcCols,
    srcRows,
    minArea,
    focusRect,
    assumeCenteredDocument,
    offsetX,
    offsetY,
) {
    var gray = new cv.Mat();
    var rgb = new cv.Mat();
    var hsv = new cv.Mat();
    var hsvChannels = new cv.MatVector();
    var grayCenter = null;
    var saturation = null;
    var value = null;
    var satCenter = null;
    var valueCenter = null;
    var saturationMask = new cv.Mat();
    var valueMask = new cv.Mat();
    var grayMask = new cv.Mat();
    var paperMask = new cv.Mat();
    var contours = new cv.MatVector();
    var hierarchy = new cv.Mat();
    var kernel = cv.getStructuringElement(cv.MORPH_RECT, new cv.Size(5, 5));
    var bestPoints = null;
    var bestScore = 0;

    try {
        var centerRect = new cv.Rect(
            Math.round(detectRegion.cols * 0.3),
            Math.round(detectRegion.rows * 0.3),
            Math.max(1, Math.round(detectRegion.cols * 0.4)),
            Math.max(1, Math.round(detectRegion.rows * 0.4)),
        );
        var centerPoint = {
            x: detectRegion.cols / 2,
            y: detectRegion.rows / 2,
        };

        cv.cvtColor(detectRegion, gray, cv.COLOR_RGBA2GRAY);
        cv.cvtColor(detectRegion, rgb, cv.COLOR_RGBA2RGB);
        cv.cvtColor(rgb, hsv, cv.COLOR_RGB2HSV);
        cv.split(hsv, hsvChannels);

        saturation = hsvChannels.get(1);
        value = hsvChannels.get(2);
        grayCenter = gray.roi(centerRect);
        satCenter = saturation.roi(centerRect);
        valueCenter = value.roi(centerRect);

        var meanGray = cv.mean(grayCenter)[0];
        var meanSat = cv.mean(satCenter)[0];
        var meanValue = cv.mean(valueCenter)[0];
        var satLimit = Math.min(110, Math.max(45, meanSat + 26));
        var valueFloor = Math.max(90, meanValue - 48);
        var grayFloor = Math.max(90, meanGray - 42);

        cv.threshold(
            saturation,
            saturationMask,
            satLimit,
            255,
            cv.THRESH_BINARY_INV,
        );
        cv.threshold(value, valueMask, valueFloor, 255, cv.THRESH_BINARY);
        cv.threshold(gray, grayMask, grayFloor, 255, cv.THRESH_BINARY);
        cv.bitwise_and(saturationMask, valueMask, paperMask);
        cv.bitwise_and(paperMask, grayMask, paperMask);
        cv.morphologyEx(paperMask, paperMask, cv.MORPH_CLOSE, kernel);
        cv.dilate(paperMask, paperMask, kernel);
        cv.erode(paperMask, paperMask, kernel);

        cv.findContours(
            paperMask,
            contours,
            hierarchy,
            cv.RETR_EXTERNAL,
            cv.CHAIN_APPROX_SIMPLE,
        );

        for (var i = 0; i < contours.size(); i++) {
            var contour = contours.get(i);
            var area = Math.abs(cv.contourArea(contour));
            var rect = cv.boundingRect(contour);
            var hull = new cv.Mat();

            if (
                area < minArea ||
                !pointInRect(centerPoint, rect)
            ) {
                contour.delete();
                continue;
            }

            cv.convexHull(contour, hull, false, true);
            var contourPoints = buildPointArrayFromApprox(
                contour,
                offsetX,
                offsetY,
            );
            var hullPoints = buildPointArrayFromApprox(hull, offsetX, offsetY);
            var extremeQuad = extractExtremeQuad(hullPoints);
            var quadrantQuad = extractQuadrantQuad(hullPoints);
            var boundaryQuad = buildBoundaryQuad(
                contourPoints,
                detectRegion.cols + offsetX,
                detectRegion.rows + offsetY,
            );

            if (extremeQuad) {
                var score = scoreScaledQuad(
                    expandQuad(
                        orderPoints(extremeQuad),
                        0.01,
                        detectRegion.cols + offsetX,
                        detectRegion.rows + offsetY,
                    ),
                    area,
                    scaleX,
                    scaleY,
                    srcCols,
                    srcRows,
                    detectRegion.cols,
                    detectRegion.rows,
                    focusRect,
                    assumeCenteredDocument,
                );

                if (score > bestScore) {
                    bestScore = score;
                    bestPoints = scalePointsToSource(
                        orderPoints(extremeQuad),
                        scaleX,
                        scaleY,
                        srcCols,
                        srcRows,
                    );
                }
            }
            if (quadrantQuad) {
                var expandedQuadrantQuad = expandQuad(
                    orderPoints(quadrantQuad),
                    0.01,
                    detectRegion.cols + offsetX,
                    detectRegion.rows + offsetY,
                );
                var quadrantScore = scoreScaledQuad(
                    expandedQuadrantQuad,
                    area,
                    scaleX,
                    scaleY,
                    srcCols,
                    srcRows,
                    detectRegion.cols,
                    detectRegion.rows,
                    focusRect,
                    assumeCenteredDocument,
                );
                if (quadrantScore > bestScore) {
                    bestScore = quadrantScore;
                    bestPoints = scalePointsToSource(
                        orderPoints(expandedQuadrantQuad),
                        scaleX,
                        scaleY,
                        srcCols,
                        srcRows,
                    );
                }
            }
            if (boundaryQuad) {
                var expandedBoundaryQuad = expandQuad(
                    boundaryQuad,
                    0.01,
                    detectRegion.cols + offsetX,
                    detectRegion.rows + offsetY,
                );
                var boundaryScore = scoreScaledQuad(
                    expandedBoundaryQuad,
                    area,
                    scaleX,
                    scaleY,
                    srcCols,
                    srcRows,
                    detectRegion.cols,
                    detectRegion.rows,
                    focusRect,
                    assumeCenteredDocument,
                );
                if (boundaryScore > bestScore) {
                    bestScore = boundaryScore * 1.08;
                    bestPoints = scalePointsToSource(
                        orderPoints(expandedBoundaryQuad),
                        scaleX,
                        scaleY,
                        srcCols,
                        srcRows,
                    );
                }
            }

            hull.delete();
            contour.delete();
        }
    } finally {
        gray.delete();
        rgb.delete();
        hsv.delete();
        hsvChannels.delete();
        if (grayCenter) grayCenter.delete();
        if (saturation) saturation.delete();
        if (value) value.delete();
        if (satCenter) satCenter.delete();
        if (valueCenter) valueCenter.delete();
        saturationMask.delete();
        valueMask.delete();
        grayMask.delete();
        paperMask.delete();
        contours.delete();
        hierarchy.delete();
        kernel.delete();
    }

    return { points: bestPoints, score: bestScore };
}

/**
 * Chiến lược "khác màu nền": lấy màu nền từ VIỀN khung rồi mask theo khoảng
 * cách màu tới nền đó.
 *
 * Lý do cần: mọi chiến lược còn lại đều giả định "giấy = sáng + bão hoà thấp"
 * (paper-color mask) hoặc dựa vào bước nhảy độ sáng (Canny/Otsu/Hough). Trên
 * nền đá/gạch sáng — nền CŨNG sáng và bão hoà thấp — mask phủ kín cả khung nên
 * contour lớn nhất chính là cái khung; pool candidate không hề chứa quad của
 * tờ giấy (đo trên 10.jpg và 13.jpg, quad tốt nhất ≈ full-frame).
 *
 * Ở chế độ assumeCenteredDocument, dải viền ngoài gần như chắc chắn là nền.
 * Median theo từng kênh chịu được cả khi một phần viền dính tài liệu. Mask
 * theo khoảng cách màu không giả định giấy màu gì nên bắt được cả giấy trắng
 * trên đá xám (lệch nhẹ về độ sáng) lẫn note vàng trên đá xám (lệch mạnh về
 * sắc độ).
 */
function findQuadFromBackgroundDiff(
    detectRegion,
    scaleX,
    scaleY,
    srcCols,
    srcRows,
    minArea,
    focusRect,
    assumeCentered,
    offsetX,
    offsetY,
    detectCols,
    detectRows,
) {
    var rgb = new cv.Mat();
    var diff = new cv.Mat();
    var mask = new cv.Mat();
    var closeKernel = cv.getStructuringElement(
        cv.MORPH_RECT,
        new cv.Size(5, 5),
    );
    /* OPEN mạnh hơn CLOSE: chính CLOSE tạo ra cầu nối mỏng dính tài liệu vào
       vùng bóng đổ/loá kề bên, làm cả hai thành MỘT contour (13.jpg — note
       dính blob bóng đổ nên chỉ tìm ra 1 contour ôm gần hết khung). Kernel
       OPEN lớn cắt đứt các cầu đó mà vẫn giữ nguyên khối tài liệu. */
    var openKernel = cv.getStructuringElement(
        cv.MORPH_RECT,
        new cv.Size(11, 11),
    );

    try {
        cv.cvtColor(detectRegion, rgb, cv.COLOR_RGBA2RGB);
        var cols = rgb.cols;
        var rows = rgb.rows;
        var data = rgb.data;

        /* ── Màu nền = median từng kênh trên dải viền ── */
        var bandX = Math.max(2, Math.round(cols * 0.06));
        var bandY = Math.max(2, Math.round(rows * 0.06));
        var samplesR = [];
        var samplesG = [];
        var samplesB = [];
        var STEP = 2;
        for (var y = 0; y < rows; y += STEP) {
            var inVerticalBand = y < bandY || y >= rows - bandY;
            for (var x = 0; x < cols; x += STEP) {
                if (!inVerticalBand && x >= bandX && x < cols - bandX) continue;
                var p = (y * cols + x) * 3;
                samplesR.push(data[p]);
                samplesG.push(data[p + 1]);
                samplesB.push(data[p + 2]);
            }
        }
        if (samplesR.length < 32) return { points: null, score: 0 };

        function median(list) {
            list.sort(function (a, b) {
                return a - b;
            });
            return list[list.length >> 1];
        }
        var bgR = median(samplesR);
        var bgG = median(samplesG);
        var bgB = median(samplesB);

        /* ── Khoảng cách màu tới nền (clamp 0-255) ── */
        diff.create(rows, cols, cv.CV_8UC1);
        var diffData = diff.data;
        for (var i = 0, n = rows * cols; i < n; i++) {
            var q = i * 3;
            var dr = data[q] - bgR;
            var dg = data[q + 1] - bgG;
            var db = data[q + 2] - bgB;
            var dist = Math.sqrt(dr * dr + dg * dg + db * db);
            diffData[i] = dist > 255 ? 255 : dist;
        }

        /* Quét nhiều ngưỡng thay vì Otsu.
           Otsu trên bản đồ khoảng cách bị ĐUÔI PHÂN BỐ chi phối: bóng đổ, ánh
           sáng loá và chữ đen lệch màu rất mạnh nên kéo ngưỡng lên cao, trong
           khi tờ giấy chỉ lệch VỪA PHẢI so với nền → rơi xuống dưới ngưỡng và
           biến mất khỏi mask (đo trên 10.jpg otsu=82 và 13.jpg otsu=43: mask
           chỉ còn bóng đổ + chữ, không có tờ giấy). Quét thang ngưỡng rồi để
           phần chấm điểm candidate chọn — cùng cách đã dùng cho Canny. */
        var thresholds = [14, 20, 26, 32, 40, 52, 68];
        /* Trả về NHIỀU candidate, không chỉ cái điểm cao nhất: ở cùng một
           ngưỡng, vùng bóng đổ thường có diện tích lớn hơn tài liệu nên luôn
           thắng điểm, trong khi tài liệu là candidate đúng (13.jpg — blob
           note fill 0.92 thua blob bóng đổ chỉ vì nhỏ hơn). Guard chấp nhận
           ở detectDocument sẽ duyệt lần lượt và chọn ra cái hợp lệ. */
        var results = [];

        for (var ti = 0; ti < thresholds.length; ti++) {
            cv.threshold(diff, mask, thresholds[ti], 255, cv.THRESH_BINARY);
            cv.morphologyEx(mask, mask, cv.MORPH_CLOSE, closeKernel);
            cv.morphologyEx(mask, mask, cv.MORPH_OPEN, openKernel);

            if (DEBUG_MASK_SINK) {
                DEBUG_MASK_SINK("bgdiff-t" + thresholds[ti], mask);
            }

            var attempt = findBestQuadFromMask(
                mask,
                scaleX,
                scaleY,
                srcCols,
                srcRows,
                minArea,
                0.02,
                focusRect,
                assumeCentered,
                offsetX,
                offsetY,
                detectCols,
                detectRows,
            );
            if (attempt.points && attempt.score > 0) results.push(attempt);

            /* Fallback hình chữ nhật xoay.
               findBestQuadFromMask đòi approxPolyDP ra ĐÚNG 4 đỉnh; blob của
               mask khác-nền thường bo góc hoặc răng cưa (giấy note bo góc,
               biên mask sau morph) nên ra 5-7 đỉnh và bị loại sạch — đó là lý
               do 13.jpg có mask đúng mà pool candidate vẫn rỗng. minAreaRect
               đúng bằng mô hình "tờ giấy chữ nhật" nên chịu được cả hai. */
            var rectContours = new cv.MatVector();
            var rectHierarchy = new cv.Mat();
            try {
                var maskCopy = mask.clone();
                cv.findContours(
                    maskCopy,
                    rectContours,
                    rectHierarchy,
                    cv.RETR_EXTERNAL,
                    cv.CHAIN_APPROX_SIMPLE,
                );
                maskCopy.delete();

                for (var ci = 0; ci < rectContours.size(); ci++) {
                    var blob = rectContours.get(ci);
                    var blobArea = Math.abs(cv.contourArea(blob));
                    if (blobArea < minArea) {
                        blob.delete();
                        continue;
                    }
                    var rotated = cv.minAreaRect(blob);
                    var boxPoints = cv.RotatedRect.points(rotated);
                    blob.delete();

                    /* Chỉ nhận khi blob LẤP ĐẦY hình chữ nhật bao — loại vệt
                       bóng đổ / vùng loang có hình thù tuỳ tiện */
                    var rectArea =
                        Math.max(1, rotated.size.width * rotated.size.height);
                    if (blobArea / rectArea < 0.82) continue;

                    var rectPoints = [];
                    for (var bi = 0; bi < 4; bi++) {
                        rectPoints.push({
                            x: boxPoints[bi].x + offsetX,
                            y: boxPoints[bi].y + offsetY,
                        });
                    }
                    var rectScore = evaluateQuadCandidate(
                        rectPoints,
                        blobArea,
                        detectCols,
                        detectRows,
                        focusRect,
                        assumeCentered,
                        { dim: 0.22, area: 0.08 },
                    );
                    if (rectScore > 0) {
                        results.push({
                            points: scalePointsToSource(
                                orderPoints(rectPoints),
                                scaleX,
                                scaleY,
                                srcCols,
                                srcRows,
                            ),
                            score: rectScore,
                        });
                    }
                }
            } finally {
                rectContours.delete();
                rectHierarchy.delete();
            }
        }

        debugLog(
            "bgDiff: bg rgb",
            bgR + "," + bgG + "," + bgB,
            "candidates",
            results.length,
        );
        return results;
    } catch (err) {
        debugLog("findQuadFromBackgroundDiff failed:", err);
        return [];
    } finally {
        rgb.delete();
        diff.delete();
        mask.delete();
        closeKernel.delete();
        openKernel.delete();
    }
}

function detectDocumentInRegion(
    detectRegion,
    regionRect,
    detectCols,
    detectRows,
    src,
    options,
) {
    var gray = new cv.Mat();
    var rgb = new cv.Mat();
    var hsv = new cv.Mat();
    var hsvChannels = new cv.MatVector();
    var saturation = null;
    var value = null;
    var attemptMask = new cv.Mat();
    var adaptiveMask = new cv.Mat();
    var otsuMask = new cv.Mat();
    var lowSaturationMask = new cv.Mat();
    var highValueMask = new cv.Mat();
    var paperColorMask = new cv.Mat();
    var kernel = cv.getStructuringElement(cv.MORPH_RECT, new cv.Size(3, 3));
    var closeKernel = cv.getStructuringElement(
        cv.MORPH_RECT,
        new cv.Size(5, 5),
    );
    /* Gom TẤT CẢ candidate của mọi chiến lược thay vì chỉ giữ cái điểm cao
       nhất: guard chấp nhận ở detectDocument cần được thử lần lượt theo thứ
       hạng, vì candidate điểm cao nhất có thể là vùng bóng đổ/nền lớn còn
       candidate ĐÚNG xếp ngay sau (đo trên 13.jpg: blob bóng đổ thắng điểm
       diện tích, tờ note xếp thứ 2 rồi bị vứt cùng cả pool). */
    var candidates = [];
    function pushCandidate(candidate, weight, tier) {
        if (candidate && candidate.points && candidate.score > 0) {
            candidates.push({
                points: candidate.points,
                score: candidate.score * (weight || 1),
                tier: tier || 1,
            });
        }
    }
    var cannyThresholds = [
        [50, 150],
        [30, 120],
        [75, 200],
    ];

    try {
        var scaleX = src.cols / detectCols;
        var scaleY = src.rows / detectRows;
        var minArea =
            detectCols * detectRows * (options.assumeCenteredDocument ? 0.16 : 0.12);
        var focusRect = options.assumeCenteredDocument
            ? createCenterFocusRect(detectCols, detectRows)
            : null;

        cv.cvtColor(detectRegion, gray, cv.COLOR_RGBA2GRAY);
        cv.GaussianBlur(gray, gray, new cv.Size(5, 5), 0);

        if (options.assumeCenteredDocument) {
            var centerPaperCandidate = findCenterPaperQuad(
                detectRegion,
                scaleX,
                scaleY,
                src.cols,
                src.rows,
                minArea,
                focusRect,
                options.assumeCenteredDocument,
                regionRect.x,
                regionRect.y,
            );
            pushCandidate(centerPaperCandidate, 1.18);
        }

        for (var i = 0; i < cannyThresholds.length; i++) {
            cv.Canny(
                gray,
                attemptMask,
                cannyThresholds[i][0],
                cannyThresholds[i][1],
            );
            cv.dilate(attemptMask, attemptMask, kernel);
            cv.morphologyEx(
                attemptMask,
                attemptMask,
                cv.MORPH_CLOSE,
                closeKernel,
            );
            var edgeCandidate = findBestQuadFromMask(
                attemptMask,
                scaleX,
                scaleY,
                src.cols,
                src.rows,
                minArea,
                0.02,
                focusRect,
                options.assumeCenteredDocument,
                regionRect.x,
                regionRect.y,
                detectCols,
                detectRows,
            );
            pushCandidate(edgeCandidate);
        }

        {
            cv.adaptiveThreshold(
                gray,
                adaptiveMask,
                255,
                cv.ADAPTIVE_THRESH_GAUSSIAN_C,
                cv.THRESH_BINARY,
                31,
                15,
            );
            cv.morphologyEx(
                adaptiveMask,
                adaptiveMask,
                cv.MORPH_CLOSE,
                closeKernel,
            );
            var adaptiveCandidate = findBestQuadFromMask(
                adaptiveMask,
                scaleX,
                scaleY,
                src.cols,
                src.rows,
                minArea,
                0.02,
                focusRect,
                options.assumeCenteredDocument,
                regionRect.x,
                regionRect.y,
                detectCols,
                detectRows,
            );
            pushCandidate(adaptiveCandidate);
        }

        {
            cv.cvtColor(detectRegion, rgb, cv.COLOR_RGBA2RGB);
            cv.cvtColor(rgb, hsv, cv.COLOR_RGB2HSV);
            cv.split(hsv, hsvChannels);
            saturation = hsvChannels.get(1);
            value = hsvChannels.get(2);
            cv.threshold(
                saturation,
                lowSaturationMask,
                60,
                255,
                cv.THRESH_BINARY_INV,
            );
            cv.threshold(
                value,
                highValueMask,
                135,
                255,
                cv.THRESH_BINARY,
            );
            cv.bitwise_and(lowSaturationMask, highValueMask, paperColorMask);
            cv.morphologyEx(
                paperColorMask,
                paperColorMask,
                cv.MORPH_CLOSE,
                closeKernel,
            );
            cv.erode(paperColorMask, paperColorMask, kernel);
            cv.dilate(paperColorMask, paperColorMask, kernel);
            var paperColorCandidate = findBestQuadFromMask(
                paperColorMask,
                scaleX,
                scaleY,
                src.cols,
                src.rows,
                minArea,
                0.02,
                focusRect,
                options.assumeCenteredDocument,
                regionRect.x,
                regionRect.y,
                detectCols,
                detectRows,
            );
            pushCandidate(paperColorCandidate);
        }

        {
            cv.threshold(
                gray,
                otsuMask,
                0,
                255,
                cv.THRESH_BINARY + cv.THRESH_OTSU,
            );
            cv.morphologyEx(otsuMask, otsuMask, cv.MORPH_CLOSE, closeKernel);
            var otsuCandidate = findBestQuadFromMask(
                otsuMask,
                scaleX,
                scaleY,
                src.cols,
                src.rows,
                minArea,
                0.02,
                focusRect,
                options.assumeCenteredDocument,
                regionRect.x,
                regionRect.y,
                detectCols,
                detectRows,
            );
            pushCandidate(otsuCandidate);
        }

        {
            /* minArea thấp hơn các chiến lược khác: mask ở đây là "mọi thứ
               KHÁC nền" nên blob lớn nhất đúng là vật thể, không phải một
               mảng chữ hay vệt sáng ngẫu nhiên. Cần cho tài liệu nhỏ trong
               khung (13.jpg — mẩu note ~13% diện tích, dưới ngưỡng 16%). */
            var bgDiffCandidate = findQuadFromBackgroundDiff(
                detectRegion,
                scaleX,
                scaleY,
                src.cols,
                src.rows,
                detectCols * detectRows * 0.05,
                focusRect,
                options.assumeCenteredDocument,
                regionRect.x,
                regionRect.y,
                detectCols,
                detectRows,
            );
            /* Tầng 2 — chỉ dùng khi KHÔNG chiến lược hình học nào cho quad
               hợp lệ. Chiến lược khác-màu-nền là phương án cứu hộ cho nền
               sáng đồng màu; để nó cạnh tranh ngang hàng thì trên ảnh bình
               thường nó lấn át cả quad đúng (8.jpg — quad bgDiff lệch nhưng
               support cao vẫn chiếm hạng 1 và guard không phân biệt nổi). */
            for (var bi2 = 0; bi2 < bgDiffCandidate.length; bi2++) {
                pushCandidate(bgDiffCandidate[bi2], 1, 2);
            }
        }

        {
            var lineCandidate = findQuadFromLines(
                gray,
                scaleX,
                scaleY,
                src.cols,
                src.rows,
                focusRect,
                options.assumeCenteredDocument,
                regionRect.x,
                regionRect.y,
            );
            pushCandidate(lineCandidate);
        }

        return candidates;
    } finally {
        gray.delete();
        rgb.delete();
        hsv.delete();
        hsvChannels.delete();
        if (saturation) saturation.delete();
        if (value) value.delete();
        attemptMask.delete();
        adaptiveMask.delete();
        otsuMask.delete();
        lowSaturationMask.delete();
        highValueMask.delete();
        paperColorMask.delete();
        kernel.delete();
        closeKernel.delete();
    }
}

function findMaskBounds(mask) {
    var cols = mask.cols;
    var rows = mask.rows;
    var yStart = Math.max(0, Math.round(rows * 0.08));
    var yEnd = Math.min(rows, Math.round(rows * 0.92));
    var xStart = Math.max(0, Math.round(cols * 0.08));
    var xEnd = Math.min(cols, Math.round(cols * 0.92));
    var minColumnRatio = 0.58;
    var minRowRatio = 0.58;
    var left = 0;
    var right = cols - 1;
    var top = 0;
    var bottom = rows - 1;
    var foundLeft = false;
    var foundRight = false;
    var foundTop = false;
    var foundBottom = false;
    var x;
    var y;

    for (x = 0; x < cols; x++) {
        var columnHits = 0;
        for (y = yStart; y < yEnd; y++) {
            if (mask.ucharPtr(y, x)[0] > 0) columnHits++;
        }
        if (columnHits / Math.max(1, yEnd - yStart) >= minColumnRatio) {
            left = x;
            foundLeft = true;
            break;
        }
    }

    for (x = cols - 1; x >= 0; x--) {
        var reverseColumnHits = 0;
        for (y = yStart; y < yEnd; y++) {
            if (mask.ucharPtr(y, x)[0] > 0) reverseColumnHits++;
        }
        if (
            reverseColumnHits / Math.max(1, yEnd - yStart) >= minColumnRatio
        ) {
            right = x;
            foundRight = true;
            break;
        }
    }

    for (y = 0; y < rows; y++) {
        var rowHits = 0;
        for (x = xStart; x < xEnd; x++) {
            if (mask.ucharPtr(y, x)[0] > 0) rowHits++;
        }
        if (rowHits / Math.max(1, xEnd - xStart) >= minRowRatio) {
            top = y;
            foundTop = true;
            break;
        }
    }

    for (y = rows - 1; y >= 0; y--) {
        var reverseRowHits = 0;
        for (x = xStart; x < xEnd; x++) {
            if (mask.ucharPtr(y, x)[0] > 0) reverseRowHits++;
        }
        if (reverseRowHits / Math.max(1, xEnd - xStart) >= minRowRatio) {
            bottom = y;
            foundBottom = true;
            break;
        }
    }

    if (!(foundLeft && foundRight && foundTop && foundBottom)) return null;
    if (right - left < cols * 0.45 || bottom - top < rows * 0.45) return null;

    return {
        x: left,
        y: top,
        width: right - left + 1,
        height: bottom - top + 1,
    };
}

function intersectRects(a, b) {
    var x1 = Math.max(a.x, b.x);
    var y1 = Math.max(a.y, b.y);
    var x2 = Math.min(a.x + a.width, b.x + b.width);
    var y2 = Math.min(a.y + a.height, b.y + b.height);

    if (x2 <= x1 || y2 <= y1) return null;
    return { x: x1, y: y1, width: x2 - x1, height: y2 - y1 };
}

function refineWarpedCrop(src, assumeCenteredDocument) {
    if (!assumeCenteredDocument) return src.clone();

    var gray = new cv.Mat();
    var rgb = new cv.Mat();
    var hsv = new cv.Mat();
    var hsvChannels = new cv.MatVector();
    var saturation = null;
    var value = null;
    var lowSaturationMask = new cv.Mat();
    var highValueMask = new cv.Mat();
    var paperMask = new cv.Mat();
    var kernel = cv.getStructuringElement(cv.MORPH_RECT, new cv.Size(3, 3));
    var closeKernel = cv.getStructuringElement(
        cv.MORPH_RECT,
        new cv.Size(7, 7),
    );
    var contours = new cv.MatVector();
    var hierarchy = new cv.Mat();
    var bestRect = null;
    var bestScore = 0;

    try {
        cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);
        cv.cvtColor(src, rgb, cv.COLOR_RGBA2RGB);
        cv.cvtColor(rgb, hsv, cv.COLOR_RGB2HSV);
        cv.split(hsv, hsvChannels);
        saturation = hsvChannels.get(1);
        value = hsvChannels.get(2);

        cv.threshold(
            saturation,
            lowSaturationMask,
            55,
            255,
            cv.THRESH_BINARY_INV,
        );
        cv.threshold(
            value,
            highValueMask,
            145,
            255,
            cv.THRESH_BINARY,
        );
        cv.bitwise_and(lowSaturationMask, highValueMask, paperMask);
        cv.threshold(gray, gray, 0, 255, cv.THRESH_BINARY + cv.THRESH_OTSU);
        cv.bitwise_and(paperMask, gray, paperMask);
        cv.morphologyEx(paperMask, paperMask, cv.MORPH_CLOSE, closeKernel);
        cv.erode(paperMask, paperMask, kernel);
        cv.dilate(paperMask, paperMask, kernel);

        cv.findContours(
            paperMask,
            contours,
            hierarchy,
            cv.RETR_EXTERNAL,
            cv.CHAIN_APPROX_SIMPLE,
        );

        for (var i = 0; i < contours.size(); i++) {
            var contour = contours.get(i);
            var area = cv.contourArea(contour);
            var rect = cv.boundingRect(contour);
            var rectArea = rect.width * rect.height;
            var rectangularity = rectArea > 0 ? area / rectArea : 0;
            var overlap = rectOverlapRatio(
                rect,
                createCenterFocusRect(src.cols, src.rows),
            );
            var centerScore = centerDistanceScore(rect, src.cols, src.rows);
            var score = area * rectangularity * overlap * centerScore;

            if (
                area > src.cols * src.rows * 0.7 &&
                rect.width > src.cols * 0.75 &&
                rect.height > src.rows * 0.75 &&
                score > bestScore
            ) {
                bestScore = score;
                bestRect = rect;
            }

            contour.delete();
        }

        if (!bestRect) return src.clone();

        var padX = Math.min(16, Math.round(src.cols * 0.012));
        var padY = Math.min(16, Math.round(src.rows * 0.012));
        var cropX = Math.max(0, bestRect.x - padX);
        var cropY = Math.max(0, bestRect.y - padY);
        var cropW = Math.min(src.cols - cropX, bestRect.width + padX * 2);
        var cropH = Math.min(src.rows - cropY, bestRect.height + padY * 2);
        var leftTrim = cropX;
        var rightTrim = src.cols - (cropX + cropW);
        var topTrim = cropY;
        var bottomTrim = src.rows - (cropY + cropH);

        if (cropW < src.cols * 0.55 || cropH < src.rows * 0.55) {
            return src.clone();
        }
        if (
            leftTrim > src.cols * 0.035 ||
            rightTrim > src.cols * 0.035 ||
            topTrim > src.rows * 0.03 ||
            bottomTrim > src.rows * 0.03
        ) {
            return src.clone();
        }

        var roi = src.roi(new cv.Rect(cropX, cropY, cropW, cropH));
        var cropped = roi.clone();
        roi.delete();
        return cropped;
    } finally {
        gray.delete();
        rgb.delete();
        hsv.delete();
        hsvChannels.delete();
        if (saturation) saturation.delete();
        if (value) value.delete();
        lowSaturationMask.delete();
        highValueMask.delete();
        paperMask.delete();
        kernel.delete();
        closeKernel.delete();
        contours.delete();
        hierarchy.delete();
    }
}

function detectDocument(src, options) {
    var detectSrc = resizeForDetection(src, 500);
    var detectGray = new cv.Mat();
    var allCandidates = [];

    try {
        /* Gray + RGBA của ảnh detect — mọi candidate được chấm thêm điểm
           "bám biên thật" và "ruột là giấy" (xem edgeSupportInfo /
           interiorPaperFraction) */
        cv.cvtColor(detectSrc, detectGray, cv.COLOR_RGBA2GRAY);
        EDGE_GRAY_MAT = detectGray;
        DETECT_RGBA_MAT = detectSrc;

        var detectRegions = createDetectionRegions(
            detectSrc.cols,
            detectSrc.rows,
            options.assumeCenteredDocument,
        );

        for (var i = 0; i < detectRegions.length; i++) {
            var regionRect = detectRegions[i];
            var useFullFrame =
                regionRect.x === 0 &&
                regionRect.y === 0 &&
                regionRect.width === detectSrc.cols &&
                regionRect.height === detectSrc.rows;
            var regionView = null;
            var regionMat = detectSrc;
            var candidate = null;

            try {
                if (!useFullFrame) {
                    regionView = detectSrc.roi(
                        new cv.Rect(
                            regionRect.x,
                            regionRect.y,
                            regionRect.width,
                            regionRect.height,
                        ),
                    );
                    regionMat = regionView.clone();
                }

                candidate = detectDocumentInRegion(
                    regionMat,
                    regionRect,
                    detectSrc.cols,
                    detectSrc.rows,
                    src,
                    options,
                );
            } finally {
                if (!useFullFrame) {
                    regionMat.delete();
                    regionView.delete();
                }
            }

            if (candidate && candidate.length) {
                allCandidates = allCandidates.concat(candidate);
            }
        }

        if (!allCandidates.length) {
            debugLog("detectDocument: no 4-point contour found");
            return null;
        }

        /* Guard chấp nhận: quad phải bám biên thật VÀ ruột phải là giấy.
           Duyệt lần lượt theo thứ hạng điểm — candidate điểm cao nhất có thể
           là vùng bóng đổ/nền lớn trong khi quad ĐÚNG xếp ngay sau (13.jpg).
           Không candidate nào đạt → trả null để người dùng kéo tay 4 góc,
           vẫn hơn auto-crop sai be bét. */
        allCandidates.sort(function (a, b) {
            if (a.tier !== b.tier) return a.tier - b.tier;
            return b.score - a.score;
        });

        for (var c = 0; c < allCandidates.length && c < 12; c++) {
            var ordered = orderPoints(allCandidates[c].points);
            var support = edgeSupportInfo(ordered, src.cols, src.rows);
            var paper = interiorPaperFraction(ordered, src.cols, src.rows);
            /* Tầng 2 (cứu hộ) phải bám biên RÕ hơn hẳn tầng 1: nó chỉ được
               dùng khi mọi chiến lược hình học đã thất bại, tức là ta vốn
               đang không chắc — nhận bừa một quad mờ nhạt còn tệ hơn trả null
               để người dùng kéo tay (5.jpg — quad sai lọt qua với support
               0.26, trong khi quad đúng của 13.jpg đạt 0.73). */
            var minSupport = allCandidates[c].tier === 2 ? 0.45 : 0.18;
            var accepted =
                support.mean >= minSupport &&
                support.min >= 0.05 &&
                paper >= 0.35;

            debugLog(
                "detectDocument: candidate",
                c,
                "tier",
                allCandidates[c].tier,
                accepted ? "ACCEPT" : "reject",
                "score",
                allCandidates[c].score.toFixed(0),
                "support",
                support.mean.toFixed(2),
                "min",
                support.min.toFixed(2),
                "paper",
                paper.toFixed(2),
                "quad",
                ordered
                    .map(function (p) {
                        return Math.round(p.x) + "," + Math.round(p.y);
                    })
                    .join(" "),
            );

            if (accepted) {
                /* Detect chạy ở ~500px nên góc scale lên full-res lệch nhiều
                   px — refine bằng gradient full-res quanh biên thô */
                return refineQuadFullRes(src, allCandidates[c].points);
            }
        }

        return null;
    } catch (err) {
        debugLog("detectDocument failed:", err);
        return null;
    } finally {
        EDGE_GRAY_MAT = null;
        DETECT_RGBA_MAT = null;
        detectGray.delete();
        detectSrc.delete();
    }
}

/**
 * Apply only the perspective transform.
 * Separated from warpDocument so the debug pipeline can capture the
 * intermediate warped image before refine/upscale run.
 * Caller owns the returned Mat.
 */
/* ══════════════════════════════════════════
   D1b — Metric rectification
   Chụp xiên làm cạnh gần dài hơn cạnh xa → lấy max cạnh đối diện cho ra
   tỉ lệ méo (A4 thành ~1:1.2). Từ 4 góc + giả định pinhole camera có
   principal point ở giữa ảnh, tính được tỉ lệ THẬT của hình chữ nhật gốc
   (phương pháp whiteboard scanning của Zhang & He).
   ══════════════════════════════════════════ */

function estimateAspectRatio(ordered, imageCols, imageRows) {
    function cross(a, b) {
        return [
            a[1] * b[2] - a[2] * b[1],
            a[2] * b[0] - a[0] * b[2],
            a[0] * b[1] - a[1] * b[0],
        ];
    }
    function dot3(a, b) {
        return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
    }

    var u0 = imageCols / 2;
    var v0 = imageRows / 2;
    /* m1=TL m2=TR m3=BL m4=BR — toạ độ đã dời về principal point */
    var m1 = [ordered[0].x - u0, ordered[0].y - v0, 1];
    var m2 = [ordered[1].x - u0, ordered[1].y - v0, 1];
    var m3 = [ordered[3].x - u0, ordered[3].y - v0, 1];
    var m4 = [ordered[2].x - u0, ordered[2].y - v0, 1];

    var denom2 = dot3(cross(m2, m4), m3);
    var denom3 = dot3(cross(m3, m4), m2);
    if (Math.abs(denom2) < 1e-8 || Math.abs(denom3) < 1e-8) return null;

    var k2 = dot3(cross(m1, m4), m3) / denom2;
    var k3 = dot3(cross(m1, m4), m2) / denom3;
    var n2 = [k2 * m2[0] - m1[0], k2 * m2[1] - m1[1], k2 * m2[2] - m1[2]];
    var n3 = [k3 * m3[0] - m1[0], k3 * m3[1] - m1[1], k3 * m3[2] - m1[2]];

    /* n2z/n3z ~ 0 → gần chụp thẳng (affine), không có tín hiệu phối cảnh */
    if (Math.abs(n2[2]) < 1e-6 || Math.abs(n3[2]) < 1e-6) return null;

    var f2 = -(n2[0] * n3[0] + n2[1] * n3[1]) / (n2[2] * n3[2]);
    if (!isFinite(f2) || f2 <= 0) return null;

    /* Sanity: focal ước lượng phải trong dải hợp lý của camera thật */
    var f = Math.sqrt(f2);
    var maxDim = Math.max(imageCols, imageRows);
    if (f < maxDim * 0.3 || f > maxDim * 6) return null;

    var numerator = n2[0] * n2[0] + n2[1] * n2[1] + n2[2] * n2[2] * f2;
    var denominator = n3[0] * n3[0] + n3[1] * n3[1] + n3[2] * n3[2] * f2;
    if (numerator <= 0 || denominator <= 0) return null;

    return Math.sqrt(numerator / denominator); // width / height
}

function warpPerspective(src, pts, allowMetricRectification) {
    var ordered = orderPoints(pts);
    var topLeft = ordered[0];
    var topRight = ordered[1];
    var bottomRight = ordered[2];
    var bottomLeft = ordered[3];
    var maxWidth = Math.max(
        dist(topLeft, topRight),
        dist(bottomLeft, bottomRight),
    );
    var maxHeight = Math.max(
        dist(topLeft, bottomLeft),
        dist(topRight, bottomRight),
    );

    /* Sửa tỉ lệ theo metric rectification, giữ nguyên "ngân sách pixel".
       Chỉ áp khi ảnh có phối cảnh thật (cạnh đối diện lệch ≥6%) — chụp gần
       thẳng thì công thức bất ổn định, tỉ lệ đo trực tiếp đã đúng sẵn.

       Và CHỈ áp cho góc do detect tự tìm (đã refine ở full-res). Với góc người
       dùng KÉO TAY thì tắt: phương pháp Zhang giả định tứ giác là phép chiếu
       chính xác của hình chữ nhật nên cực nhạy với sai số góc — kéo lệch vài px
       trên preview thu nhỏ đã thành hàng chục px ở full-res, cho ra tỉ lệ sai
       rồi kéo giãn ảnh (hệ số tới ±70%). Người dùng báo "khoanh tay thì ảnh bị
       méo" chính là ca này; kéo tay vốn là đường thoát khi detect sai, làm méo
       thêm ở đó là hỏng đúng chỗ cần chắc chắn nhất. */
    var perspectiveStrength = Math.max(
        dist(topLeft, topRight) / Math.max(1, dist(bottomLeft, bottomRight)),
        dist(bottomLeft, bottomRight) / Math.max(1, dist(topLeft, topRight)),
        dist(topLeft, bottomLeft) / Math.max(1, dist(topRight, bottomRight)),
        dist(topRight, bottomRight) / Math.max(1, dist(topLeft, bottomLeft)),
    );
    var metricRatio =
        allowMetricRectification && perspectiveStrength >= 1.06
            ? estimateAspectRatio(ordered, src.cols, src.rows)
            : null;
    if (!metricRatio && allowMetricRectification && perspectiveStrength >= 1.06) {
        debugLog(
            "metric rectification: unstable (persp",
            perspectiveStrength.toFixed(3),
            ") — dùng tỉ lệ đo trực tiếp",
        );
    }
    if (metricRatio) {
        var measuredRatio = maxWidth / Math.max(1, maxHeight);
        var correction = metricRatio / measuredRatio;
        if (correction > 0.6 && correction < 1.7) {
            var area = maxWidth * maxHeight;
            maxWidth = Math.sqrt(area * metricRatio);
            maxHeight = maxWidth / metricRatio;
            debugLog(
                "metric rectification: measured",
                measuredRatio.toFixed(3),
                "→ metric",
                metricRatio.toFixed(3),
            );
        }
    }

    var width = Math.max(1, Math.round(maxWidth));
    var height = Math.max(1, Math.round(maxHeight));

    if (width < 100 || height < 100) {
        throw new Error("Warp target too small");
    }

    var srcMat = cv.matFromArray(4, 1, cv.CV_32FC2, [
        topLeft.x, topLeft.y,
        topRight.x, topRight.y,
        bottomRight.x, bottomRight.y,
        bottomLeft.x, bottomLeft.y,
    ]);
    var dstMat = cv.matFromArray(4, 1, cv.CV_32FC2, [
        0, 0,
        width - 1, 0,
        width - 1, height - 1,
        0, height - 1,
    ]);
    var matrix = cv.getPerspectiveTransform(srcMat, dstMat);
    var warped = new cv.Mat();

    cv.warpPerspective(
        src,
        warped,
        matrix,
        new cv.Size(width, height),
        cv.INTER_CUBIC,
        cv.BORDER_REPLICATE,
        new cv.Scalar(),
    );

    srcMat.delete();
    dstMat.delete();
    matrix.delete();

    return warped;
}

/* ══════════════════════════════════════════
   D1c — Tự xoay cho chữ nằm ngang
   Sau warp, nếu các dòng chữ chạy dọc (giấy đặt ngang 90° so với camera):
   - Hướng dòng chữ đo bằng coefficient-of-variation của profile hàng/cột
     (dòng ngang → profile hàng nhấp nhô mạnh).
   - Chiều xoay (CW/CCW) chọn theo trọng tâm mực trong từng dòng: chữ
     Latin/Việt đứng đúng chiều dồn mực về nửa DƯỚI hộp dòng (thân chữ
     x-height nằm sát baseline ở đáy hộp).
   ══════════════════════════════════════════ */

function buildAxisProfile(bin, axis) {
    var data = bin.data;
    var cols = bin.cols;
    var rows = bin.rows;
    var length = axis === "row" ? rows : cols;
    var profile = new Float64Array(length);

    for (var y = 0; y < rows; y++) {
        var base = y * cols;
        for (var x = 0; x < cols; x++) {
            if (data[base + x]) {
                profile[axis === "row" ? y : x] += 1;
            }
        }
    }
    return profile;
}

function profileCV(profile) {
    var start = Math.round(profile.length * 0.05);
    var end = profile.length - start;
    var count = Math.max(1, end - start);
    var mean = 0;
    for (var i = start; i < end; i++) mean += profile[i];
    mean /= count;
    if (mean < 1e-6) return 0;

    var variance = 0;
    for (i = start; i < end; i++) {
        var delta = profile[i] - mean;
        variance += delta * delta;
    }
    return Math.sqrt(variance / count) / mean;
}

/**
 * Điểm bất đối xứng quầng mực quanh lõi dòng chữ:
 * score = (quầng trên − quầng dưới)/(tổng) trong [−1..1].
 * LƯU Ý DẤU: với ngưỡng core hiện tại (0.45 × max-đã-loại-graphic), đo
 * thực nghiệm trên 3 mẫu độc lập cho kết quả NHẤT QUÁN: bản LỘN NGƯỢC cho
 * điểm DƯƠNG (+0.13..+0.22), bản đứng đúng cho điểm ÂM. Dấu này phụ thuộc
 * ngưỡng segmentation (sweep cho thấy lật dấu quanh core 0.5) — nếu đổi
 * ngưỡng phải đo lại bằng harness (scripts/scan-harness.mjs).
 * Caller yêu cầu margin giữa 2 hướng trước khi tin.
 */
function lineHaloScore(bin) {
    var profile = buildAxisProfile(bin, "row");

    /* Ngưỡng loại dải graphic (banner đen, khung bảng đậm): mực gần kín
       chiều ngang hoặc dải quá dày so với dòng chữ */
    var solidThreshold = bin.cols * 0.7;
    var maxLineHeight = Math.max(14, Math.round(bin.rows * 0.05));

    /* max để đặt ngưỡng dòng phải loại hàng graphic trước — banner đen kéo
       max lên cao làm mọi dòng chữ rớt ngưỡng */
    var max = 0;
    for (var i = 0; i < profile.length; i++) {
        if (profile[i] > max && profile[i] <= solidThreshold) {
            max = profile[i];
        }
    }
    if (max < 4) return { score: 0, lineCount: 0 };

    var coreThreshold = max * 0.45;
    var haloThreshold = max * 0.1;
    var haloAbove = 0;
    var haloBelow = 0;
    var lineCount = 0;
    var y = 0;

    while (y < profile.length) {
        if (profile[y] <= coreThreshold) {
            y++;
            continue;
        }
        var y0 = y;
        var peak = 0;
        while (y < profile.length && profile[y] > coreThreshold) {
            if (profile[y] > peak) peak = profile[y];
            y++;
        }
        var y1 = y - 1;
        var height = y1 - y0 + 1;
        if (height < 4) continue;
        /* Dải graphic — bỏ, không phải dòng chữ */
        if (height > maxLineHeight || peak > solidThreshold) continue;
        lineCount++;

        var band = Math.max(2, Math.round(height * 0.6));
        for (var k = 1; k <= band; k++) {
            var above = y0 - k;
            var below = y1 + k;
            if (
                above >= 0 &&
                profile[above] > haloThreshold &&
                profile[above] <= coreThreshold
            ) {
                haloAbove += profile[above];
            }
            if (
                below < profile.length &&
                profile[below] > haloThreshold &&
                profile[below] <= coreThreshold
            ) {
                haloBelow += profile[below];
            }
        }
    }

    var haloTotal = haloAbove + haloBelow;
    return {
        score: haloTotal > 0 ? (haloAbove - haloBelow) / haloTotal : 0,
        lineCount: lineCount,
    };
}

/* ── Ghi chú của lần processImage gần nhất ──
   Kênh phụ để UI cảnh báo khi pipeline phải ĐOÁN thay vì biết chắc.
   processImage reset ở đầu mỗi lần chạy; message handler gửi kèm kết quả. */
var processNotes = null;

function resetProcessNotes() {
    processNotes = {
        /* biên tài liệu: tìm được hay đang dùng nguyên ảnh gốc */
        documentDetected: false,
        /* "none" = không xoay | "high" = tin | "low" = đoán, cần người xem lại */
        rotationConfidence: "none",
    };
}

function noteRotation(confidence) {
    if (processNotes) processNotes.rotationConfidence = confidence;
}

/** Trả mat mới đã xoay đứng, hoặc chính src nếu không cần xoay. */
function autoRotateUpright(src) {
    var small = new cv.Mat();
    var gray = new cv.Mat();
    var bin = new cv.Mat();
    var rotatedCW = new cv.Mat();
    var rotatedCCW = new cv.Mat();

    try {
        /* 1100px: ở 700px dòng chữ chỉ ~4-5px, dấu thanh chết sau Otsu →
           tín hiệu chọn chiều gần bằng 0 */
        var scale = 1100 / Math.max(src.cols, src.rows);
        if (scale < 1) {
            cv.resize(
                src,
                small,
                new cv.Size(
                    Math.max(1, Math.round(src.cols * scale)),
                    Math.max(1, Math.round(src.rows * scale)),
                ),
                0,
                0,
                cv.INTER_AREA,
            );
        } else {
            src.copyTo(small);
        }

        cv.cvtColor(small, gray, cv.COLOR_RGBA2GRAY);
        cv.threshold(gray, bin, 0, 255, cv.THRESH_BINARY_INV + cv.THRESH_OTSU);

        /* Cần lượng mực hợp lý — quá ít (trang trắng) hay quá nhiều
           (ảnh/nền tối) đều không đủ tin cậy để xoay */
        var data = bin.data;
        var ink = 0;
        for (var i = 0; i < data.length; i++) {
            if (data[i]) ink++;
        }
        var inkRatio = ink / data.length;
        if (inkRatio < 0.004 || inkRatio > 0.4) {
            debugLog("autoRotateUpright: skip, inkRatio", inkRatio.toFixed(4));
            return src;
        }

        var rowCV = profileCV(buildAxisProfile(bin, "row"));
        var colCV = profileCV(buildAxisProfile(bin, "col"));
        if (!(colCV > rowCV * 1.3)) {
            /* chữ đã nằm ngang */
            /* Không thử lật 180° ở đây: đo trên bộ mẫu cho thấy lineHaloScore
               KHÔNG phân biệt được xuôi/ngược (9.jpg xuôi cho +0.104 còn
               12.jpg ngược cho -0.161 — ngược hẳn quy ước, không ngưỡng nào
               tách được). Phát hiện 180° cần OSD thật, xem ghi chú E5 trong
               .ai/tasks/TASK-001.md. */
            debugLog(
                "autoRotateUpright: ngang sẵn, rowCV",
                rowCV.toFixed(3),
                "colCV",
                colCV.toFixed(3),
            );
            return src;
        }

        /* Đến đây: chữ chắc chắn nằm DỌC → phải xoay 90°, chỉ còn hỏi chiều.
           Chữ dọc không đọc được, nên kể cả khi không chắc chiều vẫn xoay
           (mặc định CW) — lộn 180° vẫn hơn nằm ngang — nhưng đánh dấu
           rotationConfidence = "low" để UI nhắc người dùng kiểm tra. */
        cv.rotate(bin, rotatedCW, cv.ROTATE_90_CLOCKWISE);
        cv.rotate(bin, rotatedCCW, cv.ROTATE_90_COUNTERCLOCKWISE);
        var scoreCW = lineHaloScore(rotatedCW);
        var scoreCCW = lineHaloScore(rotatedCCW);

        /* rotatedCCW là bản xoay 180° của rotatedCW nên haloAbove/haloBelow
           hoán vị → scoreCCW = −scoreCW. Quyết định rút gọn về dấu + biên độ
           của scoreCW; chọn hướng có điểm ÂM hơn (ghi chú dấu ở lineHaloScore). */
        var halo = scoreCW.score;
        var enoughLines = scoreCW.lineCount >= 4 || scoreCCW.lineCount >= 4;
        var confident = enoughLines && Math.abs(halo) >= SCAN_ROTATE_HALO_MIN;

        var direction =
            confident && halo > 0
                ? cv.ROTATE_90_COUNTERCLOCKWISE
                : cv.ROTATE_90_CLOCKWISE;

        debugLog(
            "autoRotateUpright: rowCV",
            rowCV.toFixed(3),
            "colCV",
            colCV.toFixed(3),
            "halo",
            halo.toFixed(3),
            "lines",
            Math.max(scoreCW.lineCount, scoreCCW.lineCount),
            confident
                ? "→ tin, xoay " + (halo > 0 ? "CCW" : "CW")
                : "→ KHÔNG chắc chiều (" +
                      (enoughLines
                          ? "|halo| < " + SCAN_ROTATE_HALO_MIN
                          : "quá ít dòng chữ") +
                      "), mặc định CW",
        );
        noteRotation(confident ? "high" : "low");

        var output = new cv.Mat();
        cv.rotate(src, output, direction);
        return output;
    } catch (err) {
        debugLog("autoRotateUpright failed:", err);
        return src;
    } finally {
        small.delete();
        gray.delete();
        bin.delete();
        rotatedCW.delete();
        rotatedCCW.delete();
    }
}

function warpDocument(src, pts, options, allowMetricRectification) {
    var warped = warpPerspective(src, pts, allowMetricRectification);
    var refined = refineWarpedCrop(warped, options.assumeCenteredDocument);
    warped.delete();
    var upright = autoRotateUpright(refined);
    if (upright !== refined) refined.delete();
    var upscaled = upscaleAfterWarp(upright);
    upright.delete();
    return upscaled;
}

function normalizeCorners(corners, cols, rows) {
    if (!corners || corners.length !== 4) return null;

    var normalized = [];
    for (var i = 0; i < corners.length; i++) {
        var point = corners[i];
        if (!point || !isFinite(point.x) || !isFinite(point.y)) {
            return null;
        }
        normalized.push({
            x: clampPoint(point.x, cols),
            y: clampPoint(point.y, rows),
        });
    }

    return orderPoints(normalized);
}

function detectImage(imageData, options) {
    var src = cv.matFromImageData(imageData);

    try {
        return {
            corners: detectDocument(src, options),
            width: src.cols,
            height: src.rows,
        };
    } finally {
        src.delete();
    }
}

/* ══════════════════════════════════════════
   Image Processing Entry
   ══════════════════════════════════════════ */

function processImage(imageData, options, manualCorners) {
    var src = cv.matFromImageData(imageData);
    resetProcessNotes();

    try {
        var points = normalizeCorners(manualCorners, src.cols, src.rows);
        var isManual = !!points;

        if (!points && options.detectDocument) {
            points = detectDocument(src, options);
        }

        if (points && points.length === 4) {
            processNotes.documentDetected = true;
            try {
                var warped = warpDocument(src, points, options, !isManual);
                src.delete();
                src = warped;
            } catch (err) {
                processNotes.documentDetected = false;
                debugLog("warpDocument failed, keeping original:", err);
            }
        } else if (options.detectDocument) {
            debugLog("processImage: fallback to original image");
        }

        if (options.skipScanFilter) {
            var result = new ImageData(
                new Uint8ClampedArray(src.data),
                src.cols,
                src.rows,
            );
            src.delete();
            return result;
        }

        var dst = applyScanFilter(src);
        src.delete();

        var result = new ImageData(
            new Uint8ClampedArray(dst.data),
            dst.cols,
            dst.rows,
        );
        dst.delete();

        return result;
    } catch (err) {
        src.delete();
        throw err;
    }
}

/* ══════════════════════════════════════════
   Message Handler
   ══════════════════════════════════════════ */

self.onmessage = function (e) {
    var msg = e.data;

    if (msg.type === "init") {
        initOpenCV()
            .then(function () {
                self.postMessage({ type: "ready" });
            })
            .catch(function (err) {
                self.postMessage({
                    type: "error",
                    message: err.message || "OpenCV init failed",
                });
            });
        return;
    }

    if (msg.type === "process") {
        try {
            var result = processImage(
                msg.imageData,
                msg.options,
                msg.manualCorners || null,
            );
            self.postMessage(
                {
                    type: "result",
                    id: msg.id,
                    imageData: result,
                    notes: processNotes,
                },
                [result.data.buffer],
            );
        } catch (err) {
            self.postMessage({
                type: "processError",
                id: msg.id,
                message: err.message || "Processing failed",
            });
        }
        return;
    }

    if (msg.type === "detect") {
        try {
            var detection = detectImage(msg.imageData, msg.options);
            self.postMessage({
                type: "detectResult",
                id: msg.id,
                corners: detection.corners,
                width: detection.width,
                height: detection.height,
            });
        } catch (err) {
            self.postMessage({
                type: "detectError",
                id: msg.id,
                message: err.message || "Detection failed",
            });
        }
        return;
    }

};
