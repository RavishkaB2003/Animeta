import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchAnimeDetails } from '../config/api';
import { updateSearchCount } from '../config/appwrite';  
import Bars from '../components/Bars';

const AnimeDetails = () => {
  // =========================================================================
  // 1. EXTRACT URL PARAMETERS & STATE
  // =========================================================================
  // useParams() extracts the dynamic ":id" from the URL (e.g. /anime/21 -> id = "21")
  const { id } = useParams();

  const [anime, setAnime] = useState(null); // Holds the full anime object from AniList
  const [isLoading, setIsLoading] = useState(true); // Loading spinner state
  const [errorMessage, setErrorMessage] = useState(''); // Error message state

  // =========================================================================
  // 2. FETCH ANIME DETAILS ON MOUNT OR ID CHANGE
  // =========================================================================
  useEffect(() => {
    const getDetails = async () => {
      setIsLoading(true);
      setErrorMessage('');

      try {
        // Call our GraphQL fetcher in api.js passing the integer ID
        const data = await fetchAnimeDetails(id);
        setAnime(data);

        const animeName = data.title?.english || data.title?.romaji || data.title?.userPreferred;
        if (animeName) {
          await updateSearchCount(animeName, {
            id: data.id,
            coverImage: data.coverImage,
          });
        }

      } catch (error) {
        console.error('Error loading anime details:', error);
        setErrorMessage('Failed to load anime details.');
      } finally {
        // Guaranteed to turn off loading regardless of success or failure
        setIsLoading(false);
      }
    };

    if (id) {
      getDetails();
    }
  }, [id]);

  // =========================================================================
  // 3. HELPER FUNCTIONS & CLEANERS
  // =========================================================================
  // AniList descriptions contain raw HTML tags (<br>, <i>). This regex strips them.
  const cleanDescription = anime?.description
    ? anime.description.replace(/<[^>]*>?/gm, '')
    : 'No description available.';

  // Formats { year: 2024, month: 12, day: 26 } into "December 26, 2024"
  const formatDate = (dateObj) => {
    if (!dateObj || !dateObj.year) return 'N/A';
    const { year, month, day } = dateObj;
    if (month && day) {
      const date = new Date(year, month - 1, day);
      return date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
    }
    return `${year}`;
  };

  // Mini-Component: Formats one single key-value row in the metadata table
  // sm:w-44 shrink-0 ensures all labels have identical width so right-side text aligns
  const DetailRow = ({ label, value }) => (
    <div className="flex flex-col sm:flex-row sm:items-start py-3 border-b border-white/5 gap-2 sm:gap-6">
      <span className="text-gray-400 font-medium text-sm sm:w-44 shrink-0">
        {label}
      </span>
      <span className="text-gray-200 text-sm leading-relaxed">
        {value || 'N/A'}
      </span>
    </div>
  );

  // =========================================================================
  // 4. MAIN JSX RENDER
  // =========================================================================
  return (
    <main className="min-h-screen bg-primary text-white relative">
      {/* Background radial glow effect */}
      <div className="pattern" />

      {/* Main page wrapper (centered, max width 1152px) */}
      <div className="wrapper max-w-6xl mx-auto px-5 py-10 relative z-10">
        
        {/* Navigation Link back to home page */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-light-200 hover:text-white transition-colors mb-6 text-sm font-medium"
        >
          ← Back to Discover
        </Link>

        {/* --- CONDITION A: LOADING SPINNER --- */}
        {isLoading ? (
          <div className="loading-container py-32 flex justify-center items-center">
            <Bars className="h-12 w-12 text-light-100" bars={4} />
          </div>
        ) : errorMessage ? (
          /* --- CONDITION B: ERROR MESSAGE --- */
          <div className="text-center py-20">
            <p className="text-red-500 text-lg mb-4">{errorMessage}</p>
            <Link to="/" className="text-light-100 underline">
              Return to Home
            </Link>
          </div>
        ) : anime ? (
          /* --- CONDITION C: ANIME DETAILS LOADED (Glassmorphism Card) --- */
          <div className="bg-dark-100/70 border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-md">
            
            {/* -------------------------------------------------------------
                SECTION 1: TITLE & RATING HEADER
            -------------------------------------------------------------- */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6">
              <div>
                {/* Anime Title: Fallbacks ensure we display whichever title is available */}
                <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight !text-left !mx-0">
                  {anime.title?.english || anime.title?.romaji || anime.title?.userPreferred}
                </h1>

                {/* Subtitle Metadata: Year • Format • Episode Count • Episode Duration */}
                <div className="flex items-center gap-3 text-gray-400 text-sm mt-2">
                  <span>{anime.startDate?.year || 'N/A'}</span>
                  <span>•</span>
                  <span className="capitalize">{anime.format ? anime.format.replaceAll('_', ' ') : 'TV'}</span>
                  <span>•</span>
                  <span>
                    {anime.episodes ? `${anime.episodes} eps` : ''}{' '}
                    {anime.duration ? `(${anime.duration}m/ep)` : ''}
                  </span>
                </div>
              </div>

              {/* Top-Right Badges */}
              <div className="flex items-center gap-3 shrink-0">
                {/* Score Pill (e.g. AniList 89 -> 8.9/10) */}
                <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-4 py-2 rounded-xl">
                  <span className="text-yellow-400">★</span>
                  <span className="font-bold text-sm text-white">
                    {anime.averageScore ? (anime.averageScore / 10).toFixed(1) : 'N/A'}
                  </span>
                  <span className="text-gray-400 text-xs">/10</span>
                  {anime.popularity && (
                    <span className="text-gray-400 text-xs ml-1">
                      ({(anime.popularity / 1000).toFixed(0)}k)
                    </span>
                  )}
                </div>

                {/* Status Badge */}
                <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3.5 py-2 rounded-xl text-gray-300 text-xs font-medium">
                  <span>📈</span>
                  <span className="capitalize">{anime.status ? anime.status.replaceAll('_', ' ') : 'Anime'}</span>
                </div>
              </div>
            </div>

            {/* -------------------------------------------------------------
                SECTION 2: MEDIA GRID (1/3 Poster vs 2/3 Live Trailer Backdrop)
            -------------------------------------------------------------- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6">
              
              {/* Left Column (1/3): High-Res Vertical Poster */}
              <div className="md:col-span-1 h-[400px] rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-dark-100">
                <img
                  src={anime.coverImage?.extraLarge || anime.coverImage?.large || '/No-Poster.png'}
                  alt={anime.title?.english || 'Poster'}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Right Column (2/3): Live Autoplaying YouTube Trailer Banner */}
              <div className="md:col-span-2 h-[400px] rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-dark-100 relative group">
                {anime.trailer?.site === 'youtube' && anime.trailer?.id ? (
                  /* YouTube Embed Player (Autoplay & Mute are required for background video) */
                  <iframe
                    src={`https://www.youtube.com/embed/${anime.trailer.id}?autoplay=1&mute=1&loop=1&playlist=${anime.trailer.id}&controls=1&rel=0&modestbranding=1`}
                    title="Anime Trailer"
                    className="w-full h-full object-cover"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  /* Fallback Backdrop Banner Image if no trailer exists */
                  <img
                    src={
                      anime.bannerImage ||
                      anime.coverImage?.extraLarge ||
                      anime.coverImage?.large ||
                      '/No-Poster.png'
                    }
                    alt="Backdrop Banner"
                    className="w-full h-full object-cover"
                  />
                )}

                {/* Multi-direction gradients: Softly blend edges so text is readable */}
                <div className="absolute inset-0 bg-gradient-to-t from-dark-100 via-dark-100/40 to-transparent pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-r from-dark-100/60 via-transparent to-transparent pointer-events-none" />

                
              </div>
            </div>

            {/* -------------------------------------------------------------
                SECTION 3: GENRES & ACTION BUTTON ROW
            -------------------------------------------------------------- */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-6 border-b border-white/10">
              
              {/* Genre Pills */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-gray-400 text-sm font-medium mr-2">Genres</span>
                {anime.genres?.map((genre) => (
                  <span
                    key={genre}
                    className="bg-white/5 border border-white/10 text-gray-200 text-xs px-3.5 py-1.5 rounded-lg"
                  >
                    {genre}
                  </span>
                ))}
              </div>

              {/* Purple Gradient CTA to visit official AniList page */}
              {anime.siteUrl && (
                <a
                  href={anime.siteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white text-sm font-semibold px-6 py-2.5 rounded-xl shadow-lg shadow-purple-500/20 transition-all hover:scale-105 shrink-0"
                >
                  Visit AniList <span>➔</span>
                </a>
              )}
            </div>

            {/* -------------------------------------------------------------
                SECTION 4: METADATA DETAILS GRID (Uses <DetailRow /> helper)
            -------------------------------------------------------------- */}
            <div className="mt-4 divide-y divide-white/5">
              <DetailRow label="Overview" value={cleanDescription} />
              <DetailRow label="Release date" value={formatDate(anime.startDate)} />
              <DetailRow
                label="Country of Origin"
                value={anime.countryOfOrigin === 'JP' ? 'Japan (JP)' : anime.countryOfOrigin}
              />
              <DetailRow
                label="Status"
                value={anime.status ? anime.status.replaceAll('_', ' ') : 'N/A'}
              />
              <DetailRow
                label="Format & Episodes"
                value={`${anime.format || 'TV'} • ${anime.episodes || 'TBA'} Episodes (${anime.duration || 'N/A'} mins each)`}
              />
              <DetailRow
                label="Studios"
                value={anime.studios?.nodes?.map((s) => s.name).join(', ') || 'N/A'}
              />
              <DetailRow
                label="Source Material"
                value={anime.source ? anime.source.replaceAll('_', ' ') : 'N/A'}
              />
              {anime.tags?.length > 0 && (
                <DetailRow
                  label="Tags"
                  value={anime.tags.slice(0, 6).map((t) => t.name).join(' • ')}
                />
              )}
            </div>

          </div>
        ) : null}
      </div>
    </main>
  );
};

export default AnimeDetails;