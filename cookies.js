/* ORION FISH — Cookie banner (Option 3: Accepter / Refuser)
   - Stockage du choix en localStorage (pas de cookie publicitaire par défaut)
   - Charge GA4 / Meta Pixel UNIQUEMENT si "Accepter"
   - Anti-bug: si un autre script supprime le bandeau, on le ré-injecte
*/

(() => {
  "use strict";

  // =========================
  // 1) CONFIG (optionnel)
  // =========================
  const OF_TRACKING = {
    // Exemple GA4: "G-XXXXXXXXXX"
    GA4_ID: "",

    // Exemple Meta Pixel: "123456789012345"
    META_PIXEL_ID: ""
  };

  // =========================
  // 2) KEYS
  // =========================
  const STORAGE_KEY = "of_cookie_consent_v1"; // "accept" | "reject"
  const STORAGE_TS = "of_cookie_consent_ts_v1"; // timestamp ms
  const CONSENT_TTL_DAYS = 180; // 6 mois

  // =========================
  // 3) TEXTES (FR/EN)
  // =========================
  const I18N = {
    fr: {
      title: "Cookies & confidentialité",
      text:
        "ORION FISH utilise des cookies techniques nécessaires au fonctionnement. " +
        "Avec votre accord, nous pouvons activer des outils de mesure d’audience et/ou pixels marketing.",
      accept: "Accepter",
      reject: "Refuser",
      more: "En savoir plus (Privacy)",
      manage: "Gérer les cookies"
    },
    en: {
      title: "Cookies & privacy",
      text:
        "ORION FISH uses strictly necessary technical cookies for website operation. " +
        "With your permission, we may enable analytics and/or marketing pixels.",
      accept: "Accept",
      reject: "Reject",
      more: "Learn more (Privacy)",
      manage: "Manage cookies"
    }
  };

  // =========================
  // 4) HELPERS
  // =========================
  function getLang() {
    const stored = (localStorage.getItem("lang") || "").toLowerCase();
    const docLang = (document.documentElement.lang || "").toLowerCase();

    const lang = stored || docLang || "fr";
    return lang.startsWith("fr") ? "fr" : "en";
  }

  function now() {
    return Date.now();
  }

  function isExpired(ts) {
    if (!ts) return true;
    const ttlMs = CONSENT_TTL_DAYS * 24 * 60 * 60 * 1000;
    return (now() - ts) > ttlMs;
  }

  function getConsent() {
    const v = localStorage.getItem(STORAGE_KEY);
    const tsRaw = localStorage.getItem(STORAGE_TS);
    const ts = tsRaw ? Number(tsRaw) : 0;

    if (!v) return null;
    if (!ts || Number.isNaN(ts) || isExpired(ts)) {
      // expire => reset
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(STORAGE_TS);
      return null;
    }
    if (v === "accept" || v === "reject") return v;
    return null;
  }

  function setConsent(value) {
    localStorage.setItem(STORAGE_KEY, value);
    localStorage.setItem(STORAGE_TS, String(now()));
  }

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = src;
      s.async = true;
      s.onload = () => resolve(true);
      s.onerror = () => reject(new Error("Failed to load: " + src));
      document.head.appendChild(s);
    });
  }

  // =========================
  // 5) TRACKERS (chargés seulement si accept)
  // =========================
  let trackersLoaded = false;

  function loadGA4(ga4Id) {
    if (!ga4Id) return;

    // gtag
    if (window.dataLayer && window.gtag) return;

    window.dataLayer = window.dataLayer || [];
    function gtag(){ window.dataLayer.push(arguments); }
    window.gtag = gtag;

    gtag("js", new Date());
    gtag("config", ga4Id, { anonymize_ip: true });

    loadScript(`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(ga4Id)}`)
      .catch(() => {/* silencieux */});
  }

  function loadMetaPixel(pixelId) {
    if (!pixelId) return;
    if (window.fbq) return;

    // Snippet Meta Pixel (version standard)
    !(function(f,b,e,v,n,t,s){
      if(f.fbq)return; n=f.fbq=function(){ n.callMethod ?
        n.callMethod.apply(n,arguments) : n.queue.push(arguments) };
      if(!f._fbq)f._fbq=n; n.push=n; n.loaded=!0; n.version="2.0";
      n.queue=[]; t=b.createElement(e); t.async=!0; t.src=v;
      s=b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t,s);
    })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");

    window.fbq("init", pixelId);
    window.fbq("track", "PageView");
  }

  function loadTrackersIfAllowed() {
    if (trackersLoaded) return;
    const consent = getConsent();
    if (consent !== "accept") return;

    trackersLoaded = true;
    loadGA4(OF_TRACKING.GA4_ID);
    loadMetaPixel(OF_TRACKING.META_PIXEL_ID);
  }

  // =========================
  // 6) BANNER DOM
  // =========================
  const BANNER_ID = "of-cookie-banner";

  function bannerHTML(lang) {
    const t = I18N[lang];
    return `
      <div id="${BANNER_ID}" class="of-open" role="dialog" aria-live="polite" aria-label="${escapeHtml(t.title)}">
        <div class="of-cookie-card">
          <div class="of-cookie-row">
            <div>
              <div class="of-cookie-title">${escapeHtml(t.title)}</div>
              <p class="of-cookie-text">${escapeHtml(t.text)}</p>
              <div class="of-cookie-links">
                <a href="/privacy.html#cookies">${escapeHtml(t.more)}</a>
                <a href="#" data-of-cookie="manage">${escapeHtml(t.manage)}</a>
              </div>
            </div>

            <div class="of-cookie-actions">
              <button class="of-btn" type="button" data-of-cookie="reject">${escapeHtml(t.reject)}</button>
              <button class="of-btn of-btn-primary" type="button" data-of-cookie="accept">${escapeHtml(t.accept)}</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function escapeHtml(str) {
    return String(str)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function removeBanner() {
    const el = document.getElementById(BANNER_ID);
    if (el) el.remove();
  }

  function hideBanner() {
    const el = document.getElementById(BANNER_ID);
    if (!el) return;
    el.classList.remove("of-open");
    el.style.display = "none";
  }

  function showBanner() {
    // Si consent déjà présent => pas de bandeau
    if (getConsent()) return;

    // si déjà injecté => forcer visible (anti "ça disparaît")
    const existing = document.getElementById(BANNER_ID);
    if (existing) {
      existing.classList.add("of-open");
      existing.style.display = "block";
      return;
    }

    const lang = getLang();
    const wrap = document.createElement("div");
    wrap.innerHTML = bannerHTML(lang);
    const banner = wrap.firstElementChild;

    document.body.appendChild(banner);

    banner.addEventListener("click", (e) => {
      const target = e.target;
      if (!(target instanceof Element)) return;

      const action = target.getAttribute("data-of-cookie");
      if (!action) return;

      if (action === "accept") {
        setConsent("accept");
        hideBanner();
        loadTrackersIfAllowed();
      }

      if (action === "reject") {
        setConsent("reject");
        hideBanner();
      }

      if (action === "manage") {
        e.preventDefault();
        // Option simple: réafficher le bandeau (et permettre de re-choisir)
        // Tu peux remplacer par un vrai panneau “préférences” plus tard.
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(STORAGE_TS);
        removeBanner();
        showBanner();
      }
    });
  }

  // =========================
  // 7) ANTI-BUG "apparait puis disparait"
  //    - attendre que la page soit finie
  //    - observer si quelqu’un supprime/masque le bandeau
  // =========================
  function startObserver() {
    const obs = new MutationObserver(() => {
      // si pas de consent => le bandeau doit exister
      if (!getConsent()) {
        const el = document.getElementById(BANNER_ID);
        if (!el) showBanner();
        else {
          // si masqué par un CSS/script => on le force
          const cs = window.getComputedStyle(el);
          if (cs.display === "none" || cs.visibility === "hidden" || cs.opacity === "0") {
            el.classList.add("of-open");
            el.style.display = "block";
            el.style.visibility = "visible";
            el.style.opacity = "1";
          }
        }
      }
    });

    obs.observe(document.documentElement, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["style", "class"]
    });
  }

  // =========================
  // 8) API (utile si tu veux un lien “Gérer les cookies” en footer)
  // =========================
  window.ofCookies = {
    open: () => {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(STORAGE_TS);
      removeBanner();
      showBanner();
    },
    reset: () => {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(STORAGE_TS);
      trackersLoaded = false;
      removeBanner();
      showBanner();
    },
    status: () => getConsent()
  };

  // =========================
  // 9) BOOT
  // =========================
  function boot() {
    loadTrackersIfAllowed(); // si déjà "accept" (visites suivantes)
    showBanner();            // sinon, afficher
    startObserver();         // anti-disparition
  }

  // window.load = plus robuste quand d’autres scripts touchent au DOM après
  if (document.readyState === "complete") boot();
  else window.addEventListener("load", boot, { once: true });

})();
