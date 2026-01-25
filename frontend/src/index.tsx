import React, { Suspense, useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, useNavigation } from "react-router-dom";
import { Provider } from "react-redux";
import reportWebVitals from "./reportWebVitals";
import { HelmetProvider } from "react-helmet-async";
import "./assets/fonts/fonts.css";
import "./index.css";
import { store } from "./shared/services/store";
import { appRoutes } from "./app/router/app-routes";
import { Preloader } from "./shared/ui/Preloader";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
/*future={{ v7_relativeSplatPath: true, v7_startTransition: true }}*/

function GlobalLoader() {
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    setIsInitialLoad(false);
  }, []);

  if (isInitialLoad) {
    return <Preloader />;
  }

  return null;
}

root.render(
  <Provider store={store}>
    <HelmetProvider>
      <RouterProvider
        router={appRoutes}
        fallbackElement={<Preloader />}
        future={{ v7_startTransition: true }}
      />
    </HelmetProvider>
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
