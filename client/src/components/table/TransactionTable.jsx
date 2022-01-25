import React, { useState } from "react";

import "./wallettable.css";

import { Button, TextField } from "@material-ui/core";
import axios from "axios";

const TransactionTable = () => {
  const [ToAddress, setToAddress] = useState("");
  const [ToAmount, setToAmount] = useState("");

  function getToAddress(event) {
    //console.log(event.currentTarget.value);
    setToAddress(event.currentTarget.value);
  }
  function getToAmount(event) {
    //console.log(event.currentTarget.value);
    setToAmount(event.currentTarget.value);
  }
  function sendTransaction() {
    const serverPort = parseInt(window.location.port) + 2000;
    const serverUrl = `http://127.0.0.1:${serverPort}`;
    axios
      .post(`${serverUrl}/mineTransaction`, {
        address: ToAddress,
        amount: ToAmount,
      })
      .then((res) => {
        const data = res.data;
        console.log("클라이언트가 받은 데이터 : ", data);
        document.getElementById("writefield").innerText = JSON.stringify(data);
      });
  }

  const avatarStyle = {
    backgroundColor: "gold",
    color: "#030303",
    margin: "10px",
  };
  return (
    <div>
      <div className="wallet-wrapper">
        <table>
          <thead>
            <tr>
              <th>보내실 주소</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <TextField
                type={"text"}
                onChange={getToAddress}
                value={ToAddress}
                fullwidth
                required
                style={{ width: "700px" }}
              ></TextField>
            </tr>
          </tbody>
        </table>
        <br />
        <br />
        <table>
          <thead>
            <tr>
              <th>보내실 양</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <TextField
                type={"text"}
                onChange={getToAmount}
                value={ToAmount}
                fullwidth
                required
                style={{ width: "700px" }}
              ></TextField>
              <Button
                onClick={sendTransaction}
                size="small"
                style={avatarStyle}
                variant="contained"
              >
                submit
              </Button>
            </tr>
            <br />
            <br />
            <br />
            <br />
            <tr>
              <h2>서버 응답 결과</h2>
              <div id="writefield"></div>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionTable;
