import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import $ from "jquery";
import axios from "axios";
import SnakeBoard from "../scripts/gameboardMaker";
import Square from "./Square.jsx";
import { Socket } from "../App.jsx";
import { PlayerContext } from "../contexts/PlayerContext";
import { newFood } from "../scripts/movement.js";

const board = new SnakeBoard(50, 50);

const MultiBoard = () => {
  const socket = useContext(Socket);
  const { player } = useContext(PlayerContext);
  const [gameId, setGameId] = useState(useParams().gameId);
  const [players, setPlayers] = useState({});
  const [snakes, setSnakes] = useState({});
  const [food, setFood] = useState({});
  const [gameStatus, setGameStatus] = useState("starting");
  const [countdown, setCountdown] = useState(3);

  socket.on("starting countdown", () => {
      setGameStatus("countdown");
  });

  socket.on("countdown", num => {
      setCountdown(num);
  });

  socket.on("start", () => {
      setGameStatus("playing");
  })

  useEffect(() => {
    console.log(gameId);
    axios
      .get(`/games/${gameId}`)
      .then(data => {
        console.log(data.data);
        let gameInfo = data.data;
        let snakeInfo = {
          head1: gameInfo.head1,
          head2: gameInfo.head2,
          tail1: gameInfo.tail1,
          tail2: gameInfo.tail2,
          length1: gameInfo.length1,
          length2: gameInfo.length2
        };
        let foodInfo = {
          food1: gameInfo.food1,
          food2: gameInfo.food2
        };
        let playerInfo = {
          name1: gameInfo.name1,
          name2: gameInfo.name2,
          color1: gameInfo.color1,
          color2: gameInfo.color2
        };
        setPlayers(playerInfo);
        setSnakes(snakeInfo);
        setFood(foodInfo);
      })
      .then(data => socket.emit("game starting", gameId))
      .catch(err => console.error(err));
  }, []);

//   useEffect(() => {
//     setTimeout(() => {
//         setGameStatus("countdown");
//     }, 3000)
//   }, [])

//   useEffect(() => {
//     if (gameStatus === "countdown") {
//         setTimeout(() => {
//             setCountdown(2)
//         }, 1000)
//         setTimeout(() => {
//             setCountdown(1)
//         }, 2000)
//         setTimeout(() => {
//             setCountdown("Go!")
//         }, 3000)
//         setTimeout(() => {
//             setGameStatus("playing");
//             socket.emit("game starting", gameId);
//         }, 4000)
//     }
//   }, [gameStatus])

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
    <div className="gameModule flexRow">
      <div className="playerInfo one flexCol">
        <h3>{players.name1}</h3>
        <h1>{snakes.length1}</h1>
      </div>
      <div className="board">
        <div className="getready flexCol" style={{display: gameStatus === "starting" ? "flex" : "none"}}>
          <h1>Get Ready</h1>
        </div>
        <div className="countdown flexCol" style={{display: gameStatus === "countdown" ? "flex" : "none"}}>
          <h1>{countdown}</h1>
        </div>
        {board.squares.map(s => (
          <Square id={s.id} key={s.id} />
        ))}
      </div>
      <div className="playerInfo two flexCol">
        <h3>{players.name2}</h3>
        <h1>{snakes.length2}</h1>
      </div>
    </div>
  );
};

export default MultiBoard;
