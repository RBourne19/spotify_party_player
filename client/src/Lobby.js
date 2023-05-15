import React, { useState, useEffect, useRef } from "react";

import HostSettings from "./GameComponents/Host/HostSettings";

import WaitingRoom from "./GameComponents/WaitingRoom/WaitingRoom";

import Game from "./GameComponents/Game";

import "./CSS/Game.css";

function Lobby({ socket }) {
  const [gameStart, setGameStart] = useState(false);
  const [gameSettings, setGameSettings] = useState();
  const host_id = localStorage.getItem("host_id");

  useEffect(() => {
    socket.on("game:start", (settings) => {
      setGameSettings(settings);
      setGameStart(true);
    });
    socket.on("game:end", (msg) => {
      setGameStart(false);
    });

    return () => {
      socket.off("game:start");
      socket.off("game:end");
    };
  }, []);

  return (
    <>
      {host_id && !gameStart && <HostSettings socket={socket} />}
      {!gameStart && <WaitingRoom socket={socket} />}

      {gameStart && <Game socket={socket} settings={gameSettings} />}
    </>
  );
}

export default Lobby;
