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

  gameSummary() {
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

  update(info) {
    for (let property in info) {
      this[property] = info[property];
    }
  }

  keypress(snakeId, direction) {
    this.queues[snakeId].push(direction);
  }

  checkNextMove(next, food) {
    if (!next || next.snake) return "gameOver";

    return next.id === food ? "eat" : "move";
  }

  moveSnake(snakeId) {
    // console.log("inside moveSnake directions: ", directions);
    let snake = this[`snake${snakeId}`];
    let directions = this.queues[snakeId];
    let food = this[`food${snakeId}`];
    let next = this.board.get(snake.head.id).borders[directions[0]];

    if (directions.length > 1) directions.shift();
    // console.log("inside moveSnake after shift: ", directions);
    let move = this.checkNextMove(next, food);

    switch (move) {
      case "gameOver":
        return false;
      case "eat":
        snake.eat(next.id);
        this.setNewFood(snakeId);
      case "move":
        this.board.set(snake.tail.id, "snake", false);
        snake.move(next.id);
      default:
        this.board.set(snake.head.id, "snake", true);
        return move;
    }
  }

  setNewFood(snakeId) {
    let newFood;
    let otherFood = this[`food${snakeId === 1 ? 2 : 1}`];

    do {
      newFood = Math.ceil(Math.random() * this.board.squareCount);
    } while (this.board.get(newFood).snake || newFood === otherFood);

    this[`food${snakeId}`] = newFood;
  }
}

module.exports.addGame = gameInfo => {
  let id = v4();
  games[id] = new Game(id, gameInfo.createdAt);
  return id;
};

module.exports.getAllOpenGames = () => {
  return Object.values(games)
    .filter(g => g.status === "open")
    .map(g => g.gameSummary());
};

module.exports.getGame = id => {
  return games[id];
};

module.exports.deleteGame = id => {
  delete games[id];
};
