import { _ as me } from "./preload-helper.CVfkMyKi.js";
import { F as J, __tla as __tla_0 } from "./rubik-solver.astro_astro_type_script_index_0_lang.CmV3UYWB.js";
let xe;
let __tla = Promise.all([
    (()=>{
        try {
            return __tla_0;
        } catch  {}
    })()
]).then(async ()=>{
    const A = {
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
    }, I = 1, C = .94, Q = .82, pe = .001, we = 2501427, Ee = 921878, he = 6, ve = 4;
    function Me(u, m) {
        const { n: t, u: p, v: d } = A[u], o = m % 3 - 1, s = Math.floor(m / 3) - 1;
        return [
            t[0] + p[0] * o + d[0] * s,
            t[1] + p[1] * o + d[1] * s,
            t[2] + p[2] * o + d[2] * s
        ];
    }
    function Z(u, m, t) {
        return `${u},${m},${t}`;
    }
    xe = async function(u, m) {
        const t = await me(()=>import("./three.CuzN0wor.js"), []), p = new t.Scene, d = new t.PerspectiveCamera(42, 1, .1, 100);
        d.position.set(0, 0, 6.2);
        const o = new t.WebGLRenderer({
            antialias: !0,
            alpha: !0
        });
        o.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2)), u.appendChild(o.domElement);
        const s = new t.Group;
        s.rotation.x = -.42, s.rotation.y = .62, p.add(s);
        const S = new t.MeshBasicMaterial({
            color: Ee
        }), Y = new t.MeshBasicMaterial({
            color: we
        }), w = {};
        for (const e of Object.keys(m.palette))w[e] = new t.MeshBasicMaterial({
            color: new t.Color(m.palette[e])
        });
        const B = new t.BoxGeometry(C, C, C), V = new t.PlaneGeometry(Q, Q), ee = new t.Vector3(0, 0, 1);
        let y = [], O = [];
        const L = new Map;
        let E = !1, X = !1;
        function z(e) {
            return e ? w[e] : Y;
        }
        function j() {
            for (const e of y)s.remove(e.group);
            y = [], O = [], L.clear();
        }
        function te(e) {
            j();
            const r = new Map;
            for(let n = -1; n <= 1; n++)for(let l = -1; l <= 1; l++)for(let c = -1; c <= 1; c++){
                if (n === 0 && l === 0 && c === 0) continue;
                const f = new t.Group;
                f.position.set(n * I, l * I, c * I), f.add(new t.Mesh(B, S));
                const i = {
                    group: f,
                    coord: new t.Vector3(n, l, c)
                };
                s.add(f), y.push(i), r.set(Z(n, l, c), i);
            }
            for(let n = 0; n < J.length; n++){
                const l = J[n], c = A[l], f = new t.Vector3(c.n[0], c.n[1], c.n[2]);
                for(let i = 0; i < 9; i++){
                    const v = n * 9 + i, [G, M, R] = Me(l, i), g = r.get(Z(G, M, R));
                    if (!g) continue;
                    const a = new t.Mesh(V, z(e[v]));
                    a.position.copy(f).multiplyScalar(C / 2 + pe), a.quaternion.setFromUnitVectors(ee, f), a.userData.faceletIndex = v, a.userData.paintable = i !== ve, g.group.add(a), O.push(a), L.set(v, a);
                }
            }
            h();
        }
        function ne(e, r) {
            const n = L.get(e);
            n && (n.material = z(r), h());
        }
        function oe(e) {
            X = e;
        }
        function re(e) {
            for (const r of Object.keys(e))w[r]?.color.set(new t.Color(e[r]));
            h();
        }
        function se(e) {
            const r = A[e].n;
            return y.filter((n)=>Math.round(n.coord.x) * r[0] + Math.round(n.coord.y) * r[1] + Math.round(n.coord.z) * r[2] === 1);
        }
        function ce(e) {
            return e.suffix === "'" ? Math.PI / 2 : e.suffix === "2" ? -Math.PI : -Math.PI / 2;
        }
        function ie(e, r) {
            if (E) return Promise.resolve();
            E = !0;
            const n = A[e.face], l = new t.Vector3(n.n[0], n.n[1], n.n[2]), c = ce(e), f = se(e.face), i = new t.Group;
            s.add(i);
            for (const M of f)i.attach(M.group);
            const v = Math.max(60, r), G = performance.now();
            return new Promise((M)=>{
                const R = (g)=>{
                    const a = Math.min(1, (g - G) / v), fe = a < .5 ? 2 * a * a : 1 - Math.pow(-2 * a + 2, 2) / 2;
                    if (i.quaternion.setFromAxisAngle(l, c * fe), o.render(p, d), a < 1) {
                        requestAnimationFrame(R);
                        return;
                    }
                    for (const K of f)s.attach(K.group), K.coord.applyAxisAngle(l, c).round();
                    s.remove(i), E = !1, o.render(p, d), M();
                };
                requestAnimationFrame(R);
            });
        }
        let F = !1;
        function h() {
            F || (F = !0, requestAnimationFrame(()=>{
                F = !1, o.render(p, d);
            }));
        }
        function q() {
            const e = u.clientWidth || 1, r = u.clientHeight || 1;
            o.setSize(e, r, !1), d.aspect = e / r, d.updateProjectionMatrix(), h();
        }
        const T = new ResizeObserver(q);
        T.observe(u), q();
        const W = new t.Raycaster, _ = new t.Vector2, ae = new t.Vector3(0, 1, 0), le = new t.Vector3(1, 0, 0);
        let b = !1, x = !1, H = 0, N = 0, k = 0, D = 0;
        function de(e) {
            const r = o.domElement.getBoundingClientRect();
            _.x = (e.clientX - r.left) / r.width * 2 - 1, _.y = -((e.clientY - r.top) / r.height) * 2 + 1, p.updateMatrixWorld(!0), W.setFromCamera(_, d);
            const n = W.intersectObjects(O, !1);
            return n.length ? n[0].object : null;
        }
        function U(e) {
            b = !0, x = !1, H = k = e.clientX, N = D = e.clientY, o.domElement.setPointerCapture(e.pointerId);
        }
        function $(e) {
            if (b) {
                if (!x) {
                    if (Math.hypot(e.clientX - H, e.clientY - N) < he) return;
                    x = !0;
                }
                s.rotateOnWorldAxis(ae, (e.clientX - k) * .008), s.rotateOnWorldAxis(le, (e.clientY - D) * .008), k = e.clientX, D = e.clientY, h();
            }
        }
        function P(e) {
            const r = b && !x;
            b = !1;
            try {
                o.domElement.releasePointerCapture(e.pointerId);
            } catch  {}
            if (r && X && !E && m.onPaint) {
                const n = de(e);
                n && n.userData.paintable && m.onPaint(n.userData.faceletIndex);
            }
        }
        o.domElement.addEventListener("pointerdown", U), o.domElement.addEventListener("pointermove", $), o.domElement.addEventListener("pointerup", P), o.domElement.addEventListener("pointercancel", P);
        function ue() {
            T.disconnect(), o.domElement.removeEventListener("pointerdown", U), o.domElement.removeEventListener("pointermove", $), o.domElement.removeEventListener("pointerup", P), o.domElement.removeEventListener("pointercancel", P), j(), B.dispose(), V.dispose(), S.dispose(), Y.dispose();
            for (const e of Object.keys(w))w[e].dispose();
            o.dispose(), o.domElement.parentNode === u && u.removeChild(o.domElement);
        }
        return {
            loadState: te,
            updateSticker: ne,
            setPalette: re,
            setPaintEnabled: oe,
            animateMove: ie,
            isAnimating: ()=>E,
            dispose: ue
        };
    };
});
export { xe as createRubikRenderer, __tla };
