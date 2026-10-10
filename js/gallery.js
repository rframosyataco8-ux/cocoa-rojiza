(function () {
  /* ── Carousels ── */
  document.querySelectorAll(".carousel").forEach(initCarousel);

  function initCarousel(root) {
    const track = root.querySelector(".carousel-track");
    const slides = Array.from(root.querySelectorAll(".carousel-slide"));
    const btnPrev = root.querySelector(".carousel-btn.prev");
    const btnNext = root.querySelector(".carousel-btn.next");
    const progress = root.querySelector(".progress");
    const thumbsBox = root.querySelector(".thumbs");
    const interval = parseInt(root.dataset.interval, 10) || 4500;
    let index = 0;
    let timer = null;
    let paused = false;

    // Build thumbs
    slides.forEach((slide, i) => {
      const img = slide.querySelector("img");
      const t = document.createElement("button");
      t.type = "button";
      t.className = "thumb" + (i === 0 ? " active" : "");
      t.innerHTML = `<img src="${img.src}" alt="">`;
      t.addEventListener("click", () => goTo(i, true));
      thumbsBox.appendChild(t);
    });
    const thumbs = Array.from(thumbsBox.querySelectorAll(".thumb"));

    function goTo(i, userAction) {
      index = (i + slides.length) % slides.length;
      track.style.transform = `translateX(-${index * 100}%)`;
      thumbs.forEach((t, ti) => t.classList.toggle("active", ti === index));
      // scroll thumb into view
      thumbs[index].scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
      resetProgress(userAction);
    }

    function next() { goTo(index + 1); }
    function prev() { goTo(index - 1, true); }

    function resetProgress(userAction) {
      clearTimeout(timer);
      progress.classList.remove("running");
      progress.style.width = "0%";
      if (paused) return;
      // force reflow
      void progress.offsetWidth;
      progress.style.transitionDuration = interval + "ms";
      progress.classList.add("running");
      progress.style.width = "100%";
      timer = setTimeout(next, interval);
    }

    btnNext.addEventListener("click", () => { goTo(index + 1, true); });
    btnPrev.addEventListener("click", () => { goTo(index - 1, true); });

    // Pause on hover
    root.addEventListener("mouseenter", () => {
      paused = true;
      clearTimeout(timer);
      progress.classList.remove("running");
    });
    root.addEventListener("mouseleave", () => {
      paused = false;
      resetProgress();
    });

    // Click slide → lightbox
    slides.forEach((slide, i) => {
      slide.addEventListener("click", () => openLightbox(slides.map(s => s.dataset.src), i));
    });

    // Start
    goTo(0);
  }

  /* ── Lightbox ── */
  const lb = document.getElementById("lightbox");
  const lbImg = document.getElementById("lb-img");
  const lbClose = document.getElementById("lb-close");
  const lbPrev = document.getElementById("lb-prev");
  const lbNext = document.getElementById("lb-next");
  let lbSources = [];
  let lbIndex = 0;

  function openLightbox(sources, i) {
    lbSources = sources;
    lbIndex = i;
    lbImg.src = lbSources[lbIndex];
    lb.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    lb.classList.remove("open");
    document.body.style.overflow = "";
    lbImg.src = "";
  }

  function lbGo(delta) {
    lbIndex = (lbIndex + delta + lbSources.length) % lbSources.length;
    lbImg.src = lbSources[lbIndex];
  }

  lbClose.addEventListener("click", closeLightbox);
  lbPrev.addEventListener("click", () => lbGo(-1));
  lbNext.addEventListener("click", () => lbGo(1));
  lb.addEventListener("click", (e) => { if (e.target === lb) closeLightbox(); });

  document.addEventListener("keydown", (e) => {
    if (!lb.classList.contains("open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") lbGo(-1);
    if (e.key === "ArrowRight") lbGo(1);
  });

  // Compare image
  document.querySelectorAll(".lightbox-trigger").forEach((img) => {
    img.addEventListener("click", () => openLightbox([img.dataset.src || img.src], 0));
  });
})();
