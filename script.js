document.addEventListener("DOMContentLoaded", () => {
  const initUI = () => {
    const y = document.getElementById("year");
    if (y) y.textContent = new Date().getFullYear();

    const toggle = document.querySelector(".nav-toggle"), nav = document.querySelector(".nav");
    if (toggle && nav) toggle.addEventListener("click", () => nav.classList.toggle("open"));

    const reveals = document.querySelectorAll(".reveal");
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(entries => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add("visible"); observer.unobserve(e.target); }
      }), { threshold: .12 });
      reveals.forEach(el => observer.observe(el));
    } else reveals.forEach(el => el.classList.add("visible"));

    const filters = document.querySelectorAll(".filter"), items = document.querySelectorAll(".gallery-item");
    filters.forEach(btn => btn.addEventListener("click", () => {
      filters.forEach(b => b.classList.remove("active")); btn.classList.add("active");
      const f = btn.dataset.filter;
      items.forEach(item => item.style.display = (f === "all" || item.dataset.category === f) ? "block" : "none");
    }));

    const lightbox = document.querySelector(".lightbox"), lbImg = lightbox?.querySelector("img"), close = lightbox?.querySelector(".lightbox-close");
    document.querySelectorAll(".gallery-item img").forEach(img => img.addEventListener("click", () => {
      if (!lightbox) return;
      lbImg.src = img.src; lbImg.alt = img.alt;
      lightbox.classList.add("open"); lightbox.setAttribute("aria-hidden", "false");
    }));
    const closeLb = () => { if (lightbox) { lightbox.classList.remove("open"); lightbox.setAttribute("aria-hidden", "true"); } };
    close?.addEventListener("click", closeLb);
    lightbox?.addEventListener("click", e => { if (e.target === lightbox) closeLb(); });
    document.addEventListener("keydown", e => { if (e.key === "Escape") closeLb(); });

    initOfferModal();
  };

  const get = (obj, path) => path.split(".").reduce((v, k) => v?.[k], obj);

  function applyContent(data) {
    document.querySelectorAll("[data-site-key]").forEach(el => {
      const value = get(data, el.dataset.siteKey);
      if (value === undefined || value === null) return;
      if (el.tagName === "META") el.setAttribute("content", value);
      else el.textContent = value;
    });

    document.title = data.business.name + " | " + data.business.tagline;
    document.querySelectorAll("[data-site-phone-link]").forEach(a => a.href = "tel:" + data.business.phoneLink);
    const ld = document.querySelector('script[type="application/ld+json"]');
    if (ld) {
      try {
        const schema = JSON.parse(ld.textContent);
        schema.name = data.business.name;
        schema.description = data.business.tagline + " u " + data.business.postal + ".";
        schema.telephone = data.business.phone;
        schema.address.streetAddress = data.business.address;
        schema.address.postalCode = data.business.postal.split(" ")[0] || schema.address.postalCode;
        schema.address.addressLocality = data.business.postal.replace(/^\d+\s*/, "") || schema.address.addressLocality;
        ld.textContent = JSON.stringify(schema);
      } catch (_) {}
    }
    document.querySelectorAll("[data-site-map]").forEach(a => {
      a.href = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(data.business.address + ", " + data.business.postal);
    });

    const serviceWrap = document.querySelector("[data-site-services='main']");
    const extraWrap = document.querySelector("[data-site-services='extra']");
    const makeService = s => `
      <article class="offer-card ${s.id === "complete" || s.id === "bath" ? "main-offer" : ""} reveal">
        ${s.id === "complete" || s.id === "bath" ? `<div class="offer-number">${s.id === "complete" ? "01" : "02"}</div>` : ""}
        <div class="offer-icon">${s.icon}</div>
        <h3>${escapeHtml(s.title)}</h3>
        <p>${escapeHtml(s.short)}</p>
        <button class="offer-btn" data-offer="${escapeHtml(s.id)}">Saznaj više <span>→</span></button>
      </article>`;
    if (serviceWrap) serviceWrap.innerHTML = data.services.slice(0,2).map(makeService).join("");
    if (extraWrap) extraWrap.innerHTML = data.services.slice(2).map(makeService).join("");

    const mainCard = document.querySelector("[data-site-price-card='main']");
    const extraCard = document.querySelector("[data-site-price-card='extra']");
    const makePrices = (title, rows) => `
      <div class="price-head"><h2>${escapeHtml(title)}</h2><span>od</span></div>
      ${rows.map(r => `<div class="price-row"><span>${escapeHtml(r.name)}</span><b>${escapeHtml(r.price)}</b></div>`).join("")}`;
    if (mainCard) mainCard.innerHTML = makePrices("Njega & grooming", data.prices);
    if (extraCard) extraCard.innerHTML = makePrices("Dodatna njega", data.extraPrices);
    const note = document.querySelector("[data-site-key='priceNote']");
    if (note) note.textContent = data.priceNote;

    const gallery = document.querySelector("[data-site-gallery]");
    if (gallery) {
      gallery.innerHTML = data.gallery.map((g, i) => `
        <figure class="gallery-item ${i === 0 || i === 6 ? "tall " : ""}${i === 1 || i === 4 ? "wide " : ""}${escapeHtml(g.category)}" data-category="${escapeHtml(g.category)}">
          <img src="${escapeAttr(g.image)}" alt="${escapeAttr(g.alt)}"><figcaption>${escapeHtml(g.caption)}</figcaption>
        </figure>`).join("");
      // Re-bind gallery interactions after dynamic rendering.
      const filters = document.querySelectorAll(".filter"), items = gallery.querySelectorAll(".gallery-item");
      filters.forEach(btn => btn.onclick = () => {
        filters.forEach(b => b.classList.remove("active")); btn.classList.add("active");
        const f = btn.dataset.filter;
        items.forEach(item => item.style.display = (f === "all" || item.dataset.category === f) ? "block" : "none");
      });
      const lightbox = document.querySelector(".lightbox"), lbImg = lightbox?.querySelector("img");
      gallery.querySelectorAll("img").forEach(img => img.onclick = () => {
        if (!lightbox) return;
        lbImg.src = img.src; lbImg.alt = img.alt;
        lightbox.classList.add("open"); lightbox.setAttribute("aria-hidden", "false");
      });
    }
  }

  function escapeHtml(v) {
    return String(v).replace(/[&<>"']/g, c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#039;" }[c]));
  }
  function escapeAttr(v) { return escapeHtml(v); }

  let siteData = null;
  function initOfferModal() {
    const offerModal = document.getElementById("offerModal");
    if (!offerModal) return;
    const modalTitle = document.getElementById("modalTitle"), modalText = document.getElementById("modalText");
    const closeModal = () => {
      offerModal.classList.remove("open"); offerModal.setAttribute("aria-hidden","true"); document.body.style.overflow = "";
    };
    document.addEventListener("click", e => {
      const btn = e.target.closest(".offer-btn");
      if (!btn || !siteData) return;
      const item = siteData.services.find(s => s.id === btn.dataset.offer);
      if (!item) return;
      modalTitle.textContent = item.title; modalText.textContent = item.details;
      offerModal.classList.add("open"); offerModal.setAttribute("aria-hidden","false"); document.body.style.overflow = "hidden";
    });
    offerModal.querySelector(".modal-close")?.addEventListener("click", closeModal);
    offerModal.querySelector(".offer-modal-backdrop")?.addEventListener("click", closeModal);
    document.addEventListener("keydown", e => { if(e.key === "Escape") closeModal(); });
  }

  function handleForm(e) {
    const form = e.target;
    if (form.dataset.netlify === "true") return true;
    e.preventDefault();
    const note = document.getElementById("form-note");
    if (note) note.textContent = "Hvala na upitu!";
    form.reset(); return false;
  }
  window.handleForm = handleForm;

  fetch("content/site.json")
    .then(r => { if (!r.ok) throw new Error("content/site.json nije pronađen"); return r.json(); })
    .then(data => { siteData = data; applyContent(data); initUI(); })
    .catch(err => { console.warn(err); initUI(); });
});
