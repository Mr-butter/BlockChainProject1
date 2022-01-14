import React, { useState } from "react";
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

// const Btn = styled.button`
//   padding: 2px;
//   border-radious: 50%;
//   background: #4b4b4b;
//   background-shadow: 2px solid grey;
//   color: gold;
//   font-size: 17px;
//   /* margin-left: 44%;
//   margin-bottom: 60%; */
//   cursor: pointer;
// `;

const Password = () => {
  const paperStyle = {
    padding: 20,
    height: "42vh",
    width: 280,
    margin: "28px auto",
  };

  const avatarStyle = { backgroundColor: "gold" };

  const btnstyle = { margin: "2px 1px" };

  return (
    <Grid>
      <Paper className={10} style={paperStyle} variant="outlined">
        <Grid align="center">
          <Avatar style={avatarStyle}>
            <LockOutlined />
          </Avatar>
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
          <Dropdown
            className="userpassword-item"
            icon="bx bx-wallet bx-tada"
            renderFooter={() => <NewWallet />}
          ></Dropdown>
        </Typography>
      </Paper>
    </Grid>
  );
};

export default Password;
