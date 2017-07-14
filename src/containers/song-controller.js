import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Cookies from 'universal-cookie';

// Actions
import { onReady, onVideoJump, restoreSelectedSong } from '../entities';

import YouTube from 'react-youtube';
import regex, { expiry } from '../helpers/helper-functions';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';


class SongController extends Component{

  constructor(props){
    super(props);

    this.state = {
      playerState: null,
      shuffle: false,
      mute: false,
      currentSongDuration: null,
      currentSongPosition: null,
    };

    // Player binds
    this.onPlayVideo = this.onPlayVideo.bind(this);
    this.onPauseVideo = this.onPauseVideo.bind(this);
    this.onNextVideo = this.onNextVideo.bind(this);
    this.onPreviousVideo = this.onPreviousVideo.bind(this);
    this.playerState = this.playerState.bind(this);
    this.toggleShuffle = this.toggleShuffle.bind(this);
    this.toggleMute = this.toggleMute.bind(this);
    this.onVolumeChange = this.onVolumeChange.bind(this);
    this.onScrubberChange = this.onScrubberChange.bind(this);

      this.scrubberInterval = setInterval(() => {
          let intervalRounded = Math.round(this.props.player.target.getCurrentTime());
          this.setState({
            currentSongPosition: intervalRounded
          });
      }, 1000);

      this.errorCount = 0;

    this.cookies = new Cookies();
    }

  componentWillMount(){
    //Restore selectedSong from cookie
    this.props.restoreSelectedSong(this.cookies.get('selectedSong'));
  }

  onPlayVideo() {
    this.props.player.target.playVideo();
  }

  onPauseVideo() {
    this.props.player.target.pauseVideo();
  }

  toggleShuffle() {
    if (this.state.shuffle === false){
      this.setState({
        shuffle: true
      });
    }else{
      this.setState({
        shuffle: false
      });
    }
  }

  onNextVideo() {
    const thisvid = this.props.que.indexOf(this.props.selectedSong);
    const increment = thisvid + 1;
    const randomIncrement = Math.floor(Math.random() * this.props.que.length) + 1;


    if (this.state.shuffle === true){
        this.props.onVideoJump(this.props.que[randomIncrement]);
      } else {
      if (thisvid < this.props.que.length - 1){
        this.props.onVideoJump(this.props.que[increment]);
      }
    }

    this.errorCount = 0;
  }

  onPreviousVideo() {
    const thisvid = this.props.que.indexOf(this.props.selectedSong);
    const increment = thisvid - 1;
    const randomIncrement = Math.floor(Math.random() * this.props.que.length) + 1;


    if (this.state.shuffle === true){
        this.props.onVideoJump(this.props.que[randomIncrement]);
      } else {
        if (thisvid > 0){
        this.props.onVideoJump(this.props.que[increment]);
      }
    }

    this.errorCount = 0;
  }

  playerState(){

    // Get current layer state from the iframe
    this.setState({
      playerState: event.data[32]
    })

    // Toggle logic for the play button
    if (this.state.playerState === '2') {
      document.getElementById("play").style.display = 'inline-block';
      document.getElementById("pause").style.display = 'none';
    } else {
      document.getElementById("play").style.display = 'none';
      document.getElementById("pause").style.display = 'inline-block';
    }

    // Go to next video if the song ends
    if (this.state.playerState === '0' ){
      this.onNextVideo();
    }

    // Reset error count if song plays successfully
    if (this.state.playerState === '1'){
      this.errorCount = 0;
    }

    // Grab song duration
    let rounded = Math.round(this.props.player.target.getDuration());
    this.setState({
      currentSongDuration: rounded
    })

  }

  timeConversion(totalseconds){

    // Hours, minutes and seconds
    var hrs = ~~(totalseconds / 3600);
    var mins = ~~((totalseconds % 3600) / 60);
    var secs = totalseconds % 60;

    // Output like "1:01" or "4:03:59" or "123:03:59"
    var ret = "";

    if (hrs > 0) {
        ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
    }

    ret += "" + mins + ":" + (secs < 10 ? "0" : "");
    ret += "" + secs;
    return ret;

  }


  onVolumeChange = (value) => {
    this.props.player.target.setVolume(value);
  }

  onScrubberChange = (value) => {
    this.props.player.target.seekTo(value, true);
  }

  onSliderChange = (value) => {
    this.setState({
      currentSongPosition: value,
    });
  }

  toggleMute() {
    if (this.state.mute === false){
      this.props.player.target.mute();
      this.setState({
        mute: true
      });
    }else{
      this.props.player.target.unMute();
      this.setState({
        mute: false
      });
    }
  }

  render(){

    // If there's no currently selected song
    if (!this.props.selectedSong) {
      return(
      <div className="song-controller">
        <div className="details col-xs-3">
        </div>

        <div className="controls col-xs-6">
          <div className="buttons">
            <button id="shuffle" className={"controller-buttons"} />
            <button id="prev" className={"controller-buttons"} />
            <button id="play" className={"controller-buttons"} />
            <button id="pause" className={"controller-buttons"} />
            <button id="next" className={"controller-buttons"} />
          </div>

          <div className="scrubber">
            <div className="scrubber-current-time"></div>
            <div className="scrubber-slider">
            <Slider value={0}
              max={100}
            />
            </div>
            <div className="scrubber-song-duration"></div>
          </div>

        </div>

        <div className="volume col-xs-3">
          <div className="volume-slider">
            <Slider
              defaultValue={50}
            />
          </div>
          <button id="mute" className="controller-buttons" />
        </div>
      </div>
      )
    }

    // Set selectedSong cookie
    this.cookies.set('selectedSong', this.props.selectedSong, { path: '/', expires: expiry() });

    // Autoplay options
    let opts = {
      playerVars: {
        autoplay: this.props.autoplay
      }
    };

    // Toggle Shuffle css
    let toggleShuffleClass;
    if (this.state.shuffle === true){
      toggleShuffleClass = 'controller-buttons shuffle-selected';
    } else {
      toggleShuffleClass = 'controller-buttons';
    }

    // Toggle Muted css
    let toggleMutedClass;
    if (this.state.mute === true){
      toggleMutedClass = 'controller-buttons mute-selected';
    } else {
      toggleMutedClass = 'controller-buttons';
    }

    // Skip song if error
    if (this.state.playerState === '-'){
      this.errorCount++;
      if (this.errorCount > 8){
        this.onNextVideo();
      }
    }

    return(

      <div className="song-controller">

        <div className="details col-xs-3">
          <div className="song-controller-thumbnail">
            <img src={this.props.selectedSong.snippet.thumbnails.default.url} alt=""/>
          </div>

          <div className="track">{regex.editTitle(this.props.selectedSong.snippet.title)}</div>
          <div className="artist">{regex.editArtist(this.props.selectedSong.channelTitle)}</div>
        </div>

        <div className="controls col-xs-6">
          <div className="buttons">
            <button id="shuffle" className={toggleShuffleClass} onClick={this.toggleShuffle} />
            <button id="prev" className={"controller-buttons"} onClick={this.onPreviousVideo} />
            <button id="play" className={"controller-buttons"} onClick={this.onPlayVideo} />
            <button id="pause" className={"controller-buttons"} onClick={this.onPauseVideo} />
            <button id="next" className={"controller-buttons"} onClick={this.onNextVideo} />
          </div>

          <div className="scrubber">
            <div className="scrubber-current-time">{this.timeConversion(this.state.currentSongPosition)}</div>
            <div className="scrubber-slider">
            <Slider value={this.state.currentSongPosition}
              max={this.state.currentSongDuration}
              onChange={this.onSliderChange}
              onAfterChange={this.onScrubberChange}
            />
            </div>
            <div className="scrubber-song-duration">{this.timeConversion(this.state.currentSongDuration)}</div>
          </div>

        </div>

        <div className="volume col-xs-3">
          <div className="volume-slider">
            <Slider
              defaultValue={50}
              onChange={this.onVolumeChange}
            />
          </div>
          <button id="mute" className={toggleMutedClass} onClick={this.toggleMute} />
        </div>

        <div className="video-detail">
            <YouTube
              videoId={this.props.selectedSong.snippet.resourceId.videoId}
              opts={opts}
              onReady={this.props.onReady}
              onStateChange={this.playerState}
              onPlay={this.props.onPlayVideo}
            />
        </div>

      </div>
    );
  }

  componentWillUnmount(){
    clearInterval(this.scrubberInterval);
  }
}

function mapStateToProps(state){
  return{
    player: state.songController.player,
    selectedSong: state.songController.selectedSong,
    que: state.songController.que,
    autoplay: state.songController.autoplay,
  };
}

function mapDispatchToProps(dispatch){
  return bindActionCreators({ onReady, onVideoJump, restoreSelectedSong }, dispatch);
}
export default connect(mapStateToProps, mapDispatchToProps)(SongController);
