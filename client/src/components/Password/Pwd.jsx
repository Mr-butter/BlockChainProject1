import React, { useState } from "react";
import { useHistory } from "react-router-dom";
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
import axios from "axios";
import { encryption } from "../../utils/encrypt";
import { decryption } from "../../utils/decrypt";

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

  const history = useHistory();

  const getPassword = (event) => {
    setPassword(event.currentTarget.value);
  };

  const getMnemonic = () => {
    const encMnemonic = localStorage.getItem("variant");
    const decMnemonic = JSON.parse(decryption(encMnemonic));

    setMnemonic(decMnemonic);
  };

  function newWallet() {
    const variables = {
      password: Password,
      mnemonic: Mnemonic,
    };

    axios.post("/wallet/newWallet", variables).then((res) => {
      // const data = res.data;
      // console.log(data);

      const keystore = res.data.keystore;

      const enc = encryption(keystore);
      console.log(enc);

      localStorage.setItem("loglevel", enc);
      localStorage.removeItem("variant");

      alert("지갑이 성공적으로 생성되었습니다.");

      return history.push("/mypage");
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
            // onChange={getMnemonic}
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
          // href="/mypage"
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
