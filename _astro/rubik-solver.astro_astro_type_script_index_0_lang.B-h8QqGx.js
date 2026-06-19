import { g as xt } from "./kv-store.DuB8mqC6.js";
import { _ as Ht } from "./preload-helper.CVfkMyKi.js";
(async ()=>{
    const B = [
        "U",
        "R",
        "F",
        "D",
        "L",
        "B"
    ], Z = [
        "c1",
        "c2",
        "c3",
        "c4",
        "c5",
        "c6"
    ], Je = {
        U: "c1",
        R: "c2",
        F: "c3",
        D: "c4",
        L: "c5",
        B: "c6"
    }, Yt = {
        c1: "U",
        c2: "R",
        c3: "F",
        c4: "D",
        c5: "L",
        c6: "B"
    }, qt = {
        U: "Trên (U)",
        D: "Dưới (D)",
        F: "Trước (F)",
        B: "Sau (B)",
        L: "Trái (L)",
        R: "Phải (R)"
    }, Pt = Object.fromEntries(Z.map((t)=>[
            t,
            qt[Yt[t]]
        ])), Un = {
        c1: "#FFFFFF",
        c2: "#B71234",
        c3: "#009B48",
        c4: "#FFD500",
        c5: "#FF5800",
        c6: "#0046AD"
    }, me = 54, Xt = 9, Nn = 4;
    function Kt(t, e) {
        return B.indexOf(t) * Xt + e;
    }
    function Ft(t) {
        return Kt(t, Nn);
    }
    function Zt() {
        return {
            facelets: new Array(me).fill(null)
        };
    }
    function jn() {
        const t = Zt();
        for (const e of B)t.facelets[Ft(e)] = Je[e];
        return t;
    }
    function Wn() {
        const t = Zt();
        for (const e of B)for(let n = 0; n < Xt; n++)t.facelets[Kt(e, n)] = Je[e];
        return t;
    }
    function Gn(t, e, n) {
        t.facelets[e] = n;
    }
    function Jt(t) {
        const e = {};
        for (const n of Z)e[n] = 0;
        for (const n of t.facelets)n && e[n]++;
        return e;
    }
    function Vn(t) {
        let e = 0;
        for (const n of t.facelets)n && e++;
        return e;
    }
    function Qt(t) {
        return t.facelets.every((e)=>e !== null);
    }
    function Hn(t) {
        const e = {}, n = new Set;
        for (const o of B){
            const s = t.facelets[Ft(o)];
            if (!s || n.has(s)) return null;
            n.add(s), e[s] = o;
        }
        return e;
    }
    function en(t) {
        if (!Qt(t)) return null;
        const e = Hn(t);
        if (!e) return null;
        let n = "";
        for(let o = 0; o < me; o++){
            const s = t.facelets[o];
            n += e[s];
        }
        return n;
    }
    class Yn {
        selection;
        container;
        cfg;
        listeners = [];
        countEls = new Map;
        constructor(e, n){
            this.container = e, this.cfg = n, this.selection = n.colorIds[0], this.build();
        }
        getSelection() {
            return this.selection;
        }
        onChange(e) {
            this.listeners.push(e);
        }
        setCount(e, n) {
            const o = this.countEls.get(e);
            o && (o.val.textContent = `${n}/${this.cfg.perColor}`, o.wrap.classList.toggle("rs-count--ok", n === this.cfg.perColor));
        }
        build() {
            this.container.innerHTML = "", this.countEls.clear();
            for (const e of this.cfg.colorIds){
                const n = this.cfg.labels[e] ?? e, o = document.createElement("div");
                o.className = "rs-swatch-group";
                const s = document.createElement("span");
                s.className = "rs-swatch-label", s.textContent = n;
                const r = document.createElement("button");
                r.type = "button", r.className = "rs-swatch", r.dataset.color = e, r.title = n, r.setAttribute("aria-label", n), r.style.background = this.cfg.palette[e], r.addEventListener("click", ()=>this.select(e));
                const i = document.createElement("div");
                i.className = "rs-count", i.dataset.color = e, i.title = n;
                const l = document.createElement("span");
                l.className = "rs-count__dot", l.style.background = this.cfg.palette[e];
                const c = document.createElement("span");
                c.className = "rs-count__val", c.textContent = `0/${this.cfg.perColor}`, i.append(l, c), o.append(s, r, i), this.container.appendChild(o), this.countEls.set(e, {
                    wrap: i,
                    val: c
                });
            }
            this.refresh();
        }
        select(e) {
            this.selection = e, this.refresh();
            for (const n of this.listeners)n(e);
        }
        refresh() {
            this.container.querySelectorAll(".rs-swatch").forEach((e)=>{
                e.classList.toggle("rs-swatch--active", e.dataset.color === this.selection);
            });
        }
    }
    const Rt = "fun/rubik-solver/palettes", lt = 1, tn = 12;
    function W(t) {
        return t.trim().toUpperCase();
    }
    function qn() {
        return {
            version: lt,
            pool: [],
            byPuzzle: {}
        };
    }
    async function Qe() {
        const t = await xt().get(Rt);
        return !t || t.version !== lt ? qn() : {
            version: lt,
            pool: Array.isArray(t.pool) ? t.pool.map(W) : [],
            byPuzzle: t.byPuzzle ?? {}
        };
    }
    async function Xn(t) {
        return (await Qe()).byPuzzle[t]?.map(W) ?? null;
    }
    async function Kn(t = []) {
        const e = await Qe();
        return e.pool.length > 0 ? e.pool : At([], t);
    }
    async function Zn(t) {
        const e = await Qe();
        return e.pool = At(e.pool, [
            t
        ]), await xt().set(Rt, e), e.pool;
    }
    async function Jn(t, e) {
        const n = await Qe();
        n.byPuzzle[t] = e.map(W), n.pool = At(n.pool, e), await xt().set(Rt, n);
    }
    function At(t, e) {
        const n = new Set, o = [];
        for (const s of [
            ...e,
            ...t
        ]){
            const r = W(s);
            n.has(r) || (n.add(r), o.push(r));
        }
        return o.slice(0, tn);
    }
    class Qn {
        constructor(e){
            this.cb = e;
        }
        cb;
        el = null;
        currentHex = "#FFFFFF";
        input;
        isOpenFor(e) {
            return !!this.el && this.el.dataset.anchorId === e.dataset.color;
        }
        open(e, n, o) {
            this.close(), this.currentHex = n;
            const s = document.createElement("div");
            if (s.className = "rs-cp", s.setAttribute("role", "dialog"), s.setAttribute("aria-label", "Chọn màu"), s.dataset.anchorId = e.dataset.color ?? "", o.length > 0) {
                const c = document.createElement("div");
                c.className = "rs-cp__recent";
                for (const u of o){
                    const g = document.createElement("button");
                    g.type = "button", g.className = "rs-cp__chip", g.style.background = u, g.title = u, g.setAttribute("aria-label", `Màu ${u}`), u.toUpperCase() === n.toUpperCase() && g.classList.add("rs-cp__chip--active"), g.addEventListener("click", ()=>{
                        this.cb.onPreview(u), this.cb.onCommit(u), this.close();
                    }), c.appendChild(g);
                }
                s.appendChild(c);
            }
            const r = document.createElement("label");
            r.className = "rs-cp__custom";
            const i = document.createElement("span");
            i.className = "rs-cp__custom-swatch", i.style.background = n;
            const l = document.createElement("span");
            l.className = "rs-cp__custom-text", l.textContent = "Màu khác…", this.input = document.createElement("input"), this.input.type = "color", this.input.className = "rs-cp__input", this.input.value = eo(n), this.input.addEventListener("input", ()=>{
                this.currentHex = this.input.value, i.style.background = this.input.value, this.cb.onPreview(this.input.value);
            }), r.append(i, l, this.input), s.appendChild(r), document.body.appendChild(s), this.el = s, this.position(e), window.setTimeout(()=>{
                document.addEventListener("pointerdown", this.onDocPointer, !0);
            }, 0), window.addEventListener("scroll", this.onReposition, !0), window.addEventListener("resize", this.onReposition), document.addEventListener("keydown", this.onKeyDown);
        }
        close() {
            this.el && (this.el.remove(), this.el = null, document.removeEventListener("pointerdown", this.onDocPointer, !0), window.removeEventListener("scroll", this.onReposition, !0), window.removeEventListener("resize", this.onReposition), document.removeEventListener("keydown", this.onKeyDown));
        }
        position(e) {
            if (!this.el) return;
            const n = e.getBoundingClientRect(), o = this.el.offsetWidth, s = this.el.offsetHeight, r = 8;
            let i = n.left;
            i + o > window.innerWidth - r && (i = window.innerWidth - r - o), i = Math.max(r, i);
            let l = n.bottom + 6;
            l + s > window.innerHeight - r && (l = n.top - s - 6), l = Math.max(r, l), this.el.style.left = `${Math.round(i)}px`, this.el.style.top = `${Math.round(l)}px`;
        }
        onReposition = ()=>{
            this.commitAndClose();
        };
        onKeyDown = (e)=>{
            e.key === "Escape" && this.commitAndClose();
        };
        onDocPointer = (e)=>{
            this.el && !this.el.contains(e.target) && this.commitAndClose();
        };
        commitAndClose() {
            const e = this.currentHex;
            this.close(), this.cb.onCommit(e);
        }
    }
    function eo(t) {
        const e = /^#?([0-9a-fA-F]{6})$/.exec(t.trim());
        return e ? `#${e[1].toLowerCase()}` : "#ffffff";
    }
    class to {
        constructor(e, n, o){
            this.container = e, this.cfg = n, this.cb = o;
            for (const s of n.colorIds)this.assigned[s] = W(n.initial[s] ?? "#FFFFFF");
            this.recent = $t(n.colorIds.map((s)=>this.assigned[s]), n.pool.map(W)), this.editing = n.colorIds[0], this.popover = new Qn({
                onPreview: (s)=>this.preview(s),
                onCommit: (s)=>this.commit(s)
            }), this.build(), this.emitChange();
        }
        container;
        cfg;
        cb;
        assigned = {};
        recent;
        editing;
        swatchEls = new Map;
        popover;
        getPalette() {
            const e = {};
            for (const n of this.cfg.colorIds)e[n] = this.assigned[n];
            return e;
        }
        destroy() {
            this.popover.close();
        }
        build() {
            this.container.innerHTML = "", this.swatchEls.clear();
            const e = document.createElement("div");
            e.className = "rs-cs__slots";
            for (const n of this.cfg.colorIds){
                const o = document.createElement("div");
                o.className = "rs-cs__slot";
                const s = document.createElement("span");
                s.className = "rs-cs__slot-label", s.textContent = this.cfg.labels[n] ?? n;
                const r = document.createElement("button");
                r.type = "button", r.className = "rs-cs__slot-color", r.dataset.color = n, r.style.background = this.assigned[n], r.title = `${this.cfg.labels[n] ?? n} — bấm để đổi màu`, r.setAttribute("aria-label", `Đổi màu ${this.cfg.labels[n] ?? n}`), r.addEventListener("click", ()=>this.openPicker(n, r)), o.append(s, r), e.appendChild(o), this.swatchEls.set(n, r);
            }
            this.container.appendChild(e);
        }
        openPicker(e, n) {
            if (this.popover.isOpenFor(n)) {
                this.popover.close();
                return;
            }
            this.editing = e, this.popover.open(n, this.assigned[e], this.recent);
        }
        preview(e) {
            const n = W(e);
            this.assigned[this.editing] = n;
            const o = this.swatchEls.get(this.editing);
            o && (o.style.background = n), this.emitChange();
        }
        commit(e) {
            const n = W(e);
            this.assigned[this.editing] = n;
            const o = this.swatchEls.get(this.editing);
            o && (o.style.background = n), this.recent = $t([
                n
            ], this.recent), this.cb.onAddColor(n), this.emitChange();
        }
        emitChange() {
            const e = this.getPalette(), n = new Set(Object.values(e).map(W)).size === this.cfg.colorIds.length;
            this.cb.onChange(e, n);
        }
    }
    function $t(t, e) {
        const n = new Set, o = [];
        for (const s of [
            ...t,
            ...e
        ]){
            const r = W(s);
            n.has(r) || (n.add(r), o.push(r));
        }
        return o.slice(0, tn);
    }
    const no = new Set([
        "U",
        "R",
        "F",
        "D",
        "L",
        "B"
    ]);
    function nn(t, e) {
        return {
            face: t,
            suffix: e,
            notation: `${t}${e}`
        };
    }
    function oo(t) {
        const e = t.trim();
        if (e.length < 1) return null;
        const n = e[0];
        if (!no.has(n)) return null;
        const o = e.slice(1);
        let s;
        if (o === "") s = "";
        else if (o === "'" || o === "’") s = "'";
        else if (o === "2") s = "2";
        else return null;
        return nn(n, s);
    }
    function on(t) {
        return t.split(/\s+/).map((e)=>e.trim()).filter(Boolean).map(oo).filter((e)=>e !== null);
    }
    function sn(t) {
        if (t.suffix === "2") return t;
        const e = t.suffix === "'" ? "" : "'";
        return nn(t.face, e);
    }
    function so(t) {
        return t.map((e)=>e.notation).join(" ");
    }
    const Oe = {
        U: {
            n: [
                0,
                1,
                0
            ],
            u: [
                1,
                0,
                0
            ],
            v: [
                0,
                0,
                1
            ]
        },
        R: {
            n: [
                1,
                0,
                0
            ],
            u: [
                0,
                0,
                -1
            ],
            v: [
                0,
                -1,
                0
            ]
        },
        F: {
            n: [
                0,
                0,
                1
            ],
            u: [
                1,
                0,
                0
            ],
            v: [
                0,
                -1,
                0
            ]
        },
        D: {
            n: [
                0,
                -1,
                0
            ],
            u: [
                1,
                0,
                0
            ],
            v: [
                0,
                0,
                -1
            ]
        },
        L: {
            n: [
                -1,
                0,
                0
            ],
            u: [
                0,
                0,
                1
            ],
            v: [
                0,
                -1,
                0
            ]
        },
        B: {
            n: [
                0,
                0,
                -1
            ],
            u: [
                -1,
                0,
                0
            ],
            v: [
                0,
                -1,
                0
            ]
        }
    };
    function rn(t, e, n) {
        const { n: o, u: s, v: r } = Oe[t], i = e % n, l = Math.floor(e / n), c = n - 1, u = 2 * i - c, g = 2 * l - c;
        return [
            o[0] * c + s[0] * u + r[0] * g,
            o[1] * c + s[1] * u + r[1] * g,
            o[2] * c + s[2] * u + r[2] * g
        ];
    }
    const ro = 1, ot = ro / 2, Ue = .94, Dt = .82, co = .001, io = 2501427, lo = 921878, ao = 6, It = .6, uo = 2.6;
    function Tt(t, e, n) {
        return `${t},${e},${n}`;
    }
    function fo(t, e) {
        const n = /^(\d*)([URFDLB])(w?)([2']?)$/.exec(t.notation);
        if (!n) return null;
        const o = n[2], s = n[3] === "w", r = n[1] ? parseInt(n[1], 10) : s ? 2 : 1, i = [];
        for(let c = 0; c < Math.min(r, e); c++)i.push(c);
        const l = n[4] === "2" ? 2 : n[4] === "'" ? -1 : 1;
        return {
            face: o,
            depths: i,
            quarter: l
        };
    }
    async function _t(t, e, n) {
        const o = await Ht(()=>import("./three.CuzN0wor.js"), []), s = n - 1, r = n % 2 === 1 ? (n * n - 1) / 2 : -1, i = new o.Scene, l = new o.PerspectiveCamera(42, 1, .1, 100);
        l.position.set(0, 0, 6.2), l.zoom = It;
        const c = new o.WebGLRenderer({
            antialias: !0,
            alpha: !0
        });
        c.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2)), t.appendChild(c.domElement);
        const u = new o.Group;
        u.rotation.x = -.42, u.rotation.y = .62, u.scale.setScalar(3 / n), i.add(u);
        const g = new o.MeshBasicMaterial({
            color: lo
        }), f = new o.MeshBasicMaterial({
            color: io
        }), a = {};
        for (const h of Object.keys(e.palette))a[h] = new o.MeshBasicMaterial({
            color: new o.Color(e.palette[h])
        });
        const p = new o.BoxGeometry(Ue, Ue, Ue), x = new o.PlaneGeometry(Dt, Dt), R = new o.Vector3(0, 0, 1);
        let $ = [], ue = [];
        const de = new Map;
        let ee = !1, Ie = !1;
        function ye(h) {
            return h ? a[h] : f;
        }
        function q() {
            for (const h of $)u.remove(h.group);
            $ = [], ue = [], de.clear();
        }
        function nt(h) {
            q();
            const w = new Map;
            for(let m = -s; m <= s; m += 2)for(let L = -s; L <= s; L += 2)for(let S = -s; S <= s; S += 2){
                if (!(Math.abs(m) === s || Math.abs(L) === s || Math.abs(S) === s)) continue;
                const F = new o.Group;
                F.position.set(m * ot, L * ot, S * ot), F.add(new o.Mesh(p, g));
                const _ = {
                    group: F,
                    coord: new o.Vector3(m, L, S)
                };
                u.add(F), $.push(_), w.set(Tt(m, L, S), _);
            }
            for(let m = 0; m < B.length; m++){
                const L = B[m], S = Oe[L], A = new o.Vector3(S.n[0], S.n[1], S.n[2]);
                for(let F = 0; F < n * n; F++){
                    const _ = m * n * n + F, [V, Re, O] = rn(L, F, n), re = w.get(Tt(V, Re, O));
                    if (!re) continue;
                    const H = new o.Mesh(x, ye(h[_]));
                    H.position.copy(A).multiplyScalar(Ue / 2 + co), H.quaternion.setFromUnitVectors(R, A), H.userData.faceletIndex = _, H.userData.paintable = F !== r, re.group.add(H), ue.push(H), de.set(_, H);
                }
            }
            K();
        }
        function be(h, w) {
            const m = de.get(h);
            m && (m.material = ye(w), K());
        }
        function X(h) {
            Ie = h;
        }
        function Te(h) {
            for (const w of Object.keys(h))a[w]?.color.set(new o.Color(h[w]));
            K();
        }
        function Ce(h) {
            const w = h > 0 ? 1.15 : .8695652173913044;
            l.zoom = Math.min(uo, Math.max(It, l.zoom * w)), l.updateProjectionMatrix(), K();
        }
        function ze(h, w) {
            const m = Oe[h].n, L = s - w * 2;
            return $.filter((S)=>Math.round(S.coord.x) * m[0] + Math.round(S.coord.y) * m[1] + Math.round(S.coord.z) * m[2] === L);
        }
        function ke(h, w) {
            if (ee) return Promise.resolve();
            const m = fo(h, n);
            if (!m) return Promise.resolve();
            ee = !0;
            const L = Oe[m.face], S = new o.Vector3(L.n[0], L.n[1], L.n[2]), A = m.quarter === 2 ? -Math.PI : m.quarter === -1 ? Math.PI / 2 : -Math.PI / 2, F = new Set;
            for (const O of m.depths)for (const re of ze(m.face, O))F.add(re);
            const _ = new o.Group;
            u.add(_);
            for (const O of F)_.attach(O.group);
            const V = Math.max(60, w), Re = performance.now();
            return new Promise((O)=>{
                const re = (H)=>{
                    const Ae = Math.min(1, (H - Re) / V), zn = Ae < .5 ? 2 * Ae * Ae : 1 - Math.pow(-2 * Ae + 2, 2) / 2;
                    if (_.quaternion.setFromAxisAngle(S, A * zn), c.render(i, l), Ae < 1) {
                        requestAnimationFrame(re);
                        return;
                    }
                    for (const Bt of F)u.attach(Bt.group), Bt.coord.applyAxisAngle(S, A).round();
                    u.remove(_), ee = !1, c.render(i, l), O();
                };
                requestAnimationFrame(re);
            });
        }
        let Se = !1;
        function K() {
            Se || (Se = !0, requestAnimationFrame(()=>{
                Se = !1, c.render(i, l);
            }));
        }
        function te() {
            const h = t.clientWidth || 1, w = t.clientHeight || 1;
            c.setSize(h, w, !1), l.aspect = h / w, l.updateProjectionMatrix(), K();
        }
        const ne = new ResizeObserver(te);
        ne.observe(t), te();
        const Le = new o.Raycaster, fe = new o.Vector2, Me = new o.Vector3(0, 1, 0), xe = new o.Vector3(1, 0, 0);
        let pe = !1, oe = !1, Pe = 0, se = 0, he = 0, Fe = 0;
        function d(h) {
            const w = c.domElement.getBoundingClientRect();
            fe.x = (h.clientX - w.left) / w.width * 2 - 1, fe.y = -((h.clientY - w.top) / w.height) * 2 + 1, i.updateMatrixWorld(!0), Le.setFromCamera(fe, l);
            const m = Le.intersectObjects(ue, !1);
            return m.length ? m[0].object : null;
        }
        function v(h) {
            pe = !0, oe = !1, Pe = he = h.clientX, se = Fe = h.clientY, c.domElement.setPointerCapture(h.pointerId);
        }
        function E(h) {
            if (pe) {
                if (!oe) {
                    if (Math.hypot(h.clientX - Pe, h.clientY - se) < ao) return;
                    oe = !0;
                }
                u.rotateOnWorldAxis(Me, (h.clientX - he) * .008), u.rotateOnWorldAxis(xe, (h.clientY - Fe) * .008), he = h.clientX, Fe = h.clientY, K();
            }
        }
        function C(h) {
            const w = pe && !oe;
            pe = !1;
            try {
                c.domElement.releasePointerCapture(h.pointerId);
            } catch  {}
            if (w && Ie && !ee && e.onPaint) {
                const m = d(h);
                m && m.userData.paintable && e.onPaint(m.userData.faceletIndex);
            }
        }
        function D(h) {
            h.preventDefault(), Ce(h.deltaY < 0 ? 1 : -1);
        }
        c.domElement.addEventListener("pointerdown", v), c.domElement.addEventListener("pointermove", E), c.domElement.addEventListener("pointerup", C), c.domElement.addEventListener("pointercancel", C), c.domElement.addEventListener("wheel", D, {
            passive: !1
        });
        function z() {
            ne.disconnect(), c.domElement.removeEventListener("pointerdown", v), c.domElement.removeEventListener("pointermove", E), c.domElement.removeEventListener("pointerup", C), c.domElement.removeEventListener("pointercancel", C), c.domElement.removeEventListener("wheel", D), q(), p.dispose(), x.dispose(), g.dispose(), f.dispose();
            for (const h of Object.keys(a))a[h].dispose();
            c.dispose(), c.domElement.parentNode === t && t.removeChild(c.domElement);
        }
        return {
            loadState: nt,
            updateSticker: be,
            setPalette: Te,
            zoom: Ce,
            setPaintEnabled: X,
            animateMove: ke,
            isAnimating: ()=>ee,
            dispose: z
        };
    }
    function cn(t) {
        const e = [];
        for(let n = 0; n < B.length; n++){
            const o = B[n], s = Oe[o].n;
            for(let r = 0; r < t * t; r++)e.push({
                coord: rn(o, r, t),
                normal: s
            });
        }
        return e;
    }
    const po = 2, Be = 24, at = 4, j = cn(po);
    function ln(t) {
        return t[0] > 0 ? "R" : t[0] < 0 ? "L" : t[1] > 0 ? "U" : t[1] < 0 ? "D" : t[2] > 0 ? "F" : "B";
    }
    function ut(t) {
        return `${t[0]},${t[1]},${t[2]}`;
    }
    function ho(t) {
        const e = t[0] > 0 ? 1 : 0, n = t[1] > 0 ? 1 : 0, o = t[2] > 0 ? 1 : 0;
        return {
            "1,1,1": 0,
            "0,1,1": 1,
            "0,1,0": 2,
            "1,1,0": 3,
            "1,0,1": 4,
            "0,0,1": 5,
            "0,0,0": 6,
            "1,0,0": 7
        }[`${e},${n},${o}`];
    }
    function mo(t, e) {
        return [
            t[1] * e[2] - t[2] * e[1],
            t[2] * e[0] - t[0] * e[2],
            t[0] * e[1] - t[1] * e[0]
        ];
    }
    function go(t, e) {
        return t[0] * e[0] + t[1] * e[1] + t[2] * e[2];
    }
    const an = [], zt = [], un = {};
    (()=>{
        const t = new Map;
        for(let e = 0; e < j.length; e++){
            const n = ut(j[e].coord);
            (t.get(n) ?? t.set(n, []).get(n)).push(e);
        }
        for (const e of t.values()){
            const n = j[e[0]].coord, o = ho(n), s = e.find((u)=>j[u].normal[1] !== 0), r = e.filter((u)=>u !== s), i = j[s].normal, l = go(mo(i, j[r[0]].normal), n) > 0 ? [
                s,
                r[0],
                r[1]
            ] : [
                s,
                r[1],
                r[0]
            ];
            an[o] = l, zt[o] = l.map((u)=>ln(j[u].normal));
            const c = [
                ...zt[o]
            ].sort().join("");
            un[c] = o;
        }
    })();
    function vo(t) {
        const e = new Array(8), n = new Array(8);
        for(let o = 0; o < 8; o++){
            const s = an[o], r = [
                t[s[0]],
                t[s[1]],
                t[s[2]]
            ], i = r.findIndex((c)=>c === "U" || c === "D");
            if (i < 0) return null;
            const l = un[[
                ...r
            ].sort().join("")];
            if (l === void 0) return null;
            e[o] = l, n[o] = i;
        }
        return {
            cp: e,
            co: n
        };
    }
    function wo(t) {
        const e = t.facelets;
        if (e.some((a)=>a === null)) return null;
        const n = {};
        for (const a of e)n[a] = (n[a] ?? 0) + 1;
        const o = Object.keys(n);
        if (o.length !== 6 || o.some((a)=>n[a] !== at)) return null;
        const s = new Map;
        for (const a of o)s.set(a, new Set);
        const r = new Map;
        for(let a = 0; a < j.length; a++){
            const p = ut(j[a].coord);
            (r.get(p) ?? r.set(p, []).get(p)).push(e[a]);
        }
        for (const a of r.values())for (const p of a)for (const x of a)p !== x && s.get(p).add(x);
        const i = {};
        for (const a of o){
            const p = o.filter((x)=>x !== a && !s.get(a).has(x));
            if (p.length !== 1) return null;
            i[a] = p[0];
        }
        const l = j.map((a, p)=>({
                g: a,
                i: p
            })).filter(({ g: a })=>ut(a.coord) === "-1,-1,-1");
        let c = "", u = "", g = "";
        for (const { g: a, i: p } of l){
            const x = ln(a.normal);
            x === "D" ? c = e[p] : x === "L" ? u = e[p] : x === "B" && (g = e[p]);
        }
        if (!c || !u || !g) return null;
        const f = {
            [c]: "D",
            [i[c]]: "U",
            [u]: "L",
            [i[u]]: "R",
            [g]: "B",
            [i[g]]: "F"
        };
        return new Set(Object.values(f)).size !== 6 || Object.keys(f).length !== 6 ? null : f;
    }
    function dn(t) {
        const e = wo(t);
        if (!e) return null;
        let n = "";
        for (const o of t.facelets)n += e[o];
        return n;
    }
    function Eo(t) {
        const e = [], n = t.facelets.filter((u)=>u !== null).length;
        if (n < Be) return e.push({
            code: "incomplete",
            message: `Còn ${Be - n} ô chưa tô (cần đủ ${Be} ô).`
        }), {
            ok: !1,
            errors: e
        };
        const o = {};
        for (const u of t.facelets)o[u] = (o[u] ?? 0) + 1;
        const s = Z.filter((u)=>o[u]), r = s.filter((u)=>o[u] !== at);
        if (s.length !== 6 || r.length > 0) return e.push({
            code: "color-count",
            message: `Cần đúng 6 màu, mỗi màu ${at} ô.`
        }), {
            ok: !1,
            errors: e
        };
        const i = dn(t), l = i ? vo(i) : null;
        return !i || !l ? (e.push({
            code: "impossible-pieces",
            message: "Cách tô tạo ra góc trùng lặp hoặc không tồn tại trên khối Rubik thật."
        }), {
            ok: !1,
            errors: e
        }) : (new Set(l.cp).size !== 8 && e.push({
            code: "impossible-pieces",
            message: "Có góc bị trùng — mỗi góc phải xuất hiện đúng một lần."
        }), l.co.reduce((u, g)=>u + g, 0) % 3 !== 0 && e.push({
            code: "corner-twist",
            message: "Có một góc bị xoay sai hướng (tổng định hướng góc không chia hết cho 3)."
        }), {
            ok: e.length === 0,
            errors: e
        });
    }
    function Ot(t) {
        let e = null, n = !1, o = 0;
        const s = new Map;
        let r = [];
        function i() {
            return e || (e = t(), e.onmessage = (l)=>{
                const c = l.data;
                switch(c.type){
                    case "ready":
                        n = !0, r.forEach((u)=>u()), r = [];
                        break;
                    case "init-error":
                        r = [];
                        break;
                    case "result":
                        s.get(c.id)?.resolve(c.moves), s.delete(c.id);
                        break;
                    case "error":
                        s.get(c.id)?.reject(new Error(c.message)), s.delete(c.id);
                        break;
                }
            }, e.onerror = ()=>{
                s.forEach(({ reject: l })=>l(new Error("Bộ giải gặp lỗi không xác định."))), s.clear();
            }, e.postMessage({
                type: "init"
            }), e);
        }
        return {
            warmUp () {
                i();
            },
            isReady () {
                return n;
            },
            solve (l) {
                const c = i(), u = ++o;
                return new Promise((g, f)=>{
                    s.set(u, {
                        resolve: g,
                        reject: f
                    }), c.postMessage({
                        type: "solve",
                        id: u,
                        facelets: l
                    });
                });
            },
            dispose () {
                e?.terminate(), e = null, n = !1, r = [], s.clear();
            }
        };
    }
    const yo = {
        c1: "#FFFFFF",
        c2: "#B71234",
        c3: "#009B48",
        c4: "#FFD500",
        c5: "#FF5800",
        c6: "#0046AD"
    }, dt = Ot(()=>new Worker(new URL("/_astro/cube2.worker-Dv_EJMNT.js", import.meta.url), {
            type: "module"
        })), bo = {
        id: "fast",
        label: "Giải nhanh (tối ưu)",
        available: !0,
        async solve (t) {
            const e = dn(t);
            if (!e) throw new Error("Trạng thái khối chưa hợp lệ.");
            const n = await dt.solve(e), o = on(n);
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
    };
    function Co() {
        return {
            facelets: new Array(Be).fill(null)
        };
    }
    function ko() {
        const t = [];
        for(let e = 0; e < B.length; e++)for(let n = 0; n < 4; n++)t.push(Je[B[e]]);
        return {
            facelets: t
        };
    }
    const So = {
        id: "cube2",
        label: "Rubik 2×2",
        shortLabel: "2×2",
        description: "Khối Pocket 6 mặt, mỗi mặt 4 ô.",
        illustration: "/images/rubik/cube2.svg",
        enabled: !0,
        colorCount: 6,
        faceletCount: Be,
        colorIds: [
            ...Z
        ],
        defaultPalette: {
            ...yo
        },
        colorLabels: {
            ...Pt
        },
        createInitialState: Co,
        createSolvedState: ko,
        createRenderer (t, e) {
            return _t(t, e, 2);
        },
        validate: Eo,
        solverModes: ()=>[
                bo
            ],
        invertMove: (t)=>sn(t),
        warmUp: ()=>dt.warmUp(),
        isSolverReady: ()=>dt.isReady()
    }, st = [
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
    ], Ut = [
        "URF",
        "UFL",
        "ULB",
        "UBR",
        "DFR",
        "DLF",
        "DBL",
        "DRB"
    ], Nt = [
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
    ], Ne = [
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
    function Lo(t) {
        return `màu ${qt[Yt[t]]}`;
    }
    function jt(t) {
        const e = new Array(t.length).fill(!1);
        let n = 0;
        for(let o = 0; o < t.length; o++){
            if (e[o]) continue;
            let s = o, r = 0;
            for(; !e[s];)e[s] = !0, s = t[s], r++;
            n += r - 1;
        }
        return n % 2;
    }
    function Mo(t) {
        const e = [], n = (a)=>t[a], o = (a)=>a === "U" || a === "D", s = new Array(8).fill(-1), r = new Array(8).fill(0);
        for(let a = 0; a < 8; a++){
            let p = 0;
            for(; p < 3 && !o(n(st[a][p])); p++);
            const x = n(st[a][(p + 1) % 3]), R = n(st[a][(p + 2) % 3]);
            for(let $ = 0; $ < 8; $++)if (x === Ut[$][1] && R === Ut[$][2]) {
                s[a] = $, r[a] = p % 3;
                break;
            }
        }
        const i = new Array(12).fill(-1), l = new Array(12).fill(0);
        for(let a = 0; a < 12; a++){
            const p = n(Nt[a][0]), x = n(Nt[a][1]);
            for(let R = 0; R < 12; R++){
                if (p === Ne[R][0] && x === Ne[R][1]) {
                    i[a] = R, l[a] = 0;
                    break;
                }
                if (p === Ne[R][1] && x === Ne[R][0]) {
                    i[a] = R, l[a] = 1;
                    break;
                }
            }
        }
        const c = s.every((a)=>a >= 0) && new Set(s).size === 8, u = i.every((a)=>a >= 0) && new Set(i).size === 12;
        return !c || !u ? (e.push({
            code: "impossible-pieces",
            message: "Cách tô tạo ra mảnh (góc/cạnh) trùng lặp hoặc không tồn tại trên khối Rubik thật."
        }), e) : (r.reduce((a, p)=>a + p, 0) % 3 !== 0 && e.push({
            code: "corner-twist",
            message: "Có một góc bị xoay sai hướng (tổng định hướng góc không chia hết cho 3)."
        }), l.reduce((a, p)=>a + p, 0) % 2 !== 0 && e.push({
            code: "edge-flip",
            message: "Có một cạnh bị lật ngược (số cạnh lật phải là số chẵn)."
        }), jt(s) !== jt(i) && e.push({
            code: "permutation-parity",
            message: "Sai parity hoán vị — cần hoán đổi đúng một cặp mảnh để khối có thể giải được."
        }), e);
    }
    function xo(t) {
        const e = [], n = Vn(t);
        n < me && e.push({
            code: "incomplete",
            message: `Còn ${me - n} ô chưa tô (cần đủ ${me} ô).`
        });
        const o = Jt(t), s = Z.filter((c)=>o[c] !== 9);
        if (n === me && s.length > 0) {
            const c = s.map((u)=>`${Lo(u)} ${o[u]}/9`).join(", ");
            e.push({
                code: "color-count",
                message: `Mỗi màu phải đúng 9 ô. Sai: ${c}.`
            });
        }
        const i = B.map((c)=>t.facelets[Ft(c)]).filter((c)=>c !== null);
        if (i.length === 6 && new Set(i).size !== 6 && e.push({
            code: "center-dup",
            message: "6 ô trung tâm phải là 6 màu khác nhau."
        }), e.length === 0 && Qt(t)) {
            const c = en(t);
            c && e.push(...Mo(c));
        }
        return {
            ok: e.length === 0,
            errors: e
        };
    }
    let ce = null, fn = !1, Po = 0;
    const ie = new Map;
    let rt = [];
    function pn() {
        return ce || (ce = new Worker(new URL("/_astro/solver.worker-C1g4IsyU.js", import.meta.url), {
            type: "module"
        }), ce.onmessage = (t)=>{
            const e = t.data;
            switch(e.type){
                case "ready":
                    fn = !0, rt.forEach((n)=>n()), rt = [];
                    break;
                case "init-error":
                    rt = [];
                    break;
                case "result":
                    ie.get(e.id)?.resolve(e.moves), ie.delete(e.id);
                    break;
                case "error":
                    ie.get(e.id)?.reject(new Error(e.message)), ie.delete(e.id);
                    break;
            }
        }, ce.onerror = ()=>{
            ie.forEach(({ reject: t })=>t(new Error("Bộ giải gặp lỗi không xác định."))), ie.clear();
        }, ce.postMessage({
            type: "init"
        }), ce);
    }
    function Fo() {
        pn();
    }
    function Ro() {
        return fn;
    }
    function Ao(t) {
        const e = pn(), n = ++Po;
        return new Promise((o, s)=>{
            ie.set(n, {
                resolve: o,
                reject: s
            }), e.postMessage({
                type: "solve",
                id: n,
                facelets: t
            });
        });
    }
    const _o = {
        id: "layer",
        label: "Giải từng tầng",
        available: !1,
        async solve () {
            throw new Error("Chế độ giải từng tầng sẽ được bổ sung sau.");
        }
    }, Oo = {
        id: "fast",
        label: "Giải nhanh",
        available: !0,
        async solve (t) {
            const e = en(t);
            if (!e) throw new Error("Trạng thái khối chưa hợp lệ.");
            const n = await Ao(e), o = on(n);
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
    }, Bo = {
        fast: Oo,
        layer: _o
    };
    function $o() {
        return Object.values(Bo);
    }
    const Do = {
        id: "cube3",
        label: "Rubik 3×3",
        shortLabel: "3×3",
        description: "Khối tiêu chuẩn 6 mặt, mỗi mặt 9 ô.",
        illustration: "/images/rubik/cube3.svg",
        enabled: !0,
        colorCount: 6,
        faceletCount: 54,
        colorIds: [
            ...Z
        ],
        defaultPalette: {
            ...Un
        },
        colorLabels: {
            ...Pt
        },
        createInitialState () {
            return jn();
        },
        createSolvedState () {
            return Wn();
        },
        createRenderer (t, e) {
            return _t(t, e, 3);
        },
        validate: xo,
        solverModes: ()=>$o(),
        invertMove: (t)=>sn(t),
        warmUp: Fo,
        isSolverReady: Ro
    }, Io = 4, $e = 96, ft = 16, To = 16, zo = [
        0,
        3,
        12,
        15
    ], I = cn(Io);
    function hn(t) {
        return t[0] > 0 ? "R" : t[0] < 0 ? "L" : t[1] > 0 ? "U" : t[1] < 0 ? "D" : t[2] > 0 ? "F" : "B";
    }
    const pt = (t)=>`${t[0]},${t[1]},${t[2]}`;
    function Uo(t) {
        const e = t[0] > 0 ? 1 : 0, n = t[1] > 0 ? 1 : 0, o = t[2] > 0 ? 1 : 0;
        return {
            "1,1,1": 0,
            "0,1,1": 1,
            "0,1,0": 2,
            "1,1,0": 3,
            "1,0,1": 4,
            "0,0,1": 5,
            "0,0,0": 6,
            "1,0,0": 7
        }[`${e},${n},${o}`];
    }
    const No = (t, e)=>[
            t[1] * e[2] - t[2] * e[1],
            t[2] * e[0] - t[0] * e[2],
            t[0] * e[1] - t[1] * e[0]
        ], jo = (t, e)=>t[0] * e[0] + t[1] * e[1] + t[2] * e[2], ht = (t)=>zo.includes(t % To), mn = [], gn = {};
    (()=>{
        const t = new Map;
        for(let e = 0; e < I.length; e++){
            if (!ht(e)) continue;
            const n = pt(I[e].coord);
            (t.get(n) ?? t.set(n, []).get(n)).push(e);
        }
        for (const e of t.values()){
            const n = I[e[0]].coord, o = Uo(n), s = e.find((u)=>I[u].normal[1] !== 0), r = e.filter((u)=>u !== s), i = I[s].normal, l = jo(No(i, I[r[0]].normal), n) > 0 ? [
                s,
                r[0],
                r[1]
            ] : [
                s,
                r[1],
                r[0]
            ];
            mn[o] = l;
            const c = l.map((u)=>hn(I[u].normal));
            gn[[
                ...c
            ].sort().join("")] = o;
        }
    })();
    function Wo(t) {
        const e = t.facelets;
        if (e.some((f)=>f === null)) return null;
        const n = {};
        for (const f of e)n[f] = (n[f] ?? 0) + 1;
        const o = Object.keys(n);
        if (o.length !== 6 || o.some((f)=>n[f] !== ft)) return null;
        const s = new Map;
        for (const f of o)s.set(f, new Set);
        const r = new Map;
        for(let f = 0; f < I.length; f++){
            if (!ht(f)) continue;
            const a = pt(I[f].coord);
            (r.get(a) ?? r.set(a, []).get(a)).push(e[f]);
        }
        for (const f of r.values())for (const a of f)for (const p of f)a !== p && s.get(a).add(p);
        const i = {};
        for (const f of o){
            const a = o.filter((p)=>p !== f && !s.get(f).has(p));
            if (a.length !== 1) return null;
            i[f] = a[0];
        }
        let l = "", c = "", u = "";
        for(let f = 0; f < I.length; f++){
            if (!ht(f) || pt(I[f].coord) !== "-3,-3,-3") continue;
            const a = hn(I[f].normal);
            a === "D" ? l = e[f] : a === "L" ? c = e[f] : a === "B" && (u = e[f]);
        }
        if (!l || !c || !u) return null;
        const g = {
            [l]: "D",
            [i[l]]: "U",
            [c]: "L",
            [i[c]]: "R",
            [u]: "B",
            [i[u]]: "F"
        };
        return new Set(Object.values(g)).size !== 6 || Object.keys(g).length !== 6 ? null : g;
    }
    function vn(t) {
        const e = Wo(t);
        if (!e) return null;
        let n = "";
        for (const o of t.facelets)n += e[o];
        return n;
    }
    function Go(t) {
        const e = [];
        let n = 0;
        for(let o = 0; o < 8; o++){
            const s = mn[o], r = [
                t[s[0]],
                t[s[1]],
                t[s[2]]
            ], i = r.findIndex((c)=>c === "U" || c === "D");
            if (i < 0) {
                e.push(-1);
                continue;
            }
            const l = gn[[
                ...r
            ].sort().join("")];
            e.push(l ?? -1), n += i;
        }
        return {
            sum: n % 3,
            distinct: new Set(e).size === 8 && !e.includes(-1)
        };
    }
    function Vo(t) {
        const e = [], n = t.facelets.filter((c)=>c !== null).length;
        if (n < $e) return e.push({
            code: "incomplete",
            message: `Còn ${$e - n} ô chưa tô (cần đủ ${$e} ô).`
        }), {
            ok: !1,
            errors: e
        };
        const o = {};
        for (const c of t.facelets)o[c] = (o[c] ?? 0) + 1;
        const s = Z.filter((c)=>o[c]);
        if (s.length !== 6 || s.some((c)=>o[c] !== ft)) return e.push({
            code: "color-count",
            message: `Cần đúng 6 màu, mỗi màu ${ft} ô.`
        }), {
            ok: !1,
            errors: e
        };
        const r = vn(t);
        if (!r) return e.push({
            code: "center-dup",
            message: "Không suy được khung màu — kiểm tra lại màu các góc/khối."
        }), {
            ok: !1,
            errors: e
        };
        const { sum: i, distinct: l } = Go(r);
        return l || e.push({
            code: "impossible-pieces",
            message: "Có góc trùng hoặc không tồn tại trên khối thật."
        }), i !== 0 && e.push({
            code: "corner-twist",
            message: "Có một góc bị xoay sai hướng (tổng định hướng góc không chia hết cho 3)."
        }), {
            ok: e.length === 0,
            errors: e
        };
    }
    const Ho = {
        c1: "#FFFFFF",
        c2: "#B71234",
        c3: "#009B48",
        c4: "#FFD500",
        c5: "#FF5800",
        c6: "#0046AD"
    }, mt = Ot(()=>new Worker(new URL("/_astro/cube4.worker-DxTtcNj6.js", import.meta.url), {
            type: "module"
        }));
    function wn(t) {
        const e = t[0], n = t.endsWith("2") ? "2" : t.endsWith("'") ? "'" : "";
        return {
            face: e,
            suffix: n,
            notation: t
        };
    }
    const Yo = {
        id: "fast",
        label: "Giải (reduction)",
        available: !0,
        async solve (t) {
            const e = vn(t);
            if (!e) throw new Error("Trạng thái khối chưa hợp lệ.");
            const o = (await mt.solve(e)).split(/\s+/).filter(Boolean).map(wn);
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
    };
    function qo() {
        return {
            facelets: new Array($e).fill(null)
        };
    }
    function Xo() {
        const t = [];
        for(let e = 0; e < B.length; e++)for(let n = 0; n < 16; n++)t.push(Je[B[e]]);
        return {
            facelets: t
        };
    }
    const Ko = {
        id: "cube4",
        label: "Rubik 4×4",
        shortLabel: "4×4",
        description: "Khối Revenge 6 mặt, mỗi mặt 16 ô.",
        illustration: "/images/rubik/cube4.svg",
        enabled: !0,
        colorCount: 6,
        faceletCount: $e,
        colorIds: [
            ...Z
        ],
        defaultPalette: {
            ...Ho
        },
        colorLabels: {
            ...Pt
        },
        createInitialState: qo,
        createSolvedState: Xo,
        createRenderer (t, e) {
            return _t(t, e, 4);
        },
        validate: Vo,
        solverModes: ()=>[
                Yo
            ],
        invertMove: (t)=>{
            const e = t.notation.replace(/['2]$/, ""), n = t.notation.endsWith("2") ? "2" : t.notation.endsWith("'") ? "" : "'";
            return wn(e + n);
        },
        warmUp: ()=>mt.warmUp(),
        isSolverReady: ()=>mt.isReady()
    }, ge = 36, En = 9, ve = [
        [
            1,
            1,
            1
        ],
        [
            1,
            -1,
            -1
        ],
        [
            -1,
            1,
            -1
        ],
        [
            -1,
            -1,
            1
        ]
    ], gt = [
        "U",
        "L",
        "R",
        "B"
    ], We = (t, e)=>[
            t[0] + e[0],
            t[1] + e[1],
            t[2] + e[2]
        ], Wt = (t, e)=>[
            t[0] - e[0],
            t[1] - e[1],
            t[2] - e[2]
        ], je = (t, e)=>[
            t[0] * e,
            t[1] * e,
            t[2] * e
        ], yn = (t, e)=>t[0] * e[0] + t[1] * e[1] + t[2] * e[2], bn = (t, e)=>[
            t[1] * e[2] - t[2] * e[1],
            t[2] * e[0] - t[0] * e[2],
            t[0] * e[1] - t[1] * e[0]
        ], Cn = (t)=>{
        const e = Math.hypot(t[0], t[1], t[2]) || 1;
        return [
            t[0] / e,
            t[1] / e,
            t[2] / e
        ];
    }, kn = (t, e, n)=>je(We(We(t, e), n), 1 / 3);
    function Zo(t, e, n) {
        const o = n * Math.PI / 180, s = Math.cos(o), r = Math.sin(o), i = e, l = bn(i, t), c = yn(i, t) * (1 - s);
        return [
            t[0] * s + l[0] * r + i[0] * c,
            t[1] * s + l[1] * r + i[1] * c,
            t[2] * s + l[2] * r + i[2] * c
        ];
    }
    const Sn = [];
    (()=>{
        for(let t = 0; t < 4; t++){
            const e = [
                0,
                1,
                2,
                3
            ].filter((l)=>l !== t), [n, o, s] = e.map((l)=>ve[l]), r = kn(n, o, s), i = bn(Wt(o, n), Wt(s, n));
            Sn.push(yn(i, r) >= 0 ? e : [
                e[0],
                e[2],
                e[1]
            ]);
        }
    })();
    const Ln = (t)=>`${t[0].toFixed(3)},${t[1].toFixed(3)},${t[2].toFixed(3)}`, M = [];
    (()=>{
        for(let e = 0; e < 4; e++){
            const [n, o, s] = Sn[e], r = ve[n], i = ve[o], l = ve[s], c = (a, p)=>We(We(je(r, (3 - a - p) / 3), je(i, a / 3)), je(l, p / 3)), u = (a, p)=>[
                    c(a, p),
                    c(a + 1, p),
                    c(a, p + 1)
                ], g = (a, p)=>[
                    c(a + 1, p),
                    c(a, p + 1),
                    c(a + 1, p + 1)
                ], f = [
                {
                    tri: u(0, 0),
                    type: "tip",
                    owners: [
                        n
                    ]
                },
                {
                    tri: g(0, 0),
                    type: "axial",
                    owners: [
                        n
                    ]
                },
                {
                    tri: u(1, 0),
                    type: "edge",
                    owners: [
                        n,
                        o
                    ]
                },
                {
                    tri: u(2, 0),
                    type: "tip",
                    owners: [
                        o
                    ]
                },
                {
                    tri: g(1, 0),
                    type: "axial",
                    owners: [
                        o
                    ]
                },
                {
                    tri: u(1, 1),
                    type: "edge",
                    owners: [
                        o,
                        s
                    ]
                },
                {
                    tri: u(0, 2),
                    type: "tip",
                    owners: [
                        s
                    ]
                },
                {
                    tri: g(0, 1),
                    type: "axial",
                    owners: [
                        s
                    ]
                },
                {
                    tri: u(0, 1),
                    type: "edge",
                    owners: [
                        s,
                        n
                    ]
                }
            ];
            for (const a of f)M.push({
                face: e,
                type: a.type,
                owners: a.owners,
                corners: a.tri,
                centroid: kn(a.tri[0], a.tri[1], a.tri[2])
            });
        }
    })();
    const Mn = new Map;
    M.forEach((t, e)=>Mn.set(Ln(t.centroid), e));
    function Jo(t, e, n) {
        return n === "tip" ? t.type === "tip" && t.owners[0] === e : t.type === "edge" ? t.owners.includes(e) : t.owners[0] === e;
    }
    function vt(t) {
        const e = Cn(ve[t.vertex]), n = M.map((o, s)=>s);
        for(let o = 0; o < M.length; o++){
            const s = M[o];
            if (!Jo(s, t.vertex, t.layer)) continue;
            const r = Zo(s.centroid, e, t.deg), i = Mn.get(Ln(r));
            i !== void 0 && (n[i] = o);
        }
        return n;
    }
    function Qo() {
        const t = [];
        for(let e = 0; e < 4; e++)t.push({
            notation: gt[e],
            vertex: e,
            layer: "axial",
            deg: -120
        }), t.push({
            notation: `${gt[e]}'`,
            vertex: e,
            layer: "axial",
            deg: 120
        });
        return t;
    }
    function es() {
        const t = [];
        for(let e = 0; e < 4; e++){
            const n = gt[e].toLowerCase();
            t.push({
                notation: n,
                vertex: e,
                layer: "tip",
                deg: -120
            }), t.push({
                notation: `${n}'`,
                vertex: e,
                layer: "tip",
                deg: 120
            });
        }
        return t;
    }
    function ts(t) {
        return Cn(ve[t]);
    }
    function ns(t) {
        const e = /^([ulrbULRB])('?)$/.exec(t.trim());
        if (!e) return null;
        const n = "ULRB".indexOf(e[1].toUpperCase());
        if (n < 0) return null;
        const o = e[1] === e[1].toLowerCase() ? "tip" : "axial", s = e[2] === "'" ? 120 : -120;
        return {
            notation: t,
            vertex: n,
            layer: o,
            deg: s
        };
    }
    function xn(t) {
        const e = t.facelets;
        if (e.some((r)=>r === null)) return null;
        const n = {};
        for (const r of e)n[r] = (n[r] ?? 0) + 1;
        const o = Object.keys(n);
        if (o.length !== 4 || o.some((r)=>n[r] !== En)) return null;
        const s = {};
        for(let r = 0; r < 4; r++){
            const i = new Set;
            if (M.forEach((c, u)=>{
                c.type === "axial" && c.owners[0] === r && i.add(e[u]);
            }), i.size !== 3) return null;
            const l = o.filter((c)=>!i.has(c));
            if (l.length !== 1) return null;
            s[l[0]] = r;
        }
        return new Set(Object.values(s)).size !== 4 ? null : s;
    }
    function Pn(t) {
        const e = xn(t);
        if (!e) return null;
        let n = "";
        for (const o of t.facelets)n += String(e[o]);
        return n;
    }
    const Fn = [
        [],
        [],
        [],
        []
    ], Rn = [
        [],
        [],
        [],
        []
    ], De = [];
    (()=>{
        const t = (n, o)=>{
            const s = new Map;
            for(let c = 0; c < o.length; c++)s.set(o[c], c);
            const r = n[0], i = [
                r
            ];
            let l = s.get(r);
            for(; l !== r && i.length < n.length;)i.push(l), l = s.get(l);
            return i;
        };
        for(let n = 0; n < 4; n++){
            const o = vt({
                vertex: n,
                layer: "tip",
                deg: -120
            }), s = vt({
                vertex: n,
                layer: "axial",
                deg: -120
            }), r = M.map((l, c)=>({
                    fl: l,
                    i: c
                })).filter(({ fl: l })=>l.type === "tip" && l.owners[0] === n).map(({ i: l })=>l), i = M.map((l, c)=>({
                    fl: l,
                    i: c
                })).filter(({ fl: l })=>l.type === "axial" && l.owners[0] === n).map(({ i: l })=>l);
            Fn[n] = t(r, o), Rn[n] = t(i, s);
        }
        const e = new Map;
        M.forEach((n, o)=>{
            if (n.type !== "edge") return;
            const s = [
                ...n.owners
            ].sort((r, i)=>r - i).join("-");
            (e.get(s) ?? e.set(s, []).get(s)).push(o);
        });
        for (const n of e.values()){
            const [o, s] = n;
            M[o].face <= M[s].face ? De.push({
                a: o,
                b: s,
                faceA: M[o].face,
                faceB: M[s].face
            }) : De.push({
                a: s,
                b: o,
                faceA: M[s].face,
                faceB: M[o].face
            });
        }
    })();
    const _e = De.length, os = De.map((t)=>[
            t.faceA,
            t.faceB
        ]);
    function ss(t) {
        const e = [
            0,
            0,
            0,
            0
        ], n = [
            0,
            0,
            0,
            0
        ];
        for(let r = 0; r < 4; r++){
            const i = Gt(Rn[r], t);
            if (i < 0) return null;
            n[r] = i;
            const l = Gt(Fn[r], t);
            if (l < 0) return null;
            e[r] = l;
        }
        const o = new Array(_e).fill(-1), s = new Array(_e).fill(0);
        for(let r = 0; r < _e; r++){
            const i = De[r], l = Number(t[i.a]), c = Number(t[i.b]);
            let u = -1, g = 0;
            for(let f = 0; f < _e; f++){
                const [a, p] = os[f];
                if (l === a && c === p) {
                    u = f, g = 0;
                    break;
                }
                if (l === p && c === a) {
                    u = f, g = 1;
                    break;
                }
            }
            if (u < 0) return null;
            o[r] = u, s[r] = g;
        }
        return {
            tips: e,
            axials: n,
            ep: o,
            eo: s
        };
    }
    function Gt(t, e) {
        const n = t.map((r)=>M[r].face), o = t.map((r)=>Number(e[r])), s = t.length;
        for(let r = 0; r < s; r++){
            let i = !0;
            for(let l = 0; l < s; l++)if (o[l] !== n[(l - r + s) % s]) {
                i = !1;
                break;
            }
            if (i) return r;
        }
        return -1;
    }
    function rs(t) {
        const e = new Array(t.length).fill(!1);
        let n = 0;
        for(let o = 0; o < t.length; o++){
            if (e[o]) continue;
            let s = o, r = 0;
            for(; !e[s];)e[s] = !0, s = t[s], r++;
            n += r - 1;
        }
        return n % 2;
    }
    function cs(t) {
        const e = [], n = t.facelets.filter((l)=>l !== null).length;
        if (n < ge) return e.push({
            code: "incomplete",
            message: `Còn ${ge - n} ô chưa tô (cần đủ ${ge} ô).`
        }), {
            ok: !1,
            errors: e
        };
        if (!xn(t)) return e.push({
            code: "color-count",
            message: `Cần đúng 4 màu, mỗi màu ${En} ô và sắp xếp hợp lệ.`
        }), {
            ok: !1,
            errors: e
        };
        const s = Pn(t), r = ss(s);
        return r ? (new Set(r.ep).size !== _e && e.push({
            code: "impossible-pieces",
            message: "Có cạnh bị trùng — mỗi cạnh phải xuất hiện đúng một lần."
        }), rs(r.ep) !== 0 && e.push({
            code: "edge-parity",
            message: "Sai thứ tự cạnh (cần hoán vị chẵn) — không thể giải được."
        }), r.eo.reduce((l, c)=>l + c, 0) % 2 !== 0 && e.push({
            code: "edge-flip",
            message: "Có một cạnh bị lật ngược (số cạnh lật phải là số chẵn)."
        }), {
            ok: e.length === 0,
            errors: e
        }) : (e.push({
            code: "impossible-pieces",
            message: "Cách tô tạo ra mảnh cạnh trùng lặp hoặc không tồn tại."
        }), {
            ok: !1,
            errors: e
        });
    }
    const ct = .86, it = .012, is = 921878, ls = 2501427, as = 6, Vt = .55, us = 2.6, ds = 1.7;
    function fs(t) {
        const n = M.find((s)=>s.face === t).centroid, o = Math.hypot(n[0], n[1], n[2]) || 1;
        return [
            n[0] / o,
            n[1] / o,
            n[2] / o
        ];
    }
    async function ps(t, e) {
        const n = await Ht(()=>import("./three.CuzN0wor.js"), []), o = new n.Scene, s = new n.PerspectiveCamera(42, 1, .1, 100);
        s.position.set(0, 0, 6.2), s.zoom = Vt;
        const r = new n.WebGLRenderer({
            antialias: !0,
            alpha: !0
        });
        r.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2)), t.appendChild(r.domElement);
        const i = new n.Group;
        i.rotation.x = -.32, i.rotation.y = .5, i.scale.setScalar(ds), o.add(i);
        const l = new n.MeshBasicMaterial({
            color: ls,
            side: n.DoubleSide
        }), c = {};
        for (const d of Object.keys(e.palette))c[d] = new n.MeshBasicMaterial({
            color: new n.Color(e.palette[d]),
            side: n.DoubleSide
        });
        const u = (d)=>d ? c[d] : l, g = new n.MeshBasicMaterial({
            color: is
        });
        for(let d = 0; d < 4; d++){
            const v = M.filter((w)=>w.face === d), E = new Set, C = [];
            for (const w of v)for (const m of w.corners){
                const L = m.map((S)=>S.toFixed(3)).join(",");
                E.has(L) || (E.add(L), C.push(m));
            }
            const D = C.sort((w, m)=>Math.hypot(m[0], m[1], m[2]) - Math.hypot(w[0], w[1], w[2])).slice(0, 3), z = new n.BufferGeometry;
            z.setAttribute("position", new n.Float32BufferAttribute(D.flat(), 3)), z.setIndex([
                0,
                1,
                2
            ]);
            const h = new n.Mesh(z, g);
            i.add(h);
        }
        let f = [];
        function a(d) {
            const v = fs(d.face), E = d.centroid, C = [];
            for (const z of d.corners){
                const h = [
                    E[0] + (z[0] - E[0]) * ct + v[0] * it,
                    E[1] + (z[1] - E[1]) * ct + v[1] * it,
                    E[2] + (z[2] - E[2]) * ct + v[2] * it
                ];
                C.push(h[0], h[1], h[2]);
            }
            const D = new n.BufferGeometry;
            return D.setAttribute("position", new n.Float32BufferAttribute(C, 3)), D.setIndex([
                0,
                1,
                2
            ]), D;
        }
        function p() {
            for (const d of f)i.remove(d.mesh), d.mesh.geometry.dispose();
            f = [];
        }
        function x(d) {
            p();
            for(let v = 0; v < ge; v++){
                const E = new n.Mesh(a(M[v]), u(d[v]));
                E.userData.pos = v, i.add(E), f.push({
                    mesh: E,
                    pos: v
                });
            }
            X();
        }
        function R(d, v) {
            const E = f.find((C)=>C.pos === d);
            E && (E.mesh.material = u(v), X());
        }
        function $(d) {
            for (const v of Object.keys(d))c[v]?.color.set(new n.Color(d[v]));
            X();
        }
        function ue(d) {
            const v = d > 0 ? 1.15 : .8695652173913044;
            s.zoom = Math.min(us, Math.max(Vt, s.zoom * v)), s.updateProjectionMatrix(), X();
        }
        let de = !1;
        function ee(d) {
            de = d;
        }
        const Ie = new Map, ye = new Map;
        for (const d of [
            ...Qo(),
            ...es()
        ]){
            const v = vt(d);
            Ie.set(d.notation, v);
            const E = new Array(v.length);
            for(let C = 0; C < v.length; C++)E[v[C]] = C;
            ye.set(d.notation, E);
        }
        let q = !1;
        function nt(d, v) {
            if (q) return Promise.resolve();
            const E = ns(d.notation), C = ye.get(d.notation);
            if (!E || !C) return Promise.resolve();
            q = !0;
            const D = ts(E.vertex), z = new n.Vector3(D[0], D[1], D[2]), h = E.deg * Math.PI / 180, w = f.filter((A)=>C[A.pos] !== A.pos), m = new n.Group;
            i.add(m);
            for (const A of w)m.attach(A.mesh);
            const L = Math.max(60, v), S = performance.now();
            return new Promise((A)=>{
                const F = (_)=>{
                    const V = Math.min(1, (_ - S) / L), Re = V < .5 ? 2 * V * V : 1 - Math.pow(-2 * V + 2, 2) / 2;
                    if (m.quaternion.setFromAxisAngle(z, h * Re), r.render(o, s), V < 1) {
                        requestAnimationFrame(F);
                        return;
                    }
                    for (const O of w)i.attach(O.mesh), O.pos = C[O.pos], O.mesh.userData.pos = O.pos;
                    i.remove(m), q = !1, r.render(o, s), A();
                };
                requestAnimationFrame(F);
            });
        }
        let be = !1;
        function X() {
            be || (be = !0, requestAnimationFrame(()=>{
                be = !1, r.render(o, s);
            }));
        }
        function Te() {
            const d = t.clientWidth || 1, v = t.clientHeight || 1;
            r.setSize(d, v, !1), s.aspect = d / v, s.updateProjectionMatrix(), X();
        }
        const Ce = new ResizeObserver(Te);
        Ce.observe(t), Te();
        const ze = new n.Raycaster, ke = new n.Vector2, Se = new n.Vector3(0, 1, 0), K = new n.Vector3(1, 0, 0);
        let te = !1, ne = !1, Le = 0, fe = 0, Me = 0, xe = 0;
        function pe(d) {
            const v = r.domElement.getBoundingClientRect();
            ke.x = (d.clientX - v.left) / v.width * 2 - 1, ke.y = -((d.clientY - v.top) / v.height) * 2 + 1, o.updateMatrixWorld(!0), ze.setFromCamera(ke, s);
            const E = ze.intersectObjects(f.map((C)=>C.mesh), !1);
            return E.length ? E[0].object : null;
        }
        function oe(d) {
            te = !0, ne = !1, Le = Me = d.clientX, fe = xe = d.clientY, r.domElement.setPointerCapture(d.pointerId);
        }
        function Pe(d) {
            if (te) {
                if (!ne) {
                    if (Math.hypot(d.clientX - Le, d.clientY - fe) < as) return;
                    ne = !0;
                }
                i.rotateOnWorldAxis(Se, (d.clientX - Me) * .008), i.rotateOnWorldAxis(K, (d.clientY - xe) * .008), Me = d.clientX, xe = d.clientY, X();
            }
        }
        function se(d) {
            const v = te && !ne;
            te = !1;
            try {
                r.domElement.releasePointerCapture(d.pointerId);
            } catch  {}
            if (v && de && !q && e.onPaint) {
                const E = pe(d);
                E && e.onPaint(E.userData.pos);
            }
        }
        function he(d) {
            d.preventDefault(), ue(d.deltaY < 0 ? 1 : -1);
        }
        r.domElement.addEventListener("pointerdown", oe), r.domElement.addEventListener("pointermove", Pe), r.domElement.addEventListener("pointerup", se), r.domElement.addEventListener("pointercancel", se), r.domElement.addEventListener("wheel", he, {
            passive: !1
        });
        function Fe() {
            Ce.disconnect(), r.domElement.removeEventListener("pointerdown", oe), r.domElement.removeEventListener("pointermove", Pe), r.domElement.removeEventListener("pointerup", se), r.domElement.removeEventListener("pointercancel", se), r.domElement.removeEventListener("wheel", he), p(), l.dispose(), g.dispose();
            for (const d of Object.keys(c))c[d].dispose();
            r.dispose(), r.domElement.parentNode === t && t.removeChild(r.domElement);
        }
        return {
            loadState: x,
            updateSticker: R,
            setPalette: $,
            zoom: ue,
            setPaintEnabled: ee,
            animateMove: nt,
            isAnimating: ()=>q,
            dispose: Fe
        };
    }
    const hs = [
        "c1",
        "c2",
        "c3",
        "c4"
    ], wt = Ot(()=>new Worker(new URL("/_astro/pyraminx.worker-DXAdWFLc.js", import.meta.url), {
            type: "module"
        }));
    function An(t) {
        const e = t[0].toUpperCase(), n = t.endsWith("'") ? "'" : "";
        return {
            face: e,
            suffix: n,
            notation: t
        };
    }
    const ms = {
        id: "fast",
        label: "Giải nhanh (tối ưu)",
        available: !0,
        async solve (t) {
            const e = Pn(t);
            if (!e) throw new Error("Trạng thái khối chưa hợp lệ.");
            const n = await wt.solve(e), [o, s] = n.split("|"), r = (g)=>g.split(/\s+/).filter(Boolean).map(An), i = r(o ?? ""), l = r(s ?? ""), c = [];
            i.length && c.push({
                name: "Cạnh & tâm",
                moves: i
            }), l.length && c.push({
                name: "Đỉnh",
                moves: l
            });
            const u = [
                ...i,
                ...l
            ];
            return c.length === 0 && c.push({
                name: "Giải",
                moves: u
            }), {
                mode: "fast",
                phases: c,
                moves: u
            };
        }
    };
    function gs() {
        return {
            facelets: new Array(ge).fill(null)
        };
    }
    function vs() {
        return {
            facelets: M.map((e)=>`c${e.face + 1}`)
        };
    }
    const ws = {
        id: "pyraminx",
        label: "Rubik hình chóp",
        shortLabel: "Pyraminx",
        description: "Tứ diện 4 mặt tam giác, mỗi mặt 9 ô.",
        illustration: "/images/rubik/pyraminx.svg",
        enabled: !0,
        colorCount: 4,
        faceletCount: ge,
        colorIds: [
            ...hs
        ],
        defaultPalette: {
            c1: "#FFD500",
            c2: "#009B48",
            c3: "#B71234",
            c4: "#0046AD"
        },
        colorLabels: {
            c1: "Màu 1",
            c2: "Màu 2",
            c3: "Màu 3",
            c4: "Màu 4"
        },
        createInitialState: gs,
        createSolvedState: vs,
        createRenderer (t, e) {
            return ps(t, e);
        },
        validate: cs,
        solverModes: ()=>[
                ms
            ],
        invertMove: (t)=>{
            const e = t.notation.endsWith("'") ? t.notation.slice(0, -1) : `${t.notation}'`;
            return An(e);
        },
        warmUp: ()=>wt.warmUp(),
        isSolverReady: ()=>wt.isReady()
    }, _n = [
        So,
        Do,
        Ko,
        ws
    ], Es = new Map(_n.map((t)=>[
            t.id,
            t
        ]));
    function ys() {
        return _n;
    }
    function bs(t) {
        return Es.get(t);
    }
    class Cs {
        constructor(e, n){
            this.container = e, this.onPick = n, this.build();
        }
        container;
        onPick;
        build() {
            this.container.innerHTML = "";
            for (const e of ys()){
                const n = document.createElement(e.enabled ? "button" : "div");
                n.className = "rs-puzzle-card", e.enabled ? (n.type = "button", n.addEventListener("click", ()=>this.onPick(e.id))) : n.classList.add("rs-puzzle-card--soon");
                const o = document.createElement("img");
                o.className = "rs-puzzle-card__img", o.src = e.illustration, o.alt = e.label, o.loading = "lazy", o.width = 120, o.height = 120;
                const s = document.createElement("h3");
                s.className = "rs-puzzle-card__title", s.textContent = e.label;
                const r = document.createElement("p");
                if (r.className = "rs-puzzle-card__desc", r.textContent = e.description, n.append(o, s, r), !e.enabled) {
                    const i = document.createElement("span");
                    i.className = "rs-puzzle-card__badge", i.textContent = "Đang phát triển", n.appendChild(i);
                }
                this.container.appendChild(n);
            }
        }
    }
    class ks {
        refs;
        opts;
        modes = [];
        isReady = ()=>!0;
        result = null;
        moveEls = [];
        constructor(e, n){
            this.refs = e, this.opts = n, this.refs.solveBtn.addEventListener("click", ()=>this.runSolve()), this.refs.copyBtn.addEventListener("click", ()=>this.copy());
        }
        setModes(e, n) {
            this.modes = e, this.isReady = n ?? (()=>!0), this.populateModes();
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
            this.moveEls.forEach((n, o)=>{
                n.classList.toggle("rs-move--done", o < e), n.classList.toggle("rs-move--current", o === e);
            });
        }
        populateModes() {
            this.refs.modeSelect.innerHTML = "";
            for (const e of this.modes){
                const n = document.createElement("option");
                n.value = e.id, n.textContent = e.label, n.disabled = !e.available, this.refs.modeSelect.appendChild(n);
            }
        }
        currentMode() {
            const e = this.refs.modeSelect.value;
            return this.modes.find((n)=>n.id === e) ?? this.modes[0];
        }
        setStatus(e, n) {
            this.refs.status.textContent = e, this.refs.status.className = "rs-solver-status", n && this.refs.status.classList.add(`rs-solver-status--${n}`);
        }
        async runSolve() {
            if (!this.opts.isValid()) return;
            const e = this.currentMode();
            if (e) {
                this.refs.solveBtn.disabled = !0, this.setStatus(this.isReady() ? "Đang giải..." : "Đang khởi tạo bộ giải (lần đầu mất vài giây)...", "loading");
                try {
                    const n = await e.solve(this.opts.getState());
                    this.result = n, this.renderSolution(n), n.moves.length === 0 ? this.setStatus("Khối đã ở trạng thái đã giải.", "success") : this.setStatus(`Đã tìm thấy lời giải gồm ${n.moves.length} bước.`, "success"), this.opts.onSolved(n);
                } catch (n) {
                    this.result = null, this.hideSolution(), this.setStatus(n instanceof Error ? n.message : String(n), "error");
                } finally{
                    this.refs.solveBtn.disabled = !this.opts.isValid();
                }
            }
        }
        renderSolution(e) {
            this.refs.movesEl.innerHTML = "", this.moveEls = [];
            const n = e.phases.length > 1;
            let o = 0;
            for (const s of e.phases){
                if (n) {
                    const r = document.createElement("div");
                    r.className = "rs-phase", r.textContent = s.name, this.refs.movesEl.appendChild(r);
                }
                for (const r of s.moves){
                    const i = document.createElement("span");
                    i.className = "rs-move", i.textContent = r.notation, i.dataset.index = String(o), this.refs.movesEl.appendChild(i), this.moveEls.push(i), o++;
                }
            }
            this.refs.solutionWrap.hidden = !1, this.setProgress(0);
        }
        hideSolution() {
            this.refs.solutionWrap.hidden = !0, this.refs.movesEl.innerHTML = "", this.moveEls = [];
        }
        async copy() {
            if (!this.result) return;
            const e = so(this.result.moves);
            try {
                await navigator.clipboard.writeText(e);
                const n = this.refs.copyBtn.innerHTML;
                this.refs.copyBtn.textContent = "Đã sao chép ✓", window.setTimeout(()=>{
                    this.refs.copyBtn.innerHTML = n;
                }, 1500);
            } catch  {
                this.setStatus("Không sao chép được vào clipboard.", "error");
            }
        }
    }
    const y = (t)=>document.getElementById(t);
    let Ge = null, k = null, U, Y = {}, Ve = null, we = null, G = null, On = null, Et = !1, b = null, Ee = "paint", N = [], P = 0, yt = [], T = !1, le = null, bt = null, Ct = null, kt = null, He = null, Ye = null, qe = null, St = null, Lt = null, Xe = null, Ke = null, Mt = null, Ze = null, Bn = null;
    function J(t) {
        Ge && (Ge.dataset.step = t);
    }
    function Ss(t) {
        return t.faceletCount / t.colorCount;
    }
    function et() {
        if (!Ve || !k) return;
        const t = Jt(U);
        for (const e of k.colorIds)Ve.setCount(e, t[e]);
    }
    function tt() {
        if (!k) return;
        const t = k.validate(U);
        if (On = t, le) if (le.classList.remove("rs-validation--success", "rs-validation--error", "rs-validation--empty"), t.ok) le.classList.add("rs-validation--success"), le.innerHTML = '<p class="rs-validation__title">✓ Trạng thái hợp lệ.</p>';
        else {
            le.classList.add("rs-validation--error");
            const e = t.errors.map((n)=>`<li>${n.message}</li>`).join("");
            le.innerHTML = `<p class="rs-validation__title">Chưa thể giải:</p><ul class="rs-validation__list">${e}</ul>`;
        }
        G?.setValid(t.ok), t.ok && !Et && (Et = !0, k.warmUp?.());
    }
    function Ls(t) {
        if (Ee !== "paint") return;
        const e = Ve?.getSelection() ?? k?.colorIds[0];
        e && (Gn(U, t, e), b?.updateSticker(t, e), et(), tt());
    }
    function $n() {
        const t = Ct ? Number(Ct.value) : 6;
        return Math.max(100, 1300 - t * 120);
    }
    function Q(t) {
        kt && (kt.hidden = !t), He && (He.disabled = !t || P <= 0), Ye && (Ye.disabled = !t || P >= N.length), qe && (qe.disabled = !t || N.length === 0), Xe && (Xe.disabled = !t);
    }
    function ae() {
        St && (St.hidden = T), Lt && (Lt.hidden = !T);
    }
    async function Dn() {
        !b || P >= N.length || b.isAnimating() || (await b.animateMove(N[P], $n()), P++, G?.setProgress(P), Q(!0));
    }
    async function Ms() {
        !b || !k || P <= 0 || b.isAnimating() || (await b.animateMove(k.invertMove(N[P - 1]), $n()), P--, G?.setProgress(P), Q(!0));
    }
    function xs(t) {
        return new Promise((e)=>window.setTimeout(e, t));
    }
    async function Ps() {
        if (T) {
            T = !1, ae();
            return;
        }
        for(P >= N.length && (P = 0), T = !0, ae(); T && P < N.length && (await Dn(), !!T);)await xs(140);
        T = !1, ae();
    }
    function Fs() {
        b && (T = !1, ae(), b.loadState(yt.slice()), P = 0, G?.setProgress(0), Q(!0));
    }
    function Rs(t) {
        Ee = "solution", N = t.moves, P = 0, yt = U.facelets.slice(), b?.setPaintEnabled(!1), b?.loadState(yt.slice()), G?.setProgress(0), J("solve"), Q(!0);
    }
    async function As() {
        !bt || !k || (b?.dispose(), b = await k.createRenderer(bt, {
            palette: Y,
            onPaint: Ls
        }), b.loadState(U.facelets.slice()), b.setPaintEnabled(!1));
    }
    async function _s(t) {
        const e = bs(t);
        if (!e || !e.enabled) return;
        k = e, Et = !1, U = e.createInitialState(), Ee = "paint", N = [], P = 0;
        const n = await Xn(t);
        Y = In(e, n), G?.setModes(e.solverModes(), e.isSolverReady), G?.reset(), Ze && (Ze.hidden = !e.createSolvedState), await As(), await Os(e, n), Q(!1), J("colors");
    }
    function In(t, e) {
        const n = {}, o = e && e.length === t.colorCount;
        return t.colorIds.forEach((s, r)=>{
            n[s] = o ? e[r] : t.defaultPalette[s];
        }), n;
    }
    async function Os(t, e) {
        const n = y("rs-colorsetup");
        if (!n) return;
        we?.destroy();
        const o = await Kn(Object.values(t.defaultPalette));
        we = new to(n, {
            colorIds: t.colorIds,
            labels: t.colorLabels,
            initial: In(t, e),
            pool: o
        }, {
            onChange: (s, r)=>{
                Y = s, b?.setPalette(Y), Mt && (Mt.textContent = r ? "" : `Cần ${t.colorCount} màu khác nhau để phân biệt các mặt.`), Ke && (Ke.disabled = !r);
            },
            onAddColor: (s)=>{
                Zn(s);
            }
        });
    }
    function Bs() {
        if (!k || !we || (we.destroy(), Y = we.getPalette(), !(new Set(Object.values(Y)).size === k.colorCount))) return;
        Jn(k.id, k.colorIds.map((n)=>Y[n]));
        const e = y("rs-palette");
        e && (Ve = new Yn(e, {
            colorIds: k.colorIds,
            palette: Y,
            labels: k.colorLabels,
            perColor: Ss(k)
        })), b?.setPalette(Y), b?.setPaintEnabled(!0), Ee = "paint", et(), tt(), Q(!1), J("paint");
    }
    function Tn() {
        k && (U = k.createInitialState(), Ee = "paint", N = [], P = 0, T = !1, ae(), G?.reset(), b?.loadState(U.facelets.slice()), et(), tt(), Q(!1));
    }
    function $s() {
        Tn(), b?.setPaintEnabled(!0), J("paint");
    }
    function Ds() {
        Tn(), b?.setPaintEnabled(!1), J("colors");
    }
    function Is() {
        T = !1, ae(), we?.destroy(), b?.dispose(), b = null, k = null, J("pick");
    }
    function Ts() {
        k?.createSolvedState && (U = k.createSolvedState(), Ee = "paint", N = [], P = 0, T = !1, ae(), G?.reset(), b?.setPaintEnabled(!0), b?.loadState(U.facelets.slice()), et(), tt(), Q(!1), J("paint"));
    }
    function zs() {
        document.fullscreenElement ? document.exitFullscreen() : Bn?.requestFullscreen?.();
    }
    function Us() {
        const t = !!document.fullscreenElement;
        document.querySelectorAll(".rs-fullscreen").forEach((e)=>{
            e.querySelectorAll(".rs-fs-icon").forEach((o)=>{
                o.hidden = o.dataset.fs === "expand" ? t : !t;
            });
            const n = t ? "Thoát toàn màn hình" : "Toàn màn hình";
            e.title = n, e.setAttribute("aria-label", n);
        });
    }
    function Ns() {
        if (Ge = y("rs-app"), !Ge) return;
        le = y("rs-validation"), bt = y("rs-viewer"), Ct = y("rs-speed"), kt = y("rs-playback"), He = y("rs-prev"), Ye = y("rs-next"), qe = y("rs-auto"), St = y("rs-auto-play"), Lt = y("rs-auto-pause"), Xe = y("rs-reset-view"), Ke = y("rs-colors-continue"), Mt = y("rs-colors-msg"), Ze = y("rs-example");
        const t = js();
        t && (G = new ks(t, {
            getState: ()=>U,
            isValid: ()=>On?.ok ?? !1,
            onSolved: Rs
        }));
        const e = y("rs-pick");
        e && new Cs(e, (n)=>{
            _s(n);
        }), Ke?.addEventListener("click", Bs), y("rs-recolor")?.addEventListener("click", Ds), y("rs-change-puzzle")?.addEventListener("click", Is), y("rs-clear")?.addEventListener("click", $s), Ze?.addEventListener("click", Ts), He?.addEventListener("click", ()=>{
            Ms();
        }), Ye?.addEventListener("click", ()=>{
            Dn();
        }), qe?.addEventListener("click", ()=>{
            Ps();
        }), Xe?.addEventListener("click", Fs), y("rs-zoom-in")?.addEventListener("click", ()=>b?.zoom(1)), y("rs-zoom-out")?.addEventListener("click", ()=>b?.zoom(-1)), Bn = y("rs-workspace"), document.querySelectorAll(".rs-fullscreen").forEach((n)=>n.addEventListener("click", zs)), document.addEventListener("fullscreenchange", Us), window.addEventListener("pagehide", ()=>{
            b?.dispose(), b = null;
        }), J("pick");
    }
    function js() {
        const t = y("rs-mode"), e = y("rs-solve"), n = y("rs-solver-status"), o = y("rs-solution"), s = y("rs-moves"), r = y("rs-copy");
        return !t || !e || !n || !o || !s || !r ? null : {
            modeSelect: t,
            solveBtn: e,
            status: n,
            solutionWrap: o,
            movesEl: s,
            copyBtn: r
        };
    }
    document.addEventListener("DOMContentLoaded", ()=>Ns());
})();
