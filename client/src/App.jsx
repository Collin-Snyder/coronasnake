import React, { createContext } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./styles/main.css";
import SingleBoard from "./components/SingleBoard.jsx";
import io from "socket.io-client";

const socket = io("localhost:4000");
console.log(socket);

socket.on("test response", msg => document.getElementById("app").append(msg));
export const Socket = createContext();

const App = () => {
  return (
    <Router>
      <div id="app">
        <h1>Snake</h1>
        <Switch>
          <Route path="/"><SingleBoard /></Route>
          <Route path="/singleplayer">
            <SingleBoard />
          </Route>
          <Route path="/multiplayer">
            <Socket.Provider value={socket}>
              <SingleBoard />
              <button
                onClick={() => {
                  socket.emit("test", "Greetings, I come from the client.");
                }}
              >
                Socket Test!
              </button>
            </Socket.Provider>
          </Route>
        </Switch>
      </div>
    </Router>
  );
};

export default App;
