import React, { createContext } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./styles/main.css";
import PlayerProvider from "./contexts/PlayerContext";
import Home from "./components/Home.jsx";
import SingleBoard from "./components/SingleBoard.jsx";
import MultiBoard from "./components/MultiBoard.jsx";
import WaitingRoom from "./components/WaitingRoom.jsx";
import GameSelector from "./components/GameSelector.jsx";
import io from "socket.io-client";

// const socket = io("https://coronasnake.herokuapp.com/");
const socket = io("localhost:4000");
export const Socket = createContext();

const App = () => {
  return (
    <Socket.Provider value={socket}>
      <Router>
        <div id="app" className="flexCol">
          <h1>Snake</h1>
          <Switch>
            <Route exact path="/">
              <PlayerProvider>
                <Home />
              </PlayerProvider>
            </Route>
            <Route path="/singleplayer">
              <SingleBoard />
            </Route>
            <Route
              path="/multiplayer/:gameId"
              render={() => (
                <PlayerProvider>
                  <MultiBoard key={(() => Math.random())()} />
                </PlayerProvider>
              )}
            ></Route>
            <Route path="/waitingroom/:gameId">
              <PlayerProvider>
                <WaitingRoom />
              </PlayerProvider>
            </Route>
            <Route path="/gamelist">
              <PlayerProvider>
                <GameSelector />
              </PlayerProvider>
            </Route>
          </Switch>
        </div>
      </Router>
    </Socket.Provider>
  );
};

export default App;
