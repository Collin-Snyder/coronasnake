const { v4 } = require("uuid");
const { Gameboard } = require("./gameboardMaker");
const { Snake } = require("./snakeConstructor");

const games = {};

class Game {
  constructor(id, createdAt) {
    this.id = id;
    this.createdAt = createdAt;
    this.status = "open";
    this.name1 = "";
    this.color1 = "";
    this.name2 = "";
    this.color2 = "";
    this.board = new Gameboard(50, 50);
    this.snake1 = new Snake([2010, 2060, 2110, 2160]);
    this.snake2 = new Snake([491, 441, 391, 341]);
    this.food1 = 0;
    this.food2 = 0;
    this.gameOver = false;
    this.queues = { 1: ["up"], 2: ["down"] };

    this.setNewFood(1);
    this.setNewFood(2);
  }

  getSummary() {
    return {
      id: this.id,
      createdAt: this.createdAt,
      name1: this.name1,
      color1: this.color1,
      name2: this.name2,
      color2: this.color2,
      head1: this.snake1.head.id,
      head2: this.snake2.head.id,
      tail1: this.snake1.tail.id,
      tail2: this.snake2.tail.id,
      length1: this.snake1.size,
      length2: this.snake2.size,
      food1: this.food1,
      food2: this.food2
    };
  }

  getDiff(prevSummary, currSummary) {
    let diff = {};
    for (let prop in currSummary) {
      if (currSummary[prop] !== prevSummary[prop]) {
        if (/tail|food/.test(prop)) {
          diff[prop] = prevSummary[prop];
          if (/food/.test(prop)) diff[`new${prop}`] = currSummary[prop];
        } else diff[prop] = currSummary[prop];
      }
    }
    return diff;
  }

  update(info) {
    for (let property in info) {
      this[property] = info[property];
    }
  }

  keypress(snakeId, direction) {
    this.queues[snakeId].push(direction);
  }

  moveSnakes() {
    let move1 = this.moveSnake(1);
    let move2 = this.moveSnake(2);

    if (!move1 && !move2) return "draw";
    else if (!move1) return "2";
    else if (!move2) return "1";
    else return { ...move1, ...move2 };
  }

  checkNextMove(next, food) {
    if (!next || next.snake) return "lose";

    return next.id === food ? "eat" : "move";
  }

  moveSnake(snakeId) {
    let snake = this[`snake${snakeId}`];
    let directions = this.queues[snakeId];
    let food = this[`food${snakeId}`];
    let next = this.board.get(snake.head.id).borders[directions[0]];

    if (directions.length > 1) directions.shift();
    let move = this.checkNextMove(next, food);
    let info;

    switch (move) {
      case "lose":
        return false;
      case "eat":
        console.log("eating");
        let snakeInfoEat = snake.eat(next.id);
        let foodInfo = this.setNewFood(snakeId);
        info = {
          [`head${snakeId}`]: snakeInfoEat.head,
          [`food${snakeId}`]: foodInfo.oldFood,
          [`newfood${snakeId}`]: foodInfo.newFood,
          [`size${snakeId}`]: snakeInfoEat.size
        };
        break;
      case "move":
        this.board.set(snake.tail.id, "snake", false);
        let snakeInfoMove = snake.move(next.id);
        info = {
          [`head${snakeId}`]: snakeInfoMove.head,
          [`tail${snakeId}`]: snakeInfoMove.tail
        };
        break;
    }
    this.board.set(snake.head.id, "snake", true);
    return info;
  }

  setNewFood(snakeId) {
    let newFood;
    let oldFood = this[`food${snakeId}`];
    let otherFood = this[`food${snakeId === 1 ? 2 : 1}`];

    do {
      newFood = Math.ceil(Math.random() * this.board.squareCount);
    } while (this.board.get(newFood).snake || newFood === otherFood);

    this[`food${snakeId}`] = newFood;
    return { oldFood, newFood };
  }

  reset() {
    this.status = "starting";
    this.board = new Gameboard(50, 50);
    this.snake1 = new Snake([2010, 2060, 2110, 2160]);
    this.snake2 = new Snake([491, 441, 391, 341]);
    this.food1 = 0;
    this.food2 = 0;
    this.gameOver = false;
    this.queues = { 1: ["up"], 2: ["down"] };
    this.setNewFood(1);
    this.setNewFood(2);
  }
}

const addGame = gameInfo => {
  let id = v4();
  games[id] = new Game(id, gameInfo.createdAt);
  return id;
};

const getAllOpenGames = () => {
  return Object.values(games)
    .filter(g => g.status === "open")
    .map(g => g.getSummary());
};

const getGame = id => {
  return games[id];
};

const deleteGame = id => {
  delete games[id];
};

const playAgain = (currentGameId, newGameId) => {
  let { name1, color1, name2, color2 } = games[currentGameId];

  games[newGameId].name1 = name1;
  games[newGameId].name2 = name2;
  games[newGameId].color1 = color1;
  games[newGameId].color2 = color2;

  deleteGame(currentGameId);

  return games[newGameId].getSummary();
};

module.exports = { addGame, getAllOpenGames, getGame, deleteGame, playAgain };
