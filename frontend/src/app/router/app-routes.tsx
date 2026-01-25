import { createBrowserRouter } from "react-router-dom";
import { appRoutesURL } from "./app-routes-URL";
import App from "../App";
import { AboutPage } from "../../pages/AboutPage/AboutPage";
import { CMSPage } from "../../pages/CMSPage/CMSPage";
import { AuthorListPage, AuthorDetailsPage, authorsLoad, authorLoad } from "../../domains/author";
import { SourceListPage } from "../../domains/source/pages/source-list-page";
import { SourceDetailsPage } from "../../domains/source/pages/SourceDetailsPage";
import { IdeasPage } from "../../domains/idea/pages/idea-list-page";
import { IdeaDetailsPage } from "../../domains/idea/pages/idea-details-page";
import { InterconnectionsPage } from "../../domains/interconnection/pages/interconnection-list-page";
import { InterconnectionDetailsEditPage } from "../../domains/interconnection/pages/InterconnectionDetailsEditPage";
import { InterconnectionDetailsAddPage } from "../../domains/interconnection/pages/InterconnectionDetailsAddPage";
import { KeywordsListPage } from "../../domains/keyword/pages/keywords-list-page";
import { KeywordDetailsPage } from "../../domains/keyword/pages/keyword-details-page";
import LoginPage from "../../pages/LoginPage/login-page";
import { NotFoundPage } from "../../pages/NotFoundPage/not-found-page";
import { TestPage, getArrayLoader } from "../../pages/TestPage/TestPage";
import ErrorPage from "../../pages/ErrorPage/ErrorPage";
import { ideasLoad } from "../../domains/idea/loaders/IdeasListLoader";
import { ideaEditLoad } from "../../domains/idea/loaders/IdeaDetailsEditLoader";
import { ideaAddLoad } from "../../domains/idea/loaders/IdeaDetailsAddLoader";
import { sourceListLoad } from "../../domains/source/loaders/SourceListLoader";
import { sourceEditLoad } from "../../domains/source/loaders/SourceDetailsEditLoader";
import { sourceAddLoad } from "../../domains/source/loaders/SourceDetailsAddLoader";
import { keywordsLoad } from "../../domains/keyword/loaders/keywords-list-loader";
import { keywordLoad } from "../../domains/keyword/loaders/keyword-details-loader";
import { interconnectionsLoad } from "../../domains/interconnection/loaders/InterconnectionsLoader";
import { interconnectionEditLoad } from "../../domains/interconnection/loaders/InterconnectionDetailsEditLoader";
import { interconnectionAddLoad } from "../../domains/interconnection/loaders/InterconnectionDetailsAddLoader";
import { KeywordAddPage } from "../../domains/keyword/pages/keyword-add-page";
import { keywordAddLoad } from "../../domains/keyword/loaders/keyword-add-loader";

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
        path: appRoutesURL.interconnections,
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
        path:  appRoutesURL.keywords,
        Component: KeywordsListPage,
        loader: keywordsLoad,
        errorElement: <ErrorPage />,
      },
      { path: appRoutesURL.keywordAdd, 
        Component: KeywordAddPage,
        loader: keywordAddLoad,
        errorElement: <ErrorPage />
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
