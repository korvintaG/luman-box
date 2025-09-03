import * as React from "react";

import "./App.css";
import { Outlet, useNavigation } from 'react-router-dom';
import { Location, useMatches, ScrollRestoration } from "react-router-dom";

import { AppHeaderUI } from "./Header/AppHeader";
import { AppFooterUI } from "./Footer/AppFooter";
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

export default App;
