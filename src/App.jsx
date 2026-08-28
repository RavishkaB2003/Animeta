import React, { useState, useEffect } from 'react'
import Search from './components/Search'
import { API_OPTIONS, BASE_URL } from './config/api';
import Bars from './components/Bars';
import MovieCard from './components/MovieCard';
import useDebounce from './hooks/useDebounce';

const App = () => {
  const [searchTerm, setSearchTerm] = useState(''); // Initial search term
  const [errorMessage, setErrorMessage] = useState(''); // State to hold error messages
  const [animeList, setAnimeList] = useState([]); // State to hold the list of anime results
  const [isloading, setIsLoading] = useState(false); // State to indicate loading state
  const debouncedSearchTerm = useDebounce(searchTerm, 500); // Debounced search term to limit API calls

  
  
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

    } catch (error){
      console.error('Error fetching anime:', error)
      setErrorMessage('Failed to fetch anime. Please try again later.')
    } finally {
      // End loading state
      setIsLoading(false);
    }
  };


  useEffect(() => {
    
    fetchAnime(debouncedSearchTerm);

  }, [debouncedSearchTerm]);


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