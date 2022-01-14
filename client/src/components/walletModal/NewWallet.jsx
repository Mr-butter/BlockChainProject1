import React, { useState, useRef } from "react";
import { CopyToClipboard } from "copy-to-clipboard";
import axios from "axios";

import {
  Avatar,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  Paper,
} from "@material-ui/core";
import KeyIcon from "@mui/icons-material/Key";

const NewWallet = () => {
  const paperStyle = {
    padding: 20,
    height: "42vh",
    width: 280,
    height: 460,
    margin: "10px auto",
  };

  const avatarStyle = { backgroundColor: "gold" };

  const btnstyle = { margin: "20px 5px" };

  //   const [value, setValue] = useState("");
  //   const [copied, setCopied] = useState(false);

  const textInput = useRef();

  const copy = () => {
    const el = textInput.current;
    el.select();
    document.execCommand("copy");
  };

  const sendcreateWallet = (e) => {
    e.getHaveCreatepwd("wallet");
  };

  function mnemonic() {
    axios.post("/wallet/mnemonic").then((res) => {
      const mnemonic = res.data.mnemonic;
      console.log(mnemonic);
      document.getElementById("writefield").innerText = mnemonic;
    });
  }
  console.log(mnemonic());

  return (
    <div>
      <Grid>
        <Paper className={10} style={paperStyle} variant="outlined">
          <Grid align="center">
            <Avatar style={avatarStyle}>
              <KeyIcon />
            </Avatar>
            <h2>Secret Recovery Phrase</h2>
          </Grid>
          {/* 니모닉 들어갈 자리 */}
          <FormControl>
            <br />
            {/* <input
              type="text"
              value=""
              onClick={() => mnemonic()}
              ref={textInput}
              readOnly
            ></input> */}

            <div id="writefield" ref={textInput}></div>
            <Button id="mnemonic" onClick={() => mnemonic()} style={btnstyle}>
              create mnemonic
            </Button>
            <br />
            <Button onClick={copy}>copy</Button>
            <br />
            <FormHelperText id="my-helper-text">
              니모닉 문구를 아는 사람 누구나 지갑에 접근이 가능하므로 안전하게
              보관바랍니다. This is the only way you will be able to recover
              your account. Please store it somewhere safe !
            </FormHelperText>
          </FormControl>
          <p>
            <button
              id="createpwd"
              value="createpwd"
              onClick={() => sendcreateWallet(true)}
            >
              Ok, I saved it somewhere
            </button>
          </p>
        </Paper>
      </Grid>
    </div>
  );
};

export default NewWallet;
