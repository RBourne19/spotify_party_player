import React, { useState, useEffect, useRef } from "react";
import Slider from "@mui/material/Slider";
import "../../CSS/Host.css";

export default function HostSettings({ socket }) {
  const [rounds, setRounds] = useState(10);
  const [time, setTime] = useState(60);

  function timeSet(e, data) {
    setTime(data);
  }
  function roundSet(e, data) {
    setRounds(data);
  }
  function startGame() {
    const settings = { roundTime: time, rounds: rounds };
    socket.emit("game:start", settings);
  }

  return (
    <>
      <div className="settings_container">
        <div className="host_title">Seconds</div>
        <div>
          <Slider
            defaultValue={60}
            aria-label="Default"
            size="medium"
            valueLabelDisplay="auto"
            sx={{
              width: 250,
              color: "green",
            }}
            min={10}
            max={90}
            onChangeCommitted={timeSet}
          />
          <div className="host_title">Rounds</div>
          <Slider
            defaultValue={10}
            aria-label="Default"
            size="medium"
            valueLabelDisplay="auto"
            sx={{
              width: 250,
              color: "green",
            }}
            min={5}
            max={20}
            onChangeCommitted={roundSet}
          />
        </div>
        <button className="start_button" onClick={startGame}>
          Start Game
        </button>
      </div>
    </>
  );
}
