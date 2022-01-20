import React, { useEffect, useRef, useState } from "react";

import { Button } from "@material-ui/core";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import axios from "axios";

const Mining = () => {
  const serverPort = parseInt(window.location.port) + 2000;
  const serverUrl = `http://127.0.0.1:${serverPort}`;
  const ws = useRef(null);
  const [socketMessage, setSocketMessage] = useState(null);
  const [blockIndex, setBlockIndex] = useState("");
  const [prevHash, setPrevHash] = useState("");
  const [blockMerkleRoot, setblockMerkleRoot] = useState("");
  const [blockTimestamp, setBlockTimestamp] = useState("");
  const [blockDifficulty, setBlockDifficulty] = useState("");
  const [blocktNonce, setBlocktNonce] = useState("");
  const [blocktData, setBlocktData] = useState("");

  useEffect(() => {
    if (socketMessage !== null) {
      ws.current.onmessage = async (e) => {
        // a message was received
        let reciveData = await JSON.parse(JSON.parse(e.data).data);
        setSocketMessage(reciveData);
        if (reciveData !== null) {
          setBlockIndex(reciveData[0].header.index);
          setPrevHash(await reciveData[0].header.previousHash);
          setblockMerkleRoot(await reciveData[0].header.merkleRoot);
          setBlockTimestamp(await reciveData[0].header.timestamp);
          setBlockDifficulty(await reciveData[0].header.difficulty);
          setBlocktNonce(await reciveData[0].header.nonce);
          setBlocktData(await reciveData[0].body);
          // document.getElementById("socket_writefield").innerText =
          //   JSON.stringify(reciveData);
          // document.getElementById("blockIndex").innerText = JSON.stringify(
          //   reciveData[0].header.index
          // );
          // document.getElementById("prevHash").innerText = JSON.stringify(
          //   reciveData[0].header.previousHash
          // );
          // document.getElementById("blockMerkleRoot").innerText = JSON.stringify(
          //   reciveData[0].header.merkleRoot
          // );
          // document.getElementById("blockTimestamp").innerText = JSON.stringify(
          //   reciveData[0].header.timestamp
          // );
          // document.getElementById("blockDifficulty").innerText = JSON.stringify(
          //   reciveData[0].header.difficulty
          // );
          // document.getElementById("blocktNonce").innerText = JSON.stringify(
          //   reciveData[0].header.nonce
          // );
          // document.getElementById("blocktData").innerText = JSON.stringify(
          //   reciveData[0].body
          // );
        }
      };
    }
  }, [socketMessage]);

  function mineBlock(onOff) {
    axios.post(`${serverUrl}/mineBlock`, { switchOnOff: onOff }).then((res) => {
      const data = res.data.message;
      console.log(res.data.message);
    });
  }
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
          onClick={() => {
            webon();
          }}
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
