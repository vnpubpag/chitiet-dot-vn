const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["_astro/three.DBcLZM-e.js","_astro/rolldown-runtime.DAXXjFlN.js"])))=>i.map(i=>d[i]);
import { t as e } from "./preload-helper.L5lOfJxi.js";
import { t } from "./kv-store.BjtCR2N9.js";
(async ()=>{
    var n = [
        `U`,
        `R`,
        `F`,
        `D`,
        `L`,
        `B`
    ], r = [
        `c1`,
        `c2`,
        `c3`,
        `c4`,
        `c5`,
        `c6`
    ], i = {
        U: `c1`,
        R: `c2`,
        F: `c3`,
        D: `c4`,
        L: `c5`,
        B: `c6`
    }, a = {
        c1: `U`,
        c2: `R`,
        c3: `F`,
        c4: `D`,
        c5: `L`,
        c6: `B`
    }, o = {
        U: `Trên (U)`,
        D: `Dưới (D)`,
        F: `Trước (F)`,
        B: `Sau (B)`,
        L: `Trái (L)`,
        R: `Phải (R)`
    }, s = Object.fromEntries(r.map((e)=>[
            e,
            o[a[e]]
        ])), c = {
        c1: `#FFFFFF`,
        c2: `#B71234`,
        c3: `#009B48`,
        c4: `#FFD500`,
        c5: `#FF5800`,
        c6: `#0046AD`
    }, l = 9, u = 4;
    function d(e, t) {
        return n.indexOf(e) * l + t;
    }
    function f(e) {
        return d(e, u);
    }
    function p() {
        return {
            facelets: Array(54).fill(null)
        };
    }
    function m() {
        let e = p();
        for (let t of n)e.facelets[f(t)] = i[t];
        return e;
    }
    function h() {
        let e = p();
        for (let t of n)for(let n = 0; n < l; n++)e.facelets[d(t, n)] = i[t];
        return e;
    }
    function g(e, t, n) {
        e.facelets[t] = n;
    }
    function ee(e) {
        let t = {};
        for (let e of r)t[e] = 0;
        for (let n of e.facelets)n && t[n]++;
        return t;
    }
    function _(e) {
        let t = 0;
        for (let n of e.facelets)n && t++;
        return t;
    }
    function v(e) {
        return e.facelets.every((e)=>e !== null);
    }
    function te(e) {
        let t = {}, r = new Set;
        for (let i of n){
            let n = e.facelets[f(i)];
            if (!n || r.has(n)) return null;
            r.add(n), t[n] = i;
        }
        return t;
    }
    function y(e) {
        if (!v(e)) return null;
        let t = te(e);
        if (!t) return null;
        let n = ``;
        for(let r = 0; r < 54; r++){
            let i = e.facelets[r];
            n += t[i];
        }
        return n;
    }
    var b = class {
        selection;
        container;
        cfg;
        listeners = [];
        countEls = new Map;
        constructor(e, t){
            this.container = e, this.cfg = t, this.selection = t.colorIds[0], this.build();
        }
        getSelection() {
            return this.selection;
        }
        onChange(e) {
            this.listeners.push(e);
        }
        setCount(e, t) {
            let n = this.countEls.get(e);
            n && (n.val.textContent = `${t}/${this.cfg.perColor}`, n.wrap.classList.toggle(`rs-count--ok`, t === this.cfg.perColor));
        }
        build() {
            this.container.innerHTML = ``, this.countEls.clear();
            for (let e of this.cfg.colorIds){
                let t = this.cfg.labels[e] ?? e, n = document.createElement(`div`);
                n.className = `rs-swatch-group`;
                let r = document.createElement(`span`);
                r.className = `rs-swatch-label`, r.textContent = t;
                let i = document.createElement(`button`);
                i.type = `button`, i.className = `rs-swatch`, i.dataset.color = e, i.title = t, i.setAttribute(`aria-label`, t), i.style.background = this.cfg.palette[e], i.addEventListener(`click`, ()=>this.select(e));
                let a = document.createElement(`div`);
                a.className = `rs-count`, a.dataset.color = e, a.title = t;
                let o = document.createElement(`span`);
                o.className = `rs-count__dot`, o.style.background = this.cfg.palette[e];
                let s = document.createElement(`span`);
                s.className = `rs-count__val`, s.textContent = `0/${this.cfg.perColor}`, a.append(o, s), n.append(r, i, a), this.container.appendChild(n), this.countEls.set(e, {
                    wrap: a,
                    val: s
                });
            }
            this.refresh();
        }
        select(e) {
            this.selection = e, this.refresh();
            for (let t of this.listeners)t(e);
        }
        refresh() {
            this.container.querySelectorAll(`.rs-swatch`).forEach((e)=>{
                e.classList.toggle(`rs-swatch--active`, e.dataset.color === this.selection);
            });
        }
    }, x = `fun/rubik-solver/palettes`;
    function S(e) {
        return e.trim().toUpperCase();
    }
    function ne() {
        return {
            version: 1,
            pool: [],
            byPuzzle: {}
        };
    }
    async function C() {
        let e = await t().get(x);
        return !e || e.version !== 1 ? ne() : {
            version: 1,
            pool: Array.isArray(e.pool) ? e.pool.map(S) : [],
            byPuzzle: e.byPuzzle ?? {}
        };
    }
    async function re(e) {
        return (await C()).byPuzzle[e]?.map(S) ?? null;
    }
    async function ie(e = []) {
        let t = await C();
        return t.pool.length > 0 ? t.pool : se([], e);
    }
    async function ae(e) {
        let n = await C();
        return n.pool = se(n.pool, [
            e
        ]), await t().set(x, n), n.pool;
    }
    async function oe(e, n) {
        let r = await C();
        r.byPuzzle[e] = n.map(S), r.pool = se(r.pool, n), await t().set(x, r);
    }
    function se(e, t) {
        let n = new Set, r = [];
        for (let i of [
            ...t,
            ...e
        ]){
            let e = S(i);
            n.has(e) || (n.add(e), r.push(e));
        }
        return r.slice(0, 12);
    }
    var ce = class {
        cb;
        el = null;
        currentHex = `#FFFFFF`;
        input;
        constructor(e){
            this.cb = e;
        }
        isOpenFor(e) {
            return !!this.el && this.el.dataset.anchorId === e.dataset.color;
        }
        open(e, t, n) {
            this.close(), this.currentHex = t;
            let r = document.createElement(`div`);
            if (r.className = `rs-cp`, r.setAttribute(`role`, `dialog`), r.setAttribute(`aria-label`, `Chọn màu`), r.dataset.anchorId = e.dataset.color ?? ``, n.length > 0) {
                let e = document.createElement(`div`);
                e.className = `rs-cp__recent`;
                for (let r of n){
                    let n = document.createElement(`button`);
                    n.type = `button`, n.className = `rs-cp__chip`, n.style.background = r, n.title = r, n.setAttribute(`aria-label`, `Màu ${r}`), r.toUpperCase() === t.toUpperCase() && n.classList.add(`rs-cp__chip--active`), n.addEventListener(`click`, ()=>{
                        this.cb.onPreview(r), this.cb.onCommit(r), this.close();
                    }), e.appendChild(n);
                }
                r.appendChild(e);
            }
            let i = document.createElement(`label`);
            i.className = `rs-cp__custom`;
            let a = document.createElement(`span`);
            a.className = `rs-cp__custom-swatch`, a.style.background = t;
            let o = document.createElement(`span`);
            o.className = `rs-cp__custom-text`, o.textContent = `Màu khác…`, this.input = document.createElement(`input`), this.input.type = `color`, this.input.className = `rs-cp__input`, this.input.value = w(t), this.input.addEventListener(`input`, ()=>{
                this.currentHex = this.input.value, a.style.background = this.input.value, this.cb.onPreview(this.input.value);
            }), i.append(a, o, this.input), r.appendChild(i), document.body.appendChild(r), this.el = r, this.position(e), window.setTimeout(()=>{
                document.addEventListener(`pointerdown`, this.onDocPointer, !0);
            }, 0), window.addEventListener(`scroll`, this.onReposition, !0), window.addEventListener(`resize`, this.onReposition), document.addEventListener(`keydown`, this.onKeyDown);
        }
        close() {
            this.el && (this.el.remove(), this.el = null, document.removeEventListener(`pointerdown`, this.onDocPointer, !0), window.removeEventListener(`scroll`, this.onReposition, !0), window.removeEventListener(`resize`, this.onReposition), document.removeEventListener(`keydown`, this.onKeyDown));
        }
        position(e) {
            if (!this.el) return;
            let t = e.getBoundingClientRect(), n = this.el.offsetWidth, r = this.el.offsetHeight, i = t.left;
            i + n > window.innerWidth - 8 && (i = window.innerWidth - 8 - n), i = Math.max(8, i);
            let a = t.bottom + 6;
            a + r > window.innerHeight - 8 && (a = t.top - r - 6), a = Math.max(8, a), this.el.style.left = `${Math.round(i)}px`, this.el.style.top = `${Math.round(a)}px`;
        }
        onReposition = ()=>{
            this.commitAndClose();
        };
        onKeyDown = (e)=>{
            e.key === `Escape` && this.commitAndClose();
        };
        onDocPointer = (e)=>{
            this.el && !this.el.contains(e.target) && this.commitAndClose();
        };
        commitAndClose() {
            let e = this.currentHex;
            this.close(), this.cb.onCommit(e);
        }
    };
    function w(e) {
        let t = /^#?([0-9a-fA-F]{6})$/.exec(e.trim());
        return t ? `#${t[1].toLowerCase()}` : `#ffffff`;
    }
    var T = class {
        container;
        cfg;
        cb;
        assigned = {};
        recent;
        editing;
        swatchEls = new Map;
        popover;
        constructor(e, t, n){
            this.container = e, this.cfg = t, this.cb = n;
            for (let e of t.colorIds)this.assigned[e] = S(t.initial[e] ?? `#FFFFFF`);
            this.recent = E(t.colorIds.map((e)=>this.assigned[e]), t.pool.map(S)), this.editing = t.colorIds[0], this.popover = new ce({
                onPreview: (e)=>this.preview(e),
                onCommit: (e)=>this.commit(e)
            }), this.build(), this.emitChange();
        }
        getPalette() {
            let e = {};
            for (let t of this.cfg.colorIds)e[t] = this.assigned[t];
            return e;
        }
        destroy() {
            this.popover.close();
        }
        build() {
            this.container.innerHTML = ``, this.swatchEls.clear();
            let e = document.createElement(`div`);
            e.className = `rs-cs__slots`;
            for (let t of this.cfg.colorIds){
                let n = document.createElement(`div`);
                n.className = `rs-cs__slot`;
                let r = document.createElement(`span`);
                r.className = `rs-cs__slot-label`, r.textContent = this.cfg.labels[t] ?? t;
                let i = document.createElement(`button`);
                i.type = `button`, i.className = `rs-cs__slot-color`, i.dataset.color = t, i.style.background = this.assigned[t], i.title = `${this.cfg.labels[t] ?? t} — bấm để đổi màu`, i.setAttribute(`aria-label`, `Đổi màu ${this.cfg.labels[t] ?? t}`), i.addEventListener(`click`, ()=>this.openPicker(t, i)), n.append(r, i), e.appendChild(n), this.swatchEls.set(t, i);
            }
            this.container.appendChild(e);
        }
        openPicker(e, t) {
            if (this.popover.isOpenFor(t)) {
                this.popover.close();
                return;
            }
            this.editing = e, this.popover.open(t, this.assigned[e], this.recent);
        }
        preview(e) {
            let t = S(e);
            this.assigned[this.editing] = t;
            let n = this.swatchEls.get(this.editing);
            n && (n.style.background = t), this.emitChange();
        }
        commit(e) {
            let t = S(e);
            this.assigned[this.editing] = t;
            let n = this.swatchEls.get(this.editing);
            n && (n.style.background = t), this.recent = E([
                t
            ], this.recent), this.cb.onAddColor(t), this.emitChange();
        }
        emitChange() {
            let e = this.getPalette(), t = new Set(Object.values(e).map(S)).size === this.cfg.colorIds.length;
            this.cb.onChange(e, t);
        }
    };
    function E(e, t) {
        let n = new Set, r = [];
        for (let i of [
            ...e,
            ...t
        ]){
            let e = S(i);
            n.has(e) || (n.add(e), r.push(e));
        }
        return r.slice(0, 12);
    }
    var le = new Set([
        `U`,
        `R`,
        `F`,
        `D`,
        `L`,
        `B`
    ]);
    function D(e, t) {
        return {
            face: e,
            suffix: t,
            notation: `${e}${t}`
        };
    }
    function ue(e) {
        let t = e.trim();
        if (t.length < 1) return null;
        let n = t[0];
        if (!le.has(n)) return null;
        let r = t.slice(1), i;
        if (r === ``) i = ``;
        else if (r === `'` || r === `’`) i = `'`;
        else if (r === `2`) i = `2`;
        else return null;
        return D(n, i);
    }
    function de(e) {
        return e.split(/\s+/).map((e)=>e.trim()).filter(Boolean).map(ue).filter((e)=>e !== null);
    }
    function O(e) {
        if (e.suffix === `2`) return e;
        let t = e.suffix === `'` ? `` : `'`;
        return D(e.face, t);
    }
    function k(e) {
        return e.map((e)=>e.notation).join(` `);
    }
    var A = {
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
    function fe(e, t, n) {
        let { n: r, u: i, v: a } = A[e], o = t % n, s = Math.floor(t / n), c = n - 1, l = 2 * o - c, u = 2 * s - c;
        return [
            r[0] * c + i[0] * l + a[0] * u,
            r[1] * c + i[1] * l + a[1] * u,
            r[2] * c + i[2] * l + a[2] * u
        ];
    }
    var pe = 1 / 2, me = .94, he = .82, ge = 2501427, _e = 921878, ve = 6, ye = .6, be = 2.6;
    function xe(e, t, n) {
        return `${e},${t},${n}`;
    }
    function Se(e, t) {
        let n = /^(\d*)([URFDLB])(w?)([2']?)$/.exec(e.notation);
        if (!n) return null;
        let r = n[2], i = n[3] === `w`, a = n[1] ? parseInt(n[1], 10) : i ? 2 : 1, o = [];
        for(let e = 0; e < Math.min(a, t); e++)o.push(e);
        return {
            face: r,
            depths: o,
            quarter: n[4] === `2` ? 2 : n[4] === `'` ? -1 : 1
        };
    }
    async function j(t, r, i) {
        let a = await e(()=>import(`./three.DBcLZM-e.js`).then(async (m)=>{
                await m.__tla;
                return m;
            }).then((e)=>e.t), __vite__mapDeps([0,1])), o = i - 1, s = i % 2 == 1 ? (i * i - 1) / 2 : -1, c = new a.Scene, l = new a.PerspectiveCamera(42, 1, .1, 100);
        l.position.set(0, 0, 6.2), l.zoom = ye;
        let u = new a.WebGLRenderer({
            antialias: !0,
            alpha: !0
        });
        u.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2)), t.appendChild(u.domElement);
        let d = new a.Group;
        d.rotation.x = -.42, d.rotation.y = .62, d.scale.setScalar(3 / i), c.add(d);
        let f = new a.MeshBasicMaterial({
            color: _e
        }), p = new a.MeshBasicMaterial({
            color: ge
        }), m = {};
        for (let e of Object.keys(r.palette))m[e] = new a.MeshBasicMaterial({
            color: new a.Color(r.palette[e])
        });
        let h = new a.BoxGeometry(me, me, me), g = new a.PlaneGeometry(he, he), ee = new a.Vector3(0, 0, 1), _ = [], v = [], te = new Map, y = !1, b = !1;
        function x(e) {
            return e ? m[e] : p;
        }
        function S() {
            for (let e of _)d.remove(e.group);
            _ = [], v = [], te.clear();
        }
        function ne(e) {
            S();
            let t = new Map;
            for(let e = -o; e <= o; e += 2)for(let n = -o; n <= o; n += 2)for(let r = -o; r <= o; r += 2){
                if (!(Math.abs(e) === o || Math.abs(n) === o || Math.abs(r) === o)) continue;
                let i = new a.Group;
                i.position.set(e * pe, n * pe, r * pe), i.add(new a.Mesh(h, f));
                let s = {
                    group: i,
                    coord: new a.Vector3(e, n, r)
                };
                d.add(i), _.push(s), t.set(xe(e, n, r), s);
            }
            for(let r = 0; r < n.length; r++){
                let o = n[r], c = A[o], l = new a.Vector3(c.n[0], c.n[1], c.n[2]);
                for(let n = 0; n < i * i; n++){
                    let c = r * i * i + n, [u, d, f] = fe(o, n, i), p = t.get(xe(u, d, f));
                    if (!p) continue;
                    let m = new a.Mesh(g, x(e[c]));
                    m.position.copy(l).multiplyScalar(.471), m.quaternion.setFromUnitVectors(ee, l), m.userData.faceletIndex = c, m.userData.paintable = n !== s, p.group.add(m), v.push(m), te.set(c, m);
                }
            }
            w();
        }
        function C(e, t) {
            let n = te.get(e);
            n && (n.material = x(t), w());
        }
        function re(e) {
            b = e;
        }
        function ie(e) {
            for (let t of Object.keys(e))m[t]?.color.set(new a.Color(e[t]));
            w();
        }
        function ae(e) {
            let t = e > 0 ? 1.15 : 1 / 1.15;
            l.zoom = Math.min(be, Math.max(ye, l.zoom * t)), l.updateProjectionMatrix(), w();
        }
        function oe(e, t) {
            let n = A[e].n, r = o - t * 2;
            return _.filter((e)=>Math.round(e.coord.x) * n[0] + Math.round(e.coord.y) * n[1] + Math.round(e.coord.z) * n[2] === r);
        }
        function se(e, t) {
            if (y) return Promise.resolve();
            let n = Se(e, i);
            if (!n) return Promise.resolve();
            y = !0;
            let r = A[n.face], o = new a.Vector3(r.n[0], r.n[1], r.n[2]), s = n.quarter === 2 ? -Math.PI : n.quarter === -1 ? Math.PI / 2 : -Math.PI / 2, f = new Set;
            for (let e of n.depths)for (let t of oe(n.face, e))f.add(t);
            let p = new a.Group;
            d.add(p);
            for (let e of f)p.attach(e.group);
            let m = Math.max(60, t), h = performance.now();
            return new Promise((e)=>{
                let t = (n)=>{
                    let r = Math.min(1, (n - h) / m), i = r < .5 ? 2 * r * r : 1 - (-2 * r + 2) ** 2 / 2;
                    if (p.quaternion.setFromAxisAngle(o, s * i), u.render(c, l), r < 1) {
                        requestAnimationFrame(t);
                        return;
                    }
                    for (let e of f)d.attach(e.group), e.coord.applyAxisAngle(o, s).round();
                    d.remove(p), y = !1, u.render(c, l), e();
                };
                requestAnimationFrame(t);
            });
        }
        let ce = !1;
        function w() {
            ce || (ce = !0, requestAnimationFrame(()=>{
                ce = !1, u.render(c, l);
            }));
        }
        function T() {
            let e = t.clientWidth || 1, n = t.clientHeight || 1;
            u.setSize(e, n, !1), l.aspect = e / n, l.updateProjectionMatrix(), w();
        }
        let E = new ResizeObserver(T);
        E.observe(t), T();
        let le = new a.Raycaster, D = new a.Vector2, ue = new a.Vector3(0, 1, 0), de = new a.Vector3(1, 0, 0), O = !1, k = !1, j = 0, Ce = 0, M = 0, N = 0;
        function we(e) {
            let t = u.domElement.getBoundingClientRect();
            D.x = (e.clientX - t.left) / t.width * 2 - 1, D.y = -((e.clientY - t.top) / t.height) * 2 + 1, c.updateMatrixWorld(!0), le.setFromCamera(D, l);
            let n = le.intersectObjects(v, !1);
            return n.length ? n[0].object : null;
        }
        function Te(e) {
            O = !0, k = !1, j = M = e.clientX, Ce = N = e.clientY, u.domElement.setPointerCapture(e.pointerId);
        }
        function Ee(e) {
            if (O) {
                if (!k) {
                    if (Math.hypot(e.clientX - j, e.clientY - Ce) < ve) return;
                    k = !0;
                }
                d.rotateOnWorldAxis(ue, (e.clientX - M) * .008), d.rotateOnWorldAxis(de, (e.clientY - N) * .008), M = e.clientX, N = e.clientY, w();
            }
        }
        function De(e) {
            let t = O && !k;
            O = !1;
            try {
                u.domElement.releasePointerCapture(e.pointerId);
            } catch  {}
            if (t && b && !y && r.onPaint) {
                let t = we(e);
                t && t.userData.paintable && r.onPaint(t.userData.faceletIndex);
            }
        }
        function Oe(e) {
            e.preventDefault(), ae(e.deltaY < 0 ? 1 : -1);
        }
        u.domElement.addEventListener(`pointerdown`, Te), u.domElement.addEventListener(`pointermove`, Ee), u.domElement.addEventListener(`pointerup`, De), u.domElement.addEventListener(`pointercancel`, De), u.domElement.addEventListener(`wheel`, Oe, {
            passive: !1
        });
        function ke() {
            E.disconnect(), u.domElement.removeEventListener(`pointerdown`, Te), u.domElement.removeEventListener(`pointermove`, Ee), u.domElement.removeEventListener(`pointerup`, De), u.domElement.removeEventListener(`pointercancel`, De), u.domElement.removeEventListener(`wheel`, Oe), S(), h.dispose(), g.dispose(), f.dispose(), p.dispose();
            for (let e of Object.keys(m))m[e].dispose();
            u.dispose(), u.domElement.parentNode === t && t.removeChild(u.domElement);
        }
        return {
            loadState: ne,
            updateSticker: C,
            setPalette: ie,
            zoom: ae,
            setPaintEnabled: re,
            animateMove: se,
            isAnimating: ()=>y,
            dispose: ke
        };
    }
    function Ce(e) {
        let t = [];
        for(let r = 0; r < n.length; r++){
            let i = n[r], a = A[i].n;
            for(let n = 0; n < e * e; n++)t.push({
                coord: fe(i, n, e),
                normal: a
            });
        }
        return t;
    }
    var M = 4, N = Ce(2);
    function we(e) {
        return e[0] > 0 ? `R` : e[0] < 0 ? `L` : e[1] > 0 ? `U` : e[1] < 0 ? `D` : e[2] > 0 ? `F` : `B`;
    }
    function Te(e) {
        return `${e[0]},${e[1]},${e[2]}`;
    }
    function Ee(e) {
        return {
            "1,1,1": 0,
            "0,1,1": 1,
            "0,1,0": 2,
            "1,1,0": 3,
            "1,0,1": 4,
            "0,0,1": 5,
            "0,0,0": 6,
            "1,0,0": 7
        }[`${+(e[0] > 0)},${+(e[1] > 0)},${+(e[2] > 0)}`];
    }
    function De(e, t) {
        return [
            e[1] * t[2] - e[2] * t[1],
            e[2] * t[0] - e[0] * t[2],
            e[0] * t[1] - e[1] * t[0]
        ];
    }
    function Oe(e, t) {
        return e[0] * t[0] + e[1] * t[1] + e[2] * t[2];
    }
    var ke = [], Ae = [], je = {};
    (()=>{
        let e = new Map;
        for(let t = 0; t < N.length; t++){
            let n = Te(N[t].coord);
            (e.get(n) ?? e.set(n, []).get(n)).push(t);
        }
        for (let t of e.values()){
            let e = N[t[0]].coord, n = Ee(e), r = t.find((e)=>N[e].normal[1] !== 0), i = t.filter((e)=>e !== r), a = N[r].normal, o = Oe(De(a, N[i[0]].normal), e) > 0 ? [
                r,
                i[0],
                i[1]
            ] : [
                r,
                i[1],
                i[0]
            ];
            ke[n] = o, Ae[n] = o.map((e)=>we(N[e].normal));
            let s = [
                ...Ae[n]
            ].sort().join(``);
            je[s] = n;
        }
    })();
    function Me(e) {
        let t = Array(8), n = Array(8);
        for(let r = 0; r < 8; r++){
            let i = ke[r], a = [
                e[i[0]],
                e[i[1]],
                e[i[2]]
            ], o = a.findIndex((e)=>e === `U` || e === `D`);
            if (o < 0) return null;
            let s = je[[
                ...a
            ].sort().join(``)];
            if (s === void 0) return null;
            t[r] = s, n[r] = o;
        }
        return {
            cp: t,
            co: n
        };
    }
    function Ne(e) {
        let t = e.facelets;
        if (t.some((e)=>e === null)) return null;
        let n = {};
        for (let e of t)n[e] = (n[e] ?? 0) + 1;
        let r = Object.keys(n);
        if (r.length !== 6 || r.some((e)=>n[e] !== M)) return null;
        let i = new Map;
        for (let e of r)i.set(e, new Set);
        let a = new Map;
        for(let e = 0; e < N.length; e++){
            let n = Te(N[e].coord);
            (a.get(n) ?? a.set(n, []).get(n)).push(t[e]);
        }
        for (let e of a.values())for (let t of e)for (let n of e)t !== n && i.get(t).add(n);
        let o = {};
        for (let e of r){
            let t = r.filter((t)=>t !== e && !i.get(e).has(t));
            if (t.length !== 1) return null;
            o[e] = t[0];
        }
        let s = N.map((e, t)=>({
                g: e,
                i: t
            })).filter(({ g: e })=>Te(e.coord) === `-1,-1,-1`), c = ``, l = ``, u = ``;
        for (let { g: e, i: n } of s){
            let r = we(e.normal);
            r === `D` ? c = t[n] : r === `L` ? l = t[n] : r === `B` && (u = t[n]);
        }
        if (!c || !l || !u) return null;
        let d = {
            [c]: `D`,
            [o[c]]: `U`,
            [l]: `L`,
            [o[l]]: `R`,
            [u]: `B`,
            [o[u]]: `F`
        };
        return new Set(Object.values(d)).size !== 6 || Object.keys(d).length !== 6 ? null : d;
    }
    function Pe(e) {
        let t = Ne(e);
        if (!t) return null;
        let n = ``;
        for (let r of e.facelets)n += t[r];
        return n;
    }
    function Fe(e) {
        let t = [], n = e.facelets.filter((e)=>e !== null).length;
        if (n < 24) return t.push({
            code: `incomplete`,
            message: `Còn ${24 - n} ô chưa tô (cần đủ 24 ô).`
        }), {
            ok: !1,
            errors: t
        };
        let i = {};
        for (let t of e.facelets)i[t] = (i[t] ?? 0) + 1;
        let a = r.filter((e)=>i[e]), o = a.filter((e)=>i[e] !== M);
        if (a.length !== 6 || o.length > 0) return t.push({
            code: `color-count`,
            message: `Cần đúng 6 màu, mỗi màu ${M} ô.`
        }), {
            ok: !1,
            errors: t
        };
        let s = Pe(e), c = s ? Me(s) : null;
        return !s || !c ? (t.push({
            code: `impossible-pieces`,
            message: `Cách tô tạo ra góc trùng lặp hoặc không tồn tại trên khối Rubik thật.`
        }), {
            ok: !1,
            errors: t
        }) : (new Set(c.cp).size !== 8 && t.push({
            code: `impossible-pieces`,
            message: `Có góc bị trùng — mỗi góc phải xuất hiện đúng một lần.`
        }), c.co.reduce((e, t)=>e + t, 0) % 3 != 0 && t.push({
            code: `corner-twist`,
            message: `Có một góc bị xoay sai hướng (tổng định hướng góc không chia hết cho 3).`
        }), {
            ok: t.length === 0,
            errors: t
        });
    }
    function Ie(e) {
        let t = null, n = !1, r = 0, i = new Map, a = [];
        function o() {
            return t || (t = e(), t.onmessage = (e)=>{
                let t = e.data;
                switch(t.type){
                    case `ready`:
                        n = !0, a.forEach((e)=>e()), a = [];
                        break;
                    case `init-error`:
                        a = [];
                        break;
                    case `result`:
                        i.get(t.id)?.resolve(t.moves), i.delete(t.id);
                        break;
                    case `error`:
                        i.get(t.id)?.reject(Error(t.message)), i.delete(t.id);
                        break;
                }
            }, t.onerror = ()=>{
                i.forEach(({ reject: e })=>e(Error(`Bộ giải gặp lỗi không xác định.`))), i.clear();
            }, t.postMessage({
                type: `init`
            }), t);
        }
        return {
            warmUp () {
                o();
            },
            isReady () {
                return n;
            },
            solve (e) {
                let t = o(), n = ++r;
                return new Promise((r, a)=>{
                    i.set(n, {
                        resolve: r,
                        reject: a
                    }), t.postMessage({
                        type: `solve`,
                        id: n,
                        facelets: e
                    });
                });
            },
            dispose () {
                t?.terminate(), t = null, n = !1, a = [], i.clear();
            }
        };
    }
    var Le = {
        c1: `#FFFFFF`,
        c2: `#B71234`,
        c3: `#009B48`,
        c4: `#FFD500`,
        c5: `#FF5800`,
        c6: `#0046AD`
    }, Re = Ie(()=>new Worker(new URL(`/_astro/cube2.worker-_3XMG-ZV.js`, `` + import.meta.url), {
            type: `module`
        })), ze = {
        id: `fast`,
        label: `Giải nhanh (tối ưu)`,
        available: !0,
        async solve (e) {
            let t = Pe(e);
            if (!t) throw Error(`Trạng thái khối chưa hợp lệ.`);
            let n = de(await Re.solve(t));
            return {
                mode: `fast`,
                phases: [
                    {
                        name: `Giải`,
                        moves: n
                    }
                ],
                moves: n
            };
        }
    };
    function Be() {
        return {
            facelets: Array(24).fill(null)
        };
    }
    function Ve() {
        let e = [];
        for(let t = 0; t < n.length; t++)for(let r = 0; r < 4; r++)e.push(i[n[t]]);
        return {
            facelets: e
        };
    }
    var He = {
        id: `cube2`,
        label: `Rubik 2×2`,
        shortLabel: `2×2`,
        description: `Khối Pocket 6 mặt, mỗi mặt 4 ô.`,
        illustration: `/images/rubik/cube2.svg`,
        enabled: !0,
        colorCount: 6,
        faceletCount: 24,
        colorIds: [
            ...r
        ],
        defaultPalette: {
            ...Le
        },
        colorLabels: {
            ...s
        },
        createInitialState: Be,
        createSolvedState: Ve,
        createRenderer (e, t) {
            return j(e, t, 2);
        },
        validate: Fe,
        solverModes: ()=>[
                ze
            ],
        invertMove: (e)=>O(e),
        warmUp: ()=>Re.warmUp(),
        isSolverReady: ()=>Re.isReady()
    }, Ue = [
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
    ], We = [
        `URF`,
        `UFL`,
        `ULB`,
        `UBR`,
        `DFR`,
        `DLF`,
        `DBL`,
        `DRB`
    ], Ge = [
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
    ], Ke = [
        `UR`,
        `UF`,
        `UL`,
        `UB`,
        `DR`,
        `DF`,
        `DL`,
        `DB`,
        `FR`,
        `FL`,
        `BL`,
        `BR`
    ];
    function qe(e) {
        return `màu ${o[a[e]]}`;
    }
    function Je(e) {
        let t = Array(e.length).fill(!1), n = 0;
        for(let r = 0; r < e.length; r++){
            if (t[r]) continue;
            let i = r, a = 0;
            for(; !t[i];)t[i] = !0, i = e[i], a++;
            n += a - 1;
        }
        return n % 2;
    }
    function Ye(e) {
        let t = [], n = (t)=>e[t], r = (e)=>e === `U` || e === `D`, i = Array(8).fill(-1), a = Array(8).fill(0);
        for(let e = 0; e < 8; e++){
            let t = 0;
            for(; t < 3 && !r(n(Ue[e][t])); t++);
            let o = n(Ue[e][(t + 1) % 3]), s = n(Ue[e][(t + 2) % 3]);
            for(let n = 0; n < 8; n++)if (o === We[n][1] && s === We[n][2]) {
                i[e] = n, a[e] = t % 3;
                break;
            }
        }
        let o = Array(12).fill(-1), s = Array(12).fill(0);
        for(let e = 0; e < 12; e++){
            let t = n(Ge[e][0]), r = n(Ge[e][1]);
            for(let n = 0; n < 12; n++){
                if (t === Ke[n][0] && r === Ke[n][1]) {
                    o[e] = n, s[e] = 0;
                    break;
                }
                if (t === Ke[n][1] && r === Ke[n][0]) {
                    o[e] = n, s[e] = 1;
                    break;
                }
            }
        }
        let c = i.every((e)=>e >= 0) && new Set(i).size === 8, l = o.every((e)=>e >= 0) && new Set(o).size === 12;
        return !c || !l ? (t.push({
            code: `impossible-pieces`,
            message: `Cách tô tạo ra mảnh (góc/cạnh) trùng lặp hoặc không tồn tại trên khối Rubik thật.`
        }), t) : (a.reduce((e, t)=>e + t, 0) % 3 != 0 && t.push({
            code: `corner-twist`,
            message: `Có một góc bị xoay sai hướng (tổng định hướng góc không chia hết cho 3).`
        }), s.reduce((e, t)=>e + t, 0) % 2 != 0 && t.push({
            code: `edge-flip`,
            message: `Có một cạnh bị lật ngược (số cạnh lật phải là số chẵn).`
        }), Je(i) !== Je(o) && t.push({
            code: `permutation-parity`,
            message: `Sai parity hoán vị — cần hoán đổi đúng một cặp mảnh để khối có thể giải được.`
        }), t);
    }
    function Xe(e) {
        let t = [], i = _(e);
        i < 54 && t.push({
            code: `incomplete`,
            message: `Còn ${54 - i} ô chưa tô (cần đủ 54 ô).`
        });
        let a = ee(e), o = r.filter((e)=>a[e] !== 9);
        if (i === 54 && o.length > 0) {
            let e = o.map((e)=>`${qe(e)} ${a[e]}/9`).join(`, `);
            t.push({
                code: `color-count`,
                message: `Mỗi màu phải đúng 9 ô. Sai: ${e}.`
            });
        }
        let s = n.map((t)=>e.facelets[f(t)]).filter((e)=>e !== null);
        if (s.length === 6 && new Set(s).size !== 6 && t.push({
            code: `center-dup`,
            message: `6 ô trung tâm phải là 6 màu khác nhau.`
        }), t.length === 0 && v(e)) {
            let n = y(e);
            n && t.push(...Ye(n));
        }
        return {
            ok: t.length === 0,
            errors: t
        };
    }
    var P = null, Ze = !1, Qe = 0, F = new Map, $e = [];
    function et() {
        return P || (P = new Worker(new URL(`/_astro/solver.worker-D5ae4LsS.js`, `` + import.meta.url), {
            type: `module`
        }), P.onmessage = (e)=>{
            let t = e.data;
            switch(t.type){
                case `ready`:
                    Ze = !0, $e.forEach((e)=>e()), $e = [];
                    break;
                case `init-error`:
                    $e = [];
                    break;
                case `result`:
                    F.get(t.id)?.resolve(t.moves), F.delete(t.id);
                    break;
                case `error`:
                    F.get(t.id)?.reject(Error(t.message)), F.delete(t.id);
                    break;
            }
        }, P.onerror = ()=>{
            F.forEach(({ reject: e })=>e(Error(`Bộ giải gặp lỗi không xác định.`))), F.clear();
        }, P.postMessage({
            type: `init`
        }), P);
    }
    function tt() {
        et();
    }
    function nt() {
        return Ze;
    }
    function rt(e) {
        let t = et(), n = ++Qe;
        return new Promise((r, i)=>{
            F.set(n, {
                resolve: r,
                reject: i
            }), t.postMessage({
                type: `solve`,
                id: n,
                facelets: e
            });
        });
    }
    var it = {
        fast: {
            id: `fast`,
            label: `Giải nhanh`,
            available: !0,
            async solve (e) {
                let t = y(e);
                if (!t) throw Error(`Trạng thái khối chưa hợp lệ.`);
                let n = de(await rt(t));
                return {
                    mode: `fast`,
                    phases: [
                        {
                            name: `Giải`,
                            moves: n
                        }
                    ],
                    moves: n
                };
            }
        },
        layer: {
            id: `layer`,
            label: `Giải từng tầng`,
            available: !1,
            async solve () {
                throw Error(`Chế độ giải từng tầng sẽ được bổ sung sau.`);
            }
        }
    };
    function at() {
        return Object.values(it);
    }
    var ot = {
        id: `cube3`,
        label: `Rubik 3×3`,
        shortLabel: `3×3`,
        description: `Khối tiêu chuẩn 6 mặt, mỗi mặt 9 ô.`,
        illustration: `/images/rubik/cube3.svg`,
        enabled: !0,
        colorCount: 6,
        faceletCount: 54,
        colorIds: [
            ...r
        ],
        defaultPalette: {
            ...c
        },
        colorLabels: {
            ...s
        },
        createInitialState () {
            return m();
        },
        createSolvedState () {
            return h();
        },
        createRenderer (e, t) {
            return j(e, t, 3);
        },
        validate: Xe,
        solverModes: ()=>at(),
        invertMove: (e)=>O(e),
        warmUp: tt,
        isSolverReady: nt
    }, st = 16, ct = 16, lt = [
        0,
        3,
        12,
        15
    ], I = Ce(4);
    function ut(e) {
        return e[0] > 0 ? `R` : e[0] < 0 ? `L` : e[1] > 0 ? `U` : e[1] < 0 ? `D` : e[2] > 0 ? `F` : `B`;
    }
    var dt = (e)=>`${e[0]},${e[1]},${e[2]}`;
    function ft(e) {
        return {
            "1,1,1": 0,
            "0,1,1": 1,
            "0,1,0": 2,
            "1,1,0": 3,
            "1,0,1": 4,
            "0,0,1": 5,
            "0,0,0": 6,
            "1,0,0": 7
        }[`${+(e[0] > 0)},${+(e[1] > 0)},${+(e[2] > 0)}`];
    }
    var pt = (e, t)=>[
            e[1] * t[2] - e[2] * t[1],
            e[2] * t[0] - e[0] * t[2],
            e[0] * t[1] - e[1] * t[0]
        ], mt = (e, t)=>e[0] * t[0] + e[1] * t[1] + e[2] * t[2], ht = (e)=>lt.includes(e % ct), gt = [], _t = {};
    (()=>{
        let e = new Map;
        for(let t = 0; t < I.length; t++){
            if (!ht(t)) continue;
            let n = dt(I[t].coord);
            (e.get(n) ?? e.set(n, []).get(n)).push(t);
        }
        for (let t of e.values()){
            let e = I[t[0]].coord, n = ft(e), r = t.find((e)=>I[e].normal[1] !== 0), i = t.filter((e)=>e !== r), a = I[r].normal, o = mt(pt(a, I[i[0]].normal), e) > 0 ? [
                r,
                i[0],
                i[1]
            ] : [
                r,
                i[1],
                i[0]
            ];
            gt[n] = o;
            let s = o.map((e)=>ut(I[e].normal));
            _t[[
                ...s
            ].sort().join(``)] = n;
        }
    })();
    function vt(e) {
        let t = e.facelets;
        if (t.some((e)=>e === null)) return null;
        let n = {};
        for (let e of t)n[e] = (n[e] ?? 0) + 1;
        let r = Object.keys(n);
        if (r.length !== 6 || r.some((e)=>n[e] !== st)) return null;
        let i = new Map;
        for (let e of r)i.set(e, new Set);
        let a = new Map;
        for(let e = 0; e < I.length; e++){
            if (!ht(e)) continue;
            let n = dt(I[e].coord);
            (a.get(n) ?? a.set(n, []).get(n)).push(t[e]);
        }
        for (let e of a.values())for (let t of e)for (let n of e)t !== n && i.get(t).add(n);
        let o = {};
        for (let e of r){
            let t = r.filter((t)=>t !== e && !i.get(e).has(t));
            if (t.length !== 1) return null;
            o[e] = t[0];
        }
        let s = ``, c = ``, l = ``;
        for(let e = 0; e < I.length; e++){
            if (!ht(e) || dt(I[e].coord) !== `-3,-3,-3`) continue;
            let n = ut(I[e].normal);
            n === `D` ? s = t[e] : n === `L` ? c = t[e] : n === `B` && (l = t[e]);
        }
        if (!s || !c || !l) return null;
        let u = {
            [s]: `D`,
            [o[s]]: `U`,
            [c]: `L`,
            [o[c]]: `R`,
            [l]: `B`,
            [o[l]]: `F`
        };
        return new Set(Object.values(u)).size !== 6 || Object.keys(u).length !== 6 ? null : u;
    }
    function yt(e) {
        let t = vt(e);
        if (!t) return null;
        let n = ``;
        for (let r of e.facelets)n += t[r];
        return n;
    }
    function bt(e) {
        let t = [], n = 0;
        for(let r = 0; r < 8; r++){
            let i = gt[r], a = [
                e[i[0]],
                e[i[1]],
                e[i[2]]
            ], o = a.findIndex((e)=>e === `U` || e === `D`);
            if (o < 0) {
                t.push(-1);
                continue;
            }
            let s = _t[[
                ...a
            ].sort().join(``)];
            t.push(s ?? -1), n += o;
        }
        return {
            sum: n % 3,
            distinct: new Set(t).size === 8 && !t.includes(-1)
        };
    }
    function xt(e) {
        let t = [], n = e.facelets.filter((e)=>e !== null).length;
        if (n < 96) return t.push({
            code: `incomplete`,
            message: `Còn ${96 - n} ô chưa tô (cần đủ 96 ô).`
        }), {
            ok: !1,
            errors: t
        };
        let i = {};
        for (let t of e.facelets)i[t] = (i[t] ?? 0) + 1;
        let a = r.filter((e)=>i[e]);
        if (a.length !== 6 || a.some((e)=>i[e] !== st)) return t.push({
            code: `color-count`,
            message: `Cần đúng 6 màu, mỗi màu ${st} ô.`
        }), {
            ok: !1,
            errors: t
        };
        let o = yt(e);
        if (!o) return t.push({
            code: `center-dup`,
            message: `Không suy được khung màu — kiểm tra lại màu các góc/khối.`
        }), {
            ok: !1,
            errors: t
        };
        let { sum: s, distinct: c } = bt(o);
        return c || t.push({
            code: `impossible-pieces`,
            message: `Có góc trùng hoặc không tồn tại trên khối thật.`
        }), s !== 0 && t.push({
            code: `corner-twist`,
            message: `Có một góc bị xoay sai hướng (tổng định hướng góc không chia hết cho 3).`
        }), {
            ok: t.length === 0,
            errors: t
        };
    }
    var St = {
        c1: `#FFFFFF`,
        c2: `#B71234`,
        c3: `#009B48`,
        c4: `#FFD500`,
        c5: `#FF5800`,
        c6: `#0046AD`
    }, Ct = Ie(()=>new Worker(new URL(`/_astro/cube4.worker-BQH3HcPG.js`, `` + import.meta.url), {
            type: `module`
        }));
    function wt(e) {
        return {
            face: e[0],
            suffix: e.endsWith(`2`) ? `2` : e.endsWith(`'`) ? `'` : ``,
            notation: e
        };
    }
    var Tt = {
        id: `fast`,
        label: `Giải (reduction)`,
        available: !0,
        async solve (e) {
            let t = yt(e);
            if (!t) throw Error(`Trạng thái khối chưa hợp lệ.`);
            let n = (await Ct.solve(t)).split(/\s+/).filter(Boolean).map(wt);
            return {
                mode: `fast`,
                phases: [
                    {
                        name: `Giải`,
                        moves: n
                    }
                ],
                moves: n
            };
        }
    };
    function Et() {
        return {
            facelets: Array(96).fill(null)
        };
    }
    function Dt() {
        let e = [];
        for(let t = 0; t < n.length; t++)for(let r = 0; r < 16; r++)e.push(i[n[t]]);
        return {
            facelets: e
        };
    }
    var Ot = {
        id: `cube4`,
        label: `Rubik 4×4`,
        shortLabel: `4×4`,
        description: `Khối Revenge 6 mặt, mỗi mặt 16 ô.`,
        illustration: `/images/rubik/cube4.svg`,
        enabled: !0,
        colorCount: 6,
        faceletCount: 96,
        colorIds: [
            ...r
        ],
        defaultPalette: {
            ...St
        },
        colorLabels: {
            ...s
        },
        createInitialState: Et,
        createSolvedState: Dt,
        createRenderer (e, t) {
            return j(e, t, 4);
        },
        validate: xt,
        solverModes: ()=>[
                Tt
            ],
        invertMove: (e)=>wt(e.notation.replace(/['2]$/, ``) + (e.notation.endsWith(`2`) ? `2` : e.notation.endsWith(`'`) ? `` : `'`)),
        warmUp: ()=>Ct.warmUp(),
        isSolverReady: ()=>Ct.isReady()
    }, kt = 9, L = [
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
    ], At = [
        `U`,
        `L`,
        `R`,
        `B`
    ], jt = (e, t)=>[
            e[0] + t[0],
            e[1] + t[1],
            e[2] + t[2]
        ], Mt = (e, t)=>[
            e[0] - t[0],
            e[1] - t[1],
            e[2] - t[2]
        ], Nt = (e, t)=>[
            e[0] * t,
            e[1] * t,
            e[2] * t
        ], Pt = (e, t)=>e[0] * t[0] + e[1] * t[1] + e[2] * t[2], Ft = (e, t)=>[
            e[1] * t[2] - e[2] * t[1],
            e[2] * t[0] - e[0] * t[2],
            e[0] * t[1] - e[1] * t[0]
        ], It = (e)=>{
        let t = Math.hypot(e[0], e[1], e[2]) || 1;
        return [
            e[0] / t,
            e[1] / t,
            e[2] / t
        ];
    }, Lt = (e, t, n)=>Nt(jt(jt(e, t), n), 1 / 3);
    function Rt(e, t, n) {
        let r = n * Math.PI / 180, i = Math.cos(r), a = Math.sin(r), o = t, s = Ft(o, e), c = Pt(o, e) * (1 - i);
        return [
            e[0] * i + s[0] * a + o[0] * c,
            e[1] * i + s[1] * a + o[1] * c,
            e[2] * i + s[2] * a + o[2] * c
        ];
    }
    var zt = [];
    (()=>{
        for(let e = 0; e < 4; e++){
            let t = [
                0,
                1,
                2,
                3
            ].filter((t)=>t !== e), [n, r, i] = t.map((e)=>L[e]), a = Lt(n, r, i), o = Ft(Mt(r, n), Mt(i, n));
            zt.push(Pt(o, a) >= 0 ? t : [
                t[0],
                t[2],
                t[1]
            ]);
        }
    })();
    var Bt = (e)=>`${e[0].toFixed(3)},${e[1].toFixed(3)},${e[2].toFixed(3)}`, R = [];
    (()=>{
        for(let e = 0; e < 4; e++){
            let [t, n, r] = zt[e], i = L[t], a = L[n], o = L[r], s = (e, t)=>jt(jt(Nt(i, (3 - e - t) / 3), Nt(a, e / 3)), Nt(o, t / 3)), c = (e, t)=>[
                    s(e, t),
                    s(e + 1, t),
                    s(e, t + 1)
                ], l = (e, t)=>[
                    s(e + 1, t),
                    s(e, t + 1),
                    s(e + 1, t + 1)
                ], u = [
                {
                    tri: c(0, 0),
                    type: `tip`,
                    owners: [
                        t
                    ]
                },
                {
                    tri: l(0, 0),
                    type: `axial`,
                    owners: [
                        t
                    ]
                },
                {
                    tri: c(1, 0),
                    type: `edge`,
                    owners: [
                        t,
                        n
                    ]
                },
                {
                    tri: c(2, 0),
                    type: `tip`,
                    owners: [
                        n
                    ]
                },
                {
                    tri: l(1, 0),
                    type: `axial`,
                    owners: [
                        n
                    ]
                },
                {
                    tri: c(1, 1),
                    type: `edge`,
                    owners: [
                        n,
                        r
                    ]
                },
                {
                    tri: c(0, 2),
                    type: `tip`,
                    owners: [
                        r
                    ]
                },
                {
                    tri: l(0, 1),
                    type: `axial`,
                    owners: [
                        r
                    ]
                },
                {
                    tri: c(0, 1),
                    type: `edge`,
                    owners: [
                        r,
                        t
                    ]
                }
            ];
            for (let t of u)R.push({
                face: e,
                type: t.type,
                owners: t.owners,
                corners: t.tri,
                centroid: Lt(t.tri[0], t.tri[1], t.tri[2])
            });
        }
    })();
    var Vt = new Map;
    R.forEach((e, t)=>Vt.set(Bt(e.centroid), t));
    function Ht(e, t, n) {
        return n === `tip` ? e.type === `tip` && e.owners[0] === t : e.type === `edge` ? e.owners.includes(t) : e.owners[0] === t;
    }
    function Ut(e) {
        let t = It(L[e.vertex]), n = R.map((e, t)=>t);
        for(let r = 0; r < R.length; r++){
            let i = R[r];
            if (!Ht(i, e.vertex, e.layer)) continue;
            let a = Rt(i.centroid, t, e.deg), o = Vt.get(Bt(a));
            o !== void 0 && (n[o] = r);
        }
        return n;
    }
    function Wt() {
        let e = [];
        for(let t = 0; t < 4; t++)e.push({
            notation: At[t],
            vertex: t,
            layer: `axial`,
            deg: -120
        }), e.push({
            notation: `${At[t]}'`,
            vertex: t,
            layer: `axial`,
            deg: 120
        });
        return e;
    }
    function Gt() {
        let e = [];
        for(let t = 0; t < 4; t++){
            let n = At[t].toLowerCase();
            e.push({
                notation: n,
                vertex: t,
                layer: `tip`,
                deg: -120
            }), e.push({
                notation: `${n}'`,
                vertex: t,
                layer: `tip`,
                deg: 120
            });
        }
        return e;
    }
    function Kt(e) {
        return It(L[e]);
    }
    function qt(e) {
        let t = /^([ulrbULRB])('?)$/.exec(e.trim());
        if (!t) return null;
        let n = `ULRB`.indexOf(t[1].toUpperCase());
        return n < 0 ? null : {
            notation: e,
            vertex: n,
            layer: t[1] === t[1].toLowerCase() ? `tip` : `axial`,
            deg: t[2] === `'` ? 120 : -120
        };
    }
    function Jt(e) {
        return e;
    }
    function Yt(e) {
        let t = e.facelets;
        if (t.some((e)=>e === null)) return null;
        let n = {};
        for (let e of t)n[e] = (n[e] ?? 0) + 1;
        let r = Object.keys(n);
        if (r.length !== 4 || r.some((e)=>n[e] !== kt)) return null;
        let i = {};
        for(let e = 0; e < 4; e++){
            let n = new Set;
            if (R.forEach((r, i)=>{
                r.type === `axial` && r.owners[0] === e && n.add(t[i]);
            }), n.size !== 3) return null;
            let a = r.filter((e)=>!n.has(e));
            if (a.length !== 1) return null;
            i[a[0]] = Jt(e);
        }
        return new Set(Object.values(i)).size === 4 ? i : null;
    }
    function Xt(e) {
        let t = Yt(e);
        if (!t) return null;
        let n = ``;
        for (let r of e.facelets)n += String(t[r]);
        return n;
    }
    var Zt = [
        [],
        [],
        [],
        []
    ], Qt = [
        [],
        [],
        [],
        []
    ], $t = [];
    (()=>{
        let e = (e, t)=>{
            let n = new Map;
            for(let e = 0; e < t.length; e++)n.set(t[e], e);
            let r = e[0], i = [
                r
            ], a = n.get(r);
            for(; a !== r && i.length < e.length;)i.push(a), a = n.get(a);
            return i;
        };
        for(let t = 0; t < 4; t++){
            let n = Ut({
                notation: ``,
                vertex: t,
                layer: `tip`,
                deg: -120
            }), r = Ut({
                notation: ``,
                vertex: t,
                layer: `axial`,
                deg: -120
            }), i = R.map((e, t)=>({
                    fl: e,
                    i: t
                })).filter(({ fl: e })=>e.type === `tip` && e.owners[0] === t).map(({ i: e })=>e), a = R.map((e, t)=>({
                    fl: e,
                    i: t
                })).filter(({ fl: e })=>e.type === `axial` && e.owners[0] === t).map(({ i: e })=>e);
            Zt[t] = e(i, n), Qt[t] = e(a, r);
        }
        let t = new Map;
        R.forEach((e, n)=>{
            if (e.type !== `edge`) return;
            let r = [
                ...e.owners
            ].sort((e, t)=>e - t).join(`-`);
            (t.get(r) ?? t.set(r, []).get(r)).push(n);
        });
        for (let e of t.values()){
            let [t, n] = e;
            R[t].face <= R[n].face ? $t.push({
                a: t,
                b: n,
                faceA: R[t].face,
                faceB: R[n].face
            }) : $t.push({
                a: n,
                b: t,
                faceA: R[n].face,
                faceB: R[t].face
            });
        }
    })();
    var en = $t.length, tn = $t.map((e)=>[
            e.faceA,
            e.faceB
        ]);
    function nn(e) {
        let t = [
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
            let i = rn(Qt[r], e);
            if (i < 0) return null;
            n[r] = i;
            let a = rn(Zt[r], e);
            if (a < 0) return null;
            t[r] = a;
        }
        let r = Array(en).fill(-1), i = Array(en).fill(0);
        for(let t = 0; t < en; t++){
            let n = $t[t], a = Number(e[n.a]), o = Number(e[n.b]), s = -1, c = 0;
            for(let e = 0; e < en; e++){
                let [t, n] = tn[e];
                if (a === t && o === n) {
                    s = e, c = 0;
                    break;
                }
                if (a === n && o === t) {
                    s = e, c = 1;
                    break;
                }
            }
            if (s < 0) return null;
            r[t] = s, i[t] = c;
        }
        return {
            tips: t,
            axials: n,
            ep: r,
            eo: i
        };
    }
    function rn(e, t) {
        let n = e.map((e)=>R[e].face), r = e.map((e)=>Number(t[e])), i = e.length;
        for(let e = 0; e < i; e++){
            let t = !0;
            for(let a = 0; a < i; a++)if (r[a] !== n[(a - e + i) % i]) {
                t = !1;
                break;
            }
            if (t) return e;
        }
        return -1;
    }
    function an(e) {
        let t = Array(e.length).fill(!1), n = 0;
        for(let r = 0; r < e.length; r++){
            if (t[r]) continue;
            let i = r, a = 0;
            for(; !t[i];)t[i] = !0, i = e[i], a++;
            n += a - 1;
        }
        return n % 2;
    }
    function on(e) {
        let t = [], n = e.facelets.filter((e)=>e !== null).length;
        if (n < 36) return t.push({
            code: `incomplete`,
            message: `Còn ${36 - n} ô chưa tô (cần đủ 36 ô).`
        }), {
            ok: !1,
            errors: t
        };
        if (!Yt(e)) return t.push({
            code: `color-count`,
            message: `Cần đúng 4 màu, mỗi màu ${kt} ô và sắp xếp hợp lệ.`
        }), {
            ok: !1,
            errors: t
        };
        let r = nn(Xt(e));
        return r ? (new Set(r.ep).size !== en && t.push({
            code: `impossible-pieces`,
            message: `Có cạnh bị trùng — mỗi cạnh phải xuất hiện đúng một lần.`
        }), an(r.ep) !== 0 && t.push({
            code: `edge-parity`,
            message: `Sai thứ tự cạnh (cần hoán vị chẵn) — không thể giải được.`
        }), r.eo.reduce((e, t)=>e + t, 0) % 2 != 0 && t.push({
            code: `edge-flip`,
            message: `Có một cạnh bị lật ngược (số cạnh lật phải là số chẵn).`
        }), {
            ok: t.length === 0,
            errors: t
        }) : (t.push({
            code: `impossible-pieces`,
            message: `Cách tô tạo ra mảnh cạnh trùng lặp hoặc không tồn tại.`
        }), {
            ok: !1,
            errors: t
        });
    }
    var sn = .86, cn = .012, ln = 921878, un = 2501427, dn = 6, fn = .55, pn = 2.6, mn = 1.7;
    function hn(e) {
        let t = R.find((t)=>t.face === e).centroid, n = Math.hypot(t[0], t[1], t[2]) || 1;
        return [
            t[0] / n,
            t[1] / n,
            t[2] / n
        ];
    }
    async function gn(t, n) {
        let r = await e(()=>import(`./three.DBcLZM-e.js`).then(async (m)=>{
                await m.__tla;
                return m;
            }).then((e)=>e.t), __vite__mapDeps([0,1])), i = new r.Scene, a = new r.PerspectiveCamera(42, 1, .1, 100);
        a.position.set(0, 0, 6.2), a.zoom = fn;
        let o = new r.WebGLRenderer({
            antialias: !0,
            alpha: !0
        });
        o.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2)), t.appendChild(o.domElement);
        let s = new r.Group;
        s.rotation.x = -.32, s.rotation.y = .5, s.scale.setScalar(mn), i.add(s);
        let c = new r.MeshBasicMaterial({
            color: un,
            side: r.DoubleSide
        }), l = {};
        for (let e of Object.keys(n.palette))l[e] = new r.MeshBasicMaterial({
            color: new r.Color(n.palette[e]),
            side: r.DoubleSide
        });
        let u = (e)=>e ? l[e] : c, d = new r.MeshBasicMaterial({
            color: ln
        });
        for(let e = 0; e < 4; e++){
            let t = R.filter((t)=>t.face === e), n = new Set, i = [];
            for (let e of t)for (let t of e.corners){
                let e = t.map((e)=>e.toFixed(3)).join(`,`);
                n.has(e) || (n.add(e), i.push(t));
            }
            let a = i.sort((e, t)=>Math.hypot(t[0], t[1], t[2]) - Math.hypot(e[0], e[1], e[2])).slice(0, 3), o = new r.BufferGeometry;
            o.setAttribute(`position`, new r.Float32BufferAttribute(a.flat(), 3)), o.setIndex([
                0,
                1,
                2
            ]);
            let c = new r.Mesh(o, d);
            s.add(c);
        }
        let f = [];
        function p(e) {
            let t = hn(e.face), n = e.centroid, i = [];
            for (let r of e.corners){
                let e = [
                    n[0] + (r[0] - n[0]) * sn + t[0] * cn,
                    n[1] + (r[1] - n[1]) * sn + t[1] * cn,
                    n[2] + (r[2] - n[2]) * sn + t[2] * cn
                ];
                i.push(e[0], e[1], e[2]);
            }
            let a = new r.BufferGeometry;
            return a.setAttribute(`position`, new r.Float32BufferAttribute(i, 3)), a.setIndex([
                0,
                1,
                2
            ]), a;
        }
        function m() {
            for (let e of f)s.remove(e.mesh), e.mesh.geometry.dispose();
            f = [];
        }
        function h(e) {
            m();
            for(let t = 0; t < 36; t++){
                let n = new r.Mesh(p(R[t]), u(e[t]));
                n.userData.pos = t, s.add(n), f.push({
                    mesh: n,
                    pos: t
                });
            }
            C();
        }
        function g(e, t) {
            let n = f.find((t)=>t.pos === e);
            n && (n.mesh.material = u(t), C());
        }
        function ee(e) {
            for (let t of Object.keys(e))l[t]?.color.set(new r.Color(e[t]));
            C();
        }
        function _(e) {
            let t = e > 0 ? 1.15 : 1 / 1.15;
            a.zoom = Math.min(pn, Math.max(fn, a.zoom * t)), a.updateProjectionMatrix(), C();
        }
        let v = !1;
        function te(e) {
            v = e;
        }
        let y = new Map, b = new Map;
        for (let e of [
            ...Wt(),
            ...Gt()
        ]){
            let t = Ut(e);
            y.set(e.notation, t);
            let n = Array(t.length);
            for(let e = 0; e < t.length; e++)n[t[e]] = e;
            b.set(e.notation, n);
        }
        let x = !1;
        function S(e, t) {
            if (x) return Promise.resolve();
            let n = qt(e.notation), c = b.get(e.notation);
            if (!n || !c) return Promise.resolve();
            x = !0;
            let l = Kt(n.vertex), u = new r.Vector3(l[0], l[1], l[2]), d = n.deg * Math.PI / 180, p = f.filter((e)=>c[e.pos] !== e.pos), m = new r.Group;
            s.add(m);
            for (let e of p)m.attach(e.mesh);
            let h = Math.max(60, t), g = performance.now();
            return new Promise((e)=>{
                let t = (n)=>{
                    let r = Math.min(1, (n - g) / h), l = r < .5 ? 2 * r * r : 1 - (-2 * r + 2) ** 2 / 2;
                    if (m.quaternion.setFromAxisAngle(u, d * l), o.render(i, a), r < 1) {
                        requestAnimationFrame(t);
                        return;
                    }
                    for (let e of p)s.attach(e.mesh), e.pos = c[e.pos], e.mesh.userData.pos = e.pos;
                    s.remove(m), x = !1, o.render(i, a), e();
                };
                requestAnimationFrame(t);
            });
        }
        let ne = !1;
        function C() {
            ne || (ne = !0, requestAnimationFrame(()=>{
                ne = !1, o.render(i, a);
            }));
        }
        function re() {
            let e = t.clientWidth || 1, n = t.clientHeight || 1;
            o.setSize(e, n, !1), a.aspect = e / n, a.updateProjectionMatrix(), C();
        }
        let ie = new ResizeObserver(re);
        ie.observe(t), re();
        let ae = new r.Raycaster, oe = new r.Vector2, se = new r.Vector3(0, 1, 0), ce = new r.Vector3(1, 0, 0), w = !1, T = !1, E = 0, le = 0, D = 0, ue = 0;
        function de(e) {
            let t = o.domElement.getBoundingClientRect();
            oe.x = (e.clientX - t.left) / t.width * 2 - 1, oe.y = -((e.clientY - t.top) / t.height) * 2 + 1, i.updateMatrixWorld(!0), ae.setFromCamera(oe, a);
            let n = ae.intersectObjects(f.map((e)=>e.mesh), !1);
            return n.length ? n[0].object : null;
        }
        function O(e) {
            w = !0, T = !1, E = D = e.clientX, le = ue = e.clientY, o.domElement.setPointerCapture(e.pointerId);
        }
        function k(e) {
            if (w) {
                if (!T) {
                    if (Math.hypot(e.clientX - E, e.clientY - le) < dn) return;
                    T = !0;
                }
                s.rotateOnWorldAxis(se, (e.clientX - D) * .008), s.rotateOnWorldAxis(ce, (e.clientY - ue) * .008), D = e.clientX, ue = e.clientY, C();
            }
        }
        function A(e) {
            let t = w && !T;
            w = !1;
            try {
                o.domElement.releasePointerCapture(e.pointerId);
            } catch  {}
            if (t && v && !x && n.onPaint) {
                let t = de(e);
                t && n.onPaint(t.userData.pos);
            }
        }
        function fe(e) {
            e.preventDefault(), _(e.deltaY < 0 ? 1 : -1);
        }
        o.domElement.addEventListener(`pointerdown`, O), o.domElement.addEventListener(`pointermove`, k), o.domElement.addEventListener(`pointerup`, A), o.domElement.addEventListener(`pointercancel`, A), o.domElement.addEventListener(`wheel`, fe, {
            passive: !1
        });
        function pe() {
            ie.disconnect(), o.domElement.removeEventListener(`pointerdown`, O), o.domElement.removeEventListener(`pointermove`, k), o.domElement.removeEventListener(`pointerup`, A), o.domElement.removeEventListener(`pointercancel`, A), o.domElement.removeEventListener(`wheel`, fe), m(), c.dispose(), d.dispose();
            for (let e of Object.keys(l))l[e].dispose();
            o.dispose(), o.domElement.parentNode === t && t.removeChild(o.domElement);
        }
        return {
            loadState: h,
            updateSticker: g,
            setPalette: ee,
            zoom: _,
            setPaintEnabled: te,
            animateMove: S,
            isAnimating: ()=>x,
            dispose: pe
        };
    }
    var _n = [
        `c1`,
        `c2`,
        `c3`,
        `c4`
    ], vn = Ie(()=>new Worker(new URL(`/_astro/pyraminx.worker-DVLMHu0c.js`, `` + import.meta.url), {
            type: `module`
        }));
    function yn(e) {
        return {
            face: e[0].toUpperCase(),
            suffix: e.endsWith(`'`) ? `'` : ``,
            notation: e
        };
    }
    var bn = {
        id: `fast`,
        label: `Giải nhanh (tối ưu)`,
        available: !0,
        async solve (e) {
            let t = Xt(e);
            if (!t) throw Error(`Trạng thái khối chưa hợp lệ.`);
            let [n, r] = (await vn.solve(t)).split(`|`), i = (e)=>e.split(/\s+/).filter(Boolean).map(yn), a = i(n ?? ``), o = i(r ?? ``), s = [];
            a.length && s.push({
                name: `Cạnh & tâm`,
                moves: a
            }), o.length && s.push({
                name: `Đỉnh`,
                moves: o
            });
            let c = [
                ...a,
                ...o
            ];
            return s.length === 0 && s.push({
                name: `Giải`,
                moves: c
            }), {
                mode: `fast`,
                phases: s,
                moves: c
            };
        }
    };
    function xn() {
        return {
            facelets: Array(36).fill(null)
        };
    }
    function Sn() {
        return {
            facelets: R.map((e)=>`c${e.face + 1}`)
        };
    }
    var Cn = [
        He,
        ot,
        Ot,
        {
            id: `pyraminx`,
            label: `Rubik hình chóp`,
            shortLabel: `Pyraminx`,
            description: `Tứ diện 4 mặt tam giác, mỗi mặt 9 ô.`,
            illustration: `/images/rubik/pyraminx.svg`,
            enabled: !0,
            colorCount: 4,
            faceletCount: 36,
            colorIds: [
                ..._n
            ],
            defaultPalette: {
                c1: `#FFD500`,
                c2: `#009B48`,
                c3: `#B71234`,
                c4: `#0046AD`
            },
            colorLabels: {
                c1: `Màu 1`,
                c2: `Màu 2`,
                c3: `Màu 3`,
                c4: `Màu 4`
            },
            createInitialState: xn,
            createSolvedState: Sn,
            createRenderer (e, t) {
                return gn(e, t);
            },
            validate: on,
            solverModes: ()=>[
                    bn
                ],
            invertMove: (e)=>yn(e.notation.endsWith(`'`) ? e.notation.slice(0, -1) : `${e.notation}'`),
            warmUp: ()=>vn.warmUp(),
            isSolverReady: ()=>vn.isReady()
        }
    ], wn = new Map(Cn.map((e)=>[
            e.id,
            e
        ]));
    function Tn() {
        return Cn;
    }
    function En(e) {
        return wn.get(e);
    }
    var Dn = class {
        container;
        onPick;
        constructor(e, t){
            this.container = e, this.onPick = t, this.build();
        }
        build() {
            this.container.innerHTML = ``;
            for (let e of Tn()){
                let t = document.createElement(e.enabled ? `button` : `div`);
                t.className = `rs-puzzle-card`, e.enabled ? (t.type = `button`, t.addEventListener(`click`, ()=>this.onPick(e.id))) : t.classList.add(`rs-puzzle-card--soon`);
                let n = document.createElement(`img`);
                n.className = `rs-puzzle-card__img`, n.src = e.illustration, n.alt = e.label, n.loading = `lazy`, n.width = 120, n.height = 120;
                let r = document.createElement(`h3`);
                r.className = `rs-puzzle-card__title`, r.textContent = e.label;
                let i = document.createElement(`p`);
                if (i.className = `rs-puzzle-card__desc`, i.textContent = e.description, t.append(n, r, i), !e.enabled) {
                    let e = document.createElement(`span`);
                    e.className = `rs-puzzle-card__badge`, e.textContent = `Đang phát triển`, t.appendChild(e);
                }
                this.container.appendChild(t);
            }
        }
    }, On = class {
        refs;
        opts;
        modes = [];
        isReady = ()=>!0;
        result = null;
        moveEls = [];
        constructor(e, t){
            this.refs = e, this.opts = t, this.refs.solveBtn.addEventListener(`click`, ()=>this.runSolve()), this.refs.copyBtn.addEventListener(`click`, ()=>this.copy());
        }
        setModes(e, t) {
            this.modes = e, this.isReady = t ?? (()=>!0), this.populateModes();
        }
        setValid(e) {
            this.refs.solveBtn.disabled = !e;
        }
        getResult() {
            return this.result;
        }
        reset() {
            this.result = null, this.hideSolution(), this.setStatus(``, ``);
        }
        setProgress(e) {
            this.moveEls.forEach((t, n)=>{
                t.classList.toggle(`rs-move--done`, n < e), t.classList.toggle(`rs-move--current`, n === e);
            });
        }
        populateModes() {
            this.refs.modeSelect.innerHTML = ``;
            for (let e of this.modes){
                let t = document.createElement(`option`);
                t.value = e.id, t.textContent = e.label, t.disabled = !e.available, this.refs.modeSelect.appendChild(t);
            }
        }
        currentMode() {
            let e = this.refs.modeSelect.value;
            return this.modes.find((t)=>t.id === e) ?? this.modes[0];
        }
        setStatus(e, t) {
            this.refs.status.textContent = e, this.refs.status.className = `rs-solver-status`, t && this.refs.status.classList.add(`rs-solver-status--${t}`);
        }
        async runSolve() {
            if (!this.opts.isValid()) return;
            let e = this.currentMode();
            if (e) {
                this.refs.solveBtn.disabled = !0, this.setStatus(this.isReady() ? `Đang giải...` : `Đang khởi tạo bộ giải (lần đầu mất vài giây)...`, `loading`);
                try {
                    let t = await e.solve(this.opts.getState());
                    this.result = t, this.renderSolution(t), t.moves.length === 0 ? this.setStatus(`Khối đã ở trạng thái đã giải.`, `success`) : this.setStatus(`Đã tìm thấy lời giải gồm ${t.moves.length} bước.`, `success`), this.opts.onSolved(t);
                } catch (e) {
                    this.result = null, this.hideSolution(), this.setStatus(e instanceof Error ? e.message : String(e), `error`);
                } finally{
                    this.refs.solveBtn.disabled = !this.opts.isValid();
                }
            }
        }
        renderSolution(e) {
            this.refs.movesEl.innerHTML = ``, this.moveEls = [];
            let t = e.phases.length > 1, n = 0;
            for (let r of e.phases){
                if (t) {
                    let e = document.createElement(`div`);
                    e.className = `rs-phase`, e.textContent = r.name, this.refs.movesEl.appendChild(e);
                }
                for (let e of r.moves){
                    let t = document.createElement(`span`);
                    t.className = `rs-move`, t.textContent = e.notation, t.dataset.index = String(n), this.refs.movesEl.appendChild(t), this.moveEls.push(t), n++;
                }
            }
            this.refs.solutionWrap.hidden = !1, this.setProgress(0);
        }
        hideSolution() {
            this.refs.solutionWrap.hidden = !0, this.refs.movesEl.innerHTML = ``, this.moveEls = [];
        }
        async copy() {
            if (!this.result) return;
            let e = k(this.result.moves);
            try {
                await navigator.clipboard.writeText(e);
                let t = this.refs.copyBtn.innerHTML;
                this.refs.copyBtn.textContent = `Đã sao chép ✓`, window.setTimeout(()=>{
                    this.refs.copyBtn.innerHTML = t;
                }, 1500);
            } catch  {
                this.setStatus(`Không sao chép được vào clipboard.`, `error`);
            }
        }
    }, z = (e)=>document.getElementById(e), kn = null, B = null, V, H = {}, An = null, U = null, W = null, jn = null, Mn = !1, G = null, K = `paint`, q = [], J = 0, Nn = [], Y = !1, X = null, Pn = null, Fn = null, In = null, Ln = null, Rn = null, zn = null, Bn = null, Vn = null, Hn = null, Un = null, Wn = null, Gn = null, Kn = null;
    function Z(e) {
        kn && (kn.dataset.step = e);
    }
    function qn(e) {
        return e.faceletCount / e.colorCount;
    }
    function Jn() {
        if (!An || !B) return;
        let e = ee(V);
        for (let t of B.colorIds)An.setCount(t, e[t]);
    }
    function Yn() {
        if (!B) return;
        let e = B.validate(V);
        if (jn = e, X) if (X.classList.remove(`rs-validation--success`, `rs-validation--error`, `rs-validation--empty`), e.ok) X.classList.add(`rs-validation--success`), X.innerHTML = `<p class="rs-validation__title">✓ Trạng thái hợp lệ.</p>`;
        else {
            X.classList.add(`rs-validation--error`);
            let t = e.errors.map((e)=>`<li>${e.message}</li>`).join(``);
            X.innerHTML = `<p class="rs-validation__title">Chưa thể giải:</p><ul class="rs-validation__list">${t}</ul>`;
        }
        W?.setValid(e.ok), e.ok && !Mn && (Mn = !0, B.warmUp?.());
    }
    function Xn(e) {
        if (K !== `paint`) return;
        let t = An?.getSelection() ?? B?.colorIds[0];
        t && (g(V, e, t), G?.updateSticker(e, t), Jn(), Yn());
    }
    function Zn() {
        let e = Fn ? Number(Fn.value) : 6;
        return Math.max(100, 1300 - e * 120);
    }
    function Q(e) {
        In && (In.hidden = !e), Ln && (Ln.disabled = !e || J <= 0), Rn && (Rn.disabled = !e || J >= q.length), zn && (zn.disabled = !e || q.length === 0), Hn && (Hn.disabled = !e);
    }
    function $() {
        Bn && (Bn.hidden = Y), Vn && (Vn.hidden = !Y);
    }
    async function Qn() {
        !G || J >= q.length || G.isAnimating() || (await G.animateMove(q[J], Zn()), J++, W?.setProgress(J), Q(!0));
    }
    async function $n() {
        !G || !B || J <= 0 || G.isAnimating() || (await G.animateMove(B.invertMove(q[J - 1]), Zn()), J--, W?.setProgress(J), Q(!0));
    }
    function er(e) {
        return new Promise((t)=>window.setTimeout(t, e));
    }
    async function tr() {
        if (Y) {
            Y = !1, $();
            return;
        }
        for(J >= q.length && (J = 0), Y = !0, $(); Y && J < q.length && (await Qn(), Y);)await er(140);
        Y = !1, $();
    }
    function nr() {
        G && (Y = !1, $(), G.loadState(Nn.slice()), J = 0, W?.setProgress(0), Q(!0));
    }
    function rr(e) {
        K = `solution`, q = e.moves, J = 0, Nn = V.facelets.slice(), G?.setPaintEnabled(!1), G?.loadState(Nn.slice()), W?.setProgress(0), Z(`solve`), Q(!0);
    }
    async function ir() {
        !Pn || !B || (G?.dispose(), G = await B.createRenderer(Pn, {
            palette: H,
            onPaint: Xn
        }), G.loadState(V.facelets.slice()), G.setPaintEnabled(!1));
    }
    async function ar(e) {
        let t = En(e);
        if (!t || !t.enabled) return;
        B = t, Mn = !1, V = t.createInitialState(), K = `paint`, q = [], J = 0;
        let n = await re(e);
        H = or(t, n), W?.setModes(t.solverModes(), t.isSolverReady), W?.reset(), Gn && (Gn.hidden = !t.createSolvedState), await ir(), await sr(t, n), Q(!1), Z(`colors`);
    }
    function or(e, t) {
        let n = {}, r = t && t.length === e.colorCount;
        return e.colorIds.forEach((i, a)=>{
            n[i] = r ? t[a] : e.defaultPalette[i];
        }), n;
    }
    async function sr(e, t) {
        let n = z(`rs-colorsetup`);
        if (!n) return;
        U?.destroy();
        let r = await ie(Object.values(e.defaultPalette));
        U = new T(n, {
            colorIds: e.colorIds,
            labels: e.colorLabels,
            initial: or(e, t),
            pool: r
        }, {
            onChange: (t, n)=>{
                H = t, G?.setPalette(H), Wn && (Wn.textContent = n ? `` : `Cần ${e.colorCount} màu khác nhau để phân biệt các mặt.`), Un && (Un.disabled = !n);
            },
            onAddColor: (e)=>void ae(e)
        });
    }
    function cr() {
        if (!B || !U || (U.destroy(), H = U.getPalette(), new Set(Object.values(H)).size !== B.colorCount)) return;
        oe(B.id, B.colorIds.map((e)=>H[e]));
        let e = z(`rs-palette`);
        e && (An = new b(e, {
            colorIds: B.colorIds,
            palette: H,
            labels: B.colorLabels,
            perColor: qn(B)
        })), G?.setPalette(H), G?.setPaintEnabled(!0), K = `paint`, Jn(), Yn(), Q(!1), Z(`paint`);
    }
    function lr() {
        B && (V = B.createInitialState(), K = `paint`, q = [], J = 0, Y = !1, $(), W?.reset(), G?.loadState(V.facelets.slice()), Jn(), Yn(), Q(!1));
    }
    function ur() {
        lr(), G?.setPaintEnabled(!0), Z(`paint`);
    }
    function dr() {
        lr(), G?.setPaintEnabled(!1), Z(`colors`);
    }
    function fr() {
        Y = !1, $(), U?.destroy(), G?.dispose(), G = null, B = null, Z(`pick`);
    }
    function pr() {
        B?.createSolvedState && (V = B.createSolvedState(), K = `paint`, q = [], J = 0, Y = !1, $(), W?.reset(), G?.setPaintEnabled(!0), G?.loadState(V.facelets.slice()), Jn(), Yn(), Q(!1), Z(`paint`));
    }
    function mr() {
        document.fullscreenElement ? document.exitFullscreen() : Kn?.requestFullscreen?.();
    }
    function hr() {
        let e = !!document.fullscreenElement;
        document.querySelectorAll(`.rs-fullscreen`).forEach((t)=>{
            t.querySelectorAll(`.rs-fs-icon`).forEach((t)=>{
                t.hidden = t.dataset.fs === `expand` ? e : !e;
            });
            let n = e ? `Thoát toàn màn hình` : `Toàn màn hình`;
            t.title = n, t.setAttribute(`aria-label`, n);
        });
    }
    function gr() {
        if (kn = z(`rs-app`), !kn) return;
        X = z(`rs-validation`), Pn = z(`rs-viewer`), Fn = z(`rs-speed`), In = z(`rs-playback`), Ln = z(`rs-prev`), Rn = z(`rs-next`), zn = z(`rs-auto`), Bn = z(`rs-auto-play`), Vn = z(`rs-auto-pause`), Hn = z(`rs-reset-view`), Un = z(`rs-colors-continue`), Wn = z(`rs-colors-msg`), Gn = z(`rs-example`);
        let e = _r();
        e && (W = new On(e, {
            getState: ()=>V,
            isValid: ()=>jn?.ok ?? !1,
            onSolved: rr
        }));
        let t = z(`rs-pick`);
        t && new Dn(t, (e)=>void ar(e)), Un?.addEventListener(`click`, cr), z(`rs-recolor`)?.addEventListener(`click`, dr), z(`rs-change-puzzle`)?.addEventListener(`click`, fr), z(`rs-clear`)?.addEventListener(`click`, ur), Gn?.addEventListener(`click`, pr), Ln?.addEventListener(`click`, ()=>void $n()), Rn?.addEventListener(`click`, ()=>void Qn()), zn?.addEventListener(`click`, ()=>void tr()), Hn?.addEventListener(`click`, nr), z(`rs-zoom-in`)?.addEventListener(`click`, ()=>G?.zoom(1)), z(`rs-zoom-out`)?.addEventListener(`click`, ()=>G?.zoom(-1)), Kn = z(`rs-workspace`), document.querySelectorAll(`.rs-fullscreen`).forEach((e)=>e.addEventListener(`click`, mr)), document.addEventListener(`fullscreenchange`, hr), window.addEventListener(`pagehide`, ()=>{
            G?.dispose(), G = null;
        }), Z(`pick`);
    }
    function _r() {
        let e = z(`rs-mode`), t = z(`rs-solve`), n = z(`rs-solver-status`), r = z(`rs-solution`), i = z(`rs-moves`), a = z(`rs-copy`);
        return !e || !t || !n || !r || !i || !a ? null : {
            modeSelect: e,
            solveBtn: t,
            status: n,
            solutionWrap: r,
            movesEl: i,
            copyBtn: a
        };
    }
    document.addEventListener(`DOMContentLoaded`, ()=>gr());
})();
