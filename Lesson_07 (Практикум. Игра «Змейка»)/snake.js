"use strict";
const settings = {
    rowsCount: 15,
    colsCount: 15,
    speed: 2,
    winFoodCount: 20,
};

const config = {
    settings,

    init(userSettings) {
        Object.assign(this.settings, userSettings);
    },

    getRowsCount() {
        return this.settings.rowsCount;
    },

    getColsCount() {
        return this.settings.colsCount;
    },

    getSpeed() {
        return this.settings.speed;
    },

    getWinFoodCount() {
        return this.settings.winFoodCount;
    },

    validate() {
        const result = {
            isValid: true,
            errors: [],
        };

        if (this.getRowsCount() < 10 || this.getRowsCount() > 30) {
            result.isValid = false;
            result.errors.push('Неверные настройки, значение rowsCount должно быть в диапазоне [10, 30].');
        }

        if (this.getColsCount() < 10 || this.getColsCount() > 30) {
            result.isValid = false;
            result.errors.push('Неверные настройки, значение colsCount должно быть в диапазоне [10, 30].');
        }

        if (this.getSpeed() < 1 || this.getSpeed() > 10) {
            result.isValid = false;
            result.errors.push('Неверные настройки, значение speed должно быть в диапазоне [1, 10].');
        }

        if (this.getWinFoodCount() < 5 || this.getWinFoodCount() > 50) {
            result.isValid = false;
            result.errors.push('Неверные настройки, значение winFoodCount должно быть в диапазоне [5, 50].');
        }

        return result;
    },
};

const map = {
    cells: {},
    usedCells: [],

    init(rowsCount, colsCount) {
        const table = document.getElementById('game_snake');
        table.innerHTML = '';
        this.cells = {};
        this.usedCells = [];

        for (let row = 0; row < rowsCount; row++) {
            const tr = document.createElement('tr');
            tr.classList.add('row');
            table.appendChild(tr);

            for (let col = 0; col < colsCount; col++) {
                const td = document.createElement('td');
                td.classList.add('cell');
                tr.appendChild(td);

                this.cells[`x${col}_y${row}`] = td;
            }
        }
    },

    render(snakePointsArray, foodPoint, antiFoodPointArray) {
        for (const cell of this.usedCells) {
            cell.className = 'cell';
            cell.innerHTML = '';
        }

        this.usedCells = [];

        snakePointsArray.forEach((point, index) => {
            const snakeCell = this.cells[`x${point.x}_y${point.y}`];
            snakeCell.classList.add(index === 0 ? 'snakeHead' : 'snakeBody');
            this.usedCells.push(snakeCell);
        });

        const foodCell = this.cells[`x${foodPoint.x}_y${foodPoint.y}`];
        foodCell.classList.add('food');
        foodCell.innerHTML = "<img src='img/apple.png' width=25px/>";
        this.usedCells.push(foodCell);

        antiFoodPointArray.forEach((point, index) => {
            const antiFoodCell = this.cells[`x${point.x}_y${point.y}`];
            antiFoodCell.classList.add('antiFood');
            antiFoodCell.innerHTML = "<img src='img/poison.png' width=25px/>";
            this.usedCells.push(antiFoodCell);
        });
    },
};

const snake = {
    body: [],
    direction: null,
    lastStepDirection: null,
    maxX: null,     // границы игрового поля (по ширине)
    maxY: null,     // границы игрового поля (по высоте)

    init(startBody, direction, maxY = 999, maxX = 999) {
        this.body = startBody;
        this.direction = direction;
        this.lastStepDirection = direction;
        this.maxX = maxX;
        this.maxY = maxY;
    },

    getBody() {
        return this.body;
    },

    getLastStepDirection() {
        return this.lastStepDirection;
    },

    setDirection(direction) {
        this.direction = direction;
    },

    isOnPoint(point) {
        return this.getBody().some((snakePoint) => {
            return snakePoint.x === point.x && snakePoint.y === point.y;
        });
    },

    makeStep() {
        this.lastStepDirection = this.direction;
        this.getBody().unshift(this.getNextStepHeadPoint());
        this.getBody().pop();
    },

    growUp() {
        const lastBodyIndex = this.getBody().length - 1;
        const lastBodyPoint = this.getBody()[lastBodyIndex];
        const lastBodyPointClone = Object.assign({}, lastBodyPoint);

        this.getBody().push(lastBodyPointClone);
    },

    getNextStepHeadPoint() {
        const firstPoint = this.getBody()[0];
        let x, y;   // при пересечении границы поля змейка появляется с противоположной стороны

        switch (this.direction) {
            case 'up':
                y = firstPoint.y - 1 >= 0 ? firstPoint.y - 1 : this.maxY - 1;
                return { x: firstPoint.x, y: y };
            case 'right':
                x = firstPoint.x + 1 < this.maxX ? firstPoint.x + 1 : 0;
                return { x: x, y: firstPoint.y };
            case 'down':
                y = firstPoint.y + 1 < this.maxY ? firstPoint.y + 1 : 0;
                return { x: firstPoint.x, y: y };
            case 'left':
                x = firstPoint.x - 1 >= 0 ? firstPoint.x - 1 : this.maxX - 1;
                return { x: x, y: firstPoint.y };
        }
    },
};

const food = {
    x: null,
    y: null,

    getCoordinates() {
        return {
            x: this.x,
            y: this.y,
        };
    },

    setCoordinates(point) {
        this.x = point.x;
        this.y = point.y;
    },

    isOnPoint(point) {
        return this.x === point.x && this.y === point.y;
    },
};

const antiFood = {
    list: [],

    getList() {
        return this.list;
    },

    addCoordinates(point) {
        this.list.push({ x: point.x, y: point.y })
    },

    delCoordinates() {
        this.list.pop();
    },

    clearAll() {
        this.list = [];
    },

    isOnPoint(point) {
        return this.getList().some((antiFoodPoint) => {
            return antiFoodPoint.x === point.x && antiFoodPoint.y === point.y;
        });
    },
};


const status = {
    condition: null,

    setPlaying() {
        this.condition = 'playing';
    },

    setStopped() {
        this.condition = 'stopped';
    },

    setFinished() {
        this.condition = 'finished';
    },

    isPlaying() {
        return this.condition === 'playing';
    },

    isStopped() {
        return this.condition === 'stopped';
    },
};

const game = {
    config,
    map,
    snake,
    food,
    antiFood,
    status,
    tickInterval: null,
    currentCount: null,
    // для управления Змейкой при помощи кнопок (мобильная версия)
    upKey: { code: 'ArrowUp' },
    downKey: { code: 'ArrowDown' },
    leftKey: { code: 'ArrowLeft' },
    rightKey: { code: 'ArrowRight' },

    init(userSettings = {}) {
        this.config.init(userSettings);
        const validation = this.config.validate();
        this.currentCount = document.getElementById('current_count');

        if (!validation.isValid) {
            for (const err of validation.errors) {
                console.log(err);
            }

            return;
        }
        this.map.init(this.config.getRowsCount(), this.config.getColsCount());
        this.setEventHandlers();
        this.reset();
    },

    reset() {
        this.stop();
        this.currentCount.textContent = '';
        this.snake.init(this.getStartSnakeBody(), 'up', this.config.getRowsCount(), this.config.getColsCount());
        this.food.setCoordinates(this.getRandomFreeCoordinates());      // установим на поле Еду
        this.antiFood.clearAll();                                       // очистим антиЕду
        this.map.init(this.config.getRowsCount(), this.config.getColsCount());
        this.render();
    },

    stop() {
        this.status.setStopped();
        clearInterval(this.tickInterval);
        this.setPlayButton('Старт');
    },

    play() {
        this.status.setPlaying();
        this.tickInterval = setInterval(() => {
            this.tickHandler();
        }, 1000 / this.config.getSpeed());
        this.setPlayButton('Стоп');
    },

    finish() {
        this.status.setFinished();
        clearInterval(this.tickInterval);
        this.setPlayButton('Игра закончена', true);
    },

    tickHandler() {
        if (!this.canMakeStep()) return this.finish();
        if (this.food.isOnPoint(this.snake.getNextStepHeadPoint())) {
            this.snake.growUp();
            const pointer = this.food.getCoordinates();

            this.food.setCoordinates(this.getRandomFreeCoordinates());
            if (this.snake.getBody().length % 2 == 0)
                this.antiFood.addCoordinates(this.getRandomFreeCoordinates());      // добавляем антиЕду каждый второй ход

            if (this.isGameWon()) this.finish();
        }

        this.snake.makeStep();
        this.render();
    },

    canMakeStep() {
        const nextHeadPoint = this.snake.getNextStepHeadPoint();

        return !this.snake.isOnPoint(nextHeadPoint) &&
            !this.antiFood.isOnPoint(nextHeadPoint) &&
            nextHeadPoint.x < this.config.getColsCount() &&
            nextHeadPoint.y < this.config.getRowsCount() &&
            nextHeadPoint.x >= 0 &&
            nextHeadPoint.y >= 0;
    },

    setPlayButton(txt, isDisabled = false) {
        const playButton = document.getElementById('playButton');
        const upButton = document.getElementById('up_button');
        const downButton = document.getElementById('down_button');
        const leftButton = document.getElementById('left_button');
        const rightButton = document.getElementById('right_button');

        playButton.textContent = txt;

        if (isDisabled) {
            playButton.classList.add('disabled')
            upButton.classList.add('disabled')
            downButton.classList.add('disabled')
            leftButton.classList.add('disabled')
            rightButton.classList.add('disabled')
        } else {
            playButton.classList.remove('disabled');
            upButton.classList.remove('disabled');
            downButton.classList.remove('disabled');
            leftButton.classList.remove('disabled');
            rightButton.classList.remove('disabled');
        }
    },

    getStartSnakeBody() {
        return [
            {
                x: Math.floor(this.config.getColsCount() / 2),
                y: Math.floor(this.config.getRowsCount() / 2),
            },
        ];
    },

    getRandomFreeCoordinates() {
        const exclude = [this.food.getCoordinates(), ...this.antiFood.getList(), ...this.snake.getBody()];

        while (true) {
            const rndPoint = {
                x: Math.floor(Math.random() * this.config.getColsCount()),
                y: Math.floor(Math.random() * this.config.getRowsCount()),
            };

            // if (!exclude.some((exPoint) => rndPoint.x === exPoint.x && rndPoint.y === exPoint.y)) return rndPoint;
            if (!exclude.some((exPoint) => {
                return rndPoint.x === exPoint.x && rndPoint.y === exPoint.y;
            })) return rndPoint;
        }
    },

    setEventHandlers() {
        document.getElementById('playButton').addEventListener('click', () => {
            this.playClickHandler();
        });
        document.getElementById('newGameButton').addEventListener('click', () => {
            this.newGameClickHandler();
        });
        document.addEventListener('keydown', (event) => {
            this.keyDownHandler(event);
        });
        document.getElementById('up_button').addEventListener('click', () => {
            this.keyDownHandler(this.upKey);
        });
        document.getElementById('down_button').addEventListener('click', () => {
            this.keyDownHandler(this.downKey);
        });
        document.getElementById('left_button').addEventListener('click', () => {
            this.keyDownHandler(this.leftKey);
        });
        document.getElementById('right_button').addEventListener('click', () => {
            this.keyDownHandler(this.rightKey);
        });
    },

    playClickHandler() {
        if (this.status.isPlaying()) {
            this.stop();
        } else if (this.status.isStopped()) {
            this.play();
        }
    },

    newGameClickHandler() {
        this.reset();
    },

    keyDownHandler(event) {
        if (!this.status.isPlaying()) return;

        const direction = this.getDirectionByCode(event.code);

        if (this.canSetDirection(direction)) this.snake.setDirection(direction);
    },

    getDirectionByCode(code) {
        switch (code) {
            case 'KeyW':
            case 'ArrowUp':
                return 'up';
            case 'KeyD':
            case 'ArrowRight':
                return 'right';
            case 'KeyS':
            case 'ArrowDown':
                return 'down';
            case 'KeyA':
            case 'ArrowLeft':
                return 'left';
        }
    },

    canSetDirection(direction) {
        const lastStepDirection = this.snake.getLastStepDirection();

        return direction === 'up' && lastStepDirection !== 'down' ||
            direction === 'right' && lastStepDirection !== 'left' ||
            direction === 'down' && lastStepDirection !== 'up' ||
            direction === 'left' && lastStepDirection !== 'right';
    },

    isGameWon() {
        this.currentCount.textContent = `Текущий счет : ${this.snake.getBody().length - 1} из (${this.config.getWinFoodCount()})`;
        return this.snake.getBody().length > this.config.getWinFoodCount();
    },

    render() {
        this.map.render(this.snake.getBody(), this.food.getCoordinates(), this.antiFood.getList());
    },
};

game.init({ speed: 5 });
