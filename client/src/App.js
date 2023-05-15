import React, { useState, useRef } from "react";
import "./CSS/Login.css";
function App() {
  const playerName = useRef();
  const roomNum = useRef();
  const api_url = "http://localhost:8080";
  localStorage.clear();
  //test

  function joinGame() {
    const name = playerName.current.value;
    if (name === "") return;

    fetch(api_url + "/join_room", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      //change this later
      body: JSON.stringify({ type: "player" }),
    }).then(async (response) => {
      localStorage.setItem("room", roomNum.current.value);
      localStorage.setItem("name", name);
      const body = await response.json();
      localStorage.setItem("client_id", body.token);
      window.location.href = "/lobby";
    });
  }

  async function createGame() {
    const name = playerName.current.value;
    if (name === "") return;
    const result = await fetch(api_url + "/join_room", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      //change this later
      body: JSON.stringify({ type: "host" }),
    });
    const body = await result.json();
    const token = body.token;
    localStorage.setItem("name", name);
    localStorage.setItem("client_id", token);
    window.location.assign(api_url + "/login");
  }

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
      <link
        href="https://fonts.googleapis.com/css2?family=Montserrat:wght@600&display=swap"
        rel="stylesheet"
      ></link>
      <h1>
        Spotify Party Player
      </h1>
      <div className="login_container">
        <div className="input_container">
          <div className="name_login">
            <div id="login_text">NAME</div>
            <input
              ref={playerName}
              className="login_input"
              type="text"
              placeholder="Enter Name"
            />
          </div>
          <div className="code_login">
            <div id="login_text">ROOM</div>
            <input
              ref={roomNum}
              className="login_input"
              type="text"
              placeholder="Enter Code"
            />
          </div>
        </div>
        <div className="break"></div>
        <div className="button_container">
          <button onClick={createGame}>Create Game</button>
          <button onClick={joinGame}>Join Game</button>
        </div>
      </div>
    </>
  );
}

export default App;
