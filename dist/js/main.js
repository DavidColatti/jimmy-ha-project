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
const backToHomeBtn = document.querySelector(".back-to-home-btn");
let wonGame;
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
  }, 4000);
});

backToHomeBtn.addEventListener("click", () => {
  window.location.reload();
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
    paperAmount: 80,
    spriteX: 0,
    spriteY: 640,
    alive: true,
    shoot: false,
    greenStar: 0,
    orangeStar: 0,
    blueStar: 0,
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

  //CPU FEMALE SPRITE
  const femaleSpriteImage = new Image();
  femaleSpriteImage.src = "img/worker-female-sprite.png";

  const femaleWorkers = [];
  setInterval(function () {
    let femaleWorkerObj = {
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

    if (femaleWorkerObj.health <= 0) {
      femaleWorkerObj.alive = false;
    }

    femaleWorkers.push(femaleWorkerObj);
  }, 6000);

  const drawFemaleWorkers = () => {
    femaleWorkers.forEach((femaleWorker, index) => {
      if (femaleWorker.spriteX >= 512 && femaleWorker.health > 0) {
        femaleWorker.spriteX = 0;
      }

      ctx.fillStyle = "red";
      ctx.fillRect(femaleWorker.x, femaleWorker.y, 30, 3);
      ctx.fillStyle = "lightgreen";

      if (femaleWorker.health <= 0) {
        femaleWorker.health = 0;
      }
      ctx.fillRect(
        femaleWorker.x,
        femaleWorker.y,
        (femaleWorker.health / 50) * 30,
        3
      );

      if (femaleWorker.health > 0) {
        femaleWorker.x += 1;
        femaleWorker.spriteX += 64;
      }
      if (femaleWorker.health <= 0 && femaleWorker.spriteX != 320) {
        femaleWorker.spriteX += 64;
      }

      ctx.drawImage(
        femaleSpriteImage,
        femaleWorker.spriteX,
        femaleWorker.spriteY,
        64,
        64,
        femaleWorker.x,
        femaleWorker.y,
        femaleWorker.w,
        femaleWorker.h
      );

      detectFemaleWorkerCollision(femaleWorker, index); //collision with male worker
      detectPaperFemaleWorkerCollision(femaleWorker, index); // collision with paper
    });
  };

  //COLLISION ON MALE WORKER
  const detectFemaleWorkerCollision = (worker, index) => {
    //detect collision between femaleWorkers and jimmy
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
          wonGame = false;
          gameOver();
        }
      }
    }
    if (worker.x > canvas.width) {
      femaleWorkers.splice(index, 1);
    }
  };

  //COLLISION ON PAPER AND FEMALE WORKER
  const detectPaperFemaleWorkerCollision = (worker, i) => {
    paperBalls.forEach((paperBall, index) => {
      if (
        worker.x < paperBall.x + paperBall.w &&
        worker.x + worker.w > paperBall.x &&
        worker.y < paperBall.y + paperBall.h &&
        worker.y + worker.h > paperBall.y
      ) {
        console.log("paper hit worker");
        worker.health -= jimmyObj.str;
        paperBalls.splice(index, 1);
        if (worker.health <= 0) {
          worker.spriteX = 0;
          worker.spriteY = 1280;
          setTimeout(() => {
            femaleWorkers.splice(i, 1);
          }, 200);
        }
      }
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
          wonGame = false;
          gameOver();
        }
      }
    }
    if (worker.x > canvas.width) {
      maleWorkers.splice(index, 1);
    }
  };

  //COLLISION ON PAPER AND MALE WORKER
  const detectPaperMaleWorkerCollision = (worker, i) => {
    paperBalls.forEach((paperBall, index) => {
      if (
        worker.x < paperBall.x + paperBall.w &&
        worker.x + worker.w > paperBall.x &&
        worker.y < paperBall.y + paperBall.h &&
        worker.y + worker.h > paperBall.y
      ) {
        console.log("paper hit worker");
        worker.health -= jimmyObj.str;
        paperBalls.splice(index, 1);
        if (worker.health <= 0) {
          worker.spriteX = 0;
          worker.spriteY = 1280;
          setTimeout(() => {
            maleWorkers.splice(i, 1);
          }, 200);
        }
      }
    });
  };

  // STAR (GREEN)
  const greenStarImage = new Image();
  greenStarImage.src = "img/green-star.png";

  const greenStars = [];
  setInterval(function () {
    let greenStarObj = {
      x: Math.random() * 300,
      y: -1,
      w: 10,
      h: 10,
      amount: 1,
    };

    greenStars.push(greenStarObj);
  }, 7000);

  const drawGreenStars = () => {
    greenStars.forEach((star, index) => {
      ctx.drawImage(greenStarImage, star.x, star.y++, star.w, star.h);
      detectGreenStarCollision(star, index);
    });
  };

  //COLLISION ON GREEN STAR
  const detectGreenStarCollision = (star, index) => {
    if (
      star.x < jimmyObj.x + jimmyObj.w &&
      star.x + star.w > jimmyObj.x &&
      star.y < jimmyObj.y + jimmyObj.h &&
      star.y + star.h > jimmyObj.y
    ) {
      jimmyObj.greenStar++;
      ldpModulesAmount.innerText =
        jimmyObj.greenStar + jimmyObj.orangeStar + jimmyObj.blueStar;
      greenStars.splice(index, 1);

      if (
        jimmyObj.greenStar >= 3 &&
        jimmyObj.blueStar >= 3 &&
        jimmyObj.orangeStar >= 3
      ) {
        wonGame = true;
        gameOver();
      } else if (jimmyObj.health <= 0) {
        wonGame = false;
        gameOver();
      }
    }
  };

  // STAR (ORANGE)
  const orangeStarImage = new Image();
  orangeStarImage.src = "img/orange-star.png";

  const orangeStars = [];
  setInterval(function () {
    let orangeStarObj = {
      x: Math.random() * 300,
      y: -1,
      w: 10,
      h: 10,
      amount: 1,
    };

    orangeStars.push(orangeStarObj);
  }, 9000);

  const drawOrangeStars = () => {
    orangeStars.forEach((star, index) => {
      ctx.drawImage(orangeStarImage, star.x, star.y++, star.w, star.h);
      detectOrangeStarCollision(star, index);
    });
  };

  //COLLISION ON ORANGE STAR
  const detectOrangeStarCollision = (star, index) => {
    if (
      star.x < jimmyObj.x + jimmyObj.w &&
      star.x + star.w > jimmyObj.x &&
      star.y < jimmyObj.y + jimmyObj.h &&
      star.y + star.h > jimmyObj.y
    ) {
      jimmyObj.orangeStar++;
      ldpModulesAmount.innerText =
        jimmyObj.greenStar + jimmyObj.orangeStar + jimmyObj.blueStar;
      orangeStars.splice(index, 1);

      if (
        jimmyObj.greenStar >= 3 &&
        jimmyObj.blueStar >= 3 &&
        jimmyObj.orangeStar >= 3
      ) {
        wonGame = true;
        gameOver();
      } else if (jimmyObj.health <= 0) {
        wonGame = false;
        gameOver();
      }
    }
  };

  // STAR (BLUE)
  const blueStarImage = new Image();
  blueStarImage.src = "img/blue-star.png";

  const blueStars = [];
  setInterval(function () {
    let blueStarObj = {
      x: Math.random() * 300,
      y: -1,
      w: 10,
      h: 10,
      amount: 1,
    };

    blueStars.push(blueStarObj);
  }, 10000);

  const drawBlueStars = () => {
    blueStars.forEach((star, index) => {
      ctx.drawImage(blueStarImage, star.x, star.y++, star.w, star.h);
      detectBlueStarCollision(star, index);
    });
  };

  //COLLISION ON BLUE STAR
  const detectBlueStarCollision = (star, index) => {
    if (
      star.x < jimmyObj.x + jimmyObj.w &&
      star.x + star.w > jimmyObj.x &&
      star.y < jimmyObj.y + jimmyObj.h &&
      star.y + star.h > jimmyObj.y
    ) {
      jimmyObj.blueStar++;
      ldpModulesAmount.innerText =
        jimmyObj.greenStar + jimmyObj.blueStar + jimmyObj.blueStar;
      blueStars.splice(index, 1);
      if (
        jimmyObj.greenStar >= 3 &&
        jimmyObj.blueStar >= 3 &&
        jimmyObj.orangeStar >= 3
      ) {
        wonGame = true;
        gameOver();
      } else if (jimmyObj.health <= 0) {
        wonGame = false;
        gameOver();
      }
    }
  };

  // GAME OVER FUNCTION
  const gameOver = () => {
    window.cancelAnimationFrame(animateId);
    backToHomeBtn.classList.remove("no-show");
    ctx.clearRect(0, 0, canvas.width, canvas.height); //Clears Everything
    gameResults();
  };

  // GAME RESULTS
  const gameResults = () => {
    canvas.style.transition = "2s";

    if (wonGame) {
      console.log("won game");
      canvas.style.backgroundImage = "url(img/winner-bg.png)";
    } else {
      console.log("lost game");
      canvas.style.backgroundImage = "url(img/loser-bg.png)";
    }
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
    drawFemaleWorkers();
    drawBlueStars();
    drawGreenStars();
    drawOrangeStars();
  };

  window.requestAnimationFrame(animate);
};
