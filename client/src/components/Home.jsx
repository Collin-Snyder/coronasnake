import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { PlayerContext } from "../contexts/PlayerContext";

const Home = () => {
  const { setPlayer } = useContext(PlayerContext);

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
      <Link to="/waitingroom/0" className="flex">
        <div
          className="homebutton newgame"
          onClick={() => {
            setPlayer(1);
          }}
        >
          <p className="buttonTitle">Start Multiplayer Game</p>
        </div>
      </Link>
      <Link to="/gamelist" className="flex">
        <div className="homebutton joingame">
          <p className="buttonTitle">Join Existing Game</p>
        </div>
      </Link>
    </div>
  );
};

export default Home;
