import React, { useRef, useEffect, useCallback } from "react";
import { useSpring, animated } from "react-spring";
import styled from "styled-components";

import { MdClose } from "react-icons/md";

const Background = styled.div`
  width: 65%;
  height: 87%;
  background: rgba(0, 0, 0, 0.9);
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 85px;
  z-index: 8;
  margin-bottom: 10%;
`;

const ModalWrapper = styled.div`
  width: 80%;
  height: 600px;
  box-shadow: 0 5px 16px rgba(255, 255, 255, 0.7)
  background: #fff;
  color: #9b9b9b;
  display: grid;
  grid-template-columns: 1fr 1fr;
  position: relative;
  margin-left: 200px;
  z-index: 100;
  border-radius: 20%;
`;

// const ModalImg = styled.img`
//   width: 100%;
//   height: 100%;
//   border-radious: 10px 0 0 10px;
//   background: #000;
// `;

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  line-height: 1.8;
  color: #ffffff;
  p {
    margin-bottom: 1rem;
  }
  button {
    padding: 10px 24px;
    background: #272727;
    color: gold;
    margin: 15px 25px;
    border: none;
  }
`;

const CloseModalButton = styled(MdClose)`
  cursor: poiner;
  position: absolute;
  top: 20px;
  right: 20px;
  width: 32px;
  height: 32px;
  padding: 0;
  z-index: 10;
`;

const Modal = ({ showModal, setShowModal }) => {
  const modalRef = useRef();

  const animation = useSpring({
    config: {
      duration: 250,
    },
    opacity: showModal ? 1 : 0,
    transform: showModal ? `translateY(0%)` : `translateY(-100%)`,
  });

  const closeModal = (e) => {
    if (modalRef.current === e.target) {
      setShowModal(false);
    }
  };

  const keyPress = useCallback(
    (e) => {
      if (e.key === "Escape" && showModal) {
        setShowModal(false);
      }
    },
    [setShowModal, showModal]
  );

  useEffect(() => {
    document.addEventListener("keydown", keyPress);
    return () => document.removeEventListener("keydown", keyPress);
  }, [keyPress]);

  return (
    <>
      {showModal ? (
        <Background ref={modalRef}>
          <animated.div style={animation} onClick={closeModal}>
            <ModalWrapper showModal={showModal}>
              {/* <ModalImg src={require("")} alt="login" /> */}

              <ModalContent>
                <h1>Are you ready?</h1>
                <p>A crypto wallet reimagined for DeFi</p>
                <button>Create New Wallet</button>
                <button>Plese Unlock Me</button>
              </ModalContent>

              <CloseModalButton
                aria-label="Close modal"
                onClick={() => setShowModal((prev) => !prev)}
              />
            </ModalWrapper>
          </animated.div>
        </Background>
      ) : null}
    </>
  );
};

export default Modal;
