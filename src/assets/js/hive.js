/* Beyond Hive: a swarm of bees flies in and builds the three-cell logo in 3D.
   Plain canvas 2D with a small perspective projection. No libraries.
   Drag or move the pointer to tilt, hover to scatter, click or tap to rebuild. */
(function () {
  "use strict";
  var canvas = document.querySelector("canvas[data-hive]");
  if (!canvas) return;
  var ctx = canvas.getContext("2d");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var small = window.innerWidth < 700;

  /* ---------- Logo geometry (same numbers as the SVG mark) ---------- */
  var R = 5.5, DX = R * Math.sqrt(3) + 0.9;
  var HEX = [
    { cx: 12, cy: 7.2, kind: "wine" },
    { cx: 12 - DX / 2, cy: 16.6, kind: "light" },
    { cx: 12 + DX / 2, cy: 16.6, kind: "ring" },
  ];
  var CY = (7.2 + 16.6 * 2) / 3, S = 1 / 11, DEPTH = 0.14;
  function verts(h) {
    var v = [];
    for (var a = -90; a < 270; a += 60) {
      var r = (a * Math.PI) / 180;
      v.push([(h.cx + R * Math.cos(r) - 12) * S, -(h.cy + R * Math.sin(r) - CY) * S]);
    }
    return v;
  }
  function inside(px, py, v) {
    var c = false;
    for (var i = 0, j = v.length - 1; i < v.length; j = i++) {
      if ((v[i][1] > py) !== (v[j][1] > py) && px < ((v[j][0] - v[i][0]) * (py - v[i][1])) / (v[j][1] - v[i][1]) + v[i][0]) c = !c;
    }
    return c;
  }

  var pts = [];
  var step = small ? 0.085 : 0.06;
  HEX.forEach(function (h) {
    var v = verts(h);
    h.v = v;
    var faces = [-DEPTH, DEPTH];
    // edges, front and back
    faces.forEach(function (z) {
      for (var i = 0; i < 6; i++) {
        var a = v[i], b = v[(i + 1) % 6], n = Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / (step * (h.kind === "ring" ? 0.55 : 0.8)));
        for (var k = 0; k < n; k++) {
          var t = k / n;
          pts.push({ tx: a[0] + (b[0] - a[0]) * t, ty: a[1] + (b[1] - a[1]) * t, tz: z, kind: h.kind, edge: true });
        }
      }
    });
    // filled faces for the two solid cells
    if (h.kind !== "ring") {
      for (var x = -0.6; x <= 0.6; x += step) {
        for (var y = -0.7; y <= 0.7; y += step * 0.87) {
          var ox = ((Math.round(y / (step * 0.87)) & 1) ? step / 2 : 0);
          if (inside(x + ox, y, v)) {
            pts.push({ tx: x + ox, ty: y, tz: DEPTH, kind: h.kind, edge: false });
            if (Math.random() < 0.35) pts.push({ tx: x + ox, ty: y, tz: -DEPTH, kind: h.kind, edge: false });
          }
        }
      }
    }
  });

  /* ---------- Swarm state ---------- */
  var T0 = 0;
  function scatter(fromCurrent) {
    pts.forEach(function (p) {
      var th = Math.random() * Math.PI * 2, ph = Math.acos(2 * Math.random() - 1), rad = 2.4 + Math.random() * 2.2;
      if (fromCurrent && p.x !== undefined) {
        var d = Math.hypot(p.x, p.y, p.z) || 1;
        p.sx = p.x + (p.x / d) * (0.8 + Math.random() * 1.6);
        p.sy = p.y + (p.y / d) * (0.8 + Math.random() * 1.6) + (Math.random() - 0.5);
        p.sz = p.z + (Math.random() - 0.5) * 2;
      } else {
        p.sx = rad * Math.sin(ph) * Math.cos(th) + 1.2;
        p.sy = rad * Math.cos(ph) * 0.7;
        p.sz = rad * Math.sin(ph) * Math.sin(th);
      }
      p.delay = Math.random() * 1.1 + (p.edge ? 0 : 0.35);
      p.dur = 1.9 + Math.random() * 0.9;
      p.spin = (Math.random() < 0.5 ? -1 : 1) * (2.5 + Math.random() * 3);
      p.seed = Math.random() * 100;
      p.ox = 0; p.oy = 0; p.vx = 0; p.vy = 0;
      p.px = undefined;
    });
    T0 = performance.now();
  }
  scatter(false);

  var BEES = [];
  for (var b = 0; b < (small ? 14 : 26); b++) {
    BEES.push({ a: Math.random() * Math.PI * 2, sp: (0.35 + Math.random() * 0.5) * (Math.random() < 0.5 ? -1 : 1), r: 0.95 + Math.random() * 0.75, tilt: (Math.random() - 0.5) * 1.2, bob: Math.random() * 10, px: undefined });
  }

  /* ---------- Sprites for glow ---------- */
  function sprite(rgb) {
    var c = document.createElement("canvas"); c.width = c.height = 32;
    var g = c.getContext("2d"), gr = g.createRadialGradient(16, 16, 0, 16, 16, 16);
    gr.addColorStop(0, "rgba(" + rgb + ",1)"); gr.addColorStop(0.25, "rgba(" + rgb + ",.75)"); gr.addColorStop(1, "rgba(" + rgb + ",0)");
    g.fillStyle = gr; g.fillRect(0, 0, 32, 32); return c;
  }
  var SPR = { wine: sprite("226,62,96"), light: sprite("255,244,246"), ring: sprite("194,50,79"), bee: sprite("255,236,214") };
  var INK = { wine: "rgba(140,10,40,", light: "rgba(15,10,12,", ring: "rgba(160,20,52,", bee: "rgba(102,0,27," };

  /* ---------- View ---------- */
  var W = 0, H = 0, DPR = Math.min(window.devicePixelRatio || 1, 2), F = 1;
  function resize() {
    var r = canvas.getBoundingClientRect();
    W = r.width; H = r.height;
    canvas.width = Math.round(W * DPR); canvas.height = Math.round(H * DPR);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    F = Math.min(W, H) * 0.95;
  }
  resize();
  window.addEventListener("resize", resize, { passive: true });

  var rotY = -0.5, rotX = 0.12, tRotY = 0, tRotX = 0.12;
  var pointer = { x: -9999, y: -9999, in: false };
  canvas.addEventListener("pointermove", function (e) {
    var r = canvas.getBoundingClientRect();
    pointer.x = e.clientX - r.left; pointer.y = e.clientY - r.top; pointer.in = true;
    tRotY = ((pointer.x / W) - 0.5) * 0.9;
    tRotX = 0.12 - ((pointer.y / H) - 0.5) * 0.5;
  });
  canvas.addEventListener("pointerleave", function () { pointer.in = false; pointer.x = pointer.y = -9999; tRotX = 0.12; });
  canvas.addEventListener("click", function () { if (!reduce) scatter(true); });
  canvas.addEventListener("keydown", function (e) { if ((e.key === "Enter" || e.key === " ") && !reduce) { e.preventDefault(); scatter(true); } });

  function project(x, y, z) {
    var cy = Math.cos(rotY), sy = Math.sin(rotY), cx = Math.cos(rotX), sx = Math.sin(rotX);
    var x1 = x * cy + z * sy, z1 = -x * sy + z * cy;
    var y1 = y * cx - z1 * sx, z2 = y * sx + z1 * cx;
    var d = 3.2 / (3.2 - z2);
    return [W / 2 + x1 * F * 0.47 * d, H / 2 - y1 * F * 0.47 * d, d, z2];
  }

  function easeOut(t) { return 1 - Math.pow(1 - t, 3); }
  function isLight() { return document.documentElement.getAttribute("data-theme") === "light"; }

  /* ---------- Frame ---------- */
  var visible = true, raf = 0;
  function frame(now) {
    raf = 0;
    var t = reduce ? 99 : (now - T0) / 1000;
    var light = isLight();
    ctx.clearRect(0, 0, W, H);
    ctx.globalCompositeOperation = light ? "source-over" : "lighter";

    // idle sway once formed
    var idle = Math.max(0, t - 2.8);
    if (!pointer.in) tRotY = Math.sin(idle * 0.45) * 0.42 + (t < 3 ? -0.5 * (1 - t / 3) : 0);
    rotY += (tRotY - rotY) * 0.05; rotX += (tRotX - rotX) * 0.05;

    var formed = 0;
    // wireframe, fades in as the hive forms
    var wf = Math.max(0, Math.min(1, (t - 2.2) / 1.2));
    if (wf > 0) {
      ctx.lineWidth = 1;
      HEX.forEach(function (h) {
        var col = light ? (h.kind === "light" ? "15,10,12" : "140,10,40") : (h.kind === "light" ? "255,240,244" : "226,62,96");
        [-DEPTH, DEPTH].forEach(function (z, zi) {
          ctx.beginPath();
          h.v.forEach(function (v, i) { var p = project(v[0], v[1], z); i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]); });
          ctx.closePath();
          ctx.strokeStyle = "rgba(" + col + "," + (wf * (zi ? (light ? 0.8 : 0.55) : (light ? 0.4 : 0.25))) + ")"; ctx.lineWidth = light ? 1.4 : 1;
          ctx.stroke();
        });
        ctx.beginPath();
        h.v.forEach(function (v) { var a = project(v[0], v[1], -DEPTH), b2 = project(v[0], v[1], DEPTH); ctx.moveTo(a[0], a[1]); ctx.lineTo(b2[0], b2[1]); });
        ctx.strokeStyle = "rgba(" + col + "," + wf * 0.3 + ")";
        ctx.stroke();
      });
    }

    for (var i = 0; i < pts.length; i++) {
      var p = pts[i];
      var k = Math.max(0, Math.min(1, (t - p.delay) / p.dur)), e = easeOut(k);
      if (k >= 1) formed++;
      var ang = (1 - e) * p.spin;
      var dx = p.sx - p.tx, dy = p.sy - p.ty, dz = p.sz - p.tz;
      var ca = Math.cos(ang), sa = Math.sin(ang);
      var rx = dx * ca - dz * sa, rz = dx * sa + dz * ca;
      var jit = (1 - e) * 0.12;
      p.x = p.tx + rx * (1 - e) + Math.sin(t * 9 + p.seed) * jit;
      p.y = p.ty + dy * (1 - e) + Math.cos(t * 7 + p.seed) * jit;
      p.z = p.tz + rz * (1 - e);
      if (k >= 1) { p.y += Math.sin(t * 1.6 + p.tx * 4) * 0.008; }
      var pr = project(p.x, p.y, p.z);
      if (pr[2] <= 0.05 || pr[2] > 6) { p.px = undefined; continue; }

      // pointer scatter in screen space, spring back
      if (pointer.in) {
        var ddx = pr[0] + p.ox - pointer.x, ddy = pr[1] + p.oy - pointer.y, dd = ddx * ddx + ddy * ddy, RR = 70 * 70;
        if (dd < RR) { var f2 = (1 - dd / RR) * 3.2, inv = 1 / (Math.sqrt(dd) + 0.01); p.vx += ddx * inv * f2; p.vy += ddy * inv * f2; }
      }
      p.vx += -p.ox * 0.06; p.vy += -p.oy * 0.06; p.vx *= 0.84; p.vy *= 0.84; p.ox += p.vx; p.oy += p.vy;
      var X = pr[0] + p.ox, Y = pr[1] + p.oy, d = pr[2];
      var size = (p.edge ? 2.1 : 1.6) * d * (small ? 1.1 : 1);
      var tw = 0.75 + 0.25 * Math.sin(t * 3 + p.seed);
      var alpha = Math.max(0.15, Math.min(1, (pr[3] + 0.6))) * tw;

      // flight streak while travelling
      if (k < 1 && p.px !== undefined) {
        ctx.strokeStyle = light ? INK[p.kind] + 0.35 * alpha + ")" : "rgba(226,62,96," + 0.4 * alpha + ")";
        ctx.lineWidth = Math.max(0.6, size * 0.55);
        ctx.beginPath(); ctx.moveTo(p.px, p.py); ctx.lineTo(X, Y); ctx.stroke();
      }
      p.px = X; p.py = Y;

      if (light) {
        ctx.fillStyle = INK[p.kind] + alpha + ")";
        ctx.beginPath(); ctx.arc(X, Y, size * 1.05, 0, 6.283); ctx.fill();
      } else {
        ctx.globalAlpha = alpha;
        var s2 = size * 5;
        ctx.drawImage(SPR[p.kind], X - s2 / 2, Y - s2 / 2, s2, s2);
        ctx.globalAlpha = 1;
      }
    }

    // guard bees orbiting the hive
    var bt = reduce ? 0 : now / 1000;
    BEES.forEach(function (bee) {
      bee.a += reduce ? 0 : bee.sp * 0.016;
      var x = Math.cos(bee.a) * bee.r, z = Math.sin(bee.a) * bee.r * 0.7;
      var y = Math.sin(bee.a * 2 + bee.bob) * 0.22 + bee.tilt * Math.sin(bee.a) * 0.5;
      var pr = project(x, y, z), X = pr[0], Y = pr[1];
      if (pr[2] <= 0.05) return;
      if (bee.px !== undefined && !reduce) {
        var g = ctx.createLinearGradient(bee.px, bee.py, X, Y);
        g.addColorStop(0, light ? "rgba(102,0,27,0)" : "rgba(194,50,79,0)");
        g.addColorStop(1, light ? "rgba(102,0,27,.55)" : "rgba(255,200,210,.7)");
        ctx.strokeStyle = g; ctx.lineWidth = 1.4 * pr[2];
        ctx.beginPath(); ctx.moveTo(bee.trx || bee.px, bee.try_ || bee.py); ctx.lineTo(X, Y); ctx.stroke();
      }
      bee.trx = bee.px; bee.try_ = bee.py; bee.px = X; bee.py = Y;
      var wing = 0.6 + 0.4 * Math.abs(Math.sin(bt * 40 + bee.bob));
      if (light) {
        ctx.fillStyle = "rgba(102,0,27,.9)"; ctx.beginPath(); ctx.arc(X, Y, 2.2 * pr[2], 0, 6.283); ctx.fill();
        ctx.fillStyle = "rgba(102,0,27," + 0.25 * wing + ")"; ctx.beginPath(); ctx.ellipse(X, Y - 2.6 * pr[2], 2.6 * pr[2] * wing, 1.3 * pr[2], 0, 0, 6.283); ctx.fill();
      } else {
        var s3 = 13 * pr[2];
        ctx.drawImage(SPR.bee, X - s3 / 2, Y - s3 / 2, s3, s3);
        ctx.fillStyle = "rgba(255,255,255," + 0.35 * wing + ")"; ctx.beginPath(); ctx.ellipse(X, Y - 2.4 * pr[2], 3 * pr[2] * wing, 1.4 * pr[2], 0, 0, 6.283); ctx.fill();
      }
    });

    ctx.globalCompositeOperation = "source-over";
    canvas.classList.toggle("is-formed", formed > pts.length * 0.95);
    if (!reduce && visible && !document.hidden) raf = requestAnimationFrame(frame);
  }
  function kick() { if (!raf) raf = requestAnimationFrame(frame); }
  if ("IntersectionObserver" in window) new IntersectionObserver(function (en) { visible = en[0].isIntersecting; if (visible) kick(); }).observe(canvas);
  document.addEventListener("visibilitychange", function () { if (!document.hidden) kick(); });
  document.addEventListener("bh-theme", kick);
  canvas.classList.add("is-live");
  kick();
})();
