document.addEventListener('DOMContentLoaded', () =>{
  const grid = document.querySelector('.grid');
  const doodle = document.createElement('img');
  const restartBtn = document.createElement('button');
  let startPoint = 150
  let doodleBottomSpace = startPoint;
  let doodleLeftSpace = 50;
  let isGameOver = false;
  let plataformCount = 5;
  let plataforms = [];
  let upTimerId;
  let downTimerId;
  let isJumping = true;
  let isGoingLeft = false;
  let isGoingRight = false;
  let leftTimerId;
  let rightTimerId;
  let score = 0;

  function createDoodle() {
    doodle.src = 'src/images/doodle.png';
    doodle.classList.add('doodle');
    grid.appendChild(doodle);

    doodleLeftSpace = plataforms[0].left;
    doodle.style.left = doodleLeftSpace + 'px';
    doodle.style.bottom = doodleBottomSpace + 'px';
  }

  class Plataform {
    constructor(newPlataformBottom) {
      this.bottom = newPlataformBottom;
      this.left = Math.random() * 315;
      this.visual = document.createElement('div');

      const visual = this.visual;
      visual.classList.add('plataform');
      visual.style.left = this.left + 'px';
      visual.style.bottom = this.bottom + 'px';
      grid.appendChild(visual);
    }
  }

  function createPlataforms() {
    for (let i = 0; i < plataformCount; i++){
        let plataformGap = 600 / plataformCount;
        let newPlataformBottom = 100 + i * plataformGap;
        let newPlataform = new Plataform(newPlataformBottom); 
        plataforms.push(newPlataform);
      }
  }

  function movePlataforms() {
    if(doodleBottomSpace > 200) {
      plataforms.forEach(plataform => {
        plataform.bottom -= 4;
        let visual = plataform.visual;
        visual.style.bottom = plataform.bottom + 'px';
      
        if(plataform.bottom < 10) {
          let firstPlataform = plataforms[0].visual;
          firstPlataform.classList.remove('plataform');
          plataforms.shift();
          score++;
          let newPlataform = new Plataform(600);
          plataforms.push(newPlataform)
        }

      })
    }
  }

  function jump() {
    clearInterval(downTimerId);
    isJumping = true;
      upTimerId = setInterval(function () {
        doodleBottomSpace += 20;
        doodle.style.bottom = doodleBottomSpace + 'px';
        if(doodleBottomSpace > startPoint + 200) {
          fall();
        }
      }, 30)
  }

  function fall() {
    clearInterval(upTimerId);
    isJumping = false;
    downTimerId = setInterval(function () {
      doodleBottomSpace -= 5;
      doodle.style.bottom = doodleBottomSpace + 'px';
      if(doodleBottomSpace <= 0) {
        gameOver();
      }
      plataforms.forEach(plataform => {
        if(
          (doodleBottomSpace >= plataform.bottom) &&
          (doodleBottomSpace <= plataform.bottom + 15) &&
          ((doodleLeftSpace + 60) >= plataform.left) &&
          (doodleLeftSpace <= (plataform.left + 85)) &&
          !isJumping
          ) {
          startPoint = doodleBottomSpace;
          jump();
        }
      })

    }, 30)
  }

  function gameOver() {
    isGameOver = true;
    while(grid.firstChild){
      grid.removeChild(grid.firstChild);
    }
    grid.innerHTML = score;
    clearInterval(downTimerId)
    clearInterval(upTimerId);
    clearInterval(rightTimerId);
    clearInterval(leftTimerId);
    restartBtn.classList.add('restartBtn');
    restartBtn.innerHTML = 'Restart';
    grid.appendChild(restartBtn);

    restartBtn.addEventListener('click', function(e) {
      location.reload();
    })
  }

  function control(e) {
    if(e.key === 'ArrowLeft') {
      moveLeft();
    } else if (e.key === 'ArrowRight') {
      moveRight();
    } else if (e.key === 'ArrowUp') {
      moveStraight();
    }
  }

  function moveLeft() {
    if(isGoingRight){
      clearInterval(rightTimerId);
      isGoingRight = false;
    }
    isGoingLeft = true;
    leftTimerId = setInterval(function() {
      if(doodleLeftSpace >= 0){
      doodleLeftSpace -= 5;
      doodle.style.left = doodleLeftSpace + 'px';
    } else {
      moveRight();
    }
    }, 20);
  }

  function moveRight() {
    if(isGoingLeft){
      clearInterval(leftTimerId);
      isGoingRight = false;
    }
    isGoingRight = true;
    rightTimerId = setInterval(function() {
      if(doodleLeftSpace <= 340){
          doodleLeftSpace += 5;
          doodle.style.left = doodleLeftSpace + 'px';
      } else {
        moveLeft();
      }
    }, 20)
  }

  function moveStraight() {
    isGoingRight = false;
    isGoingLeft = false;
    clearInterval(rightTimerId)
    clearInterval(leftTimerId)
  }

  function start() {
    if(!isGameOver){
        createPlataforms();
        createDoodle();
        setInterval(movePlataforms, 30);
        jump();
        document.addEventListener('keyup', control)   
      } 
   }
  start();

})