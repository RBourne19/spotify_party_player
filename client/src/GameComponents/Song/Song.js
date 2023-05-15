import React, { useEffect, useRef, useState } from "react";

export default function Song({ song, socket, likeable }) {
  const [likedState, setLikedState] = useState(song.liked);

  function likeSong() {
    if (likeable && song.liked === false && likedState === false) {
      setLikedState(true);
      song.liked = true;

      socket.emit("game:song:upvote", song.id);
    }
  }

  return (
    <>
      <div
        id={song.uri}
        onClick={() => likeSong()}
        className="player_song_container"
        style={{ color: song.liked ? "#1ed780" : "black" }}
      >
        <img src={song.img} className="player_song_img" />
        <div className="song_text_container">
          <div className="song_name">{song.name}</div>
          <div className="player_song_artist">{song.artist}</div>
        </div>
        <div className="song_time">{song.time}</div>
      </div>
    </>
  );
}
