import React from "react";

import { Route, Switch } from "react-router-dom";

import Dashboard from "../Pages/Dashboard";
import Analytics from "../Pages/Analytics";
import Mining from "../Pages/Mining";
import Mypage from "../Pages/Mypage";
import Testingboard from "../Pages/Testingboard";

const Routes = () => {
  return (
    <Switch>
      <Route path="/" exact component={Dashboard} />
      {/* <Route path="/analytics" component={Analytics} /> */}
      <Route path="/mining" component={Mining} />
      <Route path="/mypage" component={Mypage} />
      {/* <Route path="/testing" component={Testingboard} /> */}
    </Switch>
  );
};

export default Routes;
