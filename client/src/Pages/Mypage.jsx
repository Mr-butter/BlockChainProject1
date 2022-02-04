import React, { Fragment, useState } from "react";
import { useSelector } from "react-redux";
// import { withRouter } from "react-router-dom";
// import axios from "axios";
import styled from "styled-components";
import WalletTable from "../components/table/WalletTable";
import _ from "lodash";

// import Modal from "../components/walletModal/modal";
// import ModalStyles from "../walletModal/ModalStyles";

const Container = styled.div`
  display: flex;
  margin-left: 150px;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const Button = styled.button`
  padding: 16px 32px;
  border-radious: 30%;
  background: #202020;
  color: gold;
  font-size: 24px;
  margin-left: 44%;
  /* margin-bottom: 60%; */
  cursor: pointer;
`;

function Mypage(props) {
  const userState = useSelector((state) => state.user);
  const userAuth = userState.isAuth;
  const userAddress = userState.address;

  function asdf(Auth) {
    if (Auth) {
      return (
        <div className="table-wrapper" style={{ marginTop: "50px", marginRight: "100px" }}>
          <h2>My Wallet</h2>
          <br />
          <div>
            <div className="col-8" style={{ width: "1200px" }}>
              <div className="card" style={{ width: "900px" }}>
                <div className="card__header">
                  <h3>나만의 은행을 이용하세요.</h3>
                </div>
                <div className="card__body" style={{ width: "500px" }}>
                  <WalletTable />
                  <div>
                    {/* <Button
                      style={{
                        borderRadius: 10,
                        borderColor: "gold",
                        marginLeft: 270,
                        color: "gold",
                        size: 100,
                        padding: "10px",
                        // marginBottom: "25px",
                      }}
                      variant="outlined"
                    >
                      <a href="/transaction">보내기</a>
                    </Button> */}
                  </div>
                </div>
                <div className="card__footer"></div>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return <h1>로그인이 필요한 서비스 입니다.</h1>;
    }
  }

  return <Container>{asdf(userAuth)}</Container>;
}

export default Mypage;
