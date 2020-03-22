import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Socket } from "../App.jsx";

const GameSelector = () => {
  const socket = useContext(Socket);
  const [gameList, setGameList] = useState([]);

  useEffect(() => {
    axios.get("/games")
    .then(data => {console.log(data); setGameList(data.data)});
  }, []);

  return (
    <div className="gameSelector flexCol">
      <h2>Open Games</h2>
      {gameList.length ? (
        <ul className="gameList flexCol">
          {gameList.map((g, i) => (
            <li className="gameListItem" id={g.id} key={i}>
              <span className={`colorIcon ${g.color1}`}></span>
              <h3 className="gameName">Game with {g.name1}</h3>
            </li>
          ))}
        </ul>
      ) : (
        <div className="flexCol">
          <h3>No games currently open.</h3>
          <Link to="/waitingRoom">
            <button>Start a game</button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default GameSelector;
