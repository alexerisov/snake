var guiObj = {
  snakeColor: '#0b401b',
  strokeColor: '#181717',
  appleColor: '#4a0c0c'
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

const plan = Plan(25, 25);

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
      this.body.push(level.grid[lastElement.y - this.direction.y][lastElement.x - this.direction.x])
      level.apples.spawn();
    }
    level.grid[lastElement.y][lastElement.x] = 'empty';
    this.body.pop();
    
  } else level = new Level(plan);
};

Snake.prototype.turn = function (direction) {
  switch (direction) {
    case ('up'):
      this.direction = directionNames.up;
      break;
    case ('down'):
      this.direction = directionNames.down;
      break;
    case ('left'):
      this.direction = directionNames.left;
      break;
    case ('right'):
      this.direction = directionNames.right;
      break;
  }
};

function Apple () {
  this.array = [];
}

Apple.prototype.spawn = function () {
  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }
  let targetX = getRandomInt(1, level.width - 1);
  let targetY = getRandomInt(1, level.heigth - 1);
  level.grid[targetY][targetX] = 'apple';
}

const arrowCodes = {
  37: 'left',
  38: 'up',
  39: 'right',
  40: 'down'
};

this.addEventListener('keydown', function (event) {
  switch (event.which) {
    case (37):
      level.snake.turn('left');
      break;
    case (38):
      level.snake.turn('up');
      break;
    case (39):
      level.snake.turn('right');
      break;
    case (40):
      level.snake.turn('down');
      break;
    case (13):
      let timer = this.setInterval(function () {
        level.snake.move();
      }, 250);
      break;
    case (27):
      this.clearInterval(timer);
      level = new Level(plan);
      break;
  }
});

function displayCanvas () {
  const cellSize = 20;
  var canvas = document.querySelector('canvas');
  canvas.setAttribute('width', '500');
  canvas.setAttribute('height', '500');

  const cx = canvas.getContext('2d');

  function drawRect (x, y, size, color) {
    cx.fillStyle = color;
    cx.fillRect(x * size, y * size, size, size);
  }

  function drawStroke (x, y, size, color) {
    cx.strokeStyle = color;
    cx.lineWidth = 1;
    cx.strokeRect(x * size, y * size, size, size);
  }

  function drawWall (x, y) {
    const gradient = cx.createLinearGradient(x * cellSize, y * cellSize, (x + 1) * cellSize, (y + 1) * cellSize);
    gradient.addColorStop(0, 'rgb(50, 50, 50)');
    gradient.addColorStop(1, 'rgb(35, 35, 35)');
    drawRect(x, y, cellSize, gradient);
    // drawStroke(x, y, cellSize, 'rgb(45, 45, 45)');
  }

  function drawSnake (x, y) {
    drawRect(x, y, cellSize, guiObj.snakeColor);
  }

  function drawApple (x, y) {
    drawRect(x, y, cellSize, guiObj.appleColor);
  }

  function drawEmptySpace (x, y) {
    drawRect(x, y, cellSize, '#222222');
    drawStroke(x, y, cellSize, guiObj.strokeColor);
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
