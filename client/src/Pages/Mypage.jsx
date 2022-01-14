import React, { useState } from "react";
// import { withRouter } from "react-router-dom";
// import axios from "axios";
import styled from "styled-components";

import Modal from "../components/walletModal/modal";
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
      <Button onClick={openModal}>Get Started</Button>
      <Modal showModal={showModal} setShowModal={setShowModal} />
      {/* <h2>마이페이지</h2>
      <button onClick={initWallet()}>개인지갑생성</button> */}
    </Container>
  );
}

export default Mypage;
