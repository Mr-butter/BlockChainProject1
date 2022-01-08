import React from "react";
import HeaderContainer from "./HeaderContainer";
import SectionContainer from "./SectionContainer";
import { withRouter } from "react-router-dom";

function MainBody(props) {
    return (
        <div className="main-body">
            <HeaderContainer />
            <SectionContainer />
        </div>
    );
}

export default withRouter(MainBody);
