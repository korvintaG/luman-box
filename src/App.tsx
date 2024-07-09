import React from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import { AppHeaderUI } from './components/app-header/app-header';
import { AppFooterUI } from './components/app-footer/app-footer';
import { AboutPage } from './pages/about-page/about-page'
import { Authors } from './pages/authors-page/authors-page'
import { Sources } from './pages/sources-page/sources-page'
import { Ideas } from './pages/ideas-page/ideas-page';
import { AuthorDetails } from './components/author-details/author-details'
import { SourceDetails } from './components/source-details/source-details'
import { IdeaDetails } from './components/idea-details/idea-details'
import { Keywords } from './pages/keywords-page/keywords-page';
import { KeywordDetails } from './components/keyword-details/keyword-details'

function App() {
  return (
    <div className="App">
      <AppHeaderUI />
      <Routes >
        <Route path='/' element={<AboutPage />} />
        <Route path='/authors' element={<Authors />} />
        <Route path='/authors/:id' element={<AuthorDetails />} />
        <Route path='/authors/add' element={<AuthorDetails />} />
        <Route path='/sources' element={<Sources />} />
        <Route path='/sources/:id' element={<SourceDetails />} />
        <Route path='/sources/add' element={<SourceDetails />} />
        <Route path='/ideas' element={<Ideas />} />
        <Route path='/ideas/:id' element={<IdeaDetails />} />
        <Route path='/ideas/add' element={<IdeaDetails />} />
        <Route path='/keywords' element={<Keywords />} />
        <Route path='/keywords/:id' element={<KeywordDetails />} />
        <Route path='/keywords/add' element={<KeywordDetails />} />
      </Routes>
      <AppFooterUI />
    </div>
  );
}

export default App;
