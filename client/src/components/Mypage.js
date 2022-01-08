import React, { Fragment } from "react";
import { withRouter } from "react-router-dom";
import axios from "axios";

function Mypage(props) {
    function initWallet() {
        axios.post("/initWallet", (req, res) => {
            alert(res.data.message);
        });
    }
    return (
        <Fragment>
            <h2>마이페이지</h2>
            <button onClick={initWallet()}>개인지갑생성</button>
        </Fragment>
    );
}

export default withRouter(Mypage);
