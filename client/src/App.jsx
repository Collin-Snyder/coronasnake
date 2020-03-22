import React, { createContext } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./styles/main.css";
import Home from "./components/Home.jsx";
import SingleBoard from "./components/SingleBoard.jsx";
import MultiBoard from "./components/MultiBoard.jsx";
import WaitingRoom from "./components/WaitingRoom.jsx";
import GameSelector from "./components/GameSelector.jsx";
import io from "socket.io-client";

const socket = io("localhost:4000");
console.log(socket);

socket.on("test response", msg => document.getElementById("app").append(msg));
export const Socket = createContext();

const App = () => {
  return (
    <Socket.Provider value={socket}>
      <Router>
        <div id="app" className="flexCol">
          <h1>Snake</h1>
          <Switch>
            <Route path="/singleplayer">
              <SingleBoard />
            </Route>
            <Route path="/multiplayer/:gameId">
              <MultiBoard />
            </Route>
            <Route path="/waitingroom">
              <WaitingRoom />
            </Route>
            <Route path="/gamelist">
              <GameSelector />
            </Route>
            <Route path="/">
              <Home />
            </Route>
          </Switch>
        </div>
      </Router>
    </Socket.Provider>
  );
};

export default App;
