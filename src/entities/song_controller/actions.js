export const ON_PLAYER_READY = 'ON_PLAYER_READY';
export const ON_VIDEO_SELECT = 'ON_VIDEO_SELECT';
export const ON_VIDEO_JUMP = 'ON_VIDEO_JUMP';
export const RESTORE_SELECTED_SONG = 'RESTORE_SELECTED_SONG';

const onReady = (event) => ({
  type: ON_PLAYER_READY,
  payload: event,
});

const setSelectedSong = (item, cachedPlaylist) => ({
  type: ON_VIDEO_SELECT,
  payload: item,
  que: cachedPlaylist,
})

const onVideoSelect = (item, cachedPlaylist) => {
  return function (dispatch, getState){
    let state = getState();
    dispatch(setSelectedSong(item, cachedPlaylist));
    state.songController.player.target.playVideo();
  }
}

const onVideoJump = (item) => ({
  type: ON_VIDEO_JUMP,
  payload: item
})

const restoreSelectedSong = (item) => ({
  type: RESTORE_SELECTED_SONG,
  payload: item
})

export {
  onReady,
  onVideoSelect,
  onVideoJump,
  restoreSelectedSong,
};
