import React from "react";

import { Route, Switch } from "react-router-dom";

import Dashboard from "../Pages/Dashboard";
import BlockDetail from "../Pages/BlockDetail";
import Mypage from "../Pages/Mypage";
import Testingboard from "../Pages/Testingboard";

const Routes = () => {
    return (
        <Switch>
            <Route path="/" exact component={Dashboard} />
            <Route path="/analytics" component={BlockDetail} />
            <Route path="/mypage" component={Mypage} />
            <Route path="/testing" component={Testingboard} />
        </Switch>
    );
};

export default Routes;
