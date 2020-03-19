import React, { useState, useEffect, useCallback } from "react";
import SnakeBoard from "../scripts/gameboardMaker";
import Snake from "../scripts/snake";
import { moveSnake } from "../scripts/movement";
import Square from "./Square.jsx";

const board = new SnakeBoard(100, 50);
const snake = new Snake();

snake.addToHead(2247);
snake.addToHead(2347);
snake.addToHead(2447);
snake.addToHead(2547);

const Board = () => {
  const [direction, setDirection] = useState("down");
  const [gameOver, setGameOver] = useState(false);

  let interval = setInterval(() => {
    let next = board.get(snake.head.id).borders[direction];
    if (!moveSnake(next, board, snake)) {
      clearInterval(interval);
      setGameOver(true);
    }
  }, 200);

  const keypressHandler = e => {
    if (e.keyCode === 37 && direction !== "right") {
      clearInterval(interval);
      setDirection("left");
    } else if (e.keyCode === 38 && direction !== "down") {
      clearInterval(interval);
      setDirection("up");
    } else if (e.keyCode === 39 && direction !== "left") {
      clearInterval(interval);
      setDirection("right");
    } else if (e.keyCode === 40 && direction !== "up") {
      clearInterval(interval);
      setDirection("down");
    }
  };

  document.addEventListener("keydown", keypressHandler);

  return (
    <div className="board">
      {gameOver
        ? "YOU LOSE!"
        : board.squares.map(s => (
            <Square id={s.id} key={s.id} />
            // <div className="square" id={s.id} key={s.id}></div>
          ))}
    </div>
  );
};

export default Board;
