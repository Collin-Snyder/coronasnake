import React, { createContext } from "react";
import "./styles/main.css";
import Board from "./components/Board.jsx";
import io from "socket.io-client";

const socket = io("localhost:4000");
console.log(socket);

socket.on("test response", msg => document.getElementById("app").append(msg));
export const Socket = createContext();

const App = () => {
  return (
    <Socket.Provider value={socket}>
      <div id="app">
        <h1>Snake</h1>
        <Board />
        <button
          onClick={() => {
            socket.emit("test", "Greetings, I come from the client.");
          }}
        >
          Socket Test!
        </button>
      </div>
    </Socket.Provider>
  );
};

export default App;
