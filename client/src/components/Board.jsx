import React, { useState, useEffect } from "react";
import SnakeBoard from "../scripts/gameboardMaker";
import Snake from "../scripts/snake";
import { moveSnake, newFood } from "../scripts/movement";
import { usePrev } from "../customHooks";
import Square from "./Square.jsx";

const board = new SnakeBoard(100, 50);
const snake = new Snake();

snake.addToHead(2247);
snake.addToHead(2347);
snake.addToHead(2447);
snake.addToHead(2547);

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
    if (!moveSnake(next, board, snake, food)) {
      clearInterval(interval);
      setGameOver(true);
    } else if (next.id === food) {
      setFood(newFood(board, snake));
    }
  }, 100);

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
