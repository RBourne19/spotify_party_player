import React, { useEffect, useState } from "react";
import playbutton from "../../IMAGES/playbutton_24.png";
export default function Players({ player }) {
  const [time, setTime] = useState("");
  useEffect(() => {
    let minutes = Math.floor(Math.random() * 8 + 1);
    let seconds = Math.floor(Math.random() * 58 + 1);
    if (seconds < 10) {
      seconds = "0" + seconds;
    }
    setTime(minutes + ":" + seconds);
  }, []);
  return (
    <div className="player_container">
      <div className="img_container">
        <img src={playbutton} className="player_img"></img>
      </div>
      <div className="player_name">{player}</div>
      <div className="player_time">{time}</div>
    </div>
  );
}
