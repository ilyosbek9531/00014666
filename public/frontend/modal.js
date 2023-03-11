const modalBtn = document.querySelectorAll(".close");

modalBtn.forEach((btn) => {
  const modal = document.querySelector(".modal");
  if (modal) {
    document.body.style.height = "100vh";
    document.body.style.overflow = "hidden";
  }
  btn.addEventListener("click", () => {
    if (btn.dataset.modal == "close") {
      modal.style.display = "none";
    }
    if (btn.dataset.modal == "successfully added") {
      window.location.replace("/students");
    }
    document.body.style.height = "100%";
    document.body.style.overflow = "unset";
  });
});
