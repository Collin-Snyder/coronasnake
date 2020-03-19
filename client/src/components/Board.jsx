import React, { useState, useEffect } from "react";
import SnakeBoard from "../scripts/gameboardMaker";
import Snake from "../scripts/snake";
import { checkNextMove, newFood, Queue } from "../scripts/movement";
import { usePrev } from "../customHooks";
import Square from "./Square.jsx";

const board = new SnakeBoard(50, 25);
const snake = new Snake([23, 73, 123, 173]);
const directions = new Queue();

const Board = () => {
  const [food, setFood] = useState(newFood(board, snake));
  const [direction, setDirection] = useState("down");
  const [gameOver, setGameOver] = useState(false);
  const oldFood = usePrev(food);

  useEffect(() => {
    if (food) document.getElementById(food).classList.add("food");
    if (oldFood) document.getElementById(oldFood).classList.remove("food");
  }, [food]);

  let interval = setInterval(() => {

    let next = board.get(snake.head.id).borders[direction];
    let move = checkNextMove(next)(food);

    switch (move) {
      case null:
        clearInterval(interval);
        setGameOver(true);
        break;
      case "eat":
        snake.eat(next.id);
        setFood(newFood(board, snake));
      case "move":
        board.set(snake.tail.id, "snake", false);
        document.getElementById(snake.tail.id).classList.remove("snake");
        snake.move(next.id);
      default:
        board.set(snake.head.id, "snake", true);
        document.getElementById(snake.head.id).classList.add("snake");
    }
  }, 200);

  const keypressHandler = e => {
    if (![37, 38, 39, 40].includes(e.keyCode)) return;

    e.preventDefault();

    const lat = ["right", "left"];
    const long = ["up", "down"];

    if (e.keyCode === 37 && !lat.includes(direction)) {
      clearInterval(interval);
      setDirection("left");
    } else if (e.keyCode === 38 && !long.includes(direction)) {
      clearInterval(interval);
      setDirection("up");
    } else if (e.keyCode === 39 && !lat.includes(direction)) {
      clearInterval(interval);
      setDirection("right");
    } else if (e.keyCode === 40 && !long.includes(direction)) {
      clearInterval(interval);
      setDirection("down");
    }
  };

  document.addEventListener("keydown", keypressHandler);

  return (
    <div className="board">
      {gameOver
        ? "YOU LOSE!"
        : board.squares.map(s => <Square id={s.id} key={s.id} />)}
    </div>
  );
};

export default Board;
