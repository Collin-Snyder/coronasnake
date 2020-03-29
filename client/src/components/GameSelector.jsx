import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Socket } from "../App.jsx";
import { PlayerContext } from "../contexts/PlayerContext";

const GameSelector = () => {
  const socket = useContext(Socket);
  const { player, setPlayer } = useContext(PlayerContext);
  const [gameList, setGameList] = useState([]);

  useEffect(() => {
    axios.get("/games").then(data => {
      setGameList(data.data.filter(g => g.name1 && g.color1));
    });

    socket.on("new game available", (gameInfo) => {
      setGameList([...gameList, gameInfo]);
    })
  }, []);

  return (
    <div className="gameSelector flexCol">
      <h2>Open Games</h2>
      {gameList.length ? (
        <ul className="gameList flexCol">
          {gameList.map((g, i) => (
            <Link to={`/waitingRoom/${g.id}`} key={i}>
              <li
                className="gameListItem"
                id={g.id}
                onClick={() => {
                  setPlayer(2);
                }}
                key={i}
              >
                <span className={`colorIcon ${g.color1}`}></span>
                <div className="gameInfo">
                  <h3 className="gameName">Game with {g.name1}</h3>
                  <p>Created at {g.createdAt.toLocaleString()}</p>
                </div>
              </li>
            </Link>
          ))}
        </ul>
      ) : (
        <div className="flexCol">
          <h3>No games currently open.</h3>
          <Link to="/waitingRoom/0">
            <button
              onClick={() => {
                setPlayer(1);
              }}
            >
              Start a game
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default GameSelector;
