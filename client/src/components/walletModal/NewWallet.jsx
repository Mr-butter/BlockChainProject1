import React, { useState, useRef } from "react";
import axios from "axios";
import {
  Avatar,
  Button,
  FormControl,
  Grid,
  InputLabel,
  Paper,
  Typography,
  TextField,
} from "@material-ui/core";
import KeyIcon from "@mui/icons-material/Key";
import { encryption } from "../../utils/encrypt";
import { decryption } from "../../utils/decrypt";

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
  const [Mnemonic, setMnemonic] = useState("");

  const words = useRef();

  const copy = () => {
    const el = words.current;
    el.select();
    document.execCommand("copy");
  };

  const getMnemonic = () => {
    axios.post("/wallet/mnemonic").then((res) => {
      const rawMnemonic = res.data.mnemonic;
      const encMnemonic = encryption(rawMnemonic);
      const decMnemonic = decryption(encMnemonic);

      const variant = localStorage.getItem("variant");
      console.log("기존 로컬스토리지 variant 확인 : ", variant);

      if (variant) {
        localStorage.removeItem("variant");
        localStorage.setItem("variant", encMnemonic);
        console.log("니모닉 리셋 후 저장", encMnemonic);
      } else {
        localStorage.setItem("variant", encMnemonic);
        console.log("새로운 니모닉 저장", encMnemonic);
      }

      console.log("디크립트 확인 : ", JSON.parse(decMnemonic));
      console.log("암호화전 니모닉 :", rawMnemonic);

      setMnemonic(JSON.parse(decMnemonic));

      // if (toString(encMnemonic) === decryption(rawMnemonic)) {
      //   console.log(toString(encMnemonic) === decryption(rawMnemonic));
      //   localStorage.setItem("variant", encMnemonic);
      //   setMnemonic(rawMnemonic);
      // } else {
      //   return alert("처리중에 오류가 있습니다. 다시 시도해 주세요!");
      // }
    });
  };
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
        <TextField
          inputRef={words}
          onChange={getMnemonic}
          value={Mnemonic}
          readOnly
          fullWidth
          multiline
        ></TextField>
        <br />
        <Grid align="center" justifyContent>
          <Button
            size="medium"
            style={btnstyle}
            variant="contained"
            onClick={getMnemonic}
          >
            change mneomonic
          </Button>
          <Button
            size="medium"
            style={avatarStyle}
            variant="contained"
            onClick={copy}
          >
            copy
          </Button>
        </Grid>
        <br />
        <FormControl style={{ width: "5px" }}></FormControl>

        <p>
          <Button
            type="submit"
            style={btnstyle}
            variant="contained"
            fullWidth
            id="createpwd"
            value="createpwd"
            onClick={() => props.sethaveWallet("pwd")}
            mnemonic={getMnemonic}
          >
            Ok, I saved it somewhere
          </Button>
        </p>
      </Paper>
    </Grid>
  );
};

export default NewWallet;
