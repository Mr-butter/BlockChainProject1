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
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "gold",
    },
    "&:hover fieldset": {
      borderColor: "yellow",
    },
    "&.Mui-focused fieldset": {
      borderColor: "gold",
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

  const [amount, setAmount] = useState("10000")

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

  function sendTransation() {
    const receiverAddress = alert("주소가 확인되었습니다.")
    const sendAmounte = alert("금액이 입력되었습니다.")
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

  function getUserAmount(userAddress) {
    axios
        .post(`${serverUrl}/getUserAmount`, {
            userAddress: userAddress,
        })
        .then((res) => {
            const data = res.data.message;
            document.getElementById("writefield").innerText = data;
        });
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
              <div className="card__body" style={{ width: "500px" }}>
                <div>                
                <CssTextField label=" From address" type={"text"} onChange={getFromAddress} value={fromAddress} style={{
                    marginTop: 11,
                    width: "800px",
                    height: "50px",
                    padding: "10px",
                    marginBottom: "30px"
                  }} helperText="This is your wallet address. You cannot change it because you can only spend your own coins."
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
                    height: "100px",
                    padding: "10px",
                  }}
                  onChange={getAmount} 
                  value={amount}
                  helperText="You can transfer any amount. Account balance is not checked in this demo. Have at it!
                  "
                  id="amount"
                />
              </div>
              <Button
                onClick={() => {sendTransation()}}
                style={{
                  borderRadius: 10,
                  borderColor: "gold",
                  marginLeft: 30,
                  color: "gold",
                  size: 100,
                  padding: "10px",
                  marginBottom: "25px",
                }}
                // onClick={connect}
                variant="outlined"
              >
                Sign & create transaction
              </Button>
              <h3>Transaction pool</h3>
              <TextField
                defaultValue="No transactions in transaction pool"
                style={{
                  width: "800px",
                  height: "50px",
                  padding: "10px",
                }}
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
