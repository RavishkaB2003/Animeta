import React from 'react'

const MovieCard = ({
  anime: { title, coverImage, averageScore, countryOfOrigin, format, startDate },
}) => {
  return (
    <div className="movie-card group">
      {/* Poster Image */}
      <img
        src={coverImage?.large || '/No-Poster.png'}
        alt={title?.english || title?.romaji || 'Anime Poster'}
        className="w-full h-90 object-cover rounded-2xl transition-transform duration-300 group-hover:scale-105"
      />

      {/* Hover Overlay */}
      <div className="movie-card-overlay">
        {/* Line 1: Anime Name */}
        <h3 title={title?.english || title?.romaji || title?.userPreferred}>
          {title?.english || title?.romaji || title?.userPreferred || 'Unknown Title'}
        </h3>

        {/* Line 2: Rating • Language • Year  |  Format */}
        <div className="content">
          <div className="flex items-center gap-1.5 min-w-0">
            <div className="rating">
              <img src="/star.svg" alt="Star Icon" />
              <p>{averageScore ? (averageScore / 10).toFixed(1) : 'N/A'}</p>
            </div>

            
            <p className="lang">{countryOfOrigin || 'JP'}</p>

            
            <p className="startDate">{startDate?.year || 'N/A'}</p>
          </div>

          {/* Automatically pushed to far right on all screens */}
          <p className="format">{format ? format.replaceAll('_', ' ') : 'TV'}</p>
        </div>
      </div>
    </div>
  )
}

export default MovieCard