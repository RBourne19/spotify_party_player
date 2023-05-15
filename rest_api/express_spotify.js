const express = require('express');
const querystring = require('node:querystring');
const axios = require('axios');
const cors = require('cors');
const {v4: uuidv4} = require('uuid');
const bodyParser = require('body-parser');

require('dotenv').config();

const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const redirect_uri = 'http://localhost:8080/callback';
const cache_url = "http://localhost:7070"

var app = express();

app.use(bodyParser.json());

app.use(cors({
  origin: '*',
  
}));

app.get("/", function(req, res){
  res.send("index");    
});

app.post('/join_room', function(req, res){
  //add some authentication here
  let access_token = '';
  const body = req.body;
  if(!body){
    sendError(res, 404, "Invalid request");
  }
  let type = body.type
  if(!type){
    sendError(res, 404, "Invalid request");
  }
  //data body
  //getting the key
  let basic_auth = get_basic_auth_promise();
  basic_auth.then(response => {
      //key acquired
      access_token = response.data.access_token;
      //sending the ticket to the cache
      token = uuidv4();
      axios.post(`${cache_url}/create_token`,{
        token: token,
        receipt: {
        type: type,
        access_token: access_token
      }
    })
      .then((response) => {
        //return the token id to user
        
        res.send(JSON.stringify({token: response.data?.token}));
      }).catch((error) =>{
        console.log(error); 
        sendError(res, 404, "Error generating valid client token.");
      });
    }).catch((error) =>{
      console.log(error);
      sendError(res, 404, "Error generating valid client token.");
    });
  

});
    
app.get('/login', function(req, res) {
  
  var state = generateRandomString(16);
  var scope = 'user-modify-playback-state';
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    }));
});

app.get('/callback', function(req, res) {
  
  const code = req.query.code || null;
  axios({
    method: 'post',
    url: 'https://accounts.spotify.com/api/token',
    data: querystring.stringify({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: redirect_uri
    }),
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${new Buffer.from(`${client_id}:${client_secret}`).toString('base64')}`,
    },
  })
    .then(response => {
      //temporarily storing the key for later in cache
      var auth_token = response.data.access_token;
      axios({
        method: 'POST',
        url : `${cache_url}/create_host_auth`,
        data:{
          auth_code : auth_token
        }
      }).then((cache) => {
        //redirect to frontend
        let token = cache.data.token;
        url = `http://localhost:3000/login?host_ticket=${token}`
        
        res.redirect(url);
      });
    })
    .catch(error => {
      console.log("Error generating host token.")
      sendError(res, 404, "Error generating host token.");
    });
  });







app.listen(8080, () => {
  console.log("Listening on port 8080");
});

//non api function
function get_basic_auth_promise(){
  let data = {
    grant_type: "client_credentials"
  };
  let headers = {
    headers:{
      'Content-Type' : 'application/x-www-form-urlencoded',
      'Authorization' : 'Basic ' + btoa(client_id + ':' + client_secret)
    }
  }
  //getting the key
  return new Promise(async function (resolve, reject) {axios.post(
      'https://accounts.spotify.com/api/token',
      querystring.stringify(data),
      headers
    ).then(response => {
      resolve(response);
    }) 
  })    
}

function sendError(res, code, message){
  if(res && code && message){
    return res.status(code).send({
      message: message
    })
  } 
  
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