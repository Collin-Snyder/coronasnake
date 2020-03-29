import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
  useRef
} from "react";
import { useParams, Redirect } from "react-router-dom";
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
  const [gameId] = useState(useParams().gameId);
  const [newGameId, setNewGameId] = useState("");
  const players = useRef({});
  const [gameStatus, setGameStatus] = useState("starting");
  const [countdown, setCountdown] = useState(3);
  const [results, setResults] = useState({ draw: false, winner: 0, loser: 0 });
  const [directions, setDirections] = useState({ 1: "up", 2: "down" });
  const keypressHandler = useCallback(
    e => {
      console.log("keypress handler running");

      if (![37, 38, 39, 40].includes(e.keyCode) || gameStatus !== "playing")
        return;

      e.preventDefault();

      console.log("keypress handler registers valid arrow key");
      if (
        ([37, 39].includes(e.keyCode) && !lat.includes(directions[player])) ||
        ([38, 40].includes(e.keyCode) && !long.includes(directions[player]))
      ) {
        console.log("keypress registered: ", codes[e.keyCode]);
        setDirections({ ...directions, [player]: codes[e.keyCode] });
        socket.emit("keypress", codes[e.keyCode]);
      }
    },
    [gameStatus, directions]
  );

  // const handleInterval = (game, players, snakes, food) => {
  //   if (game.head1 !== snakes.current.head1)
  //     $(`#${game.head1}`).addClass(`snake ${players.current.color1}`);
  //   if (game.head2 !== snakes.current.head2)
  //     $(`#${game.head2}`).addClass(`snake ${players.current.color2}`);
  //   if (game.tail1 !== snakes.current.tail1)
  //     $(`#${game.tail1}`).removeClass(`snake ${players.current.color1}`);
  //   if (game.tail2 !== snakes.current.tail2)
  //     $(`#${game.tail2}`).removeClass(`snake ${players.current.color2}`);

  //   let newSnakes = {
  //     head1: game.head1,
  //     head2: game.head2,
  //     tail1: game.tail1,
  //     tail2: game.tail2,
  //     length1: game.length1,
  //     length2: game.length2
  //   };

  //   if (game.food1 !== food.current.food1) {
  //     $(`#${food.current.food1}`).removeClass(`food ${players.current.color1}`);
  //     $(`#${game.food1}`).addClass(`food ${players.current.color1}`);
  //   }
  //   if (game.food2 !== food.current.food2) {
  //     $(`#${food.current.food2}`).removeClass(`food ${players.current.color2}`);
  //     $(`#${game.food2}`).addClass(`food ${players.current.color2}`);
  //   }

  //   let newFood = {
  //     food1: game.food1,
  //     food2: game.food2
  //   };

  //   snakes.current = newSnakes;
  //   food.current = newFood;
  // };
  const handleInterval = (diff, players) => {
    if (diff.head1)
      $(`#${diff.head1}`).addClass(`snake ${players.current.color1}`);
    if (diff.head2)
      $(`#${diff.head2}`).addClass(`snake ${players.current.color2}`);
    if (diff.tail1)
      $(`#${diff.tail1}`).removeClass(`snake ${players.current.color1}`);
    if (diff.tail2)
      $(`#${diff.tail2}`).removeClass(`snake ${players.current.color2}`);
    if (diff.food1) {
      $(`#${diff.food1}`).removeClass(`food`);
      $(`#${diff.newfood1}`).addClass(`food ${players.current.color1}`);
    }
    if (diff.food2) {
      $(`#${diff.food2}`).removeClass(`food`);
      $(`#${diff.newfood2}`).addClass(`food ${players.current.color2}`);
    }
    if (diff.size1) {
      players.current.size1 = diff.size1;
    }
    if (diff.size2) {
      players.current.size2 = diff.size2;
    }
  };

  useEffect(() => {
    document.removeEventListener("keydown", keypressHandler);
    document.addEventListener("keydown", keypressHandler);
    return () => {
      document.removeEventListener("keydown", keypressHandler);
    };
  }, [keypressHandler]);

  useEffect(() => {
    socket.on("error", err => {
      console.error(err);
    });

    socket.on("starting countdown", () => {
      setGameStatus("countdown");
    });

    socket.on("countdown", num => {
      setCountdown(num);
    });

    socket.on("start", initialFoodInfo => {
      setGameStatus("playing");
      $(`#${initialFoodInfo.food1}`).addClass(`food ${players.current.color1}`);
      $(`#${initialFoodInfo.food2}`).addClass(`food ${players.current.color2}`);
      socket.emit("begin movement");
    });

    socket.on("interval", gameDiff => {
      handleInterval(gameDiff, players);
    });

    socket.on("game over", data => {
      setResults(data);
      setGameStatus("over");
    });

    socket.on("game ended", () => {
      setGameStatus("over");
    });

    socket.on("join new game", newGameId => {
      socket.emit("joined new game", newGameId);
    });

    socket.on("new game ready", newGameId => {
      setNewGameId(newGameId);
    });
  }, [players, setNewGameId]);

  useEffect(() => {
    axios
      .get(`/games/${gameId}`)
      .then(data => {
        let gameInfo = data.data;
        let playerInfo = {
          name1: gameInfo.name1,
          name2: gameInfo.name2,
          color1: gameInfo.color1,
          color2: gameInfo.color2,
          size1: 4,
          size2: 4
        };
        players.current = playerInfo;
      })
      .then(data => socket.emit("game starting", gameId))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="gameModule flexRow">
      <div className="playerInfo one flexCol">
        <h3>{players.current.name1}</h3>
        <h1>{players.current.size1}</h1>
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
          {results.draw ? (
            <h2>It's a draw.</h2>
          ) : (
            <h2>Winner: {players.current[`name${results.winner}`]}</h2>
          )}

          <h3>
            {players.current.name1}'s Snake Length:{" "}
            <strong>{players.current.size1}</strong>
          </h3>
          <h3>
            {players.current.name2}'s Snake Length:{" "}
            <strong>{players.current.size2}</strong>
          </h3>
          <button
            onClick={() => {
              socket.emit("play again");
            }}
          >
            Play again?
          </button>
        </div>
        {board.squares.map(s => (
          <Square id={s.id} key={s.id} />
        ))}
      </div>
      <div className="playerInfo two flexCol">
        <h3>{players.current.name2}</h3>
        <h1>{players.current.size2}</h1>
      </div>
      {newGameId ? <Redirect to={`/multiplayer/${newGameId}`} /> : <></>}
    </div>
  );
};

export default MultiBoard;
