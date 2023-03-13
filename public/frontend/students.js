const genders = document.querySelectorAll(".gender");

genders.forEach((gender) => {
  const urlParams = new URLSearchParams(location.search);

  gender.addEventListener("click", () => {
    window.location.replace(`/students?gender=${gender.dataset.gender}`);
  });
  for (const [_, value] of urlParams) {
    if (gender.dataset.gender == value) {
      gender.style.opacity = 1;
    }
  }
});
