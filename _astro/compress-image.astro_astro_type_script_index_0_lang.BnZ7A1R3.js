const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["_astro/jszip.min.DCMMBso7.js","_astro/rolldown-runtime.DAXXjFlN.js"])))=>i.map(i=>d[i]);
import { o as e } from "./rolldown-runtime.DAXXjFlN.js";
import { t } from "./preload-helper.L5lOfJxi.js";
(async ()=>{
    function n(e) {
        return e < 1024 ? e + ` B` : e < 1024 * 1024 ? (e / 1024).toFixed(1) + ` KB` : (e / (1024 * 1024)).toFixed(2) + ` MB`;
    }
    var r = {
        png: `image/png`,
        jpeg: `image/jpeg`,
        webp: `image/webp`,
        avif: `image/avif`
    }, i = {
        png: `png`,
        jpeg: `jpg`,
        webp: `webp`,
        avif: `avif`
    }, a = new Map, o = 0, s = !1, c = [], l = `reduce-size`, u = new Worker(new URL(`/_astro/worker-bS1_sCEI.js`, `` + import.meta.url), {
        type: `module`
    }), d = document.getElementById(`cimg-dropzone`), f = document.getElementById(`cimg-file-input`), p = document.getElementById(`cimg-select-btn`), m = document.getElementById(`cimg-files-section`), h = document.getElementById(`cimg-file-count`), g = document.getElementById(`cimg-file-list`), _ = document.getElementById(`cimg-add-more`), v = document.getElementById(`cimg-compress-all`), y = document.getElementById(`cimg-download-all`), b = document.getElementById(`cimg-file-row-tpl`), x = document.querySelectorAll(`.cimg-mode__tab`), S = document.getElementById(`cimg-panel-reduce`), C = document.getElementById(`cimg-panel-convert`);
    document.getElementById(`cimg-mode`);
    var w = document.getElementById(`cimg-options`), T = document.getElementById(`cimg-stats`), E = document.getElementById(`cimg-stats-count`), D = document.getElementById(`cimg-stats-original`), O = document.getElementById(`cimg-stats-compressed`), k = document.getElementById(`cimg-stats-reduction`);
    function A() {
        if (l === `reduce-size`) return {
            mode: `reduce-size`,
            level: document.querySelector(`input[name="cimg-reduce-level"]:checked`)?.value || `balanced`,
            targetFormat: `webp`
        };
        let e = document.querySelector(`input[name="cimg-format"]:checked`);
        return {
            mode: `convert-format`,
            level: document.querySelector(`input[name="cimg-convert-level"]:checked`)?.value || `balanced`,
            targetFormat: e?.value || `webp`
        };
    }
    x.forEach((e)=>{
        e.addEventListener(`click`, ()=>{
            if (s) return;
            let t = e.dataset.mode;
            t !== l && (l = t, x.forEach((e)=>e.classList.remove(`cimg-mode__tab--active`)), e.classList.add(`cimg-mode__tab--active`), t === `reduce-size` ? (S.style.display = ``, C.style.display = `none`) : (S.style.display = `none`, C.style.display = ``));
        });
    });
    function j() {
        let e = a.size;
        m.style.display = e > 0 ? `` : `none`, d.style.display = e > 0 ? `none` : ``, h.textContent = e + ` ảnh`, y.disabled = [
            ...a.values()
        ].filter((e)=>e.results).length === 0, v.disabled = [
            ...a.values()
        ].filter((e)=>!e.results).length === 0 || s, s ? (x.forEach((e)=>e.classList.add(`cimg-mode__tab--disabled`)), w.classList.add(`cimg-options--disabled`)) : (x.forEach((e)=>e.classList.remove(`cimg-mode__tab--disabled`)), w.classList.remove(`cimg-options--disabled`)), M();
    }
    function M() {
        let e = [
            ...a.values()
        ].filter((e)=>e.results);
        if (e.length === 0) {
            T.style.display = `none`;
            return;
        }
        T.style.display = ``;
        let t = e.reduce((e, t)=>e + t.originalSize, 0), r = e.reduce((e, t)=>e + (t.bestSize || 0), 0), i = t > 0 ? Math.round((t - r) / t * 100) : 0;
        E.textContent = String(e.length), D.textContent = n(t), O.textContent = n(r), k.textContent = i + `%`;
    }
    function N(e) {
        let t = b.content.cloneNode(!0).querySelector(`.cimg-file`);
        t.dataset.id = e.id;
        let r = t.querySelector(`.cimg-file__img`);
        r.src = URL.createObjectURL(e.file), r.alt = e.file.name, t.querySelector(`.cimg-file__name`).textContent = e.file.name, t.querySelector(`.cimg-file__size`).textContent = n(e.file.size);
        let i = t.querySelector(`.cimg-file__status`);
        i.textContent = `Chờ nén`;
        let o = t.querySelector(`.cimg-file__compress-one`);
        return o.addEventListener(`click`, ()=>{
            e.results || (c.includes(e.id) || c.push(e.id), o.disabled = !0, L());
        }), t.querySelector(`.cimg-file__remove`).addEventListener(`click`, ()=>{
            let n = t.querySelector(`.cimg-file__img`);
            n?.src && URL.revokeObjectURL(n.src);
            let r = t.querySelector(`.cimg-file__preview-original`);
            r?.src && r.src !== location.href && URL.revokeObjectURL(r.src);
            let i = t.querySelector(`.cimg-file__preview-compressed`);
            i?.src && i.src !== location.href && URL.revokeObjectURL(i.src), a.delete(e.id), t.remove(), j();
        }), t;
    }
    function P(e, t, n) {
        let r = g.querySelector(`[data-id="${e}"]`);
        if (!r) return;
        let i = r.querySelector(`.progress-bar__fill`), a = r.querySelector(`.cimg-file__percent`), o = r.querySelector(`.cimg-file__status`), s = r.querySelector(`.cimg-file__progress`);
        s.style.display = ``, i.style.width = t + `%`, a.textContent = t + `%`, o.textContent = n, o.className = `cimg-file__status cimg-file__status--active`;
    }
    function F(e, t) {
        let o = a.get(e);
        if (!o) return;
        o.results = t.results, o.bestFormat = t.bestFormat, o.bestBuffer = t.bestBuffer, o.bestSize = t.bestSize, o.originalSize = t.originalSize;
        let s = g.querySelector(`[data-id="${e}"]`);
        if (!s) return;
        let c = s.querySelector(`.cimg-file__progress`);
        c.style.display = `none`;
        let l = s.querySelector(`.cimg-file__result`);
        l.style.display = ``;
        let u = s.querySelector(`.cimg-file__size-compare`);
        u.textContent = `${n(t.originalSize)} → ${n(t.bestSize)}`;
        let d = s.querySelector(`.cimg-file__reduction`), f = t.originalSize - t.bestSize, p = t.originalSize > 0 ? Math.round(f / t.originalSize * 100) : 0, m = t.bestFormat.toUpperCase();
        f > 0 ? d.textContent = `Giảm ${p}% — Định dạng: ${m}` : d.textContent = `Ảnh đã được tối ưu sẵn — Định dạng: ${m}`;
        let h = s.querySelector(`.cimg-file__compress-one`);
        h.hidden = !0;
        let _ = s.querySelector(`.cimg-file__download`);
        _.disabled = !1, _.querySelector(`.cimg-file__dl-label`).textContent = `Tải ${m}`, _.addEventListener(`click`, ()=>{
            if (!o.bestBuffer || !o.bestFormat) return;
            let e = new Blob([
                o.bestBuffer
            ], {
                type: r[o.bestFormat] || `application/octet-stream`
            }), t = document.createElement(`a`);
            t.href = URL.createObjectURL(e), t.download = `${o.file.name.replace(/\.\w+$/, ``)}-compressed.${i[o.bestFormat] || o.bestFormat}`, t.click(), URL.revokeObjectURL(t.href);
        });
        let v = s.querySelector(`.cimg-file__preview-btn`);
        v.style.display = ``;
        let y = s.querySelector(`.cimg-file__preview`), b = s.querySelector(`.cimg-file__preview-original`), x = s.querySelector(`.cimg-file__preview-compressed`);
        v.addEventListener(`click`, ()=>{
            let e = y.style.display !== `none`;
            if (y.style.display = e ? `none` : ``, v.classList.toggle(`cimg-file__preview-btn--active`, !e), !e && ((!b.src || b.src === location.href) && (b.src = URL.createObjectURL(o.file)), (!x.src || x.src === location.href) && o.bestBuffer && o.bestFormat)) {
                let e = r[o.bestFormat] || `application/octet-stream`, t = new Blob([
                    o.bestBuffer
                ], {
                    type: e
                });
                x.src = URL.createObjectURL(t);
            }
        }), j();
    }
    function I(e, t) {
        let n = g.querySelector(`[data-id="${e}"]`);
        if (!n) return;
        let r = n.querySelector(`.cimg-file__status`);
        r.textContent = `Lỗi: ` + t, r.className = `cimg-file__status cimg-file__status--error`;
        let i = n.querySelector(`.progress-bar__fill`);
        i.style.width = `0%`;
        let a = n.querySelector(`.cimg-file__percent`);
        a.textContent = ``;
    }
    function L() {
        if (s || c.length === 0) {
            !s && c.length === 0 && j();
            return;
        }
        let e = c.shift(), t = a.get(e);
        if (!t) {
            L();
            return;
        }
        s = !0, j();
        let n = A();
        t.file.arrayBuffer().then((e)=>{
            u.postMessage({
                type: `compress`,
                id: t.id,
                buffer: e,
                fileName: t.file.name,
                mimeType: t.file.type,
                options: n
            }, [
                e
            ]);
        });
    }
    u.onmessage = (e)=>{
        let t = e.data;
        switch(t.type){
            case `ready`:
                break;
            case `progress`:
                P(t.id, t.pct, t.status);
                break;
            case `result`:
                F(t.id, t), s = !1, L();
                break;
            case `error`:
                I(t.id, t.message), s = !1, L();
                break;
        }
    }, u.postMessage({
        type: `init`
    });
    function R(e) {
        for (let t of e){
            if (a.size >= 20) {
                alert(`Chỉ được tải tối đa 20 file.`);
                break;
            }
            if (!t.type.match(/^image\/(png|jpeg)$/)) continue;
            if (t.size > 31457280) {
                alert(`"${t.name}" quá lớn (${n(t.size)}). Giới hạn tối đa là 30 MB.`);
                continue;
            }
            let e = String(o++), r = {
                id: e,
                file: t,
                results: null,
                bestFormat: null,
                bestBuffer: null,
                bestSize: null,
                originalSize: t.size
            };
            a.set(e, r);
            let i = N(r);
            g.appendChild(i);
        }
        j();
    }
    p.addEventListener(`click`, (e)=>{
        e.stopPropagation(), f.click();
    }), d.addEventListener(`click`, (e)=>{
        p.contains(e.target) || f.click();
    }), f.addEventListener(`change`, ()=>{
        f.files && R(f.files), f.value = ``;
    }), _.addEventListener(`click`, ()=>f.click()), d.addEventListener(`dragover`, (e)=>{
        e.preventDefault(), d.classList.add(`upload-zone--dragover`);
    }), d.addEventListener(`dragleave`, ()=>d.classList.remove(`upload-zone--dragover`)), d.addEventListener(`drop`, (e)=>{
        e.preventDefault(), d.classList.remove(`upload-zone--dragover`), e.dataTransfer?.files && R(e.dataTransfer.files);
    }), v.addEventListener(`click`, ()=>{
        for (let [e, t] of a)t.results || c.push(e);
        L();
    }), y.addEventListener(`click`, async ()=>{
        let n = (await t(async ()=>{
            let { default: t } = await import(`./jszip.min.DCMMBso7.js`).then(async (m)=>{
                await m.__tla;
                return m;
            }).then((t)=>e(t.t(), 1));
            return {
                default: t
            };
        }, __vite__mapDeps([0,1]))).default, r = new n;
        for (let e of a.values()){
            if (!e.bestBuffer || !e.bestFormat) continue;
            let t = e.file.name.replace(/\.\w+$/, ``), n = i[e.bestFormat] || e.bestFormat;
            r.file(`${t}-compressed.${n}`, e.bestBuffer);
        }
        let o = await r.generateAsync({
            type: `blob`
        }), s = document.createElement(`a`);
        s.href = URL.createObjectURL(o), s.download = `images-compressed.zip`, s.click(), URL.revokeObjectURL(s.href);
    });
})();
