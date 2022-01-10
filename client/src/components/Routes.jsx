import React from "react";

import { Route, Switch } from "react-router-dom";

import Dashboard from "../Pages/Dashboard";
import BlockDetail from "../Pages/BlockDetail";

const Routes = () => {
  return (
    <Switch>
      <Route path="/" exact component={Dashboard} />
      <Route path="/analytics" component={BlockDetail} />
    </Switch>
  );
};

export default Routes;
