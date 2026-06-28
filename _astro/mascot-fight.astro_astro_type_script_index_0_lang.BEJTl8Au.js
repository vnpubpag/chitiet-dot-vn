const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["_astro/game.98sgw95q.js","_astro/rolldown-runtime.DAXXjFlN.js","_astro/phaser.BwbeUPZM.js"])))=>i.map(i=>d[i]);
import { t as e } from "./preload-helper.L5lOfJxi.js";
(async ()=>{
    var t = null, n = !1;
    function r() {
        let e = document.getElementById(`mf-overlay`), r = document.getElementById(`mf-start`), o = document.getElementById(`mf-canvas-host`);
        if (!e || !r || !o) return;
        let s = r.textContent;
        r.addEventListener(`click`, ()=>{
            i(e, r, o);
        }), window.addEventListener(`pagehide`, a), window.addEventListener(`pageshow`, (i)=>{
            i.persisted && !t && (e.style.display = ``, r.disabled = !1, r.textContent = s, n = !1);
        });
    }
    async function i(r, i, a) {
        if (t || n) return;
        n = !0, i.disabled = !0;
        let o = i.textContent;
        i.textContent = `Đang tải engine...`;
        try {
            let { createGame: n } = await e(async ()=>{
                let { createGame: e } = await import(`./game.98sgw95q.js`).then(async (m)=>{
                    await m.__tla;
                    return m;
                });
                return {
                    createGame: e
                };
            }, __vite__mapDeps([0,1,2]));
            t || (t = n(a), r.style.display = `none`);
        } catch (e) {
            console.error(`Mascot Fight: không tải được game engine`, e), i.textContent = `Tải thất bại — thử lại`, i.disabled = !1, n = !1;
            return;
        }
        n = !1, i.textContent = o, i.disabled = !1;
    }
    function a() {
        t &&= (t.destroy(!0), null);
    }
    document.addEventListener(`DOMContentLoaded`, ()=>r());
})();
