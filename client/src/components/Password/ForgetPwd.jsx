import React, { useState, useEffect } from "react";
import {
  Avatar,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  Link,
  Paper,
  TextField,
  Typography,
} from "@material-ui/core";
import LockOutlined from "@mui/icons-material/LockOutlined";

import styled from "styled-components";

import Dropdown from "../dropdown/Dropdown";

import NewWallet from "../walletModal/NewWallet";

import { createMuiTheme, ThemeProvider } from "@material-ui/core";
import axios from "axios";

import { encryption } from "../../utils/encrypt";
import { decryption } from "../../utils/decrypt";

// function ComponentChange(props) {
//   const CreateWallet = props.CreateWallet;
//   if (true) {
//     return <NewWallet />;
//   } else {
//     return null;
//   }
// }

const ForgotPwd = (props) => {
  useEffect(() => {
    console.log(props.haveWallet);
    console.log(props.sethaveWallet);
  }, [props]);

  const gridStyle = {
    padding: 10,
  };

  const paperStyle = {
    padding: 20,
    height: 470,
    width: 300,
    margin: "10px auto",
  };

  const theme = createMuiTheme({
    palette: {
      type: "dark",
    },
  });

  const avatarStyle = { backgroundColor: "gold" };

  const btnstyle = { margin: "20px 5px" };

  const [WalletPwdFromUser, setWalletPwdFromUser] = useState("");
  const [MnemonicFromUser, setMnemonicFromUser] = useState("");

  function getWalletPwdFromUser(event) {
    setWalletPwdFromUser(event.currentTarget.value);
  }
  function getMnemonicFromUser(event) {
    setMnemonicFromUser(event.currentTarget.value);
  }

  function restoreWallet() {
    axios
      .post("/wallet/restoreWallet", {
        password: WalletPwdFromUser,
        mnemonic: MnemonicFromUser,
      })
      .then((res) => {
        const data = res.data;
        console.log(data.keystore);

        const enc = encryption(data.keystore);

        localStorage.setItem("loglevel", enc);

        decryption(enc);
      });
  }

  return (
    <Grid style={gridStyle}>
      <Paper className={10} style={paperStyle} variant="outlined">
        <Grid align="center">
          <Avatar style={avatarStyle}>
            <LockOutlined />
          </Avatar>
          <br />
          <h2>비밀복구 구문으로</h2>
          <h2>내 지갑 찾기</h2>
        </Grid>
        <TextField
          onChange={getMnemonicFromUser}
          value={MnemonicFromUser}
          label="Secret Key(비밀구문)"
          placeholder="지갑 비밀 복구 구문 입력"
          fullwidth
          required
          style={{ width: "250px", marginTop: "15px" }}
        />
        <br />
        <TextField
          label="새 암호"
          placeholder="Enter password"
          fullwidth
          required
          style={{ width: "250px", marginTop: "15px" }}
        />
        <br />
        <TextField
          onChange={getWalletPwdFromUser}
          value={WalletPwdFromUser}
          label="암호 확인"
          placeholder="Enter password"
          fullwidth
          required
          style={{ width: "250px", marginTop: "15px" }}
        />
        <br />
        <Button
          onClick={restoreWallet}
          href="#"
          type="submit"
          color="gold"
          style={btnstyle}
          variant="contained"
          fullWidth
        >
          복구하기
        </Button>
      </Paper>
    </Grid>
  );
};

export default ForgotPwd;
