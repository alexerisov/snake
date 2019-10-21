const guiObj = {

  wall: {
    gradientColor1: '#323232',
    gradientColor2: '#232323',
    stroke: false,
    strokeColor: '#232323',
    strokeWidth: 0.1
  },

  empty: {
    fillColor: '#181818',
    stroke: false,
    strokeColor: '#e6e6e6',
    strokeWidth: 0.1
  },

  snake: {
    speed: 3,
    fillColor: '#0b401b',
    stroke: true,
    strokeColor: '#000000',
    strokeWidth: 0.3
  },

  apple: {
    fillColor: '#4a0c0c',
    stroke: true,
    strokeColor: '#000000',
    strokeWidth: 0.3
  },

  pause: {
    rectHeight: 140,
    rectWidth: 349,
    rectColor: 'rgba(95,93,93,0.5)',
    rectStrokeWidth: 3.7,
    rectStrokeColor: '#000000',
    textSize: 90,
    textFont: 'Helvetica',
    textColor: '#777777'
  },

  menu: {
    rectColor: '#181818',
    rectStrokeWidth: 50,
    rectStrokeColor: '#3b3b3b'
  },

  menuStart: {
    posX: 250,
    posY: 300,
    rectHeight: 85,
    rectWidth: 375,
    rectColor: 'rgba(95,93,93,0.5)',
    chosenRectColor: 'rgba(80,80,173,0.5)',
    rectStrokeWidth: 0.1,
    rectStrokeColor: '#3b3b3b',
    textSize: 60,
    textFont: 'Helvetica',
    textColor: '#777777'
  },

  menuQuit: {
    posX: 250,
    posY: 400,
    rectHeight: 85,
    rectWidth: 375,
    rectColor: 'rgba(95,93,93,0.5)',
    chosenRectColor: 'rgba(80,80,173,0.5)',
    rectStrokeWidth: 0.1,
    rectStrokeColor: '#3b3b3b',
    textSize: 60,
    textFont: 'Helvetica',
    textColor: '#777777'
  },

  other: {
    godMode: false,
    boardSize: 25,
    pause: true,
    game: 'menu'
  }
};

const iController = class iController {
  notify(sender, event) {
  }
};

const directionNames = {
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

function Plan (width, height) {
  const space = new Array(height);
  this.width = width;
  this.height = height;
  for (let y = 0; y < height; y++) {
    let line = '';
    for (let x = 0; x < width; x++) {
      switch (true) {
        case (x === 0 || x === width - 1):
          line += '#';
          break;
        case (y === 0 || y === height - 1):
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

let plan;
plan = new Plan(guiObj.other.boardSize, guiObj.other.boardSize);

class Cell {
  constructor (x, y, type) {
    this.x = x;
    this.y = y;
    this.type = type;
  }
}

class Grid {
  constructor (width, height) {
    this.width = width;
    this.height = height;
    this.space = new Array(width * height);
  }

  get (x, y) {
    return this.space[x + (y * this.width)];
  }

  set (x, y, value) {
    this.space[x + (y * this.width)] = new Cell(x, y, value);
  }
}

class Snake {
  constructor (grid) {
    this.grid = grid;
    this.speed = 250;
    this.body = [];
    this.direction = directionNames.right;
  }

  move () {
    const target = this.grid.get(this.body[0].x + this.direction.x, this.body[0].y + this.direction.y);
    const tail = this.body[this.body.length - 1];

    if (target.type !== 'wall' && target.type !== 'snake') {
      this.grid.set(target.x, target.y, 'snake');
      this.body.unshift(new Cell(target.x, target.y, 'snake'));

      if (target.type === 'apple') {
        this.body.push(new Cell(tail.x - this.direction.x, tail.y - this.direction.y, 'snake'));
        super.appleFactory.createApple();
      }
      this.grid.set(tail.x, tail.y, 'empty');
      this.body.pop();
      this.canTurn = true;
    } else if (guiObj.other.godMode === true) {
      // do something in godMode
    } else {
      level = new Level(plan);
    }
  }

  turn (direction) {
    if (this.canTurn) {
      // checking the REVERSE direction
      if (this.direction.y === -directionNames[direction].y &&
        this.direction.x === -directionNames[direction].x) {

      }
      // checking the FORWARD direction (for speed-up)
      else if (this.direction === directionNames[`${direction}`]) {

      } else {
        this.direction = directionNames[`${direction}`];
        this.canTurn = false;
      }
    }
  }

  loop () {
    window.timer = setTimeout(function run () {
      level.snake.move();
      window.timer = setTimeout(run, 250 / (guiObj.snake.speed));
    }, 250 / (guiObj.snake.speed));
  }

  loopStop () {
    clearTimeout(window.timer);
  }
}

class AppleFactory {
  constructor(grid) {
    this.grid = grid;
    this.list = [];
  }

  createApple() {
    function getRandomInt (min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min)) + min;
    }
    const targetX = getRandomInt(1, level.width - 1);
    const targetY = getRandomInt(1, level.height - 1);
    const target = this.grid.get(targetX, targetY);
    if (target.type === 'empty') {
      this.grid.set(targetX, targetY, 'apple');
    } else { this.createApple(); }
  }
}

class Apple {
  constructor() {
    this.x = x;
    this.y = y;
  }


}

class Level {
  constructor (plan) {
    this.width = plan[0].length;
    this.height = plan.length;
    this.grid = new Grid(this.width, this.height);
    this.snake = new Snake(this.grid);
    this.apple = new Apple(this.grid);

    for (let y = 0; y < this.height; y++) {
      const line = plan[y];
      for (let x = 0; x < this.width; x++) {
        const ch = line[x];
        let chType = 'empty';

        switch (true) {
          case (ch === '#'):
            chType = 'wall';
            break;

          case (ch === '@'):
            chType = 'apple';
            this.apple.array.unshift(new Cell(x, y, chType));
            break;

          case (ch === 's'):
            chType = 'snake';
            this.snake.body.unshift(new Cell(x, y, chType));
            break;

          default:
            chType = 'empty';
            break;
        }
        this.grid.set(x, y, chType);
      }
    }
  }
}

const Controller = class Controller {
  constructor() {
    this.level = new Level(plan);
    this.snake = new Snake(this.level.grid);
    this.appleFactory = new AppleFactory(this.level.grid);
  }
};





class Menu {
  constructor() {
    this.list = [{
      name: 'Start',
      link: guiObj.menuStart,
      isChosen: true,
      action () {guiObj.other.game = 'game'}
    },
      {
        name: 'Quit',
        link: guiObj.menuQuit,
        isChosen: false,
        action () {window.close()}
      }
    ];
  }

  scroll (direction) {
    let next;
    let current = this.list.filter(item => item.isChosen)[0];
    let currentIndex = this.list.indexOf(current);

      switch (direction) {
      case 'up':
        if (0 <= currentIndex - 1) {
          next = this.list[currentIndex - 1];
          next.isChosen = true;
          current.isChosen = false;
        }
        break;

      case 'down':
        if (currentIndex + 1 <= this.list.length - 1) {
          next = this.list[currentIndex + 1];
          next.isChosen = true;
          current.isChosen = false;
        }
        break;
    }
  };

  select () {
    let current = this.list.filter(item => item.isChosen)[0];
    current.action();
  }
}

const menu = new Menu();
const arrowCodes = {
  37: 'left',
  38: 'up',
  39: 'right',
  40: 'down'
};

addEventListener('keydown', function (event) {
  switch (event.which) {
    case (37): // LEFT arrow
      level.snake.turn('left');
      break;
    case (38): // UP arrow
      if (guiObj.other.game === 'game') {
        level.snake.turn('up');
      } else {
        menu.scroll('up');
      }
      break;
    case (39): // RIGHT arrow
      level.snake.turn('right');
      break;
    case (40): // DOWN arrow
      if (guiObj.other.game === 'game') {
        level.snake.turn('down');
      } else {
        menu.scroll('down');
      }
      break;
    case (13): // ENTER
      if (guiObj.other.game === 'menu') {
        menu.select();
      } else {
        if (guiObj.other.pause === false) {

        } else {
          level.snake.loop();
          guiObj.other.pause = false;
        }
      }
      break;
    case (27): // ESC
      if (guiObj.other.pause === false) {
        level.snake.loopStop();
        guiObj.other.pause = true;
      } else {
        level.snake.loop();
        guiObj.other.pause = false;
      }
      break;
  }
});

function displayCanvas () {
  const cellSize = 500 / guiObj.other.boardSize;
  const canvas = document.querySelector('canvas');
  canvas.setAttribute('width', '500');
  canvas.setAttribute('height', '500');

  const cx = canvas.getContext('2d');

  function drawRect (x, y, width, height, color) {
    cx.fillStyle = color;
    cx.fillRect(x, y, width, height);
  }

  function drawStroke (x, y, width, height, color, px) {
    cx.strokeStyle = color;
    cx.lineWidth = px;
    cx.strokeRect(x, y, width, height);
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
    function drawCell (x, y, color) {
      this.size = cellSize;
      drawRect(x * this.size, y * this.size, this.size, this.size, color);
    }

    function drawCellStroke (x, y, color, px) {
      this.size = cellSize;
      drawStroke(x * this.size, y * this.size, this.size, this.size, color, px);
    }

    function drawWall (x, y) {
      const gradient = cx.createLinearGradient(x * cellSize, y * cellSize, (x + 1) * cellSize, (y + 1) * cellSize);
      gradient.addColorStop(0, guiObj.wall.gradientColor1);
      gradient.addColorStop(1, guiObj.wall.gradientColor2);
      drawCell(x, y, gradient);
      if (guiObj.wall.stroke) {
        drawCellStroke(x, y, guiObj.wall.strokeColor, guiObj.wall.strokeWidth);
      }
    }

    function drawSnake (x, y) {
      drawCell(x, y, guiObj.snake.fillColor);
      if (guiObj.snake.stroke) {
        drawCellStroke(x, y, guiObj.snake.strokeColor, guiObj.snake.strokeWidth);
      }
    }

    function drawApple (x, y) {
      drawCell(x, y, guiObj.apple.fillColor);
      if (guiObj.apple.stroke) {
        drawCellStroke(x, y, guiObj.apple.strokeColor, guiObj.apple.strokeWidth);
      }
    }

    function drawEmptySpace (x, y) {
      drawCell(x, y, guiObj.empty.fillColor);
      if (guiObj.empty.stroke) {
        drawCellStroke(x, y, guiObj.empty.strokeColor, guiObj.empty.strokeWidth);
      }
    }

    for (let y = 0; y < Controller.height; y++) {
      for (let x = 0; x < Controller.width; x++) {
        const element = Controller.grid.get(x, y);
        switch (element.type) {
          case 'wall':
            drawWall(x, y);
            break;
          case 'snake':
            drawSnake(x, y);
            break;
          case 'apple':
            drawApple(x, y);
            break;
          default:
            drawEmptySpace(y, x);
            break;
        }
      }
    }
  }

  function drawMenu () {
    function drawElement (element) {
      const link = element.link;
      const x = 250 - link.rectWidth / 2;
      const y = link.posY - link.rectHeight / 2;
      let color = element.isChosen ? link.chosenRectColor : link.rectColor;
      drawRect(x, y, link.rectWidth, link.rectHeight, color);
      drawStroke(x, y, link.rectWidth, link.rectHeight, link.rectStrokeColor, link.rectStrokeWidth);
      drawText(element.name, link.posX, link.posY, link.textSize, link.textFont, link.textColor);
    }

    drawRect(0, 0, 500, 500, guiObj.menu.rectColor);
    drawStroke(0, 0, 500, 500, guiObj.menu.rectStrokeColor, guiObj.menu.rectStrokeWidth);

    for (let i = 0; i < menu.list.length; i++) {
      const element = menu.list[i];
      drawElement(element);
    }
  }

  function drawPause () {
    const link = guiObj.pause;
    const posX = 250 - link.rectWidth / 2;
    const posY = 250 - link.rectHeight / 2;
    drawRect(posX, posY, link.rectWidth, link.rectHeight, link.rectColor);
    drawStroke(posX, posY, link.rectWidth, link.rectHeight, link.rectStrokeColor, link.rectStrokeWidth);
    drawText('PAUSE', 250, 250, link.textSize, link.textFont, link.textColor);
  }

  switch (guiObj.other.game) {
    case 'menu':
      drawMenu();
      break;
    case 'game':
      drawGame();
      if (guiObj.other.pause === true) {
        drawPause();
      }
      break;
  }
}
