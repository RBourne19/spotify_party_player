import React, { useEffect } from "react";
import { useState } from "react";
import Players from "./Players";
const { v4: uuidv4 } = require("uuid");

export default function PlayerList({ socket }) {
  const [players, setPlayers] = useState([]);
  useEffect(() => {
    socket.on("player:update", (data) => {
      setPlayers(data);
    });

    return () => socket.off("player:update");
  }, [socket]);
  return (
    <div className="player_list">
      {players.map((player) => {
        return <Players key={uuidv4()} player={player} />;
      })}
    </div>
  );
}
