(function () {
  const items = Array.from(document.querySelectorAll(".item[data-src]"));
  const lb = document.getElementById("lightbox");
  const lbImg = document.getElementById("lb-img");
  const btnClose = document.getElementById("lb-close");
  const btnPrev = document.getElementById("lb-prev");
  const btnNext = document.getElementById("lb-next");

  let index = 0;

  function open(i) {
    index = i;
    lbImg.src = items[index].dataset.src;
    lb.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function close() {
    lb.classList.remove("open");
    document.body.style.overflow = "";
    lbImg.src = "";
  }

  function prev() { open((index - 1 + items.length) % items.length); }
  function next() { open((index + 1) % items.length); }

  items.forEach((el, i) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      open(i);
    });
  });

  btnClose.addEventListener("click", close);
  btnPrev.addEventListener("click", prev);
  btnNext.addEventListener("click", next);

  lb.addEventListener("click", (e) => { if (e.target === lb) close(); });

  document.addEventListener("keydown", (e) => {
    if (!lb.classList.contains("open")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") prev();
    if (e.key === "ArrowRight") next();
  });
})();
