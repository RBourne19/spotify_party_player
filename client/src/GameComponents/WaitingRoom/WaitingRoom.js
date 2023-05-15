import React from "react";
import PlayerList from "../Players/PlayerList";
import RoomCode from "./RoomCode";

export default function WaitingRoom({ socket }) {
  return (
    <>
      <div className="waiting_room">
        <div className="lobby_title">Lobby Code</div>
        <RoomCode socket={socket}></RoomCode>
        <div className="lobby_title">Players</div>
        <PlayerList socket={socket}></PlayerList>
      </div>
    </>
  );
}
