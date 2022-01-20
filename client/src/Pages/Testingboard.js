import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import CryptoJS from "crypto-js";
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

function Testingboard(props) {
  const ws = useRef(null);
  const [socketMessage, setSocketMessage] = useState(null);
  const [blockIndex, setBlockIndex] = useState("");
  const [prevHash, setPrevHash] = useState("");
  const [blockMerkleRoot, setblockMerkleRoot] = useState("");
  const [blockTimestamp, setBlockTimestamp] = useState("");
  const [blockDifficulty, setBlockDifficulty] = useState("");
  const [blocktNonce, setBlocktNonce] = useState("");
  const [blocktData, setBlocktData] = useState("");
  const serverPort = parseInt(window.location.port) + 2000;
  const serverUrl = `http://127.0.0.1:${serverPort}`;
  //   useEffect(() => {
  //     ws.current = new WebSocket(`ws://127.0.0.1:6001/`);
  //     ws.current.onopen = () => {
  //       // connection opened
  //       console.log(`웹소켓 포트 : 6001 번으로 연결`);
  //       // send a message
  //     };

  //     ws.current.onmessage = (e) => {
  //       // a message was received
  //       setSocketMessage(e.data);
  //     };

  //     ws.current.onerror = (e) => {
  //       // an error occurred
  //       console.log(e.message);
  //     };
  //     ws.current.onclose = (e) => {
  //       // connection closed
  //       console.log(e.code, e.reason);
  //     };

  //     return () => {
  //       ws.current.close();
  //     };
  //   }, []);

  useEffect(() => {
    if (socketMessage !== null) {
      ws.current.onmessage = async (e) => {
        // a message was received
        let reciveData = await JSON.parse(JSON.parse(e.data).data);
        setSocketMessage(reciveData);
        if (reciveData !== null) {
          //   setBlockIndex(await socketMessage[0].header.index);
          //   setPrevHash(await socketMessage[0].header.previousHash);
          //   setblockMerkleRoot(await socketMessage[0].header.merkleRoot);
          //   setBlockTimestamp(await socketMessage[0].header.timestamp);
          //   setBlockDifficulty(await socketMessage[0].header.difficulty);
          //   setBlocktNonce(await socketMessage[0].header.nonce);
          //   setBlocktData(await socketMessage[0].body);
          document.getElementById("socket_writefield").innerText =
            JSON.stringify(reciveData);
          document.getElementById("blockIndex").innerText = JSON.stringify(
            reciveData[0].header.index
          );
          document.getElementById("prevHash").innerText = JSON.stringify(
            reciveData[0].header.previousHash
          );
          document.getElementById("blockMerkleRoot").innerText = JSON.stringify(
            reciveData[0].header.merkleRoot
          );
          document.getElementById("blockTimestamp").innerText = JSON.stringify(
            reciveData[0].header.timestamp
          );
          document.getElementById("blockDifficulty").innerText = JSON.stringify(
            reciveData[0].header.difficulty
          );
          document.getElementById("blocktNonce").innerText = JSON.stringify(
            reciveData[0].header.nonce
          );
          document.getElementById("blocktData").innerText = JSON.stringify(
            reciveData[0].body
          );
        }
      };
    }
  }, [socketMessage]);

  function block() {
    axios.post(`${serverUrl}/blocks`).then((res) => {
      const data = res.data;
      document.getElementById("writefield").innerText = JSON.stringify(data);
    });
  }

  function inputPort() {
    const inputport = prompt("포트를 입력해주세요.\nex)5001", parseInt(5001));
    axios.post(`${serverUrl}/inputport`, { port: inputport }).then((res) => {
      // const data = res.data;
      // document.getElementById("writefield").innerText =
      //     JSON.stringify(data);
      const data = res.data.message;
      document.getElementById("writefield").innerText = data;
    });
  }

  function mineBlock(onOff) {
    axios.post(`${serverUrl}/mineBlock`, { switchOnOff: onOff }).then((res) => {
      const data = res.data.message;
      console.log(res.data.message);
      document.getElementById("writefield").innerText = data;
    });
  }

  function version() {
    axios.post(`${serverUrl}/version`).then((res) => {
      const data = res.data;
      document.getElementById("writefield").innerText = JSON.stringify(data);
    });
  }
  function getsocket() {
    axios.post(`${serverUrl}/getsocket`).then((res) => {
      const data = res.data;
      document.getElementById("writefield").innerText = JSON.stringify(data);
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
      <h2>테스트 코드</h2>
      <ol>
        <li>
          <Button color="primary" id="blocks" onClick={() => block()}>
            get blocks
          </Button>
        </li>
        <li>
          <Button color="primary" id="inputPort" onClick={() => webon()}>
            connect websocket
          </Button>
        </li>
        <li>
          <Button
            color="primary"
            id="mineBlockon"
            onClick={() => mineBlock("on")}
          >
            mineBlock(on)
          </Button>
        </li>
        <li>
          <Button
            color="primary"
            id="socket"
            onClick={() => {
              mineBlock("connectPeer");
            }}
          >
            socket state
          </Button>
        </li>
        <li>
          <Button color="primary" id="version" onClick={() => version()}>
            version
          </Button>
        </li>
      </ol>
      <h2>서버 응답 결과</h2>
      <div id="writefield"></div>
      <br></br>
      <h2>소켓 메세지</h2>
      <div id="socket_writefield"></div>
      <br></br>
      <div>blockIndex</div>
      <div id="blockIndex"></div>
      <br></br>
      <div>prevHash</div>
      <div id="prevHash"></div>
      <br></br>
      <div>blockMerkleRoot</div>
      <div id="blockMerkleRoot"></div>
      <br></br>
      <div>blockTimestamp</div>
      <div id="blockTimestamp"></div>
      <br></br>
      <div>blockDifficulty</div>
      <div id="blockDifficulty"></div>
      <br></br>
      <div>blocktNonce</div>
      <div id="blocktNonce"></div>
      <br></br>
      <div>blocktData</div>
      <div id="blocktData"></div>
    </div>
  );
}

export default Testingboard;
