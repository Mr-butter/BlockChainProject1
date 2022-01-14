import React, { useState, useEffect } from "react";
import {
  Avatar,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  Icon,
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

// function ComponentChange(props) {
//   const CreateWallet = props.CreateWallet;
//   if (true) {
//     return <NewWallet />;
//   } else {
//     return null;
//   }
// }

const Password = (props) => {
  useEffect(() => {
    console.log(props.haveWallet);
    console.log(props.sethaveWallet);
  }, [props]);

  const paperStyle = {
    padding: 20,
    height: "42vh",
    width: 280,
    height: 460,
    margin: "10px auto",
  };

  const theme = createMuiTheme({
    palette: {
      type: "dark",
    },
  });

  const avatarStyle = { backgroundColor: "gold" };

  const btnstyle = { margin: "20px 5px" };

  return (
    <Grid>
      <Paper className={10} style={paperStyle} variant="outlined">
        <br />
        <Grid align="center">
          <Avatar style={avatarStyle}>
            <LockOutlined />
          </Avatar>
          <br />
          <h2>My 간편 비밀번호</h2>
        </Grid>
        <TextField
          label="password"
          placeholder="Enter password"
          fullwidth
          required
        />
        <FormControlLabel
          control={<Checkbox name="checkedB" color="primary" />}
          label="Remember me"
        />
        <Button
          href="/mypage"
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
                width: "25px",
                height: "22px",
                fontSize: "2.7rem",
                alignItems: "center",
                marginTop: "25px",
                marginLeft: "95px",
                color: "",
              }}
            ></button>
          </ThemeProvider>
        </Typography>
      </Paper>
    </Grid>
  );
};

export default Password;
