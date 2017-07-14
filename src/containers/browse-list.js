import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

// Actions
import { onPageSelect, onPlaylistSelect } from '../entities';

// Components
import GenreItem from '../components/browse-list-genre';
import GenrePlaylist from '../components/genre-playlist';

// This Container
class BrowseList extends Component{

  renderSpecificGenre(){

    if (this.props.showPage !== 'browse' &&  this.props.showPage !== false){

      const genresPlaylists = _.map(this.props.cachedPlaylists[this.props.showPage], (item) => {
        return(
          <GenrePlaylist
            key={item.playlistInfo.playlistId}
            item={item}
            onPlaylistSelect={this.props.onPlaylistSelect}
            genreSlug={this.props.showPage}
          />
        );
      })

      const dynamicClass = 'browse-container browse-' + this.props.showPage;

      const genreInfo = _.find(this.props.playlistList, {genreSlug: this.props.showPage});

      return(
        <div className={dynamicClass}>
          <h1>{genreInfo.genreTitle} Playlists</h1>
            {genresPlaylists}
        </div>
      )
    }
  }

  renderGenreList(){
    if (this.props.showPage === 'browse'){
      const genresList = _.map(this.props.playlistList, (item) => {
        return(
          <GenreItem
            genre={item}
            onPageSelect={this.props.onPageSelect}
            key={item.genreSlug}
          />
        );
      })

      return (
        <div className="browse-container">
          <div>
          <h1>Browse Genres</h1>
          {genresList}
          </div>
        </div>
      );
    }
  }

  render(){

    return(
      <div className="outer-container">
          {this.renderGenreList()}
          {this.renderSpecificGenre()}
      </div>
    )
  }
}

function mapStateToProps(state){
  return{
    cachedPlaylists: state.playlists.cachedPlaylists
  };
}
function mapDispatchToProps(dispatch){
  return bindActionCreators({ onPageSelect, onPlaylistSelect }, dispatch);
}
export default connect(mapStateToProps, mapDispatchToProps)(BrowseList);
