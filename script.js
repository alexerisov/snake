const settings = {

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
        fillColor: 'rgba(11, 64, 27, 1)',
        stroke: true,
        deathColor: 'rgba(5, 32, 13, 1)',
        strokeWidth: 10,
    },

    apple: {
        fillColor: '#4a0c0c',
        stroke: true,
        strokeColor: '#000000',
        strokeWidth: 0.3,
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

    lost: {
        rectHeight: 140,
        rectWidth: 360,
        rectColor: 'rgba(95,93,93,0.5)',
        rectStrokeWidth: 3.7,
        rectStrokeColor: '#000000',
        textSize: 66,
        textFont: 'Helvetica',
        textColor: '#777777'
    },

    scores: {
        posX: 120,
        posY: 35,
        rectHeight: 1,
        rectWidth: 1,
        rectColor: 'rgba(95,93,93,0.0)',
        rectStrokeWidth: 0.01,
        rectStrokeColor: '#000000',
        textSize: 20,
        textFont: 'Helvetica',
        textColor: '#777777'
    },

    lives: {
        textPosX: 240,
        textPosY: 35,
        heartPosX: 270,
        heartPosY: 23,
        heartWidth: 20,
        heartHeight: 20,
        textSize: 20,
        textFont: 'Helvetica',
        textColor: '#777777'
    },

    menu: {
        rectColor: '#181818',
        rectStrokeWidth: 20,
        rectStrokeColor: '#3b3b3b'
    },

    menuStart: {
        posX: 300,
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
        posX: 300,
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
        godMode: true,
        boardSize: 25,
        pause: false,
        game: 'menu'
    }
};

const iController = class iController {
    notify(sender, event) {
    }
};

function Plan(width, height) {
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

plan = new Plan(settings.other.boardSize, settings.other.boardSize);

class Component {
    constructor() {
        this.mediator = null;
    }

    notify(component, event) {
        this.mediator.notify(component, event);
    }
}

class Event {
    constructor(name, data) {
        this.name = name;
        this.data = data;
    }
}

class Cell {
    constructor(x, y, type = null) {
        this.x = x;
        this.y = y;
        this.type = type;
    }

    plus(other) {
        return new Cell(this.x + other.x, this.y + other.y);
    }

    multiply(other) {
        return new Cell(this.x * other.x, this.y * other.y);
    }
}

const directionNames = {
    'up': new Cell(0, -1),
    'down': new Cell(0, 1),
    'left': new Cell(-1, 0),
    'right': new Cell(1, 0),
};

class Grid {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.space = new Array(width * height);
    }

    get(x, y) {
        return this.space[x + (y * this.width)];
    }

    set(x, y, value) {
        this.space[x + (y * this.width)] = new Cell(x, y, value);
    }
}

class Snake extends Component {
    constructor(grid) {
        super();
        this.name = 'snake';
        this.grid = grid;
        this.speed = 250;
        this.body = [];
        this.direction = directionNames.right;
    }

    grow() {
        const tail = this.body[this.body.length - 1];
        this.body.push(new Cell(tail.x - this.direction.x, tail.y - this.direction.y, 'snake'));
    }

    move() {
        const target = this.grid.get(this.body[0].x + this.direction.x, this.body[0].y + this.direction.y);
        const tail = this.body[this.body.length - 1];

        function step() {
            this.grid.set(target.x, target.y, 'snake');
            this.body.unshift(new Cell(target.x, target.y, 'snake'));
            this.grid.set(tail.x, tail.y, 'empty');
            this.body.pop();
            this.canTurn = true;
        }

        if (target.type !== 'empty') {
            this.collide(target);
            this.isMoved = true;
            if (target.type === 'apple') {
                step.call(this);
            }
        } else {
            step.call(this);
        }
    }

    collide(target) {
        this.notify(this, new Event('collide', target))
    }

    turn(direction) {
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

    loop() {
        let self = this;
        window.moveLoop = setInterval(function run() {
            self.move();
        }, 250 / (settings.snake.speed));
    }

    loopStop() {
        clearInterval(window.moveLoop);
    }
}

class AppleFactory extends Component {
    constructor(grid) {
        super();
        this.name = 'appleFactory';
        this.grid = grid;
        this.list = [];
    }

    createApple() {
        function getRandomInt(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min)) + min;
        }

        const targetX = getRandomInt(1, level.width - 1);
        const targetY = getRandomInt(1, level.height - 1);
        const target = this.grid.get(targetX, targetY);
        if (target.type === 'empty') {
            this.grid.set(targetX, targetY, 'apple');
        } else {
            this.createApple();
        }
    }
}

class Level extends Component {
    constructor(plan) {
        super();
        this.name = 'level';
        this.width = plan[0].length;
        this.height = plan.length;
        this.grid = new Grid(this.width, this.height);
        this.scores = {i: 0};
        this.lives = {i: 3};
    }

    parse(plan) {
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
                        // this.apple.array.unshift(new Cell(x, y, chType));
                        break;

                    case (ch === 's'):
                        chType = 'snake';
                        // this.snake.body.unshift(new Cell(x, y, chType));
                        break;

                    default:
                        chType = 'empty';
                        break;
                }
                this.grid.set(x, y, chType);
            }
        }
    }

    init(...initValues) {
        initValues.forEach(elt => {
            this.grid.set(elt.x, elt.y, elt.type)
        })
    }

    findActors(actor) {
        let result = [];
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                let act = this.grid.get(x, y);
                if (act.type === actor) {
                    result.push(act);
                }
            }
        }
        return result;
    }
}

class Menu extends Component {
    constructor() {
        super();
        this.name = 'menu';
        let self = this;
        this.list = [{
            name: 'Start',
            link: settings.menuStart,
            isChosen: true,
            action() {
                settings.other.game = 'game';
                self.mediator.start();
            }
        },
            {
                name: 'Quit',
                link: settings.menuQuit,
                isChosen: false,
                action() {
                    window.close()
                }
            }
        ];
    }

    scroll(direction) {
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

    select() {
        let current = this.list.filter(item => item.isChosen)[0];
        current.action();
    }
}

const arrowCodes = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down'
};

class Controls extends Component {
    constructor() {
        super();
        this.name = 'controls';
        let self = this;
        window.addEventListener('keydown', function (event) {
            switch (event.which) {
                case (37): // LEFT arrow
                    self.notify(self, new Event('keyPressed', 'left'));
                    break;
                case (38): // UP arrow
                    self.notify(self, new Event('keyPressed', 'up'));
                    break;
                case (39): // RIGHT arrow
                    self.notify(self, new Event('keyPressed', 'right'));
                    break;
                case (40): // DOWN arrow
                    self.notify(self, new Event('keyPressed', 'down'));
                    break;
                case (13): // ENTER
                    self.notify(self, new Event('keyPressed', 'enter'));
                    break;
                case (27): // ESC
                    self.notify(self, new Event('keyPressed', 'esc'));
                    break;
            }
        });
        let canvas = document.querySelector("canvas");
        window.addEventListener('touchstart', function (event) {
            function isInside(value, par1, par2) {
                return par1 <= value && value <= par2;
            }
            switch (true) {
                case (isInside(event.touches[0].screenX, 0, window.outerWidth/ 2)  &&
                    isInside(event.touches[0].screenY, canvas.offsetTop, canvas.offsetTop + canvas.offsetHeight)): // LEFT arrow
                    self.notify(self, new Event('touch', 'left'));
                    break;
                case (isInside(event.touches[0].screenY, 0, window.outerHeight / 2)): // UP arrow
                    self.notify(self, new Event('touch', 'up'));
                    break;
                case (isInside(event.touches[0].screenX, window.outerWidth/ 2, window.outerWidth)  &&
                    isInside(event.touches[0].screenY, canvas.offsetTop, canvas.offsetTop + canvas.offsetHeight)): // RIGHT arrow
                    self.notify(self, new Event('touch', 'right'));
                    break;
                case (isInside(event.touches[0].screenY, window.outerHeight / 2, window.outerHeight)): // DOWN arrow
                    self.notify(self, new Event('touch', 'down'));
                    break;
                case (isInside(event.touches[0].screenX, canvas.offsetLeft, canvas.offsetLeft + canvas.offsetWidth) &&
                    isInside(event.touches[0].screenY, canvas.offsetTop, canvas.offsetTop + canvas.offsetHeight)): // START touch
                    self.notify(self, new Event('touch', 'start'));
                    break;
            }
        });
    }
}

class Renderer {
    constructor(canvasID) {
        this.data = {};
        this.name = 'renderer';
        this.cellSize = 500 / settings.other.boardSize;
        this.can = document.querySelector(`${canvasID}`);
        this.can.setAttribute('width', '600');
        this.can.setAttribute('height', '600');
        this.cx = this.can.getContext('2d');
        this.corner = {x: 50, y: 50};
        this.img = document.createElement("img");
        this.img.src = "heart.png";
    }

    drawRect(x, y, width, height, color) {
        this.cx.fillStyle = color;
        this.cx.fillRect(x, y, width, height);
    }

    drawStroke(x, y, width, height, color, px) {
        this.cx.strokeStyle = color;
        this.cx.lineWidth = px;
        this.cx.strokeRect(x, y, width, height);
    }

    drawText(text, x, y, size, font, color, maxWidth) {
        if (maxWidth === undefined) {
        } else {
            this.maxWidth = maxWidth;
        }
        this.cx.textAlign = 'center';
        this.cx.textBaseline = 'middle';
        this.cx.fillStyle = color;
        this.cx.font = `${size}px ${font}`;
        this.cx.fillText(text, x, y, this.maxWidth);
    }

    drawCell(x, y, color, size = this.cellSize, margin = this.corner.x) {
        this.drawRect(x * this.cellSize + margin, y * this.cellSize + margin, size, size, color);
    }

    drawCellStroke(x, y, color, px, size = this.size, margin = this.corner.x) {
        this.drawStroke(x * this.cellSize + margin, y * this.cellSize + margin, size, size, color, px);
    }

    drawWall(x, y) {
        const gradient = this.cx.createLinearGradient(x * this.cellSize + 50, y * this.cellSize + 50, (x + 1) * this.cellSize + 50, (y + 1) * this.cellSize + 50);
        gradient.addColorStop(0, settings.wall.gradientColor1);
        gradient.addColorStop(1, settings.wall.gradientColor2);
        this.drawCell(x, y, gradient);
        if (settings.wall.stroke) {
            this.drawCellStroke(x, y, settings.wall.strokeColor, settings.wall.strokeWidth);
        }
    }

    drawSnake() {
        let self = this;
        if (settings.snake.isDead === true) {
            // window.snakeBlink = setInterval( () => {
            this.cx.strokeStyle = settings.snake.deathColor;
            //   setTimeout(() => {
            //     this.cx.strokeStyle = settings.snake.fillColor;
            //   },25);
            // }, 150);
        } else {
            // clearInterval(window.snakeBlink);
            this.cx.strokeStyle = settings.snake.fillColor;
        }
        this.cx.lineWidth = settings.snake.strokeWidth;
        this.cx.lineCap = 'round';
        this.cx.lineJoin = 'round';
        this.data.snakeBody.forEach((elt, i, arr) => {
            this.cx.beginPath();
            let getCenter = {
                x(elt) {
                    return elt.x * self.cellSize + self.corner.x + self.cellSize / 2
                },
                y(elt) {
                    return elt.y * self.cellSize + self.corner.x + self.cellSize / 2
                }
            };
            let nextCenterX, nextCenterY;
            let centerX = getCenter.x(elt);
            let centerY = getCenter.y(elt);
            if (i === arr.length - 1) {
                nextCenterX = getCenter.x(elt);
                nextCenterY = getCenter.y(elt);
            } else {
                nextCenterX = getCenter.x(arr[i + 1]);
                nextCenterY = getCenter.y(arr[i + 1]);
            }
            self.cx.lineWidth -= 2.5 / (arr.length);
            self.cx.moveTo(centerX, centerY);
            self.cx.lineTo(nextCenterX, nextCenterY);
            this.cx.stroke();
        });

    }

    drawApple(x, y) {
        this.drawCell(x, y, settings.apple.fillColor);
        if (settings.apple.stroke) {
            this.drawCellStroke(x, y, settings.apple.strokeColor, settings.apple.strokeWidth);
        }
    }

    drawLives() {
        const link = settings.lives;
        this.drawText(`lives:`, link.textPosX, link.textPosY, link.textSize, link.textFont, link.textColor);
        for (let j = 0; j < this.data.lives.i; j++) {
            this.cx.drawImage(this.img, (link.heartPosX + j * (link.heartWidth + 5)), link.heartPosY, link.heartWidth, link.heartHeight);
        }
    }

    drawEmptySpace(x, y) {
        this.drawCell(x, y, settings.empty.fillColor);
        if (settings.empty.stroke) {
            this.drawCellStroke(x, y, settings.empty.strokeColor, settings.empty.strokeWidth);
        }
    }

    drawGame() {
        this.cx.clearRect(0, 0, this.can.width, this.can.height);

        for (let y = 0; y < this.data.grid.height; y++) {
            for (let x = 0; x < this.data.grid.width; x++) {
                const element = this.data.grid.get(x, y);
                switch (element.type) {
                    case 'wall':
                        this.drawWall(x, y);
                        break;
                    case 'apple':
                        this.drawApple(x, y);
                        break;
                    default:
                        this.drawEmptySpace(x, y);
                        break;
                }
            }
        }
        this.drawSnake();
    }

    drawElement(element) {
        const link = element.link;
        const x = this.can.width / 2 - link.rectWidth / 2;
        const y = link.posY - link.rectHeight / 2;
        let color = element.isChosen ? link.chosenRectColor : link.rectColor;
        this.drawRect(x, y, link.rectWidth, link.rectHeight, color);
        this.drawStroke(x, y, link.rectWidth, link.rectHeight, link.rectStrokeColor, link.rectStrokeWidth);
        this.drawText(element.name, link.posX, link.posY, link.textSize, link.textFont, link.textColor);
    }

    drawMenu() {
        this.cx.clearRect(0, 0, this.can.width, this.can.height);
        ;
        let self = this;
        this.drawRect(this.corner.x, this.corner.y, 500, 500, settings.menu.rectColor);
        this.drawStroke(this.corner.x, this.corner.y, 500, 500, settings.menu.rectStrokeColor, settings.menu.rectStrokeWidth);
        for (let i = 0; i < this.data.menu.list.length; i++) {
            const element = this.data.menu.list[i];
            self.drawElement(element);
        }
    }

    drawPause() {
        const link = settings.pause;
        const posX = this.can.width / 2 - link.rectWidth / 2;
        const posY = this.can.height / 2 - link.rectHeight / 2;
        this.drawRect(posX, posY, link.rectWidth, link.rectHeight, link.rectColor);
        this.drawStroke(posX, posY, link.rectWidth, link.rectHeight, link.rectStrokeColor, link.rectStrokeWidth);
        this.drawText('PAUSE', this.can.width / 2, this.can.height / 2, link.textSize, link.textFont, link.textColor);
    }

    drawLost() {
        const link = settings.lost;
        const posX = this.can.width / 2 - link.rectWidth / 2;
        const posY = this.can.height / 2 - link.rectHeight / 2;
        this.drawRect(posX, posY, link.rectWidth, link.rectHeight, link.rectColor);
        this.drawStroke(posX, posY, link.rectWidth, link.rectHeight, link.rectStrokeColor, link.rectStrokeWidth);
        this.drawText(`Game Over`, this.can.width / 2, this.can.height / 2, link.textSize, link.textFont, link.textColor);
    }

    drawScores() {
        const link = settings.scores;
        const posX = link.posX - link.rectWidth / 2;
        const posY = link.posY - link.rectHeight / 2;
        this.drawRect(posX, posY, link.rectWidth, link.rectHeight, link.rectColor);
        this.drawStroke(posX, posY, link.rectWidth, link.rectHeight, link.rectStrokeColor, link.rectStrokeWidth);
        this.drawText(`scores: ${this.data.scores.i}`, link.posX, link.posY, link.textSize, link.textFont, link.textColor);
    }

    display() {
        switch (settings.other.game) {
            case 'menu':
                this.drawMenu();
                break;
            case 'lost':
                this.drawLost();
                break;
            case 'game':
                this.drawGame();
                this.drawLives();
                this.drawScores();
                if (settings.other.pause === true) {
                    this.drawPause();
                }
                break;
        }
    }
}

class Mediator {
    constructor() {
        this.components = {};
        this.DefaultSnakeValues = [new Cell(5, 3, 'snake'),
            new Cell(4, 3, 'snake'),
            new Cell(3, 3, 'snake')];
        this.DefaultSnakeDirection = directionNames.right;
        this.DefaultAppleValues = [new Cell(10, 10, 'apple')];

    }

    register(component) {
        this.components[component.name] = component;
        component.mediator = this;
    }

    notify(sender, event) {

        switch (sender) {
            case (this.components.snake): // SNAKE

                switch (event.data.type) {
                    case ('apple'):
                        this.components.snake.grow();
                        this.components.level.scores.i += 1;
                        this.components.appleFactory.createApple();
                        break;
                    case ('wall'):
                    case ('snake'):
                        if (settings.other.godMode === false) {
                            this.die();
                        }
                        break;
                }
                break;

            case (this.components.controls): // CONTROLS
                if (settings.other.game === 'game') { // GAME branch
                    switch (true) {
                        case (event.data in directionNames):
                            this.components.snake.turn(event.data);
                            break;
                        case (event.data === 'enter'):
                            if (settings.other.pause) {
                                settings.other.pause = false;
                                this.components.snake.loop();
                            }
                            break;
                        case (event.data === 'esc'):
                            switch (settings.other.pause) {
                                case true:
                                    settings.other.pause = false;
                                    this.components.snake.loop();
                                    break;
                                case false:
                                    settings.other.pause = true;
                                    this.components.snake.loopStop();
                                    break;
                            }
                            break;
                    }
                } else if (settings.other.game === 'menu') { // MENU branch
                    if (event.data === 'up' || event.data === 'down') {
                        this.components.menu.scroll(event.data);
                    } else if (event.data === 'enter') {
                        this.components.menu.select();
                    } else if (event.name === 'touch'){
                      this.components.menu.list[0].action();
                    }
                } else { //LOST branch
                    if (event.data === 'enter') {
                        settings.other.game = 'menu';
                    }
                }


                break;
        }
    }

    start() {
        this.components.level.scores.i = 0;
        this.components.appleFactory.list = this.DefaultAppleValues;
        this.components.level.parse(plan);
        this.spawn();
        this.components.level.init(...this.DefaultAppleValues);
        this.refreshRenderData();
        this.components.snake.loop();
    }

    spawn() {
        this.components.snake.direction = this.DefaultSnakeDirection;
        this.components.snake.body = [...this.DefaultSnakeValues];
        this.components.level.init(...this.DefaultSnakeValues);
    }

    die() {
        settings.snake.isDead = true;
        this.components.snake.loopStop();
        let self = this;
        let levelSnakes = this.components.level.findActors('snake');
        this.components.level.lives.i -= 1;
        if (this.components.level.lives.i === 0) {
            this.gameOver();
        } else {
            let dieDelay = setTimeout(() => {
                settings.snake.isDead = false;
                levelSnakes.forEach((item) => {
                    item.type = 'empty';
                });
                // this.components.snake.body = [];
                self.spawn();
                self.refreshRenderData();
                this.components.snake.loop();
            }, 1500);
        }
    }

    refreshRenderData() {
        let self = this;
        this.components.renderer.data = {
            grid: self.components.level.grid,
            scores: self.components.level.scores,
            lives: self.components.level.lives,
            menu: self.components.menu,
            snakeBody: self.components.snake.body,
            snakeDirection: self.components.snake.direction,
        };
    }

    gameOver() {
        this.components.snake.loopStop();
        let deathDelay = setTimeout(() => {
            settings.other.game = 'lost'
        }, 15);
    }
}

const mediator = new Mediator();

const level = new Level(plan);
const snake = new Snake(level.grid);
const appleFactory = new AppleFactory(level.grid);
const menu = new Menu();
const controls = new Controls();
const renderer = new Renderer('canvas');


mediator.register(level);
mediator.register(snake);
mediator.register(appleFactory);
mediator.register(menu);
mediator.register(controls);
mediator.register(renderer);
mediator.refreshRenderData();


const animate = () => {
    requestAnimationFrame(animate);
    renderer.display();
};
requestAnimationFrame(animate);
