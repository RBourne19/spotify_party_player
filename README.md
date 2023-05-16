# Spotify Party Website
### A website where users are able to create and join rooms that allow them to suggest and vote on songs that get added to the host's Spotify Queue.

## Authentication
### The authentication flow for authorizing the user between the Rest API, Cache, and Websocket
![image](https://i.imgur.com/fnNroCP.png)
#### Without repeating the steps above the cache holds a token created by the Rest API where the Websocket retrieves it when the user has the initial handshake with the socket. This is so the user is not in possession of any necessary game tokens until they are validated and in the game lobby.
## Cache
### Handles the authentication between the Rest API and Websocket

## Client
### This is the frontend of the website, built in React
#### View a demo of the client side [here](https://github.com/RBourne19/spotify_party_player/tree/main/client)
## Rest API
### Handles the initial authentication flow for the project and handles the Spotify OAuth 2 authentication flow for the host. 
## Websocket
### Handles all game states and Spotify API for adding the songs to queue
