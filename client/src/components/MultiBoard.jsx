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

      if (![37, 38, 39, 40].includes(e.keyCode) || gameStatus !== "playing")
        return;

      e.preventDefault();

      if (
        ([37, 39].includes(e.keyCode) && !lat.includes(directions[player])) ||
        ([38, 40].includes(e.keyCode) && !long.includes(directions[player]))
      ) {
        setDirections({ ...directions, [player]: codes[e.keyCode] });
        socket.emit("keypress", codes[e.keyCode]);
      }
    },
    [gameStatus, directions]
  );

  const handleInterval = (diff, players) => {
    $(`#${diff.newHead1}`).addClass(
      `snake head ${diff.direction1} ${players.current.color1}`
    );
    $(`#${diff.oldHead1}`).removeClass("head up left down right");
    $(`#${diff.oldHead1}`).addClass(
      `${diff.oldHeadNextDir1} ${diff.oldHeadPrevDir1}`
    );
    $(`#${diff.newHead2}`).addClass(
      `snake head ${diff.direction2} ${players.current.color2}`
    );
    $(`#${diff.oldHead2}`).removeClass("head up left down right");
    $(`#${diff.oldHead2}`).addClass(
      `${diff.oldHeadNextDir2} ${diff.oldHeadPrevDir2}`
    );

    if (diff.move1 === "move") {
      $(`#${diff.oldTail1}`).removeClass(
        `snake tail down left right up ${players.current.color1}`
      );
      $(`#${diff.newTail1}`).removeClass("down left right up");
      $(`#${diff.newTail1}`).addClass(`tail ${diff.newTailNextDir1}`);
    } else if (diff.move1 === "eat") {
      $(`#${diff.oldFood1}`).removeClass(`food`);
      $(`#${diff.newFood1}`).addClass(`food ${players.current.color1}`);
      players.current.size1 = diff.size1;
    }

    if (diff.move2 === "move") {
      $(`#${diff.oldTail2}`).removeClass(
        `snake tail down left right up ${players.current.color2}`
      );
      $(`#${diff.newTail2}`).removeClass("down left right up");
      $(`#${diff.newTail2}`).addClass(`tail ${diff.newTailNextDir2}`);
      
    } else if (diff.move2 === "eat") {
      $(`#${diff.oldFood2}`).removeClass(`food`);
      $(`#${diff.newFood2}`).addClass(`food ${players.current.color2}`);
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

    socket.on("snake", snakes => {
      console.log(snakes);
    }) 

    socket.on("game over", data => {
      console.log("receiving game over event")
      setResults(data);
      setGameStatus("over");
    });

    socket.on("game ended", () => {
      console.log("receiving game ended event")
      setGameStatus("ended");
    });

    socket.on("join new game", newGameId => {
      socket.emit("joined new game", newGameId);
    });

    socket.on("new game ready", newGameId => {
      setNewGameId(newGameId);
    });

    return () => {socket.emit("disconnect")}
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
    <div className="gameModule flex">
      <div className="playerInfo one flexCol">
        <h3>{players.current.name1}</h3>
        <h1>{players.current.size1}</h1>
      </div>
      <div className="boardContainer flex">
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
            style={{ display: gameStatus === "over" || gameStatus === "ended" ? "flex" : "none" }}
          >
            {gameStatus === "over" ? <h1>GAME OVER</h1> : <h1>Game ended.</h1>} 
            {results.draw ? (
              <h2>It's a draw.</h2>
            ) : (
              <h2>Winner: {players.current[`name${results.winner}`]}</h2>
            )}
            <h3 className="snakeLength">
              {players.current.name1}'s Snake Length:{" "}
              <strong>{players.current.size1}</strong>
            </h3>
            <h3 className="snakeLength">
              {players.current.name2}'s Snake Length:{" "}
              <strong>{players.current.size2}</strong>
            </h3>
            <button
            style={{display: gameStatus === "over" ? "block" : "none"}}
              onClick={() => {
                socket.emit("play again");
              }}
            >
              Play again?
            </button>
            <a href="https://coronasnake.onrender.com/">
            {/* <a href="http://localhost:4000"> */}
              <div className="homebutton gohome">
                <p className="buttonTitle">Home</p>
              </div>
            </a>
          </div>
          {board.squares.map(s => (
            <Square id={s.id} key={s.id} />
          ))}
        </div>
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
