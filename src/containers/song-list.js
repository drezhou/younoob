import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import base from '../rebase';

// Actions
import { onVideoSelect } from '../entities';

import SongListItems from '../components/song-list-items';

class SongList extends Component {
  constructor(props){
    super(props);

    this.state = {
    }

    this.playAll = this.playAll.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.removePlaylist = this.removePlaylist.bind(this);
  }

  savePlaylist(){
    if (this.props.user){
      if (!this.props.items[this.props.playlistId]){

        let thumb;
        if (this.props.cachedPlaylists[this.genre][this.props.playlistId].playlistInfo.thumbnail){
          thumb = this.props.cachedPlaylists[this.genre][this.props.playlistId].playlistInfo.thumbnail;
        } else {
          thumb = this.props.cachedPlaylists[this.genre][this.props.playlistId].playlistInfo.youtubeThumbnail;
        }
        base.post(`${this.props.user.uid}/savedPlaylists`, {
          data: {
            ...this.props.items,
             [this.props.playlistId]:
              {
              playlistId: this.props.playlistId,
              title: this.props.cachedPlaylists[this.genre][this.props.playlistId].playlistInfo.playlistTitle,
              thumbnail: thumb,
              }
          },
          then(err){
            console.log(err);
          }
        });
      }
    } else {
      alert('please log in to save playlists!');
    }
  }

  removePlaylist(){
    if (this.props.items[this.props.playlistId]){
      base.remove(`${this.props.user.uid}/savedPlaylists/${this.props.playlistId}`);
    }
  }

  renderSavePlaylistBtn(){

    if (this.props.user){
      if (!this.props.items[this.props.playlistId]){
        return (
          <button className="song-list-save" onClick={this.savePlaylist}>Favourite</button>
        )
      } else {
        return (
          <button className="song-list-save" onClick={this.removePlaylist}>UnFavourite</button>
        )
      }
    } else {
      return (
        <button className="song-list-save" onClick={this.savePlaylist}>Favourite</button>
      )
    }
  }

  playAll(){
    this.props.onVideoSelect(this.props.cachedPlaylists[this.genre][this.props.playlistId].songs[0], this.props.cachedPlaylists[this.genre][this.props.playlistId].songs);
    this.props.player.target.playVideo();
  }

  render() {

    this.genre = _.findKey(this.props.cachedPlaylists, this.props.playlistId);

    if (!this.props.cachedPlaylists[this.genre]){
      return null;
    };

    // DRY shortcut for this playlist
    const playlistInfo = this.props.cachedPlaylists[this.genre][this.props.playlistId].playlistInfo;

    // Set the image URLS
    let thumbnail;

    if (this.genre === 'yourmusic'){
      thumbnail = {
        backgroundImage: 'url(' + playlistInfo.thumbnail + ')'
      }
    } else if (playlistInfo.thumbnail){
      thumbnail = {
        backgroundImage: 'url(' + process.env.PUBLIC_URL + '/images/playlists/' + playlistInfo.thumbnail + ')'
      }
    } else {
      thumbnail = {
        backgroundImage: 'url(' + playlistInfo.youtubeThumbnail + ')'
      }
    }

    // Set background image
    let background = {
      backgroundImage: 'url(' + process.env.PUBLIC_URL + '/images/playlists/' + playlistInfo.background + ')'
    }

    // Create an array of songs by mapping through props
    const songListArray = _.map(this.props.cachedPlaylists[this.genre][this.props.playlistId].songs, (video) => {
      if(video.snippet.title !== "Deleted video" && video.snippet.title !== "Private video"){

        let index = _.findIndex(this.props.savedSongs, {id:video.id});

        return (
          <SongListItems
            key={video.etag}
            video={video}
            onVideoSelect={this.props.onVideoSelect}
            selectedSong={this.props.selectedSong}
            cachedPlaylist={this.props.cachedPlaylists[this.genre][this.props.playlistId].songs}
            savedSongs={this.props.savedSongs}
            saveSong={this.props.saveSong}
            removeSong={this.props.removeSong}
            index={index}
            user={this.props.user}
          />
        );
      }
    });


    return (
      <div className="outer-container">

        <div className="song-list-container" style={background}>

          <div className="song-list-title-block">
            <div className="song-list-thumbnail" style={thumbnail}></div>
            <div className="song-list-details">
              <h1>{playlistInfo.playlistTitle}</h1>
              <span>{playlistInfo.songCount} Songs</span>
              <button className="song-list-play" onClick={this.playAll}>&#9658; Play All</button>
              {this.renderSavePlaylistBtn()}
            </div>
          </div>

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

      </div>
    );

  }

}


function mapStateToProps(state){
  return{
    cachedPlaylists: state.playlists.cachedPlaylists,
    player: state.songController.player,
    selectedSong: state.songController.selectedSong,
  };
}

function mapDispatchToProps(dispatch){
  return bindActionCreators({ onVideoSelect }, dispatch);
}
export default connect(mapStateToProps, mapDispatchToProps)(SongList);
