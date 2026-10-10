(function () {
  const items = Array.from(document.querySelectorAll(".strip-item[data-src], .lb-only"));
  const sources = items.map((el) => el.dataset.src || el.src);
  const lb = document.getElementById("lightbox");
  const lbImg = document.getElementById("lb-img");
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

  items.forEach((el, i) => el.addEventListener("click", () => open(i)));

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
