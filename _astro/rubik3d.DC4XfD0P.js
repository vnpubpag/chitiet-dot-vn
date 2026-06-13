import { _ as he } from "./preload-helper.CVfkMyKi.js";
import { F as Q, __tla as __tla_0 } from "./rubik-solver.astro_astro_type_script_index_0_lang.CKQjoQAz.js";
let ge;
let __tla = Promise.all([
    (()=>{
        try {
            return __tla_0;
        } catch  {}
    })()
]).then(async ()=>{
    const C = {
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
    }, Y = 1, g = .94, ee = .82, Ee = .001, Me = 2501427, ve = 921878, ye = 6, xe = 4, te = .6, be = 2.6;
    function Pe(u, m) {
        const { n: t, u: p, v: s } = C[u], o = m % 3 - 1, c = Math.floor(m / 3) - 1;
        return [
            t[0] + p[0] * o + s[0] * c,
            t[1] + p[1] * o + s[1] * c,
            t[2] + p[2] * o + s[2] * c
        ];
    }
    function ne(u, m, t) {
        return `${u},${m},${t}`;
    }
    ge = async function(u, m) {
        const t = await he(()=>import("./three.CuzN0wor.js"), []), p = new t.Scene, s = new t.PerspectiveCamera(42, 1, .1, 100);
        s.position.set(0, 0, 6.2), s.zoom = te;
        const o = new t.WebGLRenderer({
            antialias: !0,
            alpha: !0
        });
        o.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2)), u.appendChild(o.domElement);
        const c = new t.Group;
        c.rotation.x = -.42, c.rotation.y = .62, p.add(c);
        const z = new t.MeshBasicMaterial({
            color: ve
        }), G = new t.MeshBasicMaterial({
            color: Me
        }), h = {};
        for (const e of Object.keys(m.palette))h[e] = new t.MeshBasicMaterial({
            color: new t.Color(m.palette[e])
        });
        const S = new t.BoxGeometry(g, g, g), B = new t.PlaneGeometry(ee, ee), oe = new t.Vector3(0, 0, 1);
        let y = [], A = [];
        const L = new Map;
        let E = !1, V = !1;
        function X(e) {
            return e ? h[e] : G;
        }
        function j() {
            for (const e of y)c.remove(e.group);
            y = [], A = [], L.clear();
        }
        function re(e) {
            j();
            const r = new Map;
            for(let n = -1; n <= 1; n++)for(let d = -1; d <= 1; d++)for(let i = -1; i <= 1; i++){
                if (n === 0 && d === 0 && i === 0) continue;
                const f = new t.Group;
                f.position.set(n * Y, d * Y, i * Y), f.add(new t.Mesh(S, z));
                const a = {
                    group: f,
                    coord: new t.Vector3(n, d, i)
                };
                c.add(f), y.push(a), r.set(ne(n, d, i), a);
            }
            for(let n = 0; n < Q.length; n++){
                const d = Q[n], i = C[d], f = new t.Vector3(i.n[0], i.n[1], i.n[2]);
                for(let a = 0; a < 9; a++){
                    const M = n * 9 + a, [I, v, O] = Pe(d, a), R = r.get(ne(I, v, O));
                    if (!R) continue;
                    const l = new t.Mesh(B, X(e[M]));
                    l.position.copy(f).multiplyScalar(g / 2 + Ee), l.quaternion.setFromUnitVectors(oe, f), l.userData.faceletIndex = M, l.userData.paintable = a !== xe, R.group.add(l), A.push(l), L.set(M, l);
                }
            }
            w();
        }
        function se(e, r) {
            const n = L.get(e);
            n && (n.material = X(r), w());
        }
        function ce(e) {
            V = e;
        }
        function ie(e) {
            for (const r of Object.keys(e))h[r]?.color.set(new t.Color(e[r]));
            w();
        }
        function q(e) {
            const r = e > 0 ? 1.15 : .8695652173913044;
            s.zoom = Math.min(be, Math.max(te, s.zoom * r)), s.updateProjectionMatrix(), w();
        }
        function ae(e) {
            const r = C[e].n;
            return y.filter((n)=>Math.round(n.coord.x) * r[0] + Math.round(n.coord.y) * r[1] + Math.round(n.coord.z) * r[2] === 1);
        }
        function le(e) {
            return e.suffix === "'" ? Math.PI / 2 : e.suffix === "2" ? -Math.PI : -Math.PI / 2;
        }
        function de(e, r) {
            if (E) return Promise.resolve();
            E = !0;
            const n = C[e.face], d = new t.Vector3(n.n[0], n.n[1], n.n[2]), i = le(e), f = ae(e.face), a = new t.Group;
            c.add(a);
            for (const v of f)a.attach(v.group);
            const M = Math.max(60, r), I = performance.now();
            return new Promise((v)=>{
                const O = (R)=>{
                    const l = Math.min(1, (R - I) / M), we = l < .5 ? 2 * l * l : 1 - Math.pow(-2 * l + 2, 2) / 2;
                    if (a.quaternion.setFromAxisAngle(d, i * we), o.render(p, s), l < 1) {
                        requestAnimationFrame(O);
                        return;
                    }
                    for (const J of f)c.attach(J.group), J.coord.applyAxisAngle(d, i).round();
                    c.remove(a), E = !1, o.render(p, s), v();
                };
                requestAnimationFrame(O);
            });
        }
        let _ = !1;
        function w() {
            _ || (_ = !0, requestAnimationFrame(()=>{
                _ = !1, o.render(p, s);
            }));
        }
        function T() {
            const e = u.clientWidth || 1, r = u.clientHeight || 1;
            o.setSize(e, r, !1), s.aspect = e / r, s.updateProjectionMatrix(), w();
        }
        const W = new ResizeObserver(T);
        W.observe(u), T();
        const H = new t.Raycaster, F = new t.Vector2, ue = new t.Vector3(0, 1, 0), fe = new t.Vector3(1, 0, 0);
        let x = !1, b = !1, N = 0, U = 0, k = 0, D = 0;
        function me(e) {
            const r = o.domElement.getBoundingClientRect();
            F.x = (e.clientX - r.left) / r.width * 2 - 1, F.y = -((e.clientY - r.top) / r.height) * 2 + 1, p.updateMatrixWorld(!0), H.setFromCamera(F, s);
            const n = H.intersectObjects(A, !1);
            return n.length ? n[0].object : null;
        }
        function $(e) {
            x = !0, b = !1, N = k = e.clientX, U = D = e.clientY, o.domElement.setPointerCapture(e.pointerId);
        }
        function K(e) {
            if (x) {
                if (!b) {
                    if (Math.hypot(e.clientX - N, e.clientY - U) < ye) return;
                    b = !0;
                }
                c.rotateOnWorldAxis(ue, (e.clientX - k) * .008), c.rotateOnWorldAxis(fe, (e.clientY - D) * .008), k = e.clientX, D = e.clientY, w();
            }
        }
        function P(e) {
            const r = x && !b;
            x = !1;
            try {
                o.domElement.releasePointerCapture(e.pointerId);
            } catch  {}
            if (r && V && !E && m.onPaint) {
                const n = me(e);
                n && n.userData.paintable && m.onPaint(n.userData.faceletIndex);
            }
        }
        function Z(e) {
            e.preventDefault(), q(e.deltaY < 0 ? 1 : -1);
        }
        o.domElement.addEventListener("pointerdown", $), o.domElement.addEventListener("pointermove", K), o.domElement.addEventListener("pointerup", P), o.domElement.addEventListener("pointercancel", P), o.domElement.addEventListener("wheel", Z, {
            passive: !1
        });
        function pe() {
            W.disconnect(), o.domElement.removeEventListener("pointerdown", $), o.domElement.removeEventListener("pointermove", K), o.domElement.removeEventListener("pointerup", P), o.domElement.removeEventListener("pointercancel", P), o.domElement.removeEventListener("wheel", Z), j(), S.dispose(), B.dispose(), z.dispose(), G.dispose();
            for (const e of Object.keys(h))h[e].dispose();
            o.dispose(), o.domElement.parentNode === u && u.removeChild(o.domElement);
        }
        return {
            loadState: re,
            updateSticker: se,
            setPalette: ie,
            zoom: q,
            setPaintEnabled: ce,
            animateMove: de,
            isAnimating: ()=>E,
            dispose: pe
        };
    };
});
export { ge as createRubikRenderer, __tla };
