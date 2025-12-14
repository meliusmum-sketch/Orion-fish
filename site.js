(() => {
  // =========================
  // 0) Helpers
  // =========================
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  function setYear() {
    $$("#year, #y").forEach(el => { el.textContent = String(new Date().getFullYear()); });
  }

  function todayISO() {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }

  function normalize(str) {
    return (str || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();
  }

  // =========================
  // 1) i18n (nav + quelques libellés)
  // =========================
  const dict = {
    fr: {
      nav_home: "Accueil",
      nav_rfq: "RFQ / Devis",
      nav_docs: "Documents",
      nav_contact: "Contact",
      nav_legal: "Mentions",
      nav_privacy: "Privacy & Terms",
    },
    en: {
      nav_home: "Home",
      nav_rfq: "RFQ / Quotation",
      nav_docs: "Documents",
      nav_contact: "Contact",
      nav_legal: "Legal",
      nav_privacy: "Privacy & Terms",
    }
  };

  function applyLang(lang) {
    document.documentElement.lang = lang;

    // data-i18n (petits textes)
    const d = dict[lang] || dict.fr;
    $$("[data-i18n]").forEach(el => {
      const key = el.getAttribute("data-i18n");
      if (d[key]) el.textContent = d[key];
    });

    // sections longues (privacy) via data-lang
    $$("[data-lang]").forEach(el => {
      el.hidden = (el.getAttribute("data-lang") !== lang);
    });

    const btn = $("#langBtn");
    if (btn) btn.textContent = (lang === "fr") ? "EN" : "FR";

    localStorage.setItem("lang", lang);
  }

  function initLang() {
    const stored = localStorage.getItem("lang");
    const initial = stored || ((navigator.language || "").toLowerCase().startsWith("fr") ? "fr" : "en");
    applyLang(initial);

    const btn = $("#langBtn");
    if (btn) {
      btn.addEventListener("click", () => {
        applyLang(document.documentElement.lang === "fr" ? "en" : "fr");
      });
    }
  }

  // =========================
  // 2) Catalogue produits (à éditer par toi)
  // =========================
  const CATALOG = [
    // SEAFOOD
    { id: "tuna",        cat: "seafood", name: "Thon (Tuna)", tags: ["thon", "tuna", "loin", "steak", "frais", "surgele"] },
    { id: "shrimp",      cat: "seafood", name: "Crevette (Shrimp)", tags: ["crevette", "shrimp", "peeled", "whole", "frais", "surgele"] },
    { id: "octopus",     cat: "seafood", name: "Poulpe (Octopus)", tags: ["poulpe", "octopus", "frozen"] },
    { id: "sardine",     cat: "seafood", name: "Sardine", tags: ["sardine", "frais", "surgele"] },
    { id: "mackerel",    cat: "seafood", name: "Maquereau (Mackerel)", tags: ["maquereau", "mackerel"] },
    { id: "tilapia",     cat: "seafood", name: "Tilapia", tags: ["tilapia", "fillet", "frais", "surgele"] },

    // JUICE / FRUITS
    { id: "mango",       cat: "juice",   name: "Mangue (Mango) – fruit / jus", tags: ["mangue", "mango", "puree", "juice", "jus"] },
    { id: "pineapple",   cat: "juice",   name: "Ananas (Pineapple) – fruit / jus", tags: ["ananas", "pineapple", "juice", "jus"] },
    { id: "orange",      cat: "juice",   name: "Orange – jus", tags: ["orange", "jus", "juice"] },
    { id: "hibiscus",    cat: "juice",   name: "Bissap (Hibiscus) – boisson", tags: ["bissap", "hibiscus", "drink", "boisson"] },
    { id: "ginger",      cat: "juice",   name: "Gingembre – boisson", tags: ["gingembre", "ginger", "drink", "boisson"] },
  ];

  function scoreItem(qTokens, item) {
    const hay = normalize([item.name, ...(item.tags || [])].join(" "));
    let score = 0;
    for (const t of qTokens) {
      if (!t) continue;
      if (hay.includes(t)) score += (t.length >= 5 ? 3 : 2);
      if (normalize(item.name).includes(t)) score += 2;
    }
    return score;
  }

  function searchCatalog(query, cat) {
    const q = normalize(query);
    const qTokens = q.split(/\s+/).filter(Boolean);
    const catNorm = (cat || "all").toLowerCase();

    const pool = CATALOG.filter(it => catNorm === "all" ? true : it.cat === catNorm);
    const scored = pool
      .map(it => ({ it, score: scoreItem(qTokens, it) }))
      .filter(x => qTokens.length === 0 ? true : x.score > 0)
      .sort((a,b) => b.score - a.score);

    return scored.map(x => x.it);
  }

  function catLabel(cat, lang) {
    const c = (cat || "all").toLowerCase();
    if (lang === "en") {
      if (c === "seafood") return "Seafood";
      if (c === "juice") return "Fruits & Juices";
      return "All";
    }
    if (c === "seafood") return "Produits de la mer";
    if (c === "juice") return "Fruits & jus";
    return "Tout";
  }

  // =========================
  // 3) Tabs (accueil)
  // =========================
  function initHomeTabs() {
    const tabs = $$(".tab[data-cat]");
    const catInput = $("#cat");
    if (!tabs.length || !catInput) return;

    tabs.forEach(btn => {
      btn.addEventListener("click", () => {
        tabs.forEach(b => b.setAttribute("aria-selected", "false"));
        btn.setAttribute("aria-selected", "true");
        catInput.value = btn.getAttribute("data-cat") || "all";
      });
    });
  }

  // =========================
  // 4) Page search.html : rendu résultats
  // =========================
  function renderSearchPage() {
    const resultsEl = $("#results");
    const metaEl = $("#resultsMeta");
    if (!resultsEl || !metaEl) return;

    const params = new URLSearchParams(location.search);
    const q = params.get("q") || "";
    const cat = params.get("cat") || "all";

    const qInput = $("#q2");
    const catSelect = $("#catSelect");
    if (qInput) qInput.value = q;
    if (catSelect) catSelect.value = cat;

    const lang = document.documentElement.lang || "fr";
    const list = searchCatalog(q, cat);

    metaEl.textContent =
      (lang === "en")
        ? `Results for "${q || "…"}" • Category: ${catLabel(cat, lang)} • ${list.length} result(s)`
        : `Résultats pour "${q || "…"}" • Catégorie : ${catLabel(cat, lang)} • ${list.length} résultat(s)`;

    resultsEl.innerHTML = "";

    if (list.length === 0) {
      const empty = document.createElement("div");
      empty.className = "panel";
      empty.innerHTML = `
        <strong>${lang === "en" ? "No match." : "Aucun résultat."}</strong>
        <p class="muted" style="margin:8px 0 0">
          ${lang === "en"
            ? "Try a different keyword (e.g., tuna, shrimp, mango, pineapple)."
            : "Essaie un autre mot (ex : thon, crevette, mangue, ananas)."}
        </p>
      `;
      resultsEl.appendChild(empty);
      return;
    }

    list.forEach(item => {
      const card = document.createElement("div");
      card.className = "card";
      const rfqCat = (item.cat === "seafood") ? "Seafood" : "Juices";
      const rfqUrl = `/rfq.html?category=${encodeURIComponent(rfqCat)}&product=${encodeURIComponent(item.name)}`;

      card.innerHTML = `
        <div style="display:flex;justify-content:space-between;gap:12px;align-items:flex-start;flex-wrap:wrap;">
          <div>
            <div class="badge">${catLabel(item.cat, lang)}</div>
            <h2 style="margin:0 0 6px">${item.name}</h2>
            <p class="muted" style="margin:0">Disponible B2B • Formats & specs sur demande.</p>
          </div>
          <div style="display:flex;gap:10px;flex-wrap:wrap;">
            <a class="btn btn-primary" href="${rfqUrl}">RFQ</a>
            <a class="btn btn-outline" href="/compliance.html">${lang === "en" ? "Docs" : "Docs"}</a>
          </div>
        </div>
      `;
      resultsEl.appendChild(card);
    });
  }

  // =========================
  // 5) Pré-remplissage RFQ depuis URL
  // =========================
  function prefillRFQ() {
    const form = $("form[data-rfq-form]");
    if (!form) return;

    const params = new URLSearchParams(location.search);
    const cat = params.get("category");
    const product = params.get("product");

    const catSel = $("#category");
    const prodInput = $("#product");
    const msg = $("#message");

    if (cat && catSel) {
      // match option value
      const v = (cat === "Seafood" || cat === "Juices" || cat === "Other") ? cat : "";
      if (v) catSel.value = v;
    }
    if (product && prodInput) {
      prodInput.value = product;
      if (msg && !msg.value) {
        msg.value = `Produit : ${product}\nMerci d’indiquer disponibilités, MOQ, pricing, packaging, et délais.`;
      }
    }
  }

  // =========================
  // Init
  // =========================
  setYear();
  initLang();
  initHomeTabs();
  renderSearchPage();
  prefillRFQ();

  // Dates privacy
  const frDate = $("#privacyDateFr");
  const enDate = $("#privacyDateEn");
  if (frDate) frDate.textContent = todayISO();
  if (enDate) enDate.textContent = todayISO();
})();
