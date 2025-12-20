(() => {
  const KEY = "orion_cookie_consent"; // "accept" | "refuse"

  const TEXT = {
    fr: {
      title: "Cookies",
      message:
        "ORION FISH utilise uniquement des cookies techniques nécessaires au fonctionnement et à la sécurité. Aucun cookie publicitaire ni mesure d’audience.",
      accept: "Accepter",
      refuse: "Refuser",
      more: "En savoir plus"
    },
    en: {
      title: "Cookies",
      message:
        "ORION FISH only uses strictly necessary cookies for operation and security. No advertising or analytics cookies.",
      accept: "Accept",
      refuse: "Refuse",
      more: "Learn more"
    }
  };

  function lang() {
    const l = (document.documentElement.lang || "fr").toLowerCase();
    return l.startsWith("en") ? "en" : "fr";
  }

  function getChoice() {
    try { return localStorage.getItem(KEY); } catch { return null; }
  }

  function setChoice(v) {
    try { localStorage.setItem(KEY, v); } catch {}
    document.documentElement.setAttribute("data-cookie-consent", v);
    window.dispatchEvent(new CustomEvent("orion-cookie-consent", { detail: { value: v } }));
  }

  function clearChoice() {
    try { localStorage.removeItem(KEY); } catch {}
    document.documentElement.removeAttribute("data-cookie-consent");
  }

  function ensureBanner() {
    if (document.getElementById("cookieBanner")) return;

    const el = document.createElement("div");
    el.id = "cookieBanner";
    el.className = "cookie-banner";
    el.setAttribute("role", "dialog");
    el.setAttribute("aria-live", "polite");
    document.body.appendChild(el);

    el.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-cookie-action]");
      if (!btn) return;

      const action = btn.getAttribute("data-cookie-action");
      if (action === "accept") setChoice("accept");
      if (action === "refuse") setChoice("refuse");

      el.classList.remove("is-open");
    });
  }

  function renderBanner() {
    const el = document.getElementById("cookieBanner");
    if (!el) return;

    const t = TEXT[lang()];
    el.innerHTML = `
      <div class="cookie-inner">
        <div class="cookie-text">
          <strong class="cookie-title">${t.title}</strong>
          <p class="cookie-msg">
            ${t.message}
            <a href="/privacy.html#cookies" class="cookie-link">${t.more}</a>
          </p>
        </div>

        <div class="cookie-actions">
          <button type="button" class="cookie-btn secondary" data-cookie-action="refuse">${t.refuse}</button>
          <button type="button" class="cookie-btn primary" data-cookie-action="accept">${t.accept}</button>
        </div>
      </div>
    `;
  }

  function showBanner() {
    ensureBanner();
    renderBanner();
    const el = document.getElementById("cookieBanner");
    if (el) el.classList.add("is-open");
  }

  function hideBanner() {
    const el = document.getElementById("cookieBanner");
    if (el) el.classList.remove("is-open");
  }

  // Si la langue change (bouton FR/EN), on re-render le bandeau (si pas encore choisi)
  function observeLangChanges() {
    const obs = new MutationObserver(() => {
      if (getChoice()) return;
      const el = document.getElementById("cookieBanner");
      if (el && el.classList.contains("is-open")) renderBanner();
    });
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
  }

  // API utile pour analytics/pixel plus tard
  window.orionCookies = {
    get: getChoice,
    reset: () => { clearChoice(); showBanner(); },
    runIfAccepted: (fn) => {
      const v = getChoice();
      if (v === "accept") fn();
      window.addEventListener("orion-cookie-consent", (e) => {
        if (e?.detail?.value === "accept") fn();
      });
    }
  };

  document.addEventListener("DOMContentLoaded", () => {
    observeLangChanges();

    const v = getChoice();
    if (v === "accept" || v === "refuse") {
      document.documentElement.setAttribute("data-cookie-consent", v);
      hideBanner();
      return;
    }

    showBanner();

    // Si tu as un bouton reset sur privacy.html
    const resetBtn = document.getElementById("reset-cookies");
    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        clearChoice();
        showBanner();
      });
    }
  });
})();
