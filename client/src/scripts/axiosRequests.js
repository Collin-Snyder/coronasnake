import axios from "axios";

export const startNewGame = (gameInfo) => axios.post("/games", {gameInfo});