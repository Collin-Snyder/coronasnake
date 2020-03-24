

const checkNextMove = next => {
  var gameOver = !next || next.snake ? true : false;
  return food => {
    if (gameOver) return null;

    return next.id === food ? "eat" : "move";
  };
};

const moveSnake = (directions, board, snake, food) => {
  console.log(
  "inside moveSnake directions: ", directions
  )
  let next = board.get(snake.head.id).borders[directions[0]];
  if (directions.length > 1) directions.shift();
  console.log("inside moveSnake after shift: ", directions);
  let move = checkNextMove(next)(food);
  
  switch (move) {
    case null:
      return false;
    case "eat":
      snake.eat(next.id);
    case "move":
      board.set(snake.tail.id, "snake", false);
      snake.move(next.id);
    default:
      board.set(snake.head.id, "snake", true);
      return move;
  }
}


const newFood = (board, otherFood) => {
  let food = Math.ceil(Math.random() * board.squareCount);

  while (board.get(food).snake || food === otherFood) {
    food = Math.ceil(Math.random() * board.squareCount);
  }

  return food;
};

class Queue {
  constructor(exp = []) {
    this.front = 0;
    this.end = -1;
    this.storage = {};
    this.size = 0;

    if (exp.length) {
      exp.forEach(e => this.put(e));
    }
  }

  put(value) {
    this.end++;
    this.size++;
    this.storage[this.end] = value;
  }

  get() {
    if (this.empty()) return null;

    let oldFront = this.front;
    let output = this.storage[oldFront];

    this.front++;
    delete this.storage[oldFront];
    this.size--;

    return output;
  }

  empty() {
    return this.front > this.end;
  }

  oneLeft() {
    return this.front === this.end;
  }

  first() {
    return this.storage[this.front];
  }

  export() {
    let output = [];
    while (!this.empty()) {
      output.push(this.get());
    }
    return output;
  }
}

module.exports.Queue = Queue;

module.exports.checkNextMove = checkNextMove;
module.exports.moveSnake = moveSnake;
module.exports.newFood = newFood;
