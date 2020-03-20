import React, { useState, useEffect, useCallback } from "react";
import $ from "jquery";
import SnakeBoard from "../scripts/gameboardMaker";
import Snake from "../scripts/snake";
import { checkNextMove, newFood } from "../scripts/movement";
import { usePrev, useInterval } from "../customHooks";
import Square from "./Square.jsx";
// document.addEventListener("keydown", keypressHandler);

const board = new SnakeBoard(50, 50);
const snake = new Snake([13, 38, 63, 88]);

// document.addEventListener("keyup", () => {firing = false})

// document.addEventListener("keydown", (event) => {keypressHandler(event, )});

const Board = () => {
  const [food, setFood] = useState(newFood(board, snake));
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
  const keypressHandler = e => {
    if (![37, 38, 39, 40].includes(e.keyCode)) return;

    e.preventDefault();
    console.log("Keypress recognized as valid key: ", e.keyCode)

    const codes = { 37: "left", 38: "up", 39: "right", 40: "down" };
    const lat = ["right", "left"];
    const long = ["up", "down"];

    console.log("directions[0]: ", directions[0]);

    if (
      ([37, 39].includes(e.keyCode) && !lat.includes(directions[0])) ||
      ([38, 40].includes(e.keyCode) && !long.includes(directions[0]))
    ) {
      console.log("keypress handler running: ", codes[e.keyCode]);
      let newDirections = [...directions];
      newDirections.push(codes[e.keyCode]);
      console.log("new directions after adding new direction: ", newDirections)
      setDirections(newDirections);
    }
  };

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

  const oldFood = usePrev(food);

  useEffect(() => {
    if (food) document.getElementById(food).classList.add("food");
    if (oldFood) document.getElementById(oldFood).classList.remove("food");
  }, [food]);

  useEffect(() => {
    document.addEventListener("keydown", keypressHandler);
  }, []);

  return (
    <div className="board">
      {gameOver ? (
        <div className="gameover">
          <h1>YOU LOSE</h1>
          <button>Play again?</button>
        </div>
      ) : (
        board.squares.map(s => <Square id={s.id} key={s.id} />)
      )}
    </div>
  );
};

export default Board;
