import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, FormControl, OutlinedInput, TextField } from "@mui/material";
import styled from "styled-components";
import axios from "axios";
import { useHistory } from "react-router";

const CssTextField = styled(TextField)({
  "& label.Mui-focused": {
    color: "grey",
  },
  "& .MuiInput-underline:after": {
    borderBottomColor: "grey",
    color: "grey",
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "gold",
      textcolor: "grey",
      color: "grey",
    },
    "&:hover fieldset": {
      borderColor: "yellow",
      color: "grey",
    },
    "&.Mui-focused fieldset": {
      borderColor: "gold",
      color: "grey",
    },
  },
});

const Transaction = () => {
  const userState = useSelector((state) => state.user);
  const ws = useRef(null);
  const [socketMessage, setSocketMessage] = useState(null);
  const serverPort = parseInt(window.location.port) + 2000;
  const serverUrl = `http://127.0.0.1:${serverPort}`;

  const history = useHistory();
  const dispatch = useDispatch();

  // 객체를 업데이트하는 useState
  const [fromAddress, setFromAddress] = useState("04bfcab8722991ae774db48f934ca79cfb7dd991229153b9f732ba5334aafcd8e7266e47076996b55a14bf9913ee3145ce0cfc1372ada8ada74bd287450313534b");

  const getFromAddress = (event) => {
    console.log(event.target)
    console.log(event.target.value)

    setFromAddress(event.target.value)
  }

  const [amount, setAmount] = useState("")

  const getAmount = (event) => {
    setAmount(event.target.value)
  }

  // function getFromAddress(event) {
  //   setGetFromAddress(event.currentTarget.value);
  // }

  useEffect(() => {
    if (socketMessage !== null) {
        ws.current.onmessage = (e) => {
            // a message was received
            let reciveData = JSON.parse(JSON.parse(e.data).data);
            setSocketMessage(reciveData);
            if (reciveData !== null) {
                setSocketMessage(JSON.parse(JSON.parse(e.data).data)[0]);
                // setBlockIndex(socketMessage.header.index);
                // setPrevHash(socketMessage.header.previousHash);
                // setblockMerkleRoot(socketMessage.header.merkleRoot);
                // setBlockTimestamp(socketMessage.header.timestamp);
                // setBlockDifficulty(socketMessage.header.difficulty);
                // setBlocktNonce(socketMessage.header.nonce);
                // setBlocktData(socketMessage.body);
                document.getElementById("socket_writefield").innerText =
                    JSON.stringify(socketMessage);
            }
        };
    }
  }, [socketMessage]);

    function inputPort() {
      const inputport = prompt(
          "포트를 입력해주세요.\nex)6001",
          parseInt(6001)
      );
      axios
          .post(`${serverUrl}/inputport`, { port: inputport })
          .then((res) => {
              // const data = res.data;
              // document.getElementById("writefield").innerText =
              //     JSON.stringify(data);
              const data = res.data.message;
              document.getElementById("writefield").innerText = data;
          });
  }
  
    function mineBlockWithTransation(userAddress) {
      axios
          .post(`${serverUrl}/mineBlockWithTransaction`, {
              userAddress: userAddress,
          })
          .then((res) => {
              const data = JSON.stringify(res.data.message);
              // console.log(res.data.message);
              document.getElementById("writefield").innerText = data;
          });
  }

  function sendTransation() {
    // const receiverAddress = prompt(
    //     "받는사람 주소를 입력하세요",
    //     "04bfcab8722991ae774db48f934ca79cfb7dd991229153b9f732ba5334aafcd8e7266e47076996b55a14bf9913ee3145ce0cfc1372ada8ada74bd287450313534b"
    // );
    const receiverAddress = prompt("받으시는 분 주소 맞습니까?", fromAddress)
    // const sendAmounte = Number(prompt("보내실 금액을 입력해주세요", 50));
    const sendAmounte = Number(prompt("전송 요청하신 금액이 맞습니까?", amount));
    axios
        .post(`${serverUrl}/sendTransation`, {
            myAddress: userState.address,
            receiverAddress: receiverAddress,
            sendAmounte: sendAmounte,
        })
        .then((res) => {
            // const data = res.data.message;
            console.log(res.data.message);
            // document.getElementById("writefield").innerText = data;
        });
}

  function getTransactionPool() {
    axios.post(`${serverUrl}/getTransactionPool`).then((res) => {
        const data = res.data;
        console.log(data);
        document.getElementById("writefield").innerText =
            JSON.stringify(data);
    });
  }

  // function getUserAmount(userAddress) {
  //   axios
  //       .post(`${serverUrl}/getUserAmount`, {
  //           userAddress: userAddress,
  //       })
  //       .then((res) => {
  //           const data = res.data.message;
  //           document.getElementById("writefield").innerText = data;
  //       });
  // }

    function webon() {
      ws.current = new WebSocket(`ws://127.0.0.1:6001/`);
      ws.current.onopen = () => {
          // connection opened
          console.log(`웹소켓 포트 : 6001 번으로 연결`);
          // send a message
      };
  
      ws.current.onmessage = (e) => {
          // a message was received
          setSocketMessage(e.data);
      };
  
      ws.current.onerror = (e) => {
          // an error occurred
          console.log(e.message);
      };
      ws.current.onclose = (e) => {
          // connection closed
          console.log(e.code, e.reason);
      };
  }


  return (
    <div>
      <div className="table-wrapper" style={{ marginBottom: "200px" }}>
        <h2>Create transaction</h2>
        <br />
        <div>
          <div className="col-8" style={{ width: "1100px" }}>
            <div className="card" style={{ width: "900px" }}>
              <div className="card__header">
                <h3>Transfer some money to someone!</h3>
              </div>
              <div id="writefield"></div>
              <div className="card__body" style={{ width: "500px" }}>
                <table>
                    <Button
                        color="primary"
                        id="connectPeer"
                        onClick={() => {
                            inputPort();
                        }}
                        style={{
                          borderRadius: 10,
                          borderColor: "gold",
                          color: "gold",
                          size: 100,
                          padding: "10px",
                        }}
                    >
                        피어 연결
                    </Button>
                    <Button
                        color="primary"
                        id="inputPort"
                        onClick={() => webon()}
                        style={{
                          borderRadius: 10,
                          borderColor: "gold",
                          color: "gold",
                          size: 100,
                          padding: "10px",
                        }}
                    >
                        웹소켓 연결
                    </Button>

                    <Button
                        color="primary"
                        id="mineBlockWithTransation"
                        onClick={() =>
                            mineBlockWithTransation(userState.address)
                        }
                        style={{
                          borderRadius: 10,
                          borderColor: "gold",
                          color: "gold",
                          size: 100,
                          padding: "10px",
                        }}
                    >
                        트랜잭선&블록채굴
                    </Button>
                    <Button
                        id="sendTransation"
                        onClick={() => sendTransation()}
                        style={{
                          borderRadius: 10,
                          borderColor: "gold",
                          color: "gold",
                          size: 100,
                          padding: "10px",
                        }}
                    >
                        거래하기
                    </Button>
                </table>
                <div>                
                <CssTextField label=" From address" type={"text"} onChange={getFromAddress} value={fromAddress} style={{
                    marginTop: 11,
                    width: "800px",
                    height: "50px",
                    flex: 1, 
                    margin: '20px 10px',
                    padding: "10px 10px",
                    color: 'grey',
                    marginBottom: "50px"
                  }} 
                  helperText="This is your wallet address. You cannot change it because you can only spend your own coins."
                  inputProps={{ style: { fontFamily: 'Arial', color: 'white', padding: "17px 15px"}}}
                  />
                </div>
                <br />
                {/* <CssTextField
                  label=" To address"
                  style={{
                    marginTop: 5,
                    width: "800px",
                    height: "100px",
                    padding: "10px",
                  }}
                  helperText="The address of the wallet where you want to send the money to. You can type random text here (if you are not interested in recovering the funds)"
                  id="toAdd"
                /> */}
                <CssTextField
                  label=" Amount"
                  // value={}
                  style={{
                    marginTop: 5,
                    width: "800px",
                    height: "70px",
                    flex: 1, 
                    margin: '20px 10px',
                    padding: "10px 10px",
                    color: 'grey',
                    marginBottom: "50px"
                  }}
                  inputProps={{ style: { fontFamily: 'Arial', color: 'white', padding: "17px 15px"}}}
                  onChange={getAmount} 
                  value={amount}
                  helperText="You can transfer any amount. Account balance is not checked in this demo. Have at it!
                  "
                  id="amount"
                />
              </div>
              {/* <Button
                onClick={() => {sendTransation()}}
                style={{
                  borderRadius: 10,
                  borderColor: "gold",
                  marginLeft: 30,
                  color: "gold",
                  size: 100,
                  padding: "10px",
                  marginBottom: "50px",
                  marginLeft: "500px"
                }}
                // onClick={connect}
                variant="outlined"
              >
                Sign & create transaction
              </Button> */}
              <h3>Transaction pool</h3>
                    <Button
                        color="primary"
                        id="getTransactionPool"
                        onClick={() => getTransactionPool()}
                        style={{
                          borderRadius: 10,
                          borderColor: "gold",
                          color: "gold",
                          size: 100,
                          padding: "10px",
                        }}
                    >
                        get TransactionPool
                    </Button>
                <TextField
                  defaultValue="No transactions in transaction pool"
                  id="socket_writefield"
                  style={{
                    width: "800px",
                    height: "50px",
                    padding: "10px",
                  }}
                  inputProps={{ style: { fontFamily: 'Arial', padding: "17px 15px"}}}
                />
              <div className="card__footer"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transaction;
