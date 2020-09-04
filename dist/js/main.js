const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");
const headerSection = document.querySelector(".header");
const startNowBtn = document.querySelector(".header--button");
const instructionSection = document.querySelector(".instructions");
const instructionBtn = document.querySelector(".instructions--button");
const playNowSection = document.querySelector(".header__play-section");
const scoreSection = document.querySelector(".score");
const healthAmount = document.querySelector(".health-amount");
const paperBallAmount = document.querySelector(".paper-ball-amount");
const ldpModulesAmount = document.querySelector(".ldp-modules-amount");
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
  instructionSection.classList.add("no-show");
  canvas.classList.remove("no-show");
  scoreSection.classList.remove("no-show");

  setTimeout(() => {
    startGame();
  }, 5000);
});

const startGame = () => {
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
      return;
    } else {
      jimmyObj.paperAmount--;
      paperBallAmount.innerText = jimmyObj.paperAmount;

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
      ctx.fillRect((paperBall.x -= 4), paperBall.y, paperBall.w, paperBall.h);
    });
  };

  // CPU MALE SPRITE
  const maleSpriteImage = new Image();
  maleSpriteImage.src = "img/worker-male-sprite.png";

  const maleWorkers = [];
  setInterval(function () {
    let maleWorkerObj = {
      x: -1,
      y: Math.floor(Math.random() * 30) + 100,
      w: 30.5,
      h: 31.5,
      health: 50,
      str: 15,
      hitTimes: 1,
      spriteX: 0,
      spriteY: 704,
      alive: true,
    };

    if (maleWorkerObj.health <= 0) {
      maleWorkerObj.alive = false;
    }

    maleWorkers.push(maleWorkerObj);
  }, 4000);

  const drawMaleWorkers = () => {
    maleWorkers.forEach((maleWorker, index) => {
      if (maleWorker.spriteX >= 512 && maleWorker.health > 0) {
        maleWorker.spriteX = 0;
      }

      ctx.fillStyle = "red";
      ctx.fillRect(maleWorker.x, maleWorker.y, 30, 3);
      ctx.fillStyle = "lightgreen";

      if (maleWorker.health <= 0) {
        maleWorker.health = 0;
      }
      ctx.fillRect(
        maleWorker.x,
        maleWorker.y,
        (maleWorker.health / 50) * 30,
        3
      );

      if (maleWorker.health > 0) {
        maleWorker.x += 1;
        maleWorker.spriteX += 64;
      }
      if (maleWorker.health <= 0 && maleWorker.spriteX != 320) {
        maleWorker.spriteX += 64;
      }

      ctx.drawImage(
        maleSpriteImage,
        maleWorker.spriteX,
        maleWorker.spriteY,
        64,
        64,
        maleWorker.x,
        maleWorker.y,
        maleWorker.w,
        maleWorker.h
      );

      detectMaleWorkerCollision(maleWorker, index); //collision with male worker
      detectPaperMaleWorkerCollision(maleWorker, index); // collision with paper
    });
  };

  //COLLISION ON MALE WORKER
  const detectMaleWorkerCollision = (worker, index) => {
    //detect collision between maleWorkers and jimmy
    if (
      worker.x < jimmyObj.x + jimmyObj.w &&
      worker.x + worker.w - 15 > jimmyObj.x + 15 &&
      worker.y < jimmyObj.y + jimmyObj.h &&
      worker.y + worker.h > jimmyObj.y
    ) {
      if (worker.hitTimes > 0) {
        console.log("WORKER HURT ME!");

        jimmyObj.health -= worker.str;
        healthAmount.innerText = `${jimmyObj.health}`;
        worker.hitTimes--;
        if (jimmyObj.health <= 0) {
          jimmyObj.health = 0;
          healthAmount.innerText = `${jimmyObj.health}`;
        }
      }
    }
    if (worker.x > canvas.width) {
      maleWorkers.splice(index, 1);
    }
  };

  //COLLISION ON PAPER AND MALE WORKER
  const detectPaperMaleWorkerCollision = (worker, i) => {
    paperBalls.forEach((arrow, index) => {
      if (
        worker.x < arrow.x + arrow.w &&
        worker.x + worker.w > arrow.x &&
        worker.y < arrow.y + arrow.h &&
        worker.y + worker.h > arrow.y
      ) {
        console.log("paper hit worker");
        worker.health -= jimmyObj.str;
        paperBalls.splice(index, 1);
        if (worker.health <= 0) {
          worker.spriteX = 0;
          worker.spriteY = 1280;
          setTimeout(function () {
            maleWorkers.splice(i, 1);
          }, 200);
        }
      }
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
    drawMaleWorkers();
  };

  window.requestAnimationFrame(animate);
};
