class Gameboard {
  constructor(width, height) {
    this.squares = [];
    this.squareCount = width * height;
    this.width = width;
    this.height = height;

    for (let s = 1; s <= this.squareCount; s++) {
      this.squares.push({
        id: s,
        row: Math.ceil(s / this.height),
        column:
          Math.floor(s % this.width) > 0
            ? Math.floor(s % this.width)
            : this.width,
        snake: false
      });
    }

    this.squares.forEach((square) => {
      this.addBorders(square);
    });
  }

  addBorders(square) {
    square.borders = { left: null, right: null, up: null, down: null };

    if ((square.id - 1) % this.width !== 0)
      square.borders.left = this.squares[square.id - 2];

    if (square.id % this.width !== 0)
      square.borders.right = this.squares[square.id];

    if (square.id - this.width > 0)
      square.borders.up = this.squares[square.id - this.width - 1];

    if (square.id + this.width <= this.squareCount)
      square.borders.down = this.squares[square.id + this.width - 1];

    return square;
  }

  get(s) {
    if (!this.squares[s - 1]) {
      console.log("Invalid square id.");
      return undefined;
    }
    return this.squares[s - 1];
  }

  set(s, key, val) {
      if (!this.squares[s - 1]) {
          console.log("Invalid square id.");
          return undefined;
      }
      this.squares[s - 1][key] = val;
      return this.squares[s - 1];
  }
}

class SnakeBoard extends Gameboard {
  constructor(width, height) {
    super(width, height);
  }
}

export default SnakeBoard;
