const studentCard = document.querySelectorAll(".card");

studentCard.forEach((card) => {
  card.addEventListener("click", () => {
    window.location.replace(`/students/${card.dataset.id}`);
  });
});
