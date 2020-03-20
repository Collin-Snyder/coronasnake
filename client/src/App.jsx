import React from "react";
import "./styles/main.css";
import Board from "./components/Board.jsx";
import io from "socket.io-client";

const socket = io("localhost:4000");

socket.on("test response", msg =>
  document.getElementById("app").append(msg)
);

const App = () => {
  return (
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
  );
};

export default App;
