import { createBrowserRouter } from "react-router-dom";
import { appRoutesURL } from "./AppRoutesURL";
import App from "../App";
import { AboutPage } from "../../pages/AboutPage/AboutPage";
import { CMSPage } from "../../pages/CMSPage/CMSPage";
import { AuthorListPage, AuthorDetailsPage, authorsLoad, authorLoad } from "../../domains/author/";
import { SourceListPage } from "../../domains/source/pages/SourceListPage";
import { SourceDetailsPage } from "../../domains/source/pages/SourceDetailsPage";
import { IdeasPage } from "../../domains/idea/pages/IdeasListPage";
import { IdeaDetailsPage } from "../../domains/idea/pages/IdeaDetailsPage";
import { InterconnectionsPage } from "../../domains/interconnection/pages/InterconnectionsListPage";
import { InterconnectionDetailsEditPage } from "../../domains/interconnection/pages/InterconnectionDetailsEditPage";
import { InterconnectionDetailsAddPage } from "../../domains/interconnection/pages/InterconnectionDetailsAddPage";
import { KeywordsListPage } from "../../domains/keyword/pages/KeywordsListPage";
import { KeywordDetailsPage } from "../../domains/keyword/pages/KeywordDetailsPage";
import LoginPage from "../../pages/LoginPage/login-page";
import { NotFoundPage } from "../../pages/NotFoundPage/not-found-page";
import { MainPage } from "../../pages/MainPage/MainPage";
import { TestPage, getArrayLoader } from "../../pages/TestPage/TestPage";
import ErrorPage from "../../pages/ErrorPage/ErrorPage";
import { ideasLoad } from "../../domains/idea/loaders/IdeasListLoader";
import { ideaEditLoad } from "../../domains/idea/loaders/IdeaDetailsEditLoader";
import { ideaAddLoad } from "../../domains/idea/loaders/IdeaDetailsAddLoader";
import { sourceListLoad } from "../../domains/source/loaders/SourceListLoader";
import { sourceEditLoad } from "../../domains/source/loaders/SourceDetailsEditLoader";
import { sourceAddLoad } from "../../domains/source/loaders/SourceDetailsAddLoader";
import { keywordsLoad } from "../../domains/keyword/loaders/KeywordsListLoader";
import { keywordLoad } from "../../domains/keyword/loaders/KeywordDetailsLoader";
import { interconnectionsLoad } from "../../domains/interconnection/loaders/InterconnectionsLoader";
import { interconnectionEditLoad } from "../../domains/interconnection/loaders/InterconnectionDetailsEditLoader";
import { interconnectionAddLoad } from "../../domains/interconnection/loaders/InterconnectionDetailsAddLoader";

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
        Component: AuthorListPage,
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
        Component: SourceListPage,
        loader: sourceListLoad,
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
      { path: appRoutesURL.keywordAdd, 
        Component: KeywordDetailsPage
        },
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
