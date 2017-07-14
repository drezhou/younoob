import React from 'react';
import _ from 'lodash';
import regex from '../helpers/helper-functions';

const SearchResult = (props)=> {


    let title = props.result.snippet.title;
    let trimmedTitle = regex.truncate(title, 40);
    let channelTitle = props.result.snippet.channelTitle;


    // List items songs
    if (props.result.id.kind === "youtube#video"){

      if (!props.result.duration){
        return (
          <tr className="list-item">
                <td className="list-save"></td>
                <td className="list-track">Loading...</td>
                <td className="list-artist"></td>
                <td className="list-duration"></td>
                <td className="list-play-count"></td>
          </tr>
        )
      }

      // Modifying the returned object to match what songController is expecting
      let modifiedResult = props.result;

      let vid = {};
      vid.videoId = modifiedResult.id.videoId;
      modifiedResult.snippet.resourceId = vid;

      let ctitle = modifiedResult.snippet.channelTitle;
      modifiedResult.channelTitle = ctitle;

      let duration = props.result.duration;
      let viewCount = props.result.viewCount;


      // Add css selected class
      var addSelectedClass;
      if (props.selectedSong == null){
        addSelectedClass = 'list-item';
      } else {
        if (props.selectedSong.snippet.resourceId.videoId === modifiedResult.snippet.resourceId.videoId){
          addSelectedClass = 'list-item selected';
        } else {
          addSelectedClass = 'list-item';
        }
      };

      function renderSaveRemoveButton(){

        let modifiedResult = _.cloneDeep(props.result);
        modifiedResult.id = props.result.id.videoId;

        function songSave(){
          props.saveSong(modifiedResult);
          props.setSearchHistory();
        }

        if (props.user){

          if (props.index !== -1){
            return(
              <td className="list-remove-song" onClick={() => props.removeSong(props.index)}>&#x2713;</td>
            )
          } else {
            return(
              <td className="list-save-song" onClick={() => songSave()}>&#xff0b;</td>
            )
          }

        } else {
          return(
            <td className="list-save-song"></td>
          )
        }

      }

      function songSelect(){
        props.onVideoSelect(modifiedResult);
        props.setSearchHistory();
      }

      return (
        <tr className={addSelectedClass}>
          {renderSaveRemoveButton()}
          <td className="list-track" onClick={() => songSelect()}>{title}</td>
          <td className="list-artist" onClick={() => songSelect()}>{regex.editArtist(channelTitle)}</td>
          <td className="list-duration" onClick={() => songSelect()}>{regex.editDuration(duration)}</td>
          <td className="list-play-count" onClick={() => songSelect()}>{regex.editPlayCount(viewCount)}</td>
        </tr>
      )
    }

    // List items playlists
    if (props.result.id.kind === "youtube#playlist"){

      // Thumbnail logic
      let thumbnail;

      if(props.result.snippet.thumbnails){
        if (props.result.snippet.thumbnails.high){
          thumbnail = props.result.snippet.thumbnails.high.url;
        } else if (props.result.snippet.thumbnails.medium){
          thumbnail = props.result.snippet.thumbnails.medium.url;
        } else if (props.result.snippet.thumbnails.default){
          thumbnail = props.result.snippet.default.default.url;
        } else {
          thumbnail = null;
        }
      }

      function playlistSelect(){
        props.onSearchPlaylistInit(props.result.id.playlistId, 'yourmusic', thumbnail, title)
        props.setSearchHistory();
      }

      return (
        <li className="playlist-result col-xs-6 col-sm-4 col-md-3 col-lg-3" onClick={() => playlistSelect()}>
        <img src={thumbnail} alt=""/>
          <span>{trimmedTitle}</span>
        </li>
      )
    }

    // List items artists
    if (props.result.id.kind === "youtube#channel"){
      return (
        {/*<li className="artist-result col-xs-6 col-sm-4 col-md-3 col-lg-3">
        <img src={thumbnail} alt=""/>
          <span>{regex.editArtist(channelTitle)}</span>
        </li>*/}
      )
    }

}

export default SearchResult;
