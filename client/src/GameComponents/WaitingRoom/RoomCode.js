import React, { useEffect, useState } from "react";

export default function RoomCode({ socket }) {
  const [code, setCode] = useState();
  const room_num = localStorage.getItem("room");

  useEffect(() => {
    if (room_num) {
      setCode(room_num);
    }
    socket.on("lobby:code", (room) => {
      setCode(room);
      localStorage.setItem("room", room);
    });
    return () => {
      socket.off("lobby:code");
    };
  }, []);

  return <div className="room_code">{code}</div>;
}
