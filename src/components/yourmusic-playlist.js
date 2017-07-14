import React, {Component} from 'react';
import regex from '../helpers/helper-functions';

class YourMusicPlaylist extends Component {

  render(){

    const { thumbnail,
            playlistId,
            title
            } = this.props.item;

    let thumb;
    if (thumbnail.includes('http')){
      thumb = {
        backgroundImage: 'url(' + thumbnail + ')'
      }
    } else {
      thumb = {
        backgroundImage: 'url(' + process.env.PUBLIC_URL + '/images/playlists/' + thumbnail + ')'
      }
    }

    return(
      <div className="browse-playlist col-xs-6 col-sm-4 col-md-3 col-lg-2"
          onClick={() => this.props.onSearchPlaylistInit(playlistId, 'yourmusic', thumbnail, title)}>

        <div className="browse-playlist-inner">
          <a className="browse-playlist-link" style={thumb}>
            <div className="playlist-details">
              <h4 className="title">{regex.truncate(title, 40)}</h4>
            </div>
          </a>
        </div>

      </div>
    )
  }

}

export default YourMusicPlaylist;
