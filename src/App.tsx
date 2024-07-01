import React from 'react';
//import logo from './logo.svg';
import './App.css';
import {AppHeaderUI} from './components/app-header/app-header';
import { Routes, Route, useParams } from 'react-router-dom';
import {AboutPage} from './pages/about-page/about-page'
import {Authors} from './pages/authors-page/authors-page'
import {AuthorDetails} from './components/author-details/author-details'


function App() {
  return (
    <div className="App">
      <AppHeaderUI/>
      <Routes >
        <Route path='/' element={<AboutPage />} />
        <Route path='/authors' element={<Authors />} />
        <Route path='/authors/:id' element={<AuthorDetails />} />

      </Routes>
    </div>
  );
}

export default App;
