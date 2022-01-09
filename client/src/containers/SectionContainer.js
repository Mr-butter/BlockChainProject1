import React from "react";
import MainSection from "../components/MainSection";
import { Route, Switch, withRouter } from "react-router-dom";
import Login from "../components/Login";
import Register from "../components/Register";
import Userpofile from "../components/Userpofile";
import Mypage from "../components/Mypage";

function SectionContainer(props) {
    return (
        <section className="section-container">
            <Switch>
                <Route path="/" exact render={() => [<MainSection />]} />
                <Route path="/login" render={() => [<Login />]} />
                <Route path="/register" render={() => [<Register />]} />
                <Route path="/mypage" render={() => [<Mypage />]} />
            </Switch>
        </section>
    );
}

export default withRouter(SectionContainer);
