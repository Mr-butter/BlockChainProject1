import React, { useEffect, useRef, useState } from "react";
import Input from "@mui/material/Input";
import {
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Snackbar,
  TextField,
} from "@material-ui/core";
import { Alert } from "@mui/material";

const Mining = () => {
  const ws = useRef(null);
  const [socketMessage, setSocketMessage] = useState("");

  useEffect(() => {
    ws.current = new WebSocket(`ws://127.0.0.1:6005/`);
  }, []);
  return (
    <div>
      <h2>CoLink Mining</h2>
      <br />
      <div>
        {" "}
        <Input aria-label="Demo input" placeholder="port" />
        <Button variant="connect" style={{ width: "100px" }} color="secondary">
          피어연결
        </Button>
      </div>
      <br />
      <div>
        <Button variant="outlined" style={{ margin: "10px" }}>
          블럭불러오기
        </Button>
        <Button variant="contained" style={{ margin: "10px" }}>
          블럭채굴하기
        </Button>
        <Button
          variant="contained"
          color="secondary"
          style={{ margin: "10px" }}
        >
          채굴중단하기
        </Button>
      </div>
      <div>
        <div id="socket_writefield"></div>
      </div>
      <br />

      <Alert severity="success">블럭 정보창</Alert>
    </div>
  );
};

export default Mining;
