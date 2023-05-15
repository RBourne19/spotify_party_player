import React, { useEffect, useState } from "react";
import Lobby from "./Lobby";
import io from "socket.io-client";

export default function LobbyConnection() {
  const host_id = localStorage.getItem("host_id");
  const [socket, setSocket] = useState(
    io.connect(
      "http://localhost:6060/",
      {
        auth: {
          name: localStorage.getItem("name"),
          room: localStorage.getItem("room"),
          client_id: localStorage.getItem("client_id"),
          host_id: host_id,
        },
      },
      {
        transports: ["websocket"],
      }
    )
  );
  useEffect(() => {
    socket.on("player:join", (data) => {
      localStorage.setItem("basic_auth", data.basic_auth);
    });
    socket.on("disconnect", (message) => {
      console.error(message);
      window.location.href = "/";
    });
    return () => {
      socket.off("game:start");
      socket.off("player:join");
      socket.off("game:roundstart");
    };
  }, []);
  return <Lobby socket={socket} />;
}
