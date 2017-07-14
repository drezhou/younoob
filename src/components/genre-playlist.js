import React, {Component} from 'react';

class GenrePlaylist extends Component {

  render(){

    const { thumbnail,
            playlistId,
            playlistTitle,
            songCount,
            youtubeThumbnail } = this.props.item.playlistInfo;

    let thumb;
    if (thumbnail){
      thumb = {
        backgroundImage: 'url(' + process.env.PUBLIC_URL + '/images/playlists/' + thumbnail + ')'
      }
    } else {
      thumb = {
        backgroundImage: 'url(' + youtubeThumbnail + ')'
      }
    }

    return(
      <div className="browse-playlist col-xs-6 col-sm-4 col-md-3 col-lg-2"
          onClick={() => this.props.onPlaylistSelect(playlistId, this.props.genreSlug)}>

        <div className="browse-playlist-inner">
          <a className="browse-playlist-link" style={thumb}>
            <div className="playlist-details">
              <h4 className="title">{playlistTitle}</h4>
              <span className="song-count">{songCount} songs</span>
            </div>
          </a>
        </div>

      </div>
    )
  }

}

export default GenrePlaylist;
