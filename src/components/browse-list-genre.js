import React from 'react';

const GenreItem = (props) => {

  let thumb = {
    backgroundImage: 'url(' + process.env.PUBLIC_URL + '/images/genres/thumbs/' + props.genre.genreSlug + '.png)'
  }

  return(
    <div className="browse-genre col-xs-6 col-sm-4 col-md-3 col-lg-2">
    <div className="browse-genre-inner">
      <a
        className="browse-genre-link"
        id={props.genre.genreSlug}
        onClick={() => props.onPageSelect(props.genre.genreSlug)}
        style={thumb}
        >
          <span>{props.genre.genreTitle}</span>
        </a>
    </div>
    </div>
  )
}

export default GenreItem;
