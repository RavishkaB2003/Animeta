export const BASE_URL = 
import.meta.VITE_ANILIST_API_URL || "https://graphql.anilist.co";

export const API_OPTIONS = {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
    }
};


// 1. GraphQL Query for Full Anime Details
export const ANIME_DETAILS_QUERY = `
  query GetAnimeDetails($id: Int) {
    Media(id: $id, type: ANIME) {
      id
      title {
        english
        romaji
        native
        userPreferred
      }
      description(asHtml: false)
      bannerImage
      coverImage {
        extraLarge
        large
        color
      }
      averageScore
      popularity
      format
      status
      episodes
      duration
      genres
      startDate {
        year
        month
        day
      }
      countryOfOrigin
      source
      studios(isMain: true) {
        nodes {
          id
          name
          siteUrl
        }
      }
      siteUrl
      trailer {
        id
        site
        thumbnail
      }
      tags {
        id
        name
      }
    }
  }
`;
// 2. Helper function to fetch details by ID
export const fetchAnimeDetails = async (id) => {
  const response = await fetch(BASE_URL, {
    ...API_OPTIONS,
    body: JSON.stringify({
      query: ANIME_DETAILS_QUERY,
      variables: { id: parseInt(id, 10) },
    }),
  });
  const data = await response.json();
  if (!response.ok || data.errors) {
    throw new Error(data.errors?.[0]?.message || 'Failed to fetch anime details');
  }
  return data.data.Media;
};



