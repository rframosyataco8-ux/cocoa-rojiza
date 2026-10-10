(function () {
  const cards = Array.from(document.querySelectorAll(".card[data-src]"));
  const lb = document.getElementById("lightbox");
  const lbImg = document.getElementById("lb-img");
  const lbCap = document.getElementById("lb-caption");
  const btnClose = document.getElementById("lb-close");
  const btnPrev = document.getElementById("lb-prev");
  const btnNext = document.getElementById("lb-next");

  let index = 0;

  function open(i) {
    index = i;
    const card = cards[index];
    lbImg.src = card.dataset.src;
    lbImg.alt = card.dataset.alt || "";
    lbCap.textContent = card.dataset.alt || "";
    lb.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function close() {
    lb.classList.remove("open");
    document.body.style.overflow = "";
    lbImg.src = "";
  }

  function prev() {
    open((index - 1 + cards.length) % cards.length);
  }

  function next() {
    open((index + 1) % cards.length);
  }

  cards.forEach((card, i) => {
    card.addEventListener("click", (e) => {
      e.preventDefault();
      open(i);
    });
  });

  btnClose.addEventListener("click", close);
  btnPrev.addEventListener("click", prev);
  btnNext.addEventListener("click", next);

  lb.addEventListener("click", (e) => {
    if (e.target === lb) close();
  });

  document.addEventListener("keydown", (e) => {
    if (!lb.classList.contains("open")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") prev();
    if (e.key === "ArrowRight") next();
  });
})();
