import React, { useState } from "react";
import { CopyToClipboard } from "copy-to-clipboard";

import { Avatar, Button, Grid, Paper } from "@material-ui/core";
import KeyIcon from "@mui/icons-material/Key";

const NewWallet = () => {
  const paperStyle = {
    padding: 20,
    height: "45vh",
    width: 280,
    margin: "28px auto",
  };

  const avatarStyle = { backgroundColor: "gold" };

  const btnstyle = { margin: "2px 1px" };

  //   const [value, setValue] = useState("");
  //   const [copied, setCopied] = useState(false);

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
          {/* <center>
            <input
              value={value}
              onChange={({ target: { value } }) => setValue(value)}
            />
            <CopyToClipboard text={value} onCopy={() => setCopied(true)}>
              <button>Copy</button>
            </CopyToClipboard>
            {copied ? <span styled={{ color: "gold" }}>Copied</span> : null}
          </center> */}

          <Button
            href="#"
            type="submit"
            color="gold"
            style={btnstyle}
            variant="contained"
            fullWidth
          >
            Ok, I saved it somewhere
          </Button>
        </Paper>
      </Grid>
    </div>
  );
};

export default NewWallet;
