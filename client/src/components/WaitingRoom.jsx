import React, { useState, useEffect } from "react";
import $ from "jquery";

const filterColors = (arr, color) => {
  return [...arr].filter(c => c === color);
};

const removeColor = (arr, color) => {
  return [...arr].filter(c => c !== color);
};

const WaitingRoom = () => {
  const [colors, setColors] = useState([
    "yellow",
    "green",
    "pink",
    "blue",
    "red"
  ]);
  const [nameValue, setNameValue] = useState("");
  const [nameReady, setNameReady] = useState(false);
  const [colorReady, setColorReady] = useState(false);

  useEffect(() => {
    $("#nameInput").on("keyup", e => {
      if (e.keyCode === 13) {
        e.preventDefault();
        document.getElementById("nameSubmit").click();
      }
    });
  }, []);

  return (
    <div className="waitingRoom">
      {nameReady ? (
        <></>
      ) : (
        <div className="nameForm">
          <input
            id="nameInput"
            type="text"
            value={nameValue}
            onChange={e => setNameValue(e.target.value)}
          />
          <button id="nameSubmit" onClick={e => setNameReady(true)}>
            Submit
          </button>
        </div>
      )}
      {nameReady ? <h2 className="userName">{nameValue}</h2> : <></>}
      <div className="colorSelector">
        {colorReady ? <></> : <h2>Choose your color</h2>}
        <div className="colorOptions">
          {colors.map(c => (
            <div
              className={`colorOption ${c}`}
              id={c}
              onClick={e => {
                setColors(filterColors(colors, e.target.id));
                setColorReady(true);
              }}
              key={c}
            ></div>
          ))}
        </div>
        {colorReady && nameReady ? <h2>Waiting for opponent...</h2> : <></>}
      </div>
    </div>
  );
};

export default WaitingRoom;
