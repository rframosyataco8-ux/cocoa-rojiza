(function () {
  /* ── Slideshows ── */
  document.querySelectorAll(".slideshow").forEach(initSS);

  function initSS(root) {
    const slides = Array.from(root.querySelectorAll(".slide"));
    const progress = root.querySelector(".ss-progress");
    const curEl = root.querySelector(".ss-count .cur");
    const btnPrev = root.querySelector(".ss-prev");
    const btnNext = root.querySelector(".ss-next");
    const interval = parseInt(root.dataset.interval, 10) || 4000;
    let index = 0;
    let timer = null;
    let paused = false;

    function show(i) {
      index = (i + slides.length) % slides.length;
      slides.forEach((s, si) => s.classList.toggle("active", si === index));
      if (curEl) curEl.textContent = index + 1;
      resetBar();
    }

    function resetBar() {
      clearTimeout(timer);
      progress.style.transition = "none";
      progress.style.width = "0%";
      if (paused) return;
      void progress.offsetWidth;
      progress.style.transition = "width " + interval + "ms linear";
      progress.style.width = "100%";
      timer = setTimeout(() => show(index + 1), interval);
    }

    btnNext.addEventListener("click", (e) => { e.stopPropagation(); show(index + 1); });
    btnPrev.addEventListener("click", (e) => { e.stopPropagation(); show(index - 1); });

    root.addEventListener("mouseenter", () => {
      paused = true;
      clearTimeout(timer);
      progress.style.transition = "none";
    });
    root.addEventListener("mouseleave", () => {
      paused = false;
      resetBar();
    });

    slides.forEach((s, i) => {
      s.addEventListener("click", () => openLb(slides.map(x => x.dataset.src), i));
    });

    show(0);
  }

  /* ── Lightbox ── */
  const lb = document.getElementById("lightbox");
  const lbImg = document.getElementById("lb-img");
  let lbSrcs = [];
  let lbIdx = 0;

  function openLb(srcs, i) {
    lbSrcs = srcs;
    lbIdx = i;
    lbImg.src = lbSrcs[lbIdx];
    lb.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeLb() {
    lb.classList.remove("open");
    document.body.style.overflow = "";
    lbImg.src = "";
  }

  function lbGo(d) {
    lbIdx = (lbIdx + d + lbSrcs.length) % lbSrcs.length;
    lbImg.src = lbSrcs[lbIdx];
  }

  document.getElementById("lb-close").addEventListener("click", closeLb);
  document.getElementById("lb-prev").addEventListener("click", () => lbGo(-1));
  document.getElementById("lb-next").addEventListener("click", () => lbGo(1));
  lb.addEventListener("click", (e) => { if (e.target === lb) closeLb(); });

  document.addEventListener("keydown", (e) => {
    if (!lb.classList.contains("open")) return;
    if (e.key === "Escape") closeLb();
    if (e.key === "ArrowLeft") lbGo(-1);
    if (e.key === "ArrowRight") lbGo(1);
  });

  document.querySelectorAll(".lb-only").forEach((img) => {
    img.addEventListener("click", () => openLb([img.dataset.src || img.src], 0));
  });
})();
