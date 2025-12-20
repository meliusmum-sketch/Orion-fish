/* cookies.js — ORION FISH (Option 3: Accepter / Refuser + chargement GA/Pixel après consentement) */
(() => {
  const STORAGE_KEY = "of_cookie_consent_v1";
  const COOKIE_KEY = "of_cookie_consent";
  const DAYS = 180;

  // Config (tu peux aussi les définir dans <head> via window.OF_... )
  const GA_ID = (window.OF_GA_MEASUREMENT_ID || "").trim();     // ex: "G-W367YRDYKY"
  const META_PIXEL_ID = (window.OF_META_PIXEL_ID || "").trim(); // ex: "1234567890" (optionnel)

  const isGPC = !!navigator.globalPrivacyControl; // Global Privacy Control
  const isDNT = (navigator.doNotTrack === "1" || window.doNotTrack === "1");

  function setCookie(name, value, days) {
    const d = new Date();
    d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${d.toUTCString()}; path=/; SameSite=Lax`;
  }

  function getLocal() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function setLocal(obj) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
    } catch (e) {}
  }

  function nowISO() {
    return new Date().toISOString();
  }

  function consentAccepted() {
    const c = getLocal();
    return !!(c && c.choice === "accept");
  }

  function consentRefused() {
    const c = getLocal();
    return !!(c && c.choice === "refuse");
  }

  function hasChoice() {
    const c = getLocal();
    return !!(c && (c.choice === "accept" || c.choice === "refuse"));
  }

  function loadScript(src, id) {
    if (id && document.getElementById(id)) return;
    const s = document.createElement("script");
    if (id) s.id = id;
    s.async = true;
    s.src = src;
    document.head.appendChild(s);
  }

  function enableGA(measurementId) {
    if (!measurementId) return;

    // gtag loader
    loadScript(`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`, "of-ga-gtag");

    window.dataLayer = window.dataLayer || [];
    function gtag(){ window.dataLayer.push(arguments); }
    window.gtag = window.gtag || gtag;

    window.gtag("js", new Date());
    window.gtag("config", measurementId);
  }

  function enableMetaPixel(pixelId) {
    if (!pixelId) return;
    if (window.fbq) return;

    // Pixel base code (inject)
    !(function(f,b,e,v,n,t,s){
      if(f.fbq) return;
      n=f.fbq=function(){ n.callMethod ? n.callMethod.apply(n,arguments) : n.queue.push(arguments) };
      if(!f._fbq) f._fbq=n;
      n.push=n; n.loaded=!0; n.version='2.0';
      n.queue=[];
      t=b.createElement(e); t.async=!0;
      t.src=v;
      s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s);
    })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

    window.fbq('init', pixelId);
    window.fbq('track', 'PageView');
  }

  function applyConsent() {
    if (!consentAccepted()) return;

    // Charge uniquement après accept
    enableGA(GA_ID);
    enableMetaPixel(META_PIXEL_ID);
  }

  function buildBanner() {
    if (document.getElementById("of-cookie-banner")) return;

    const wrap = document.createElement("div");
    wrap.id = "of-cookie-banner";
    wrap.setAttribute("role", "dialog");
    wrap.setAttribute("aria-live", "polite");
    wrap.setAttribute("aria-label", "Cookies");

    wrap.innerHTML = `
      <div class="of-card">
        <div class="of-inner">
          <div>
            <div class="of-title">Cookies</div>
            <div class="of-text">
              ORION FISH utilise des cookies <strong>techniques</strong> nécessaires au bon fonctionnement.
              Avec votre accord, nous pouvons activer des cookies de <strong>mesure d’audience</strong> (Google Analytics)
              et/ou de <strong>marketing</strong> (Meta Pixel).
            </div>
            <div class="of-links" style="margin-top:8px">
              <a href="/privacy.html#cookies">En savoir plus</a>
              <span style="opacity:.65"> • </span>
              <a href="#" data-of-cookie-open="1">Gérer</a>
            </div>
          </div>

          <div>
            <div class="of-actions">
              <button class="of-btn" type="button" id="of-cookie-refuse">Refuser</button>
              <button class="of-btn of-primary" type="button" id="of-cookie-accept">Accepter</button>
            </div>
            <div class="of-note" style="margin-top:8px">
              Vous pouvez modifier votre choix à tout moment via le lien “Cookies”.
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(wrap);

    const acceptBtn = document.getElementById("of-cookie-accept");
    const refuseBtn = document.getElementById("of-cookie-refuse");

    acceptBtn.addEventListener("click", () => {
      const payload = { choice: "accept", at: nowISO() };
      setLocal(payload);
      setCookie(COOKIE_KEY, "accept", DAYS);
      closeBanner();
      applyConsent();
    });

    refuseBtn.addEventListener("click", () => {
      const payload = { choice: "refuse", at: nowISO() };
      setLocal(payload);
      setCookie(COOKIE_KEY, "refuse", DAYS);
      closeBanner();
    });

    // liens "Gérer" / ouverture
    document.querySelectorAll('[data-of-cookie-open="1"]').forEach(el => {
      el.addEventListener("click", (e) => {
        e.preventDefault();
        openBanner(true);
      });
    });

    // bouton reset (si présent dans privacy.html)
    const resetBtn = document.getElementById("of-cookie-reset");
    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        try { localStorage.removeItem(STORAGE_KEY); } catch(e){}
        setCookie(COOKIE_KEY, "", -1);
        openBanner(true);
      });
    }
  }

  function openBanner(force = false) {
    const el = document.getElementById("of-cookie-banner");
    if (!el) return;

    if (!force && hasChoice()) return;
    el.classList.add("of-open");
  }

  function closeBanner() {
    const el = document.getElementById("of-cookie-banner");
    if (!el) return;
    el.classList.remove("of-open");
  }

  function hardenVisibility() {
    // Si une autre CSS/JS le cache, on le ré-affiche tant que pas de choix
    const el = document.getElementById("of-cookie-banner");
    if (!el) return;

    const obs = new MutationObserver(() => {
      if (!hasChoice()) {
        const hiddenByStyle = (el.style.display === "none");
        const hiddenByClass = !el.classList.contains("of-open");
        if (hiddenByStyle) el.style.display = "";
        if (hiddenByClass) el.classList.add("of-open");
      }
    });

    obs.observe(el, { attributes: true, attributeFilter: ["style", "class"] });
  }

  function init() {
    buildBanner();

    // Respect GPC/DNT : on refuse par défaut et on n'affiche pas
    if (!hasChoice() && (isGPC || isDNT)) {
      const payload = { choice: "refuse", at: nowISO(), reason: (isGPC ? "GPC" : "DNT") };
      setLocal(payload);
      setCookie(COOKIE_KEY, "refuse", DAYS);
      closeBanner();
      return;
    }

    if (!hasChoice()) {
      openBanner(true);
      hardenVisibility();
    } else {
      closeBanner();
      applyConsent(); // si "accept", charge GA/Pixel
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
