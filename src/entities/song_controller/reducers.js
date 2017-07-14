import {
  ON_PLAYER_READY,
  ON_VIDEO_SELECT,
  ON_VIDEO_JUMP,
  RESTORE_SELECTED_SONG,
} from './actions';


// Set Initial State

const INITIAL_STATE = {
  player: null,
  selectedSong: null,
  que: [],
  autoplay: 0,
};


export default (state = INITIAL_STATE, action) => {
  switch (action.type) {

    case ON_PLAYER_READY:
      return {
        ...state,
        player: action.payload
      }

    case ON_VIDEO_SELECT:
      return {
        ...state,
        autoplay: 1,
        selectedSong: action.payload,
        que: action.que,
      }

    case ON_VIDEO_JUMP:
      return {
        ...state,
        selectedSong: action.payload
      }

      case RESTORE_SELECTED_SONG:
      return {
        ...state,
        selectedSong: action.payload
      }

    default:
      return state;
  }
}
