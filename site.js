/* =========================================================
   ORION FISH — site.js (FR/EN)
   - Language switch (FR/EN) with localStorage
   - Translates elements with data-i18n
   - Translates placeholders with data-i18n-placeholder
   - Updates button label (EN/FR)
   - Sets footer year if #year exists
   - Emits event: "orion-lang-change" for the AI widget
   ========================================================= */

(function () {
  const LANG_KEY = "orion_lang";

  const I18N = {
    fr: {
      // Nav
      nav_home: "Accueil",
      nav_rfq: "RFQ / Devis",
      nav_docs: "Documents",
      nav_contact: "Contact",
      nav_legal: "Mentions",
      nav_privacy: "Privacy & Terms",
      nav_cheese: "Fromage (bientôt)",

      // Home
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

      // Docs page
      docs_h1: "Documents & conformité",
      docs_intro:
        "Nous partageons les documents nécessaires aux partenaires et acheteurs (B2B) sur demande, selon la destination, le produit et le cadre de collaboration.",
      docs_cta_rfq: "Faire une RFQ",
      docs_cta_request: "Demander des documents",
      docs_cta_ai: "Parler à Orion fish Assistant",
      docs_types_h2: "Types de documents (exemples)",
      docs_note:
        "Les documents fournis dépendent du produit (mer/jus), du format, de la destination et du niveau d’avancement de la collaboration.",
      docs_req_h2: "Demande de documents",
      docs_req_p:
        "Indique ton entreprise, le produit concerné et la destination. Nous reviendrons vers toi avec les documents pertinents.",
      docs_btn_send: "Envoyer",

      // RFQ page
      rfq_h1: "Demande de devis (RFQ)",
      rfq_sub:
        "Indiquez le produit, le format, la quantité et la destination. Nous vous répondrons rapidement.",
      rfq_prefill: "Pré-rempli depuis la recherche : ",
      rfq_btn_send: "Envoyer la RFQ",
      rfq_open_ai: "Parler à Orion fish Assistant",

      // Cheese page
      cheese_h1: "Transformation du lait en fromage",
      cheese_sub:
        "Nouveau projet ORION FISH — en cours de prospection. Mise en production prévue prochainement.",
      cheese_badge: "Bientôt",
      cheese_status_h2: "Statut du projet",
      cheese_status_p:
        "Cette activité est actuellement en cours de prospection (équipements, chaîne de production, partenaires). La mise en place opérationnelle est prévue prochainement.",
      cheese_scope_h2: "Ce que nous préparons",
      cheese_scope_li1: "Étude technique & dimensionnement de la ligne",
      cheese_scope_li2: "Sélection des équipements & plan de formation",
      cheese_scope_li3: "Organisation de la qualité, hygiène & traçabilité",
      cheese_scope_li4: "Définition des formats B2B et conditionnement",
      cheese_timeline_h2: "Calendrier indicatif",
      cheese_timeline_p:
        "Objectif : déploiement progressif et montée en capacité. Cible projet : fin décembre 2026 (selon validation technique et livraison des équipements).",
      cheese_contact_h2: "Intérêt / partenariat",
      cheese_contact_p:
        "Vous souhaitez échanger sur ce projet (équipements, matières premières, distribution) ? Contactez-nous ou ouvrez le chat.",

      // Placeholders
      ph_company: "Nom / Company",
      ph_email: "name@company.com",
      ph_phone: "+221 ...",
      ph_destination: "Ex: France, Pays-Bas, Sénégal...",
      ph_product: "Ex: thon, crevette, jus d’ananas...",
      ph_docs: "Ex: specs, traçabilité, fiche société...",
      ph_message_docs: "Précise ton besoin et ton contexte (B2B, appel d’offres, etc.)",
      ph_rfq_product: "Produit / Product (ex: lait, fromage, thon, jus...)",
      ph_rfq_format: "Format (ex: vrac, cartons, bouteilles, kg...)",
      ph_rfq_qty: "Quantité estimée (ex: 1T, 5T, 10 000 unités...)",
      ph_rfq_incoterm: "Incoterm (EXW, FOB, CIF...)",
      ph_rfq_deadline: "Date souhaitée (optionnel)",
      ph_rfq_message: "Détails : spécifications, emballage, destination, contraintes..."
    },

    en: {
      // Nav
      nav_home: "Home",
      nav_rfq: "RFQ / Quote",
      nav_docs: "Compliance",
      nav_contact: "Contact",
      nav_legal: "Legal",
      nav_privacy: "Privacy & Terms",
      nav_cheese: "Cheese (coming soon)",

      // Home
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

      // Docs page
      docs_h1: "Compliance documents",
      docs_intro:
        "We share the required B2B documents on request, depending on destination, product and collaboration stage.",
      docs_cta_rfq: "Start an RFQ",
      docs_cta_request: "Request documents",
      docs_cta_ai: "Chat with Orion fish Assistant",
      docs_types_h2: "Document types (examples)",
      docs_note:
        "Provided documents depend on the product (seafood/juice), format, destination and collaboration stage.",
      docs_req_h2: "Request documents",
      docs_req_p:
        "Share your company, the product and destination. We will get back to you with the relevant documents.",
      docs_btn_send: "Send",

      // RFQ page
      rfq_h1: "Request for Quotation (RFQ)",
      rfq_sub:
        "Provide product, format, quantity and destination. We will reply quickly.",
      rfq_prefill: "Prefilled from search: ",
      rfq_btn_send: "Send RFQ",
      rfq_open_ai: "Chat with Orion fish Assistant",

      // Cheese page
      cheese_h1: "Milk-to-cheese processing",
      cheese_sub:
        "New ORION FISH project — currently under prospecting. Production will start soon.",
      cheese_badge: "Coming soon",
      cheese_status_h2: "Project status",
      cheese_status_p:
        "This activity is currently under prospecting (equipment, production line, partners). Operational setup will start soon.",
      cheese_scope_h2: "What we are preparing",
      cheese_scope_li1: "Technical study & line sizing",
      cheese_scope_li2: "Equipment selection & training plan",
      cheese_scope_li3: "Quality, hygiene & traceability setup",
      cheese_scope_li4: "B2B formats and packaging definition",
      cheese_timeline_h2: "Indicative timeline",
      cheese_timeline_p:
        "Goal: progressive rollout and capacity ramp-up. Project target: end of December 2026 (subject to technical validation and equipment delivery).",
      cheese_contact_h2: "Interest / partnership",
      cheese_contact_p:
        "Want to discuss this project (equipment, raw materials, distribution)? Contact us or open the chat.",

      // Placeholders
      ph_company: "Name / Company",
      ph_email: "name@company.com",
      ph_phone: "+221 ...",
      ph_destination: "e.g., France, Netherlands, Senegal...",
      ph_product: "e.g., tuna, shrimp, pineapple juice...",
      ph_docs: "e.g., specs, traceability, company profile...",
      ph_message_docs: "Please describe your request and context (B2B, tender, etc.)",
      ph_rfq_product: "Product (e.g., milk, cheese, tuna, juice...)",
      ph_rfq_format: "Format (bulk, cartons, bottles, kg...)",
      ph_rfq_qty: "Estimated quantity (e.g., 1T, 5T, 10,000 units...)",
      ph_rfq_incoterm: "Incoterm (EXW, FOB, CIF...)",
      ph_rfq_deadline: "Desired date (optional)",
      ph_rfq_message: "Details: specs, packaging, destination, constraints..."
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
    document.documentElement.setAttribute("lang", lang);

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

    const btn = document.getElementById("langBtn");
    if (btn) btn.textContent = (lang === "fr") ? "EN" : "FR";

    localStorage.setItem(LANG_KEY, lang);

    window.dispatchEvent(new CustomEvent("orion-lang-change", { detail: { lang } }));
  }

  function toggleLang() {
    const current = detectLang();
    applyLang(current === "fr" ? "en" : "fr");
  }

  function setYear() {
    const y = document.getElementById("year");
    if (y && !String(y.textContent || "").trim()) y.textContent = new Date().getFullYear();
  }

  function init() {
    setYear();
    applyLang(detectLang());

    const btn = document.getElementById("langBtn");
    if (btn) btn.addEventListener("click", toggleLang);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
