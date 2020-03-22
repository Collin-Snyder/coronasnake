import React, { useState } from "react";
import { Link } from "react-router-dom";

const Home = () => {
  const [multiOpen, setMultiOpen] = useState(false);

  return (
    <div className="homeMenu">
      <Link to="/singleplayer">
        <button>Single Player</button>
      </Link>
      <button onClick={() => setMultiOpen(!multiOpen)}>Multi Player</button>
      <div
        className="multiplayerMenu"
        style={{ display: multiOpen ? "flex" : "none" }}
      >
        <Link to="/waitingroom">
          <button onClick={() => setMultiOpen(false)}>Start New Game</button>
        </Link>
        <button>Join Existing Game</button>
      </div>
    </div>
  );
};

export default Home;
