import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Home = () => {
  const [multiOpen, setMultiOpen] = useState(false);

  return (
    <div className="homeMenu flexCol">
      <Link to="/singleplayer">
        <button>Single Player</button>
      </Link>
      <button onClick={() => setMultiOpen(!multiOpen)}>Multi Player</button>
      <div
        className="multiplayerMenu flexCol"
        style={{ display: multiOpen ? "flex" : "none" }}
      >
        <Link to="/waitingroom">
          <button onClick={() => {
              setMultiOpen(false);
              
              }}>Start New Game</button>
        </Link>
        <Link to="/gamelist">
          <button onClick={() => setMultiOpen(false)}>Join Existing Game</button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
