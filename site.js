(() => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // Footer year
  $$("#year, #y").forEach(el => { el.textContent = String(new Date().getFullYear()); });

  // i18n (minimal, utile surtout pour nav)
  const dict = {
    fr: {
      nav_home: "Accueil",
      nav_rfq: "RFQ / Devis",
      nav_docs: "Documents",
      nav_contact: "Contact",
      nav_legal: "Mentions",
      nav_privacy: "Privacy & Terms"
    },
    en: {
      nav_home: "Home",
      nav_rfq: "RFQ / Quotation",
      nav_docs: "Documents",
      nav_contact: "Contact",
      nav_legal: "Legal",
      nav_privacy: "Privacy & Terms"
    }
  };

  function applyLang(lang) {
    document.documentElement.lang = lang;
    const d = dict[lang] || dict.fr;

    $$("[data-i18n]").forEach(el => {
      const k = el.getAttribute("data-i18n");
      if (d[k]) el.textContent = d[k];
    });

    // Privacy long blocks
    $$("[data-lang]").forEach(el => {
      el.hidden = el.getAttribute("data-lang") !== lang;
    });

    const btn = $("#langBtn");
    if (btn) btn.textContent = (lang === "fr") ? "EN" : "FR";
    localStorage.setItem("lang", lang);
  }

  // init lang
  const stored = localStorage.getItem("lang");
  const initial = stored || ((navigator.language || "").toLowerCase().startsWith("fr") ? "fr" : "en");
  applyLang(initial);

  const langBtn = $("#langBtn");
  if (langBtn) {
    langBtn.addEventListener("click", () => {
      applyLang(document.documentElement.lang === "fr" ? "en" : "fr");
    });
  }

  // HOME tabs => set cat input
  const tabs = $$(".tab[data-cat]");
  const catInput = $("#cat");
  if (tabs.length && catInput) {
    tabs.forEach(btn => {
      btn.addEventListener("click", () => {
        tabs.forEach(b => b.setAttribute("aria-selected", "false"));
        btn.setAttribute("aria-selected", "true");
        catInput.value = btn.getAttribute("data-cat") || "all";
      });
    });
  }

  // Catalog (éditable)
  const CATALOG = [
    // SEAFOOD
    { id: "tuna", cat: "seafood", name: "Thon (Tuna)", tags: ["thon","tuna","loin","steak","fresh","frozen","saku"] },
    { id: "shrimp", cat: "seafood", name: "Crevette (Shrimp)", tags: ["crevette","shrimp","whole","peeled","fresh","frozen"] },
    { id: "octopus", cat: "seafood", name: "Poulpe (Octopus)", tags: ["poulpe","octopus","frozen"] },
    { id: "squid", cat: "seafood", name: "Calamar (Squid)", tags: ["calamar","squid","tube","ring","frozen"] },
    { id: "cuttlefish", cat: "seafood", name: "Seiche (Cuttlefish)", tags: ["seiche","cuttlefish"] },
    { id: "sardine", cat: "seafood", name: "Sardine", tags: ["sardine"] },
    { id: "mackerel", cat: "seafood", name: "Maquereau (Mackerel)", tags: ["maquereau","mackerel"] },
    { id: "hake", cat: "seafood", name: "Merlu (Hake)", tags: ["merlu","hake","fillet"] },
    // JUICE / FRUITS
    { id: "mango", cat: "juice", name: "Mangue (Mango) – fruit / jus", tags: ["mangue","mango","juice","jus","puree"] },
    { id: "pineapple", cat: "juice", name: "Ananas (Pineapple) – fruit / jus", tags: ["ananas","pineapple","juice","jus"] },
    { id: "orange", cat: "juice", name: "Orange – jus", tags: ["orange","juice","jus"] },
    { id: "guava", cat: "juice", name: "Goyave (Guava) – jus", tags: ["goyave","guava","juice","jus"] },
    { id: "passion", cat: "juice", name: "Fruit de la passion – jus", tags: ["passion","maracuja","juice","jus"] },
    { id: "hibiscus", cat: "juice", name: "Bissap (Hibiscus) – boisson", tags: ["bissap","hibiscus","drink","boisson"] },
    { id: "ginger", cat: "juice", name: "Gingembre – boisson", tags: ["gingembre","ginger","drink","boisson"] }
  ];

  const normalize = (s) =>
    (s || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();

  function scoreItem(tokens, item) {
    const hay = normalize([item.name, ...(item.tags || [])].join(" "));
    let score = 0;
    for (const t of tokens) {
      if (!t) continue;
      if (hay.includes(t)) score += (t.length >= 5 ? 3 : 2);
      if (normalize(item.name).includes(t)) score += 2;
    }
    return score;
  }

  function searchCatalog(query, cat) {
    const q = normalize(query);
    const tokens = q.split(/\s+/).filter(Boolean);
    const c = (cat || "all").toLowerCase();

    const pool = CATALOG.filter(it => c === "all" ? true : it.cat === c);

    return pool
      .map(it => ({ it, s: scoreItem(tokens, it) }))
      .filter(x => tokens.length === 0 ? true : x.s > 0)
      .sort((a,b) => b.s - a.s)
      .map(x => x.it);
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

  // Render results on search.html
  const resultsEl = $("#results");
  const metaEl = $("#resultsMeta");
  if (resultsEl && metaEl) {
    const params = new URLSearchParams(location.search);
    const q = params.get("q") || "";
    const cat = params.get("cat") || "all";

    const q2 = $("#q2");
    const catSelect = $("#catSelect");
    if (q2) q2.value = q;
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
            ? "Try: tuna, shrimp, mango, pineapple, hibiscus."
            : "Essaie : thon, crevette, mangue, ananas, bissap."}
        </p>`;
      resultsEl.appendChild(empty);
    } else {
      list.forEach(item => {
        const rfqCat = (item.cat === "seafood") ? "Seafood" : "Juices";
        const rfqUrl = `/rfq.html?category=${encodeURIComponent(rfqCat)}&product=${encodeURIComponent(item.name)}`;

        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
          <div style="display:flex;justify-content:space-between;gap:12px;align-items:flex-start;flex-wrap:wrap;">
            <div>
              <span class="label">${catLabel(item.cat, lang)}</span>
              <strong style="display:block;margin-top:6px">${item.name}</strong>
              <p class="muted" style="margin:6px 0 0">B2B • Formats & specs sur demande.</p>
            </div>
            <div style="display:flex;gap:10px;flex-wrap:wrap;">
              <a class="btn btn-primary" href="${rfqUrl}">RFQ</a>
              <a class="btn btn-outline" href="/compliance.html">Docs</a>
            </div>
          </div>
        `;
        resultsEl.appendChild(card);
      });
    }
  }

  // Prefill RFQ from URL
  const rfqForm = $("form[data-rfq-form]");
  if (rfqForm) {
    const params = new URLSearchParams(location.search);
    const cat = params.get("category");
    const product = params.get("product");

    const catSel = $("#category");
    const prodInput = $("#product");
    const msg = $("#message");

    if (cat && catSel) {
      const v = (cat === "Seafood" || cat === "Juices" || cat === "Other") ? cat : "";
      if (v) catSel.value = v;
    }
    if (product && prodInput) {
      prodInput.value = product;
      if (msg && !msg.value) {
        msg.value = `Produit : ${product}\nMerci d’indiquer disponibilité, MOQ, pricing, packaging, et délais.`;
      }
    }
  }
})();
// --- ORION AI Widget (simple) ---
(function () {
  const STORAGE_KEY = "orion_ai_chat_v1";

  function loadHistory() {
    try { return JSON.parse(sessionStorage.getItem(STORAGE_KEY) || "[]"); }
    catch { return []; }
  }
  function saveHistory(items) {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(items.slice(-20)));
  }

  function el(tag, attrs = {}, children = []) {
    const node = document.createElement(tag);
    Object.entries(attrs).forEach(([k, v]) => {
      if (k === "class") node.className = v;
      else if (k === "html") node.innerHTML = v;
      else node.setAttribute(k, v);
    });
    children.forEach(c => node.appendChild(typeof c === "string" ? document.createTextNode(c) : c));
    return node;
  }

  function renderMessages(container, history) {
    container.innerHTML = "";
    history.forEach(m => {
      container.appendChild(el("div", { class: `orion-ai-msg ${m.role}` }, [
        el("div", { class: "orion-ai-bubble" }, [m.content])
      ]));
    });
    container.scrollTop = container.scrollHeight;
  }

  async function callAI(history) {
    const r = await fetch("/api/orion-ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: history })
    });
    const data = await r.json();
    if (!r.ok) throw new Error(data?.error || "API error");
    return data;
  }

  function init() {
    // Launcher
    const launcher = el("button", { id: "orion-ai-launcher", type: "button", "aria-label": "Chat with ORION FISH" }, ["AI"]);

    // Panel
    const panel = el("div", { id: "orion-ai-panel", class: "hidden" }, []);
    const header = el("div", { class: "orion-ai-header" }, [
      el("div", { class: "orion-ai-title" }, ["ORION FISH — Assistant"]),
      el("button", { class: "orion-ai-close", type: "button", "aria-label": "Close" }, ["×"])
    ]);

    const body = el("div", { class: "orion-ai-body" }, []);
    const footer = el("div", { class: "orion-ai-footer" }, []);
    const input = el("input", { class: "orion-ai-input", type: "text", placeholder: "Ask a question (FR/EN)..." });
    const send = el("button", { class: "orion-ai-send", type: "button" }, ["Send"]);

    footer.appendChild(input);
    footer.appendChild(send);
    panel.appendChild(header);
    panel.appendChild(body);
    panel.appendChild(footer);

    document.body.appendChild(launcher);
    document.body.appendChild(panel);

    let history = loadHistory();
    if (history.length === 0) {
      history = [{ role: "assistant", content: "Hello! How can ORION FISH help you today? (Seafood / Fruit juice / RFQ / Compliance)" }];
      saveHistory(history);
    }
    renderMessages(body, history);

    function toggle(open) {
      panel.classList.toggle("hidden", !open);
    }

    launcher.addEventListener("click", () => toggle(true));
    header.querySelector(".orion-ai-close").addEventListener("click", () => toggle(false));

    async function onSend() {
      const text = input.value.trim();
      if (!text) return;
      input.value = "";

      history.push({ role: "user", content: text });
      saveHistory(history);
      renderMessages(body, history);

      // typing
      const typing = { role: "assistant", content: "…" };
      history.push(typing);
      renderMessages(body, history);

      try {
        const data = await callAI(history.filter(m => m.content !== "…"));
        // replace typing
        history.pop();
        history.push({ role: "assistant", content: data.reply || "OK." });

        // If it's an RFQ, also show a small summary
        if (data.intent === "rfq") {
          const missing = (data.missing_fields || []).join(", ");
          if (missing) {
            history.push({ role: "assistant", content: `To prepare your RFQ, I still need: ${missing}.` });
          } else {
            history.push({ role: "assistant", content: "Your RFQ looks complete. You can also submit it via the RFQ page: /rfq.html" });
          }
        }

        saveHistory(history);
        renderMessages(body, history);
      } catch (e) {
        history.pop();
        history.push({ role: "assistant", content: "Sorry — I couldn't connect to the assistant. Please try again or email contact@orionsfish.com." });
        saveHistory(history);
        renderMessages(body, history);
      }
    }

    send.addEventListener("click", onSend);
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") onSend();
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
