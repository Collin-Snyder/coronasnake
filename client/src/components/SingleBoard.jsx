import React, { useState, useEffect, useCallback, useContext } from "react";
import SnakeBoard from "../scripts/gameboardMaker";
import Snake from "../scripts/snake";
import { checkNextMove, newFood } from "../scripts/movement";
import { usePrev, useInterval } from "../customHooks";
import Square from "./Square.jsx";

const board = new SnakeBoard(50, 50);
let snake = new Snake([16, 41, 66, 91]);

const reset = (directionCB, foodCB, gameCB) => {
  directionCB(["down"]);
  foodCB(newFood(board, snake));
  snake.each(id => {
    document.getElementById(id).classList.remove("snake");
    board.set(id, "snake", false);
  });
  snake = new Snake([13, 38, 63, 88]);
  gameCB(false);
};

const SingleBoard = () => {
  const [food, setFood] = useState(newFood(board, snake));
  const oldFood = usePrev(food);
  const [directions, setDirections] = useState(["down"]);
  const [gameOver, setGameOver] = useState(false);
  const moveSnake = useCallback(() => {
    let next = board.get(snake.head.id).borders[directions[0]];

    let move = checkNextMove(next)(food);

    switch (move) {
      case null:
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
  }, [directions]);
  const keypressHandler = useCallback(
    e => {
      if (![37, 38, 39, 40].includes(e.keyCode)) return;

      e.preventDefault();

      const codes = { 37: "left", 38: "up", 39: "right", 40: "down" };
      const lat = ["right", "left"];
      const long = ["up", "down"];

      if (
        ([37, 39].includes(e.keyCode) && !lat.includes(directions[0])) ||
        ([38, 40].includes(e.keyCode) && !long.includes(directions[0]))
      ) {
        let newDirections = [...directions];
        newDirections.push(codes[e.keyCode]);
        setDirections(newDirections);
      }
    },
    [directions]
  );

  useEffect(() => {
    document.addEventListener("keydown", keypressHandler);
    return () => document.removeEventListener("keydown", keypressHandler);
  }, [directions]);

  useInterval(
    () => {
      moveSnake();
      if (directions.length > 1) {
        let newDirections = [...directions];
        newDirections.shift();
        setDirections(newDirections);
      }
    },
    gameOver ? null : 100
  );

  useEffect(() => {
    if (food) document.getElementById(food).classList.add("food");
    if (oldFood) document.getElementById(oldFood).classList.remove("food");
  }, [food]);

  return (
    <div className="board">
      <div
        className="gameover flexCol"
        style={{ display: gameOver ? "flex" : "none" }}
      >
        <h1>YOU LOSE</h1>
        <button
          onClick={() => {
            reset(setDirections, setFood, setGameOver);
          }}
        >
          Play again?
        </button>
      </div>
      {board.squares.map(s => (
        <Square id={s.id} key={s.id} />
      ))}
    </div>
  );
};

export default SingleBoard;
