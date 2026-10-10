(function () {
  document.querySelectorAll(".carousel").forEach(initCarousel);

  function initCarousel(root) {
    const viewport = root.querySelector(".carousel-viewport");
    const track = root.querySelector(".carousel-track");
    const items = Array.from(root.querySelectorAll(".carousel-item"));
    const btnPrev = root.querySelector(".carousel-btn.prev");
    const btnNext = root.querySelector(".carousel-btn.next");
    const curEl = root.querySelector(".carousel-meta .cur");
    const bar = root.querySelector(".carousel-progress span");
    const interval = parseInt(root.dataset.interval, 10) || 3800;
    const n = items.length;
    let index = 0;
    let timer = null;
    let paused = false;

    function step() {
      if (!items[0]) return 0;
      const style = getComputedStyle(track);
      const gap = parseFloat(style.gap) || 16;
      return items[0].offsetWidth + gap;
    }

    function goTo(i) {
      index = ((i % n) + n) % n;
      const s = step();
      const vpW = viewport.offsetWidth;
      const offset = index * s - (vpW / 2) + (items[0].offsetWidth / 2);
      track.style.transform = `translateX(${-Math.max(0, offset)}px)`;
      items.forEach((el, ei) => el.classList.toggle("active", ei === index));
      if (curEl) curEl.textContent = index + 1;
      resetBar();
    }

    function resetBar() {
      clearTimeout(timer);
      if (!bar) return;
      bar.style.transition = "none";
      bar.style.width = "0%";
      if (paused) return;
      void bar.offsetWidth;
      bar.style.transition = "width " + interval + "ms linear";
      bar.style.width = "100%";
      timer = setTimeout(() => goTo(index + 1), interval);
    }

    btnNext.addEventListener("click", () => goTo(index + 1));
    btnPrev.addEventListener("click", () => goTo(index - 1));

    root.addEventListener("mouseenter", () => {
      paused = true;
      clearTimeout(timer);
      if (bar) bar.style.transition = "none";
    });
    root.addEventListener("mouseleave", () => {
      paused = false;
      resetBar();
    });

    items.forEach((el, i) => {
      el.addEventListener("click", () => {
        if (i === index) openLb(items.map(x => x.dataset.src), i);
        else goTo(i);
      });
    });

    window.addEventListener("resize", () => goTo(index));
    requestAnimationFrame(() => goTo(0));
  }

  /* Lightbox */
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
