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
import AlertTitle from "@mui/material/AlertTitle";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import axios from "axios";

const Mining = () => {
  const ws = useRef(null);
  const [socketMessage, setSocketMessage] = useState(null);
  const [blockIndex, setBlockIndex] = useState("");
  const [prevHash, setPrevHash] = useState("");
  const [blockMerkleRoot, setblockMerkleRoot] = useState("");
  const [blockTimestamp, setBlockTimestamp] = useState("");
  const [blockDifficulty, setBlockDifficulty] = useState("");
  const [blocktNonce, setBlocktNonce] = useState("");
  const [blocktData, setBlocktData] = useState("");
  const [WebSocketOnOff, setWebSocketOnOff] = useState("");
  const serverPort = parseInt(window.location.port) + 2000;
  const serverUrl = `http://127.0.0.1:${serverPort}`;

  // useEffect(() => {
  //     ws.current = new WebSocket(`ws://127.0.0.1:6001/`);
  //     ws.current.onopen = () => {
  //         // connection opened
  //         console.log(`웹소켓 포트 : 6001 번으로 연결`);
  //         // send a message
  //     };

  //     ws.current.onmessage = (e) => {
  //         // a message was received
  //         setSocketMessage(e.data);
  //     };

  //     ws.current.onerror = (e) => {
  //         // an error occurred
  //         console.log(e.message);
  //     };
  //     ws.current.onclose = (e) => {
  //         // connection closed
  //         console.log(e.code, e.reason);
  //     };

  //     return () => {
  //         ws.current.close();
  //     };
  // }, []);
  function webon() {
    ws.current = new WebSocket(`ws://127.0.0.1:6001/`);
    ws.current.onopen = () => {
      // connection opened
      console.log(`웹소켓 포트 : 6001 번으로 연결`);
      // send a message
    };

    ws.current.onmessage = (e) => {
      // a message was received
      setSocketMessage(e.data);
    };

    ws.current.onerror = (e) => {
      // an error occurred
      console.log(e.message);
    };
    ws.current.onclose = (e) => {
      // connection closed
      console.log(e.code, e.reason);
    };
  }
  useEffect(() => {
    if (socketMessage !== null) {
      ws.current.onmessage = (e) => {
        let reciveData = JSON.parse(JSON.parse(e.data).data);
        if (reciveData !== null) {
          setSocketMessage(JSON.parse(JSON.parse(e.data).data)[0]);
          setBlockIndex(socketMessage.header.index);
          setPrevHash(socketMessage.header.previousHash);
          setblockMerkleRoot(socketMessage.header.merkleRoot);
          setBlockTimestamp(socketMessage.header.timestamp);
          setBlockDifficulty(socketMessage.header.difficulty);
          setBlocktNonce(socketMessage.header.nonce);
          setBlocktData(socketMessage.body);
        }
      };
    }
    // document.getElementById("socket_writefield").innerText =
    //     JSON.stringify(socketMessage);
    // document.getElementById("blockIndex").innerText =
    //     JSON.stringify(blockIndex);
    // document.getElementById("prevHash").innerText =
    //     JSON.stringify(prevHash);
    // document.getElementById("blockMerkleRoot").innerText =
    //     JSON.stringify(blockMerkleRoot);
    // document.getElementById("blockTimestamp").innerText =
    //     JSON.stringify(blockTimestamp);
    // document.getElementById("blockDifficulty").innerText =
    //     JSON.stringify(blockDifficulty);
    // document.getElementById("blocktNonce").innerText =
    //     JSON.stringify(blocktNonce);
    // document.getElementById("blocktData").innerText =
    //     JSON.stringify(blocktData);
  }, [socketMessage]);

  function mineBlock(onOff) {
    axios.post(`${serverUrl}/mineBlock`, { switchOnOff: onOff }).then((res) => {
      const data = res.data.message;
      console.log(res.data.message);
    });
  }

  return (
    <div>
      <h2>CoLink Mining</h2>
      <br />
      <div>
        <Button
          variant="contained"
          style={{ margin: "10px" }}
          onClick={() => mineBlock("on")}
        >
          블럭채굴하기
        </Button>
        <Button
          variant="contained"
          color="secondary"
          style={{ margin: "10px" }}
          onClick={() => webon()}
        >
          클라이언트 웹소켓 접속
        </Button>
      </div>
      <br />
      <h2>블럭정보</h2>
      <br />
      <h2 id="infowritefield"></h2>
      <br />

      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableBody>
          <TableRow
            sx={{
              "&:last-child td, &:last-child th": {
                border: 0,
              },
            }}
          >
            <TableCell component="th" scope="row" color="red">
              Index
            </TableCell>
            <TableCell align="left">{blockIndex}</TableCell>
          </TableRow>
          <TableRow
            sx={{
              "&:last-child td, &:last-child th": {
                border: 0,
              },
            }}
          >
            <TableCell component="th" scope="row">
              prevHash
            </TableCell>
            <TableCell align="left">{prevHash}</TableCell>
          </TableRow>
          <TableRow
            sx={{
              "&:last-child td, &:last-child th": {
                border: 0,
              },
            }}
          >
            <TableCell component="th" scope="row">
              MerkleRoot
            </TableCell>
            <TableCell align="left">{blockMerkleRoot}</TableCell>
          </TableRow>
          <TableRow
            sx={{
              "&:last-child td, &:last-child th": {
                border: 0,
              },
            }}
          >
            <TableCell component="th" scope="row">
              Timestamp
            </TableCell>
            <TableCell align="left">{blockTimestamp}</TableCell>
          </TableRow>
          <TableRow
            sx={{
              "&:last-child td, &:last-child th": {
                border: 0,
              },
            }}
          >
            <TableCell component="th" scope="row">
              Difficulty
            </TableCell>
            <TableCell align="left">{blockDifficulty}</TableCell>
          </TableRow>
          <TableRow
            sx={{
              "&:last-child td, &:last-child th": {
                border: 0,
              },
            }}
          >
            <TableCell component="th" scope="row">
              Nonce
            </TableCell>
            <TableCell align="left">{blocktNonce}</TableCell>
          </TableRow>
          <TableRow
            sx={{
              "&:last-child td, &:last-child th": {
                border: 0,
              },
            }}
          >
            <TableCell component="th" scope="row">
              blocktData
            </TableCell>
            <TableCell align="left">{blocktData}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default Mining;
