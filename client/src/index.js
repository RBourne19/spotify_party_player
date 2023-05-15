import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";
import Login from "./Login";
import LobbyConnection from "./LobbyConnection";
const root = ReactDOM.createRoot(document.getElementById("root"));
export default function Index() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/lobby" element={<LobbyConnection />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}
root.render(<Index />);
