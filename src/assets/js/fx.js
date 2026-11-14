/* Interaction layer: cursor, magnetic buttons, tilt, count-up, scroll showcase,
   sticky horizontal process, tabs, live market clocks. All optional; the page works without it. */
(function () {
  "use strict";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fine = window.matchMedia("(pointer: fine)").matches;
  var raf = window.requestAnimationFrame.bind(window);

  /* ---------- Custom cursor (mouse only) ---------- */
  if (fine && !reduce) {
    var dot = document.createElement("div"); dot.className = "cursor-dot";
    var ring = document.createElement("div"); ring.className = "cursor-ring";
    var label = document.createElement("span"); ring.appendChild(label);
    document.body.appendChild(dot); document.body.appendChild(ring);
    document.documentElement.classList.add("has-cursor");
    var mx = -100, my = -100, rx = -100, ry = -100;
    window.addEventListener("pointermove", function (e) { mx = e.clientX; my = e.clientY; dot.style.transform = "translate(" + mx + "px," + my + "px)"; }, { passive: true });
    (function loop() {
      rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
      ring.style.transform = "translate(" + rx + "px," + ry + "px)";
      raf(loop);
    })();
    document.addEventListener("pointerover", function (e) {
      var t = e.target.closest && e.target.closest("a, button, summary, label, input, select, textarea, [data-cursor]");
      ring.classList.toggle("is-hover", !!t);
      var l = t && t.getAttribute("data-cursor");
      label.textContent = l || "";
      ring.classList.toggle("has-label", !!l);
    });
    document.addEventListener("pointerdown", function () { ring.classList.add("is-down"); });
    document.addEventListener("pointerup", function () { ring.classList.remove("is-down"); });
    document.addEventListener("mouseleave", function () { ring.style.opacity = "0"; dot.style.opacity = "0"; });
    document.addEventListener("mouseenter", function () { ring.style.opacity = ""; dot.style.opacity = ""; });
  }

  /* ---------- Magnetic buttons ---------- */
  if (fine && !reduce) {
    document.querySelectorAll(".btn, [data-magnetic]").forEach(function (el) {
      el.addEventListener("pointermove", function (e) {
        var r = el.getBoundingClientRect();
        var x = (e.clientX - (r.left + r.width / 2)) * 0.22, y = (e.clientY - (r.top + r.height / 2)) * 0.3;
        el.style.translate = Math.max(-10, Math.min(10, x)) + "px " + Math.max(-8, Math.min(8, y)) + "px";
      });
      el.addEventListener("pointerleave", function () { el.style.translate = ""; });
    });
  }

  /* ---------- Tilt ---------- */
  if (fine && !reduce) {
    document.querySelectorAll("[data-tilt]").forEach(function (el) {
      var max = parseFloat(el.getAttribute("data-tilt")) || 6;
      el.addEventListener("pointermove", function (e) {
        var r = el.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
        el.style.setProperty("--ry", (px * max).toFixed(2) + "deg");
        el.style.setProperty("--rx", (-py * max).toFixed(2) + "deg");
      });
      el.addEventListener("pointerleave", function () { el.style.setProperty("--rx", "0deg"); el.style.setProperty("--ry", "0deg"); });
    });
  }

  /* ---------- Count-up (final value is in the HTML; this only animates it) ---------- */
  if (!reduce && "IntersectionObserver" in window) {
    var countIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        countIO.unobserve(en.target);
        var el = en.target, end = parseFloat(el.getAttribute("data-count")), suffix = el.getAttribute("data-suffix") || "", t0 = null, dur = 1400;
        (function step(ts) {
          if (!t0) t0 = ts;
          var k = Math.min(1, (ts - t0) / dur), e = 1 - Math.pow(1 - k, 3);
          el.textContent = Math.round(end * e) + suffix;
          if (k < 1) raf(step);
        })(performance.now());
      });
    }, { threshold: 0.6 });
    document.querySelectorAll("[data-count]").forEach(function (el) { countIO.observe(el); });
  }

  /* ---------- Scroll-linked effects ---------- */
  var showcases = Array.prototype.slice.call(document.querySelectorAll("[data-showcase]"));
  var parallax = Array.prototype.slice.call(document.querySelectorAll("[data-parallax]"));
  var hs = document.querySelector("[data-hscroll]");
  var track = hs && hs.querySelector(".hs-track");

  function sizeH() {
    if (!hs || !track) return;
    if (window.innerWidth >= 960 && !reduce) {
      var extra = track.scrollWidth - hs.querySelector(".hs-sticky").clientWidth;
      hs.style.height = (window.innerHeight + Math.max(0, extra)) + "px";
      hs.dataset.extra = Math.max(0, extra);
      hs.classList.add("is-pinned");
    } else {
      hs.style.height = ""; hs.classList.remove("is-pinned"); track.style.transform = "";
    }
  }

  var ticking = false;
  function onScroll() {
    if (ticking) return; ticking = true;
    raf(function () {
      ticking = false;
      var vh = window.innerHeight;
      showcases.forEach(function (el) {
        var r = el.getBoundingClientRect();
        var p = 1 - Math.min(1, Math.max(0, (r.top - vh * 0.15) / (vh * 0.75)));
        el.style.setProperty("--sp", p.toFixed(3));
      });
      parallax.forEach(function (el) {
        var r = el.getBoundingClientRect(), f = parseFloat(el.getAttribute("data-parallax")) || 0.15;
        el.style.setProperty("--py", ((r.top + r.height / 2 - vh / 2) * -f).toFixed(1) + "px");
      });
      if (hs && hs.classList.contains("is-pinned")) {
        var r = hs.getBoundingClientRect(), extra = parseFloat(hs.dataset.extra) || 0;
        var prog = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - vh)));
        track.style.transform = "translate3d(" + (-extra * prog).toFixed(1) + "px,0,0)";
        hs.style.setProperty("--hp", prog.toFixed(3));
      }
    });
  }
  if (!reduce) {
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", function () { sizeH(); onScroll(); }, { passive: true });
    window.addEventListener("load", function () { sizeH(); onScroll(); });
    sizeH(); onScroll();
  }

  /* ---------- Tabs ---------- */
  document.querySelectorAll("[role=tablist]").forEach(function (list) {
    var tabs = Array.prototype.slice.call(list.querySelectorAll("[role=tab]"));
    function select(tab) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute("aria-selected", String(on));
        t.tabIndex = on ? 0 : -1;
        var panel = document.getElementById(t.getAttribute("aria-controls"));
        if (panel) { panel.hidden = !on; if (on) { panel.classList.remove("panel-in"); void panel.offsetWidth; panel.classList.add("panel-in"); } }
      });
    }
    tabs.forEach(function (t, i) {
      t.addEventListener("click", function () { select(t); });
      t.addEventListener("keydown", function (e) {
        var n = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
        if (n) { e.preventDefault(); var nt = tabs[(i + n + tabs.length) % tabs.length]; nt.focus(); select(nt); }
      });
    });
  });

  /* ---------- Live market clocks ---------- */
  var clocks = Array.prototype.slice.call(document.querySelectorAll("[data-tz]"));
  function tick() {
    var now = new Date();
    clocks.forEach(function (el) {
      var tz = el.getAttribute("data-tz");
      var time = new Intl.DateTimeFormat("en-GB", { timeZone: tz, hour: "2-digit", minute: "2-digit", hour12: false }).format(now);
      var parts = new Intl.DateTimeFormat("en-US", { timeZone: tz, weekday: "short", hour: "numeric", hour12: false }).formatToParts(now);
      var hour = parseInt(parts.filter(function (p) { return p.type === "hour"; })[0].value, 10) % 24;
      var day = parts.filter(function (p) { return p.type === "weekday"; })[0].value;
      var open = hour >= 9 && hour < 18 && day !== "Sat" && day !== "Sun";
      el.querySelector(".clock-time").textContent = time;
      var st = el.querySelector(".clock-status");
      st.textContent = open ? "Working hours now" : "Outside working hours";
      el.classList.toggle("is-open", open);
      var bar = el.querySelector(".clock-now");
      var mins = parseInt(time.split(":")[1], 10) || 0;
      if (bar) bar.style.left = ((hour + mins / 60) / 24 * 100).toFixed(2) + "%";
    });
  }
  if (clocks.length) { tick(); setInterval(tick, 30000); }
})();
