import { t as e } from "./preload-helper.L5lOfJxi.js";
(async ()=>{
    var t = null, n, r = -1, i = {
        tool: `công cụ`,
        office: `văn phòng`,
        learn: `học tập`,
        fun: `giải trí`,
        guide: `hướng dẫn`
    }, a = document.getElementById(`pf-search-input`), o = document.getElementById(`pf-search-btn`), s = document.getElementById(`pf-search-results`);
    async function c() {
        if (t) return t;
        try {
            t = await e(()=>import(`/pagefind/pagefind.js`).then(async (m)=>{
                    await m.__tla;
                    return m;
                }), []), await t.init();
        } catch  {
            console.warn("Pagefind index not found. Run `npm run build` to generate it."), t = null;
        }
        return t;
    }
    function l(e, t) {
        if (!t.trim()) return e;
        let n = t.replace(/[.*+?^${}()|[\]\\]/g, `\\$&`), r = RegExp(`(${n})`, `gi`);
        return e.replace(r, `<mark>$1</mark>`);
    }
    function u(e) {
        let t = document.createElement(`div`);
        return t.innerHTML = e, (t.textContent || ``).replace(/\s+/g, ` `).trim();
    }
    function d(e) {
        e.forEach((e, t)=>{
            e.classList.toggle(`hero__search-result--active`, t === r);
        }), r >= 0 && e[r] && e[r].scrollIntoView({
            block: `nearest`
        });
    }
    async function f(e) {
        if (!s) return;
        if (r = -1, !e.trim()) {
            s.innerHTML = ``, s.classList.remove(`hero__search-results--open`);
            return;
        }
        let t = await c();
        if (!t) {
            s.innerHTML = `<div class="hero__search-no-results">Tìm kiếm chưa sẵn sàng.</div>`, s.classList.add(`hero__search-results--open`);
            return;
        }
        let n = await t.search(e), a = await Promise.all(n.results.slice(0, 8).map((e)=>e.data()));
        if (a.length === 0) {
            s.innerHTML = `<div class="hero__search-no-results">Không tìm thấy kết quả.</div>`, s.classList.add(`hero__search-results--open`);
            return;
        }
        s.innerHTML = a.map((t)=>{
            let n = t.meta?.title ?? t.url, r = t.meta?.group ?? ``, a = i[r] || r, o = a ? `<span class="hero__search-result-badge">${a}</span>` : ``, s = t.excerpt ? u(t.excerpt) : ``, c = s ? ` <span class="hero__search-result-desc">(${s})</span>` : ``;
            return `<a class="hero__search-result" href="${t.url}">
                    <span class="hero__search-result-text"><span class="hero__search-result-title">${l(n, e)}</span>${c}</span>
                    ${o}
                </a>`;
        }).join(``), s.classList.add(`hero__search-results--open`);
    }
    a && (a.addEventListener(`input`, ()=>{
        clearTimeout(n), n = setTimeout(()=>f(a.value), 200);
    }), a.addEventListener(`keydown`, (e)=>{
        if (!s) return;
        let t = s.querySelectorAll(`.hero__search-result`);
        e.key === `ArrowDown` ? (e.preventDefault(), r = Math.min(r + 1, t.length - 1), d(t)) : e.key === `ArrowUp` ? (e.preventDefault(), r = Math.max(r - 1, -1), d(t)) : e.key === `Enter` && r >= 0 && t[r] ? (e.preventDefault(), t[r].click()) : e.key === `Escape` && (s.classList.remove(`hero__search-results--open`), r = -1);
    })), o && a && o.addEventListener(`click`, ()=>f(a.value)), document.addEventListener(`click`, (e)=>{
        let t = e.target;
        s && !t.closest(`.hero__search-wrap`) && (s.classList.remove(`hero__search-results--open`), r = -1);
    });
    var p = document.getElementById(`hero-feed-list`), m = JSON.parse(p?.dataset.items || `[]`), h = 3, g = 4e3, _ = 0;
    function v() {
        if (!p) return;
        let e = [];
        for(let t = 0; t < h; t++){
            let { title: n, href: r } = m[(_ + t) % m.length];
            e.push(`<li class="hero__feed-item"><a href="${r}">${n}</a></li>`);
        }
        p.innerHTML = e.join(``), p.classList.remove(`hero__feed-list--visible`), p.offsetWidth, p.classList.add(`hero__feed-list--visible`), _ = (_ + h) % m.length;
    }
    v(), setInterval(v, g);
})();
