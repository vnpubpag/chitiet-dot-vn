import { _ as we } from "./preload-helper.CVfkMyKi.js";
import { F as Z, __tla as __tla_0 } from "./rubik-solver.astro_astro_type_script_index_0_lang.B86qJEOm.js";
let Re;
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
    }, G = 1, C = .94, ee = .82, he = .001, Ee = 2501427, ve = 921878, Me = 6, ye = 4;
    function xe(u, m) {
        const { n: t, u: p, v: s } = A[u], o = m % 3 - 1, c = Math.floor(m / 3) - 1;
        return [
            t[0] + p[0] * o + s[0] * c,
            t[1] + p[1] * o + s[1] * c,
            t[2] + p[2] * o + s[2] * c
        ];
    }
    function te(u, m, t) {
        return `${u},${m},${t}`;
    }
    Re = async function(u, m) {
        const t = await we(()=>import("./three.CuzN0wor.js"), []), p = new t.Scene, s = new t.PerspectiveCamera(42, 1, .1, 100);
        s.position.set(0, 0, 6.2);
        const o = new t.WebGLRenderer({
            antialias: !0,
            alpha: !0
        });
        o.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2)), u.appendChild(o.domElement);
        const c = new t.Group;
        c.rotation.x = -.42, c.rotation.y = .62, p.add(c);
        const I = new t.MeshBasicMaterial({
            color: ve
        }), S = new t.MeshBasicMaterial({
            color: Ee
        }), h = {};
        for (const e of Object.keys(m.palette))h[e] = new t.MeshBasicMaterial({
            color: new t.Color(m.palette[e])
        });
        const z = new t.BoxGeometry(C, C, C), B = new t.PlaneGeometry(ee, ee), ne = new t.Vector3(0, 0, 1);
        let y = [], L = [];
        const O = new Map;
        let E = !1, V = !1;
        function X(e) {
            return e ? h[e] : S;
        }
        function j() {
            for (const e of y)c.remove(e.group);
            y = [], L = [], O.clear();
        }
        function oe(e) {
            j();
            const r = new Map;
            for(let n = -1; n <= 1; n++)for(let d = -1; d <= 1; d++)for(let i = -1; i <= 1; i++){
                if (n === 0 && d === 0 && i === 0) continue;
                const f = new t.Group;
                f.position.set(n * G, d * G, i * G), f.add(new t.Mesh(z, I));
                const a = {
                    group: f,
                    coord: new t.Vector3(n, d, i)
                };
                c.add(f), y.push(a), r.set(te(n, d, i), a);
            }
            for(let n = 0; n < Z.length; n++){
                const d = Z[n], i = A[d], f = new t.Vector3(i.n[0], i.n[1], i.n[2]);
                for(let a = 0; a < 9; a++){
                    const v = n * 9 + a, [Y, M, R] = xe(d, a), g = r.get(te(Y, M, R));
                    if (!g) continue;
                    const l = new t.Mesh(B, X(e[v]));
                    l.position.copy(f).multiplyScalar(C / 2 + he), l.quaternion.setFromUnitVectors(ne, f), l.userData.faceletIndex = v, l.userData.paintable = a !== ye, g.group.add(l), L.push(l), O.set(v, l);
                }
            }
            w();
        }
        function re(e, r) {
            const n = O.get(e);
            n && (n.material = X(r), w());
        }
        function se(e) {
            V = e;
        }
        function ce(e) {
            for (const r of Object.keys(e))h[r]?.color.set(new t.Color(e[r]));
            w();
        }
        function q(e) {
            const r = e > 0 ? 1.15 : .8695652173913044;
            s.zoom = Math.min(2.6, Math.max(.6, s.zoom * r)), s.updateProjectionMatrix(), w();
        }
        function ie(e) {
            const r = A[e].n;
            return y.filter((n)=>Math.round(n.coord.x) * r[0] + Math.round(n.coord.y) * r[1] + Math.round(n.coord.z) * r[2] === 1);
        }
        function ae(e) {
            return e.suffix === "'" ? Math.PI / 2 : e.suffix === "2" ? -Math.PI : -Math.PI / 2;
        }
        function le(e, r) {
            if (E) return Promise.resolve();
            E = !0;
            const n = A[e.face], d = new t.Vector3(n.n[0], n.n[1], n.n[2]), i = ae(e), f = ie(e.face), a = new t.Group;
            c.add(a);
            for (const M of f)a.attach(M.group);
            const v = Math.max(60, r), Y = performance.now();
            return new Promise((M)=>{
                const R = (g)=>{
                    const l = Math.min(1, (g - Y) / v), pe = l < .5 ? 2 * l * l : 1 - Math.pow(-2 * l + 2, 2) / 2;
                    if (a.quaternion.setFromAxisAngle(d, i * pe), o.render(p, s), l < 1) {
                        requestAnimationFrame(R);
                        return;
                    }
                    for (const Q of f)c.attach(Q.group), Q.coord.applyAxisAngle(d, i).round();
                    c.remove(a), E = !1, o.render(p, s), M();
                };
                requestAnimationFrame(R);
            });
        }
        let F = !1;
        function w() {
            F || (F = !0, requestAnimationFrame(()=>{
                F = !1, o.render(p, s);
            }));
        }
        function T() {
            const e = u.clientWidth || 1, r = u.clientHeight || 1;
            o.setSize(e, r, !1), s.aspect = e / r, s.updateProjectionMatrix(), w();
        }
        const W = new ResizeObserver(T);
        W.observe(u), T();
        const H = new t.Raycaster, _ = new t.Vector2, de = new t.Vector3(0, 1, 0), ue = new t.Vector3(1, 0, 0);
        let x = !1, b = !1, N = 0, U = 0, k = 0, D = 0;
        function fe(e) {
            const r = o.domElement.getBoundingClientRect();
            _.x = (e.clientX - r.left) / r.width * 2 - 1, _.y = -((e.clientY - r.top) / r.height) * 2 + 1, p.updateMatrixWorld(!0), H.setFromCamera(_, s);
            const n = H.intersectObjects(L, !1);
            return n.length ? n[0].object : null;
        }
        function $(e) {
            x = !0, b = !1, N = k = e.clientX, U = D = e.clientY, o.domElement.setPointerCapture(e.pointerId);
        }
        function K(e) {
            if (x) {
                if (!b) {
                    if (Math.hypot(e.clientX - N, e.clientY - U) < Me) return;
                    b = !0;
                }
                c.rotateOnWorldAxis(de, (e.clientX - k) * .008), c.rotateOnWorldAxis(ue, (e.clientY - D) * .008), k = e.clientX, D = e.clientY, w();
            }
        }
        function P(e) {
            const r = x && !b;
            x = !1;
            try {
                o.domElement.releasePointerCapture(e.pointerId);
            } catch  {}
            if (r && V && !E && m.onPaint) {
                const n = fe(e);
                n && n.userData.paintable && m.onPaint(n.userData.faceletIndex);
            }
        }
        function J(e) {
            e.preventDefault(), q(e.deltaY < 0 ? 1 : -1);
        }
        o.domElement.addEventListener("pointerdown", $), o.domElement.addEventListener("pointermove", K), o.domElement.addEventListener("pointerup", P), o.domElement.addEventListener("pointercancel", P), o.domElement.addEventListener("wheel", J, {
            passive: !1
        });
        function me() {
            W.disconnect(), o.domElement.removeEventListener("pointerdown", $), o.domElement.removeEventListener("pointermove", K), o.domElement.removeEventListener("pointerup", P), o.domElement.removeEventListener("pointercancel", P), o.domElement.removeEventListener("wheel", J), j(), z.dispose(), B.dispose(), I.dispose(), S.dispose();
            for (const e of Object.keys(h))h[e].dispose();
            o.dispose(), o.domElement.parentNode === u && u.removeChild(o.domElement);
        }
        return {
            loadState: oe,
            updateSticker: re,
            setPalette: ce,
            zoom: q,
            setPaintEnabled: se,
            animateMove: le,
            isAnimating: ()=>E,
            dispose: me
        };
    };
});
export { Re as createRubikRenderer, __tla };
