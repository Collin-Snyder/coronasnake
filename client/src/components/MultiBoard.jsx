import React, { useState, useEffect } from "react";
import {useParams} from "react-router-dom"
import $ from "jquery";
import SnakeBoard from "../scripts/gameboardMaker";
import Square from "./Square.jsx";
import { Socket } from "../App.jsx";
import { newFood } from "../scripts/movement.js";

const board = new SnakeBoard(50, 50);

const MultiBoard = () => {
  const socket = useContext(Socket);
  const [gameId, setGameId] = useState(useParams().gameId);

  useEffect(() => {
    console.log(gameId);
  }, [])

  //   const [snake1, setSnake1] = useState({});
  //   const [snake2, setSnake2] = useState({});
  //   const [food1, setFood1] = useState(0);
  //   const [food2, setFood2] = useState(0);

  //     socket.on("snake1", () => {});
  //     socket.on("food1", () => {});
  //     socket.on("snake2", () => {});
  //     socket.on("food2", () => {});

//   const [p1, setP1] = useState({ head: null, tail: null, food: 0 });
//   const [p2, setP2] = useState({ head: null, tail: null, food: 0 });

//   socket.on("interval", data => {
//     let player1 = { ...p1 };
//     let player2 = { ...p2 };

//     player1.head = data.head1;
//     player2.head = data.head2;
//     $(`#${player1.head}`).addClass("snake", "one");
//     $(`#${player2.head}`).addClass("snake", "two");

//     if (data.tail1 !== player1.tail) {
//       $(`#${player2.tail}`).removeClass("snake", "one");
//       player1.tail = data.tail1;
//     }
//     if (data.tail2 !== player2.tail) {
//       $(`#${player2.tail}`).removeClass("snake", "two");
//       player2.tail = data.tail2;
//     }

//     if (data.food1 !== player1.food) {
//       $(`#${player1.food}`).removeClass("food", "one");
//       player1.food = data.food1;
//       $(`#${player1.food}`).addClass("food", "one");
//     }
//     if (data.food2 !== player2.food) {
//       $(`#${player2.food}`).removeClass("food", "two");
//       player2.food = data.food2;
//       $(`#${player2.food}`).addClass("food", "two");
//     }

//     setP1(player1);
//     setP2(player2);
//   });

  return (
    <div className="board">
      {board.squares.map(s => (
        <Square id={s.id} key={s.id} />
      ))}
    </div>
  );
};

export default MultiBoard;
