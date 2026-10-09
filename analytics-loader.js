(function () {
  "use strict";

  var GTM_ID = "G-0Y2VLK9NH4";
  var host = window.location.hostname;
  var isChinaEntry = host === "cn.zokforce.com";
  var CLIENT_ID_KEY = "zok_analytics_client_id";
  var SESSION_KEY = "zok_analytics_session";
  var SESSION_TTL_MS = 30 * 60 * 1000;

  function randomId() {
    if (window.crypto && window.crypto.randomUUID) {
      return window.crypto.randomUUID();
    }
    return String(Date.now()) + "." + Math.random().toString(36).slice(2);
  }

  function readStorage(key) {
    try {
      return window.localStorage.getItem(key);
    } catch (e) {
      return "";
    }
  }

  function writeStorage(key, value) {
    try {
      window.localStorage.setItem(key, value);
    } catch (e) {
      // Analytics must never block the page if storage is unavailable.
    }
  }

  function getClientId() {
    var clientId = readStorage(CLIENT_ID_KEY);
    if (!clientId) {
      clientId = randomId();
      writeStorage(CLIENT_ID_KEY, clientId);
    }
    return clientId;
  }

  function getSessionId() {
    var now = Date.now();
    var session = {};
    try {
      session = JSON.parse(readStorage(SESSION_KEY) || "{}");
    } catch (e) {
      session = {};
    }

    if (!session.id || !session.updatedAt || now - Number(session.updatedAt) > SESSION_TTL_MS) {
      session = { id: String(now), updatedAt: now };
    } else {
      session.updatedAt = now;
    }

    writeStorage(SESSION_KEY, JSON.stringify(session));
    return session.id;
  }

  function sendFirstPartyPageView() {
    if (!isChinaEntry) return;

    var payload = {
      client_id: getClientId(),
      session_id: getSessionId(),
      event_name: "page_view",
      page_location: window.location.href,
      page_path: window.location.pathname + window.location.search,
      page_title: document.title,
      page_referrer: document.referrer,
      language: navigator.language || "",
      screen_resolution: window.screen ? window.screen.width + "x" + window.screen.height : "",
      entry_host: host,
    };
    var body = JSON.stringify(payload);

    if (navigator.sendBeacon) {
      var blob = new Blob([body], { type: "application/json" });
      if (navigator.sendBeacon("/api/analytics", blob)) return;
    }

    fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: body,
      keepalive: true,
    }).catch(function () {
      // Keep analytics failures invisible to the user.
    });
  }

  function loadGtag() {
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () {
      window.dataLayer.push(arguments);
    };

    window.gtag("js", new Date());
    window.gtag("config", GTM_ID, isChinaEntry ? { send_page_view: false } : undefined);

    var script = document.createElement("script");
    script.async = true;
    script.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(GTM_ID);
    document.head.appendChild(script);
  }

  sendFirstPartyPageView();

  if (isChinaEntry && document.readyState !== "complete") {
    window.addEventListener("load", loadGtag, { once: true });
    return;
  }

  loadGtag();
})();
