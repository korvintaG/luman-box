import * as React from "react";

import "./App.css";
import { Outlet, useNavigation } from 'react-router-dom';
import { Location, useMatches, Routes, Route, ScrollRestoration } from "react-router-dom";

import { appRoutesURL } from "./router/AppRoutesURL";
import { AppHeaderUI } from "./Header/AppHeader";
import { AppFooterUI } from "./Footer/AppFooter";
import { AboutPage } from "../pages/AboutPage/AboutPage";
import { AuthorsListPage } from "../pages/AuthorsPage/AuthorsListPage/AuthorsListPage";
import { AuthorDetailsPage } from "../pages/AuthorsPage/AuthorDetailsPage/AuthorDetailsPage";
import { SourcesListPage } from "../pages/SourcesPage/SourcesListPage/SourcesListPage";
import { SourceDetailsPage } from "../pages/SourcesPage/SourceDetailsPage/SourceDetailsPage";
import { IdeasPage } from "../pages/IdeasPage/IdeasListPage/IdeasListPage";
import { IdeaDetailsPage } from "../pages/IdeasPage/IdeaDetailsPage/IdeaDetailsPage";
import { KeywordsListPage } from "../pages/KeywordsPage/KeywordsListPage/KeywordsListPage";
import { KeywordDetailsPage } from "../pages/KeywordsPage/KeywordDetailsPage/KeywordDetailsPage";
import {  InterconnectionsPage } from "../pages/InterconnectionsPage/InterconnectionsListPage/InterconnectionsListPage";
import { NotFoundPage } from "../pages/NotFoundPage/not-found-page";
import LoginPage from "../pages/LoginPage/login-page";
import { InterconnectionDetailsEditPage } from "../pages/InterconnectionsPage/InterconnectionDetailsPage/InterconnectionDetailsEditPage";
import { InterconnectionDetailsAddPage } from "../pages/InterconnectionsPage/InterconnectionDetailsPage/InterconnectionDetailsAddPage";
import { CMSPage } from "../pages/CMSPage/CMSPage";
import { Preloader } from "../shared/ui/Preloader";

function App() {
  let navigation = useNavigation();
  let getKey = React.useCallback(
    (location: Location, matches: ReturnType<typeof useMatches>) => {
      return location.pathname;
      let match = matches.find((m) => (m.handle as any)?.scrollMode);
      if ((match?.handle as any)?.scrollMode === "pathname") {
        return location.pathname;
      }

      return location.key;
    },
    []
  );


  return (
    <div className="App">
      <AppHeaderUI />
        <main>
          {navigation.state === "loading" ? <Preloader/>:
          <Outlet />}
        </main>
      <AppFooterUI />
      <ScrollRestoration getKey={getKey}/>
 
    </div>
  );
}

  /*    <Routes>


 {/*getKey={(location) => {
          console.log('ScrollRestoration',location)
            return location.pathname; // Восстанавливать скролл для каждого товара
          //}
          
          // По умолчанию - стандартное поведение
          return location.key;
        }

        <Route path={appRoutes.home} element={<AboutPage />} />
        <Route path={appRoutes.CMS} element={<CMSPage />} />
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
      </Routes>*/


export default App;
