/* Beyond Clicks site script. Small, no dependencies. */
(function () {
  var doc = document.documentElement;
  doc.classList.add("js");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Scroll progress */
  var bar = document.querySelector(".progress");
  function onScroll() {
    if (!bar) return;
    var max = doc.scrollHeight - window.innerHeight;
    bar.style.setProperty("--p", max > 0 ? (window.scrollY / max).toFixed(4) : 0);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* Mobile drawer */
  var menuBtn = document.querySelector(".menu-btn");
  if (menuBtn) {
    menuBtn.addEventListener("click", function () {
      var open = document.body.classList.toggle("menu-open");
      menuBtn.setAttribute("aria-expanded", String(open));
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && document.body.classList.contains("menu-open")) {
        document.body.classList.remove("menu-open");
        menuBtn.setAttribute("aria-expanded", "false");
        menuBtn.focus();
      }
    });
  }

  /* Cursor spotlight on cards (fine pointers only) */
  if (window.matchMedia("(pointer: fine)").matches) {
    document.addEventListener("pointermove", function (e) {
      var card = e.target.closest && e.target.closest(".card");
      if (!card) return;
      var r = card.getBoundingClientRect();
      card.style.setProperty("--mx", e.clientX - r.left + "px");
      card.style.setProperty("--my", e.clientY - r.top + "px");
    }, { passive: true });
  }

  /* Gloss on tap for touch screens */
  document.addEventListener("pointerdown", function (e) {
    var b = e.target.closest && e.target.closest(".btn");
    if (!b) return;
    b.classList.add("is-pressed");
    setTimeout(function () { b.classList.remove("is-pressed"); }, 260);
  });

  /* Reveal: content is visible at rest, this only adds a lift as it enters */
  if (!reduce && "IntersectionObserver" in window) {
    var items = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
    var vh = window.innerHeight;
    items.forEach(function (el) {
      if (el.getBoundingClientRect().top > vh * 0.92) el.classList.add("pre");
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.remove("pre"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px" });
    items.forEach(function (el) { io.observe(el); });
  }

  /* Toast */
  var toastEl;
  window.bcToast = function (msg) {
    if (!toastEl) {
      toastEl = document.createElement("div");
      toastEl.className = "toast";
      toastEl.setAttribute("role", "status");
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = msg;
    toastEl.classList.add("is-visible");
    clearTimeout(toastEl._t);
    toastEl._t = setTimeout(function () { toastEl.classList.remove("is-visible"); }, 2200);
  };

  window.bcCopy = function (text) {
    function fallback() {
      var ta = document.createElement("textarea");
      ta.value = text; ta.setAttribute("readonly", ""); ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.select();
      var ok = false;
      try { ok = document.execCommand("copy"); } catch (e) {}
      document.body.removeChild(ta);
      window.bcToast(ok ? "Copied" : "Select the text and copy it manually");
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () { window.bcToast("Copied"); }, fallback);
    } else { fallback(); }
  };

  /* Forms in the prototype: no backend yet */
  document.querySelectorAll("form[data-proto]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      var note = form.querySelector(".form-note");
      if (note) {
        note.classList.add("is-visible");
        note.focus();
      }
    });
  });

  /* Pricing toggle */
  document.querySelectorAll("[data-billing]").forEach(function (wrap) {
    var buttons = wrap.querySelectorAll("button");
    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        buttons.forEach(function (b) { b.setAttribute("aria-pressed", String(b === btn)); });
        var mode = btn.getAttribute("data-mode");
        document.querySelectorAll("[data-price-" + mode + "]").forEach(function (el) {
          el.innerHTML = el.getAttribute("data-price-" + mode);
        });
      });
    });
  });

  /* Command palette: Ctrl or Cmd + K */
  var pal = document.querySelector(".palette");
  if (pal) {
    var input = pal.querySelector("input");
    var list = pal.querySelector(".palette-list");
    var links = Array.prototype.slice.call(list.querySelectorAll("a"));
    var active = 0;
    function render() {
      var q = input.value.trim().toLowerCase();
      var shown = links.filter(function (a) {
        var hit = a.textContent.toLowerCase().indexOf(q) !== -1;
        a.parentElement.hidden = !hit;
        return hit;
      });
      active = Math.min(active, Math.max(shown.length - 1, 0));
      links.forEach(function (a) { a.classList.remove("is-active"); });
      if (shown[active]) shown[active].classList.add("is-active");
      return shown;
    }
    function open() { pal.classList.add("is-open"); input.value = ""; active = 0; render(); input.focus(); }
    function close() { pal.classList.remove("is-open"); }
    document.addEventListener("keydown", function (e) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); pal.classList.contains("is-open") ? close() : open(); }
      if (!pal.classList.contains("is-open")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        var shown = render();
        active = (active + (e.key === "ArrowDown" ? 1 : -1) + shown.length) % Math.max(shown.length, 1);
        render();
      }
      if (e.key === "Enter") {
        var s = render();
        if (s[active]) { window.location.href = s[active].getAttribute("href"); }
      }
    });
    input.addEventListener("input", function () { active = 0; render(); });
    pal.addEventListener("click", function (e) { if (e.target === pal) close(); });
    document.querySelectorAll("[data-open-palette]").forEach(function (b) { b.addEventListener("click", open); });
  }
})();
