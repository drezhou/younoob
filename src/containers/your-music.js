import React, {Component} from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';

// Actions
import { onVideoSelect, onSearchPlaylistInit } from '../entities';

import YourMusicPlaylist from '../components/yourmusic-playlist';
import YourMusicSongListItems from '../components/yourmusic-song-list-items';

class YourMusic extends Component {

  constructor(props){
    super(props);

    this.state = {
      showList: 'playlists',
    };

    this.onNavClick = this.onNavClick.bind(this);
    this.renderPlaylists = this.renderPlaylists.bind(this);
    this.renderSongs = this.renderSongs.bind(this);
  }

  selectedClass(x){
    if (x === this.state.showList){
      return 'selected';
    }
  }

  onNavClick(x){
    this.setState({
      showList: x
    })
  }

  renderPlaylists(){
    if (this.state.showList === 'playlists'){

      const playlistItems = _.map(this.props.yourPlaylists, (item) => {
        return(
          <YourMusicPlaylist
            key={item.playlistId}
            item={item}
            onSearchPlaylistInit={this.props.onSearchPlaylistInit}
          />
        )
      })

      if (playlistItems.length > 0){
        return (
          <div>
            <h1>Your Playlists</h1>
            {playlistItems}
          </div>
        )
      } else {
        return (
          <div className="empty">
          <h1>Hmm, its pretty empty here</h1>
          <p>Head over to the browse section and add your first playlist</p>
          <button onClick={() => this.props.onPageSelect('browse')}>Browse</button>
          </div>
        )
      }


    }
  }

  renderSongs(){

    // Create an array of songs by mapping through props
    const songListArray = _.map(this.props.savedSongs, (video, index) => {

        return (
          <YourMusicSongListItems
            key={video.etag}
            video={video}
            onVideoSelect={this.props.onVideoSelect}
            selectedSong={this.props.selectedSong}
            cachedPlaylist={this.props.savedSongs}
            uid={this.props.user.uid}
            removeSong={this.props.removeSong}
            index={index}
          />
        );

    });

    if (this.state.showList === 'songs') {
      return(
        <div>
        <h1>Your songs</h1>

        <table className="list-group">
          <tbody>

            <tr>
              <th></th>
              <th>Title</th>
              <th>Artist</th>
              <th>Dur</th>
              <th>Plays</th>
            </tr>

            {songListArray}

          </tbody>
        </table>

        </div>
      )
    }
  }

  render(){



    return (
      <div className="outer-container">
        <div className="your-music-container">

          <div className="navigation">
            <button onClick={() => this.onNavClick('playlists')}>Playlists<hr className={this.selectedClass('playlists')}/></button>
            <button onClick={() => this.onNavClick('songs')}>Songs<hr className={this.selectedClass('songs')}/></button>
          </div>

          {this.renderPlaylists()}
          {this.renderSongs()}

        </div>
      </div>
    )
  }
}

function mapStateToProps(state){
  return{
    selectedSong: state.songController.selectedSong,
  };
}

function mapDispatchToProps(dispatch){
  return bindActionCreators({ onVideoSelect, onSearchPlaylistInit }, dispatch);
}
export default connect(mapStateToProps, mapDispatchToProps)(YourMusic);
