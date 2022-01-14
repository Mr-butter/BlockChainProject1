import React, { useState, useRef } from "react";
import { CopyToClipboard } from "copy-to-clipboard";

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

const NewWallet = (props) => {
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
            <input
              type="text"
              value="니모닉 12자리 비밀키 들어올 자리"
              ref={textInput}
              readOnly
            ></input>
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
            <Button
              type="submit"
              color="gold"
              style={btnstyle}
              variant="contained"
              fullWidth
              id="createpwd"
              value="createpwd"
              onClick={() => props.sethaveWallet("pwd")}
            >
              Ok, I saved it somewhere
            </Button>
            <button>OK</button>
          </p>
        </Paper>
      </Grid>
    </div>
  );
};

export default NewWallet;
