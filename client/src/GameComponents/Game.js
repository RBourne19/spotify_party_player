import React, { useEffect, useState } from "react";
import SongSearchBar from "./Song/SongSearch";
import SongList from "./Song/SongList";
import Timer from "./Players/Timer";
export default function Game({ socket, settings }) {
  return (
    <>
      <Timer
        socket={socket}
        roundTime={settings.roundTime}
        totalRounds={settings.rounds}
      />
      <SongSearchBar socket={socket} />
      <SongList socket={socket} />
    </>
  );
}
