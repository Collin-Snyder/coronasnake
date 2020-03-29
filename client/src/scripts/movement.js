export const checkNextMove = next => {
  var gameOver = !next || next.snake ? true : false;
  return food => {
    if (gameOver) return null;

    return next.id === food ? "eat" : "move";
  };
};

export const newFood = (board, snake) => {
  let food = Math.ceil(Math.random() * board.squareCount);

  while (board.get(food).snake) {
    food = Math.ceil(Math.random() * board.squareCount);
  }

  return food;
};

export class Queue {
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
