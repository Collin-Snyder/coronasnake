export const moveSnake = (next, board, snake, food) => {
  if (!next || next.snake) {
    console.log("YOU LOSE!");
    return false;
  }

  if (next.id === food) {
    snake.addToHead(next.id);
  } else {
    board.set(snake.tail.id, "snake", false);
    document.getElementById(snake.tail.id).classList.remove("snake");

    snake.move(next.id);
  }

  board.set(snake.head.id, "snake", true);
  document.getElementById(snake.head.id).classList.add("snake");

  return true;
};

export const newFood = (board, snake) => {
  let food = Math.ceil(Math.random() * board.squareCount);

  while (snake.includes(food)) {
    food = Math.ceil(Math.random() * board.squareCount);
  }

  return food;
};
