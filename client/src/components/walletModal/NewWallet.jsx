import React, { useState } from "react";
import axios from "axios";
import { CopyToClipboard } from "copy-to-clipboard";
import {
  Avatar,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  Paper,
  Typography,
} from "@material-ui/core";
import KeyIcon from "@mui/icons-material/Key";
import styled from "styled-components";

const NewWallet = (props) => {
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

  const btnstyle = { margin: "2px 3px" };

  //   const [value, setValue] = useState("");
  //   const [copied, setCopied] = useState(false);

  // const textInput = useRef();

  // const copy = () => {
  //   const el = textInput.current;
  //   el.select();
  //   document.execCommand("copy");
  // };
  function mnemonic() {
    axios.post("/wallet/mnemonic").then((res) => {
      const mnemonic = res.data.mnemonic;
      console.log(mnemonic);
      document.getElementById("mnemonic").innerText = mnemonic;
      localStorage.setItem("variant", mnemonic);
    });
  }
  return (
    <Grid style={gridStyle}>
      <Paper className={8} style={paperStyle} variant="outlined">
        <Grid align="center">
          <Avatar style={avatarStyle}>
            <KeyIcon />
          </Avatar>
          <h2>Secret Recovery Phrase</h2>
        </Grid>
        {/* 니모닉 들어갈 자리 */}
        <FormControl style={{ width: "5px" }}>
          <br />

          <div id="mnemonic"></div>

          {/* <input
            type="text"
            value="니모닉 12자리 비밀키 들어올 자리"
            // ref={textInput}
            readOnly
            style={{ fontSize: "15px", width: "250px", height: "60px" }}
          /> */}
          <br />
          <Grid align="center">
            <Button
              size="medium"
              style={btnstyle}
              variant="contained"
              onClick={() => mnemonic()}
            >
              change mneomonic
            </Button>
            <Button
              size="medium"
              style={avatarStyle}
              variant="contained"
              color="inherit"
              // onClick={() => copy()}
            >
              copy
            </Button>
          </Grid>
          <br />
          <FormHelperText id="my-helper-text">
            니모닉 문구를 아는 사람 누구나 지갑에 접근이 가능하므로 안전하게
            보관바랍니다. This is the only way you will be able to recover your
            account. Please store it somewhere safe !
          </FormHelperText>
        </FormControl>

        <p>
          <Button
            type="submit"
            style={btnstyle}
            variant="contained"
            fullWidth
            id="createpwd"
            value="createpwd"
            onClick={() => props.sethaveWallet("pwd")}
            mnemonic={mnemonic}
          >
            Ok, I saved it somewhere
          </Button>
        </p>
      </Paper>
    </Grid>
  );
};

export default NewWallet;
