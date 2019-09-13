var guiObj = {
  snakeColor: '#0b401b',
  strokeColor: '#181717',
  width: 25,
  heigth: 25
};

function drawLevel (width, heigth) {
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
        case (x === 1 && y === 1):
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

const level = drawLevel(guiObj.width, guiObj.heigth);

function Vector (x, y) {
  this.x = x;
  this.y = y;
}
Vector.prototype.plus = function (other) {
  return new Vector(this.x + other.x, this.y + other.y);
};

function Grid (width, height) {
  this.space = new Array(width * height);
  this.width = width;
  this.height = height;
}
Grid.prototype.isInside = function (vector) {
  return vector.x >= 0 && vector.x < this.width &&
    vector.y >= 0 && vector.y < this.height;
};
Grid.prototype.get = function (vector) {
  return this.space[vector.x + this.width * vector.y];
};
Grid.prototype.set = function (vector, value) {
  this.space[vector.x + this.width * vector.y] = value;
};
var directions = {
  n: new Vector(0, -1),
  ne: new Vector(1, -1),
  e: new Vector(1, 0),
  se: new Vector(1, 1),
  s: new Vector(0, 1),
  sw: new Vector(-1, 1),
  w: new Vector(-1, 0),
  nw: new Vector(-1, -1)
};

function elementFromChar (legend, ch) {
  if (ch === ' ') {
    return null;
  }
  var element = new legend[ch]();
  element.originChar = ch;
  return element;
}

function World (map, legend) {
  var grid = new Grid(map[0].length, map.length);
  this.grid = grid;
  this.legend = legend;

  map.forEach(function (line, y) {
    for (var x = 0; x < line.length; x++) {
      grid.set(new Vector(x, y),
        elementFromChar(legend, line[x]));
    }
  });
}

function charFromElement (element) {
  if (element == null) {
    return ' ';
  } else {
    return element.originChar;
  }
}

var world = new World(level, {
  '#': Wall,
  's': Snake,
  '@': Apple
});

function displayCanvas () {
  const cellSize = 20;
  var canvas = document.querySelector('canvas');
  canvas.setAttribute('width', '500');
  canvas.setAttribute('height', '500');

  const cx = canvas.getContext('2d');
  cx.clearRect(0, 0, cx.width, cx.height);

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

  for (let y = 0; y < level.length; y++) {
    const line = level[y];
    for (let x = 0; x < level[0].length; x++) {
      const element = line[x];

      switch (element) {
        case '#':
          drawWall(x, y);
          break;
        case 's':
          drawSnake(x, y);
          break;
        case '@':
          drawApple(x, y);
          break;
        default:
          drawEmptySpace(x, y);
          break;
      }
    }
  }
}
