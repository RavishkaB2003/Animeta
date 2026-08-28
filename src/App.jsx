import React from 'react';
import {Routes, Route} from 'react-router-dom';
import Home from './pages/Home';
import AnimeDetails from './pages/AnimeDetails';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/anime/:id" element={<AnimeDetails />} />
    </Routes>
  )
  
}

export default App