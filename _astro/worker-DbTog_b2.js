let d, f, o, c, s;
let __tla = (async ()=>{
    let e, t, n, r, i, a, l, u;
    e = Object.create;
    t = Object.defineProperty;
    n = Object.getOwnPropertyDescriptor;
    r = Object.getOwnPropertyNames;
    i = Object.getPrototypeOf;
    a = Object.prototype.hasOwnProperty;
    o = (e, t, n)=>()=>{
            if (n) throw n[0];
            try {
                return e && (t = e(e = 0)), t;
            } catch (e) {
                throw n = [
                    e
                ], e;
            }
        };
    s = (e, t)=>()=>(t || (e((t = {
                exports: {}
            }).exports, t), e = null), t.exports);
    c = (e, n)=>{
        let r = {};
        for(var i in e)t(r, i, {
            get: e[i],
            enumerable: !0
        });
        return n || t(r, Symbol.toStringTag, {
            value: `Module`
        }), r;
    };
    l = (e, i, o, s)=>{
        if (i && typeof i == `object` || typeof i == `function`) for(var c = r(i), l = 0, u = c.length, d; l < u; l++)d = c[l], !a.call(e, d) && d !== o && t(e, d, {
            get: ((e)=>i[e]).bind(null, d),
            enumerable: !(s = n(i, d)) || s.enumerable
        });
        return e;
    };
    u = (n, r, a)=>(a = n == null ? {} : e(i(n)), l(r || !n || !n.__esModule ? t(a, `default`, {
            value: n,
            enumerable: !0
        }) : a, n));
    d = (e)=>a.call(e, `module.exports`) ? e[`module.exports`] : l(t({}, `__esModule`, {
            value: !0
        }), e);
    f = ((e)=>typeof require < `u` ? require : typeof Proxy < `u` ? new Proxy(e, {
            get: (e, t)=>(typeof require < `u` ? require : e)[t]
        }) : e)(function(e) {
        if (typeof require < `u`) return require.apply(this, arguments);
        throw Error('Calling `require` for "' + e + "\" in an environment that doesn't expose the `require` function. See https://rolldown.rs/in-depth/bundling-cjs#require-external-modules for more details.");
    });
    let p = null;
    function m() {
        return p ||= (async ()=>{
            let [e, t] = await Promise.all([
                import(`./pdf-CXMUsC7R.js`).then(async (m)=>{
                    await m.__tla;
                    return m;
                }),
                import(`./pdf.worker.min-CN228PLI.js`).then(async (m)=>{
                    await m.__tla;
                    return m;
                }).then((e)=>e.default)
            ]);
            return e.GlobalWorkerOptions.workerSrc = t, e;
        })(), p;
    }
    async function h() {
        return m();
    }
    async function g(e, t) {
        return await e.getDocument({
            data: t
        }).promise;
    }
    function _(e, t = []) {
        let n = (e || ``).toLowerCase(), r = n.replace(/[^a-z0-9]/g, ` `), i = r.split(/\s+/).filter(Boolean), a = i.some((e)=>/^(bold|black|heavy|demi|semibold|ultrabold|extrabold|bd|sb)$/.test(e)), o = i.some((e)=>/^(italic|oblique|slant|slanted)$/.test(e)), s = /boldit|itbold|hb|blackit/.test(n), c = /\bit\b/.test(r) || /\bbi\b/.test(r) || /bolditalic|italicbold|obliqueitalic|italicoblique/.test(n), l = a || s, u = Math.abs(t[0] || 1), d = t[1] || 0, f = t[2] || 0, p = Math.abs(t[3] || 1), m = Math.abs(f) > .05 * u && u > .1 || Math.abs(d) > .05 * p && p > .1;
        return {
            bold: l,
            italic: o || c || m
        };
    }
    function v(e) {
        let t = [];
        for (let n of e.items){
            if (!n.str || !n.str.trim() || !n.transform) continue;
            let e = Math.abs(n.transform[0]) || Math.abs(n.transform[3]), r = n.fontName || ``, i = _(r, n.transform);
            t.push({
                str: n.str.replace(/[\r\n]+/g, ` `),
                x: n.transform[4],
                y: n.transform[5],
                width: n.width || 0,
                height: n.height || e,
                fontSize: e,
                fontName: r,
                isBold: i.bold,
                isItalic: i.italic
            });
        }
        return t;
    }
    function y(e, t, n, r) {
        let i = Math.max(1, t - e);
        if (i > n * .65) return `left`;
        let a = Math.max(0, e), o = Math.max(0, n - t), s = Math.max(n * .025, Math.max(r * 1.8, 14));
        if (o < s && a > n * .12 && i < n * .85) return `right`;
        let c = Math.abs(a - o), l = (e + t) / 2, u = n / 2;
        return i < n * .55 && c <= s && a > n * .03 && o > n * .03 || i < n * .55 && Math.abs(l - u) <= r ? `center` : `left`;
    }
    function b(e, t) {
        let n = [];
        for(let t = 0; t < e.length; t++){
            if (t > 0 && e[t].segments.length > 0) {
                let r = n[n.length - 1], i = e[t].segments[0];
                if (r && r.bold === i.bold && r.italic === i.italic) {
                    r.text += ` ` + i.text;
                    for(let r = 1; r < e[t].segments.length; r++)n.push({
                        ...e[t].segments[r]
                    });
                    continue;
                }
                r && (r.text += ` `);
            }
            for (let r of e[t].segments)n.push({
                ...r
            });
        }
        let r = n.map((e)=>e.text).join(``).trim(), i = e.reduce((e, t)=>e + t.fontSize, 0) / e.length, a = i > t * 1.2 && r.length < 200 && e.length <= 3, o = e[0].alignment;
        if (e.length > 1) {
            let t = e.map((e)=>e.xStart), n = e.map((e)=>e.xEnd), r = e.map((e)=>(e.xStart + e.xEnd) / 2), i = (e)=>Math.max(...e) - Math.min(...e), a = i(t), s = i(n), c = i(r), l = Math.min(a, c, s);
            o = l === c ? `center` : l === s ? `right` : `left`;
        }
        let s = e.reduce((e, t)=>e + t.xStart, 0) / e.length;
        return a ? {
            type: `heading`,
            segments: n,
            text: r,
            headingLevel: i > t * 1.5 ? 1 : 2,
            fontSize: i,
            xStart: s,
            alignment: o,
            y: e[0].y
        } : {
            type: `paragraph`,
            segments: n,
            text: r,
            fontSize: i,
            xStart: s,
            alignment: o,
            y: e[0].y
        };
    }
    function x(e, t, n) {
        if (e.length === 0) return [];
        if (t) {
            let t = e.filter((e)=>e.text);
            if (t.length === 0) return [];
            let r = [], i = [
                t[0]
            ];
            for(let e = 1; e < t.length; e++){
                let a = i[i.length - 1], o = t[e], s = /^\p{Ll}/u.test(o.text), c = /[.:;?!]$/.test(a.text.trimEnd()), l = o.fontSize > n * 1.2, u = a.y - o.y, d = u > 0 && u <= a.fontSize * 3, f = o.xStart > a.xStart + a.fontSize * 2;
                s && !c && !l && d && !f ? i.push(o) : (r.push(i), i = [
                    o
                ]);
            }
            return i.length > 0 && r.push(i), r.map((e)=>b(e, n));
        }
        let r = [], i = [
            e[0]
        ];
        for(let t = 1; t < e.length; t++){
            let a = e[t - 1], o = e[t], s = a.y - o.y, c = (a.fontSize + o.fontSize) / 2, l = o.xStart - a.xStart > a.fontSize, u = a.xStart - o.xStart > o.fontSize, d = s > c * 2 || Math.abs(o.fontSize - a.fontSize) > 1.5 || o.fontSize > n * 1.2 || l || u;
            if (d) {
                let e = /^\p{Ll}/u.test(o.text), t = /[.:;?!]$/.test(a.text.trimEnd()), n = s > 0 && s <= c * 3;
                e && !t && n && (d = !1);
            }
            d ? (r.push(b(i, n)), i = [
                o
            ]) : i.push(o);
        }
        return i.length > 0 && r.push(b(i, n)), r;
    }
    function S(e) {
        let t = [], n = null;
        for(let r = 0; r < e.length; r++){
            let i = ``;
            r > 0 && e[r].x - (e[r - 1].x + e[r - 1].width) > e[r].fontSize * .25 && (i = ` `);
            let a = e[r];
            n && n.bold === a.isBold && n.italic === a.isItalic ? n.text += i + a.str : (n && i && (n.text += i), n = {
                text: (n && i ? `` : i) + a.str,
                bold: a.isBold,
                italic: a.isItalic
            }, t.push(n));
        }
        let r = t.map((e)=>e.text).join(``).trim();
        return {
            xStart: e[0].x,
            xEnd: e[e.length - 1].x + e[e.length - 1].width,
            text: r,
            segments: t
        };
    }
    function C(e, t) {
        e.sort((e, t)=>e.x - t.x);
        let n = [], r = null, i = [], a = [
            e[0]
        ];
        for(let t = 1; t < e.length; t++)e[t].x - (e[t - 1].x + e[t - 1].width) > e[t].fontSize * 2 ? (i.push(S(a)), a = [
            e[t]
        ]) : a.push(e[t]);
        a.length > 0 && i.push(S(a));
        for(let t = 0; t < e.length; t++){
            let i = ``;
            t > 0 && e[t].x - (e[t - 1].x + e[t - 1].width) > e[t].fontSize * .25 && (i = ` `);
            let a = e[t];
            r && r.bold === a.isBold && r.italic === a.isItalic ? r.text += i + a.str : (r && i && (r.text += i), r = {
                text: (r && i ? `` : i) + a.str,
                bold: a.isBold,
                italic: a.isItalic
            }, n.push(r));
        }
        let o = n.map((e)=>e.text).join(``).trim(), s = e.reduce((e, t)=>e + t.fontSize, 0) / e.length, c = e[0].x, l = e[e.length - 1], u = l.x + l.width;
        return {
            segments: n,
            segmentGroups: i,
            text: o,
            y: e[0].y,
            fontSize: s,
            xStart: c,
            xEnd: u,
            alignment: y(c, u, t, s)
        };
    }
    function w(e, t) {
        if (e.length === 0) return [];
        e.sort((e, t)=>t.y - e.y || e.x - t.x);
        let n = [], r = [
            e[0]
        ];
        for(let i = 1; i < e.length; i++){
            let a = e[i], o = r[0].y, s = Math.max(a.fontSize, r[0].fontSize) * .5;
            Math.abs(a.y - o) > s ? (n.push(C(r, t)), r = [
                a
            ]) : r.push(a);
        }
        return r.length > 0 && n.push(C(r, t)), n;
    }
    function ee(e) {
        for(let t = 0; t < e.length - 1; t++){
            let n = e[t], r = e[t + 1];
            if (n.text.endsWith(`-`) && /^\p{L}/u.test(r.text)) {
                n.text = n.text.slice(0, -1);
                let e = n.segments[n.segments.length - 1];
                e && e.text.endsWith(`-`) && (e.text = e.text.slice(0, -1)), r.noLeadingSpace = !0;
            }
        }
        return e;
    }
    function T(e) {
        let t = e.map((e)=>e.fontSize).sort((e, t)=>e - t);
        if (t.length === 0) return 12;
        let n = Math.floor(t.length / 2);
        return t.length % 2 == 0 ? (t[n - 1] + t[n]) / 2 : t[n];
    }
    function E(e, t) {
        let n = e.filter((e)=>e.xEnd - e.xStart < t * .55);
        if (n.length < 4) return [];
        let r = n.map((e)=>e.xStart).sort((e, t)=>e - t), i = t * .15, a = [], o = [
            r[0]
        ];
        for(let e = 1; e < r.length; e++)r[e] - r[e - 1] > i ? (a.push(o), o = [
            r[e]
        ]) : o.push(r[e]);
        a.push(o);
        let s = a.filter((e)=>e.length >= 2);
        return s.length <= 1 ? [] : s.map((e)=>e.reduce((e, t)=>e + t, 0) / e.length).sort((e, t)=>e - t);
    }
    function D(e, t) {
        if (e.length <= 2) return e;
        let n = E(e, t);
        if (n.length <= 1) return e;
        let r = e.length, i = Math.max(...e.map((e)=>e.y)), a = e.map((e)=>{
            if (e.xEnd - e.xStart >= t * .55) return -1;
            let r = 0, i = 1 / 0;
            for(let t = 0; t < n.length; t++){
                let a = Math.abs(e.xStart - n[t]);
                a < i && (i = a, r = t);
            }
            return r;
        }), o = (t, n)=>{
            let r = e[t], o = e[n], s = a[t], c = a[n], l = (r.fontSize + o.fontSize) / 2, u = r.y - o.y, d = 0;
            return d -= Math.abs(r.fontSize - o.fontSize) * 2, s === c ? (d += 100, u > 0 ? (d += 50, d -= u / (l * 2)) : d -= 200, Math.abs(r.xStart - o.xStart) < l && (d += 5)) : s >= 0 && c >= 0 && c === s + 1 ? (d += 40, d += o.y / (i || 1) * 30) : s >= 0 && c >= 0 && c > s ? (d -= 20, d += o.y / (i || 1) * 10) : c === -1 || s === -1 ? (d += 20, u > 0 ? d += 20 : d -= 50) : d -= 150, d;
        }, s = Array(r).fill(!1), c = [], l = 0;
        for(let t = 1; t < r; t++){
            let n = a[t] < 0 ? 0 : a[t], r = a[l] < 0 ? 0 : a[l];
            (n < r || n === r && e[t].y > e[l].y) && (l = t);
        }
        let u = l;
        for(; c.length < r;){
            s[u] = !0, c.push(e[u]);
            let t = -1, n = -1 / 0;
            for(let e = 0; e < r; e++){
                if (s[e]) continue;
                let r = o(u, e);
                r > n && (n = r, t = e);
            }
            if (t === -1) break;
            u = t;
        }
        for(let t = 0; t < r; t++)s[t] || c.push(e[t]);
        return c;
    }
    const O = /^[•◦\-–*]\s+/, k = /^(\d+[.)]\s+|[a-zA-Z][.)]\s+)/;
    function A(e, t) {
        let n = [], r = t;
        for (let t of e){
            if (r >= t.text.length) {
                r -= t.text.length;
                continue;
            }
            r > 0 ? (n.push({
                ...t,
                text: t.text.slice(r)
            }), r = 0) : n.push({
                ...t
            });
        }
        return n;
    }
    function j(e, t) {
        if (t.length === 0) return;
        let n = e[e.length - 1], r = t[0];
        if (n && n.bold === r.bold && n.italic === r.italic) {
            n.text += ` ` + r.text;
            for(let n = 1; n < t.length; n++)e.push({
                ...t[n]
            });
        } else {
            n && (n.text += ` `);
            for (let n of t)e.push({
                ...n
            });
        }
    }
    function M(e, t) {
        let n = new Set, r = [], i = 0;
        for(; i < e.length;){
            let a = e[i];
            if (a.fontSize > t * 1.2) {
                i++;
                continue;
            }
            let o = O.exec(a.text), s = k.exec(a.text);
            if (!o && !s) {
                i++;
                continue;
            }
            let c = o ? `bullet` : `numbered`, l = o ? O : k, u = a.xStart, d = [];
            for(; i < e.length;){
                let r = e[i], a = l.exec(r.text);
                if (a && Math.abs(r.xStart - u) < r.fontSize * 3) {
                    let e = A(r.segments, a[0].length), t = r.text.slice(a[0].length), o = Math.max(0, Math.round((r.xStart - u) / (r.fontSize * 2)));
                    d.push({
                        segments: e,
                        text: t,
                        level: o
                    }), n.add(i), i++;
                } else if (d.length > 0 && r.xStart > u + r.fontSize && r.fontSize <= t * 1.2) {
                    let e = d[d.length - 1];
                    e.text += ` ` + r.text, j(e.segments, r.segments), n.add(i), i++;
                } else break;
            }
            d.length >= 1 ? r.push({
                type: `list`,
                listType: c,
                items: d,
                alignment: a.alignment,
                y: a.y
            }) : n.clear();
        }
        return {
            consumed: n,
            blocks: r
        };
    }
    function N(e, t, n) {
        let r = new Set, i = [], a = 0;
        for(; a < e.length;){
            if (e[a].segmentGroups.length < 3) {
                a++;
                continue;
            }
            let t = a;
            for(; a < e.length && e[a].segmentGroups.length >= 3 && e[a].fontSize <= n * 1.2;)a++;
            let o = a;
            if (o - t < 3) continue;
            let s = e.slice(t, o), c = [];
            for (let e of s)for (let t of e.segmentGroups)c.push((t.xStart + t.xEnd) / 2);
            c.sort((e, t)=>e - t);
            let l = n * 2, u = [], d = [
                c[0]
            ];
            for(let e = 1; e < c.length; e++)if (c[e] - c[e - 1] <= l) d.push(c[e]);
            else {
                let t = d.reduce((e, t)=>e + t, 0) / d.length;
                u.push({
                    x: t,
                    tolerance: l
                }), d = [
                    c[e]
                ];
            }
            if (d.length > 0) {
                let e = d.reduce((e, t)=>e + t, 0) / d.length;
                u.push({
                    x: e,
                    tolerance: l
                });
            }
            if (u.length < 3) continue;
            if (u.length >= 3) {
                let e = [];
                for(let t = 1; t < u.length; t++)e.push(u[t].x - u[t - 1].x);
                let t = Math.min(...e), n = Math.max(...e);
                if (t > 0 && n / t > 3) continue;
            }
            let f = 0;
            for (let e of s){
                let t = 0;
                for (let n of e.segmentGroups){
                    let e = (n.xStart + n.xEnd) / 2;
                    u.some((t)=>Math.abs(e - t.x) <= t.tolerance) && t++;
                }
                t >= 3 && f++;
            }
            if (f < s.length * .7) continue;
            let p = [];
            for (let e of s){
                let t = u.map(()=>({
                        segments: [],
                        text: ``
                    }));
                for (let n of e.segmentGroups){
                    let e = (n.xStart + n.xEnd) / 2, r = 0, i = 1 / 0;
                    for(let t = 0; t < u.length; t++){
                        let n = Math.abs(e - u[t].x);
                        n < i && (i = n, r = t);
                    }
                    t[r] = {
                        segments: n.segments.map((e)=>({
                                ...e
                            })),
                        text: n.text
                    };
                }
                p.push({
                    cells: t
                });
            }
            for(let e = t; e < o; e++)r.add(e);
            i.push({
                type: `table`,
                rows: p,
                columnCount: u.length,
                alignment: `left`,
                y: s[0].y
            });
        }
        return {
            consumed: r,
            blocks: i
        };
    }
    function P(e, t, n) {
        return [
            e[0] * t + e[2] * n + e[4],
            e[1] * t + e[3] * n + e[5]
        ];
    }
    function F(e, t, n, r, i, a, o) {
        return [
            e[0] * t + e[2] * n,
            e[1] * t + e[3] * n,
            e[0] * r + e[2] * i,
            e[1] * r + e[3] * i,
            e[0] * a + e[2] * o + e[4],
            e[1] * a + e[3] * o + e[5]
        ];
    }
    function I(e, t, n, r, i, a, o) {
        Math.sqrt((n - e) ** 2 + (r - t) ** 2) < 3 || (Math.abs(t - r) <= i ? a.push({
            x1: Math.min(e, n),
            y1: (t + r) / 2,
            x2: Math.max(e, n),
            y2: (t + r) / 2
        }) : Math.abs(e - n) <= i && o.push({
            x1: (e + n) / 2,
            y1: Math.min(t, r),
            x2: (e + n) / 2,
            y2: Math.max(t, r)
        }));
    }
    function L(e, t, n, r, i) {
        let a = 0, o = 0, s = 0, c = 0, l = 0;
        for(; l < e.length;){
            let u = e[l++] | 0;
            if (u === 0) a = e[l++], o = e[l++], s = a, c = o;
            else if (u === 1) {
                let s = e[l++], c = e[l++], [u, d] = P(t, a, o), [f, p] = P(t, s, c);
                I(u, d, f, p, n, r, i), a = s, o = c;
            } else if (u === 2) a = e[l + 4], o = e[l + 5], l += 6;
            else if (u === 3) a = e[l + 2], o = e[l + 3], l += 4;
            else if (u === 4) {
                if (a !== s || o !== c) {
                    let [e, l] = P(t, a, o), [u, d] = P(t, s, c);
                    I(e, l, u, d, n, r, i);
                }
                a = s, o = c;
            } else break;
        }
    }
    function R(e, t) {
        let n = [], r = [], i = [
            1,
            0,
            0,
            1,
            0,
            0
        ], a = [];
        for(let o = 0; o < e.fnArray.length; o++){
            let s = e.fnArray[o], c = e.argsArray[o];
            if (s === t.OPS.transform) {
                i = F(i, c[0], c[1], c[2], c[3], c[4], c[5]);
                continue;
            }
            if (s === t.OPS.save) {
                a.push([
                    ...i
                ]);
                continue;
            }
            if (s === t.OPS.restore && a.length > 0) {
                i = a.pop();
                continue;
            }
            if (s === t.OPS.constructPath) {
                let e = c[1], t = Array.isArray(e) ? e[0] : e;
                t && typeof t.length == `number` && t.length > 0 && L(t, i, 1.5, n, r);
            }
        }
        return {
            horizontal: n,
            vertical: r
        };
    }
    function z(e, t) {
        if (e.length === 0) return [];
        e.sort((e, t)=>e - t);
        let n = [
            [
                e[0]
            ]
        ];
        for(let r = 1; r < e.length; r++){
            let i = n[n.length - 1];
            e[r] - i[i.length - 1] <= t ? i.push(e[r]) : n.push([
                e[r]
            ]);
        }
        return n.map((e)=>e.reduce((e, t)=>e + t, 0) / e.length);
    }
    function B(e, t, n, r) {
        let i = e.filter((e)=>e.y1 > 2 && e.y1 < r - 2), a = t.filter((e)=>e.x1 > 2 && e.x1 < n - 2), o = z(i.map((e)=>e.y1), 3), s = z(a.map((e)=>e.x1), 3);
        if (o.length < 3 || s.length < 3) return [];
        let c = s[0], l = s[s.length - 1], u = o[0], d = o[o.length - 1], f = l - c, p = d - u;
        return f < 30 || p < 30 || i.length < o.length * 2 || a.length < s.length * 2 ? [] : [
            {
                rowYs: [
                    ...o
                ].sort((e, t)=>t - e),
                colXs: s
            }
        ];
    }
    function V(e, t, n, r, i) {
        let a = new Set, o = [], { horizontal: s, vertical: c } = R(e, t), l = B(s, c, r, i);
        if (l.length === 0) return {
            tables: o,
            consumedIndices: a
        };
        for (let e of l){
            let t = e.rowYs.length - 1, r = e.colXs.length - 1;
            if (t < 1 || r < 1) continue;
            let i = e.rowYs[0], s = e.rowYs[t], c = e.colXs[0], l = e.colXs[r], u = [];
            for(let e = 0; e < t; e++)u.push({
                cells: Array.from({
                    length: r
                }, ()=>({
                        segments: [],
                        text: ``
                    }))
            });
            for(let o = 0; o < n.length; o++){
                let d = n[o];
                if (d.x < c - 5 || d.x > l + 5 || d.y < s - 5 || d.y > i + 5) continue;
                let f = -1;
                for(let n = 0; n < t; n++){
                    let t = e.rowYs[n], r = e.rowYs[n + 1];
                    if (d.y <= t + 5 && d.y >= r - 5) {
                        f = n;
                        break;
                    }
                }
                let p = -1;
                for(let t = 0; t < r; t++){
                    let n = e.colXs[t], r = e.colXs[t + 1];
                    if (d.x >= n - 5 && d.x < r + 5) {
                        p = t;
                        break;
                    }
                }
                if (f < 0 || p < 0) continue;
                a.add(o);
                let m = u[f].cells[p];
                m.text ? m.text += ` ` + d.str : m.text = d.str, m.segments.push({
                    text: d.str,
                    bold: d.isBold,
                    italic: d.isItalic
                });
            }
            u.some((e)=>e.cells.some((e)=>e.text.length > 0)) && o.push({
                type: `table`,
                rows: u,
                columnCount: r,
                alignment: `left`,
                y: i
            });
        }
        return {
            tables: o,
            consumedIndices: a
        };
    }
    function H(e, t) {
        if (typeof OffscreenCanvas < `u`) {
            let n = new OffscreenCanvas(e, t), r = n.getContext(`2d`);
            return r ? {
                canvas: n,
                ctx: r
            } : null;
        }
        if (typeof document < `u`) {
            let n = document.createElement(`canvas`);
            n.width = e, n.height = t;
            let r = n.getContext(`2d`);
            return r ? {
                canvas: n,
                ctx: r
            } : null;
        }
        return null;
    }
    async function U(e) {
        return e instanceof OffscreenCanvas ? await e.convertToBlob({
            type: `image/png`
        }) : new Promise((t)=>e.toBlob(t, `image/png`));
    }
    function W(e) {
        (e instanceof OffscreenCanvas || e instanceof HTMLCanvasElement) && (e.width = 0, e.height = 0);
    }
    async function G(e, t, n) {
        if (t < 1 || n < 1) return null;
        let r = H(t, n);
        if (!r) return null;
        let { canvas: i, ctx: a } = r;
        a.drawImage(e, 0, 0);
        let o = await U(i);
        if (W(i), !o) return null;
        let s = await o.arrayBuffer();
        return {
            data: new Uint8Array(s),
            width: t,
            height: n
        };
    }
    async function K(e) {
        if (!e) return null;
        if (typeof ImageBitmap < `u` && e instanceof ImageBitmap) return G(e, e.width, e.height);
        if (e.bitmap instanceof ImageBitmap) return G(e.bitmap, e.bitmap.width, e.bitmap.height);
        if (typeof HTMLImageElement < `u` && e instanceof HTMLImageElement) {
            let t = e.naturalWidth || e.width || 0, n = e.naturalHeight || e.height || 0;
            return G(e, t, n);
        }
        if (typeof HTMLCanvasElement < `u` && e instanceof HTMLCanvasElement) return G(e, e.width, e.height);
        if (e.imgData && (e = e.imgData), !e?.data || !e.width || !e.height || e.width < 1 || e.height < 1) return null;
        let t = H(e.width, e.height);
        if (!t) return null;
        let { canvas: n, ctx: r } = t, i = e.data instanceof Uint8ClampedArray ? e.data : new Uint8ClampedArray(e.data), a = e.width * e.height, o;
        if (i.length === a * 4) o = i;
        else if (i.length === a * 3) {
            o = new Uint8ClampedArray(a * 4);
            for(let e = 0; e < a; e++)o[e * 4] = i[e * 3], o[e * 4 + 1] = i[e * 3 + 1], o[e * 4 + 2] = i[e * 3 + 2], o[e * 4 + 3] = 255;
        } else if (i.length === a) {
            o = new Uint8ClampedArray(a * 4);
            for(let e = 0; e < a; e++)o[e * 4] = i[e], o[e * 4 + 1] = i[e], o[e * 4 + 2] = i[e], o[e * 4 + 3] = 255;
        } else if (i.length === a * 2) {
            o = new Uint8ClampedArray(a * 4);
            for(let e = 0; e < a; e++)o[e * 4] = i[e * 2], o[e * 4 + 1] = i[e * 2], o[e * 4 + 2] = i[e * 2], o[e * 4 + 3] = i[e * 2 + 1];
        } else return W(n), null;
        let s = new ImageData(o, e.width, e.height);
        r.putImageData(s, 0, 0);
        let c = await U(n);
        if (W(n), !c) return null;
        let l = await c.arrayBuffer();
        return {
            data: new Uint8Array(l),
            width: e.width,
            height: e.height
        };
    }
    function q(e, t) {
        try {
            let n = e.objs.get(t);
            if (n) return Promise.resolve(n);
        } catch  {}
        return new Promise((n)=>{
            let r = setTimeout(()=>n(null), 5e3);
            try {
                e.objs.get(t, (e)=>{
                    clearTimeout(r), n(e);
                });
            } catch  {
                clearTimeout(r), n(null);
            }
        });
    }
    async function J(e) {
        let t = e.getViewport({
            scale: .5
        }), n = H(t.width, t.height);
        if (!n) return;
        let { canvas: r, ctx: i } = n;
        try {
            await e.render({
                canvasContext: i,
                viewport: t
            }).promise;
        } catch  {}
        W(r);
    }
    async function Y(e, t) {
        try {
            let n = await e.getOperatorList();
            for(let e = 0; e < n.fnArray.length; e++){
                let r = n.fnArray[e];
                if (r === t.OPS.paintImageXObject || r === t.OPS.paintImageXObjectRepeat || r === t.OPS.paintJpegXObject || r === t.OPS.paintInlineImageXObject || r === t.OPS.paintInlineImageXObjectGroup) return !0;
            }
        } catch  {}
        return !1;
    }
    async function X(e, t) {
        let n = [], r = new Set;
        try {
            if (!await Y(e, t)) return n;
            await J(e);
            let i = e.getViewport({
                scale: 1
            }).height, a = await e.getOperatorList(), o = [
                1,
                0,
                0,
                1,
                0,
                0
            ], s = [], c = async (e)=>{
                if (!e) return;
                let t = i - o[5];
                n.push({
                    ...e,
                    pdfY: t
                });
            };
            for(let n = 0; n < a.fnArray.length; n++){
                let i = a.fnArray[n], l = a.argsArray[n];
                if (i === t.OPS.transform) {
                    let [e, t, n, r, i, a] = l;
                    o = [
                        o[0] * e + o[2] * t,
                        o[1] * e + o[3] * t,
                        o[0] * n + o[2] * r,
                        o[1] * n + o[3] * r,
                        o[0] * i + o[2] * a + o[4],
                        o[1] * i + o[3] * a + o[5]
                    ];
                }
                i === t.OPS.save && s.push([
                    ...o
                ]), i === t.OPS.restore && s.length > 0 && (o = s.pop());
                try {
                    if (i === t.OPS.paintImageXObject || i === t.OPS.paintImageXObjectRepeat) {
                        let t = String(l[0]);
                        if (r.has(t)) continue;
                        r.add(t), await c(await K(await q(e, t)));
                    }
                    if (i === t.OPS.paintJpegXObject) {
                        let t = String(l[0]);
                        if (r.has(t)) continue;
                        r.add(t), await c(await K(await q(e, t)));
                    }
                    if (i === t.OPS.paintInlineImageXObject) {
                        let e = l[0];
                        e && e.width && e.height && await c(await K(e));
                    }
                    if (i === t.OPS.paintInlineImageXObjectGroup) {
                        let e = Array.isArray(l[0]) ? l[0] : [
                            l[0]
                        ];
                        for (let t of e)t && t.width && t.height && await c(await K(t));
                    }
                } catch  {}
            }
        } catch  {}
        return n;
    }
    async function Z(e) {
        let t = e.getViewport({
            scale: 2
        }), n, r;
        if (typeof OffscreenCanvas < `u` ? (n = new OffscreenCanvas(t.width, t.height), r = n.getContext(`2d`)) : typeof document < `u` && (n = document.createElement(`canvas`), n.width = t.width, n.height = t.height, r = n.getContext(`2d`)), !r) return null;
        try {
            await e.render({
                canvasContext: r,
                viewport: t
            }).promise;
        } catch  {
            return null;
        }
        let i = null;
        return i = n instanceof OffscreenCanvas ? await n.convertToBlob({
            type: `image/png`
        }) : await new Promise((e)=>n.toBlob(e, `image/png`)), n.width = 0, n.height = 0, i;
    }
    async function Q(e) {
        let t = await Z(e);
        if (!t) return [];
        let { createWorker: n } = await import(`./src-BNLTFBsT.js`).then(async (m)=>{
            await m.__tla;
            return m;
        }).then((e)=>u(e.default, 1)), r = self.location.origin, i = await n(`vie+eng`, void 0, {
            workerPath: `${r}/libs/tesseract/worker.min.js`,
            corePath: `${r}/libs/tesseract/core`,
            langPath: `${r}/models/tessdata`
        });
        try {
            let { data: e } = await i.recognize(t);
            return !e.text || !e.text.trim() ? [] : e.text.split(/\n\s*\n/).map((e)=>e.replace(/\n/g, ` `).trim()).filter(Boolean).map((e, t)=>({
                    type: `paragraph`,
                    segments: [
                        {
                            text: e,
                            bold: !1,
                            italic: !1
                        }
                    ],
                    text: e,
                    fontSize: 12,
                    xStart: 0,
                    alignment: `left`,
                    y: -(t * 100)
                }));
        } finally{
            await i.terminate();
        }
    }
    function $(e) {
        switch(e.type){
            case `paragraph`:
            case `heading`:
                return e.text.length > 0;
            case `list`:
                return e.items.length > 0;
            case `table`:
                return e.rows.length > 0;
        }
    }
    async function te(e, t) {
        let { Document: n, Packer: r, Paragraph: i, TextRun: a, HeadingLevel: o, ImageRun: s, AlignmentType: c, Table: l, TableRow: u, TableCell: d, WidthType: f, LevelFormat: p, BorderStyle: m, convertInchesToTwip: h } = await import(`./dist-4dDLlQao.js`).then(async (m)=>{
            await m.__tla;
            return m;
        }), g = {
            left: c.LEFT,
            center: c.CENTER,
            right: c.RIGHT
        }, _ = [], v = (e)=>{
            let t = e.width, n = e.height;
            if (t > 600) {
                let e = 600 / t;
                t = 600, n = Math.round(n * e);
            }
            return new i({
                children: [
                    new s({
                        type: `png`,
                        data: e.data,
                        transformation: {
                            width: t,
                            height: n
                        }
                    })
                ],
                spacing: {
                    before: 120,
                    after: 120
                }
            });
        }, y = (e)=>{
            switch(e.type){
                case `heading`:
                    return [
                        new i({
                            heading: e.headingLevel === 1 ? o.HEADING_1 : o.HEADING_2,
                            children: e.segments.map((t)=>new a({
                                    text: t.text,
                                    bold: !0,
                                    italics: t.italic,
                                    size: Math.round(e.fontSize * 2)
                                })),
                            spacing: {
                                before: 240,
                                after: 120
                            },
                            alignment: g[e.alignment]
                        })
                    ];
                case `paragraph`:
                    {
                        let t = Math.max(0, e.xStart - 72), n = t > 5 ? Math.round(t * 20) : 0;
                        return [
                            new i({
                                children: e.segments.map((t)=>new a({
                                        text: t.text,
                                        bold: t.bold,
                                        italics: t.italic,
                                        size: Math.round(e.fontSize * 2)
                                    })),
                                spacing: {
                                    after: 120,
                                    line: 276
                                },
                                alignment: g[e.alignment],
                                indent: n > 0 ? {
                                    left: n
                                } : void 0
                            })
                        ];
                    }
                case `list`:
                    return e.items.map((t)=>{
                        let n = t.segments.map((e)=>new a({
                                text: e.text,
                                bold: e.bold,
                                italics: e.italic
                            }));
                        return e.listType === `bullet` ? new i({
                            children: n,
                            bullet: {
                                level: t.level
                            },
                            spacing: {
                                after: 60
                            }
                        }) : new i({
                            children: n,
                            numbering: {
                                reference: `decimal-numbering`,
                                level: t.level
                            },
                            spacing: {
                                after: 60
                            }
                        });
                    });
                case `table`:
                    {
                        let t = {
                            style: m.SINGLE,
                            size: 1,
                            color: `999999`
                        };
                        return [
                            new l({
                                rows: e.rows.map((t)=>new u({
                                        children: t.cells.map((t)=>new d({
                                                children: [
                                                    new i({
                                                        children: t.segments.length > 0 ? t.segments.map((e)=>new a({
                                                                text: e.text,
                                                                bold: e.bold,
                                                                italics: e.italic
                                                            })) : []
                                                    })
                                                ],
                                                width: {
                                                    size: Math.floor(100 / e.columnCount),
                                                    type: f.PERCENTAGE
                                                }
                                            }))
                                    })),
                                width: {
                                    size: 100,
                                    type: f.PERCENTAGE
                                },
                                borders: {
                                    top: t,
                                    bottom: t,
                                    left: t,
                                    right: t,
                                    insideHorizontal: t,
                                    insideVertical: t
                                }
                            })
                        ];
                    }
            }
        };
        for(let n = 0; n < e.length; n++){
            let { blocks: r, images: a } = e[n];
            if (!t || a.length === 0) for (let e of r)$(e) && _.push(...y(e));
            else {
                let e = [];
                for (let t of r)$(t) && e.push({
                    kind: `block`,
                    y: -t.y,
                    block: t
                });
                for (let t of a)e.push({
                    kind: `image`,
                    y: t.pdfY,
                    image: t
                });
                e.sort((e, t)=>e.y - t.y);
                for (let t of e)t.kind === `image` ? _.push(v(t.image)) : _.push(...y(t.block));
            }
            n < e.length - 1 && _.push(new i({
                pageBreakBefore: !0,
                children: []
            }));
        }
        let b = new n({
            numbering: {
                config: [
                    {
                        reference: `decimal-numbering`,
                        levels: [
                            {
                                level: 0,
                                format: p.DECIMAL,
                                text: `%1.`,
                                alignment: c.LEFT,
                                start: 1
                            },
                            {
                                level: 1,
                                format: p.LOWER_LETTER,
                                text: `%2.`,
                                alignment: c.LEFT,
                                start: 1
                            }
                        ]
                    }
                ]
            },
            sections: [
                {
                    children: _
                }
            ]
        });
        return await r.toBlob(b);
    }
    function ne(e, t, n, r) {
        let i = D(e, t), a = M(i, r), o = i.filter((e, t)=>!a.consumed.has(t)), s = N(o, t, r);
        return [
            ...x(o.filter((e, t)=>!s.consumed.has(t)), n, r),
            ...a.blocks,
            ...s.blocks
        ].sort((e, t)=>t.y - e.y);
    }
    async function re(e, t, n) {
        n(2, `Đang tải thư viện...`);
        let r = await h();
        n(5, `Đang đọc file PDF...`);
        let i = await g(r, e), a = i.numPages, o = [], s = [];
        for(let e = 1; e <= a; e++){
            n(10 + Math.round(e / a * 30), `Đang trích xuất trang ${e}/${a}...`);
            let t = await i.getPage(e), c = t.getViewport({
                scale: 1
            }), l = c.width, u = v(await t.getTextContent()), { tables: d, consumedIndices: f } = V(await t.getOperatorList(), r, u, l, c.height), p = w(f.size > 0 ? u.filter((e, t)=>!f.has(t)) : u, l);
            p = ee(p), o.push({
                lines: p,
                pageWidth: l,
                gridTables: d
            }), s.push(...p), await new Promise((e)=>setTimeout(e, 0));
        }
        let c = T(s);
        s.length = 0, n(45, `Đang phân tích cấu trúc...`);
        let l = [];
        for(let e = 0; e < a; e++){
            let s = 45 + Math.round(e / a * 25);
            n(s, `Đang xử lý trang ${e + 1}/${a}...`);
            let { lines: u, pageWidth: d, gridTables: f } = o[e], p = await i.getPage(e + 1), m;
            u.length === 0 && f.length === 0 && t.enableOCR ? (n(s, `Đang OCR trang ${e + 1}/${a}...`), m = await Q(p)) : m = [
                ...ne(u, d, t.preserveLayout, c),
                ...f
            ].sort((e, t)=>t.y - e.y);
            let h = t.includeImages ? await X(p, r) : [];
            l.push({
                blocks: m,
                images: h
            }), o[e] = {
                lines: [],
                pageWidth: 0,
                gridTables: []
            }, await new Promise((e)=>setTimeout(e, 0));
        }
        n(75, `Đang tạo file DOCX...`);
        let u = await te(l, t.includeImages);
        return n(100, `Hoàn tất!`), u;
    }
    self.onmessage = async (e)=>{
        let { buffer: t, options: n } = e.data;
        try {
            let e = {
                type: `result`,
                blob: await re(t, n, (e, t)=>{
                    let n = {
                        type: `progress`,
                        pct: e,
                        status: t
                    };
                    self.postMessage(n);
                })
            };
            self.postMessage(e);
        } catch (e) {
            let t = {
                type: `error`,
                message: e?.message || `Conversion failed`
            };
            self.postMessage(t);
        }
    };
})();
export { d as a, f as i, o as n, c as r, s as t, __tla };
