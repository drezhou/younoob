/* REDUCERS */
import { combineReducers } from 'redux';
import PlaylistList from './playlists-reducer';

import playlists from './playlists/reducers';
import songController from './song_controller/reducers';

export default combineReducers({
    playlists,
    songController,
    playlistList: PlaylistList
});

/* ACTIONS */
export * from './playlists/actions';
export * from './song_controller/actions';
