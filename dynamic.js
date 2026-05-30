/* ============================================================
   dynamic.js — live analysis widget loop + product-panel tilt.
   ============================================================ */
(function () {
  "use strict";

  /* ---------- Live analysis widget ---------- */
  var statusEl = document.getElementById("lc-status");
  var sentEl = document.getElementById("lc-sent");
  var rowsEl = document.getElementById("lc-rows");

  var SENTIMENT = "Bullish · big-tech & AI";
  var ROWS = [
    { sym: "AAPL", co: "Apple", m: "7× mentioned", top: true,  chg: "+2.4%", dir: "up" },
    { sym: "NVDA", co: "Nvidia", m: "5× mentioned", top: false, chg: "+3.1%", dir: "up" },
    { sym: "NOW",  co: "ServiceNow", m: "3× mentioned", top: false, chg: "-1.2%", dir: "dn" },
    { sym: "AMD",  co: "Advanced Micro Devices", m: "2× mentioned", top: false, chg: "+0.8%", dir: "up" }
  ];

  var timers = [];
  function later(fn, ms) { timers.push(setTimeout(fn, ms)); }
  function clearAll() { timers.forEach(clearTimeout); timers = []; }

  function rowHTML(r) {
    return (
      '<span class="lc-av">' + r.sym + '</span>' +
      '<span class="lc-id">' +
        '<span class="lc-sym">' + r.sym +
          (r.top ? ' <span class="top">★ Top Pick</span>' : "") +
        '</span>' +
        '<span class="lc-co">' + r.co + " · " + r.m + "</span>" +
      "</span>" +
      '<span class="lc-meta">' +
        '<span class="lc-buy">BUY</span>' +
        '<span class="lc-chg ' + r.dir + '">' + r.chg + "</span>" +
      "</span>"
    );
  }

  function cycle() {
    if (!statusEl || !sentEl || !rowsEl) return;
    // reset
    statusEl.classList.remove("done");
    statusEl.innerHTML = '<span class="lc-spin"></span> analyzing…';
    sentEl.textContent = "—";
    rowsEl.innerHTML = "";

    later(function () { sentEl.textContent = SENTIMENT; }, 750);

    ROWS.forEach(function (r, i) {
      later(function () {
        var el = document.createElement("div");
        el.className = "lc-row";
        el.innerHTML = rowHTML(r);
        rowsEl.appendChild(el);
        requestAnimationFrame(function () { el.classList.add("in"); });
      }, 1300 + i * 650);
    });

    later(function () {
      statusEl.classList.add("done");
      statusEl.innerHTML = "✓ analyzed in 4.2s";
    }, 1300 + ROWS.length * 650 + 450);

    // loop
    later(cycle, 8200);
  }
  if (statusEl) cycle();

  /* ---------- Product panel mouse-tilt ---------- */
  var section = document.getElementById("product");
  var shot = document.querySelector(".panel-shot");
  if (section && shot) {
    var raf = null, tx = 0, ty = 0;
    section.addEventListener("mousemove", function (e) {
      var r = shot.getBoundingClientRect();
      var dx = (e.clientX - (r.left + r.width / 2)) / r.width;
      var dy = (e.clientY - (r.top + r.height / 2)) / r.height;
      tx = Math.max(-1, Math.min(1, dx));
      ty = Math.max(-1, Math.min(1, dy));
      if (!raf) raf = requestAnimationFrame(apply);
    });
    section.addEventListener("mouseleave", function () {
      tx = 0; ty = 0;
      shot.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg)";
    });
    function apply() {
      raf = null;
      shot.style.transform =
        "perspective(1000px) rotateY(" + (tx * 9).toFixed(2) + "deg) rotateX(" +
        (-ty * 9).toFixed(2) + "deg)";
    }
  }

})();
