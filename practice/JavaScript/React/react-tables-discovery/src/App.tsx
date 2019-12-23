import React from "react";
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";
import ReactDataSheetComponents from "./ReactDataSheet";
import ReactDataGreedComponents from "./ReactDataGrid";
import ReactTableComponents from "./ReactTable";

const App: React.FC = () => {
  return (
    <>
      <BrowserRouter>
        <div>
          <nav>
            <ul>
              <li>
                <Link to="/reactDataSheet">ReactDataSheet</Link>
              </li>
              <li>
                <Link to="/reactDataGrid">ReactDataGrid</Link>
              </li>
              <li>
                <Link to="/reactTable">ReactTable</Link>
              </li>
            </ul>
          </nav>

          {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
          <Switch>
            <Route path="/reactDataSheet">
              <ReactDataSheetComponents />
            </Route>
            <Route path="/reactDataGrid">
              <ReactDataGreedComponents />
            </Route>
            <Route path="/reactTable">
              <ReactTableComponents />
            </Route>
          </Switch>
        </div>
      </BrowserRouter>
    </>
  );
};

export default App;
