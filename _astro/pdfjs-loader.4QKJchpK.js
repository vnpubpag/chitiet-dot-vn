const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["_astro/pdf.D_HeJB4L.js","_astro/preload-helper.L5lOfJxi.js"])))=>i.map(i=>d[i]);
import { t as e } from "./preload-helper.L5lOfJxi.js";
let n;
let __tla = (async ()=>{
    var t = null;
    n = function() {
        return t ||= (async ()=>{
            let [t, n] = await Promise.all([
                e(()=>import(`./pdf.D_HeJB4L.js`).then(async (m)=>{
                        await m.__tla;
                        return m;
                    }), __vite__mapDeps([0,1])),
                e(()=>import(`./pdf.worker.min.DAx94mNI.js`).then(async (m)=>{
                        await m.__tla;
                        return m;
                    }).then((e)=>e.default), [])
            ]);
            return t.GlobalWorkerOptions.workerSrc = n, t;
        })(), t;
    };
})();
export { n as t, __tla };
