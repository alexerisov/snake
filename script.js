var guiObj = {

  // Wall
  wallGradientColor1: '#323232',
  wallGradientColor2: '#232323',
  isWallStroke: false,
  wallStrokeColor: '#232323',
  wallStrokeWidth: 0.1,

  //  Empty
  emptyFillColor: '#181818',
  isEmptyStroke: false,
  emptyStrokeColor: '#e6e6e6',
  emptyStrokeWidth: 0.1,

  // Snake
  snakeFillColor: '#0b401b',
  isSnakeStroke: true,
  snakeStrokeColor: '#000000',
  snakeStrokeWidth: 0.3,

  // Apple
  appleFillColor: '#4a0c0c',
  isAppleStroke: true,
  appleStrokeColor: '#000000',
  appleStrokeWidth: 0.3,

  // Pause
  rectHeigth: 140,
  rectWidth: 349,
  rectColor: 'rgba(95,93,93,0.5)',
  rectStrokeWidth: 3.7,
  rectStrokeColor: '#000000',
  textSize: 90,
  textFont: 'Helvetica',
  textColor: '#777777',

  // Other
  godMode: false,
  snakeSpeed: 3,
  boardSize: 25,
  pause: true,
  game: 'game'
};

function Plan (width, heigth) {
  const space = new Array(heigth);
  this.width = width;
  this.heigth = heigth;
  for (let y = 0; y < heigth; y++) {
    let line = '';
    for (let x = 0; x < width; x++) {
      switch (true) {
        case (x === 0 || x === width - 1):
          line += '#';
          break;
        case (y === 0 || y === heigth - 1):
          line += '#';
          break;
        case ((x === 3 && y === 3) || (x === 4 && y === 3) || (x === 5 && y === 3)):
          line += 's';
          break;
        case (x === 13 && y === 13):
          line += '@';
          break;
        default:
          line += ' ';
          break;
      }
      space[y] = line;
    }
  }
  return space;
}

const plan = Plan(guiObj.boardSize, guiObj.boardSize);

function Level (plan) {
  this.grid = new Array(plan.length);
  this.width = plan[0].length;
  this.heigth = plan.length;
  this.snake = new Snake();
  this.apples = new Apple();

  for (let y = 0; y < this.heigth; y++) {
    const line = plan[y];
    this.grid[y] = [];
    for (let x = 0; x < this.width; x++) {
      const ch = line[x];
      switch (true) {
        case (ch === '#'):
          this.grid[y].push('wall');
          break;
        case (ch === '@'):
          this.grid[y].push('apple');
          this.apples.array.push({
            x: x,
            y: y
          });
          break;
        case (ch === 's'):
          this.grid[y].push('snake');
          this.snake.body.unshift({
            x: x,
            y: y
          });
          break;
        default:
          this.grid[y].push('empty');
          break;
      }
    }
  }
}

var directionNames = {
  up: {
    x: 0,
    y: -1
  },
  down: {
    x: 0,
    y: 1
  },
  left: {
    x: -1,
    y: 0
  },
  right: {
    x: 1,
    y: 0
  }
};

let level = new Level(plan);

function Snake () {
  this.body = [];
  this.direction = directionNames.right;
}

Snake.prototype.move = function () {
  this.speed = 250;

  const target = level.grid[this.body[0].y + this.direction.y][this.body[0].x + this.direction.x];
  const targetX = this.body[0].x + this.direction.x;
  const targetY = this.body[0].y + this.direction.y;
  const lastElement = this.body[this.body.length - 1];

  if (target != 'wall' && target != 'snake') {
    level.grid[targetY][targetX] = 'snake';
    this.body.unshift({
      x: targetX,
      y: targetY
    });
    if (target === 'apple') {
      this.body.push(level.grid[lastElement.y - this.direction.y][lastElement.x - this.direction.x]);
      level.apples.spawn();
    }
    level.grid[lastElement.y][lastElement.x] = 'empty';
    this.body.pop();
  } else if (guiObj.godMode === true) {
    // do something in godMode
  } else {
    level = new Level(plan);
  }
};

Snake.prototype.turn = function (direction) {
  // checking the REVERSE direction
  if (this.direction.y === -directionNames[direction].y &&
    this.direction.x === -directionNames[direction].x) {
    false;
  }
  // checking the FORWARD direction (for speed-up)
  else if (this.direction === directionNames[`${direction}`]) {
    false;
  } else {
    this.direction = directionNames[`${direction}`];
  }
};

Snake.prototype.loop = function () {
  window.timer = setTimeout(function run () {
    level.snake.move();
    window.timer = setTimeout(run, 250 / (guiObj.snakeSpeed));
  }, 250 / (guiObj.snakeSpeed));
};

Snake.prototype.loopStop = function () {
  clearTimeout(window.timer);
};

function Apple () {
  this.array = [];
}

Apple.prototype.spawn = function () {
  function getRandomInt (min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }
  const targetX = getRandomInt(1, level.width - 1);
  const targetY = getRandomInt(1, level.heigth - 1);
  const target = level.grid[targetY][targetX];
  if (target === 'empty') {
    level.grid[targetY][targetX] = 'apple';
  } else level.apples.spawn();
};

const arrowCodes = {
  37: 'left',
  38: 'up',
  39: 'right',
  40: 'down'
};

this.addEventListener('keydown', function (event) {
  switch (event.which) {
    case (37): // LEFT arrow
      level.snake.turn('left');
      break;
    case (38): // UP arrow
      level.snake.turn('up');
      break;
    case (39): // RIGHT arrow
      level.snake.turn('right');
      break;
    case (40): // DOWN arrow
      level.snake.turn('down');
      break;
    case (13): // ENTER
      if (guiObj.pause === false) {

      } else {
        level.snake.loop();
        guiObj.pause = false;
      }
      break;
    case (27): // ESC
      if (guiObj.pause === false) {
        level.snake.loopStop();
        guiObj.pause = true;
      } else {
        level.snake.loop();
        guiObj.pause = false;
      }
      break;
  }
});

function displayCanvas () {
  const cellSize = 500 / guiObj.boardSize;
  var canvas = document.querySelector('canvas');
  canvas.setAttribute('width', '500');
  canvas.setAttribute('height', '500');

  const cx = canvas.getContext('2d');

  function drawRect (x, y, width, heigth, color) {
    cx.fillStyle = color;
    cx.fillRect(x, y, width, heigth);
  }

  function drawStroke (x, y, width, heigth, color, px) {
    cx.strokeStyle = color;
    cx.lineWidth = px;
    cx.strokeRect(x, y, width, heigth);
  }

  function drawText (text, x, y, size, font, color, maxWidth) {
    if (maxWidth === undefined) {
    } else {
      this.maxWidth = maxWidth;
    }
    cx.textAlign = 'center';
    cx.textBaseline = 'middle';
    cx.fillStyle = color;
    cx.font = `${size}px ${font}`;
    cx.fillText(text, x, y, this.maxWidth);
  }

  function drawGame () {
    function drawCell (x, y, color, size) {
      if (size === undefined) {
        this.size = cellSize;
      } else {
        this.size = size;
      }
      drawRect(x * this.size, y * this.size, this.size, this.size, color);
    }

    function drawCellStroke (x, y, color, px, size) {
      if (size === undefined) {
        this.size = cellSize;
      } else {
        this.size = size;
      }
      drawStroke(x * this.size, y * this.size, this.size, this.size, color, px);
    }

    function drawWall (x, y) {
      const gradient = cx.createLinearGradient(x * cellSize, y * cellSize, (x + 1) * cellSize, (y + 1) * cellSize);
      gradient.addColorStop(0, guiObj.wallGradientColor1);
      gradient.addColorStop(1, guiObj.wallGradientColor2);
      drawCell(x, y, gradient);
      if (guiObj.isWallStroke) {
        drawCellStroke(x, y, guiObj.wallStrokeColor, guiObj.wallStrokeWidth);
      }
    }

    function drawSnake (x, y) {
      drawCell(x, y, guiObj.snakeFillColor);
      if (guiObj.isSnakeStroke) {
        drawCellStroke(x, y, guiObj.snakeStrokeColor, guiObj.snakeStrokeWidth);
      }
    }

    function drawApple (x, y) {
      drawCell(x, y, guiObj.appleFillColor);
      if (guiObj.isAppleStroke) {
        drawCellStroke(x, y, guiObj.appleStrokeColor, guiObj.appleStrokeWidth);
      }
    }

    function drawEmptySpace (x, y) {
      drawCell(x, y, guiObj.emptyFillColor);
      if (guiObj.isEmptyStroke) {
        drawCellStroke(x, y, guiObj.emptyStrokeColor, guiObj.emptyStrokeWidth);
      }
    }

    for (let y = 0; y < level.heigth; y++) {
      const line = level.grid[y];
      for (let x = 0; x < level.width; x++) {
        const element = line[x];
        switch (element) {
          case 'wall':
            drawWall(x, y);
            break;
          case 'snake':
            drawSnake(x, y);
            break;
          case 'apple':
            drawApple(x, y);
            break;
          case 'empty':
            drawEmptySpace(x, y);
            break;
        }
      }
    }
  }

  function drawMenu () {
    drawRect(0, 0, 500, 500, '#ffffff');
  }

  function drawPause () {
    let width = guiObj.rectWidth;
    let heigth = guiObj.rectHeigth;
    const posX = 250 - width / 2;
    const posY = 250 - heigth / 2;
    let fontSize = guiObj.textSize;

    // drawRect(0, 0, 500, 500, 'rgba(40, 40, 40, 0.5)')
    drawRect(posX, posY, width, heigth, guiObj.rectColor);
    drawStroke(posX, posY, width, heigth, guiObj.rectStrokeColor, guiObj.rectStrokeWidth);
    drawText('PAUSE', 250, 250, fontSize, guiObj.textFont, guiObj.textColor);
  }

  switch (guiObj.game) {
    case 'menu':
      drawMenu();
      break;
    case 'game':
      drawGame();
      if (guiObj.pause === true) {
        drawPause();
      }
      break;
  }
}
