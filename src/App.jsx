import React, { useState, useEffect } from 'react'
import Search from './components/Search'
import { API_OPTIONS, BASE_URL } from './config/api';
import Bars from './components/Bars';
import MovieCard from './components/MovieCard';
import useDebounce from './hooks/useDebounce';
import { updateSearchCount } from './config/appwrite';
import { getTrendingAnime } from './config/appwrite';
import TrendingCard from './components/TrendingCard';

const App = () => {
  const [searchTerm, setSearchTerm] = useState(''); // Initial search term
  const debouncedSearchTerm = useDebounce(searchTerm, 500); // Debounced search term to limit API calls


  const [errorMessage, setErrorMessage] = useState(''); // State to hold error messages
  const [animeList, setAnimeList] = useState([]); // State to hold the list of anime results
  const [isloading, setIsLoading] = useState(false); // State to indicate loading state
  
  const [trendingAnime, setTrendingAnime] = useState([]); // State to hold trending anime data
  const [isTrendingLoading, setIsTrendingLoading] = useState(false); // State to indicate loading state for trending anime
  const [trendingError, setTrendingError] = useState(''); // State to hold error messages for trending anime

  
  
  // Function to fetch anime data from the API
  const fetchAnime = async (query = '') => {
    //start loading state
    setIsLoading(true);
    setErrorMessage(''); // Clear any previous error messages

    try {
      //If query is empty do not send a search request to the API
      const isSearchQuery = Boolean(query && query.trim());
      //GraphQL query to fetch anime data based on the search term
      const response = await fetch (BASE_URL, {
        ...API_OPTIONS,
        body: JSON.stringify({
          query: `
            query SearchAnime($search: String) {
              Page(page: 1, perPage: 18) {
                media(search: $search, type: ANIME, sort: POPULARITY_DESC){
                  id
                  title {
                    english
                    romaji
                    userPreferred
                    }
                    coverImage {
                      large
                    }
                      averageScore
                      countryOfOrigin
                      format
                      genres
                      startDate {
                        year
                    }
                        }
                      }
                    }`,
                    variables: isSearchQuery ? {search: query.trim()} : {},
                      
                                   
        }),
      });

     

     
      // Parse the response data
       const data = await response.json();

      
        // Handle errors if the response is not ok or if there are errors in the data
       if (!response.ok || data.errors) {
        throw new Error(data.errors?.[0]?.message || 'Failed to fetch anime');
      }

      //If request is sucessful, but no anime is found for the search term
      const animeResults = data.data.Page.media;
      if(animeResults.length === 0){
        setAnimeList([]);
        setErrorMessage('No anime found');
        return;
      }


      // Update the anime list state with the fetched data
      setAnimeList(data.data.Page.media);

      if (query && animeResults.length > 0) {
        // Update the search count in Appwrite for the first anime result
        await updateSearchCount(query, animeResults[0]);
      }

    } catch (error){
      console.error('Error fetching anime:', error)
      setErrorMessage('Failed to fetch anime. Please try again later.')
    } finally {
      // End loading state
      setIsLoading(false);
    }
  };

  const loadTrendingAnime = async () => {

    setIsTrendingLoading(true);
      setTrendingError('');
    try {
      const trendingAnime = await getTrendingAnime();
      setTrendingAnime(trendingAnime || []);

    } catch (error) {
      console.error('Error fetching trending anime:', error);
      setTrendingError('Failed to fetch trending anime. Please try again later.');
      
    } finally {
      setIsTrendingLoading(false);
    }
  }


  useEffect(() => {
    
    fetchAnime(debouncedSearchTerm);

  }, [debouncedSearchTerm]);


  useEffect( () => {
    loadTrendingAnime();
    }, []);


  return (
    <main>
      <div className = "pattern" />

      <div className = "wrapper">
        <header>
          <img src = "/hero-img.png" alt = "hero-img" />
          <h1>  <span className='text-gradient'>Discover</span> Your Next Anime</h1>
          <h3 className="text-white font-bold text-center">Explore anime, genres, ratings, and everything you need to know</h3>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header> 
        
          <section className = "trending">
            <h2>Trending Anime</h2>

            {isTrendingLoading ? (
              <div className="loading-container">
                <Bars className= " h-10 w-10 text-light-100" bars={4}/>
              </div>
            ) : trendingError ? (
              <p className="text-red-500 text-center">{trendingError}</p>
            ) : trendingAnime.length > 0 ? (
              <ul>
                {trendingAnime.map((anime, index) => (
                  <TrendingCard key={anime.$id} anime={anime} index={index} />
                ))}
              </ul>
            ) : (
              <p className = "text-gray-100 text-sm text-center py-6">
                No trending anime available at the moment.
              </p>
            )
            }
          </section>
       


        <section className = "all-movies">
          <h2 className="mt-10">Popular Anime</h2>

          {isloading ? (
            <div className="loading-container">
              <Bars className= " h-10 w-10 text-light-100" bars={4}/>
            </div>
          ) : errorMessage ? (
            <p className="text-red-500 text-center">{errorMessage}</p>
          ) : (
            <ul>
              {animeList.map((anime) => (
                <MovieCard key={anime.id} anime={anime} />
              ))}
            </ul>
          )}

          

          

        </section>
        
      </div>

      
       
    </main>
  )
}

export default App