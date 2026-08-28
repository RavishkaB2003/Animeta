import React from 'react'
import { useParams, Link } from 'react-router-dom';

const AnimeDetails = () => {
  const { id} = useParams();

  return (
    <main className= "min-h-screen bg-primary text-white p-10">
        <Link to="/" className="text-light-100 hover:underline">
        ← Back to Home
        </Link>
        <h1 className="text-3xl font-bold mt-6">Anime Details for ID: {id}</h1>
        <p className="text-gray-400 mt-2">We will build this design next.</p>
    </main>
  )
}

export default AnimeDetails