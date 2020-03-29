import React, { useState, useEffect, useContext } from "react";
import {browserHistory} from "react-router"
import { Redirect, useParams, Link } from "react-router-dom";
import $ from "jquery";
import axios from "axios";
import { Socket } from "../App.jsx";
import { PlayerContext } from "../contexts/PlayerContext";

const colorOptions = ["yellow", "green", "pink", "blue", "red"];

const filterColors = (arr, color) => {
  return [...arr].filter(c => c === color);
};

const removeColor = (arr, color) => {
  return [...arr].filter(c => c !== color);
};

const WaitingRoom = () => {
  const socket = useContext(Socket);
  const id = useParams().gameId.length > 1 ? useParams().gameId : 0;
  const { player, setPlayer } = useContext(PlayerContext);
  const [gameId, setGameId] = useState(id);
  const [colors, setColors] = useState([]);
  const [nameValue, setNameValue] = useState("");
  const [nameReady, setNameReady] = useState(false);
  const [colorReady, setColorReady] = useState(false);
  const [gameReady, setGameReady] = useState(false);

  useEffect(() => {
    socket.on("player 1 confirmation", data => {
      console.log("player 1 confirmed!");
    });
  
    socket.on("player 2 confirmation", data => {
      console.log("player 2 confirmed!");
      setGameReady(true);
    });

  }, [])


  useEffect(() => {
    //if new game, automatically create a new game and store the gameId
    if (player === 1) {
      axios
        .post("/games", { createdAt: new Date() })
        .then(data => {
          socket.emit("new game", data.data);
          setGameId(data.data);
          setColors(colorOptions);
          console.log(data);
        })
        .catch(err => console.error(err));
    } else if (player === 2) {
      //otherwise if player 2, associate with existing game based on id
      axios
        .get(`/games/${gameId}`)
        .then(data => {
          console.log(data);
          setColors(removeColor(colorOptions, data.data.color1));
          socket.emit("player joining", data.data.id);
        })
        .catch(err => console.error(err));
    } else {
      console.log(`${player} is not a valid player number.`);
    }
  }, []);

  useEffect(() => {
    $("#nameInput").on("keyup", e => {
      if (e.keyCode === 13) {
        e.preventDefault();
        document.getElementById("nameSubmit").click();
      }
    });
  }, []);

  useEffect(() => {
    if (nameReady && colorReady)
      socket.emit("player ready", {
        [`name${player}`]: nameValue,
        [`color${player}`]: colors[0]
      });
  }, [nameReady, colorReady]);

  return (
    <div className="waitingRoom flexCol">
      {nameReady ? (
        <></>
      ) : (
        <div className="nameForm">
          <label htmlFor="nameInput">Enter your name:</label>
          <input
            id="nameInput"
            name="nameInput"
            type="text"
            value={nameValue}
            onChange={e => setNameValue(e.target.value)}
          />
          <button
            id="nameSubmit"
            onClick={e => {
              if (nameValue) setNameReady(true);
            }}
          >
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
        {colorReady && nameReady && player === 1 ? (
          <h2>Waiting for opponent...</h2>
        ) : colorReady && nameReady && player === 2 ? (
          <h2>Loading game...</h2>
        ) : (
          <></>
        )}
        {gameReady ? <Redirect to={`/multiplayer/${gameId}`} /> : <></>}
      </div>
    </div>
  );
};

export default WaitingRoom;
