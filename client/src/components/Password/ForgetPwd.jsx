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

import { createMuiTheme, ThemeProvider } from "@material-ui/core";
import axios from "axios";

import { encryption } from "../../utils/encrypt";
import { decryption } from "../../utils/decrypt";
import { useHistory } from "react-router";

const ForgotPwd = (props) => {
  const serverPort = parseInt(window.location.port) + 2000;
  const serverUrl = `http://127.0.0.1:${serverPort}`;
  const history = useHistory();

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
      .post(`${serverUrl}/wallet/restoreWallet`, {
        password: WalletPwdFromUser,
        mnemonic: MnemonicFromUser,
      })
      .then((res) => {
        if (!res.data.isError) {
          const data = res.data;
          const enc = encryption(data.keystore);
          localStorage.setItem("loglevel", enc);
          alert(res.data.msg);
        } else {
          alert(res.data.msg);
        }
        props.setAnchorEl(null);
        props.sethaveWallet("pass");
        history.push("/");
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
          <h2>???????????? ????????????</h2>
          <h2>??? ?????? ??????</h2>
        </Grid>
        <TextField
          onChange={getMnemonicFromUser}
          value={MnemonicFromUser}
          label="Secret Key(????????????)"
          placeholder="?????? ?????? ?????? ?????? ??????"
          fullwidth
          required
          style={{ width: "250px", marginTop: "15px" }}
        />
        <br />
        <TextField
          type={"password"}
          label="??? ??????"
          placeholder="Enter password"
          fullwidth
          required
          style={{ width: "250px", marginTop: "15px" }}
        />
        <br />
        <TextField
          type={"password"}
          onChange={getWalletPwdFromUser}
          value={WalletPwdFromUser}
          label="?????? ??????"
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
          ????????????
        </Button>
      </Paper>
    </Grid>
  );
};

export default ForgotPwd;
