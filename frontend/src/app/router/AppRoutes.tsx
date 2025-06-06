import { createBrowserRouter } from "react-router-dom";
import { appRoutesURL } from "./AppRoutesURL";
import App from "../App";
import { AboutPage } from "../../pages/AboutPage/AboutPage";
import { CMSPage } from "../../pages/CMSPage/CMSPage";
import { AuthorsListPage } from "../../pages/AuthorsPage/AuthorsListPage/AuthorsListPage";
import { AuthorDetailsPage } from "../../pages/AuthorsPage/AuthorDetailsPage/AuthorDetailsPage";
import { SourcesListPage } from "../../pages/SourcesPage/SourcesListPage/SourcesListPage";
import { SourceDetailsPage } from "../../pages/SourcesPage/SourceDetailsPage/SourceDetailsPage";
import { IdeasPage } from "../../pages/IdeasPage/IdeasListPage/IdeasListPage";
import { IdeaDetailsPage } from "../../pages/IdeasPage/IdeaDetailsPage/IdeaDetailsPage";
import { InterconnectionsPage } from "../../pages/InterconnectionsPage/InterconnectionsListPage/InterconnectionsListPage";
import { InterconnectionDetailsEditPage } from "../../pages/InterconnectionsPage/InterconnectionDetailsPage/InterconnectionDetailsEditPage";
import { InterconnectionDetailsAddPage } from "../../pages/InterconnectionsPage/InterconnectionDetailsPage/InterconnectionDetailsAddPage";
import { KeywordsListPage } from "../../pages/KeywordsPage/KeywordsListPage/KeywordsListPage";
import { KeywordDetailsPage } from "../../pages/KeywordsPage/KeywordDetailsPage/KeywordDetailsPage";
import LoginPage from "../../pages/LoginPage/login-page";
import { NotFoundPage } from "../../pages/NotFoundPage/not-found-page";
import { MainPage } from "../../pages/MainPage/MainPage";
import { TestPage, getArrayLoader } from "../../pages/TestPage/TestPage";
import { authorsLoad } from "../../pages/AuthorsPage/AuthorsListPage/Loaders/AuthorListLoader";
import ErrorPage from "../../pages/ErrorPage/ErrorPage";
import { authorLoad } from "../../pages/AuthorsPage/AuthorDetailsPage/Loaders/AuthorDetailsLoader";
import { ideasLoad } from "../../pages/IdeasPage/IdeasListPage/Loaders/IdeasListLoader";
import { ideaEditLoad } from "../../pages/IdeasPage/IdeaDetailsPage/Loaders/IdeaDetailsEditLoader";
import { ideaAddLoad } from "../../pages/IdeasPage/IdeaDetailsPage/Loaders/IdeaDetailsAddLoader";
import { sourcesLoad } from "../../pages/SourcesPage/SourcesListPage/Loaders/SourcesListLoader";
import { sourceEditLoad } from "../../pages/SourcesPage/SourceDetailsPage/Loaders/SourceDetailsEditLoader";
import { sourceAddLoad } from "../../pages/SourcesPage/SourceDetailsPage/Loaders/SourceDetailsAddLoader";
import { keywordsLoad } from "../../pages/KeywordsPage/KeywordsListPage/Loaders/KeywordsListLoader";
import { keywordLoad } from "../../pages/KeywordsPage/KeywordDetailsPage/Loaders/KeywordDetailsLoader";
import { interconnectionsLoad } from "../../pages/InterconnectionsPage/InterconnectionsListPage/Loaders/InterconnectionsLoader";
import { interconnectionEditLoad } from "../../pages/InterconnectionsPage/InterconnectionDetailsPage/Loaders/InterconnectionDetailsEditLoader";
import { interconnectionAddLoad } from "../../pages/InterconnectionsPage/InterconnectionDetailsPage/Loaders/InterconnectionDetailsAddLoader";

export const appRoutes = createBrowserRouter([
  {
    path: appRoutesURL.home,
    element: <App />,
    children: [
      { index: true, element: <AboutPage /> },
      {
        path: appRoutesURL.test,
        element: <TestPage />,
        loader: getArrayLoader,
      },
      { path: appRoutesURL.main, element: <MainPage /> },
      { path: appRoutesURL.CMS, element: <CMSPage /> },
      {
        path: appRoutesURL.authors,
        Component: AuthorsListPage,
        loader: authorsLoad,
        errorElement: <ErrorPage />,
      },
      { path: appRoutesURL.authorAdd, Component: AuthorDetailsPage },
      {
        path: appRoutesURL.author,
        Component: AuthorDetailsPage,
        loader: authorLoad,
        errorElement: <ErrorPage />,
      },
      {
        path: appRoutesURL.sources,
        Component: SourcesListPage,
        loader: sourcesLoad,
        errorElement: <ErrorPage />,
      },
      {
        path: appRoutesURL.sourceAdd,
        Component: SourceDetailsPage,
        loader: sourceAddLoad,
        errorElement: <ErrorPage />,
      },
      {
        path: appRoutesURL.source,
        Component: SourceDetailsPage,
        loader: sourceEditLoad,
        errorElement: <ErrorPage />,
      },
      {
        path: appRoutesURL.ideas,
        Component: IdeasPage,
        loader: ideasLoad,
        errorElement: <ErrorPage />,
      },
      {
        path: appRoutesURL.idea,
        Component: IdeaDetailsPage,
        loader: ideaEditLoad,
        errorElement: <ErrorPage />,
      },
      {
        path: appRoutesURL.ideaAdd,
        Component: IdeaDetailsPage,
        loader: ideaAddLoad,
        errorElement: <ErrorPage />,
      },
      {
        path: appRoutesURL.ideaFind,
        Component: IdeaDetailsPage,
        loader: ideaEditLoad,
        errorElement: <ErrorPage />,
      },
      {
        path: appRoutesURL.interconnections,
        Component: InterconnectionsPage,
        loader: interconnectionsLoad,
        errorElement: <ErrorPage />,
      },
      {
        path: appRoutesURL.interconnection,
        Component: InterconnectionDetailsEditPage,
        loader: interconnectionEditLoad,
        errorElement: <ErrorPage />,
      },
      {
        path: appRoutesURL.interconnectionAdd,
        element: <InterconnectionDetailsAddPage />,
        loader: interconnectionAddLoad,
        errorElement: <ErrorPage />,
      },
      {
        path: appRoutesURL.keywords,
        Component: KeywordsListPage,
        loader: keywordsLoad,
        errorElement: <ErrorPage />,
      },
      { path: appRoutesURL.keywordAdd, Component: KeywordDetailsPage },
      {
        path: appRoutesURL.keyword,
        Component: KeywordDetailsPage,
        loader: keywordLoad,
        errorElement: <ErrorPage />,
      },
      { path: appRoutesURL.auth, element: <LoginPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
