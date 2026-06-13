const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["_astro/rubik3d.DC4XfD0P.js","_astro/preload-helper.CVfkMyKi.js"])))=>i.map(i=>d[i]);
import { _ as be } from "./preload-helper.CVfkMyKi.js";
let k;
let __tla = (async ()=>{
    let F, Y, ce, ae, ke, S, Z, ue;
    k = [
        "U",
        "R",
        "F",
        "D",
        "L",
        "B"
    ];
    F = [
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
    ce = {
        c1: "U",
        c2: "R",
        c3: "F",
        c4: "D",
        c5: "L",
        c6: "B"
    };
    ae = {
        U: "Trên (U)",
        D: "Dưới (D)",
        F: "Trước (F)",
        B: "Sau (B)",
        L: "Trái (L)",
        R: "Phải (R)"
    };
    ke = {
        c1: "#FFFFFF",
        c2: "#B71234",
        c3: "#009B48",
        c4: "#FFD500",
        c5: "#FF5800",
        c6: "#0046AD"
    };
    S = 54;
    Z = 9;
    ue = 4;
    function fe(t, e) {
        return k.indexOf(t) * Z + e;
    }
    function ee(t) {
        return fe(t, ue);
    }
    function Ce(t) {
        return t % Z === ue;
    }
    function de() {
        return {
            facelets: new Array(S).fill(null)
        };
    }
    function he() {
        const t = de();
        for (const e of k)t.facelets[ee(e)] = Y[e];
        return t;
    }
    function Re() {
        const t = de();
        for (const e of k)for(let s = 0; s < Z; s++)t.facelets[fe(e, s)] = Y[e];
        return t;
    }
    function Fe(t, e, s) {
        t.facelets[e] = s;
    }
    function Pe(t) {
        const e = he();
        for(let s = 0; s < S; s++)t.facelets[s] = e.facelets[s];
    }
    function pe(t) {
        const e = {};
        for (const s of F)e[s] = 0;
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
    function Be(t) {
        const e = {}, s = new Set;
        for (const o of k){
            const n = t.facelets[ee(o)];
            if (!n || s.has(n)) return null;
            s.add(n), e[n] = o;
        }
        return e;
    }
    function ve(t) {
        if (!me(t)) return null;
        const e = Be(t);
        if (!e) return null;
        let s = "";
        for(let o = 0; o < S; o++){
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
    ], oe = [
        "URF",
        "UFL",
        "ULB",
        "UBR",
        "DFR",
        "DLF",
        "DBL",
        "DRB"
    ], re = [
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
    ], D = [
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
    function Te(t) {
        return `màu ${ae[ce[t]]}`;
    }
    function ie(t) {
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
    function xe(t) {
        const e = [], s = (r)=>t[r], o = (r)=>r === "U" || r === "D", n = new Array(8).fill(-1), c = new Array(8).fill(0);
        for(let r = 0; r < 8; r++){
            let f = 0;
            for(; f < 3 && !o(s(z[r][f])); f++);
            const M = s(z[r][(f + 1) % 3]), m = s(z[r][(f + 2) % 3]);
            for(let _ = 0; _ < 8; _++)if (M === oe[_][1] && m === oe[_][2]) {
                n[r] = _, c[r] = f % 3;
                break;
            }
        }
        const a = new Array(12).fill(-1), g = new Array(12).fill(0);
        for(let r = 0; r < 12; r++){
            const f = s(re[r][0]), M = s(re[r][1]);
            for(let m = 0; m < 12; m++){
                if (f === D[m][0] && M === D[m][1]) {
                    a[r] = m, g[r] = 0;
                    break;
                }
                if (f === D[m][1] && M === D[m][0]) {
                    a[r] = m, g[r] = 1;
                    break;
                }
            }
        }
        const d = n.every((r)=>r >= 0) && new Set(n).size === 8, x = a.every((r)=>r >= 0) && new Set(a).size === 12;
        return !d || !x ? (e.push({
            code: "impossible-pieces",
            message: "Cách tô tạo ra mảnh (góc/cạnh) trùng lặp hoặc không tồn tại trên khối Rubik thật."
        }), e) : (c.reduce((r, f)=>r + f, 0) % 3 !== 0 && e.push({
            code: "corner-twist",
            message: "Có một góc bị xoay sai hướng (tổng định hướng góc không chia hết cho 3)."
        }), g.reduce((r, f)=>r + f, 0) % 2 !== 0 && e.push({
            code: "edge-flip",
            message: "Có một cạnh bị lật ngược (số cạnh lật phải là số chẵn)."
        }), ie(n) !== ie(a) && e.push({
            code: "permutation-parity",
            message: "Sai parity hoán vị — cần hoán đổi đúng một cặp mảnh để khối có thể giải được."
        }), e);
    }
    function Me(t) {
        const e = [], s = _e(t);
        s < S && e.push({
            code: "incomplete",
            message: `Còn ${S - s} ô chưa tô (cần đủ ${S} ô).`
        });
        const o = pe(t), n = F.filter((d)=>o[d] !== 9);
        if (s === S && n.length > 0) {
            const d = n.map((x)=>`${Te(x)} ${o[x]}/9`).join(", ");
            e.push({
                code: "color-count",
                message: `Mỗi màu phải đúng 9 ô. Sai: ${d}.`
            });
        }
        const a = k.map((d)=>t.facelets[ee(d)]).filter((d)=>d !== null);
        if (a.length === 6 && new Set(a).size !== 6 && e.push({
            code: "center-dup",
            message: "6 ô trung tâm phải là 6 màu khác nhau."
        }), e.length === 0 && me(t)) {
            const d = ve(t);
            d && e.push(...xe(d));
        }
        return {
            ok: e.length === 0,
            errors: e
        };
    }
    const De = new Set([
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
    function Ae(t) {
        const e = t.trim();
        if (e.length < 1) return null;
        const s = e[0];
        if (!De.has(s)) return null;
        const o = e.slice(1);
        let n;
        if (o === "") n = "";
        else if (o === "'" || o === "’") n = "'";
        else if (o === "2") n = "2";
        else return null;
        return ge(s, n);
    }
    function Oe(t) {
        return t.split(/\s+/).map((e)=>e.trim()).filter(Boolean).map(Ae).filter((e)=>e !== null);
    }
    function Ue(t) {
        if (t.suffix === "2") return t;
        const e = t.suffix === "'" ? "" : "'";
        return ge(t.face, e);
    }
    function $e(t) {
        return t.map((e)=>e.notation).join(" ");
    }
    class Ne {
        selection = F[0];
        container;
        palette;
        listeners = [];
        countEls = new Map;
        constructor(e, s){
            this.container = e, this.palette = s, this.build();
        }
        getSelection() {
            return this.selection;
        }
        onChange(e) {
            this.listeners.push(e);
        }
        setCount(e, s) {
            const o = this.countEls.get(e);
            o && (o.val.textContent = `${s}/9`, o.wrap.classList.toggle("rs-count--ok", s === 9));
        }
        build() {
            this.container.innerHTML = "", this.countEls.clear();
            for (const e of F){
                const s = ae[ce[e]], o = document.createElement("div");
                o.className = "rs-swatch-group";
                const n = document.createElement("button");
                n.type = "button", n.className = "rs-swatch", n.dataset.color = e, n.title = s, n.setAttribute("aria-label", s), n.style.background = this.palette[e], n.addEventListener("click", ()=>this.select(e));
                const c = document.createElement("div");
                c.className = "rs-count", c.dataset.color = e, c.title = s;
                const a = document.createElement("span");
                a.className = "rs-count__dot", a.style.background = this.palette[e];
                const g = document.createElement("span");
                g.className = "rs-count__val", g.textContent = "0/9", c.append(a, g), o.append(n, c), this.container.appendChild(o), this.countEls.set(e, {
                    wrap: c,
                    val: g
                });
            }
            this.refresh();
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
    let E = null, te = !1, He = 0;
    const y = new Map;
    let A = [];
    function Ee() {
        return E || (E = new Worker(new URL("/_astro/solver.worker-C1g4IsyU.js", import.meta.url), {
            type: "module"
        }), E.onmessage = (t)=>{
            const e = t.data;
            switch(e.type){
                case "ready":
                    te = !0, A.forEach((s)=>s()), A = [];
                    break;
                case "init-error":
                    A = [];
                    break;
                case "result":
                    y.get(e.id)?.resolve(e.moves), y.delete(e.id);
                    break;
                case "error":
                    y.get(e.id)?.reject(new Error(e.message)), y.delete(e.id);
                    break;
            }
        }, E.onerror = ()=>{
            y.forEach(({ reject: t })=>t(new Error("Bộ giải gặp lỗi không xác định."))), y.clear();
        }, E.postMessage({
            type: "init"
        }), E);
    }
    function je() {
        Ee();
    }
    function Ie() {
        return te;
    }
    function Ve(t) {
        const e = Ee(), s = ++He;
        return new Promise((o, n)=>{
            y.set(s, {
                resolve: o,
                reject: n
            }), e.postMessage({
                type: "solve",
                id: s,
                facelets: t
            });
        });
    }
    function ze() {
        E?.terminate(), E = null, te = !1, A = [], y.clear();
    }
    const qe = {
        id: "layer",
        label: "Giải từng tầng",
        available: !1,
        async solve () {
            throw new Error("Chế độ giải từng tầng sẽ được bổ sung sau.");
        }
    }, We = {
        id: "fast",
        label: "Giải nhanh",
        available: !0,
        async solve (t) {
            const e = ve(t);
            if (!e) throw new Error("Trạng thái khối chưa hợp lệ.");
            const s = await Ve(e), o = Oe(s);
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
    }, se = {
        fast: We,
        layer: qe
    };
    function Ge() {
        return Object.values(se);
    }
    function Ke(t) {
        return se[t];
    }
    function Je(t, e) {
        const s = Ke(Qe(e));
        return s.available ? s.solve(t) : Promise.reject(new Error(`Chế độ "${s.label}" chưa khả dụng.`));
    }
    function Qe(t) {
        return t in se ? t : "fast";
    }
    class Xe {
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
            this.moveEls.forEach((s, o)=>{
                s.classList.toggle("rs-move--done", o < e), s.classList.toggle("rs-move--current", o === e);
            });
        }
        populateModes() {
            this.refs.modeSelect.innerHTML = "";
            for (const e of Ge()){
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
            this.refs.solveBtn.disabled = !0, this.setStatus(Ie() ? "Đang giải..." : "Đang khởi tạo bộ giải (lần đầu mất vài giây)...", "loading");
            try {
                const s = await Je(this.opts.getState(), e);
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
            const e = $e(this.result.moves);
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
    let B = null, p, b = {
        ...ke
    }, O = null, w = null, ye = null, le = !1, l = null, T = "paint", v = [], u = 0, q = [], h = !1, L = null, W = null, G = null, K = null, U = null, $ = null, N = null, J = null, Q = null, H = null, j = null;
    function P(t) {
        B && (B.dataset.step = t);
    }
    function I() {
        if (!O) return;
        const t = pe(p);
        for (const e of F)O.setCount(e, t[e]);
    }
    function V() {
        const t = Me(p);
        if (ye = t, L) if (L.classList.remove("rs-validation--success", "rs-validation--error", "rs-validation--empty"), t.ok) L.classList.add("rs-validation--success"), L.innerHTML = '<p class="rs-validation__title">✓ Trạng thái hợp lệ.</p>';
        else {
            L.classList.add("rs-validation--error");
            const e = t.errors.map((s)=>`<li>${s.message}</li>`).join("");
            L.innerHTML = `<p class="rs-validation__title">Chưa thể giải:</p><ul class="rs-validation__list">${e}</ul>`;
        }
        w?.setValid(t.ok), t.ok && !le && (le = !0, je());
    }
    function Ye(t) {
        if (T !== "paint" || Ce(t)) return;
        const e = O?.getSelection() ?? F[0];
        Fe(p, t, e), l?.updateSticker(t, e), I(), V();
    }
    function we() {
        const t = G ? Number(G.value) : 6;
        return Math.max(100, 1300 - t * 120);
    }
    function C(t) {
        K && (K.hidden = !t), U && (U.disabled = !t || u <= 0), $ && ($.disabled = !t || u >= v.length), N && (N.disabled = !t || v.length === 0), H && (H.disabled = !t);
    }
    function R() {
        J && (J.hidden = h), Q && (Q.hidden = !h);
    }
    async function Le() {
        !l || u >= v.length || l.isAnimating() || (await l.animateMove(v[u], we()), u++, w?.setProgress(u), C(!0));
    }
    async function Ze() {
        !l || u <= 0 || l.isAnimating() || (await l.animateMove(Ue(v[u - 1]), we()), u--, w?.setProgress(u), C(!0));
    }
    function et(t) {
        return new Promise((e)=>window.setTimeout(e, t));
    }
    async function tt() {
        if (h) {
            h = !1, R();
            return;
        }
        for(u >= v.length && (u = 0), h = !0, R(); h && u < v.length && (await Le(), !!h);)await et(140);
        h = !1, R();
    }
    function st() {
        l && (h = !1, R(), l.loadState(q.slice()), u = 0, w?.setProgress(0), C(!0));
    }
    async function nt(t) {
        T = "solution", v = t.moves, u = 0, q = p.facelets.slice(), l?.setPaintEnabled(!1), l?.loadState(q.slice()), w?.setProgress(0), P("solve"), C(!0);
    }
    function ne() {
        const t = {}, e = new Set;
        for (const s of k){
            const n = (i(`rs-color-${s}`)?.value ?? "#000000").toUpperCase();
            t[Y[s]] = n, e.add(n);
        }
        return {
            palette: t,
            distinct: e.size === 6
        };
    }
    function X() {
        const { palette: t, distinct: e } = ne();
        b = t, l?.setPalette(b);
        const s = i("rs-colors-msg");
        s && (s.textContent = e ? "" : "6 màu phải khác nhau để phân biệt các mặt."), j && (j.disabled = !e);
    }
    function ot() {
        const { palette: t, distinct: e } = ne();
        if (!e) {
            X();
            return;
        }
        b = t;
        const s = i("rs-palette");
        s && (O = new Ne(s, b)), l?.setPalette(b), l?.setPaintEnabled(!0), T = "paint", I(), V(), C(!1), rt(()=>P("paint"));
    }
    function rt(t) {
        const e = B?.querySelector(".rs-colorbar__setup"), s = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
        if (!e || s) {
            t();
            return;
        }
        e.style.overflow = "hidden", e.style.maxHeight = `${e.scrollHeight}px`, e.offsetHeight, e.classList.add("rs-collapsing"), e.style.maxHeight = "0px", e.style.opacity = "0";
        let o = !1;
        const n = ()=>{
            o || (o = !0, t(), e.classList.remove("rs-collapsing"), e.style.removeProperty("overflow"), e.style.removeProperty("max-height"), e.style.removeProperty("opacity"));
        };
        e.addEventListener("transitionend", n, {
            once: !0
        }), window.setTimeout(n, 420);
    }
    function Se() {
        Pe(p), T = "paint", v = [], u = 0, h = !1, R(), w?.reset(), l?.loadState(p.facelets.slice()), I(), V(), C(!1);
    }
    function it() {
        Se(), l?.setPaintEnabled(!0), P("paint");
    }
    function lt() {
        Se(), l?.setPaintEnabled(!1), P("colors");
    }
    function ct() {
        p = Re(), T = "paint", v = [], u = 0, h = !1, R(), w?.reset(), l?.setPaintEnabled(!0), l?.loadState(p.facelets.slice()), I(), V(), C(!1), P("paint");
    }
    async function at() {
        if (!W || l) return;
        const { createRubikRenderer: t } = await be(async ()=>{
            const { createRubikRenderer: e } = await import("./rubik3d.DC4XfD0P.js").then(async (m)=>{
                await m.__tla;
                return m;
            });
            return {
                createRubikRenderer: e
            };
        }, __vite__mapDeps([0,1]));
        l = await t(W, {
            palette: b,
            onPaint: Ye
        }), l.loadState(p.facelets.slice()), l.setPaintEnabled(!1);
    }
    function ut() {
        if (B = i("rs-app"), !B) return;
        b = ne().palette, p = he(), L = i("rs-validation"), W = i("rs-viewer"), G = i("rs-speed"), K = i("rs-playback"), U = i("rs-prev"), $ = i("rs-next"), N = i("rs-auto"), J = i("rs-auto-play"), Q = i("rs-auto-pause"), H = i("rs-reset-view"), j = i("rs-colors-continue");
        const t = ft();
        t && (w = new Xe(t, {
            getState: ()=>p,
            isValid: ()=>ye?.ok ?? !1,
            onSolved: (e)=>{
                nt(e);
            }
        }));
        for (const e of k)i(`rs-color-${e}`)?.addEventListener("input", X);
        j?.addEventListener("click", ot), i("rs-recolor")?.addEventListener("click", lt), i("rs-clear")?.addEventListener("click", it), i("rs-example")?.addEventListener("click", ct), U?.addEventListener("click", ()=>{
            Ze();
        }), $?.addEventListener("click", ()=>{
            Le();
        }), N?.addEventListener("click", ()=>{
            tt();
        }), H?.addEventListener("click", st), i("rs-zoom-in")?.addEventListener("click", ()=>l?.zoom(1)), i("rs-zoom-out")?.addEventListener("click", ()=>l?.zoom(-1)), window.addEventListener("pagehide", ()=>{
            ze(), l?.dispose(), l = null;
        }), P("colors"), X(), at();
    }
    function ft() {
        const t = i("rs-mode"), e = i("rs-solve"), s = i("rs-solver-status"), o = i("rs-solution"), n = i("rs-moves"), c = i("rs-copy");
        return !t || !e || !s || !o || !n || !c ? null : {
            modeSelect: t,
            solveBtn: e,
            status: s,
            solutionWrap: o,
            movesEl: n,
            copyBtn: c
        };
    }
    document.addEventListener("DOMContentLoaded", ()=>ut());
})();
export { k as F, __tla };
