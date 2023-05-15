import React from 'react'
import '../../CSS/SongStyle.css'
function SongResult({song, setSelected, socket}) {

  function selectSong(){
    setSelected(true)
    socket.emit("game:song:add", song);
  }
  return (
    <div className={'song_result'}id={song.uri} onClick={selectSong}>
      <img src={song.img} className='song_img'/>
      <div className='song_text_container'>
        <div className='song_name'>
          {song.name}
        </div>
        <div className='song_artist'>
          {song.artist}
        </div>
      </div>
      <div className='song_time'>
        {song.time}
      </div>
    </div>
  )
}

export default SongResult