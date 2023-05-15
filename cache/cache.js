const express = require("express");
const nodecache = require("node-cache");
require("isomorphic-fetch");
const cors = require("cors");
const bp = require("body-parser");
const { v4: uuidv4 } = require("uuid");
const appCache = new nodecache({ stdTTL: 3600 });
const app = express();

app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "*",
  })
);

app.get("/", function (req, res) {
  res.send("huh");
});

app.get("/test", function (req, res) {
  res.send("this is a test");
});

app.post("/create_token", function (req, res) {
  let body = req.body;

  let token = uuidv4(16);
  let receipt = body.receipt;

  appCache.set(token, receipt);
  console.log("Player Ticket Made.");
  res.send(JSON.stringify({ token: token }));
});
app.post("/create_host_auth", function (req, res) {
  let body = req.body;
  let host_auth_code = body.auth_code;
  let token = uuidv4(16);
  appCache.set(token, host_auth_code);

  console.log("Host Ticket Made.");
  res.send(JSON.stringify({ token: token }));
});
app.get("/get_token", function (req, res) {
  let token = req.query.id;
  if (token) {
    let ticket = appCache.get(token);
    res.send(ticket);
  } else {
    res.sendStatus(422).send("Invalid ID form.");
  }
});
app.listen(7070, () => {
  console.log("LISTENING ON PORT 7070");
});
