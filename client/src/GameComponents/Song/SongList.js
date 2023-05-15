import React, {useEffect, useState} from 'react'
import Song from './Song';
import '../../CSS/SongStyle.css'
const {v4: uuidv4} = require('uuid');
export default function SongList({socket}) {
  const [songs, setSongs] = useState([]);
  const [songWinner, setSongWinner] = useState();
  useEffect(() => {
    socket.on('game:song:update', (songData) => {
      songData.liked = false;
      setSongs(prevSongs => [...prevSongs, songData]);
    });
    socket.on('game:roundstart', (winner) =>{
      console.log(winner);
      setSongs([]);
      setSongWinner(winner);
      let myTimeout = setTimeout(() => {
        setSongWinner();
        setSongs([]);
      }, 3000)
      
      
    })
    return () => socket.off("game:song:update");
  }, [socket]);
  return (
    <div className='songlist_container'>
      <div className='player_songlist_container'>
        <>
        {songs.map(song =>{
        
        return <Song key={uuidv4()} song={song} socket={socket} likeable={true}/>
      })}
      </>
      {songWinner && <Song key={uuidv4()} song={songWinner} likeable={false}></Song>}
      </div>
    </div>
  )
}
