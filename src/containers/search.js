import React, {Component} from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';
import axios from 'axios';
import base from '../rebase';
import api from '../helpers/api';

// Actions
import { onSearchPlaylistInit, onPlaylistSelect, onVideoSelect } from '../entities';

// Components
import SearchResult from '../components/search-result';

class SearchBar extends Component {
  constructor(props){
    super(props);

    this.state = {
      term: '',
      searchResults: {
        items: []
      },
      searchHistory: [],
    };

    this.onInputChange = this.onInputChange.bind(this);
    this.renderResults = this.renderResults.bind(this);
    this.setSearchHistory = this.setSearchHistory.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.searchFromHistory = this.searchFromHistory.bind(this);

    this.videoSearch = function(term) {

      this.setState({
        searchResults: {
          items:[],
        }
      })

      let url = `https://www.googleapis.com/youtube/v3/search?maxResults=20&relevanceLanguage=en&regionCode=AU&topicId=/m/04rlf&part=snippet&q=${term}&key=${api}`

      axios.get(url)
      .then((response) => {

        _.map(response.data.items, (video) => {

          if (video.id.kind === "youtube#video"){

            let url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${video.id.videoId}&key=${api}`;
            axios.get(url)
            .then((result) => {
              video.duration = result.data.items[0].contentDetails.duration;
              video.viewCount = result.data.items[0].statistics.viewCount;
              this.setState({
                searchResults: {
                  items: [
                    ...this.state.searchResults.items,
                    video
                  ]
                }
              })
            })
            .catch((error) => {
              console.log(error);
            });

          } else {
            this.setState({
              searchResults: {
                items: [
                  ...this.state.searchResults.items,
                  video
                ]
              }
            })
          }

        });

      })
      .catch((error) => {
        console.log(error);
      });
    }

    this.debounced = _.debounce(this.videoSearch, 210);
  }

  onInputChange(event) {
    if (event.target.value === ' ' || event.target.value === null){
        this.setState({
          term: event.target.value,
          searchResults: {},
        })
    } else {
      this.setState({
        term: event.target.value
      });
      this.debounced(event.target.value);
    }
  }
  setSearchHistory(){
    this.setState({
      searchHistory:[
        ...this.state.searchHistory,
        this.state.term
      ]
    })
  }
  searchFromHistory(term){
    this.setState({
      term: term
    });
    this.debounced(term);
  }
  onFormSubmit(event){
    event.preventDefault();
    this.setSearchHistory();
  }

  renderResults() {

    const songsArray = _.filter(this.state.searchResults.items,
                            function(item) {return item.id.kind === "youtube#video"}
                          );
    const songs = _.map(songsArray, (result) => {

      let index = _.findIndex(this.props.savedSongs, {id:result.id.videoId});

        return (
          <SearchResult
            key={result.etag}
            result={result}
            onVideoSelect={this.props.onVideoSelect}
            selectedSong={this.props.selectedSong}
            savedSongs={this.props.savedSongs}
            saveSong={this.props.saveSong}
            removeSong={this.props.removeSong}
            index={index}
            user={this.props.user}
            setSearchHistory={this.setSearchHistory}
          />
        );
    });

    const artistsArray = _.filter(this.state.searchResults.items,
                            function(item) {return item.id.kind === "youtube#channel"}
                          );

    const artists = _.map(artistsArray, (result) => {
        return (
          <SearchResult
            key={result.etag}
            result={result}
          />
        );
    });

    const playlistsArray = _.filter(this.state.searchResults.items,
                            function(item) {return item.id.kind === "youtube#playlist"}
                          );
    const playlists = _.map(playlistsArray, (result) => {
        return (
          <SearchResult
            key={result.etag}
            result={result}
            onSearchPlaylistInit={this.props.onSearchPlaylistInit}
          />
        );
    });

    const history = _.map(this.state.searchHistory, (item) => {

      return (
        <a className="search-history" onClick={() => this.searchFromHistory(item)}>
          {item}
        </a>
      );
    });


    if (this.state.term){
      return (
        <div>
        <ul className="search-results">
          {songs.length > 0 &&
            <div className="result-group">
              <h3>Songs</h3>

              <table className="list-group">
                <tbody>

                  <tr>
                    <th></th>
                    <th>Title</th>
                    <th>Artist</th>
                    <th>Dur</th>
                    <th>Plays</th>
                  </tr>

                  {songs}

                </tbody>
              </table>

            </div>
          }
          {/*artists.length > 0 &&
            <div className="result-group">
              <h3>Artists</h3>
              {artists}
            </div>
          */}
          {playlists.length > 0 &&
            <div className="result-group">
              <h3>Playlists</h3>
              {playlists}
            </div>
          }
        </ul>
        </div>
      )
    } else if(this.state.searchHistory.length > 0) {
      return(
        <div>
        <h2>Previous searches</h2>
        {history}
        </div>
      )
    }
  }

  render(){

    return (
      <div className="search-wrapper">

        <form className="search-form" onSubmit={this.onFormSubmit}>
          <label>Search</label>
          <input
            className="form-control"
            value={this.state.term}
            onChange={this.onInputChange}
            autoFocus={true}
            placeholder="Search artists, songs, playlists.."
          />
          <span className="tip">Tip&#58; To search for playlists, add the word &quot;playlist&quot;</span>

        </form>

        {this.renderResults()}

      </div>
    )
  }

  componentDidMount(){
    if (this.props.user){
      base.syncState(`${this.props.user.uid}/searchHistory`, {
        context: this,
        state: 'searchHistory',
        asArray: true
      });
    }
  }

}
function mapStateToProps(state){
  return{
    selectedSong: state.songController.selectedSong,
  };
}
function mapDispatchToProps(dispatch){
  return bindActionCreators({ onSearchPlaylistInit, onPlaylistSelect, onVideoSelect }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchBar);
