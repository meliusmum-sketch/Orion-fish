// orion-ai.js — Orion Fish Assistant Widget
(function () {
  const STORAGE_KEY = "orion_ai_chat_v1";
  const LANG_KEY = "orion_lang"; // site.js also sets this

  function detectLang() {
    const stored = (localStorage.getItem(LANG_KEY) || "").toLowerCase();
    if (stored === "fr" || stored === "en") return stored;

    const htmlLang = (document.documentElement.getAttribute("lang") || "").toLowerCase();
    const navLang = (navigator.language || "en").toLowerCase();
    const lang = (htmlLang || navLang);
    return lang.startsWith("fr") ? "fr" : "en";
  }

  function t(lang, key) {
    const dict = {
      fr: {
        launcherAria: "Ouvrir le chat Orion fish Assistant",
        title: "Orion fish Assistant",
        placeholder: "Posez votre question (FR/EN)…",
        send: "Envoyer",
        hello: "Bonjour ! Comment puis-je vous aider ? (Produits mer / Jus / RFQ / Documents)",
        err: "Désolé — je n’arrive pas à me connecter à Orion fish Assistant."
      },
      en: {
        launcherAria: "Chat with Orion fish Assistant",
        title: "Orion fish Assistant",
        placeholder: "Ask a question (FR/EN)…",
        send: "Send",
        hello: "Hello! How can I help? (Seafood / Juices / RFQ / Documents)",
        err: "Sorry — I couldn't connect to Orion fish Assistant."
      }
    };
    return (dict[lang] && dict[lang][key]) || dict.en[key] || "";
  }

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
    const data = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(data?.error || `HTTP ${r.status}`);
    return data;
  }

  function init() {
    let lang = detectLang();

    const launcher = el("button", {
      id: "orion-ai-launcher",
      type: "button",
      "aria-label": t(lang, "launcherAria")
    }, ["AI"]);

    const panel = el("div", { id: "orion-ai-panel", class: "hidden" }, []);
    const header = el("div", { class: "orion-ai-header" }, [
      el("div", { class: "orion-ai-title", id: "orionAiTitle" }, [t(lang, "title")]),
      el("button", { class: "orion-ai-close", type: "button", "aria-label": "Close" }, ["×"])
    ]);

    const body = el("div", { class: "orion-ai-body" }, []);
    const footer = el("div", { class: "orion-ai-footer" }, []);
    const input = el("input", {
      class: "orion-ai-input",
      type: "text",
      placeholder: t(lang, "placeholder")
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

    function openChat() { panel.classList.remove("hidden"); input.focus(); }
    function closeChat() { panel.classList.add("hidden"); }

    window.OrionFishAssistant = { open: openChat, close: closeChat };

    launcher.addEventListener("click", openChat);
    header.querySelector(".orion-ai-close").addEventListener("click", closeChat);

    document.addEventListener("click", (e) => {
      const target = e.target.closest && e.target.closest('[data-orion-ai-open="1"]');
      if (target) { e.preventDefault(); openChat(); }
    });

    // i18n events (both)
    function onLangChange(newLang){
      lang = (newLang === "fr" || newLang === "en") ? newLang : detectLang();
      launcher.setAttribute("aria-label", t(lang, "launcherAria"));
      const titleNode = document.getElementById("orionAiTitle");
      if (titleNode) titleNode.textContent = t(lang, "title");
      input.setAttribute("placeholder", t(lang, "placeholder"));
      send.textContent = t(lang, "send");
    }
    document.addEventListener("orion:lang", (e) => onLangChange(e?.detail?.lang));
    window.addEventListener("orion-lang-change", (e) => onLangChange(e?.detail?.lang));

    async function onSend() {
      const text = input.value.trim();
      if (!text) return;
      input.value = "";

      history.push({ role: "user", content: text });
      saveHistory(history);
      renderMessages(body, history);

      history.push({ role: "assistant", content: "…" });
      renderMessages(body, history);

      try {
        const data = await callAI(history.filter(m => m.content !== "…"));
        history.pop();
        history.push({ role: "assistant", content: data.reply || "OK." });
        saveHistory(history);
        renderMessages(body, history);
      } catch (e) {
        history.pop();
        history.push({ role: "assistant", content: `${t(lang, "err")} (${e.message || e})` });
        saveHistory(history);
        renderMessages(body, history);
      }
    }

    send.addEventListener("click", onSend);
    input.addEventListener("keydown", (e) => { if (e.key === "Enter") onSend(); });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
