(() => {
  const KEY = "orion_cookie_consent"; // "accept" | "refuse"

  const i18n = {
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

  function getLang() {
    const l = (document.documentElement.lang || "fr").toLowerCase();
    return l.startsWith("en") ? "en" : "fr";
  }

  function getChoice() {
    try { return localStorage.getItem(KEY); } catch { return null; }
  }
  function setChoice(v) {
    try { localStorage.setItem(KEY, v); } catch {}
  }
  function clearChoice() {
    try { localStorage.removeItem(KEY); } catch {}
  }

  function buildBanner() {
    if (document.getElementById("cookieBanner")) return;

    const t = i18n[getLang()];
    const el = document.createElement("div");
    el.id = "cookieBanner";
    el.className = "cookie-banner";
    el.setAttribute("role", "dialog");
    el.setAttribute("aria-live", "polite");

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

  function showBanner() {
    buildBanner();
    const el = document.getElementById("cookieBanner");
    if (el) el.classList.add("is-open");
  }

  document.addEventListener("DOMContentLoaded", () => {
    // Si déjà accepté/refusé, ne pas afficher
    if (getChoice()) return;

    // Afficher à la première visite
    showBanner();

    // Optionnel : bouton "réafficher" sur privacy.html si tu en as un
    const resetBtn = document.getElementById("reset-cookies");
    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        clearChoice();
        showBanner();
      });
    }
  });

  // Helper (utile si tu ajoutes Analytics/Pixel plus tard)
  window.orionCookies = {
    get: getChoice,
    reset: () => { clearChoice(); showBanner(); }
  };
})();
