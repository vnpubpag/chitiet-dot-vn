import { n as e } from "./esm-mZAPAzZp.js";
let o;
let __tla = (async ()=>{
    const t = {
        level: 2,
        interlace: !1,
        optimiseAlpha: !1
    };
    async function n(e) {
        let { default: t, initThreadPool: n, optimise: r, optimise_raw: i } = await import(`./squoosh_oxipng-D-TSeKID.js`).then(async (m)=>{
            await m.__tla;
            return m;
        });
        return await t(e), await n(globalThis.navigator.hardwareConcurrency), {
            optimise: r,
            optimise_raw: i
        };
    }
    async function r(e) {
        let { default: t, optimise: n, optimise_raw: r } = await import(`./squoosh_oxipng-Dh-g5nJt.js`).then(async (m)=>{
            await m.__tla;
            return m;
        });
        return await t(e), {
            optimise: n,
            optimise_raw: r
        };
    }
    let i;
    async function a(t) {
        if (!i) {
            let a = globalThis.navigator?.hardwareConcurrency > 1;
            i = typeof self < `u` && typeof WorkerGlobalScope < `u` && self instanceof WorkerGlobalScope && a && await e() ? n(t) : r(t);
        }
        return i;
    }
    o = async function(e, n = {}) {
        let r = {
            ...t,
            ...n
        }, { optimise: i, optimise_raw: o } = await a();
        return e instanceof ImageData ? o(e.data, e.width, e.height, r.level, r.interlace, r.optimiseAlpha).buffer : i(new Uint8Array(e), r.level, r.interlace, r.optimiseAlpha).buffer;
    };
})();
export { o as optimise, __tla };
