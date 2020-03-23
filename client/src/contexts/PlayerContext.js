import React, { createContext, useState, useEffect } from "react";

export const PlayerContext = createContext({ player: 0, setPlayer: () => {} });

const PlayerProvider = ({ children }) => {
  const setPlayer = p => {
    updatePlayer(prevPlayer => {
      return { ...prevPlayer, player: p };
    });
  };

  const playerState = {
    player: 0,
    setPlayer
  };

  const [playerInfo, updatePlayer] = useState(playerState);

  return (
    <PlayerContext.Provider value={playerInfo}>
      {children}
    </PlayerContext.Provider>
  );
};

export default PlayerProvider;
