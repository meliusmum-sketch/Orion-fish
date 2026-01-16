// site.js — ORION FISH i18n (FR/EN) + language toggle (robust)
// Fix: consistent storage key + emits both events for compatibility
(() => {
  const STORAGE_KEY = "orion_lang_v1";
  const LEGACY_KEY = "orion_lang"; // used by some widgets

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

      // HOME
      home_kicker: "Agroalimentaire B2B",
      home_h1: "ORION FISH – Produits de la mer & jus de fruits",
      home_sub: "Produits de la mer, transformation de fruits en jus, vente et distribution au service des marchés locaux et internationaux.",
      home_p: "Solutions fiables, traçables et conformes. Formats professionnels, logistique et support export.",
      home_cta_rfq: "Demander un devis (RFQ)",
      home_cta_docs: "Documents & conformité",
      home_cta_help: "Assistance",

      home_card1_label: "B2B",
      home_card1_title: "Formats professionnels",
      home_card1_li1: "Spécifications sur demande",
      home_card1_li2: "Packaging & étiquetage",
      home_card1_li3: "Volumes adaptés",

      home_card2_label: "Qualité",
      home_card2_title: "Traçabilité",
      home_card2_li1: "Traçabilité par lots",
      home_card2_li2: "Contrôles qualité",
      home_card2_li3: "Conformité",

      home_card3_label: "Export",
      home_card3_title: "Support",
      home_card3_li1: "Documents selon destination",
      home_card3_li2: "Incoterms & logistique",
      home_card3_li3: "Suivi & délais",

      home_gallery_h2: "Galerie",
      home_gallery_p: "Sélection de visuels ORION FISH (uploadés aujourd’hui).",

      home_product_h2: "Produits de la mer",
      home_product_p: "Formats B2B, traçabilité, conditionnement.",

      home_video_label: "ORION FISH",
      home_video_h2: "Production & sourcing",
      home_video_p: "Chaîne de valeur B2B : sélection, contrôle, conditionnement et expédition.",
      home_video_cta_rfq: "RFQ",
      home_video_cta_docs: "Documents",

      // RFQ page
      rfq_h1: "RFQ / Demande de devis",
      rfq_intro: "Formulaire B2B : produits de la mer / fruits & jus. Nous répondons avec disponibilité, spécifications et conditions.",
      rfq_ai: "Assistance",
      rfq_form_h2: "Formulaire RFQ",
      rfq_product: "Produit",
      rfq_format: "Format / Spécification",
      rfq_qty: "Quantité estimée",
      rfq_incoterm: "Incoterm (optionnel)",
      rfq_send: "Envoyer la RFQ",
      rfq_hint: "Réponse par e-mail dès que possible.",

      // Documents
      docs_breadcrumb: "Documents & conformité",
      docs_h1: "Documents & conformité",
      docs_intro: "Nous partageons les documents nécessaires aux partenaires et acheteurs (B2B) sur demande, selon la destination, le produit et le cadre de collaboration.",
      docs_cta_rfq: "Faire une RFQ",
      docs_cta_request: "Demander des documents",
      docs_cta_chat: "Assistance",
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

      docs_note: "Les documents fournis dépendent du produit (mer/jus), du format, de la destination et du niveau d’avancement de la collaboration.",
      docs_request_h2: "Demande de documents",
      docs_request_intro: "Indique ton entreprise, le produit concerné et la destination. Nous reviendrons vers toi avec les documents pertinents.",

      // Forms
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

      // Contact
      contact_h2: "Contact",
      contact_p2: "Pour un devis rapide, utilisez la page RFQ.",
      contact_send: "Envoyer",
      contact_assist: "Assistance",

      // Privacy
      privacy_h1: "Privacy & Terms",
      privacy_intro: "Cette page décrit l’utilisation des cookies, la collecte minimale de données et les formulaires de contact du site ORION FISH.",
      privacy_data_h2: "Données & formulaires",
      privacy_data_p: "Lorsque vous envoyez un message (contact / RFQ / documents), les informations saisies (nom, email, téléphone, message) sont transmises à ORION FISH pour traiter votre demande.",
      privacy_cookies_h2: "Cookies",
      privacy_cookies_p: "Le site utilise un outil de gestion du consentement. Les scripts d’analyse (Google Analytics) ne se chargent qu’après consentement. Des cookies techniques peuvent être utilisés pour le fonctionnement et la sécurité.",
      privacy_contact_h2: "Contact",
      privacy_footer_note: "Mise à jour : Janvier 2026. Cette page peut évoluer selon les besoins légaux et techniques.",

      // Merci
      thanks_h1: "Merci !",
      thanks_p: "Votre message a bien été reçu. Nous reviendrons vers vous dès que possible.",
      thanks_back: "Retour à l’accueil"
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

      // HOME
      home_kicker: "B2B Agrifood",
      home_h1: "ORION FISH – Seafood & Fruit Juices",
      home_sub: "Seafood products and fruit-to-juice processing for local and international B2B markets.",
      home_p: "Reliable, traceable and compliant solutions. Professional formats, logistics and export support.",
      home_cta_rfq: "Request a quote (RFQ)",
      home_cta_docs: "Documents & compliance",
      home_cta_help: "Assistance",

      home_card1_label: "B2B",
      home_card1_title: "Professional formats",
      home_card1_li1: "Specs on request",
      home_card1_li2: "Packaging & labeling",
      home_card1_li3: "Adapted volumes",

      home_card2_label: "Quality",
      home_card2_title: "Traceability",
      home_card2_li1: "Batch traceability",
      home_card2_li2: "Quality checks",
      home_card2_li3: "Compliance",

      home_card3_label: "Export",
      home_card3_title: "Support",
      home_card3_li1: "Docs by destination",
      home_card3_li2: "Incoterms & logistics",
      home_card3_li3: "Lead time tracking",

      home_gallery_h2: "Gallery",
      home_gallery_p: "Selected ORION FISH visuals (uploaded today).",

      home_product_h2: "Seafood",
      home_product_p: "B2B formats, traceability, packing.",

      home_video_label: "ORION FISH",
      home_video_h2: "Production & sourcing",
      home_video_p: "B2B value chain: selection, quality control, packing and shipping.",
      home_video_cta_rfq: "RFQ",
      home_video_cta_docs: "Documents",

      // RFQ
      rfq_h1: "RFQ / Request a quote",
      rfq_intro: "B2B form: seafood / fruit & juices. We respond with availability, specs and terms.",
      rfq_ai: "Assistance",
      rfq_form_h2: "RFQ form",
      rfq_product: "Product",
      rfq_format: "Format / Specification",
      rfq_qty: "Estimated quantity",
      rfq_incoterm: "Incoterm (optional)",
      rfq_send: "Send RFQ",
      rfq_hint: "We reply by email as soon as possible.",

      // Documents
      docs_breadcrumb: "Documents & compliance",
      docs_h1: "Documents & compliance",
      docs_intro: "We share required documents with partners and buyers (B2B) upon request, depending on destination, product and collaboration stage.",
      docs_cta_rfq: "Start an RFQ",
      docs_cta_request: "Request documents",
      docs_cta_chat: "Assistance",
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
      docs_card_export_li1: "Export docs (by country)",
      docs_card_export_li2: "Packaging / labeling",
      docs_card_export_li3: "Incoterms & logistics",

      docs_note: "Provided documents depend on product, format, destination and collaboration stage.",
      docs_request_h2: "Document request",
      docs_request_intro: "Please indicate your company, product and destination. We will get back with the relevant documents.",

      // Forms
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

      // Contact
      contact_h2: "Contact",
      contact_p2: "For a quick quote, use the RFQ page.",
      contact_send: "Send",
      contact_assist: "Assistance",

      // Privacy
      privacy_h1: "Privacy & Terms",
      privacy_intro: "This page explains cookies, minimal data collection and contact forms on the ORION FISH website.",
      privacy_data_h2: "Data & forms",
      privacy_data_p: "When you submit a message (contact / RFQ / documents), the information entered (name, email, phone, message) is sent to ORION FISH to process your request.",
      privacy_cookies_h2: "Cookies",
      privacy_cookies_p: "The site uses a consent manager. Analytics scripts (Google Analytics) load only after consent. Technical cookies may be used for security and operation.",
      privacy_contact_h2: "Contact",
      privacy_footer_note: "Updated: January 2026. This page may evolve with legal and technical requirements.",

      // Thanks
      thanks_h1: "Thank you!",
      thanks_p: "Your message has been received. We will get back to you as soon as possible.",
      thanks_back: "Back to home"
    }
  };

  function detectInitialLang(){
    const stored = (localStorage.getItem(STORAGE_KEY) || "").toLowerCase();
    if (stored === "fr" || stored === "en") return stored;

    const htmlLang = (document.documentElement.getAttribute("lang") || "").toLowerCase();
    if (htmlLang.startsWith("fr")) return "fr";
    if (htmlLang.startsWith("en")) return "en";

    const navLang = (navigator.language || "en").toLowerCase();
    return navLang.startsWith("fr") ? "fr" : "en";
  }

  function tr(lang, key){
    return (I18N[lang] && I18N[lang][key]) || (I18N.en && I18N.en[key]) || (I18N.fr && I18N.fr[key]) || "";
  }

  function applyLang(lang){
    localStorage.setItem(STORAGE_KEY, lang);
    localStorage.setItem(LEGACY_KEY, lang); // for widgets
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

    // Emit both events (compat)
    document.dispatchEvent(new CustomEvent("orion:lang", { detail: { lang } }));
    window.dispatchEvent(new CustomEvent("orion-lang-change", { detail: { lang } }));
  }

  function toggleLang(){
    const current = (localStorage.getItem(STORAGE_KEY) || detectInitialLang()).toLowerCase();
    applyLang(current === "fr" ? "en" : "fr");
  }

  function init(){
    applyLang(detectInitialLang());
    const btn = document.getElementById("langBtn");
    if (btn) btn.addEventListener("click", toggleLang);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
