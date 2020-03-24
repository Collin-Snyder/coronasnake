import React, { useState, useEffect, useContext, useCallback } from "react";
import { useParams } from "react-router-dom";
import $ from "jquery";
import axios from "axios";
import SnakeBoard from "../scripts/gameboardMaker";
import Square from "./Square.jsx";
import { Socket } from "../App.jsx";
import { PlayerContext } from "../contexts/PlayerContext";
import { newFood } from "../scripts/movement.js";

const board = new SnakeBoard(50, 50);
const codes = { 37: "left", 38: "up", 39: "right", 40: "down" };
const lat = ["right", "left"];
const long = ["up", "down"];

const MultiBoard = () => {
  const socket = useContext(Socket);
  const { player } = useContext(PlayerContext);
  const [gameId, setGameId] = useState(useParams().gameId);
  const [players, setPlayers] = useState({});
  const [snakes, setSnakes] = useState({});
  const [food, setFood] = useState({});
  const [gameStatus, setGameStatus] = useState("starting");
  const [countdown, setCountdown] = useState(3);
  const [results, setResults] = useState({ winner: 0, loser: 0 });
  const [directions, setDirections] = useState({1: "up", 2: "down"})
  const keypressHandler = useCallback(e => {
    console.log("keypress handler running")
    if (![37, 38, 39, 40].includes(e.keyCode) || gameStatus !== "playing") return;

    e.preventDefault();

    console.log("keypress handler registers valid arrow key")
    if (
      ([37, 39].includes(e.keyCode) && !lat.includes(directions[player])) ||
      ([38, 40].includes(e.keyCode) && !long.includes(directions[player]))
    ) {
      console.log("keypress registered: ", codes[e.keyCode])
      setDirections({...directions, [player]: codes[e.keyCode]});
      socket.emit("keypress", codes[e.keyCode]);
    }
  }, [gameStatus])

  useEffect(() => {
    document.addEventListener("keydown", keypressHandler);

    socket.on("starting countdown", () => {
      setGameStatus("countdown");
    });

    socket.on("countdown", num => {
      setCountdown(num);
    });

    socket.on("start", () => {
      setGameStatus("playing");
      socket.emit("begin movement");
      // setTimeout(() => {socket.emit("stop")}, 1000)
    });

    socket.on("interval", game => {
      if (game.head1 !== snakes.head1)
        $(`#${game.head1}`).addClass(`snake ${players.color1}`);
      if (game.head2 !== snakes.head2)
        $(`#${game.head2}`).addClass(`snake ${players.color2}`);
      if (game.tail1 !== snakes.tail1)
        $(`#${game.tail1}`).removeClass(`snake ${players.color1}`);
      if (game.tail2 !== snakes.tail2)
        $(`#${game.tail2}`).removeClass(`snake ${players.color2}`);

      let newSnakes = {
        head1: game.head1,
        head2: game.head2,
        tail1: game.tail1,
        tail2: game.tail2,
        length1: game.length1,
        length2: game.length2
      };

      if (game.food1 !== food.food1) {
        $(`#${food.food1}`).removeClass(`food ${players.color1}`);
        $(`#${game.food1}`).addClass(`food ${players.color1}`);
      }
      if (game.food2 !== food.food2) {
        $(`#${food.food2}`).removeClass(`food ${players.color2}`);
        $(`#${game.food2}`).addClass(`food ${players.color2}`);
      }

      let newFood = {
        food1: game.food1,
        food2: game.food2
      };

      setSnakes(newSnakes);
      setFood(newFood);

      return () => {document.removeEventListener("keydown", keypressHandler)}
    });

    socket.on("game over", data => {
      console.log("receiving game over");
      setResults(data);
      setGameStatus("over");
    });

    socket.on("game ended", () => {
      console.log("receiving game ended");
      setGameStatus("over");
    });
  }, [players]);

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

  return (
    <div className="gameModule flexRow">
      <div className="playerInfo one flexCol">
        <h3>{players.name1}</h3>
        <h1>{snakes.length1}</h1>
      </div>
      <div className="board">
        <div
          className="getready flexCol"
          style={{ display: gameStatus === "starting" ? "flex" : "none" }}
        >
          <h1>Get Ready</h1>
        </div>
        <div
          className="countdown flexCol"
          style={{ display: gameStatus === "countdown" ? "flex" : "none" }}
        >
          <h1>{countdown}</h1>
        </div>
        <div
          className="gameover flexCol"
          style={{ display: gameStatus === "over" ? "flex" : "none" }}
        >
          <h1>GAME OVER</h1>
          <h2>Winner: {players[`name${results.winner}`]}</h2>
          <h3>
            {players.name1}'s Snake Length: <strong>{snakes.length1}</strong>
          </h3>
          <h3>
            {players.name2}'s Snake Length: <strong>{snakes.length2}</strong>
          </h3>
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
