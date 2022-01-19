import React, { useEffect, useRef, useState } from "react";
import Input from "@mui/material/Input";
import { Button } from "@material-ui/core";
import { Alert } from "@mui/material";
import axios from "axios";

const Mining = () => {
  const ws = useRef(null);
  const [socketMessage, setSocketMessage] = useState("");
  const [socketMessageLog, setSocketMessageLog] = useState([]);
  const serverPort = parseInt(window.location.port) + 2000;
  const serverUrl = `http://127.0.0.1:${serverPort}`;
  useEffect(() => {
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

    return () => {
      ws.current.close();
    };
  }, []);

  useEffect(() => {
    ws.current.onmessage = (e) => {
      // a message was received
      let reciveData = JSON.parse(JSON.parse(e.data).data);
      setSocketMessage(reciveData);
      setSocketMessageLog((arr) => [...arr, { reciveData }]);
      if (reciveData !== null) {
        setSocketMessage(JSON.parse(JSON.parse(e.data).data)[0]);
      }
    };

    document.getElementById("socketLog_writefield").innerText =
      JSON.stringify(socketMessageLog);
  }, [socketMessageLog]);

  function inputPort() {
    const inputport = prompt("포트를 입력해주세요.\nex)6001", parseInt(6001));
    axios.post(`${serverUrl}/inputport`, { port: inputport }).then((res) => {
      // const data = res.data;
      // document.getElementById("writefield").innerText =
      //     JSON.stringify(data);
      const data = res.data.message;
      document.getElementById("writefield").innerText = data;
    });
  }
  return (
    <div>
      <h2>CoLink Mining</h2>
      <br />
      <div id="writefield"></div>
      <div>
        <Button
          variant="outlined"
          style={{ margin: "10px" }}
          id="inputPort"
          onClick={() => inputPort()}
        >
          웹소켓 서버 연결
        </Button>
      </div>
      <br />
      <div>
        <div id="socket_writefield"></div>
      </div>
      <br />
      <Alert severity="success">블럭 정보창</Alert>
      <div id="socketLog_writefield"></div>
    </div>
  );
};

export default Mining;
