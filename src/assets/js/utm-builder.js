/* UTM Builder. Runs in the browser; recent links are kept on this device only. */
(function () {
  "use strict";
  var $ = function (s) { return document.querySelector(s); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
  var F = { url: $("#u-url"), source: $("#u-source"), medium: $("#u-medium"), campaign: $("#u-campaign"), content: $("#u-content"), term: $("#u-term") };
  var clean = $("#u-clean");
  var PRESETS = {
    meta: { source: "meta", medium: "paid_social", content: "{{ad.name}}" },
    google: { source: "google", medium: "cpc", term: "{keyword}" },
    linkedin: { source: "linkedin", medium: "paid_social" },
    email: { source: "newsletter", medium: "email" },
  };
  var ALIASES = { facebook: "meta", fb: "meta", instagram: "meta", ig: "meta", adwords: "google", "google ads": "google", li: "linkedin", mail: "newsletter" };
  var MEDIUMS = ["cpc", "paid_social", "social", "email", "referral", "display", "affiliate", "organic"];

  function norm(v) {
    v = v.trim();
    if (!clean.checked) return v;
    if (/\{\{?.*\}?\}/.test(v)) return v; // keep platform macros as typed
    return v.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
  }

  function build() {
    var base = F.url.value.trim();
    var params = [];
    ["source", "medium", "campaign", "content", "term"].forEach(function (k) {
      var v = norm(F[k].value);
      if (v) params.push(["utm_" + k, v]);
    });
    return { base: base, params: params };
  }

  function render() {
    var b = build();
    var out = $("#u-output");
    var sep = b.base.indexOf("?") === -1 ? "?" : "&";
    var html = esc(b.base || "https://") + (b.params.length ? sep : "") + b.params.map(function (p) {
      return '<span class="k">' + p[0] + "</span>=" + esc(encodeURIComponent(p[1]).replace(/%7B/g, "{").replace(/%7D/g, "}"));
    }).join("&amp;");
    out.innerHTML = html;
    checks(b);
  }

  function fullUrl() {
    var b = build();
    if (!b.base) return "";
    var sep = b.base.indexOf("?") === -1 ? "?" : "&";
    return b.base + (b.params.length ? sep : "") + b.params.map(function (p) {
      return p[0] + "=" + encodeURIComponent(p[1]).replace(/%7B/g, "{").replace(/%7D/g, "}");
    }).join("&");
  }

  function checks(b) {
    var list = [];
    var url = F.url.value.trim();
    var src = F.source.value.trim().toLowerCase();
    var med = norm(F.medium.value);
    var validUrl = /^https?:\/\/[^\s/]+\.[^\s]+/i.test(url);
    list.push(validUrl ? ["good", "Page URL looks valid."] : ["warn", "Add a full page URL starting with https://"]);
    if (!F.source.value.trim() || !F.medium.value.trim() || !F.campaign.value.trim()) list.push(["warn", "Source, medium and campaign are all needed for clean reports."]);
    else list.push(["good", "Source, medium and campaign are filled in."]);
    if (ALIASES[src]) list.push(["warn", "“" + F.source.value.trim() + "” and “" + ALIASES[src] + "” would show as separate rows. Pick one name and always use it."]);
    if (med && MEDIUMS.indexOf(med) === -1) list.push(["warn", "“" + med + "” isn't a common medium. Analytics may group it under Unassigned."]);
    if (!clean.checked && /[A-Z\s]/.test(F.source.value + F.medium.value + F.campaign.value)) list.push(["warn", "Capitals or spaces create duplicate rows. Turn on auto-clean or fix them by hand."]);
    if (/utm_/i.test(url)) list.push(["warn", "The page URL already has UTM tags. Remove them first."]);
    $("#u-checks").innerHTML = list.map(function (c) { return '<li class="' + c[0] + '">' + esc(c[1]) + "</li>"; }).join("");
  }

  Object.keys(F).forEach(function (k) { F[k].addEventListener("input", render); });
  clean.addEventListener("change", render);
  $("#utm-form").addEventListener("reset", function () { setTimeout(render, 0); });

  document.querySelectorAll("[data-preset]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var p = PRESETS[btn.getAttribute("data-preset")];
      document.querySelectorAll("[data-preset]").forEach(function (b) { b.setAttribute("aria-pressed", String(b === btn)); });
      ["source", "medium", "content", "term"].forEach(function (k) { F[k].value = p[k] || ""; });
      render();
    });
  });

  $("#u-copy").addEventListener("click", function () {
    var u = fullUrl();
    if (!u) { window.bcToast("Add a page URL first"); return; }
    window.bcCopy(u);
  });

  var KEY = "bc-utm-recent";
  function getRecent() { try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch (e) { return []; } }
  function setRecent(v) { try { localStorage.setItem(KEY, JSON.stringify(v)); } catch (e) {} }
  function renderRecent() {
    var r = getRecent();
    var ul = $("#u-recent");
    if (!r.length) { ul.innerHTML = '<li class="muted small">Links you save appear here, on this device only.</li>'; return; }
    ul.innerHTML = r.map(function (u, i) { return '<li><code title="' + esc(u) + '">' + esc(u) + '</code><button class="link-btn" type="button" data-i="' + i + '">Copy</button></li>'; }).join("");
  }
  $("#u-recent").addEventListener("click", function (e) {
    var b = e.target.closest("[data-i]");
    if (b) window.bcCopy(getRecent()[+b.getAttribute("data-i")]);
  });
  $("#u-save").addEventListener("click", function () {
    var u = fullUrl();
    if (!u) { window.bcToast("Add a page URL first"); return; }
    var r = getRecent().filter(function (x) { return x !== u; });
    r.unshift(u);
    setRecent(r.slice(0, 8));
    renderRecent();
    window.bcToast("Saved on this device");
  });
  $("#u-clear-recent").addEventListener("click", function () { setRecent([]); renderRecent(); });

  render();
  renderRecent();
})();
