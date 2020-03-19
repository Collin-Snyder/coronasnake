export const moveSnake = (next, board, snake) => {
  if (!next || next.snake) {
    console.log("YOU LOSE!");
    return false;
  }
  
  board.set(snake.tail.id, "snake", false);
  document.getElementById(snake.tail.id).classList.remove("snake");
  
  snake.move(next.id);

  board.set(snake.head.id, "snake", true);
  document.getElementById(snake.head.id).classList.add("snake");

  return true;
};
