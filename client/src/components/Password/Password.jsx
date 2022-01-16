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
import { useDispatch } from "react-redux";

import { loginUser } from "../../redux/actions/index";

const Password = (props) => {
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

  const dispatch = useDispatch();

  const [WalletPwdFromUser, setWalletPwdFromUser] = useState("");

  function getWalletPwdFromUser(event) {
    setWalletPwdFromUser(event.currentTarget.value);
  }

  function getWallet(props) {
    // setWalletPwdFromUser(event.currentTarget.value);
    console.log(WalletPwdFromUser);

    const loglevel = localStorage.getItem("loglevel");
    console.log("로컬스토리지 client 확인 : ", loglevel);

    const dec = decryption(loglevel);
    console.log(dec);

    let dataToSubmit = {
      password: WalletPwdFromUser,
      keystore: loglevel,
      decryption: dec,
    };

    axios.post("/login", dataToSubmit);
    dispatch(loginUser(dataToSubmit)).then((res) => {
      if (res.payload.isAuth) {
        console.log("로그인되라라라");
        //props.history.push("/mypage");
      } else {
        console.log(res.payload);
        console.log("로그인 실패");
      }

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
          <h2>My 간편 비밀번호</h2>
        </Grid>
        <TextField
          onChange={getWalletPwdFromUser}
          value={WalletPwdFromUser}
          label="password"
          placeholder="Enter password"
          fullwidth
          required
          style={{ width: "250px", marginTop: "15px" }}
        />
        <br />
        <FormControlLabel
          control={<Checkbox name="checkedB" color="primary" />}
          label="Remember me"
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
          SIGN IN
        </Button>
        <Typography>
          <Link href="#">Forgot password ?</Link>
        </Typography>
        <br />
        {/* Create New Wallet */}
        <Typography>
          Do you have an account ?
          <br />
          <ThemeProvider theme={theme}>
            <button
              id="password"
              value="password"
              className="bx bxs-wallet bx-tada"
              onClick={() => props.sethaveWallet("wallet")}
              style={{
                display: "flex",
                width: "15px",
                height: "15px",
                fontSize: "2.7rem",
                alignItems: "center",
                marginTop: "25px",
                marginLeft: "95px",
                color: "white",
              }}
            ></button>
          </ThemeProvider>
        </Typography>
      </Paper>
    </Grid>
  );
};

export default Password;
