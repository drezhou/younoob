import React from 'react';
import regex from '../helpers/helper-functions'; // Regex functions for splitting the titles

const YourMusicSongListItems = (props) => {

  // Set this song to selected if it matches the selectedSong state
  var addSelectedClass;

  if (props.selectedSong === props.video){
    addSelectedClass = 'list-item selected';
  } else {
    addSelectedClass = 'list-item';
  }

  if (!props.video.channelTitle) {
    return (
      <tr className="list-item">
            <td className="list-track">Loading...</td>
            <td className="list-artist"></td>
      </tr>
    )
  }

  return (

    <tr className={addSelectedClass}>
          <td onClick={() => props.removeSong(props.index)}>Remove</td>
          <td className="list-track" onClick={() => props.onVideoSelect(props.video, props.cachedPlaylist)}>{regex.editTitle(props.video.snippet.title)}</td>
          <td className="list-artist" onClick={() => props.onVideoSelect(props.video, props.cachedPlaylist)}>{regex.editArtist(props.video.channelTitle)}</td>
          <td className="list-duration" onClick={() => props.onVideoSelect(props.video, props.cachedPlaylist)}>{regex.editDuration(props.video.duration)}</td>
          <td className="list-play-count" onClick={() => props.onVideoSelect(props.video, props.cachedPlaylist)}>{regex.editPlayCount(props.video.viewCount)}</td>
    </tr>
  );

}

export default YourMusicSongListItems;
