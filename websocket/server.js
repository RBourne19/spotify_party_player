const { Server } = require("socket.io");
const { createServer } = require("http");
const axios = require('axios');
const express = require('express');
const Game = require('./game_handler.js')
const app = express();
const httpServer = createServer(app);
const cache_url = "http://localhost:7070"


const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ['GET', 'POST']
  }
});


app.get('/', (req, res) => {
  res.send('huh');
});

let game_rooms = new Map();



//when player connects to websocket, fetch their ticket from cache
//if they have a ticket, send them to the specified room

io.on("connection", (socket) => {
    console.log("Player Joined.");
    const room = socket?.room_id;
    const name = socket?.user_name;


    let game = game_rooms.get(room);
    if(game != null){
      console.log(name + " joined room " + room);
      let game = game_rooms.get(room);
      socket.join(room);
      game.players.set(socket.id, name);
      let players = Array.from(game.players.values());
      if(socket.id === game.host_id){
        io.to(socket.id).emit("lobby:code", room);
      }
      console.log(players);
      io.to(room).emit("player:update", players)
      io.to(socket.id).emit("player:join", {basic_auth: socket.receipt.access_token})
    } else{
      socket.disconnect(true)
    }


    socket.on('game:start', (settings) =>{
      
      //error handle this later
      game.rounds = settings?.rounds;
      game.roundTime = settings?.roundTime;
      io.to(room).emit("game:start", (settings))
      
    });

    socket.on('game:endround', () =>{
      //change later
      console.log("round ended");
      
      let winner = game.get_best_song();
      game.songs = new Map();
      if(winner != null){
        game.rounds--;
        console.log("Rounds remaining" + game.rounds);
        if(game.rounds <= 0){
          //end the game i
          io.to(room).emit("game:end");
        }
        io.to(room).emit("game:roundstart", winner);
        let players = Array.from(game.players.values());
        io.to(room).emit("player:update", Array.from(players));
        game.queue_song(winner);
      } else{
        //do some afk error handling thing
      }
      
      
    });

    socket.on('game:song:add', (song) =>{
      let id = generateRandomString(16);
      let newSong = game.add_song(id, song);
      io.to(room).emit("game:song:update", (newSong))
    });
    socket.on("game:song:upvote", (id) => {
      let song = game.songs.get(id);
      song.upvote_song();
    });


    socket.on("message", (message) =>{
      console.log(message);
    });

     socket.on("disconnect", (reason) =>{
      if(socket.id == game.host_id){
        game_rooms.delete(room);
        io.in(room).disconnectSockets();
      }
      else if(game != null){
        game.players.delete(socket.id);
        let players = Array.from(game.players.values());
        io.to(room).emit("player:update", players);
      } 
      
    }) 
  });

//CHANGE
const port = process.env.PORT || 6060
httpServer.listen(port, () => console.log(`running on ${port}`));


//authentication
io.use((socket, next) =>{
    console.log("connecting....");
    const token = socket.handshake.auth?.client_id;
    //make this wait to sync up
    
    const ticket = is_auth_promise(token);
    ticket.then((receipt) =>{

      if(receipt != null){
          socket.receipt = receipt;
          let name = socket.handshake.auth?.name;
          socket.user_name = name;
          //return basic credentials and other things from ticket
          if(receipt.type === "host"){
            //host
            const host_token = socket.handshake.auth?.host_id;
            const host_ticket = is_auth_promise(host_token);

            host_ticket.then((host_receipt) =>{
              if(host_receipt != null){
                  //return basic credentials and other things from ticket
                  let room_id = generateRandomString(6).toUpperCase();
                  socket.room_id = room_id;
                  console.log(`Room Created. ID: ${room_id}`)
                  const new_game = new Game(room_id, host_receipt, socket.id);
                  game_rooms.set(room_id, new_game);
                  return next();
              }else{
                next(new Error("invalid"));
              }});
          } else{
            //player
            const room = socket.handshake.auth?.room;
            socket.room_id = room;
            next();
          }
          
      } else{
        next(new Error("invalid"));
      }
    }).catch((error) =>{
      console.log(error);
    });
    
});

//NONE SPACE FUNCTIONS
function is_auth_promise(token){
    return new Promise(async function(resolve, reject){
      let url = `${cache_url}/get_token?id=${token}`;
      axios.get(url);
      const result = await axios.get(url);
      const body = result.data;
      resolve(body);
    })
    
}

function generateRandomString(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}
