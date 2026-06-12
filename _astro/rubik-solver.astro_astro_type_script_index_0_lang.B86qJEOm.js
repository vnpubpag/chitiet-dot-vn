const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["_astro/rubik3d.CA97ajPw.js","_astro/preload-helper.CVfkMyKi.js"])))=>i.map(i=>d[i]);
import { _ as ke } from "./preload-helper.CVfkMyKi.js";
let w;
let __tla = (async ()=>{
    let R, Y, Z, ee, Ce, y, te, ue;
    w = [
        "U",
        "R",
        "F",
        "D",
        "L",
        "B"
    ];
    R = [
        "c1",
        "c2",
        "c3",
        "c4",
        "c5",
        "c6"
    ];
    Y = {
        U: "c1",
        R: "c2",
        F: "c3",
        D: "c4",
        L: "c5",
        B: "c6"
    };
    Z = {
        c1: "U",
        c2: "R",
        c3: "F",
        c4: "D",
        c5: "L",
        c6: "B"
    };
    ee = {
        U: "Trên (U)",
        D: "Dưới (D)",
        F: "Trước (F)",
        B: "Sau (B)",
        L: "Trái (L)",
        R: "Phải (R)"
    };
    Ce = {
        c1: "#FFFFFF",
        c2: "#B71234",
        c3: "#009B48",
        c4: "#FFD500",
        c5: "#FF5800",
        c6: "#0046AD"
    };
    y = 54;
    te = 9;
    ue = 4;
    function fe(t, e) {
        return w.indexOf(t) * te + e;
    }
    function se(t) {
        return fe(t, ue);
    }
    function Re(t) {
        return t % te === ue;
    }
    function de() {
        return {
            facelets: new Array(y).fill(null)
        };
    }
    function he() {
        const t = de();
        for (const e of w)t.facelets[se(e)] = Y[e];
        return t;
    }
    function Fe() {
        const t = de();
        for (const e of w)for(let s = 0; s < te; s++)t.facelets[fe(e, s)] = Y[e];
        return t;
    }
    function Te(t, e, s) {
        t.facelets[e] = s;
    }
    function Be(t, e) {
        t.facelets[e] = null;
    }
    function Pe(t) {
        const e = he();
        for(let s = 0; s < y; s++)t.facelets[s] = e.facelets[s];
    }
    function pe(t) {
        const e = {};
        for (const s of R)e[s] = 0;
        for (const s of t.facelets)s && e[s]++;
        return e;
    }
    function _e(t) {
        let e = 0;
        for (const s of t.facelets)s && e++;
        return e;
    }
    function me(t) {
        return t.facelets.every((e)=>e !== null);
    }
    function Me(t) {
        const e = {}, s = new Set;
        for (const o of w){
            const n = t.facelets[se(o)];
            if (!n || s.has(n)) return null;
            s.add(n), e[n] = o;
        }
        return e;
    }
    function ve(t) {
        if (!me(t)) return null;
        const e = Me(t);
        if (!e) return null;
        let s = "";
        for(let o = 0; o < y; o++){
            const n = t.facelets[o];
            s += e[n];
        }
        return s;
    }
    const z = [
        [
            8,
            9,
            20
        ],
        [
            6,
            18,
            38
        ],
        [
            0,
            36,
            47
        ],
        [
            2,
            45,
            11
        ],
        [
            29,
            26,
            15
        ],
        [
            27,
            44,
            24
        ],
        [
            33,
            53,
            42
        ],
        [
            35,
            17,
            51
        ]
    ], ie = [
        "URF",
        "UFL",
        "ULB",
        "UBR",
        "DFR",
        "DLF",
        "DBL",
        "DRB"
    ], le = [
        [
            5,
            10
        ],
        [
            7,
            19
        ],
        [
            3,
            37
        ],
        [
            1,
            46
        ],
        [
            32,
            16
        ],
        [
            28,
            25
        ],
        [
            30,
            43
        ],
        [
            34,
            52
        ],
        [
            23,
            12
        ],
        [
            21,
            41
        ],
        [
            50,
            39
        ],
        [
            48,
            14
        ]
    ], A = [
        "UR",
        "UF",
        "UL",
        "UB",
        "DR",
        "DF",
        "DL",
        "DB",
        "FR",
        "FL",
        "BL",
        "BR"
    ];
    function Ae(t) {
        return `màu ${ee[Z[t]]}`;
    }
    function ce(t) {
        const e = new Array(t.length).fill(!1);
        let s = 0;
        for(let o = 0; o < t.length; o++){
            if (e[o]) continue;
            let n = o, c = 0;
            for(; !e[n];)e[n] = !0, n = t[n], c++;
            s += c - 1;
        }
        return s % 2;
    }
    function De(t) {
        const e = [], s = (r)=>t[r], o = (r)=>r === "U" || r === "D", n = new Array(8).fill(-1), c = new Array(8).fill(0);
        for(let r = 0; r < 8; r++){
            let f = 0;
            for(; f < 3 && !o(s(z[r][f])); f++);
            const M = s(z[r][(f + 1) % 3]), m = s(z[r][(f + 2) % 3]);
            for(let T = 0; T < 8; T++)if (M === ie[T][1] && m === ie[T][2]) {
                n[r] = T, c[r] = f % 3;
                break;
            }
        }
        const a = new Array(12).fill(-1), P = new Array(12).fill(0);
        for(let r = 0; r < 12; r++){
            const f = s(le[r][0]), M = s(le[r][1]);
            for(let m = 0; m < 12; m++){
                if (f === A[m][0] && M === A[m][1]) {
                    a[r] = m, P[r] = 0;
                    break;
                }
                if (f === A[m][1] && M === A[m][0]) {
                    a[r] = m, P[r] = 1;
                    break;
                }
            }
        }
        const d = n.every((r)=>r >= 0) && new Set(n).size === 8, _ = a.every((r)=>r >= 0) && new Set(a).size === 12;
        return !d || !_ ? (e.push({
            code: "impossible-pieces",
            message: "Cách tô tạo ra mảnh (góc/cạnh) trùng lặp hoặc không tồn tại trên khối Rubik thật."
        }), e) : (c.reduce((r, f)=>r + f, 0) % 3 !== 0 && e.push({
            code: "corner-twist",
            message: "Có một góc bị xoay sai hướng (tổng định hướng góc không chia hết cho 3)."
        }), P.reduce((r, f)=>r + f, 0) % 2 !== 0 && e.push({
            code: "edge-flip",
            message: "Có một cạnh bị lật ngược (số cạnh lật phải là số chẵn)."
        }), ce(n) !== ce(a) && e.push({
            code: "permutation-parity",
            message: "Sai parity hoán vị — cần hoán đổi đúng một cặp mảnh để khối có thể giải được."
        }), e);
    }
    function Oe(t) {
        const e = [], s = _e(t);
        s < y && e.push({
            code: "incomplete",
            message: `Còn ${y - s} ô chưa tô (cần đủ ${y} ô).`
        });
        const o = pe(t), n = R.filter((d)=>o[d] !== 9);
        if (s === y && n.length > 0) {
            const d = n.map((_)=>`${Ae(_)} ${o[_]}/9`).join(", ");
            e.push({
                code: "color-count",
                message: `Mỗi màu phải đúng 9 ô. Sai: ${d}.`
            });
        }
        const a = w.map((d)=>t.facelets[se(d)]).filter((d)=>d !== null);
        if (a.length === 6 && new Set(a).size !== 6 && e.push({
            code: "center-dup",
            message: "6 ô trung tâm phải là 6 màu khác nhau."
        }), e.length === 0 && me(t)) {
            const d = ve(t);
            d && e.push(...De(d));
        }
        return {
            ok: e.length === 0,
            errors: e
        };
    }
    const xe = new Set([
        "U",
        "R",
        "F",
        "D",
        "L",
        "B"
    ]);
    function ge(t, e) {
        return {
            face: t,
            suffix: e,
            notation: `${t}${e}`
        };
    }
    function Ue(t) {
        const e = t.trim();
        if (e.length < 1) return null;
        const s = e[0];
        if (!xe.has(s)) return null;
        const o = e.slice(1);
        let n;
        if (o === "") n = "";
        else if (o === "'" || o === "’") n = "'";
        else if (o === "2") n = "2";
        else return null;
        return ge(s, n);
    }
    function $e(t) {
        return t.split(/\s+/).map((e)=>e.trim()).filter(Boolean).map(Ue).filter((e)=>e !== null);
    }
    function Ne(t) {
        if (t.suffix === "2") return t;
        const e = t.suffix === "'" ? "" : "'";
        return ge(t.face, e);
    }
    function je(t) {
        return t.map((e)=>e.notation).join(" ");
    }
    class Ie {
        selection = R[0];
        container;
        palette;
        listeners = [];
        constructor(e, s){
            this.container = e, this.palette = s, this.build();
        }
        getSelection() {
            return this.selection;
        }
        onChange(e) {
            this.listeners.push(e);
        }
        build() {
            this.container.innerHTML = "";
            for (const s of R){
                const o = ee[Z[s]], n = document.createElement("button");
                n.type = "button", n.className = "rs-swatch", n.dataset.color = s, n.title = o, n.setAttribute("aria-label", o), n.style.background = this.palette[s], n.addEventListener("click", ()=>this.select(s)), this.container.appendChild(n);
            }
            const e = document.createElement("button");
            e.type = "button", e.className = "rs-swatch rs-swatch--eraser", e.dataset.color = "eraser", e.title = "Tẩy ô", e.setAttribute("aria-label", "Tẩy ô"), e.textContent = "⌫", e.addEventListener("click", ()=>this.select("eraser")), this.container.appendChild(e), this.refresh();
        }
        select(e) {
            this.selection = e, this.refresh();
            for (const s of this.listeners)s(e);
        }
        refresh() {
            this.container.querySelectorAll(".rs-swatch").forEach((e)=>{
                e.classList.toggle("rs-swatch--active", e.dataset.color === this.selection);
            });
        }
    }
    let g = null, ne = !1, Ve = 0;
    const E = new Map;
    let D = [];
    function Ee() {
        return g || (g = new Worker(new URL("/_astro/solver.worker-C1g4IsyU.js", import.meta.url), {
            type: "module"
        }), g.onmessage = (t)=>{
            const e = t.data;
            switch(e.type){
                case "ready":
                    ne = !0, D.forEach((s)=>s()), D = [];
                    break;
                case "init-error":
                    D = [];
                    break;
                case "result":
                    E.get(e.id)?.resolve(e.moves), E.delete(e.id);
                    break;
                case "error":
                    E.get(e.id)?.reject(new Error(e.message)), E.delete(e.id);
                    break;
            }
        }, g.onerror = ()=>{
            E.forEach(({ reject: t })=>t(new Error("Bộ giải gặp lỗi không xác định."))), E.clear();
        }, g.postMessage({
            type: "init"
        }), g);
    }
    function He() {
        Ee();
    }
    function ze() {
        return ne;
    }
    function We(t) {
        const e = Ee(), s = ++Ve;
        return new Promise((o, n)=>{
            E.set(s, {
                resolve: o,
                reject: n
            }), e.postMessage({
                type: "solve",
                id: s,
                facelets: t
            });
        });
    }
    function qe() {
        g?.terminate(), g = null, ne = !1, D = [], E.clear();
    }
    const Ge = {
        id: "layer",
        label: "Từng tầng (sắp có)",
        available: !1,
        async solve () {
            throw new Error("Chế độ giải từng tầng sẽ được bổ sung sau.");
        }
    }, Ke = {
        id: "fast",
        label: "Giải nhanh (Kociemba)",
        available: !0,
        async solve (t) {
            const e = ve(t);
            if (!e) throw new Error("Trạng thái khối chưa hợp lệ.");
            const s = await We(e), o = $e(s);
            return {
                mode: "fast",
                phases: [
                    {
                        name: "Giải",
                        moves: o
                    }
                ],
                moves: o
            };
        }
    }, oe = {
        fast: Ke,
        layer: Ge
    };
    function Je() {
        return Object.values(oe);
    }
    function Qe(t) {
        return oe[t];
    }
    function Xe(t, e) {
        const s = Qe(Ye(e));
        return s.available ? s.solve(t) : Promise.reject(new Error(`Chế độ "${s.label}" chưa khả dụng.`));
    }
    function Ye(t) {
        return t in oe ? t : "fast";
    }
    class Ze {
        refs;
        opts;
        result = null;
        moveEls = [];
        constructor(e, s){
            this.refs = e, this.opts = s, this.populateModes(), this.refs.solveBtn.addEventListener("click", ()=>this.runSolve()), this.refs.copyBtn.addEventListener("click", ()=>this.copy());
        }
        setValid(e) {
            this.refs.solveBtn.disabled = !e;
        }
        getResult() {
            return this.result;
        }
        reset() {
            this.result = null, this.hideSolution(), this.setStatus("", "");
        }
        setProgress(e) {
            this.moveEls.forEach((o, n)=>{
                o.classList.toggle("rs-move--done", n < e), o.classList.toggle("rs-move--current", n === e);
            });
            const s = this.moveEls.length;
            this.refs.stepInfo.textContent = s === 0 ? "0 bước" : `Bước ${Math.min(e, s)}/${s}`;
        }
        populateModes() {
            this.refs.modeSelect.innerHTML = "";
            for (const e of Je()){
                const s = document.createElement("option");
                s.value = e.id, s.textContent = e.label, s.disabled = !e.available, this.refs.modeSelect.appendChild(s);
            }
        }
        setStatus(e, s) {
            this.refs.status.textContent = e, this.refs.status.className = "rs-solver-status", s && this.refs.status.classList.add(`rs-solver-status--${s}`);
        }
        async runSolve() {
            if (!this.opts.isValid()) return;
            const e = this.refs.modeSelect.value;
            this.refs.solveBtn.disabled = !0, this.setStatus(ze() ? "Đang giải..." : "Đang khởi tạo bộ giải (lần đầu mất vài giây)...", "loading");
            try {
                const s = await Xe(this.opts.getState(), e);
                this.result = s, this.renderSolution(s), s.moves.length === 0 ? this.setStatus("Khối đã ở trạng thái đã giải.", "success") : this.setStatus(`Đã tìm thấy lời giải gồm ${s.moves.length} bước.`, "success"), this.opts.onSolved(s);
            } catch (s) {
                this.result = null, this.hideSolution(), this.setStatus(s instanceof Error ? s.message : String(s), "error");
            } finally{
                this.refs.solveBtn.disabled = !this.opts.isValid();
            }
        }
        renderSolution(e) {
            this.refs.movesEl.innerHTML = "", this.moveEls = [];
            const s = e.phases.length > 1;
            let o = 0;
            for (const n of e.phases){
                if (s) {
                    const c = document.createElement("div");
                    c.className = "rs-phase", c.textContent = n.name, this.refs.movesEl.appendChild(c);
                }
                for (const c of n.moves){
                    const a = document.createElement("span");
                    a.className = "rs-move", a.textContent = c.notation, a.dataset.index = String(o), this.refs.movesEl.appendChild(a), this.moveEls.push(a), o++;
                }
            }
            this.refs.solutionWrap.hidden = !1, this.setProgress(0);
        }
        hideSolution() {
            this.refs.solutionWrap.hidden = !0, this.refs.movesEl.innerHTML = "", this.moveEls = [];
        }
        async copy() {
            if (!this.result) return;
            const e = je(this.result.moves);
            try {
                await navigator.clipboard.writeText(e);
                const s = this.refs.copyBtn.innerHTML;
                this.refs.copyBtn.textContent = "Đã sao chép ✓", window.setTimeout(()=>{
                    this.refs.copyBtn.innerHTML = s;
                }, 1500);
            } catch  {
                this.setStatus("Không sao chép được vào clipboard.", "error");
            }
        }
    }
    const i = (t)=>document.getElementById(t);
    let x = null, h, b = {
        ...Ce
    }, be = null, L = null, Le = null, ae = !1, l = null, B = "paint", v = [], u = 0, W = [], p = !1, O = null, S = null, q = null, G = null, K = null, U = null, $ = null, N = null, J = null, Q = null, j = null, I = null;
    function F(t) {
        x && (x.dataset.step = t);
    }
    function V() {
        if (!O) return;
        const t = pe(h);
        O.innerHTML = "";
        for (const e of R){
            const s = t[e], o = document.createElement("div");
            o.className = "rs-count", o.classList.toggle("rs-count--ok", s === 9), o.title = ee[Z[e]];
            const n = document.createElement("span");
            n.className = "rs-count__dot", n.style.background = b[e];
            const c = document.createElement("span");
            c.className = "rs-count__val", c.textContent = `${s}/9`, o.append(n, c), O.appendChild(o);
        }
    }
    function H() {
        const t = Oe(h);
        if (Le = t, S) if (S.classList.remove("rs-validation--success", "rs-validation--error", "rs-validation--empty"), t.ok) S.classList.add("rs-validation--success"), S.innerHTML = '<p class="rs-validation__title">✓ Trạng thái hợp lệ — sẵn sàng giải.</p>';
        else {
            S.classList.add("rs-validation--error");
            const e = t.errors.map((s)=>`<li>${s.message}</li>`).join("");
            S.innerHTML = `<p class="rs-validation__title">Chưa thể giải:</p><ul class="rs-validation__list">${e}</ul>`;
        }
        L?.setValid(t.ok), t.ok && !ae && (ae = !0, He());
    }
    function et(t) {
        if (B !== "paint" || Re(t)) return;
        const e = be?.getSelection() ?? R[0];
        e === "eraser" ? (Be(h, t), l?.updateSticker(t, null)) : (Te(h, t, e), l?.updateSticker(t, e)), V(), H();
    }
    function Se() {
        const t = G ? Number(G.value) : 6;
        return Math.max(100, 1300 - t * 120);
    }
    function k(t) {
        K && (K.hidden = !t), U && (U.disabled = !t || u <= 0), $ && ($.disabled = !t || u >= v.length), N && (N.disabled = !t || v.length === 0), j && (j.disabled = !t);
    }
    function C() {
        J && (J.hidden = p), Q && (Q.hidden = !p);
    }
    async function ye() {
        !l || u >= v.length || l.isAnimating() || (await l.animateMove(v[u], Se()), u++, L?.setProgress(u), k(!0));
    }
    async function tt() {
        !l || u <= 0 || l.isAnimating() || (await l.animateMove(Ne(v[u - 1]), Se()), u--, L?.setProgress(u), k(!0));
    }
    function st(t) {
        return new Promise((e)=>window.setTimeout(e, t));
    }
    async function nt() {
        if (p) {
            p = !1, C();
            return;
        }
        for(u >= v.length && (u = 0), p = !0, C(); p && u < v.length && (await ye(), !!p);)await st(140);
        p = !1, C();
    }
    function ot() {
        l && (p = !1, C(), l.loadState(W.slice()), u = 0, L?.setProgress(0), k(!0));
    }
    async function rt(t) {
        B = "solution", v = t.moves, u = 0, W = h.facelets.slice(), l?.setPaintEnabled(!1), l?.loadState(W.slice()), L?.setProgress(0), F("solve"), k(!0);
    }
    function re() {
        const t = {}, e = new Set;
        for (const s of w){
            const n = (i(`rs-color-${s}`)?.value ?? "#000000").toUpperCase();
            t[Y[s]] = n, e.add(n);
        }
        return {
            palette: t,
            distinct: e.size === 6
        };
    }
    function X() {
        const { palette: t, distinct: e } = re();
        b = t, l?.setPalette(b);
        const s = i("rs-colors-msg");
        s && (s.textContent = e ? "" : "6 màu phải khác nhau để phân biệt các mặt."), I && (I.disabled = !e);
    }
    function it() {
        const { palette: t, distinct: e } = re();
        if (!e) {
            X();
            return;
        }
        b = t;
        const s = i("rs-palette");
        s && (be = new Ie(s, b)), l?.setPalette(b), l?.setPaintEnabled(!0), B = "paint", F("paint"), V(), H(), k(!1);
    }
    function we() {
        Pe(h), B = "paint", v = [], u = 0, p = !1, C(), L?.reset(), l?.loadState(h.facelets.slice()), V(), H(), k(!1);
    }
    function lt() {
        we(), l?.setPaintEnabled(!0), F("paint");
    }
    function ct() {
        we(), l?.setPaintEnabled(!1), F("colors");
    }
    function at() {
        h = Fe(), B = "paint", v = [], u = 0, p = !1, C(), L?.reset(), l?.setPaintEnabled(!0), l?.loadState(h.facelets.slice()), V(), H(), k(!1), F("paint");
    }
    async function ut() {
        if (!q || l) return;
        const { createRubikRenderer: t } = await ke(async ()=>{
            const { createRubikRenderer: e } = await import("./rubik3d.CA97ajPw.js").then(async (m)=>{
                await m.__tla;
                return m;
            });
            return {
                createRubikRenderer: e
            };
        }, __vite__mapDeps([0,1]));
        l = await t(q, {
            palette: b,
            onPaint: et
        }), l.loadState(h.facelets.slice()), l.setPaintEnabled(!1);
    }
    function ft() {
        if (x = i("rs-app"), !x) return;
        b = re().palette, h = he(), O = i("rs-counts"), S = i("rs-validation"), q = i("rs-viewer"), G = i("rs-speed"), K = i("rs-playback"), U = i("rs-prev"), $ = i("rs-next"), N = i("rs-auto"), J = i("rs-auto-play"), Q = i("rs-auto-pause"), j = i("rs-reset-view"), I = i("rs-colors-continue");
        const t = dt();
        t && (L = new Ze(t, {
            getState: ()=>h,
            isValid: ()=>Le?.ok ?? !1,
            onSolved: (e)=>{
                rt(e);
            }
        }));
        for (const e of w)i(`rs-color-${e}`)?.addEventListener("input", X);
        I?.addEventListener("click", it), i("rs-recolor")?.addEventListener("click", ct), i("rs-clear")?.addEventListener("click", lt), i("rs-example")?.addEventListener("click", at), U?.addEventListener("click", ()=>{
            tt();
        }), $?.addEventListener("click", ()=>{
            ye();
        }), N?.addEventListener("click", ()=>{
            nt();
        }), j?.addEventListener("click", ot), i("rs-zoom-in")?.addEventListener("click", ()=>l?.zoom(1)), i("rs-zoom-out")?.addEventListener("click", ()=>l?.zoom(-1)), window.addEventListener("pagehide", ()=>{
            qe(), l?.dispose(), l = null;
        }), F("colors"), X(), ut();
    }
    function dt() {
        const t = i("rs-mode"), e = i("rs-solve"), s = i("rs-solver-status"), o = i("rs-solution"), n = i("rs-moves"), c = i("rs-step-info"), a = i("rs-copy");
        return !t || !e || !s || !o || !n || !c || !a ? null : {
            modeSelect: t,
            solveBtn: e,
            status: s,
            solutionWrap: o,
            movesEl: n,
            stepInfo: c,
            copyBtn: a
        };
    }
    document.addEventListener("DOMContentLoaded", ()=>ft());
})();
export { w as F, __tla };
