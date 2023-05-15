const axios = require('axios');


class Game{
    constructor(room_num, auth_code, host_id){
        this.room_num = room_num;
        this.auth_code = auth_code;
        this.host_id = host_id;
        this.songs = new Map();
        this.players = new Map();
        this.rounds = 10;
        this.roundTime = 60;
    }
    //returns highest voted song
    get_best_song(){
        let best_song = this.songs.values().next().value;
        for (let [key, value] of this.songs) {
            if(best_song.likes < value.likes){
                best_song = value;
            }
        }

        return best_song;
    }
    //clears song list
    clear_songs(){
        this.songs = new Map();
    }
    add_song(id, song){
        let newSong = new Song(song.name, song.artist, song.uri, song.img, id);
        
        this.songs.set(id, newSong)
        return newSong;
    }
    async queue_song(song){
        if(!song){
            return null;
        }
        let uri = song.uri;
        uri = uri.split(':')[2];
        axios({
            method: 'POST',
            url : `https://api.spotify.com/v1/me/player/queue?uri=spotify%3Atrack%3A${uri}`,
            headers: {
              'Content-Type': "Content-Type: application/json",
              'Authorization': `Bearer ${this.auth_code}`
            },
        }).then(response => {
          console.log("Song added.")
          
          return song;
        })
        .catch(error => {
          console.log(error.data);
          return null;
        });
    }
}

class Song{
    constructor(name, artist, uri, img, id){
        this.name = name;
        this.artist = artist;
        this.uri = uri;
        this.img = img;
        this.id = id;
        this.likes = 0;
    }
    upvote_song(){
        this.likes += 1;
    }
    downvote_song(){
        this.likes -= 1;
    }
}



module.exports = Game