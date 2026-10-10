(function () {
  const cards = Array.from(document.querySelectorAll(".card[data-src]"));
  const lb = document.getElementById("lightbox");
  const lbImg = document.getElementById("lb-img");
  let index = 0;

  function open(i) {
    index = i;
    lbImg.src = cards[index].dataset.src;
    lb.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function close() {
    lb.classList.remove("open");
    document.body.style.overflow = "";
    lbImg.src = "";
  }

  function go(d) {
    index = (index + d + cards.length) % cards.length;
    lbImg.src = cards[index].dataset.src;
  }

  cards.forEach((c, i) => {
    c.addEventListener("click", (e) => {
      e.preventDefault();
      open(i);
    });
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
