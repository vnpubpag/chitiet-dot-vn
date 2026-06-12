const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["_astro/game.BE4zNX6Q.js","_astro/phaser.KZmhzKO7.js"])))=>i.map(i=>d[i]);
import { _ as d } from "./preload-helper.CVfkMyKi.js";
(async ()=>{
    let t = null, a = !1;
    function c() {
        const n = document.getElementById("mf-overlay"), e = document.getElementById("mf-start"), o = document.getElementById("mf-canvas-host");
        if (!n || !e || !o) return;
        const s = e.textContent;
        e.addEventListener("click", ()=>{
            r(n, e, o);
        }), window.addEventListener("pagehide", f), window.addEventListener("pageshow", (i)=>{
            i.persisted && !t && (n.style.display = "", e.disabled = !1, e.textContent = s, a = !1);
        });
    }
    async function r(n, e, o) {
        if (t || a) return;
        a = !0, e.disabled = !0;
        const s = e.textContent;
        e.textContent = "Đang tải engine...";
        try {
            const { createGame: i } = await d(async ()=>{
                const { createGame: l } = await import("./game.BE4zNX6Q.js");
                return {
                    createGame: l
                };
            }, __vite__mapDeps([0,1]));
            t || (t = i(o), n.style.display = "none");
        } catch (i) {
            console.error("Mascot Fight: không tải được game engine", i), e.textContent = "Tải thất bại — thử lại", e.disabled = !1, a = !1;
            return;
        }
        a = !1, e.textContent = s, e.disabled = !1;
    }
    function f() {
        t && (t.destroy(!0), t = null);
    }
    document.addEventListener("DOMContentLoaded", ()=>c());
})();
