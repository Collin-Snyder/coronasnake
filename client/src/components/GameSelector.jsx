import React, { useState } from "react";
import { Link } from "react-router-dom";

const GameSelector = () => {
  const [gameList, setGameList] = useState([]);

  return (
    <div className="gameSelector flexCol">
      <h2>Open Games</h2>
      {gameList.length ? (
        <ul className="gameList flexCol">
          {gameList.map((g, i) => (
            <li className="gameListItem" key={i}>
              <span className={`colorIcon ${g.playerColor}`}></span>
              <h3 className="gameName">Game with {g.playerName}</h3>
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
