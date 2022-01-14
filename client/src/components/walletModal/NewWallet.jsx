import React, { useState } from "react";
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

  const btnstyle = { margin: "2px 1px" };

  //   const [value, setValue] = useState("");
  //   const [copied, setCopied] = useState(false);

  // const textInput = useRef();

  // const copy = () => {
  //   const el = textInput.current;
  //   el.select();
  //   document.execCommand("copy");
  // };

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
        <FormControl style={{ width: "50px" }}>
          <br />
          <input
            type="text"
            value="니모닉 12자리 비밀키 들어올 자리"
            // ref={textInput}
            readOnly
            style={{ fontSize: "15px", width: "250px", height: "60px" }}
          />
          <br />
          <Button
            // onClick={copy}
            style={{
              display: "flex",
              width: "15px",
              height: "25px",
              fontSize: "1rem",
              alignItems: "center",
              marginLeft: "95px",
              background: "gold",
              color: "black",
              cursor: "pointer",
            }}
          >
            copy
          </Button>
          <br />
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
        </p>
      </Paper>
    </Grid>
  );
};

export default NewWallet;
