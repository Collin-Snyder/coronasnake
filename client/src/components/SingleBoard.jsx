import React, {
  useState,
  useEffect,
  useCallback,
  useContext,
  useRef
} from "react";
import $ from "jquery";
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
  gameCB(state => 0);
};



const SingleBoard = () => {
  const [food, setFood] = useState(newFood(board, snake));
  const oldFood = usePrev(food);
  const [directions, setDirections] = useState(["down"]);
  const [length, setLength] = useState(4);
  const [gameOver, setGameOver] = useState(0);
  // const gameOver = useRef(false);
  // const moveSnake = useCallback(() => {
  //   let direction = directions[0];
  //   let next = board.get(snake.head.id).borders[direction];

  //   let move = checkNextMove(next, food);

  //   switch (move) {
  //     case "lose":
  //       setGameOver(state => true);
  //       return false;
  //     case "eat":
  //       $(`#${snake.head.id}`).removeClass("head left right up down");
  //       $(`#${snake.head.id}`).addClass(direction);
  //       snake.eat(next.id, direction);
  //       setLength(snake.size);
  //       setFood(newFood(board));
  //       break;
  //     case "move":
  //       board.set(snake.tail.id, "snake", false);
  //       $(`#${snake.tail.id}`).removeClass(
  //         "snake tail down left right up undefined"
  //       );
  //       let dirs = snake.move(next.id, direction);
  //       $(`#${snake.tail.id}`).removeClass("down left right up");
  //       $(`#${snake.tail.id}`).addClass(`tail ${dirs.nextTailDir}`);
  //   }

  //   board.set(snake.head.id, "snake", true);
  //   $(`#${snake.head.id}`).addClass(`snake head ${direction}`);
  //   $(`#${snake.head.tailward.id}`).removeClass("head up left down right");
  //   $(`#${snake.head.tailward.id}`).addClass(
  //     `${snake.head.tailward.nextDir} ${snake.head.tailward.prevDir}`
  //   );
  //   return true;
  // }, [directions]);
  let moveSnake = () => {
    let direction = directions[0];
    let next = board.get(snake.head.id).borders[direction];

    let move = checkNextMove(next, food);

    switch (move) {
      case "lose":
        setGameOver(go => go + 1);
        return false;
      case "eat":
        $(`#${snake.head.id}`).removeClass("head left right up down");
        $(`#${snake.head.id}`).addClass(direction);
        snake.eat(next.id, direction);
        setLength(snake.size);
        setFood(newFood(board));
        break;
      case "move":
        board.set(snake.tail.id, "snake", false);
        $(`#${snake.tail.id}`).removeClass(
          "snake tail down left right up undefined"
        );
        let dirs = snake.move(next.id, direction);
        $(`#${snake.tail.id}`).removeClass("down left right up");
        $(`#${snake.tail.id}`).addClass(`tail ${dirs.nextTailDir}`);
    }

    board.set(snake.head.id, "snake", true);
    $(`#${snake.head.id}`).addClass(`snake head ${direction}`);
    $(`#${snake.head.tailward.id}`).removeClass("head up left down right");
    $(`#${snake.head.tailward.id}`).addClass(
      `${snake.head.tailward.nextDir} ${snake.head.tailward.prevDir}`
    );
    return true;
  }
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

  useEffect(() => {
    setGameOver(go => go++);
  }, [gameOver])
  return (
    <div className="board">
      <div
        className="gameover flexCol"
        style={{ display: gameOver ? "flex" : "none" }}
      >
        <h1>GAME OVER</h1>
        <h3 className="snakeLength">Length: {length}</h3>
        <div
          className="homebutton playagain"
          onClick={() => {
            reset(setDirections, setFood, setGameOver);
          }}
        >
          <p className="buttonTitle">Play again?</p>
        </div>
        <a href="http://localhost:4000/">
          <div
            className="homebutton gohome"
            onClick={() => {
              reset(setDirections, setFood, setGameOver);
            }}
          >
            <p className="buttonTitle">Home</p>
          </div>
        </a>
      </div>
      {board.squares.map(s => (
        <Square id={s.id} key={s.id} />
      ))}
    </div>
  );
};

export default SingleBoard;
