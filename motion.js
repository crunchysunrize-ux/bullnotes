/* ============================================================
   motion.js — nav state, reveal-on-scroll, CTA bull drift.
   The hero stampede is a pure CSS infinite loop (see hero.css).
   ============================================================ */
(function () {
  "use strict";

  var nav = document.querySelector(".nav");
  var ctaBull = document.querySelector(".cta-bull");

  // ---- reveal-on-scroll ----
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    });
  }, { threshold: 0.16 });
  document.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });

  // ---- nav background on scroll ----
  function onScroll() {
    if (nav) nav.classList.toggle("scrolled", window.scrollY > 24);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // ---- CTA bull drifts in as its section arrives ----
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function frame() {
    if (ctaBull) {
      var r = ctaBull.getBoundingClientRect();
      var vh = window.innerHeight;
      var p = clamp((vh - r.top) / (vh + r.height), 0, 1);
      ctaBull.style.transform = "translateX(" + (38 - p * 44) + "vw)";
    }
    requestAnimationFrame(frame);
  }
  if (ctaBull) requestAnimationFrame(frame);

})();
