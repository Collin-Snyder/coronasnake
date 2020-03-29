import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { PlayerContext } from "../contexts/PlayerContext";

const Home = () => {
  const { player, setPlayer } = useContext(PlayerContext);
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
        <Link to="/waitingroom/0">
          <button
            onClick={() => {
              setPlayer(1);
              setMultiOpen(false);
            }}
          >
            Start New Game
          </button>
        </Link>
        <Link to="/gamelist">
          <button onClick={() => setMultiOpen(false)}>
            Join Existing Game
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
