import React from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import { appRoutes } from "./AppRoutes";
import { AppHeaderUI } from "./components/app-header/app-header";
import { AppFooterUI } from "./components/app-footer/app-footer";
import { AboutPage } from "./pages/about-page/about-page";
import { AuthorsPage } from "./pages/authors-page/authors-page";
import { SourcesPage } from "./pages/sources-page/sources-page";
import { IdeasPage } from "./pages/ideas-page/ideas-page";
import { AuthorDetails } from "./pages/authors-page/author-details/author-details";
import { SourceDetails } from "./pages/sources-page/source-details/source-details";
import { IdeaDetails } from "./pages/ideas-page/idea-details/idea-details";
import { KeywordsPage } from "./pages/keywords-page/keywords-page";
import { KeywordDetails } from "./pages/keywords-page/keyword-details/keyword-details";
import { NotFoundPage } from "./pages/not-found-page/not-found-page";
import LoginPage from "./pages/login-page/login-page";

function App() {
  return (
    <div className="App">
      <AppHeaderUI />
      <Routes>
        <Route path={appRoutes.home} element={<AboutPage />} />
        <Route path={appRoutes.authors} element={<AuthorsPage />} />
        <Route path={appRoutes.author} element={<AuthorDetails />} />
        <Route path={appRoutes.authorAdd} element={<AuthorDetails />} />
        <Route path={appRoutes.sources} element={<SourcesPage />} />
        <Route path={appRoutes.source} element={<SourceDetails />} />
        <Route path={appRoutes.sourceAdd} element={<SourceDetails />} />
        <Route path={appRoutes.ideas} element={<IdeasPage />} />
        <Route path={appRoutes.idea} element={<IdeaDetails />} />
        <Route path={appRoutes.ideaAdd} element={<IdeaDetails />} />
        <Route path={appRoutes.ideaFind} element={<IdeaDetails />} />
        <Route path={appRoutes.keywords} element={<KeywordsPage />} />
        <Route path={appRoutes.keyword} element={<KeywordDetails />} />
        <Route path={appRoutes.keywordAdd} element={<KeywordDetails />} />
        <Route path={appRoutes.auth} element={<LoginPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <AppFooterUI />
    </div>
  );
}

export default App;
