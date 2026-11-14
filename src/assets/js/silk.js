/* Burgundy silk, drawn live with WebGL. Pauses off screen, respects reduced motion,
   falls back to the static image set behind it. Usage: <canvas data-silk="seed" data-bright="1"></canvas> */
(function () {
  "use strict";
  var FRAG = [
    "precision highp float;",
    "uniform vec2 r; uniform float t; uniform vec2 m; uniform float seed; uniform float bright;",
    "float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}",
    "float noise(vec2 p){vec2 i=floor(p),f=fract(p);vec2 u=f*f*(3.-2.*f);",
    " return mix(mix(hash(i),hash(i+vec2(1.,0.)),u.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),u.x),u.y);}",
    "float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<3;i++){v+=a*noise(p);p=p*2.03+vec2(1.7,9.2);a*=.5;}return v;}",
    "float field(vec2 p,float tt){p*=.55;vec2 q=vec2(fbm(p+vec2(0.,tt)),fbm(p+vec2(5.2,1.3)-tt));",
    " vec2 w=vec2(fbm(p+1.4*q+vec2(1.7,9.2)+tt*.6),fbm(p+1.4*q+vec2(8.3,2.8)-tt*.4));",
    " return p.x*1.5+p.y*.8+1.25*w.x+.7*q.y;}",
    "void main(){",
    " vec2 uv=gl_FragCoord.xy/r; vec2 p=(gl_FragCoord.xy-.5*r)/r.y;",
    " p+=(m-.5)*vec2(.18,.12);",
    " float tt=t*.045+seed*7.31;",
    " float e=1.5/r.y;",
    " float f=field(p,tt); float fx=field(p+vec2(e,0.),tt); float fy=field(p+vec2(0.,e),tt);",
    " float s=sin(f*16.); float sx=sin(fx*16.); float sy=sin(fy*16.);",
    " vec3 n=normalize(vec3((s-sx)*.9,(s-sy)*.9,e*5.));",
    " vec3 L=normalize(vec3(-.45,.65,.6));",
    " float dif=clamp(dot(n,L),0.,1.);",
    " float spec=pow(clamp(dot(reflect(-L,n),vec3(0.,0.,1.)),0.,1.),28.);",
    " vec3 deep=vec3(.035,.0,.012); vec3 wine=vec3(.30,.0,.075); vec3 hi=vec3(.62,.07,.17);",
    " vec3 col=mix(deep,wine,pow(smoothstep(.0,1.,dif),1.15));",
    " col=mix(col,hi,pow(dif,6.)*.75*bright);",
    " col+=vec3(1.,.82,.86)*spec*.55*bright;",
    " float vig=smoothstep(-.15,1.05,uv.x*.85+uv.y*.35);",
    " col*=mix(.28,1.,vig);",
    " col+=(hash(gl_FragCoord.xy+fract(t))-.5)*.025;",
    " gl_FragColor=vec4(col,1.);",
    "}"
  ].join("\n");
  var VERT = "attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}";

  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function start(canvas) {
    var gl = canvas.getContext("webgl", { antialias: false, alpha: false, powerPreference: "low-power", preserveDrawingBuffer: !!window.BC_SILK_CAPTURE });
    if (!gl) return;
    function sh(type, src) { var s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s; }
    var prog = gl.createProgram();
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);
    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    var loc = gl.getAttribLocation(prog, "a");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    var U = { r: gl.getUniformLocation(prog, "r"), t: gl.getUniformLocation(prog, "t"), m: gl.getUniformLocation(prog, "m"), seed: gl.getUniformLocation(prog, "seed"), bright: gl.getUniformLocation(prog, "bright") };
    gl.uniform1f(U.seed, parseFloat(canvas.getAttribute("data-silk")) || 0);
    gl.uniform1f(U.bright, parseFloat(canvas.getAttribute("data-bright") || "1"));

    var scale = parseFloat(canvas.getAttribute("data-scale") || (window.innerWidth < 700 ? "0.5" : "0.7"));
    var mouse = [0.5, 0.5], target = [0.5, 0.5];
    function resize() {
      var w = Math.max(2, Math.round(canvas.clientWidth * scale)), h = Math.max(2, Math.round(canvas.clientHeight * scale));
      if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; gl.viewport(0, 0, w, h); }
      gl.uniform2f(U.r, w, h);
    }
    resize();
    window.addEventListener("resize", resize, { passive: true });
    if (window.matchMedia("(pointer: fine)").matches) {
      window.addEventListener("pointermove", function (e) { target = [e.clientX / window.innerWidth, 1 - e.clientY / window.innerHeight]; }, { passive: true });
    }

    var visible = true, raf = 0, t0 = performance.now(), tFixed = parseFloat(canvas.getAttribute("data-time") || "8");
    function frame(now) {
      raf = 0;
      mouse[0] += (target[0] - mouse[0]) * 0.04; mouse[1] += (target[1] - mouse[1]) * 0.04;
      gl.uniform2f(U.m, mouse[0], mouse[1]);
      gl.uniform1f(U.t, reduce || window.BC_SILK_CAPTURE ? tFixed : tFixed + (now - t0) / 1000);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      canvas.classList.add("is-live");
      if (!reduce && !window.BC_SILK_CAPTURE && visible && !document.hidden) raf = requestAnimationFrame(frame);
    }
    function kick() { if (!raf) raf = requestAnimationFrame(frame); }
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (en) { visible = en[0].isIntersecting; if (visible) kick(); }).observe(canvas);
    }
    document.addEventListener("visibilitychange", function () { if (!document.hidden) kick(); });
    kick();
  }

  function init() { document.querySelectorAll("canvas[data-silk]").forEach(start); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
