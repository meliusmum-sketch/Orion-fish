// site.js — ORION FISH i18n (FR/EN) + language toggle + cookie notice
(() => {
  const STORAGE_KEY = "orion_lang_v1";
  const LEGACY_LANG_KEY = "orion_lang"; // compat for other scripts

  const I18N = {
    fr: {
      nav_home: "Accueil",
      nav_rfq: "RFQ / Devis",
      nav_docs: "Documents",
      nav_cheese: "Fromage (bientôt)",
      nav_contact: "Contact",
      nav_privacy: "Privacy & Terms",

      docs_breadcrumb: "Documents & conformité",
      docs_h1: "Documents & conformité",
      docs_intro:
        "Nous partageons les documents nécessaires aux partenaires et acheteurs (B2B) sur demande, selon la destination, le produit et le cadre de collaboration.",
      docs_cta_rfq: "Faire une RFQ",
      docs_cta_request: "Demander des documents",
      docs_cta_chat: "Parler à Orion fish Assistant",
      docs_types_h2: "Types de documents (exemples)",

      form_company: "Nom / Entreprise",
      form_email: "E-mail",
      form_phone_wa: "Téléphone / WhatsApp",
      form_destination: "Destination (pays)",
      form_product: "Produit concerné",
      form_docs_wanted: "Documents souhaités",
      form_message: "Message",
      form_send: "Envoyer",

      ph_company: "Nom / Company",
      ph_email: "name@company.com",
      ph_phone: "+221 ...",
      ph_destination: "Ex: France, Pays-Bas, Sénégal...",
      ph_product: "Ex: thon, crevette, jus d’ananas...",
      ph_docs_wanted: "Ex: specs, traçabilité, fiche société...",
      ph_message: "Précise ton besoin et ton contexte (B2B, appel d’offres, etc.)",

      privacy_h1: "Privacy & Terms",
      privacy_cookies_h2: "Cookies",
      privacy_cookies_p:
        "Nous utilisons des cookies techniques nécessaires au fonctionnement. Google Analytics (mesure d’audience) est chargé uniquement après votre consentement via le bandeau ConsentManager.",
      privacy_reset: "Réinitialiser les préférences cookies",

      thanks_h1: "Merci",
      thanks_p: "Votre message a bien été envoyé. Nous revenons vers vous dès que possible."
    },
    en: {
      nav_home: "Home",
      nav_rfq: "RFQ / Quote",
      nav_docs: "Documents",
      nav_cheese: "Cheese (coming soon)",
      nav_contact: "Contact",
      nav_privacy: "Privacy & Terms",

      docs_breadcrumb: "Documents & compliance",
      docs_h1: "Documents & compliance",
      docs_intro:
        "We share required documents with partners and buyers (B2B) upon request, depending on destination, product and collaboration stage.",
      docs_cta_rfq: "Start an RFQ",
      docs_cta_request: "Request documents",
      docs_cta_chat: "Talk to Orion fish Assistant",
      docs_types_h2: "Document types (examples)",

      form_company: "Name / Company",
      form_email: "Email",
      form_phone_wa: "Phone / WhatsApp",
      form_destination: "Destination (country)",
      form_product: "Product",
      form_docs_wanted: "Requested documents",
      form_message: "Message",
      form_send: "Send",

      ph_company: "Name / Company",
      ph_email: "name@company.com",
      ph_phone: "+221 ...",
      ph_destination: "e.g., France, Netherlands, Senegal...",
      ph_product: "e.g., tuna, shrimp, pineapple juice...",
      ph_docs_wanted: "e.g., specs, traceability, company profile...",
      ph_message: "Please describe your request and context (B2B, tender, etc.)",

      privacy_h1: "Privacy & Terms",
      privacy_cookies_h2: "Cookies",
      privacy_cookies_p:
        "We use technical cookies required for the website. Google Analytics (audience measurement) is loaded only after your consent via the ConsentManager banner.",
      privacy_reset: "Reset cookie preferences",

      thanks_h1: "Thank you",
      thanks_p: "Your message has been sent. We will get back to you as soon as possible."
    }
  };

  function detectInitialLang() {
    const stored = (localStorage.getItem(STORAGE_KEY) || "").toLowerCase();
    if (stored === "fr" || stored === "en") return stored;

    const htmlLang = (document.documentElement.getAttribute("lang") || "").toLowerCase();
    if (htmlLang.startsWith("fr")) return "fr";
    if (htmlLang.startsWith("en")) return "en";

    const navLang = (navigator.language || "en").toLowerCase();
    return navLang.startsWith("fr") ? "fr" : "en";
  }

  function tr(lang, key) {
    return (I18N[lang] && I18N[lang][key]) || (I18N.en && I18N.en[key]) || "";
  }

  function applyLang(lang) {
    localStorage.setItem(STORAGE_KEY, lang);
    localStorage.setItem(LEGACY_LANG_KEY, lang); // compat
    document.documentElement.setAttribute("lang", lang);

    const btn = document.getElementById("langBtn");
    if (btn) btn.textContent = lang === "fr" ? "EN" : "FR";

    document.querySelectorAll("[data-i18n]").forEach((node) => {
      const key = node.getAttribute("data-i18n");
      const val = tr(lang, key);
      if (val) node.textContent = val;
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach((node) => {
      const key = node.getAttribute("data-i18n-placeholder");
      const val = tr(lang, key);
      if (val) node.setAttribute("placeholder", val);
    });

    const y = document.getElementById("year");
    if (y && !y.textContent.trim()) y.textContent = new Date().getFullYear();

    // 2 events for compatibility
    document.dispatchEvent(new CustomEvent("orion:lang", { detail: { lang } }));
    window.dispatchEvent(new CustomEvent("orion-lang-change", { detail: { lang } }));
  }

  function toggleLang() {
    const current = detectInitialLang();
    applyLang(current === "fr" ? "en" : "fr");
  }

  function initLang() {
    applyLang(detectInitialLang());
    const btn = document.getElementById("langBtn");
    if (btn) btn.addEventListener("click", toggleLang);
  }

  /* ========== Cookie notice (ORION FISH) ========== */
  const NOTICE_KEY = "of_cookie_notice_v1";

  function safeGet(key) {
    try { return window.localStorage.getItem(key); }
    catch {
      const m = document.cookie.match(new RegExp("(^| )" + key + "=([^;]+)"));
      return m ? decodeURIComponent(m[2]) : null;
    }
  }

  function safeSet(key, value, maxAgeSeconds) {
    try { window.localStorage.setItem(key, value); }
    catch {
      const maxAge = typeof maxAgeSeconds === "number" ? "; Max-Age=" + maxAgeSeconds : "";
      document.cookie =
        key + "=" + encodeURIComponent(value) + maxAge + "; Path=/; SameSite=Lax" + (location.protocol === "https:" ? "; Secure" : "");
    }
  }

  function safeRemove(key) {
    try { window.localStorage.removeItem(key); }
    catch {
      document.cookie = key + "=; Max-Age=0; Path=/; SameSite=Lax" + (location.protocol === "https:" ? "; Secure" : "");
    }
  }

  function mountBanner() {
    if (safeGet(NOTICE_KEY) === "dismissed") return;

    const html = `
      <div class="cookie-banner" role="dialog" aria-live="polite" aria-label="Information cookies">
        <div class="cookie-banner__inner">
          <p>
            Nous utilisons des cookies techniques nécessaires au fonctionnement.
            Google Analytics (mesure d’audience) est chargé uniquement après votre consentement via le bandeau ConsentManager.
            <a href="/privacy.html#cookies">En savoir plus</a>
          </p>
          <button class="cookie-banner__btn" type="button">OK</button>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML("beforeend", html);

    const banner = document.querySelector(".cookie-banner");
    const btn = banner && banner.querySelector(".cookie-banner__btn");
    if (!btn) return;

    btn.addEventListener("click", () => {
      safeSet(NOTICE_KEY, "dismissed", 15552000); // ~6 months
      banner.remove();
    });
  }

  function bindResetButton() {
    const resetBtn = document.getElementById("reset-cookies");
    if (!resetBtn) return;
    resetBtn.addEventListener("click", () => {
      safeRemove(NOTICE_KEY);
      location.reload();
    });
  }

  function init() {
    initLang();
    mountBanner();
    bindResetButton();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
