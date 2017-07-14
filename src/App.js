import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { provider } from './rebase';
import base from './rebase';
import firebase from 'firebase';
import Cookies from 'universal-cookie';
import { expiry } from './helpers/helper-functions';

// Actions
import { onPlaylistInit, onPageSelect } from './entities';

// Containers
import AppContents from './components/app-contents';


// Css
import './App.css';

// This Container
class App extends Component {

  constructor(props){
    super(props);

    this.state = {
      user: null,
    }

    let genresArray = _.map(this.props.playlistList, item => (item.genreSlug));
    genresArray.push('browse');
    this.genres = genresArray;
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.cookies = new Cookies();

    if (this.state.user){
      base.bindToState(`${this.props.user.uid}Playlists`, {
        context: this,
        state: 'items'
      });
    }

  }

  componentWillMount(){
    _.map(this.props.playlistList, (item) => {
      return(
        _.map(item.playlists, (playlist) => {
          return(
            this.props.onPlaylistInit(playlist.playlistId, item.genreSlug)
          );
        })
      );
    })

    if (this.cookies.get('cookie')){
      let cookie = this.cookies.get('cookie');
      this.setState({
        user: cookie.user
      })
    }
  }

  login() {
    firebase.auth().signInWithPopup(provider).then(function(result) {

      var token = result.credential.accessToken;
      this.cookies.set('cookie', {token: token, user: result.user}, { path: '/', expires: expiry() });

      this.setState({
        user: result.user
      });

      // Check if user exists in firebase
      base.fetch(result.user.uid, {
        context: this,
        then(data){
          if (!data.userInfo){
            base.post(`${result.user.uid}`, {
              data: {
                 'userInfo':
                  {
                  name: result.user.displayName,
                  email: result.user.email,
                  uid: result.user.uid
                },
                'savedSongs': []
              }
            })
          }
        }
      });

    }.bind(this));
  }

  logout() {
    firebase.auth().signOut().then(function() {
      this.setState({user: null});
      this.cookies.remove('cookie');
    }.bind(this));
  }

  render() {

    return (
      <div className="App">

        <AppContents
          showPage={this.props.showPage}
          playlistList={this.props.playlistList}
          user={this.state.user}
          onPageSelect={this.props.onPageSelect}
          genres={this.genres}
          key={`${this.state.user}-app`}
        />

        { this.state.user ? (
            <div className="user-info">
            <img src={this.state.user.photoURL} alt=""/>
            <span>{this.state.user.displayName}</span>
            <button className="logout" onClick={this.logout}>Logout</button>
            </div>
          ) : (
            <div className="user-info">
            <button className="login" onClick={this.login}>Login</button>
            </div>
          )
        }

      </div>
    );
  }

}

function mapStateToProps(state){
  return{
    playlistList: state.playlistList,
    showPage: state.playlists.showPage,
    cachedPlaylists: state.playlists.cachedPlaylists,
  };
}

function mapDispatchToProps(dispatch){
  return bindActionCreators({ onPlaylistInit, onPageSelect }, dispatch);
}
export default connect(mapStateToProps, mapDispatchToProps)(App);
