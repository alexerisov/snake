var guiObj = {
  snakeColor: '#0b401b',
  strokeColor: '#181717'
};

class Plan {
  constructor (width, heigth) {
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
          case ( (x === 3 && y === 3) || (x === 3 && y === 4) || (x === 3 && y === 5) ):
            line += 's';
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
}

class Level {
  constructor (plan) {
    this.grid = new Array(plan.length);
    this.width = plan[0].length;
    this.heigth = plan.length;
    this.snake = [];
    // this.apples = [];

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
            this.apples.push({
              x: x,
              y: y
            });
            break;
          case (ch === 's'):
            this.grid[y].push('snake');
            this.snake.push({
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
const plan = new Plan(25, 25);
const level = new Level(plan);
class Snake {
  constructor () {
    this.body = [...level.snake];
    this.direction = directionNames.right;
  }

  move () {

    let target = level.grid[this.body[0].x + this.direction.x][this.body[0].y + this.direction.y];
    if (target != 'wall' && target != 'snake') {
      Snake.body.unshift(target);
    } else false
    this.body.pop();
  }

  turn () {
    const pressedKey = 'key';
    switch (pressedKey) {
      case (keyUp):
        this.direction = directionNames.up;
        break;
      case (keyDown):
        this.direction = directionNames.down;
        break;
      case (keyLeft):
        this.direction = directionNames.left;
        break;
      case (keyRight):
        this.direction = directionNames.right;
        break;
    }
  }

  eat () {
    target = -Snake.direction;
    Snake.body.push(target);
  }
}

let snake = new Snake();

console.log(level.grid[3][3]);
console.log(snake.body);


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
    drawRect(x, y, cellSize, 'red');
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
