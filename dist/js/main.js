const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");
const headerSection = document.querySelector(".header");
const startNowBtn = document.querySelector(".header--button");
const instructionSection = document.querySelector(".instructions");
const instructionBtn = document.querySelector(".instructions--button");
const playNowSection = document.querySelector(".header__play-section");
let gameStart = false;
let animateId;

// Event Listeners
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

// JIM Sprite
const jimmyImage = new Image();
jimmyImage.src = "img/char-sprite.png";

let jimmyObj = {
  x: canvas.width / 2,
  y: canvas.height - 50,
  w: 34.5,
  h: 35.5,
  health: 100,
  str: 25,
  paperAmount: 50,
  spriteX: 0,
  spriteY: 640,
  alive: true,
  shoot: false,
};

if (jimmyObj.health <= 0) {
  jimmyObj.alive = false;
}

const drawJimmy = () => {
  ctx.fillStyle = "red";
  ctx.fillRect(jimmyObj.x + 2, jimmyObj.y, 30, 3);
  ctx.fillStyle = "lightgreen";
  ctx.fillRect(jimmyObj.x + 2, jimmyObj.y, (jimmyObj.health / 100) * 30, 3);

  if (
    jimmyObj.shoot === true &&
    jimmyObj.spriteX < 768 &&
    jimmyObj.paperAmount > 0
  ) {
    console.log(jimmyObj.shoot);
    jimmyObj.spriteX += 64;
  } else if (jimmyObj.shoot === true && jimmyObj.spriteX < 768) {
    jimmyObj.shoot = false;
  }

  ctx.drawImage(
    jimmyImage,
    jimmyObj.spriteX,
    jimmyObj.spriteY,
    64,
    64,
    jimmyObj.x,
    jimmyObj.y,
    jimmyObj.w,
    jimmyObj.h
  );
};

const moveJimmy = (e) => {
  if (e === "ArrowUp") {
    jimmyObj.y -= 15;
    jimmyObj.spriteY = 512;
    jimmyObj.shoot = false;
  } else if (e === "ArrowLeft") {
    jimmyObj.x -= 15;
    jimmyObj.spriteY = 576;
    jimmyObj.shoot = false;
  } else if (e === "ArrowRight") {
    jimmyObj.x += 15;
    jimmyObj.spriteY = 704;
    jimmyObj.shoot = false;
  } else if (e === "ArrowDown") {
    jimmyObj.y += 15;
    jimmyObj.spriteY = 640;
    jimmyObj.shoot = false;
  } else if (e === " ") {
    jimmyObj.spriteX = 0;
    jimmyObj.spriteY = 1088;
  }

  if (jimmyObj.spriteX >= 512) {
    jimmyObj.spriteX = 0;
  }
  jimmyObj.spriteX += 64;
};

// PAPER BALL CREATION
const paperBalls = [];
const shoot = () => {
  jimmyObj.shoot = true;
  if (jimmyObj.paperAmount === 0) {
    console.log("out of paper");
    return;
  } else {
    jimmyObj.paperAmount--;

    const paperBall = {
      x: jimmyObj.x,
      y: jimmyObj.y + jimmyObj.h / 2,
      w: 3,
      h: 3,
    };
    paperBalls.push(paperBall);
  }
};

const drawPaperBalls = () => {
  ctx.fillStyle = "white";
  paperBalls.forEach((paperBall) => {
    ctx.fillRect((paperBall.x -= 15), paperBall.y, paperBall.w, paperBall.h);
  });
};

// MOVEMENT KEYS
document.onkeydown = (e) => {
  if (e.key === "ArrowUp" && jimmyObj.y > 100) {
    moveJimmy(e.key);
  } else if (e.key === "ArrowLeft" && jimmyObj.x > 0) {
    moveJimmy(e.key);
  } else if (e.key === "ArrowDown" && jimmyObj.y < 106) {
    moveJimmy(e.key);
  } else if (e.key === "ArrowRight" && jimmyObj.x < 270) {
    moveJimmy(e.key);
  }
  if (e.key === " ") {
    shoot();
    moveJimmy(e.key);
  }
};

document.onkeyup = (e) => {
  if (
    e.key === "ArrowUp" ||
    e.key === "ArrowLeft" ||
    e.key === "ArrowDown" ||
    e.key === "ArrowRight"
  ) {
    jimmyObj.spriteX = 0;
    jimmyObj.spriteY = 576;
  }
};

// ANIMATE FUNCTION
const animate = () => {
  animateId = window.requestAnimationFrame(animate);
  ctx.clearRect(0, 0, canvas.width, canvas.height); //Clears Everything

  drawJimmy();
  drawPaperBalls();
};

window.requestAnimationFrame(animate);
