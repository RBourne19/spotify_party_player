import React, { useState, useEffect, useCallback } from "react";
import SongResult from "./SongResult";
import "../../CSS/SongStyle.css";
const { v4: uuidv4 } = require("uuid");
export default function SongSearchBar({ socket }) {
  const [search, setSearch] = useState("");
  const [songs, setSongs] = useState([]);
  const [selected, setSelected] = useState(false);

  function parseSongs(data) {
    const tracks = data.tracks.items;
    let songs = [];
    tracks.forEach((track) => {
      let name = track.name;
      let uri = track.uri;
      let artist = track.album.artists[0].name;
      let img = track.album.images[2].url;
      let time = millisToMinutesAndSeconds(track.duration_ms);
      let song = { name: name, uri: uri, artist: artist, img: img, time: time };

      songs.push(song);
    });

    setSongs(songs);
  }
  function millisToMinutesAndSeconds(millis) {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
  }

  useEffect(() => {
    socket.on("game:roundstart", (data) => {
      //set time

      setTimeout(() => {
        setSelected(false);
      }, 3000);
    });
    socket.on();
    return () => {};
  }, [socket]);

  useEffect(() => {
    const timer = setTimeout(() => {
      let token = localStorage.getItem("basic_auth");
      if (!search) {
        setSongs([]);
        return;
      }
      fetch(
        `https://api.spotify.com/v1/search?q=${search}&type=track&limit=5`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      )
        .then((res) => res.json())
        .then((res) => {
          parseSongs(res);
        });
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);
  useEffect(() => {
    setSearch("");
  }, [selected]);

  return (
    <>
      <div className="search_container">
        <input
          className="search_box"
          type="text"
          placeholder={selected ? "Vote!" : "Search for Song"}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          disabled={selected}
        />
        <div className="result_parent_container">
          <div className="result_container">
            {songs.map((song) => {
              return (
                <SongResult
                  key={uuidv4()}
                  song={song}
                  setSelected={setSelected}
                  socket={socket}
                />
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
