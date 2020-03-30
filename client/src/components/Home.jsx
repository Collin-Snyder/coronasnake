import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { PlayerContext } from "../contexts/PlayerContext";

const Home = () => {
  const { player, setPlayer } = useContext(PlayerContext);
  // const [multiOpen, setMultiOpen] = useState(false);

  return (
    <div className="homeMenu flexCol">
      <div className="logoContainer flex">
        <i className="logo"></i>
      </div>
      <Link to="/singleplayer" className="flex">
        <div className="homebutton single">
          <p className="buttonTitle">Single Player</p>
        </div>
      </Link>
      {/* <button onClick={() => setMultiOpen(!multiOpen)}>Multi Player</button> */}
      {/* <div
        className="multiplayerMenu flexCol"
        style={{ display: multiOpen ? "flex" : "none" }}
      > */}
      <Link to="/waitingroom/0" className="flex">
        <div
          className="homebutton newgame"
          onClick={() => {
            setPlayer(1);
            setMultiOpen(false);
          }}
        >
          <p className="buttonTitle">Start Multiplayer Game</p>
        </div>
      </Link>
      <Link to="/gamelist" className="flex">
        <div className="homebutton joingame" onClick={() => setMultiOpen(false)}>
          <p className="buttonTitle">Join Existing Game</p>
        </div>
      </Link>
      {/* </div> */}
    </div>
  );
};

export default Home;
