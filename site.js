/* =========================================================
   ORION FISH — site.js
   - Language switch (FR/EN) with localStorage
   - Applies translations on elements with data-i18n
   - Updates button label (EN/FR)
   - Sets footer year if #year exists
   - Emits event: "orion-lang-change"
   ========================================================= */

(function () {
  const LANG_KEY = "orion_lang";

  const I18N = {
    fr: {
      nav_home: "Accueil",
      nav_rfq: "RFQ / Devis",
      nav_docs: "Documents",
      nav_contact: "Contact",
      nav_legal: "Mentions",
      nav_privacy: "Privacy & Terms",
      nav_cheese: "Fromage (bientôt)",

      home_h1: "ORION FISH – Produits de la mer & jus de fruits",
      home_sub:
        "Produits de la mer, transformation de fruits en jus, vente et distribution au service des marchés locaux et internationaux.",
      home_p:
        "Nous accompagnons distributeurs, industriels et professionnels avec des solutions fiables, tracées et conformes aux exigences.",
      home_cta_rfq: "Demander un devis (RFQ)",
      home_cta_docs: "Documents (sur demande)",
      home_open_docs: "Ouvrir Documents",
      home_talk: "Parler à l’équipe",

      common_quick_title: "Informations rapides",
      common_loc: "Localisation :",
      common_phone: "Tel/WhatsApp :",
      common_email: "Email :",

      about_h2: "À propos d’ORION FISH",
      about_p1:
        "Entreprise agroalimentaire spécialisée dans la valorisation des produits de la mer et la transformation de fruits en jus.",
      about_p2:
        "Ambition : développer des filières durables et compétitives, adaptées aux besoins B2B.",

      sea_h2: "Produits de la mer",
      sea_p: "Collecte, transformation, conditionnement et distribution.",

      juice_h2: "Fruits & jus",
      juice_p: "Sélection, transformation et conditionnement selon marché.",

      contact_h2: "Contact",
      contact_p1:
        "Pour toute demande d’information ou partenariat, contactez-nous.",
      contact_p2: "Pour un devis rapide, utilisez la page RFQ.",

      docs_h1: "Documents & conformité",
      docs_intro:
        "Nous partageons les documents nécessaires aux partenaires et acheteurs (B2B) sur demande, selon la destination, le produit et le cadre de collaboration.",
      docs_cta_rfq: "Faire une RFQ",
      docs_cta_request: "Demander des documents",
      docs_cta_ai: "Parler à Orion fish Assistant",

      rfq_h1: "Demande de devis (RFQ)",
      rfq_sub:
        "Indiquez le produit, le format, la quantité et la destination. Nous vous répondrons rapidement."
    },

    en: {
      nav_home: "Home",
      nav_rfq: "RFQ / Quote",
      nav_docs: "Compliance",
      nav_contact: "Contact",
      nav_legal: "Legal",
      nav_privacy: "Privacy & Terms",
      nav_cheese: "Cheese (coming soon)",

      home_h1: "ORION FISH – Seafood & Fruit Juices",
      home_sub:
        "Seafood, fruit-to-juice processing, sales and distribution for local and international markets.",
      home_p:
        "We support distributors, industrial partners and professionals with reliable, traceable and compliant solutions.",
      home_cta_rfq: "Request a quote (RFQ)",
      home_cta_docs: "Compliance documents (on request)",
      home_open_docs: "Open Compliance",
      home_talk: "Talk to the team",

      common_quick_title: "Quick info",
      common_loc: "Location:",
      common_phone: "Phone/WhatsApp:",
      common_email: "Email:",

      about_h2: "About ORION FISH",
      about_p1:
        "Food company specialized in seafood value chain and fruit-to-juice processing.",
      about_p2:
        "Ambition: develop sustainable and competitive supply chains tailored to B2B needs.",

      sea_h2: "Seafood",
      sea_p: "Sourcing, processing, packaging and distribution.",

      juice_h2: "Fruits & juices",
      juice_p: "Selection, processing and packaging according to market needs.",

      contact_h2: "Contact",
      contact_p1:
        "For any information request or partnership, please contact us.",
      contact_p2: "For a fast quote, please use the RFQ page.",

      docs_h1: "Compliance documents",
      docs_intro:
        "We share the required B2B documents on request, depending on destination, product and collaboration stage.",
      docs_cta_rfq: "Start an RFQ",
      docs_cta_request: "Request documents",
      docs_cta_ai: "Chat with Orion fish Assistant",

      rfq_h1: "Request for Quotation (RFQ)",
      rfq_sub:
        "Share product, format, quantity and destination. We will reply quickly."
    }
  };

  function detectLang() {
    const stored = (localStorage.getItem(LANG_KEY) || "").toLowerCase();
    if (stored === "fr" || stored === "en") return stored;

    const htmlLang = (document.documentElement.getAttribute("lang") || "").toLowerCase();
    const navLang = (navigator.language || "en").toLowerCase();
    const lang = (htmlLang || navLang);
    return lang.startsWith("fr") ? "fr" : "en";
  }

  function tr(lang, key) {
    return (I18N[lang] && I18N[lang][key]) || (I18N.en[key] || "");
  }

  function applyLang(lang) {
    // set html lang
    document.documentElement.setAttribute("lang", lang);

    // translate text nodes
    document.querySelectorAll("[data-i18n]").forEach((node) => {
      const key = node.getAttribute("data-i18n");
      const val = tr(lang, key);
      if (val) node.textContent = val;
    });

    // translate placeholders if used
    document.querySelectorAll("[data-i18n-placeholder]").forEach((node) => {
      const key = node.getAttribute("data-i18n-placeholder");
      const val = tr(lang, key);
      if (val) node.setAttribute("placeholder", val);
    });

    // update language button label (shows the OTHER language)
    const btn = document.getElementById("langBtn");
    if (btn) btn.textContent = (lang === "fr") ? "EN" : "FR";

    // store
    localStorage.setItem(LANG_KEY, lang);

    // notify other scripts (assistant)
    window.dispatchEvent(new CustomEvent("orion-lang-change", { detail: { lang } }));
  }

  function toggleLang() {
    const current = detectLang();
    const next = current === "fr" ? "en" : "fr";
    applyLang(next);
  }

  function setYear() {
    const y = document.getElementById("year");
    if (y && !String(y.textContent || "").trim()) {
      y.textContent = new Date().getFullYear();
    }
  }

  function init() {
    setYear();

    // apply initial lang
    applyLang(detectLang());

    // bind button
    const btn = document.getElementById("langBtn");
    if (btn) btn.addEventListener("click", toggleLang);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
