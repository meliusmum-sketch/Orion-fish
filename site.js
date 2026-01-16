// site.js — ORION FISH i18n (FR/EN) + language toggle (robust)
// + sync with Orion AI (localStorage key + event)
(() => {
  const STORAGE_KEY = "orion_lang_v1";
  const MIRROR_KEY  = "orion_lang"; // used by orion-ai.js

  const I18N = {
    fr: {
      // NAV
      nav_home: "Accueil",
      nav_rfq: "RFQ / Devis",
      nav_docs: "Documents",
      nav_cheese: "Fromage (bientôt)",
      nav_contact: "Contact",
      nav_legal: "Mentions",
      nav_privacy: "Privacy & Terms",

      // HOME (new)
      home_hero_h1: "Produits de la mer & jus — Sourcing, transformation & export B2B",
      home_hero_sub: "Formats professionnels, traçabilité, qualité et support export pour marchés locaux et internationaux.",
      home_hero_link_rfq: "RFQ / Devis",
      home_hero_link_docs: "Documents & conformité",
      home_hero_link_contact: "Contact (WhatsApp / Email)",
      home_hero_btn_rfq: "Demander un devis",
      home_hero_btn_help: "Assistance",

      home_range_h2: "Notre gamme",
      home_range_p: "Seafood & Juices — solutions B2B adaptées aux distributeurs, industriels et professionnels.",
      home_range_li_sea: "Produits de la mer",
      home_range_li_juice: "Fruits & jus",
      home_range_li_quality: "Qualité & conformité",
      home_range_li_export: "Export & logistique",
      home_range_li_rfq: "RFQ",
      home_range_li_docs: "Docs",

      home_video_h2: "Seafood — activité",
      home_video_p: "Extrait vidéo (chargement optimisé avec poster).",
      home_video_fallback: "Votre navigateur ne supporte pas la vidéo HTML5.",

      home_contact_h2: "Contact",
      home_contact_p: "Pour devis, partenariat ou sourcing : écrivez-nous.",
      home_contact_btn_rfq: "RFQ / Devis",
      home_contact_btn_help: "Assistance",

      // RFQ
      rfq_h1: "RFQ / Demande de devis",
      rfq_intro: "Formulaire B2B : produits de la mer / fruits & jus. Nous répondons avec disponibilité, spécifications et conditions.",
      rfq_tip: "Astuce : précise la destination, l’incoterm et le format (frais/surgelé, calibre, packaging) pour un devis plus rapide.",
      rfq_form_h2: "Formulaire RFQ",
      rfq_send: "Envoyer la RFQ",

      // FROMAGE
      cheese_badge: "Bientôt",
      cheese_h1: "Transformation du lait en fromage",
      cheese_sub: "Nouveau projet ORION FISH — en cours de prospection. Mise en production prévue prochainement.",
      rfq_open_ai: "Parler à Orion fish Assistant",
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

      // COMPLIANCE / DOCUMENTS
      docs_breadcrumb: "Documents & conformité",
      docs_h1: "Documents & conformité",
      docs_intro:
        "Nous partageons les documents nécessaires aux partenaires et acheteurs (B2B) sur demande, selon la destination, le produit et le cadre de collaboration.",
      docs_cta_rfq: "Faire une RFQ",
      docs_cta_request: "Demander des documents",
      docs_cta_chat: "Parler à Orion fish Assistant",
      docs_types_h2: "Types de documents (exemples)",

      docs_card_company_label: "Entreprise",
      docs_card_company_title: "Informations légales",
      docs_card_company_li1: "Registre de commerce",
      docs_card_company_li2: "Coordonnées & fiche société",
      docs_card_company_li3: "Références & contacts",

      docs_card_quality_label: "Qualité",
      docs_card_quality_title: "Conformité & traçabilité",
      docs_card_quality_li1: "Traçabilité par lots",
      docs_card_quality_li2: "Spécifications produits",
      docs_card_quality_li3: "Procédures / bonnes pratiques",

      docs_card_export_label: "Export",
      docs_card_export_title: "Documents selon destination",
      docs_card_export_li1: "Docs export (selon pays)",
      docs_card_export_li2: "Emballage / étiquetage",
      docs_card_export_li3: "Incoterms & logistique",

      docs_note:
        "Les documents fournis dépendent du produit (mer/jus), du format, de la destination et du niveau d’avancement de la collaboration.",

      docs_request_h2: "Demande de documents",
      docs_request_intro:
        "Indique ton entreprise, le produit concerné et la destination. Nous reviendrons vers toi avec les documents pertinents.",

      // Forms (shared)
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
      ph_message: "Précise ton besoin et ton contexte (B2B, appel d’offres, etc.)"
    },

    en: {
      // NAV
      nav_home: "Home",
      nav_rfq: "RFQ / Quote",
      nav_docs: "Documents",
      nav_cheese: "Cheese (coming soon)",
      nav_contact: "Contact",
      nav_legal: "Legal",
      nav_privacy: "Privacy & Terms",

      // HOME (new)
      home_hero_h1: "Seafood & Juices — B2B sourcing, processing & export",
      home_hero_sub: "Professional formats, traceability, quality standards, and export support for local and international markets.",
      home_hero_link_rfq: "RFQ / Quote",
      home_hero_link_docs: "Documents & compliance",
      home_hero_link_contact: "Contact (WhatsApp / Email)",
      home_hero_btn_rfq: "Request a quote",
      home_hero_btn_help: "Assistance",

      home_range_h2: "Our range",
      home_range_p: "Seafood & Juices — B2B solutions for distributors, manufacturers and professional buyers.",
      home_range_li_sea: "Seafood",
      home_range_li_juice: "Fruits & juices",
      home_range_li_quality: "Quality & compliance",
      home_range_li_export: "Export & logistics",
      home_range_li_rfq: "RFQ",
      home_range_li_docs: "Docs",

      home_video_h2: "Seafood — activity",
      home_video_p: "Short video clip (optimized loading with poster).",
      home_video_fallback: "Your browser does not support HTML5 video.",

      home_contact_h2: "Contact",
      home_contact_p: "For quotes, partnerships or sourcing: contact us.",
      home_contact_btn_rfq: "RFQ / Quote",
      home_contact_btn_help: "Assistance",

      // RFQ
      rfq_h1: "RFQ / Quote request",
      rfq_intro: "B2B form: seafood / fruits & juices. We reply with availability, specs and terms.",
      rfq_tip: "Tip: add destination, incoterm and format (fresh/frozen, size, packaging) to get a faster quote.",
      rfq_form_h2: "RFQ form",
      rfq_send: "Send RFQ",

      // FROMAGE
      cheese_badge: "Coming soon",
      cheese_h1: "Milk-to-cheese processing",
      cheese_sub: "New ORION FISH project — currently under sourcing. Production launch planned soon.",
      rfq_open_ai: "Talk to Orion fish Assistant",
      cheese_status_h2: "Project status",
      cheese_status_p:
        "This activity is currently under sourcing (equipment, production line, partners). Operational setup is planned soon.",
      cheese_scope_h2: "What we are preparing",
      cheese_scope_li1: "Technical study & line sizing",
      cheese_scope_li2: "Equipment selection & training plan",
      cheese_scope_li3: "Quality, hygiene & traceability setup",
      cheese_scope_li4: "Definition of B2B formats & packaging",
      cheese_timeline_h2: "Indicative timeline",
      cheese_timeline_p:
        "Goal: progressive deployment and capacity ramp-up. Target: end of December 2026 (subject to technical validation and equipment delivery).",
      cheese_contact_h2: "Interest / partnership",
      cheese_contact_p:
        "Would you like to discuss this project (equipment, raw materials, distribution)? Contact us or open the chat.",

      // COMPLIANCE / DOCUMENTS
      docs_breadcrumb: "Documents & compliance",
      docs_h1: "Documents & compliance",
      docs_intro:
        "We share the required documents with partners and buyers (B2B) upon request, depending on destination, product, and collaboration stage.",
      docs_cta_rfq: "Start an RFQ",
      docs_cta_request: "Request documents",
      docs_cta_chat: "Talk to Orion fish Assistant",
      docs_types_h2: "Document types (examples)",

      docs_card_company_label: "Company",
      docs_card_company_title: "Legal information",
      docs_card_company_li1: "Business registration",
      docs_card_company_li2: "Company profile & contacts",
      docs_card_company_li3: "References & contacts",

      docs_card_quality_label: "Quality",
      docs_card_quality_title: "Compliance & traceability",
      docs_card_quality_li1: "Batch traceability",
      docs_card_quality_li2: "Product specifications",
      docs_card_quality_li3: "Procedures / good practices",

      docs_card_export_label: "Export",
      docs_card_export_title: "Destination documents",
      docs_card_export_li1: "Export docs (depending on country)",
      docs_card_export_li2: "Packaging / labeling",
      docs_card_export_li3: "Incoterms & logistics",

      docs_note:
        "Provided documents depend on product (seafood/juice), format, destination and the progress of the collaboration.",

      docs_request_h2: "Document request",
      docs_request_intro:
        "Please indicate your company, product and destination. We will come back to you with the relevant documents.",

      // Forms (shared)
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
      ph_message: "Please describe your request and context (B2B, tender, etc.)"
    }
  };

  function detectInitialLang() {
    const stored = (localStorage.getItem(STORAGE_KEY) || "").toLowerCase();
    if (stored === "fr" || stored === "en") return stored;

    const stored2 = (localStorage.getItem(MIRROR_KEY) || "").toLowerCase();
    if (stored2 === "fr" || stored2 === "en") return stored2;

    const htmlLang = (document.documentElement.getAttribute("lang") || "").toLowerCase();
    if (htmlLang.startsWith("fr")) return "fr";
    if (htmlLang.startsWith("en")) return "en";

    const navLang = (navigator.language || "en").toLowerCase();
    return navLang.startsWith("fr") ? "fr" : "en";
  }

  function tr(lang, key) {
    return (I18N[lang] && I18N[lang][key]) || (I18N.en && I18N.en[key]) || (I18N.fr && I18N.fr[key]) || "";
  }

  function applyLang(lang) {
    localStorage.setItem(STORAGE_KEY, lang);
    localStorage.setItem(MIRROR_KEY, lang);
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

    document.querySelectorAll("option[data-i18n]").forEach((opt) => {
      const key = opt.getAttribute("data-i18n");
      const val = tr(lang, key);
      if (val) opt.textContent = val;
    });

    const y = document.getElementById("year");
    if (y && !y.textContent.trim()) y.textContent = new Date().getFullYear();

    // keep (if other scripts listen)
    document.dispatchEvent(new CustomEvent("orion:lang", { detail: { lang } }));
    // Orion AI listens to this:
    window.dispatchEvent(new CustomEvent("orion-lang-change", { detail: { lang } }));
  }

  function toggleLang() {
    const current = (document.documentElement.getAttribute("lang") || detectInitialLang()).toLowerCase();
    applyLang(current === "fr" ? "en" : "fr");
  }

  function init() {
    applyLang(detectInitialLang());
    const btn = document.getElementById("langBtn");
    if (btn) btn.addEventListener("click", toggleLang);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();

/* ========== Cookie notice (ORION FISH) ========== */
(function () {
  const KEY = "of_cookie_notice_v1";

  function safeGet(key) {
    try { return window.localStorage.getItem(key); }
    catch (e) {
      const m = document.cookie.match(new RegExp("(^| )" + key + "=([^;]+)"));
      return m ? decodeURIComponent(m[2]) : null;
    }
  }

  function safeSet(key, value, maxAgeSeconds) {
    try { window.localStorage.setItem(key, value); }
    catch (e) {
      const maxAge = typeof maxAgeSeconds === "number" ? "; Max-Age=" + maxAgeSeconds : "";
      document.cookie =
        key + "=" + encodeURIComponent(value) + maxAge + "; Path=/; SameSite=Lax" + (location.protocol === "https:" ? "; Secure" : "");
    }
  }

  function safeRemove(key) {
    try { window.localStorage.removeItem(key); }
    catch (e) {
      document.cookie = key + "=; Max-Age=0; Path=/; SameSite=Lax" + (location.protocol === "https:" ? "; Secure" : "");
    }
  }

  function mountBanner() {
    if (safeGet(KEY) === "dismissed") return;

    const html = `
      <div class="cookie-banner" role="dialog" aria-live="polite" aria-label="Information cookies" style="
        position:fixed;left:0;right:0;bottom:0;z-index:9999;
        padding:14px 18px;background:rgba(10,10,10,.95);color:#fff;
        border-top:1px solid rgba(255,255,255,.12);
      ">
        <div class="cookie-banner__inner" style="
          max-width:1200px;margin:0 auto;display:flex;gap:14px;
          align-items:flex-start;justify-content:space-between;flex-wrap:wrap;
        ">
          <p style="margin:0;max-width:78ch;">
            Nous utilisons des cookies techniques pour le fonctionnement et la sécurité.
            La mesure d’audience (GA4) est bloquée tant que vous n’avez pas donné votre consentement.
            <a href="/privacy.html#cookies" style="text-decoration:underline;color:#fff;">En savoir plus</a>
          </p>
          <button class="cookie-banner__btn" type="button" style="
            border:1px solid rgba(255,255,255,.25);background:#fff;color:#000;
            padding:8px 14px;border-radius:10px;cursor:pointer;font-weight:900;
          ">OK</button>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML("beforeend", html);

    const banner = document.querySelector(".cookie-banner");
    const btn = banner && banner.querySelector(".cookie-banner__btn");
    if (!btn) return;

    btn.addEventListener("click", function () {
      safeSet(KEY, "dismissed", 15552000); // ~6 months
      banner.remove();
    });
  }

  function bindResetButton() {
    const resetBtn = document.getElementById("reset-cookies");
    if (!resetBtn) return;
    resetBtn.addEventListener("click", function () {
      safeRemove(KEY);
      location.reload();
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    mountBanner();
    bindResetButton();
  });
})();
