import React from 'react';
import regex from '../helpers/helper-functions';

const PlaylistSelectorItem = (props) => {

  var addSelectedClass;
  if (props.currentPage === props.item.playlistId){
    addSelectedClass = 'playlist-item selected';
  } else {
    addSelectedClass = 'playlist-item';
  }

  return(
    <li className={addSelectedClass} onClick={() => props.onSearchPlaylistInit(props.item.playlistId, 'yourmusic', props.item.thumbnail, props.item.title)}>
          {regex.truncate(props.item.title, 28)}
    </li>
  )
}

export default PlaylistSelectorItem;
