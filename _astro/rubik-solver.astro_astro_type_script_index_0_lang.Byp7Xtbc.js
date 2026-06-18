import { g as xt } from "./kv-store.DuB8mqC6.js";
import { _ as Vt } from "./preload-helper.CVfkMyKi.js";
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
    ], Ze = {
        U: "c1",
        R: "c2",
        F: "c3",
        D: "c4",
        L: "c5",
        B: "c6"
    }, Wt = {
        c1: "U",
        c2: "R",
        c3: "F",
        c4: "D",
        c5: "L",
        c6: "B"
    }, Yt = {
        U: "Trên (U)",
        D: "Dưới (D)",
        F: "Trước (F)",
        B: "Sau (B)",
        L: "Trái (L)",
        R: "Phải (R)"
    }, In = {
        c1: "#FFFFFF",
        c2: "#B71234",
        c3: "#009B48",
        c4: "#FFD500",
        c5: "#FF5800",
        c6: "#0046AD"
    }, me = 54, qt = 9, Dn = 4;
    function Ht(t, e) {
        return B.indexOf(t) * qt + e;
    }
    function Pt(t) {
        return Ht(t, Dn);
    }
    function Xt() {
        return {
            facelets: new Array(me).fill(null)
        };
    }
    function Tn() {
        const t = Xt();
        for (const e of B)t.facelets[Pt(e)] = Ze[e];
        return t;
    }
    function zn() {
        const t = Xt();
        for (const e of B)for(let n = 0; n < qt; n++)t.facelets[Ht(e, n)] = Ze[e];
        return t;
    }
    function Un(t, e, n) {
        t.facelets[e] = n;
    }
    function Kt(t) {
        const e = {};
        for (const n of Z)e[n] = 0;
        for (const n of t.facelets)n && e[n]++;
        return e;
    }
    function jn(t) {
        let e = 0;
        for (const n of t.facelets)n && e++;
        return e;
    }
    function Zt(t) {
        return t.facelets.every((e)=>e !== null);
    }
    function Nn(t) {
        const e = {}, n = new Set;
        for (const o of B){
            const s = t.facelets[Pt(o)];
            if (!s || n.has(s)) return null;
            n.add(s), e[s] = o;
        }
        return e;
    }
    function Jt(t) {
        if (!Zt(t)) return null;
        const e = Nn(t);
        if (!e) return null;
        let n = "";
        for(let o = 0; o < me; o++){
            const s = t.facelets[o];
            n += e[s];
        }
        return n;
    }
    class Gn {
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
                const s = document.createElement("button");
                s.type = "button", s.className = "rs-swatch", s.dataset.color = e, s.title = n, s.setAttribute("aria-label", n), s.style.background = this.cfg.palette[e], s.addEventListener("click", ()=>this.select(e));
                const r = document.createElement("div");
                r.className = "rs-count", r.dataset.color = e, r.title = n;
                const i = document.createElement("span");
                i.className = "rs-count__dot", i.style.background = this.cfg.palette[e];
                const l = document.createElement("span");
                l.className = "rs-count__val", l.textContent = `0/${this.cfg.perColor}`, r.append(i, l), o.append(s, r), this.container.appendChild(o), this.countEls.set(e, {
                    wrap: r,
                    val: l
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
    const Ft = "fun/rubik-solver/palettes", it = 1;
    function T(t) {
        return t.trim().toUpperCase();
    }
    function Vn() {
        return {
            version: it,
            pool: [],
            byPuzzle: {}
        };
    }
    async function Je() {
        const t = await xt().get(Ft);
        return !t || t.version !== it ? Vn() : {
            version: it,
            pool: Array.isArray(t.pool) ? t.pool.map(T) : [],
            byPuzzle: t.byPuzzle ?? {}
        };
    }
    async function Wn(t) {
        return (await Je()).byPuzzle[t]?.map(T) ?? null;
    }
    async function Yn(t = []) {
        const e = await Je();
        return e.pool.length > 0 ? e.pool : Rt([], t);
    }
    async function qn(t) {
        const e = await Je();
        return e.pool = Rt(e.pool, [
            t
        ]), await xt().set(Ft, e), e.pool;
    }
    async function Hn(t, e) {
        const n = await Je();
        n.byPuzzle[t] = e.map(T), n.pool = Rt(n.pool, e), await xt().set(Ft, n);
    }
    function Rt(t, e) {
        const n = new Set(t.map(T)), o = t.map(T);
        for (const s of e){
            const r = T(s);
            n.has(r) || (n.add(r), o.push(r));
        }
        return o;
    }
    class Xn {
        constructor(e, n, o){
            this.container = e, this.cfg = n, this.cb = o;
            for (const s of n.colorIds)this.assigned[s] = T(n.initial[s] ?? "#FFFFFF");
            this.pool = n.pool.map(T);
            for (const s of n.colorIds)this.pool.includes(this.assigned[s]) || this.pool.push(this.assigned[s]);
            this.active = n.colorIds[0], this.build(), this.emitChange();
        }
        container;
        cfg;
        cb;
        assigned = {};
        pool;
        active;
        slotEls = new Map;
        poolEl;
        colorInput;
        getPalette() {
            const e = {};
            for (const n of this.cfg.colorIds)e[n] = this.assigned[n];
            return e;
        }
        build() {
            this.container.innerHTML = "";
            const e = document.createElement("div");
            e.className = "rs-cs__slots";
            for (const o of this.cfg.colorIds){
                const s = document.createElement("button");
                s.type = "button", s.className = "rs-cs__slot", s.dataset.color = o, s.title = this.cfg.labels[o] ?? o, s.addEventListener("click", ()=>this.setActive(o));
                const r = document.createElement("span");
                r.className = "rs-cs__slot-swatch", r.style.background = this.assigned[o];
                const i = document.createElement("span");
                i.className = "rs-cs__slot-label", i.textContent = this.cfg.labels[o] ?? o, s.append(r, i), e.appendChild(s), this.slotEls.set(o, s);
            }
            this.container.appendChild(e);
            const n = document.createElement("p");
            n.className = "rs-cs__hint", n.textContent = "Chọn ô mặt rồi bấm một màu để gán:", this.container.appendChild(n), this.poolEl = document.createElement("div"), this.poolEl.className = "rs-cs__pool", this.container.appendChild(this.poolEl), this.colorInput = document.createElement("input"), this.colorInput.type = "color", this.colorInput.className = "rs-cs__color-input", this.colorInput.value = this.assigned[this.active], this.colorInput.addEventListener("input", ()=>this.addAndAssign(this.colorInput.value)), this.container.appendChild(this.colorInput), this.renderPool(), this.setActive(this.active);
        }
        renderPool() {
            this.poolEl.innerHTML = "";
            for (const n of this.pool){
                const o = document.createElement("button");
                o.type = "button", o.className = "rs-cs__chip", o.style.background = n, o.title = n, o.dataset.hex = n, o.setAttribute("aria-label", `Màu ${n}`), o.addEventListener("click", ()=>this.assign(n)), this.poolEl.appendChild(o);
            }
            const e = document.createElement("button");
            e.type = "button", e.className = "rs-cs__chip rs-cs__chip--add", e.title = "Thêm màu mới", e.setAttribute("aria-label", "Thêm màu mới"), e.textContent = "＋", e.addEventListener("click", ()=>this.colorInput.click()), this.poolEl.appendChild(e);
        }
        setActive(e) {
            this.active = e;
            for (const [n, o] of this.slotEls)o.classList.toggle("rs-cs__slot--active", n === e);
            this.colorInput.value = this.assigned[e], this.highlightPool();
        }
        highlightPool() {
            const e = this.assigned[this.active];
            this.poolEl.querySelectorAll(".rs-cs__chip[data-hex]").forEach((n)=>n.classList.toggle("rs-cs__chip--active", T(n.dataset.hex ?? "") === e));
        }
        assign(e) {
            const n = T(e);
            this.assigned[this.active] = n, this.slotEls.get(this.active).querySelector(".rs-cs__slot-swatch").style.background = n, this.advance(), this.highlightPool(), this.emitChange();
        }
        addAndAssign(e) {
            const n = T(e);
            this.pool.includes(n) || (this.pool.push(n), this.cb.onAddColor(n), this.renderPool()), this.assign(n);
        }
        advance() {
            const e = this.cfg.colorIds, n = e.indexOf(this.active), o = e[(n + 1) % e.length];
            this.setActive(o);
        }
        emitChange() {
            const e = this.getPalette(), n = new Set(Object.values(e).map(T)).size === this.cfg.colorIds.length;
            this.cb.onChange(e, n);
        }
    }
    const nt = [
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
    ], Bt = [
        "URF",
        "UFL",
        "ULB",
        "UBR",
        "DFR",
        "DLF",
        "DBL",
        "DRB"
    ], $t = [
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
    ], ze = [
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
    function Kn(t) {
        return `màu ${Yt[Wt[t]]}`;
    }
    function It(t) {
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
    function Zn(t) {
        const e = [], n = (a)=>t[a], o = (a)=>a === "U" || a === "D", s = new Array(8).fill(-1), r = new Array(8).fill(0);
        for(let a = 0; a < 8; a++){
            let p = 0;
            for(; p < 3 && !o(n(nt[a][p])); p++);
            const x = n(nt[a][(p + 1) % 3]), R = n(nt[a][(p + 2) % 3]);
            for(let $ = 0; $ < 8; $++)if (x === Bt[$][1] && R === Bt[$][2]) {
                s[a] = $, r[a] = p % 3;
                break;
            }
        }
        const i = new Array(12).fill(-1), l = new Array(12).fill(0);
        for(let a = 0; a < 12; a++){
            const p = n($t[a][0]), x = n($t[a][1]);
            for(let R = 0; R < 12; R++){
                if (p === ze[R][0] && x === ze[R][1]) {
                    i[a] = R, l[a] = 0;
                    break;
                }
                if (p === ze[R][1] && x === ze[R][0]) {
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
        }), It(s) !== It(i) && e.push({
            code: "permutation-parity",
            message: "Sai parity hoán vị — cần hoán đổi đúng một cặp mảnh để khối có thể giải được."
        }), e);
    }
    function Jn(t) {
        const e = [], n = jn(t);
        n < me && e.push({
            code: "incomplete",
            message: `Còn ${me - n} ô chưa tô (cần đủ ${me} ô).`
        });
        const o = Kt(t), s = Z.filter((c)=>o[c] !== 9);
        if (n === me && s.length > 0) {
            const c = s.map((u)=>`${Kn(u)} ${o[u]}/9`).join(", ");
            e.push({
                code: "color-count",
                message: `Mỗi màu phải đúng 9 ô. Sai: ${c}.`
            });
        }
        const i = B.map((c)=>t.facelets[Pt(c)]).filter((c)=>c !== null);
        if (i.length === 6 && new Set(i).size !== 6 && e.push({
            code: "center-dup",
            message: "6 ô trung tâm phải là 6 màu khác nhau."
        }), e.length === 0 && Zt(t)) {
            const c = Jt(t);
            c && e.push(...Zn(c));
        }
        return {
            ok: e.length === 0,
            errors: e
        };
    }
    const Qn = new Set([
        "U",
        "R",
        "F",
        "D",
        "L",
        "B"
    ]);
    function Qt(t, e) {
        return {
            face: t,
            suffix: e,
            notation: `${t}${e}`
        };
    }
    function eo(t) {
        const e = t.trim();
        if (e.length < 1) return null;
        const n = e[0];
        if (!Qn.has(n)) return null;
        const o = e.slice(1);
        let s;
        if (o === "") s = "";
        else if (o === "'" || o === "’") s = "'";
        else if (o === "2") s = "2";
        else return null;
        return Qt(n, s);
    }
    function en(t) {
        return t.split(/\s+/).map((e)=>e.trim()).filter(Boolean).map(eo).filter((e)=>e !== null);
    }
    function tn(t) {
        if (t.suffix === "2") return t;
        const e = t.suffix === "'" ? "" : "'";
        return Qt(t.face, e);
    }
    function to(t) {
        return t.map((e)=>e.notation).join(" ");
    }
    let ce = null, nn = !1, no = 0;
    const ie = new Map;
    let ot = [];
    function on() {
        return ce || (ce = new Worker(new URL("/_astro/solver.worker-C1g4IsyU.js", import.meta.url), {
            type: "module"
        }), ce.onmessage = (t)=>{
            const e = t.data;
            switch(e.type){
                case "ready":
                    nn = !0, ot.forEach((n)=>n()), ot = [];
                    break;
                case "init-error":
                    ot = [];
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
    function oo() {
        on();
    }
    function so() {
        return nn;
    }
    function ro(t) {
        const e = on(), n = ++no;
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
    const co = {
        id: "layer",
        label: "Giải từng tầng",
        available: !1,
        async solve () {
            throw new Error("Chế độ giải từng tầng sẽ được bổ sung sau.");
        }
    }, io = {
        id: "fast",
        label: "Giải nhanh",
        available: !0,
        async solve (t) {
            const e = Jt(t);
            if (!e) throw new Error("Trạng thái khối chưa hợp lệ.");
            const n = await ro(e), o = en(n);
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
    }, lo = {
        fast: io,
        layer: co
    };
    function ao() {
        return Object.values(lo);
    }
    const Ae = {
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
    function sn(t, e, n) {
        const { n: o, u: s, v: r } = Ae[t], i = e % n, l = Math.floor(e / n), c = n - 1, u = 2 * i - c, w = 2 * l - c;
        return [
            o[0] * c + s[0] * u + r[0] * w,
            o[1] * c + s[1] * u + r[1] * w,
            o[2] * c + s[2] * u + r[2] * w
        ];
    }
    const uo = 1, st = uo / 2, Ue = .94, Dt = .82, fo = .001, po = 2501427, ho = 921878, mo = 6, Tt = .6, go = 2.6;
    function zt(t, e, n) {
        return `${t},${e},${n}`;
    }
    function vo(t, e) {
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
        const o = await Vt(()=>import("./three.CuzN0wor.js"), []), s = n - 1, r = n % 2 === 1 ? (n * n - 1) / 2 : -1, i = new o.Scene, l = new o.PerspectiveCamera(42, 1, .1, 100);
        l.position.set(0, 0, 6.2), l.zoom = Tt;
        const c = new o.WebGLRenderer({
            antialias: !0,
            alpha: !0
        });
        c.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2)), t.appendChild(c.domElement);
        const u = new o.Group;
        u.rotation.x = -.42, u.rotation.y = .62, u.scale.setScalar(3 / n), i.add(u);
        const w = new o.MeshBasicMaterial({
            color: ho
        }), f = new o.MeshBasicMaterial({
            color: po
        }), a = {};
        for (const h of Object.keys(e.palette))a[h] = new o.MeshBasicMaterial({
            color: new o.Color(e.palette[h])
        });
        const p = new o.BoxGeometry(Ue, Ue, Ue), x = new o.PlaneGeometry(Dt, Dt), R = new o.Vector3(0, 0, 1);
        let $ = [], ue = [];
        const de = new Map;
        let ee = !1, Ie = !1;
        function Ee(h) {
            return h ? a[h] : f;
        }
        function H() {
            for (const h of $)u.remove(h.group);
            $ = [], ue = [], de.clear();
        }
        function tt(h) {
            H();
            const v = new Map;
            for(let m = -s; m <= s; m += 2)for(let k = -s; k <= s; k += 2)for(let M = -s; M <= s; M += 2){
                if (!(Math.abs(m) === s || Math.abs(k) === s || Math.abs(M) === s)) continue;
                const F = new o.Group;
                F.position.set(m * st, k * st, M * st), F.add(new o.Mesh(p, w));
                const A = {
                    group: F,
                    coord: new o.Vector3(m, k, M)
                };
                u.add(F), $.push(A), v.set(zt(m, k, M), A);
            }
            for(let m = 0; m < B.length; m++){
                const k = B[m], M = Ae[k], _ = new o.Vector3(M.n[0], M.n[1], M.n[2]);
                for(let F = 0; F < n * n; F++){
                    const A = m * n * n + F, [W, Fe, O] = sn(k, F, n), re = v.get(zt(W, Fe, O));
                    if (!re) continue;
                    const Y = new o.Mesh(x, Ee(h[A]));
                    Y.position.copy(_).multiplyScalar(Ue / 2 + fo), Y.quaternion.setFromUnitVectors(R, _), Y.userData.faceletIndex = A, Y.userData.paintable = F !== r, re.group.add(Y), ue.push(Y), de.set(A, Y);
                }
            }
            K();
        }
        function ye(h, v) {
            const m = de.get(h);
            m && (m.material = Ee(v), K());
        }
        function X(h) {
            Ie = h;
        }
        function De(h) {
            for (const v of Object.keys(h))a[v]?.color.set(new o.Color(h[v]));
            K();
        }
        function be(h) {
            const v = h > 0 ? 1.15 : .8695652173913044;
            l.zoom = Math.min(go, Math.max(Tt, l.zoom * v)), l.updateProjectionMatrix(), K();
        }
        function Te(h, v) {
            const m = Ae[h].n, k = s - v * 2;
            return $.filter((M)=>Math.round(M.coord.x) * m[0] + Math.round(M.coord.y) * m[1] + Math.round(M.coord.z) * m[2] === k);
        }
        function Ce(h, v) {
            if (ee) return Promise.resolve();
            const m = vo(h, n);
            if (!m) return Promise.resolve();
            ee = !0;
            const k = Ae[m.face], M = new o.Vector3(k.n[0], k.n[1], k.n[2]), _ = m.quarter === 2 ? -Math.PI : m.quarter === -1 ? Math.PI / 2 : -Math.PI / 2, F = new Set;
            for (const O of m.depths)for (const re of Te(m.face, O))F.add(re);
            const A = new o.Group;
            u.add(A);
            for (const O of F)A.attach(O.group);
            const W = Math.max(60, v), Fe = performance.now();
            return new Promise((O)=>{
                const re = (Y)=>{
                    const Re = Math.min(1, (Y - Fe) / W), $n = Re < .5 ? 2 * Re * Re : 1 - Math.pow(-2 * Re + 2, 2) / 2;
                    if (A.quaternion.setFromAxisAngle(M, _ * $n), c.render(i, l), Re < 1) {
                        requestAnimationFrame(re);
                        return;
                    }
                    for (const Ot of F)u.attach(Ot.group), Ot.coord.applyAxisAngle(M, _).round();
                    u.remove(A), ee = !1, c.render(i, l), O();
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
            const h = t.clientWidth || 1, v = t.clientHeight || 1;
            c.setSize(h, v, !1), l.aspect = h / v, l.updateProjectionMatrix(), K();
        }
        const ne = new ResizeObserver(te);
        ne.observe(t), te();
        const Me = new o.Raycaster, fe = new o.Vector2, ke = new o.Vector3(0, 1, 0), Le = new o.Vector3(1, 0, 0);
        let pe = !1, oe = !1, xe = 0, se = 0, he = 0, Pe = 0;
        function d(h) {
            const v = c.domElement.getBoundingClientRect();
            fe.x = (h.clientX - v.left) / v.width * 2 - 1, fe.y = -((h.clientY - v.top) / v.height) * 2 + 1, i.updateMatrixWorld(!0), Me.setFromCamera(fe, l);
            const m = Me.intersectObjects(ue, !1);
            return m.length ? m[0].object : null;
        }
        function g(h) {
            pe = !0, oe = !1, xe = he = h.clientX, se = Pe = h.clientY, c.domElement.setPointerCapture(h.pointerId);
        }
        function E(h) {
            if (pe) {
                if (!oe) {
                    if (Math.hypot(h.clientX - xe, h.clientY - se) < mo) return;
                    oe = !0;
                }
                u.rotateOnWorldAxis(ke, (h.clientX - he) * .008), u.rotateOnWorldAxis(Le, (h.clientY - Pe) * .008), he = h.clientX, Pe = h.clientY, K();
            }
        }
        function C(h) {
            const v = pe && !oe;
            pe = !1;
            try {
                c.domElement.releasePointerCapture(h.pointerId);
            } catch  {}
            if (v && Ie && !ee && e.onPaint) {
                const m = d(h);
                m && m.userData.paintable && e.onPaint(m.userData.faceletIndex);
            }
        }
        function I(h) {
            h.preventDefault(), be(h.deltaY < 0 ? 1 : -1);
        }
        c.domElement.addEventListener("pointerdown", g), c.domElement.addEventListener("pointermove", E), c.domElement.addEventListener("pointerup", C), c.domElement.addEventListener("pointercancel", C), c.domElement.addEventListener("wheel", I, {
            passive: !1
        });
        function U() {
            ne.disconnect(), c.domElement.removeEventListener("pointerdown", g), c.domElement.removeEventListener("pointermove", E), c.domElement.removeEventListener("pointerup", C), c.domElement.removeEventListener("pointercancel", C), c.domElement.removeEventListener("wheel", I), H(), p.dispose(), x.dispose(), w.dispose(), f.dispose();
            for (const h of Object.keys(a))a[h].dispose();
            c.dispose(), c.domElement.parentNode === t && t.removeChild(c.domElement);
        }
        return {
            loadState: tt,
            updateSticker: ye,
            setPalette: De,
            zoom: be,
            setPaintEnabled: X,
            animateMove: Ce,
            isAnimating: ()=>ee,
            dispose: U
        };
    }
    const wo = Object.fromEntries(Z.map((t)=>[
            t,
            Yt[Wt[t]]
        ])), Eo = {
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
            ...In
        },
        colorLabels: wo,
        createInitialState () {
            return Tn();
        },
        createSolvedState () {
            return zn();
        },
        createRenderer (t, e) {
            return _t(t, e, 3);
        },
        validate: Jn,
        solverModes: ()=>ao(),
        invertMove: (t)=>tn(t),
        warmUp: oo,
        isSolverReady: so
    };
    function rn(t) {
        const e = [];
        for(let n = 0; n < B.length; n++){
            const o = B[n], s = Ae[o].n;
            for(let r = 0; r < t * t; r++)e.push({
                coord: sn(o, r, t),
                normal: s
            });
        }
        return e;
    }
    const yo = 2, Oe = 24, lt = 4, G = rn(yo);
    function cn(t) {
        return t[0] > 0 ? "R" : t[0] < 0 ? "L" : t[1] > 0 ? "U" : t[1] < 0 ? "D" : t[2] > 0 ? "F" : "B";
    }
    function at(t) {
        return `${t[0]},${t[1]},${t[2]}`;
    }
    function bo(t) {
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
    function Co(t, e) {
        return [
            t[1] * e[2] - t[2] * e[1],
            t[2] * e[0] - t[0] * e[2],
            t[0] * e[1] - t[1] * e[0]
        ];
    }
    function So(t, e) {
        return t[0] * e[0] + t[1] * e[1] + t[2] * e[2];
    }
    const ln = [], Ut = [], an = {};
    (()=>{
        const t = new Map;
        for(let e = 0; e < G.length; e++){
            const n = at(G[e].coord);
            (t.get(n) ?? t.set(n, []).get(n)).push(e);
        }
        for (const e of t.values()){
            const n = G[e[0]].coord, o = bo(n), s = e.find((u)=>G[u].normal[1] !== 0), r = e.filter((u)=>u !== s), i = G[s].normal, l = So(Co(i, G[r[0]].normal), n) > 0 ? [
                s,
                r[0],
                r[1]
            ] : [
                s,
                r[1],
                r[0]
            ];
            ln[o] = l, Ut[o] = l.map((u)=>cn(G[u].normal));
            const c = [
                ...Ut[o]
            ].sort().join("");
            an[c] = o;
        }
    })();
    function Mo(t) {
        const e = new Array(8), n = new Array(8);
        for(let o = 0; o < 8; o++){
            const s = ln[o], r = [
                t[s[0]],
                t[s[1]],
                t[s[2]]
            ], i = r.findIndex((c)=>c === "U" || c === "D");
            if (i < 0) return null;
            const l = an[[
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
    function ko(t) {
        const e = t.facelets;
        if (e.some((a)=>a === null)) return null;
        const n = {};
        for (const a of e)n[a] = (n[a] ?? 0) + 1;
        const o = Object.keys(n);
        if (o.length !== 6 || o.some((a)=>n[a] !== lt)) return null;
        const s = new Map;
        for (const a of o)s.set(a, new Set);
        const r = new Map;
        for(let a = 0; a < G.length; a++){
            const p = at(G[a].coord);
            (r.get(p) ?? r.set(p, []).get(p)).push(e[a]);
        }
        for (const a of r.values())for (const p of a)for (const x of a)p !== x && s.get(p).add(x);
        const i = {};
        for (const a of o){
            const p = o.filter((x)=>x !== a && !s.get(a).has(x));
            if (p.length !== 1) return null;
            i[a] = p[0];
        }
        const l = G.map((a, p)=>({
                g: a,
                i: p
            })).filter(({ g: a })=>at(a.coord) === "-1,-1,-1");
        let c = "", u = "", w = "";
        for (const { g: a, i: p } of l){
            const x = cn(a.normal);
            x === "D" ? c = e[p] : x === "L" ? u = e[p] : x === "B" && (w = e[p]);
        }
        if (!c || !u || !w) return null;
        const f = {
            [c]: "D",
            [i[c]]: "U",
            [u]: "L",
            [i[u]]: "R",
            [w]: "B",
            [i[w]]: "F"
        };
        return new Set(Object.values(f)).size !== 6 || Object.keys(f).length !== 6 ? null : f;
    }
    function un(t) {
        const e = ko(t);
        if (!e) return null;
        let n = "";
        for (const o of t.facelets)n += e[o];
        return n;
    }
    function Lo(t) {
        const e = [], n = t.facelets.filter((u)=>u !== null).length;
        if (n < Oe) return e.push({
            code: "incomplete",
            message: `Còn ${Oe - n} ô chưa tô (cần đủ ${Oe} ô).`
        }), {
            ok: !1,
            errors: e
        };
        const o = {};
        for (const u of t.facelets)o[u] = (o[u] ?? 0) + 1;
        const s = Z.filter((u)=>o[u]), r = s.filter((u)=>o[u] !== lt);
        if (s.length !== 6 || r.length > 0) return e.push({
            code: "color-count",
            message: `Cần đúng 6 màu, mỗi màu ${lt} ô.`
        }), {
            ok: !1,
            errors: e
        };
        const i = un(t), l = i ? Mo(i) : null;
        return !i || !l ? (e.push({
            code: "impossible-pieces",
            message: "Cách tô tạo ra góc trùng lặp hoặc không tồn tại trên khối Rubik thật."
        }), {
            ok: !1,
            errors: e
        }) : (new Set(l.cp).size !== 8 && e.push({
            code: "impossible-pieces",
            message: "Có góc bị trùng — mỗi góc phải xuất hiện đúng một lần."
        }), l.co.reduce((u, w)=>u + w, 0) % 3 !== 0 && e.push({
            code: "corner-twist",
            message: "Có một góc bị xoay sai hướng (tổng định hướng góc không chia hết cho 3)."
        }), {
            ok: e.length === 0,
            errors: e
        });
    }
    function At(t) {
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
                return new Promise((w, f)=>{
                    s.set(u, {
                        resolve: w,
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
    const xo = {
        c1: "#FFFFFF",
        c2: "#B71234",
        c3: "#009B48",
        c4: "#FFD500",
        c5: "#FF5800",
        c6: "#0046AD"
    }, ut = At(()=>new Worker(new URL("/_astro/cube2.worker-Dv_EJMNT.js", import.meta.url), {
            type: "module"
        })), Po = {
        id: "fast",
        label: "Giải nhanh (tối ưu)",
        available: !0,
        async solve (t) {
            const e = un(t);
            if (!e) throw new Error("Trạng thái khối chưa hợp lệ.");
            const n = await ut.solve(e), o = en(n);
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
    function Fo() {
        return {
            facelets: new Array(Oe).fill(null)
        };
    }
    function Ro() {
        const t = [];
        for(let e = 0; e < B.length; e++)for(let n = 0; n < 4; n++)t.push(Ze[B[e]]);
        return {
            facelets: t
        };
    }
    const _o = {
        id: "cube2",
        label: "Rubik 2×2",
        shortLabel: "2×2",
        description: "Khối Pocket 6 mặt, mỗi mặt 4 ô.",
        illustration: "/images/rubik/cube2.svg",
        enabled: !0,
        colorCount: 6,
        faceletCount: Oe,
        colorIds: [
            ...Z
        ],
        defaultPalette: {
            ...xo
        },
        colorLabels: {
            c1: "Màu 1",
            c2: "Màu 2",
            c3: "Màu 3",
            c4: "Màu 4",
            c5: "Màu 5",
            c6: "Màu 6"
        },
        createInitialState: Fo,
        createSolvedState: Ro,
        createRenderer (t, e) {
            return _t(t, e, 2);
        },
        validate: Lo,
        solverModes: ()=>[
                Po
            ],
        invertMove: (t)=>tn(t),
        warmUp: ()=>ut.warmUp(),
        isSolverReady: ()=>ut.isReady()
    }, Ao = 4, Be = 96, dt = 16, Oo = 16, Bo = [
        0,
        3,
        12,
        15
    ], D = rn(Ao);
    function dn(t) {
        return t[0] > 0 ? "R" : t[0] < 0 ? "L" : t[1] > 0 ? "U" : t[1] < 0 ? "D" : t[2] > 0 ? "F" : "B";
    }
    const ft = (t)=>`${t[0]},${t[1]},${t[2]}`;
    function $o(t) {
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
    const Io = (t, e)=>[
            t[1] * e[2] - t[2] * e[1],
            t[2] * e[0] - t[0] * e[2],
            t[0] * e[1] - t[1] * e[0]
        ], Do = (t, e)=>t[0] * e[0] + t[1] * e[1] + t[2] * e[2], pt = (t)=>Bo.includes(t % Oo), fn = [], pn = {};
    (()=>{
        const t = new Map;
        for(let e = 0; e < D.length; e++){
            if (!pt(e)) continue;
            const n = ft(D[e].coord);
            (t.get(n) ?? t.set(n, []).get(n)).push(e);
        }
        for (const e of t.values()){
            const n = D[e[0]].coord, o = $o(n), s = e.find((u)=>D[u].normal[1] !== 0), r = e.filter((u)=>u !== s), i = D[s].normal, l = Do(Io(i, D[r[0]].normal), n) > 0 ? [
                s,
                r[0],
                r[1]
            ] : [
                s,
                r[1],
                r[0]
            ];
            fn[o] = l;
            const c = l.map((u)=>dn(D[u].normal));
            pn[[
                ...c
            ].sort().join("")] = o;
        }
    })();
    function To(t) {
        const e = t.facelets;
        if (e.some((f)=>f === null)) return null;
        const n = {};
        for (const f of e)n[f] = (n[f] ?? 0) + 1;
        const o = Object.keys(n);
        if (o.length !== 6 || o.some((f)=>n[f] !== dt)) return null;
        const s = new Map;
        for (const f of o)s.set(f, new Set);
        const r = new Map;
        for(let f = 0; f < D.length; f++){
            if (!pt(f)) continue;
            const a = ft(D[f].coord);
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
        for(let f = 0; f < D.length; f++){
            if (!pt(f) || ft(D[f].coord) !== "-3,-3,-3") continue;
            const a = dn(D[f].normal);
            a === "D" ? l = e[f] : a === "L" ? c = e[f] : a === "B" && (u = e[f]);
        }
        if (!l || !c || !u) return null;
        const w = {
            [l]: "D",
            [i[l]]: "U",
            [c]: "L",
            [i[c]]: "R",
            [u]: "B",
            [i[u]]: "F"
        };
        return new Set(Object.values(w)).size !== 6 || Object.keys(w).length !== 6 ? null : w;
    }
    function hn(t) {
        const e = To(t);
        if (!e) return null;
        let n = "";
        for (const o of t.facelets)n += e[o];
        return n;
    }
    function zo(t) {
        const e = [];
        let n = 0;
        for(let o = 0; o < 8; o++){
            const s = fn[o], r = [
                t[s[0]],
                t[s[1]],
                t[s[2]]
            ], i = r.findIndex((c)=>c === "U" || c === "D");
            if (i < 0) {
                e.push(-1);
                continue;
            }
            const l = pn[[
                ...r
            ].sort().join("")];
            e.push(l ?? -1), n += i;
        }
        return {
            sum: n % 3,
            distinct: new Set(e).size === 8 && !e.includes(-1)
        };
    }
    function Uo(t) {
        const e = [], n = t.facelets.filter((c)=>c !== null).length;
        if (n < Be) return e.push({
            code: "incomplete",
            message: `Còn ${Be - n} ô chưa tô (cần đủ ${Be} ô).`
        }), {
            ok: !1,
            errors: e
        };
        const o = {};
        for (const c of t.facelets)o[c] = (o[c] ?? 0) + 1;
        const s = Z.filter((c)=>o[c]);
        if (s.length !== 6 || s.some((c)=>o[c] !== dt)) return e.push({
            code: "color-count",
            message: `Cần đúng 6 màu, mỗi màu ${dt} ô.`
        }), {
            ok: !1,
            errors: e
        };
        const r = hn(t);
        if (!r) return e.push({
            code: "center-dup",
            message: "Không suy được khung màu — kiểm tra lại màu các góc/khối."
        }), {
            ok: !1,
            errors: e
        };
        const { sum: i, distinct: l } = zo(r);
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
    const jo = {
        c1: "#FFFFFF",
        c2: "#B71234",
        c3: "#009B48",
        c4: "#FFD500",
        c5: "#FF5800",
        c6: "#0046AD"
    }, ht = At(()=>new Worker(new URL("/_astro/cube4.worker-BMjxJp4w.js", import.meta.url), {
            type: "module"
        }));
    function mn(t) {
        const e = t[0], n = t.endsWith("2") ? "2" : t.endsWith("'") ? "'" : "";
        return {
            face: e,
            suffix: n,
            notation: t
        };
    }
    const No = {
        id: "fast",
        label: "Giải (reduction)",
        available: !0,
        async solve (t) {
            const e = hn(t);
            if (!e) throw new Error("Trạng thái khối chưa hợp lệ.");
            const o = (await ht.solve(e)).split(/\s+/).filter(Boolean).map(mn);
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
    function Go() {
        return {
            facelets: new Array(Be).fill(null)
        };
    }
    function Vo() {
        const t = [];
        for(let e = 0; e < B.length; e++)for(let n = 0; n < 16; n++)t.push(Ze[B[e]]);
        return {
            facelets: t
        };
    }
    const Wo = {
        id: "cube4",
        label: "Rubik 4×4",
        shortLabel: "4×4",
        description: "Khối Revenge 6 mặt, mỗi mặt 16 ô.",
        illustration: "/images/rubik/cube4.svg",
        enabled: !0,
        colorCount: 6,
        faceletCount: Be,
        colorIds: [
            ...Z
        ],
        defaultPalette: {
            ...jo
        },
        colorLabels: {
            c1: "Màu 1",
            c2: "Màu 2",
            c3: "Màu 3",
            c4: "Màu 4",
            c5: "Màu 5",
            c6: "Màu 6"
        },
        createInitialState: Go,
        createSolvedState: Vo,
        createRenderer (t, e) {
            return _t(t, e, 4);
        },
        validate: Uo,
        solverModes: ()=>[
                No
            ],
        invertMove: (t)=>{
            const e = t.notation.replace(/['2]$/, ""), n = t.notation.endsWith("2") ? "2" : t.notation.endsWith("'") ? "" : "'";
            return mn(e + n);
        },
        warmUp: ()=>ht.warmUp(),
        isSolverReady: ()=>ht.isReady()
    }, ge = 36, gn = 9, ve = [
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
    ], mt = [
        "U",
        "L",
        "R",
        "B"
    ], Ne = (t, e)=>[
            t[0] + e[0],
            t[1] + e[1],
            t[2] + e[2]
        ], jt = (t, e)=>[
            t[0] - e[0],
            t[1] - e[1],
            t[2] - e[2]
        ], je = (t, e)=>[
            t[0] * e,
            t[1] * e,
            t[2] * e
        ], vn = (t, e)=>t[0] * e[0] + t[1] * e[1] + t[2] * e[2], wn = (t, e)=>[
            t[1] * e[2] - t[2] * e[1],
            t[2] * e[0] - t[0] * e[2],
            t[0] * e[1] - t[1] * e[0]
        ], En = (t)=>{
        const e = Math.hypot(t[0], t[1], t[2]) || 1;
        return [
            t[0] / e,
            t[1] / e,
            t[2] / e
        ];
    }, yn = (t, e, n)=>je(Ne(Ne(t, e), n), 1 / 3);
    function Yo(t, e, n) {
        const o = n * Math.PI / 180, s = Math.cos(o), r = Math.sin(o), i = e, l = wn(i, t), c = vn(i, t) * (1 - s);
        return [
            t[0] * s + l[0] * r + i[0] * c,
            t[1] * s + l[1] * r + i[1] * c,
            t[2] * s + l[2] * r + i[2] * c
        ];
    }
    const bn = [];
    (()=>{
        for(let t = 0; t < 4; t++){
            const e = [
                0,
                1,
                2,
                3
            ].filter((l)=>l !== t), [n, o, s] = e.map((l)=>ve[l]), r = yn(n, o, s), i = wn(jt(o, n), jt(s, n));
            bn.push(vn(i, r) >= 0 ? e : [
                e[0],
                e[2],
                e[1]
            ]);
        }
    })();
    const Cn = (t)=>`${t[0].toFixed(3)},${t[1].toFixed(3)},${t[2].toFixed(3)}`, L = [];
    (()=>{
        for(let e = 0; e < 4; e++){
            const [n, o, s] = bn[e], r = ve[n], i = ve[o], l = ve[s], c = (a, p)=>Ne(Ne(je(r, (3 - a - p) / 3), je(i, a / 3)), je(l, p / 3)), u = (a, p)=>[
                    c(a, p),
                    c(a + 1, p),
                    c(a, p + 1)
                ], w = (a, p)=>[
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
                    tri: w(0, 0),
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
                    tri: w(1, 0),
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
                    tri: w(0, 1),
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
            for (const a of f)L.push({
                face: e,
                type: a.type,
                owners: a.owners,
                corners: a.tri,
                centroid: yn(a.tri[0], a.tri[1], a.tri[2])
            });
        }
    })();
    const Sn = new Map;
    L.forEach((t, e)=>Sn.set(Cn(t.centroid), e));
    function qo(t, e, n) {
        return n === "tip" ? t.type === "tip" && t.owners[0] === e : t.type === "edge" ? t.owners.includes(e) : t.owners[0] === e;
    }
    function gt(t) {
        const e = En(ve[t.vertex]), n = L.map((o, s)=>s);
        for(let o = 0; o < L.length; o++){
            const s = L[o];
            if (!qo(s, t.vertex, t.layer)) continue;
            const r = Yo(s.centroid, e, t.deg), i = Sn.get(Cn(r));
            i !== void 0 && (n[i] = o);
        }
        return n;
    }
    function Ho() {
        const t = [];
        for(let e = 0; e < 4; e++)t.push({
            notation: mt[e],
            vertex: e,
            layer: "axial",
            deg: -120
        }), t.push({
            notation: `${mt[e]}'`,
            vertex: e,
            layer: "axial",
            deg: 120
        });
        return t;
    }
    function Xo() {
        const t = [];
        for(let e = 0; e < 4; e++){
            const n = mt[e].toLowerCase();
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
    function Ko(t) {
        return En(ve[t]);
    }
    function Zo(t) {
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
    function Mn(t) {
        const e = t.facelets;
        if (e.some((r)=>r === null)) return null;
        const n = {};
        for (const r of e)n[r] = (n[r] ?? 0) + 1;
        const o = Object.keys(n);
        if (o.length !== 4 || o.some((r)=>n[r] !== gn)) return null;
        const s = {};
        for(let r = 0; r < 4; r++){
            const i = new Set;
            if (L.forEach((c, u)=>{
                c.type === "axial" && c.owners[0] === r && i.add(e[u]);
            }), i.size !== 3) return null;
            const l = o.filter((c)=>!i.has(c));
            if (l.length !== 1) return null;
            s[l[0]] = r;
        }
        return new Set(Object.values(s)).size !== 4 ? null : s;
    }
    function kn(t) {
        const e = Mn(t);
        if (!e) return null;
        let n = "";
        for (const o of t.facelets)n += String(e[o]);
        return n;
    }
    const Ln = [
        [],
        [],
        [],
        []
    ], xn = [
        [],
        [],
        [],
        []
    ], $e = [];
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
            const o = gt({
                vertex: n,
                layer: "tip",
                deg: -120
            }), s = gt({
                vertex: n,
                layer: "axial",
                deg: -120
            }), r = L.map((l, c)=>({
                    fl: l,
                    i: c
                })).filter(({ fl: l })=>l.type === "tip" && l.owners[0] === n).map(({ i: l })=>l), i = L.map((l, c)=>({
                    fl: l,
                    i: c
                })).filter(({ fl: l })=>l.type === "axial" && l.owners[0] === n).map(({ i: l })=>l);
            Ln[n] = t(r, o), xn[n] = t(i, s);
        }
        const e = new Map;
        L.forEach((n, o)=>{
            if (n.type !== "edge") return;
            const s = [
                ...n.owners
            ].sort((r, i)=>r - i).join("-");
            (e.get(s) ?? e.set(s, []).get(s)).push(o);
        });
        for (const n of e.values()){
            const [o, s] = n;
            L[o].face <= L[s].face ? $e.push({
                a: o,
                b: s,
                faceA: L[o].face,
                faceB: L[s].face
            }) : $e.push({
                a: s,
                b: o,
                faceA: L[s].face,
                faceB: L[o].face
            });
        }
    })();
    const _e = $e.length, Jo = $e.map((t)=>[
            t.faceA,
            t.faceB
        ]);
    function Qo(t) {
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
            const i = Nt(xn[r], t);
            if (i < 0) return null;
            n[r] = i;
            const l = Nt(Ln[r], t);
            if (l < 0) return null;
            e[r] = l;
        }
        const o = new Array(_e).fill(-1), s = new Array(_e).fill(0);
        for(let r = 0; r < _e; r++){
            const i = $e[r], l = Number(t[i.a]), c = Number(t[i.b]);
            let u = -1, w = 0;
            for(let f = 0; f < _e; f++){
                const [a, p] = Jo[f];
                if (l === a && c === p) {
                    u = f, w = 0;
                    break;
                }
                if (l === p && c === a) {
                    u = f, w = 1;
                    break;
                }
            }
            if (u < 0) return null;
            o[r] = u, s[r] = w;
        }
        return {
            tips: e,
            axials: n,
            ep: o,
            eo: s
        };
    }
    function Nt(t, e) {
        const n = t.map((r)=>L[r].face), o = t.map((r)=>Number(e[r])), s = t.length;
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
    function es(t) {
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
    function ts(t) {
        const e = [], n = t.facelets.filter((l)=>l !== null).length;
        if (n < ge) return e.push({
            code: "incomplete",
            message: `Còn ${ge - n} ô chưa tô (cần đủ ${ge} ô).`
        }), {
            ok: !1,
            errors: e
        };
        if (!Mn(t)) return e.push({
            code: "color-count",
            message: `Cần đúng 4 màu, mỗi màu ${gn} ô và sắp xếp hợp lệ.`
        }), {
            ok: !1,
            errors: e
        };
        const s = kn(t), r = Qo(s);
        return r ? (new Set(r.ep).size !== _e && e.push({
            code: "impossible-pieces",
            message: "Có cạnh bị trùng — mỗi cạnh phải xuất hiện đúng một lần."
        }), es(r.ep) !== 0 && e.push({
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
    const rt = .86, ct = .012, ns = 921878, os = 2501427, ss = 6, Gt = .55, rs = 2.6, cs = 1.7;
    function is(t) {
        const n = L.find((s)=>s.face === t).centroid, o = Math.hypot(n[0], n[1], n[2]) || 1;
        return [
            n[0] / o,
            n[1] / o,
            n[2] / o
        ];
    }
    async function ls(t, e) {
        const n = await Vt(()=>import("./three.CuzN0wor.js"), []), o = new n.Scene, s = new n.PerspectiveCamera(42, 1, .1, 100);
        s.position.set(0, 0, 6.2), s.zoom = Gt;
        const r = new n.WebGLRenderer({
            antialias: !0,
            alpha: !0
        });
        r.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2)), t.appendChild(r.domElement);
        const i = new n.Group;
        i.rotation.x = -.32, i.rotation.y = .5, i.scale.setScalar(cs), o.add(i);
        const l = new n.MeshBasicMaterial({
            color: os,
            side: n.DoubleSide
        }), c = {};
        for (const d of Object.keys(e.palette))c[d] = new n.MeshBasicMaterial({
            color: new n.Color(e.palette[d]),
            side: n.DoubleSide
        });
        const u = (d)=>d ? c[d] : l, w = new n.MeshBasicMaterial({
            color: ns
        });
        for(let d = 0; d < 4; d++){
            const g = L.filter((v)=>v.face === d), E = new Set, C = [];
            for (const v of g)for (const m of v.corners){
                const k = m.map((M)=>M.toFixed(3)).join(",");
                E.has(k) || (E.add(k), C.push(m));
            }
            const I = C.sort((v, m)=>Math.hypot(m[0], m[1], m[2]) - Math.hypot(v[0], v[1], v[2])).slice(0, 3), U = new n.BufferGeometry;
            U.setAttribute("position", new n.Float32BufferAttribute(I.flat(), 3)), U.setIndex([
                0,
                1,
                2
            ]);
            const h = new n.Mesh(U, w);
            i.add(h);
        }
        let f = [];
        function a(d) {
            const g = is(d.face), E = d.centroid, C = [];
            for (const U of d.corners){
                const h = [
                    E[0] + (U[0] - E[0]) * rt + g[0] * ct,
                    E[1] + (U[1] - E[1]) * rt + g[1] * ct,
                    E[2] + (U[2] - E[2]) * rt + g[2] * ct
                ];
                C.push(h[0], h[1], h[2]);
            }
            const I = new n.BufferGeometry;
            return I.setAttribute("position", new n.Float32BufferAttribute(C, 3)), I.setIndex([
                0,
                1,
                2
            ]), I;
        }
        function p() {
            for (const d of f)i.remove(d.mesh), d.mesh.geometry.dispose();
            f = [];
        }
        function x(d) {
            p();
            for(let g = 0; g < ge; g++){
                const E = new n.Mesh(a(L[g]), u(d[g]));
                E.userData.pos = g, i.add(E), f.push({
                    mesh: E,
                    pos: g
                });
            }
            X();
        }
        function R(d, g) {
            const E = f.find((C)=>C.pos === d);
            E && (E.mesh.material = u(g), X());
        }
        function $(d) {
            for (const g of Object.keys(d))c[g]?.color.set(new n.Color(d[g]));
            X();
        }
        function ue(d) {
            const g = d > 0 ? 1.15 : .8695652173913044;
            s.zoom = Math.min(rs, Math.max(Gt, s.zoom * g)), s.updateProjectionMatrix(), X();
        }
        let de = !1;
        function ee(d) {
            de = d;
        }
        const Ie = new Map, Ee = new Map;
        for (const d of [
            ...Ho(),
            ...Xo()
        ]){
            const g = gt(d);
            Ie.set(d.notation, g);
            const E = new Array(g.length);
            for(let C = 0; C < g.length; C++)E[g[C]] = C;
            Ee.set(d.notation, E);
        }
        let H = !1;
        function tt(d, g) {
            if (H) return Promise.resolve();
            const E = Zo(d.notation), C = Ee.get(d.notation);
            if (!E || !C) return Promise.resolve();
            H = !0;
            const I = Ko(E.vertex), U = new n.Vector3(I[0], I[1], I[2]), h = E.deg * Math.PI / 180, v = f.filter((_)=>C[_.pos] !== _.pos), m = new n.Group;
            i.add(m);
            for (const _ of v)m.attach(_.mesh);
            const k = Math.max(60, g), M = performance.now();
            return new Promise((_)=>{
                const F = (A)=>{
                    const W = Math.min(1, (A - M) / k), Fe = W < .5 ? 2 * W * W : 1 - Math.pow(-2 * W + 2, 2) / 2;
                    if (m.quaternion.setFromAxisAngle(U, h * Fe), r.render(o, s), W < 1) {
                        requestAnimationFrame(F);
                        return;
                    }
                    for (const O of v)i.attach(O.mesh), O.pos = C[O.pos], O.mesh.userData.pos = O.pos;
                    i.remove(m), H = !1, r.render(o, s), _();
                };
                requestAnimationFrame(F);
            });
        }
        let ye = !1;
        function X() {
            ye || (ye = !0, requestAnimationFrame(()=>{
                ye = !1, r.render(o, s);
            }));
        }
        function De() {
            const d = t.clientWidth || 1, g = t.clientHeight || 1;
            r.setSize(d, g, !1), s.aspect = d / g, s.updateProjectionMatrix(), X();
        }
        const be = new ResizeObserver(De);
        be.observe(t), De();
        const Te = new n.Raycaster, Ce = new n.Vector2, Se = new n.Vector3(0, 1, 0), K = new n.Vector3(1, 0, 0);
        let te = !1, ne = !1, Me = 0, fe = 0, ke = 0, Le = 0;
        function pe(d) {
            const g = r.domElement.getBoundingClientRect();
            Ce.x = (d.clientX - g.left) / g.width * 2 - 1, Ce.y = -((d.clientY - g.top) / g.height) * 2 + 1, o.updateMatrixWorld(!0), Te.setFromCamera(Ce, s);
            const E = Te.intersectObjects(f.map((C)=>C.mesh), !1);
            return E.length ? E[0].object : null;
        }
        function oe(d) {
            te = !0, ne = !1, Me = ke = d.clientX, fe = Le = d.clientY, r.domElement.setPointerCapture(d.pointerId);
        }
        function xe(d) {
            if (te) {
                if (!ne) {
                    if (Math.hypot(d.clientX - Me, d.clientY - fe) < ss) return;
                    ne = !0;
                }
                i.rotateOnWorldAxis(Se, (d.clientX - ke) * .008), i.rotateOnWorldAxis(K, (d.clientY - Le) * .008), ke = d.clientX, Le = d.clientY, X();
            }
        }
        function se(d) {
            const g = te && !ne;
            te = !1;
            try {
                r.domElement.releasePointerCapture(d.pointerId);
            } catch  {}
            if (g && de && !H && e.onPaint) {
                const E = pe(d);
                E && e.onPaint(E.userData.pos);
            }
        }
        function he(d) {
            d.preventDefault(), ue(d.deltaY < 0 ? 1 : -1);
        }
        r.domElement.addEventListener("pointerdown", oe), r.domElement.addEventListener("pointermove", xe), r.domElement.addEventListener("pointerup", se), r.domElement.addEventListener("pointercancel", se), r.domElement.addEventListener("wheel", he, {
            passive: !1
        });
        function Pe() {
            be.disconnect(), r.domElement.removeEventListener("pointerdown", oe), r.domElement.removeEventListener("pointermove", xe), r.domElement.removeEventListener("pointerup", se), r.domElement.removeEventListener("pointercancel", se), r.domElement.removeEventListener("wheel", he), p(), l.dispose(), w.dispose();
            for (const d of Object.keys(c))c[d].dispose();
            r.dispose(), r.domElement.parentNode === t && t.removeChild(r.domElement);
        }
        return {
            loadState: x,
            updateSticker: R,
            setPalette: $,
            zoom: ue,
            setPaintEnabled: ee,
            animateMove: tt,
            isAnimating: ()=>H,
            dispose: Pe
        };
    }
    const as = [
        "c1",
        "c2",
        "c3",
        "c4"
    ], vt = At(()=>new Worker(new URL("/_astro/pyraminx.worker-DXAdWFLc.js", import.meta.url), {
            type: "module"
        }));
    function Pn(t) {
        const e = t[0].toUpperCase(), n = t.endsWith("'") ? "'" : "";
        return {
            face: e,
            suffix: n,
            notation: t
        };
    }
    const us = {
        id: "fast",
        label: "Giải nhanh (tối ưu)",
        available: !0,
        async solve (t) {
            const e = kn(t);
            if (!e) throw new Error("Trạng thái khối chưa hợp lệ.");
            const n = await vt.solve(e), [o, s] = n.split("|"), r = (w)=>w.split(/\s+/).filter(Boolean).map(Pn), i = r(o ?? ""), l = r(s ?? ""), c = [];
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
    function ds() {
        return {
            facelets: new Array(ge).fill(null)
        };
    }
    function fs() {
        return {
            facelets: L.map((e)=>`c${e.face + 1}`)
        };
    }
    const ps = {
        id: "pyraminx",
        label: "Rubik hình chóp",
        shortLabel: "Pyraminx",
        description: "Tứ diện 4 mặt tam giác, mỗi mặt 9 ô.",
        illustration: "/images/rubik/pyraminx.svg",
        enabled: !0,
        colorCount: 4,
        faceletCount: ge,
        colorIds: [
            ...as
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
        createInitialState: ds,
        createSolvedState: fs,
        createRenderer (t, e) {
            return ls(t, e);
        },
        validate: ts,
        solverModes: ()=>[
                us
            ],
        invertMove: (t)=>{
            const e = t.notation.endsWith("'") ? t.notation.slice(0, -1) : `${t.notation}'`;
            return Pn(e);
        },
        warmUp: ()=>vt.warmUp(),
        isSolverReady: ()=>vt.isReady()
    }, Fn = [
        Eo,
        _o,
        Wo,
        ps
    ], hs = new Map(Fn.map((t)=>[
            t.id,
            t
        ]));
    function ms() {
        return Fn;
    }
    function gs(t) {
        return hs.get(t);
    }
    class vs {
        constructor(e, n){
            this.container = e, this.onPick = n, this.build();
        }
        container;
        onPick;
        build() {
            this.container.innerHTML = "";
            for (const e of ms()){
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
    class ws {
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
            const e = to(this.result.moves);
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
    const b = (t)=>document.getElementById(t);
    let Ge = null, S = null, j, q = {}, Ve = null, wt = null, V = null, Rn = null, Et = !1, y = null, we = "paint", N = [], P = 0, yt = [], z = !1, le = null, bt = null, Ct = null, St = null, We = null, Ye = null, qe = null, Mt = null, kt = null, He = null, Xe = null, Lt = null, Ke = null;
    function J(t) {
        Ge && (Ge.dataset.step = t);
    }
    function Es(t) {
        return t.faceletCount / t.colorCount;
    }
    function Qe() {
        if (!Ve || !S) return;
        const t = Kt(j);
        for (const e of S.colorIds)Ve.setCount(e, t[e]);
    }
    function et() {
        if (!S) return;
        const t = S.validate(j);
        if (Rn = t, le) if (le.classList.remove("rs-validation--success", "rs-validation--error", "rs-validation--empty"), t.ok) le.classList.add("rs-validation--success"), le.innerHTML = '<p class="rs-validation__title">✓ Trạng thái hợp lệ.</p>';
        else {
            le.classList.add("rs-validation--error");
            const e = t.errors.map((n)=>`<li>${n.message}</li>`).join("");
            le.innerHTML = `<p class="rs-validation__title">Chưa thể giải:</p><ul class="rs-validation__list">${e}</ul>`;
        }
        V?.setValid(t.ok), t.ok && !Et && (Et = !0, S.warmUp?.());
    }
    function ys(t) {
        if (we !== "paint") return;
        const e = Ve?.getSelection() ?? S?.colorIds[0];
        e && (Un(j, t, e), y?.updateSticker(t, e), Qe(), et());
    }
    function _n() {
        const t = Ct ? Number(Ct.value) : 6;
        return Math.max(100, 1300 - t * 120);
    }
    function Q(t) {
        St && (St.hidden = !t), We && (We.disabled = !t || P <= 0), Ye && (Ye.disabled = !t || P >= N.length), qe && (qe.disabled = !t || N.length === 0), He && (He.disabled = !t);
    }
    function ae() {
        Mt && (Mt.hidden = z), kt && (kt.hidden = !z);
    }
    async function An() {
        !y || P >= N.length || y.isAnimating() || (await y.animateMove(N[P], _n()), P++, V?.setProgress(P), Q(!0));
    }
    async function bs() {
        !y || !S || P <= 0 || y.isAnimating() || (await y.animateMove(S.invertMove(N[P - 1]), _n()), P--, V?.setProgress(P), Q(!0));
    }
    function Cs(t) {
        return new Promise((e)=>window.setTimeout(e, t));
    }
    async function Ss() {
        if (z) {
            z = !1, ae();
            return;
        }
        for(P >= N.length && (P = 0), z = !0, ae(); z && P < N.length && (await An(), !!z);)await Cs(140);
        z = !1, ae();
    }
    function Ms() {
        y && (z = !1, ae(), y.loadState(yt.slice()), P = 0, V?.setProgress(0), Q(!0));
    }
    function ks(t) {
        we = "solution", N = t.moves, P = 0, yt = j.facelets.slice(), y?.setPaintEnabled(!1), y?.loadState(yt.slice()), V?.setProgress(0), J("solve"), Q(!0);
    }
    async function Ls() {
        !bt || !S || (y?.dispose(), y = await S.createRenderer(bt, {
            palette: q,
            onPaint: ys
        }), y.loadState(j.facelets.slice()), y.setPaintEnabled(!1));
    }
    async function xs(t) {
        const e = gs(t);
        if (!e || !e.enabled) return;
        S = e, Et = !1, j = e.createInitialState(), we = "paint", N = [], P = 0;
        const n = await Wn(t);
        q = On(e, n), V?.setModes(e.solverModes(), e.isSolverReady), V?.reset(), Ke && (Ke.hidden = !e.createSolvedState), await Ls(), await Ps(e, n), Q(!1), J("colors");
    }
    function On(t, e) {
        const n = {}, o = e && e.length === t.colorCount;
        return t.colorIds.forEach((s, r)=>{
            n[s] = o ? e[r] : t.defaultPalette[s];
        }), n;
    }
    async function Ps(t, e) {
        const n = b("rs-colorsetup");
        if (!n) return;
        const o = await Yn(Object.values(t.defaultPalette));
        wt = new Xn(n, {
            colorIds: t.colorIds,
            labels: t.colorLabels,
            initial: On(t, e),
            pool: o
        }, {
            onChange: (s, r)=>{
                q = s, y?.setPalette(q), Lt && (Lt.textContent = r ? "" : `Cần ${t.colorCount} màu khác nhau để phân biệt các mặt.`), Xe && (Xe.disabled = !r);
            },
            onAddColor: (s)=>{
                qn(s);
            }
        });
    }
    function Fs() {
        if (!S || !wt || (q = wt.getPalette(), !(new Set(Object.values(q)).size === S.colorCount))) return;
        Hn(S.id, S.colorIds.map((n)=>q[n]));
        const e = b("rs-palette");
        e && (Ve = new Gn(e, {
            colorIds: S.colorIds,
            palette: q,
            labels: S.colorLabels,
            perColor: Es(S)
        })), y?.setPalette(q), y?.setPaintEnabled(!0), we = "paint", Qe(), et(), Q(!1), J("paint");
    }
    function Bn() {
        S && (j = S.createInitialState(), we = "paint", N = [], P = 0, z = !1, ae(), V?.reset(), y?.loadState(j.facelets.slice()), Qe(), et(), Q(!1));
    }
    function Rs() {
        Bn(), y?.setPaintEnabled(!0), J("paint");
    }
    function _s() {
        Bn(), y?.setPaintEnabled(!1), J("colors");
    }
    function As() {
        z = !1, ae(), y?.dispose(), y = null, S = null, J("pick");
    }
    function Os() {
        S?.createSolvedState && (j = S.createSolvedState(), we = "paint", N = [], P = 0, z = !1, ae(), V?.reset(), y?.setPaintEnabled(!0), y?.loadState(j.facelets.slice()), Qe(), et(), Q(!1), J("paint"));
    }
    function Bs() {
        if (Ge = b("rs-app"), !Ge) return;
        le = b("rs-validation"), bt = b("rs-viewer"), Ct = b("rs-speed"), St = b("rs-playback"), We = b("rs-prev"), Ye = b("rs-next"), qe = b("rs-auto"), Mt = b("rs-auto-play"), kt = b("rs-auto-pause"), He = b("rs-reset-view"), Xe = b("rs-colors-continue"), Lt = b("rs-colors-msg"), Ke = b("rs-example");
        const t = $s();
        t && (V = new ws(t, {
            getState: ()=>j,
            isValid: ()=>Rn?.ok ?? !1,
            onSolved: ks
        }));
        const e = b("rs-pick");
        e && new vs(e, (n)=>{
            xs(n);
        }), Xe?.addEventListener("click", Fs), b("rs-recolor")?.addEventListener("click", _s), b("rs-change-puzzle")?.addEventListener("click", As), b("rs-clear")?.addEventListener("click", Rs), Ke?.addEventListener("click", Os), We?.addEventListener("click", ()=>{
            bs();
        }), Ye?.addEventListener("click", ()=>{
            An();
        }), qe?.addEventListener("click", ()=>{
            Ss();
        }), He?.addEventListener("click", Ms), b("rs-zoom-in")?.addEventListener("click", ()=>y?.zoom(1)), b("rs-zoom-out")?.addEventListener("click", ()=>y?.zoom(-1)), window.addEventListener("pagehide", ()=>{
            y?.dispose(), y = null;
        }), J("pick");
    }
    function $s() {
        const t = b("rs-mode"), e = b("rs-solve"), n = b("rs-solver-status"), o = b("rs-solution"), s = b("rs-moves"), r = b("rs-copy");
        return !t || !e || !n || !o || !s || !r ? null : {
            modeSelect: t,
            solveBtn: e,
            status: n,
            solutionWrap: o,
            movesEl: s,
            copyBtn: r
        };
    }
    document.addEventListener("DOMContentLoaded", ()=>Bs());
})();
