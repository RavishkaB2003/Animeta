import { Client, Databases, ID, Query } from 'appwrite';

const VITE_APPWRITE_PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const VITE_APPWRITE_DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const VITE_APPWRITE_TABLE_ID = import.meta.env.VITE_APPWRITE_TABLE_ID;
const VITE_APPWRITE_ENDPOINT = import.meta.env.VITE_APPWRITE_ENDPOINT;

const client = new Client()
    .setEndpoint(VITE_APPWRITE_ENDPOINT)
    .setProject(VITE_APPWRITE_PROJECT_ID);

const database = new Databases(client);

export const updateSearchCount = async (searchTerm, movie) => {
    if (!searchTerm || !movie) return;

    try {
        // 1. Check if the search term already exists in Appwrite
        const result = await database.listDocuments(
            VITE_APPWRITE_DATABASE_ID,
            VITE_APPWRITE_TABLE_ID,
            [Query.equal('searchTerm', searchTerm.toLowerCase().trim())]
        );

        if (result.documents.length > 0) {
            // 2. If it exists, increment the count
            const doc = result.documents[0];
            await database.updateDocument(
                VITE_APPWRITE_DATABASE_ID,
                VITE_APPWRITE_TABLE_ID,
                doc.$id,
                {
                    count: doc.count + 1,
                }
            );
            console.log(`Updated search count for "${searchTerm}" to ${doc.count + 1}`);
        } else {
            // 3. If it doesn't exist, create a new record
            await database.createDocument(
                VITE_APPWRITE_DATABASE_ID,
                VITE_APPWRITE_TABLE_ID,
                ID.unique(),
                {
                    searchTerm: searchTerm.toLowerCase().trim(),
                    count: 1,
                    movie_id: movie.id,
                    poster_url: movie.coverImage?.large || 'https://via.placeholder.com/300x450',
                }
            );
            console.log(`Created new metric entry for "${searchTerm}"`);
        }
    } catch (error) {
        console.error('Error updating search count in Appwrite:', error);
    }
};


export const getTrendingAnime = async () => {
    try {
        const result = await database.listDocuments(VITE_APPWRITE_DATABASE_ID, VITE_APPWRITE_TABLE_ID, [
            Query.limit(5),
            Query.orderDesc('count')
        ])

        return result.documents;

    } catch (error) {
        console.error('Error fetching trending anime:', error);
    }
}