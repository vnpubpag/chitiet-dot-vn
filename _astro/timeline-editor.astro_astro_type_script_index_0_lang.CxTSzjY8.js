import { t as e } from "./preload-helper.L5lOfJxi.js";
(async ()=>{
    var t = `chitiet_timeline_events`, n = `#2563eb`, r = {
        events: []
    }, i = null, a = !1, o = !0, s = !1;
    function c(e) {
        return document.getElementById(e);
    }
    function l() {
        return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
    }
    function u() {
        try {
            let e = localStorage.getItem(t);
            if (e) {
                let t = JSON.parse(e);
                t && Array.isArray(t.events) && (r = t);
            }
        } catch  {
            r = {
                events: []
            };
        }
    }
    function d() {
        localStorage.setItem(t, JSON.stringify(r));
    }
    function f() {
        let e = c(`tl-events`), t = c(`tl-empty`);
        if (!(!e || !t)) {
            if (r.events.length === 0) {
                e.innerHTML = ``, t.classList.add(`tl-empty--visible`);
                return;
            }
            t.classList.remove(`tl-empty--visible`), e.innerHTML = [
                ...r.events
            ].sort((e, t)=>{
                let n = new Date(e.time).getTime(), r = new Date(t.time).getTime();
                return isNaN(n) && isNaN(r) ? 0 : isNaN(n) ? 1 : isNaN(r) ? -1 : n - r;
            }).map((e)=>m(e)).join(``), e.querySelectorAll(`[data-action]`).forEach((e)=>{
                e.addEventListener(`click`, y);
            }), e.querySelectorAll(`.tl-color-input`).forEach((e)=>{
                e.addEventListener(`input`, b), e.addEventListener(`change`, x);
            });
        }
    }
    function p(e) {
        return {
            r: parseInt(e.slice(1, 3), 16),
            g: parseInt(e.slice(3, 5), 16),
            b: parseInt(e.slice(5, 7), 16)
        };
    }
    function m(e) {
        let t = e.side === `right` ? `tl-item--right` : `tl-item--left`, r = /^#[0-9a-fA-F]{6}$/.test(e.color || ``) ? e.color : n, { r: i, g: a, b: o } = p(r), s = h(e.title), c = h(e.description), l = g(e.time);
        return `
        <div class="tl-item ${t}" data-id="${e.id}" style="--tl-event-color: ${r}; --tl-color-10: rgba(${i},${a},${o},0.1); --tl-color-20: rgba(${i},${a},${o},0.2); --tl-color-30: rgba(${i},${a},${o},0.3)">
            <div class="tl-item__content">
                <div class="tl-card__actions">
                    <label class="tl-card__action-btn tl-card__action-btn--color" title="Đổi màu">
                        <input type="color" class="tl-color-input" data-id="${e.id}" value="${r}" />
                        <svg width="14" height="14" viewBox="0 0 14 14"><circle cx="7" cy="7" r="5.5" fill="${r}" stroke="#d1d5db" stroke-width="1"></circle></svg>
                    </label>
                    <button class="tl-card__action-btn" data-action="edit" data-id="${e.id}" title="Sửa">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                    </button>
                    <button class="tl-card__action-btn tl-card__action-btn--delete" data-action="delete" data-id="${e.id}" title="Xóa">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                    </button>
                </div>
                <div class="tl-card">
                    <span class="tl-card__time">${l}</span>
                    <div class="tl-card__header">
                        <h4 class="tl-card__title">${s}</h4>
                    </div>
                    ${c ? `<p class="tl-card__desc">${c}</p>` : ``}
                </div>
            </div>
            <div class="tl-item__center">
                <div class="tl-dot"></div>
            </div>
            <div class="tl-item__spacer">
                <span class="tl-time-label">${l}</span>
            </div>
        </div>
    `;
    }
    function h(e) {
        let t = document.createElement(`div`);
        return t.textContent = e, t.innerHTML;
    }
    function g(e) {
        let t = new Date(e);
        if (isNaN(t.getTime())) return h(e);
        let n = {
            day: `2-digit`,
            month: `2-digit`,
            year: `numeric`
        };
        return o && (n.hour = `2-digit`, n.minute = `2-digit`), t.toLocaleString(`vi-VN`, n);
    }
    function _(e, t) {
        let n = c(`tl-modal-overlay`), r = c(`tl-modal-title`), a = c(`tl-input-time`), o = c(`tl-input-title`), s = c(`tl-input-desc`);
        if (!(!n || !r || !a || !o || !s)) {
            if (e === `edit` && t) {
                i = t.id, r.textContent = `Sửa sự kiện`, a.value = t.time, o.value = t.title, s.value = t.description;
                let e = document.querySelector(`input[name="tl-side"][value="${t.side}"]`);
                e && (e.checked = !0);
            } else {
                i = null, r.textContent = `Thêm sự kiện`, a.value = ``, o.value = ``, s.value = ``;
                let e = document.querySelector(`input[name="tl-side"][value="left"]`);
                e && (e.checked = !0);
            }
            n.classList.add(`tl-modal-overlay--open`), a.focus();
        }
    }
    function v() {
        let e = c(`tl-modal-overlay`);
        e && e.classList.remove(`tl-modal-overlay--open`), i = null;
    }
    function y(e) {
        let t = e.currentTarget, n = t.getAttribute(`data-action`), i = t.getAttribute(`data-id`);
        if (!(!n || !i)) if (n === `edit`) {
            let e = r.events.find((e)=>e.id === i);
            e && _(`edit`, e);
        } else n === `delete` && confirm(`Bạn có chắc muốn xóa sự kiện này?`) && (r.events = r.events.filter((e)=>e.id !== i), d(), f());
    }
    function b(e) {
        let t = e.currentTarget, n = t.getAttribute(`data-id`);
        if (!n) return;
        let r = c(`tl-events`);
        if (!r) return;
        let i = r.querySelector(`.tl-item[data-id="${n}"]`);
        i && i.style.setProperty(`--tl-event-color`, t.value);
    }
    function x(e) {
        let t = e.currentTarget, n = t.getAttribute(`data-id`);
        if (!n) return;
        let i = r.events.find((e)=>e.id === n);
        i && (i.color = t.value, d(), f());
    }
    function S(e) {
        e.preventDefault();
        let t = c(`tl-input-time`), n = c(`tl-input-title`), a = c(`tl-input-desc`), o = document.querySelector(`input[name="tl-side"]:checked`);
        if (!t || !n || !a || !o) return;
        let s = t.value.trim(), u = n.value.trim(), p = a.value.trim(), m = o.value;
        if (!(!s || !u)) {
            if (i) {
                let e = r.events.find((e)=>e.id === i);
                e && (e.time = s, e.title = u, e.description = p, e.side = m);
            } else r.events.push({
                id: l(),
                time: s,
                title: u,
                description: p,
                side: m
            });
            d(), f(), v();
        }
    }
    function C() {
        a = !a;
        let e = c(`tl-timeline`), t = c(`tl-font-label`), n = c(`tl-font-btn`);
        e && e.classList.toggle(`tl-timeline--sm`, a), t && (t.textContent = a ? `Chữ thường` : `Chữ nhỏ`), n && n.classList.toggle(`tl-btn--active`, a);
    }
    function w() {
        o = !o;
        let e = c(`tl-time-style-label`), t = c(`tl-time-style-btn`);
        e && (e.textContent = o ? `Ẩn giờ` : `Hiện giờ`), t && t.classList.toggle(`tl-btn--active`, !o), f();
    }
    function T() {
        s = !s;
        let e = c(`tl-timeline`), t = c(`tl-layout-label`), n = c(`tl-layout-btn`);
        e && e.classList.toggle(`tl-timeline--horizontal`, s), t && (t.textContent = s ? `Dọc` : `Ngang`), n && n.classList.toggle(`tl-btn--active`, s);
    }
    async function E() {
        let t = c(`tl-timeline`);
        if (!t || r.events.length === 0) return;
        let n = c(`tl-export-btn`);
        n && (n.setAttribute(`disabled`, `true`), n.style.opacity = `0.5`);
        let i = t.classList.contains(`tl-timeline--horizontal`), a = null;
        i && (a = {
            overflow: t.style.overflow,
            width: t.style.width
        }, t.style.overflow = `visible`, t.style.width = `${t.scrollWidth}px`);
        try {
            let { toPng: n } = await e(async ()=>{
                let { toPng: e } = await import(`./es.BOAyukm3.js`).then(async (m)=>{
                    await m.__tla;
                    return m;
                });
                return {
                    toPng: e
                };
            }, []), r = await n(t, {
                backgroundColor: `#ffffff`,
                pixelRatio: 2
            }), i = document.createElement(`a`);
            i.download = `timeline.png`, i.href = r, i.click();
        } catch (e) {
            console.error(`Error exporting image:`, e), alert(`Không thể xuất ảnh. Vui lòng thử lại.`);
        } finally{
            i && a && (t.style.overflow = a.overflow, t.style.width = a.width), n && (n.removeAttribute(`disabled`), n.style.opacity = ``);
        }
    }
    function D() {
        u(), f();
        let e = c(`tl-add-btn`);
        e && e.addEventListener(`click`, ()=>_(`add`));
        let t = c(`tl-form`);
        t && t.addEventListener(`submit`, S);
        let n = c(`tl-cancel-btn`);
        n && n.addEventListener(`click`, v);
        let r = c(`tl-font-btn`);
        r && r.addEventListener(`click`, C);
        let i = c(`tl-time-style-btn`);
        i && i.addEventListener(`click`, w);
        let a = c(`tl-layout-btn`);
        a && a.addEventListener(`click`, T);
        let o = c(`tl-export-btn`);
        o && o.addEventListener(`click`, E);
    }
    document.addEventListener(`DOMContentLoaded`, D);
})();
