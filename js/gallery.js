(function () {
  const lb = document.getElementById("lightbox");
  const lbImg = document.getElementById("lb-img");
  const items = Array.from(document.querySelectorAll(".marquee-item[data-src], .lb-src"));
  const sources = items.map((el) => el.dataset.src || el.src);
  let index = 0;

  function open(i) {
    index = i;
    lbImg.src = sources[index];
    lb.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function close() {
    lb.classList.remove("open");
    document.body.style.overflow = "";
    lbImg.src = "";
  }

  function go(d) {
    index = (index + d + sources.length) % sources.length;
    lbImg.src = sources[index];
  }

  items.forEach((el, i) => {
    el.addEventListener("click", () => open(i));
  });

  document.getElementById("lb-close").addEventListener("click", close);
  document.getElementById("lb-prev").addEventListener("click", () => go(-1));
  document.getElementById("lb-next").addEventListener("click", () => go(1));
  lb.addEventListener("click", (e) => { if (e.target === lb) close(); });

  document.addEventListener("keydown", (e) => {
    if (!lb.classList.contains("open")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") go(-1);
    if (e.key === "ArrowRight") go(1);
  });
})();
