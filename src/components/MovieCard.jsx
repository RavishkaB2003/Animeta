import React from 'react'

const MovieCard = ({
  anime: { title, coverImage, averageScore, countryOfOrigin, format }
}) => {
  return (
    <div className="movie-card group">
      {/* Poster Image (scales slightly on hover) */}
      <img
        src={coverImage?.large || '/No-Poster.png'}
        alt={title?.english || title?.romaji || 'Anime Poster'}
        className="w-full h-[360px] object-cover rounded-2xl transition-transform duration-300 group-hover:scale-105"
      />

      {/* Hover Overlay: hidden by default, smoothly reveals on hover */}
      <div className="movie-card-overlay">
        {/* Line 1: Anime Name */}
        <h3 title={title?.english || title?.romaji || title?.userPreferred}>
          {title?.english || title?.romaji || title?.userPreferred || 'Unknown Title'}
        </h3>

        {/* Line 2: Star + Rating • Language */}
        <div className="content">
          <div className="rating">
            <img src="/star.svg" alt="Star Icon" />
            <p>{averageScore ? (averageScore / 10).toFixed(1) : 'N/A'}</p>
          </div>

          <span className="dot">•</span>

          <p className="lang">{countryOfOrigin || 'JP'}</p>

          <p className="format">{format || 'TV'}</p>

        </div>
      </div>
    </div>
  )
}

export default MovieCard