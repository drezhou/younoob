import axios from 'axios';
import _ from 'lodash';

import api from '../../helpers/api';

export const ON_PAGE_SELECT = 'ON_PAGE_SELECT';
export const ON_PLAYLIST_INIT = 'ON_PLAYLIST_INIT';
export const LOAD_PLAYLIST = 'LOAD_PLAYLIST';
export const SAVE_SONG_DATA = 'SAVE_SONG_DATA';
export const ON_SEARCH_PLAYLIST_INIT = 'ON_SEARCH_PLAYLIST_INIT';

const onPageSelect = (page) => ({
  type: ON_PAGE_SELECT,
  payload: page,
});

const initializePlaylist = (id, genre, state, data, thumbnail) => ({
  type: ON_PLAYLIST_INIT,
  playlistId: id,
  songCount: data,
  genre: genre,
  playlistList: state,
  thumbnail: thumbnail
})

const searchInitializePlaylist = (id, genre, thumbnail, playlistTitle, data) => ({
  type: ON_SEARCH_PLAYLIST_INIT,
  playlistId: id,
  genre: genre,
  payload: {
    background: null,
    playlistId: id,
    playlistTitle,
    songCount: data,
    thumbnail,
  }
})

const saveNewPlaylistData = (id, genre, data) => ({
  type: LOAD_PLAYLIST,
  genre: genre,
  payload: {
    songs: data,
    playlistId: id
  }
});

const saveSongData = (id, genre, videoId, channelTitle, duration, viewCount) => ({
  type: SAVE_SONG_DATA,
  playlistId: id,
  genre,
  videoId,
  payload: {
    channelTitle,
    duration,
    viewCount
  }
})


const grabPlaylistData = (id, genre, nextPageToken, getState, dispatch) => {

  // Check if the playlist has already been loaded
  let state = getState();
  if (state.playlists.cachedPlaylists[genre]){
    if (state.playlists.cachedPlaylists[genre][id]){
      if (state.playlists.cachedPlaylists[genre][id].songs.length === state.playlists.cachedPlaylists[genre][id].playlistInfo.songCount){
        return;
      }
    }
  }

  let url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${id}&key=${api}`;

  if (nextPageToken) {
    url += `&pageToken=${nextPageToken}`;
  }

  axios.get(url)
  .then((response) => {
    dispatch(saveNewPlaylistData(id, genre, response.data.items));
    // dispatch(grabSongData(id, genre, response.data.items, dispatch));

      _.map(response.data.items, (video) => {
        let url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${video.snippet.resourceId.videoId}&key=${api}`;
        axios.get(url)
        .then((response) => {
          if(response.data.items.length > 0){
            dispatch(saveSongData(id, genre, video.snippet.resourceId.videoId, response.data.items[0].snippet.channelTitle, response.data.items[0].contentDetails.duration, response.data.items[0].statistics.viewCount))
          } else {
            let title = '[Deleted Song]';
            let duration = 'PT0M0S';
            let plays = '0';
            dispatch(saveSongData(id, genre, video.snippet.resourceId.videoId, title, duration, plays))
          }
        })
        .catch((error) => {
          console.log(error);
        });
      });

    if (!response.data.nextPageToken) {
      return;
    }

    grabPlaylistData(id, genre, response.data.nextPageToken, getState, dispatch);
  })
  .catch((error) => {
    console.log(error);
  });
}


const onPlaylistSelect = (id, genre) => {
  return function (dispatch, getState) {
    dispatch(onPageSelect(id));

    grabPlaylistData(id, genre, null, getState, dispatch);
  }
}

const onPlaylistInit = (id, genre) => {

  return function (dispatch, getState) {

    let get = getState();
    let state = get.playlistList;
    let url = `https://www.googleapis.com/youtube/v3/playlists?part=snippet,contentDetails&id=${id}&key=${api}`;

    axios.get(url)
    .then((response) => {

      let thumbnail;
      if (response.data.items[0].snippet.thumbnails.maxres){
        thumbnail = response.data.items[0].snippet.thumbnails.maxres.url;
      } else if (response.data.items[0].snippet.thumbnails.high){
        thumbnail = response.data.items[0].snippet.thumbnails.high.url;
      } else if (response.data.items[0].snippet.thumbnails.medium){
        thumbnail = response.data.items[0].snippet.thumbnails.medium.url;
      } else if (response.data.items[0].snippet.thumbnails.standard){
        thumbnail = response.data.items[0].snippet.thumbnails.standard.url;
      } else if (response.data.items[0].snippet.thumbnails.default){
        thumbnail = response.data.items[0].snippet.default.default.url;
      } else {
        thumbnail = null;
      }

      dispatch(initializePlaylist(id, genre, state, response.data.items[0].contentDetails.itemCount, thumbnail));
    })
    .catch((error) => {
      console.log(error);
    });

  }
}

const onSearchPlaylistInit = (id, genre, thumbnail, playlistTitle) => {

  return function (dispatch, getState) {

    // Check to see if the playlist exists in browse
    let get = getState();
    let cachedPlaylists = get.playlists.cachedPlaylists;
    const existingGenre = _.findKey(cachedPlaylists, id);

    let url = `https://www.googleapis.com/youtube/v3/playlists?part=contentDetails&id=${id}&key=${api}`;

    // If browse has the playlist already, remove thumbnail and title from the dispatch arguments
    if (existingGenre) {
      // Override the genre to the one from browse
      genre = existingGenre;

      axios.get(url)
      .then((response) => {
        dispatch(searchInitializePlaylist(id, playlistTitle, response.data.items[0].contentDetails.itemCount));
      })
      .catch((error) => {
        console.log(error);
      });
    } else {
      // Phresh playlist, add to cache under your music
      axios.get(url)
      .then((response) => {
        dispatch(searchInitializePlaylist(id, genre, thumbnail, playlistTitle, response.data.items[0].contentDetails.itemCount));
      })
      .catch((error) => {
        console.log(error);
      });
    }

    grabPlaylistData(id, genre, null, getState, dispatch);

    dispatch(onPageSelect(id));

  }
}

export {
  onPageSelect,
  onPlaylistSelect,
  onPlaylistInit,
  onSearchPlaylistInit,
};
