import React, { Component } from 'react';
import SongList from '../containers/song-list';
import BrowseList from '../containers/browse-list';
import PlaylistSelector from '../containers/playlist-selector';
import base from '../rebase';
import _ from 'lodash';

import Search from '../containers/search';
import YourMusic from '../containers/your-music';
import SongController from '../containers/song-controller';

class AppContents extends Component {

  constructor(props){
    super(props);

    this.state = {
      items: {},
      savedSongs: {},
    }

    if (this.props.user){
      base.bindToState(`${this.props.user.uid}/savedPlaylists`, {
        context: this,
        state: 'items'
      });
      base.syncState(`${this.props.user.uid}/savedSongs`, {
        context: this,
        state: 'savedSongs'
      });
    }

    this.saveSong = this.saveSong.bind(this);
    this.removeSong = this.removeSong.bind(this);
  }

  saveSong(song){
    this.setState({
      savedSongs: [
        ...this.state.savedSongs,
        song
      ]
    })
  }
  removeSong(index){
    let array = this.state.savedSongs;
    array.splice(index, 1);
    this.setState({
      savedSongs: array
    })
  }

  renderPage(){
    if (this.props.genres.includes(this.props.showPage)){
      return (
        <BrowseList
          playlistList={this.props.playlistList}
          showPage={this.props.showPage}
        />
      )
    } else if (this.props.showPage === "search"){
      return (
        <Search
          user={this.props.user}
          savedSongs={this.state.savedSongs}
          saveSong={this.saveSong}
          removeSong={this.removeSong}
        />
      )
    } else if (this.props.showPage === "yourMusic"){
      return (
        <YourMusic
          yourPlaylists={this.state.items}
          showPage={this.props.showPage}
          onPageSelect={this.props.onPageSelect}
          savedSongs={this.state.savedSongs}
          removeSong={this.removeSong}
          user={this.props.user}
        />
      )
    } else {
      return (
        <SongList
          playlistId={this.props.showPage}
                    what={() => ({  })}
          user={this.props.user}
          items={this.state.items}
          savedSongs={this.state.savedSongs}
          saveSong={this.saveSong}
          removeSong={this.removeSong}
        />
      )
    }
  }

  render(){
    return(
      <div className="container-wrapper">

        {this.renderPage()}

        <PlaylistSelector
          onPageSelect={this.props.onPageSelect}
          genres={this.props.genres}
          showPage={this.props.showPage}
          user={this.props.user}
          items={this.state.items}
        />

        <SongController />

      </div>
    )
  }
}

export default AppContents;
