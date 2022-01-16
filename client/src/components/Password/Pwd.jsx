import React, { useState } from "react";
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

const Password = (e) => {
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

  const sendHaveWallet = (e) => {
    e.getHaveWallet(true);
  };

  return (
    <Grid style={gridStyle}>
      <Paper className={10} style={paperStyle} variant="outlined">
        <br />
        <Grid align="center">
          <Avatar style={avatarStyle}>
            <LockOutlined />
          </Avatar>
          <br />
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
          label="confirm password"
          placeholder="password confirm"
          fullwidth
          required
          style={{ width: "250px" }}
        />
        <br />
        <FormControlLabel
          control={<Checkbox name="checkedB" color="primary" />}
          label="개인정보 처리 동의"
          size="small"
        />
        <br />
        <Button
          href="/mypage"
          type="submit"
          color="gold"
          style={btnstyle}
          variant="contained"
          fullWidth
        >
          Save
        </Button>
      </Paper>
    </Grid>
  );
};

export default Password;
