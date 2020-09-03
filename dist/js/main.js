const canvas = document.querySelector("#canvas");
const headerSection = document.querySelector(".header");
const startNowBtn = document.querySelector(".header--button");
const instructionSection = document.querySelector(".instructions");
const instructionBtn = document.querySelector(".instructions--button");
const playNowSection = document.querySelector(".header__play-section");
let gameStart = false;

// CANVAS STRUCTURE

startNowBtn.addEventListener("click", () => {
  setTimeout(() => {
    headerSection.classList.add("no-show");
    playNowSection.classList.add("no-show");
    instructionSection.classList.remove("no-show");
  }, 1000);
});

instructionBtn.addEventListener("click", () => {
  setTimeout(() => {
    instructionSection.classList.add("no-show");
    canvas.classList.remove("no-show");
  }, 1000);
});
