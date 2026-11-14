/* CV Screener. Everything runs in this tab: no CV text leaves the browser. */
(function () {
  "use strict";
  var FREE_LIMIT = 10;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };

  var state = {
    must: ["Meta Ads", "Google Ads", "GA4", "A/B testing"],
    nice: ["Shopify", "Looker Studio", "TikTok Ads", "SQL"],
    cvs: [],
    results: [],
    pairs: [],
    filter: "all",
    sort: false,
    isSample: false,
  };

  /* ---------- Chips ---------- */
  function renderChips(kind) {
    var box = document.querySelector('[data-chips="' + kind + '"]');
    var input = box.querySelector("input");
    box.querySelectorAll(".chip").forEach(function (c) { c.remove(); });
    state[kind].forEach(function (skill, i) {
      var c = document.createElement("span");
      c.className = "chip";
      c.innerHTML = esc(skill) + ' <button type="button" aria-label="Remove ' + esc(skill) + '">&times;</button>';
      c.querySelector("button").addEventListener("click", function () { state[kind].splice(i, 1); renderChips(kind); });
      box.insertBefore(c, input);
    });
  }
  ["must", "nice"].forEach(function (kind) {
    var box = document.querySelector('[data-chips="' + kind + '"]');
    var input = box.querySelector("input");
    box.addEventListener("click", function () { input.focus(); });
    input.addEventListener("keydown", function (e) {
      if ((e.key === "Enter" || e.key === ",") && input.value.trim()) {
        e.preventDefault();
        input.value.split(",").map(function (s) { return s.trim(); }).filter(Boolean).forEach(function (s) {
          if (state[kind].map(lc).indexOf(lc(s)) === -1) state[kind].push(s);
        });
        input.value = "";
        renderChips(kind);
      } else if (e.key === "Backspace" && !input.value && state[kind].length) {
        state[kind].pop(); renderChips(kind);
      }
    });
  });
  function lc(s) { return s.toLowerCase(); }

  $("#reset-job").addEventListener("click", function () {
    state.must = []; state.nice = []; renderChips("must"); renderChips("nice");
    $("#job-title").value = ""; $("#jd").value = ""; $("#min-years").value = "";
  });

  /* ---------- CV list ---------- */
  function renderList() {
    var list = $("#cv-list");
    list.innerHTML = "";
    state.cvs.forEach(function (cv, i) {
      var li = document.createElement("li");
      if (i >= FREE_LIMIT) li.className = "over-limit";
      li.innerHTML = '<span><strong>' + esc(guessName(cv.text) || cv.name) + '</strong><br><span class="cv-src">' + esc(cv.name) +
        (i >= FREE_LIMIT ? " &middot; over the free limit" : "") + '</span></span><button type="button" aria-label="Remove ' + esc(cv.name) + '">&times;</button>';
      li.querySelector("button").addEventListener("click", function () { state.cvs.splice(i, 1); state.isSample = false; renderList(); });
      list.appendChild(li);
    });
    var count = $("#cv-count");
    count.textContent = state.cvs.length + " / " + FREE_LIMIT;
    count.classList.toggle("over", state.cvs.length > FREE_LIMIT);
    $("#run").innerHTML = "Screen " + (state.cvs.length ? Math.min(state.cvs.length, FREE_LIMIT) + " " : "") + (state.cvs.length === 1 ? "CV" : "CVs") + ' <span class="arrow">&rarr;</span>';
  }

  function addCv(name, text) {
    text = (text || "").replace(/\r/g, "").trim();
    if (!text) { window.bcToast("That file looks empty"); return; }
    state.cvs.push({ name: name, text: text });
    state.isSample = false;
    renderList();
  }

  $("#load-sample").addEventListener("click", function () { loadSample(); run(); });
  function loadSample() {
    state.cvs = (window.BC_SAMPLE_CVS || []).map(function (c) { return { name: c.name, text: c.text }; });
    state.isSample = true;
    renderList();
  }
  $("#clear-cvs").addEventListener("click", function () { state.cvs = []; renderList(); });

  $("#paste-toggle").addEventListener("click", function () {
    var box = $("#paste-box");
    box.hidden = !box.hidden;
    if (!box.hidden) $("#paste-text").focus();
  });
  $("#paste-add").addEventListener("click", function () {
    var t = $("#paste-text").value;
    addCv("Pasted CV " + (state.cvs.length + 1), t);
    $("#paste-text").value = "";
    $("#paste-box").hidden = true;
  });

  /* ---------- File reading, all local ---------- */
  var libs = {};
  function loadScript(src) {
    if (libs[src]) return libs[src];
    libs[src] = new Promise(function (res, rej) {
      var s = document.createElement("script");
      s.src = src; s.onload = res; s.onerror = function () { rej(new Error("Could not load " + src)); };
      document.head.appendChild(s);
    });
    return libs[src];
  }
  var PDFJS = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
  var PDFJS_WORKER = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
  var MAMMOTH = "https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js";

  function readFile(file) {
    var ext = (file.name.split(".").pop() || "").toLowerCase();
    if (ext === "txt" || file.type === "text/plain") return file.text();
    if (ext === "pdf") {
      return loadScript(PDFJS).then(function () {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER;
        return file.arrayBuffer();
      }).then(function (buf) {
        return window.pdfjsLib.getDocument({ data: buf }).promise;
      }).then(function (pdf) {
        var pages = [];
        for (var i = 1; i <= pdf.numPages; i++) pages.push(pdf.getPage(i).then(function (p) { return p.getTextContent(); }));
        return Promise.all(pages).then(function (contents) {
          return contents.map(function (c) {
            var out = "", lastY = null;
            c.items.forEach(function (it) {
              var y = it.transform ? it.transform[5] : null;
              if (lastY !== null && y !== null && Math.abs(y - lastY) > 4) out += "\n";
              out += it.str + (it.hasEOL ? "\n" : " ");
              lastY = y;
            });
            return out;
          }).join("\n");
        });
      });
    }
    if (ext === "docx") {
      return loadScript(MAMMOTH).then(function () { return file.arrayBuffer(); })
        .then(function (buf) { return window.mammoth.extractRawText({ arrayBuffer: buf }); })
        .then(function (r) { return r.value; });
    }
    return Promise.reject(new Error("Use PDF, DOCX or TXT"));
  }

  function handleFiles(files) {
    var arr = Array.prototype.slice.call(files);
    if (!arr.length) return;
    if (state.isSample) { state.cvs = []; state.isSample = false; }
    window.bcToast("Reading " + arr.length + (arr.length === 1 ? " file" : " files") + " on your device");
    Promise.all(arr.map(function (f) {
      return readFile(f).then(function (t) { addCv(f.name, t); }, function (err) { window.bcToast(f.name + ": " + err.message); });
    })).then(function () { if (state.cvs.length) run(); });
  }

  var dz = $("#dropzone");
  $("#file-input").addEventListener("change", function (e) { handleFiles(e.target.files); e.target.value = ""; });
  ["dragenter", "dragover"].forEach(function (ev) { dz.addEventListener(ev, function (e) { e.preventDefault(); dz.classList.add("is-over"); }); });
  ["dragleave", "drop"].forEach(function (ev) { dz.addEventListener(ev, function (e) { e.preventDefault(); dz.classList.remove("is-over"); }); });
  dz.addEventListener("drop", function (e) { handleFiles(e.dataTransfer.files); });

  /* ---------- Analysis ---------- */
  var MONTHS = { jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5, jul: 6, aug: 7, sep: 8, sept: 8, oct: 9, nov: 10, dec: 11 };
  var NOW = new Date();

  function guessName(text) {
    var lines = text.split("\n").map(function (l) { return l.trim(); }).filter(Boolean);
    for (var i = 0; i < Math.min(lines.length, 3); i++) {
      var l = lines[i];
      if (!/[@\d|]/.test(l) && l.split(/\s+/).length <= 5 && l.length < 48) return l;
    }
    return "";
  }

  function toIndex(monStr, year, isEnd) {
    var m = monStr ? MONTHS[monStr.slice(0, 4).toLowerCase().replace(/\.$/, "")] : undefined;
    if (m === undefined && monStr) m = MONTHS[monStr.slice(0, 3).toLowerCase()];
    if (m === undefined) m = isEnd ? 11 : 0;
    return year * 12 + m;
  }

  function parseRoles(text) {
    var re = /(?:\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)[a-z]*\.?\s+)?((?:19|20)\d{2})\s*(?:-|–|—|to)\s*(?:(?:\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)[a-z]*\.?\s+)?((?:19|20)\d{2})|(Present|Current|Now|Today))/gi;
    var roles = [], m;
    var lines = text.split("\n");
    lines.forEach(function (line) {
      re.lastIndex = 0;
      while ((m = re.exec(line))) {
        var start = toIndex(m[1], +m[2], false);
        var end = m[5] ? NOW.getFullYear() * 12 + NOW.getMonth() : toIndex(m[3], +m[4], true);
        if (end < start) continue;
        var label = line.slice(0, m.index).replace(/[(\[,\s]+$/, "").trim();
        var company = label.split(/,| at /).slice(-1)[0].trim() || label;
        roles.push({ start: start, end: end, label: label, company: company, months: end - start + 1 });
      }
    });
    return roles.sort(function (a, b) { return a.start - b.start; });
  }

  function totalYears(roles) {
    if (!roles.length) return 0;
    var merged = [], cur = { s: roles[0].start, e: roles[0].end };
    roles.slice(1).forEach(function (r) {
      if (r.start <= cur.e + 1) cur.e = Math.max(cur.e, r.end);
      else { merged.push(cur); cur = { s: r.start, e: r.end }; }
    });
    merged.push(cur);
    var months = merged.reduce(function (a, x) { return a + (x.e - x.s + 1); }, 0);
    return Math.round((months / 12) * 10) / 10;
  }

  function hasSkill(text, skill) {
    var s = skill.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\s+/g, "\\s*");
    var alt = { "a\\/b\\s*testing": "(a\\/b\\s*test|split\\s*test)", "ga4": "(ga4|google analytics 4)" };
    var pattern = alt[s] || s;
    return new RegExp("(^|[^a-z0-9])" + pattern + "($|[^a-z0-9])", "i").test(text);
  }

  function countOf(text, phrase) {
    var s = phrase.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    var m = text.toLowerCase().match(new RegExp(s, "g"));
    return m ? m.length : 0;
  }

  function shingles(text) {
    var body = text.split("\n").slice(2).join(" ").toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter(Boolean);
    var set = {};
    for (var i = 0; i + 5 <= body.length; i++) set[body.slice(i, i + 5).join(" ")] = 1;
    return set;
  }
  function jaccard(a, b) {
    var ka = Object.keys(a), inter = 0, total = ka.length;
    Object.keys(b).forEach(function (k) { if (a[k]) inter++; else total++; });
    return total ? inter / total : 0;
  }
  function sharedPhrase(a, b) {
    var best = "";
    Object.keys(a).forEach(function (k) { if (b[k] && k.length > best.length) best = k; });
    return best;
  }

  function monthsLabel(n) { return n + (n === 1 ? " month" : " months"); }

  function analyse(cv, job) {
    var text = cv.text;
    var name = guessName(text) || cv.name.replace(/\.[a-z]+$/i, "");
    var roles = parseRoles(text);
    var years = totalYears(roles);
    var must = job.must.map(function (s) { return { s: s, ok: hasSkill(text, s) }; });
    var nice = job.nice.filter(function (s) { return hasSkill(text, s); });
    var flags = [], questions = [];

    for (var i = 1; i < roles.length; i++) {
      var prev = roles[i - 1], r = roles[i];
      var overlap = Math.min(prev.end, r.end) - r.start + 1;
      if (overlap >= 3) {
        flags.push({ t: "Overlapping roles", d: prev.company + " and " + r.company + " overlap by " + monthsLabel(overlap) + "." });
        questions.push("Your roles at " + prev.company + " and " + r.company + " overlap by " + monthsLabel(overlap) + ". Were both full-time, and can we speak to someone from " + r.company + "?");
      }
      var gap = r.start - prev.end - 1;
      if (gap >= 6) {
        flags.push({ t: "Unexplained gap", d: monthsLabel(gap) + " between " + prev.company + " and " + r.company + "." });
        questions.push("There are " + monthsLabel(gap) + " between " + prev.company + " and " + r.company + ". What were you doing during that time?");
      }
    }
    var short = roles.filter(function (r) { return r.months < 12 && r.end < NOW.getFullYear() * 12 + NOW.getMonth(); });
    if (short.length >= 3) {
      flags.push({ t: "Several short roles", d: short.length + " past roles lasted under 12 months." });
      questions.push("Several of your roles lasted under a year. What made you move on from each one?");
    }
    if (!/linkedin\.com\/in\//i.test(text)) {
      flags.push({ t: "No LinkedIn profile", d: "No profile link found to cross-check dates and employers." });
      questions.push("Can you share your LinkedIn profile or a referee we can contact before the next round?");
    }
    var email = (text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i) || [""])[0].toLowerCase();
    if (email && name) {
      var local = email.split("@")[0];
      var parts = name.toLowerCase().split(/\s+/).filter(function (p) { return p.length >= 3; });
      if (parts.length && !parts.some(function (p) { return local.indexOf(p) !== -1; })) {
        flags.push({ t: "Email doesn't match name", d: email + " shares nothing with “" + name + "”." });
        questions.push("Confirm identity on a video call before the interview stage.");
      }
    }
    var stuffed = job.must.concat(job.nice).filter(function (s) { return countOf(text, s) >= 7; });
    if (stuffed.length) {
      flags.push({ t: "Keyword stuffing", d: "“" + stuffed[0] + "” appears " + countOf(text, stuffed[0]) + " times." });
      questions.push("Describe one " + stuffed[0] + " campaign from start to finish, including what didn't work.");
    }
    if (job.minYears && years && years < job.minYears) {
      flags.push({ t: "Below minimum experience", d: years + " years found, role asks for " + job.minYears + "." });
    }

    var claim = text.match(/[^.\n]*\b(\d+(?:\.\d+)?x|\d+(?:\.\d+)?%)[^.\n]*/i);
    if (claim) {
      questions.unshift("You mention “" + claim[0].trim().slice(0, 90) + "”. How was that measured, over what period, and what was your part?");
    }
    must.filter(function (m) { return m.ok; }).slice(0, 2).forEach(function (m) {
      questions.push("Walk me through the last time " + m.s + " changed a decision you made. What was the result?");
    });

    var metAll = must.every(function (m) { return m.ok; });
    var score = must.filter(function (m) { return m.ok; }).length;
    return {
      cv: cv, name: name, years: years, roles: roles.length, must: must, nice: nice, flags: flags,
      questions: questions.slice(0, 5), metAll: metAll, score: score, sh: shingles(text), similar: [],
    };
  }

  /* ---------- Run ---------- */
  function run() {
    if (!state.cvs.length) { window.bcToast("Add at least one CV first"); return; }
    var job = {
      must: state.must.slice(), nice: state.nice.slice(),
      minYears: parseFloat($("#min-years").value) || 0,
    };
    if (state.cvs.length > FREE_LIMIT) openUpgrade();
    var batch = state.cvs.slice(0, FREE_LIMIT);
    state.results = batch.map(function (cv) { return analyse(cv, job); });
    state.pairs = [];
    for (var i = 0; i < state.results.length; i++) {
      for (var j = i + 1; j < state.results.length; j++) {
        var a = state.results[i], b = state.results[j];
        var sim = jaccard(a.sh, b.sh);
        if (sim >= 0.18) {
          state.pairs.push({ a: a, b: b, sim: sim, phrase: sharedPhrase(a.sh, b.sh) });
          a.similar.push(b.name); b.similar.push(a.name);
        }
      }
    }
    state.results.forEach(function (r) {
      if (r.similar.length) {
        r.flags.push({ t: "Near copy of another CV", d: "Large parts match " + r.similar.join(", ") + " in this batch.", pro: true });
        r.questions.splice(1, 0, "Parts of this CV closely match another application. Ask the candidate to describe their main achievement in their own words.");
        r.questions = r.questions.slice(0, 5);
      }
    });
    render();
    var res = $("#results");
    if (window.innerWidth < 1180 && document.activeElement && document.activeElement.id !== "") {
      res.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
    }
  }
  $("#run").addEventListener("click", run);

  function render() {
    var R = state.results;
    var flagged = R.filter(function (r) { return r.flags.length; }).length;
    var meets = R.filter(function (r) { return r.metAll; }).length;
    $("#results-note").innerHTML = R.length
      ? (state.isSample ? '<span class="badge badge-placeholder">Sample batch</span> ' : "") + esc($("#job-title").value || "Untitled role") + " &middot; " + R.length + " screened on this device"
      : "Load CVs and press Screen.";
    $("#tiles").innerHTML = R.length ? [
      ["", R.length, "CVs screened"],
      ["", meets, "meet every must-have"],
      ["hot", flagged, "have something to check"],
      ["", state.pairs.length, state.pairs.length === 1 ? "near-identical pair" : "near-identical pairs"],
    ].map(function (t) { return '<div class="tile ' + t[0] + '"><b>' + t[1] + "</b><span>" + t[2] + "</span></div>"; }).join("") : "";

    $("#similar").innerHTML = state.pairs.map(function (p) {
      return '<div class="similar-box"><h3>Near-identical CVs <span class="badge badge-wine">Pro preview</span></h3><p><strong>' + esc(p.a.name) + "</strong> and <strong>" + esc(p.b.name) +
        "</strong> share " + Math.round(p.sim * 100) + "% of their wording" + (p.phrase ? ', including “…' + esc(p.phrase) + '…”' : "") + ". Templates and coordinated applications often look like this.</p></div>";
    }).join("");

    var list = R.slice();
    if (state.filter === "flagged") list = list.filter(function (r) { return r.flags.length; });
    if (state.filter === "meets") list = list.filter(function (r) { return r.metAll; });
    if (state.sort) list.sort(function (a, b) { return b.score - a.score || a.flags.length - b.flags.length; });

    var grid = $("#cand-grid");
    if (!R.length) { grid.innerHTML = '<div class="empty">Results show here. Try the sample batch to see how it works.</div>'; return; }
    if (!list.length) { grid.innerHTML = '<div class="empty">No CVs match this filter.</div>'; return; }
    grid.innerHTML = list.map(function (r, idx) {
      var check = r.flags.length > 0;
      return '<article class="cand ' + (check ? "s-check" : "s-clear") + '" style="animation-delay:' + idx * 40 + 'ms">' +
        '<div class="cand-top"><div><h3>' + esc(r.name) + '</h3><p class="cand-meta">' + (r.years ? r.years + " years" : "Experience not found") + " &middot; " + r.roles + (r.roles === 1 ? " role" : " roles") + " &middot; " + r.score + "/" + r.must.length + ' must-haves</p></div>' +
        '<span class="status ' + (check ? "check" : "clear") + '">' + (check ? r.flags.length + " to check" : "Nothing flagged") + "</span></div>" +
        '<div class="crit">' + r.must.map(function (m) { return '<span class="' + (m.ok ? "ok" : "miss") + '">' + esc(m.s) + "</span>"; }).join("") +
        r.nice.map(function (n) { return '<span class="nice">+ ' + esc(n) + "</span>"; }).join("") + "</div>" +
        (check ? '<ul class="flags">' + r.flags.map(function (f) { return '<li class="' + (f.pro ? "pro" : "") + '"><strong>' + esc(f.t) + "</strong><span>" + esc(f.d) + "</span></li>"; }).join("") + "</ul>" : '<p class="no-flags">No dates, contact details or wording stood out. Still verify claims in the screen.</p>') +
        '<details class="qs"><summary>Questions to ask (' + r.questions.length + ")</summary><ol>" + r.questions.map(function (q) { return "<li>" + esc(q) + "</li>"; }).join("") +
        '</ol><button class="btn btn-ghost btn-sm copy-q" type="button" data-copy="' + esc(r.questions.join("\n")) + '">Copy questions</button></details>' +
        "</article>";
    }).join("");
  }

  $("#cand-grid").addEventListener("click", function (e) {
    var b = e.target.closest("[data-copy]");
    if (b) window.bcCopy(b.getAttribute("data-copy"));
  });

  document.querySelectorAll(".seg button").forEach(function (b) {
    b.addEventListener("click", function () {
      document.querySelectorAll(".seg button").forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
      state.filter = b.getAttribute("data-filter");
      render();
    });
  });
  $("#sort-toggle").addEventListener("change", function (e) { state.sort = e.target.checked; render(); });

  $("#copy-summary").addEventListener("click", function () {
    if (!state.results.length) { window.bcToast("Screen some CVs first"); return; }
    var lines = [($("#job-title").value || "Role") + " shortlist summary", ""];
    state.results.forEach(function (r) {
      lines.push(r.name + " | " + r.score + "/" + r.must.length + " must-haves | " + (r.years || "?") + " yrs | " + (r.flags.length ? r.flags.map(function (f) { return f.t; }).join(", ") : "nothing flagged"));
    });
    window.bcCopy(lines.join("\n"));
  });

  /* ---------- Upgrade dialog ---------- */
  function openUpgrade() {
    var d = $("#upgrade");
    $("#upgrade-text").textContent = "The free plan screens 10 CVs at a time. Your batch has " + state.cvs.length + ". We'll screen the first 10 now.";
    if (d.showModal) { try { d.showModal(); } catch (e) {} }
  }

  /* ---------- Start in a working state ---------- */
  renderChips("must");
  renderChips("nice");
  loadSample();
  run();
})();
