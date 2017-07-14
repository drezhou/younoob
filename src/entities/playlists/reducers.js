import _ from 'lodash';

import {
  ON_PAGE_SELECT,
  ON_PLAYLIST_INIT,
  LOAD_PLAYLIST,
  SAVE_SONG_DATA,
  ON_SEARCH_PLAYLIST_INIT,
} from './actions';


// Set Initial State

const INITIAL_STATE = {
  showPage: 'browse',
  cachedPlaylists: {},
  player: null,
};


// Playlist Initialization

const initializePlaylist = (state, action) => {

  // Loop through the playlist Array and match the current playlist
  let playlistInfo = {};
  action.playlistList.forEach(function(entry) {
    entry.playlists.forEach(function(x){
      if (x.playlistId === action.playlistId){
       playlistInfo = x;
      }
    });
  });

  // Add the thumbnail to the playlist info
  playlistInfo.youtubeThumbnail = action.thumbnail;

  // Add the songCount to the playlist info
  playlistInfo.songCount = action.songCount;

  return {
    ...state,
    cachedPlaylists: {
      ...state.cachedPlaylists,
      [action.genre]: {
        ...state.cachedPlaylists[action.genre],
        [action.playlistId]: {
          playlistInfo,
          songs: [],
        }
      }
    }
  };
};

// Search Playlist Initialization

const searchInitializePlaylist = (state, action) => {

  return {
    ...state,
    cachedPlaylists: {
      ...state.cachedPlaylists,
      [action.genre]: {
        ...state.cachedPlaylists[action.genre],
        [action.playlistId]: {
          playlistInfo: action.payload,
          songs: [],
        }
      }
    }
  };
};


// onClick Playlist

const loadPlaylist = (state, action) => {

  const newState = {
    ...state,
  };

  newState.cachedPlaylists[action.genre][action.payload.playlistId].songs =
  [
    ...newState.cachedPlaylists[action.genre][action.payload.playlistId].songs,
    ...action.payload.songs
  ];

  return newState;
};


// Save Additional Song Data

const saveSongData = (state, action) => {

  const newState = {
    ...state,
  };

  let songIndex;

  let playlist = state.cachedPlaylists[action.genre][action.playlistId].songs;

  _.map(playlist, (x, index) => {
    if (x.snippet.resourceId.videoId === action.videoId){

      songIndex = index;

      newState.cachedPlaylists[action.genre][action.playlistId].songs[songIndex] =
      {
        ...newState.cachedPlaylists[action.genre][action.playlistId].songs[songIndex],
        ...action.payload
      };

    }
  });

  return newState;

};



export default (state = INITIAL_STATE, action) => {
  switch (action.type) {

    case ON_PAGE_SELECT:
      return {
        ...state,
        showPage: action.payload
      }

    case ON_PLAYLIST_INIT:
      return initializePlaylist(state, action);

    case ON_SEARCH_PLAYLIST_INIT:
      return searchInitializePlaylist(state, action);

    case LOAD_PLAYLIST: {
      return loadPlaylist(state, action);
    }

    case SAVE_SONG_DATA: {
      return saveSongData(state, action);
    }

    default:
      return state;
  }
}
