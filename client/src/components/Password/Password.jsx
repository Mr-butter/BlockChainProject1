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

// function ComponentChange(props) {
//   const CreateWallet = props.CreateWallet;
//   if (true) {
//     return <NewWallet />;
//   } else {
//     return null;
//   }
// }

const Password = () => {
  const paperStyle = {
    padding: 20,
    height: "42vh",
    width: 280,
    margin: "10px auto",
  };

  const avatarStyle = { backgroundColor: "gold" };

  const btnstyle = { margin: "20px 5px" };

  // const [NewWallet, setNewWallet] = useState(0);

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
          <i
            className="bx bx-wallet bx-tada"
            style={{
              display: "flex",
              width: "20px",
              height: "20px",
              fontSize: "2.5rem",
              alignItems: "center",
              marginTop: "25px",
              marginLeft: "95px",
            }}
          >
            <NewWallet />
          </i>
        </Typography>
      </Paper>
    </Grid>
  );
};

export default Password;
