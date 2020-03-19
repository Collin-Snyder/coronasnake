import React, { useState } from "react";
import SnakeBoard from "../scripts/gameboardMaker";
import Square from "./Square.jsx";

const snakeBoard = new SnakeBoard(100, 50);

const Board = () => {
  return (
    <div className="board">
      {snakeBoard.squares.map(s => (
        <Square key={s.id}/>
      ))}
    </div>
  );
};

export default Board;
