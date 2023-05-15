import React, { useState, useEffect, useRef } from "react";
import Countdown from "react-countdown";
import "../../CSS/Timer.css";
const { v4: uuidv4 } = require("uuid");

export default function Timer({ socket, roundTime, totalRounds }) {
  const [time, setTime] = useState(Date.now() + roundTime * 1000);
  const rounds = useRef(1);
  useEffect(() => {
    socket.on("game:roundstart", (data) => {
      //set time
      rounds.current += 1;
      setTimeout(() => {
        setTime(Date.now() + roundTime * 1000);
      }, 3000);
    });
    socket.on();
    return () => {};
  }, [socket, roundTime]);

  function endRound() {
    if (localStorage.getItem("host_id")) {
      socket.emit("game:endround");
    }
  }

  const renderer = ({ minutes, seconds }) => {
    return <span>{60 * minutes + seconds}</span>;
  };

  return (
    <>
      <div className="stats_container">
        <div className="timer_container">
          <div>Time Left</div>
          {roundTime && (
            <Countdown
              key={uuidv4()}
              date={time}
              renderer={renderer}
              onComplete={endRound}
            ></Countdown>
          )}
        </div>
        <div className="round_container">
          <div>Rounds</div>
          <div>
            {rounds.current}/{totalRounds}
          </div>
        </div>
      </div>
    </>
  );
}
