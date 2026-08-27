export const BASE_URL = 
import.meta.VITE_ANILIST_API_URL || "https://graphql.anilist.co";

export const API_OPTIONS = {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
    }
};


