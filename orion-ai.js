// --- Orion Fish Assistant Widget (Christmas) ---
// File: /orion-ai.js
(function () {
  const STORAGE_KEY = "orion_ai_chat_v1";
  const LANG_KEY = "orion_lang"; // ✅ mise à jour d’hier (site.js)
  const HISTORY_LIMIT = 20;
  const API_ENDPOINT = "/api/orion-ai";

  function getLang() {
    // 1) priorité à la langue du site (mise à jour d’hier)
    const saved = (localStorage.getItem(LANG_KEY) || "").toLowerCase();
    if (saved === "fr" || saved === "en") return saved;

    // 2) html lang
    const htmlLang = (document.documentElement.getAttribute("lang") || "").toLowerCase();
    if (htmlLang.startsWith("fr")) return "fr";
    if (htmlLang.startsWith("en")) return "en";

    // 3) navigateur
    const navLang = (navigator.language || "en").toLowerCase();
    return navLang.startsWith("fr") ? "fr" : "en";
  }

  function dict() {
    return {
      fr: {
        launcherAria: "Ouvrir le chat Orion Fish Assistant",
        title: "Orion Fish Assistant",
        close: "Fermer",
        placeholder: "Posez votre question (FR/EN)…",
        send: "Envoyer",
        hello:
          "Bonjour ! Je suis Orion Fish Assistant 🎄 Comment puis-je vous aider ? (Produits mer / Jus / Devis RFQ / Documents)",
        rfqNeed: "Pour préparer votre RFQ, il me manque : ",
        rfqDone: "Votre RFQ est complète. Vous pouvez aussi l’envoyer via : /rfq.html",
        err: "Désolé — je n’arrive pas à me connecter à Orion Fish Assistant."
      },
      en: {
        launcherAria: "Chat with Orion Fish Assistant",
        title: "Orion Fish Assistant",
        close: "Close",
        placeholder: "Ask a question (FR/EN)…",
        send: "Send",
        hello:
          "Hello! I’m Orion Fish Assistant 🎄 How can I help you today? (Seafood / Fruit juice / RFQ / Compliance)",
        rfqNeed: "To prepare your RFQ, I still need: ",
        rfqDone: "Your RFQ looks complete. You can also submit it via: /rfq.html",
        err: "Sorry — I couldn't connect to Orion Fish Assistant."
      }
    };
  }

  function t(lang, key) {
    const d = dict();
    return (d[lang] && d[lang][key]) || (d.en && d.en[key]) || "";
  }

  function loadHistory() {
    try {
      return JSON.parse(sessionStorage.getItem(STORAGE_KEY) || "[]");
    } catch {
      return [];
    }
  }

  function saveHistory(items) {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(items.slice(-HISTORY_LIMIT)));
  }

  function el(tag, attrs = {}, children = []) {
    const node = document.createElement(tag);
    Object.entries(attrs).forEach(([k, v]) => {
      if (k === "class") node.className = v;
      else if (k === "html") node.innerHTML = v;
      else node.setAttribute(k, v);
    });
    children.forEach((c) => node.appendChild(typeof c === "string" ? document.createTextNode(c) : c));
    return node;
  }

  function renderMessages(container, history) {
    container.innerHTML = "";
    history.forEach((m) => {
      container.appendChild(
        el("div", { class: `orion-ai-msg ${m.role}` }, [
          el("div", { class: "orion-ai-bubble" }, [m.content])
        ])
      );
    });
    container.scrollTop = container.scrollHeight;
  }

  async function callAI(history) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 45000);

    try {
      const r = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
        signal: controller.signal
      });

      const data = await r.json().catch(() => ({}));
      if (!r.ok) {
        const msg = data?.details?.error?.message || data?.error || `HTTP ${r.status}`;
        throw new Error(msg);
      }
      return data;
    } finally {
      clearTimeout(timeout);
    }
  }

  function init() {
    // ✅ éviter double injection si le script se charge 2 fois
    if (document.getElementById("orion-ai-launcher") || document.getElementById("orion-ai-panel")) return;

    let lang = getLang();

    const launcher = el(
      "button",
      {
        id: "orion-ai-launcher",
        type: "button",
        "aria-label": t(lang, "launcherAria"),
        title: t(lang, "title")
      },
      ["🎄"]
    );

    const panel = el("div", { id: "orion-ai-panel", class: "hidden", role: "dialog", "aria-modal": "false" }, []);
    const header = el("div", { class: "orion-ai-header" }, [
      el("div", { class: "orion-ai-title" }, [t(lang, "title")]),
      el("button", { class: "orion-ai-close", type: "button", "aria-label": t(lang, "close") }, ["×"])
    ]);

    const body = el("div", { class: "orion-ai-body" }, []);
    const footer = el("div", { class: "orion-ai-footer" }, []);
    const input = el("input", {
      class: "orion-ai-input",
      type: "text",
      placeholder: t(lang, "placeholder"),
      autocomplete: "off"
    });
    const send = el("button", { class: "orion-ai-send", type: "button" }, [t(lang, "send")]);

    footer.appendChild(input);
    footer.appendChild(send);
    panel.appendChild(header);
    panel.appendChild(body);
    panel.appendChild(footer);

    document.body.appendChild(launcher);
    document.body.appendChild(panel);

    let history = loadHistory();
    if (history.length === 0) {
      history = [{ role: "assistant", content: t(lang, "hello") }];
      saveHistory(history);
    }
    renderMessages(body, history);

    function openChat() {
      panel.classList.remove("hidden");
      input.focus();
    }
    function closeChat() {
      panel.classList.add("hidden");
    }

    // Expose for other buttons
    window.OrionFishAssistant = { open: openChat, close: closeChat };

    launcher.addEventListener("click", openChat);
    header.querySelector(".orion-ai-close").addEventListener("click", closeChat);

    // Any element with data-orion-ai-open="1" will open chat
    document.addEventListener("click", (e) => {
      const target = e.target && e.target.closest ? e.target.closest('[data-orion-ai-open="1"]') : null;
      if (target) {
        e.preventDefault();
        openChat();
      }
    });

    // ✅ Met à jour les textes si la langue change (html lang ou localStorage)
    function refreshLang() {
      const newLang = getLang();
      if (newLang === lang) return;
      lang = newLang;

      launcher.setAttribute("aria-label", t(lang, "launcherAria"));
      launcher.setAttribute("title", t(lang, "title"));
      header.querySelector(".orion-ai-title").textContent = t(lang, "title");
      header.querySelector(".orion-ai-close").setAttribute("aria-label", t(lang, "close"));
      input.setAttribute("placeholder", t(lang, "placeholder"));
      send.textContent = t(lang, "send");
    }

    // 1) observe <html lang="">
    const mo = new MutationObserver(() => refreshLang());
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });

    // 2) observe localStorage (si changement via onglet différent)
    window.addEventListener("storage", (e) => {
      if (e.key === LANG_KEY) refreshLang();
    });

    async function onSend() {
      const text = input.value.trim();
      if (!text) return;
      input.value = "";

      history.push({ role: "user", content: text });
      saveHistory(history);
      renderMessages(body, history);

      const typing = { role: "assistant", content: "…" };
      history.push(typing);
      renderMessages(body, history);

      try {
        const payload = history.filter((m) => m.content !== "…");
        const data = await callAI(payload);

        history.pop(); // remove typing
        history.push({ role: "assistant", content: data.reply || "OK." });

        if (data.intent === "rfq") {
          const missing = Array.isArray(data.missing_fields) ? data.missing_fields : [];
          if (missing.length) {
            history.push({ role: "assistant", content: t(lang, "rfqNeed") + missing.join(", ") + "." });
          } else {
            history.push({ role: "assistant", content: t(lang, "rfqDone") });
          }
        }

        saveHistory(history);
        renderMessages(body, history);
      } catch (e) {
        history.pop(); // remove typing
        history.push({
          role: "assistant",
          content: `${t(lang, "err")} (${(e && e.message) ? e.message : String(e)})`
        });
        saveHistory(history);
        renderMessages(body, history);
      }
    }

    send.addEventListener("click", onSend);
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") onSend();
      if (e.key === "Escape") closeChat();
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();

