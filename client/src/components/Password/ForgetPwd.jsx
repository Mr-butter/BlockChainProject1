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

  function getWalletPwdFromUser(event) {
    setWalletPwdFromUser(event.currentTarget.value);
  }

  function getWallet() {
    // setWalletPwdFromUser(event.currentTarget.value);
    console.log(WalletPwdFromUser);

    const loglevel = localStorage.getItem("loglevel");
    console.log("로컬스토리지 client 확인 : ", loglevel);

    const dec = decryption(loglevel);
    console.log(dec);

    axios
      .post("/wallet/getWallet", {
        password: WalletPwdFromUser,
        keystore: loglevel,
        decryption: dec,
      })
      .then((res) => {
        const data = res.data;
        console.log("받은 데이터 확인 : ", data);
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
          <h2>비밀번호 찾기</h2>
        </Grid>
        <TextField
          onChange={getWalletPwdFromUser}
          value={WalletPwdFromUser}
          label="Secret Key(비밀구문)"
          placeholder="Enter password"
          fullwidth
          required
          style={{ width: "250px", marginTop: "15px" }}
        />
        <br />
        <TextField
          onChange={getWalletPwdFromUser}
          value={WalletPwdFromUser}
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
          onClick={getWallet}
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
