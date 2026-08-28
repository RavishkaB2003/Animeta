import React from 'react';
import {Link} from 'react-router-dom';

const TrendingCard = ({ anime, index }) => {
  return (
    <li className="flex flex-row items-center relative group cursor-pointer shrink-0">
      {/* Giant Stylized Rank Number */}
      <p className="fancy-text select-none group-hover:scale-105 transition-transform duration-300">
        {index + 1}
      </p>

      <Link to ={`/anime/${anime.movie_id}`} className="relative -ml-9 w-41.25 h-58.75 rounded-xl overflow-hidden shadow-lg shadow-black/60 bg-dark-100 border border-white/10 
      group-hover:scale-105 group-hover:border-purple-500/50 transition-all duration-300 block">

        {/* Poster Image */}
        <img
          src={anime.poster_url || '/No-Poster.png'}
          alt={anime.searchTerm || 'Trending Anime'}
          className="w-full h-full object-cover"
          loading="lazy"
        />


        {/* Bottom Gradient Overlay with Anime Title */}
        <div className="absolute inset-0 bg-gradient-to-t from-dark-100/90 via-transparent to-transparent flex items-end p-2.5 opacity-90 group-hover:opacity-100 transition-opacity">
          <p className="text-white text-xs font-semibold capitalize line-clamp-2 leading-tight drop-shadow-md">
            {anime.searchTerm}
          </p>
        </div>

      </Link>
    </li>
  );
};

export default TrendingCard;