import React from "react";
import "./styles/main.css";
import Board from "./components/Board.jsx";


const App = () => {

  return (
    <div className="app">
      <h1>Snake</h1>
      <Board/>
    </div>
  );
};

export default App;
