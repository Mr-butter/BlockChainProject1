import React, { useState } from "react";
// import { withRouter } from "react-router-dom";
// import axios from "axios";
import styled from "styled-components";
import WalletTable from "../components/table/WalletTable";

// import Modal from "../components/walletModal/modal";
// import ModalStyles from "../walletModal/ModalStyles";

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const Button = styled.button`
  padding: 16px 32px;
  border-radious: 30%;
  background: #000000;
  color: gold;
  font-size: 24px;
  margin-left: 44%;
  margin-bottom: 60%;
  cursor: pointer;
`;

function Mypage(props) {
  const [showModal, setShowModal] = useState(false);

  const openModal = () => {
    setShowModal((prev) => !prev);
  };

  //   function initWallet() {
  //     axios.post("/initWallet", (req, res) => {
  //       alert(res.data.message);
  //     });
  //   }
  return (
    <Container>
      <div className="table-wrapper">
        <h2>My Wallet</h2>
        <br />
        <div>
          <div className="col-8" style={{ width: "1100px" }}>
            <div className="card" style={{ width: "900px" }}>
              <div className="card__header">
                <h3>나만의 은행을 이용하세요.</h3>
              </div>
              <div className="card__body" style={{ width: "500px" }}>
                <WalletTable />
              </div>
              <div className="card__footer"></div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}

export default Mypage;
