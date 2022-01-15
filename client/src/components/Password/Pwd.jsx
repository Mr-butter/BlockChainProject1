import React, { useState } from "react";
import {
  Avatar,
  Button,
  Checkbox,
  FormControlLabel,
  FormControl,
  Grid,
  Paper,
  TextField,
} from "@material-ui/core";
import LockOutlined from "@mui/icons-material/LockOutlined";

import styled from "styled-components";

import Dropdown from "../dropdown/Dropdown";

import NewWallet from "../walletModal/NewWallet";
import axios from "axios";
import CryptoJS from "crypto-js";

const Password = () => {
  const gridStyle = {
    padding: 10,
  };
  const paperStyle = {
    padding: 20,
    height: 470,
    width: 300,
    margin: "10px auto",
  };
  const avatarStyle = { backgroundColor: "gold" };
  const btnstyle = { margin: "20px 5px" };

  const [Password, setPassword] = useState("");
  const [Mnemonic, setMnemonic] = useState("");

  const getPassword = (event) => {
    setPassword(event.currentTarget.value);
  };
  const getMnemonic = () => {
    const phrase = localStorage.getItem("variant");
    setMnemonic(phrase);
  };

  function newWallet() {
    const variables = {
      password: Password,
      mnemonic: Mnemonic,
    };

    function encryption(data) {
      const key = "aaaaaaaaaabbbbbb";
      const iv = "aaaaaaaaaabbbbbb";

      const keyutf = CryptoJS.enc.Utf8.parse(key);
      //console.log("키유티에프:", keyutf);
      const ivutf = CryptoJS.enc.Utf8.parse(iv);
      //console.log("아이브이유티에프:", ivutf);

      const encObj = CryptoJS.AES.encrypt(JSON.stringify(data), keyutf, {
        iv: ivutf,
      });
      //console.log("key : toString(CryptoJS.enc.Utf8)" + encObj.key.toString(CryptoJS.enc.Utf8));
      //console.log("iv : toString(CryptoJS.enc.Utf8)" + encObj.iv.toString(CryptoJS.enc.Utf8));
      //console.log("salt : " + encObj.salt);
      //console.log("ciphertext : " + encObj.ciphertext);

      const encStr = encObj + "alswn";
      console.log("encStr : " + encStr);

      return encStr;
    }

    axios.post("/wallet/newWallet", variables).then((res) => {
      const data = res.data;

      const enc = encryption(data);
      console.log(enc);

      localStorage.setItem("loglevel", enc);

      document.getElementById("qweqwe").innerText = JSON.stringify(data);
    });
  }
  return (
    <Grid style={gridStyle}>
      <Paper className={8} style={paperStyle} variant="outlined">
        <Grid align="center">
          <Avatar style={avatarStyle}>
            <LockOutlined />
          </Avatar>
          <h2>Create a password</h2>
          <p style={{ fontSize: "12px" }}>
            You will use this to unlock your wallet.
          </p>
        </Grid>
        <TextField
          label="password"
          placeholder="Enter password"
          fullwidth
          required
          style={{ width: "250px" }}
        />
        <br />
        <TextField
          onChange={getPassword}
          value={Password}
          label="confirm password"
          placeholder="password confirm"
          fullwidth
          required
          style={{ width: "250px" }}
        />
        <br />
        <br />
        <Grid align="center">
          <h2>CHECK AGAIN!</h2>
          <TextField
            onChange={getMnemonic}
            value={Mnemonic}
            readOnly
          ></TextField>
          <Button
            onClick={getMnemonic}
            size="small"
            variant="contained"
            color="primary"
          >
            show
          </Button>
        </Grid>
        {/* <FormControl>
          <FormControlLabel
            control={<Checkbox name="checkedB" color="primary" />}
            label="개인정보 처리 동의"
            size="small"
          />
        </FormControl> */}
        <br />
        <Button
          href="/mypage"
          type="submit"
          color="gold"
          style={btnstyle}
          variant="contained"
          fullWidth
          onClick={() => newWallet()}
        >
          Save
        </Button>
        <p></p>
      </Paper>
    </Grid>
  );
};

export default Password;
