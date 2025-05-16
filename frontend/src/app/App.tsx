import React from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import { appRoutes } from "./router/AppRoutes";
import { AppHeaderUI } from "./Header/AppHeader";
import { AppFooterUI } from "./Footer/AppFooter";
import { AboutPage } from "../pages/AboutPage/AboutPage";
import { AuthorsListPage } from "../pages/AuthorsPage/AuthorsListPage";
import { AuthorDetailsPage } from "../pages/AuthorsPage/AuthorDetailsPage";
import { SourcesListPage } from "../pages/SourcesPage/SourcesListPage";
import { SourceDetailsPage } from "../pages/SourcesPage/SourceDetailsPage";
import { IdeasPage } from "../pages/IdeasPage/IdeasListPage";
import { IdeaDetailsPage } from "../pages/IdeasPage/IdeaDetailsPage";
import { KeywordsListPage } from "../pages/KeywordsPage/KeywordsListPage";
import { KeywordDetailsPage } from "../pages/KeywordsPage/KeywordDetailsPage";
import {  InterconnectionsPage } from "../pages/InterconnectionsPage/InterconnectionsListPage";
import { NotFoundPage } from "../pages/NotFoundPage/not-found-page";
import LoginPage from "../pages/LoginPage/login-page";
import { InterconnectionDetailsEditPage } from "../pages/InterconnectionsPage/InterconnectionDetailsEditPage";
import { InterconnectionDetailsAddPage } from "../pages/InterconnectionsPage/InterconnectionDetailsAddPage";

function App() {
  return (
    <div className="App">
      <AppHeaderUI />
      <Routes>
        <Route path={appRoutes.home} element={<AboutPage />} />
        <Route path={appRoutes.authors} element={<AuthorsListPage />} />
        <Route path={appRoutes.author} element={<AuthorDetailsPage />} />
        <Route path={appRoutes.authorAdd} element={<AuthorDetailsPage />} />
        <Route path={appRoutes.sources} element={<SourcesListPage />} />
        <Route path={appRoutes.source} element={<SourceDetailsPage />} />
        <Route path={appRoutes.sourceAdd} element={<SourceDetailsPage />} />
        <Route path={appRoutes.ideas} element={<IdeasPage />} />
        <Route path={appRoutes.idea} element={<IdeaDetailsPage />} />
        <Route path={appRoutes.ideaAdd} element={<IdeaDetailsPage />} />
        <Route path={appRoutes.ideaFind} element={<IdeaDetailsPage />} />
        <Route path={appRoutes.ideaInterconnections} element={<InterconnectionsPage />} />
        <Route path={appRoutes.ideaInterconnection} element={<InterconnectionDetailsEditPage />} />
        <Route path={appRoutes.ideaInterconnectionAdd} element={<InterconnectionDetailsAddPage />} />
        <Route path={appRoutes.ideaAdd} element={<IdeaDetailsPage />} />
        <Route path={appRoutes.keywords} element={<KeywordsListPage />} />
        <Route path={appRoutes.keyword} element={<KeywordDetailsPage />} />
        <Route path={appRoutes.keywordAdd} element={<KeywordDetailsPage />} />
        <Route path={appRoutes.auth} element={<LoginPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <AppFooterUI />
    </div>
  );
}

export default App;
