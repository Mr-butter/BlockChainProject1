import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import axios from "axios";
import { useHistory } from "react-router";

const columns = [
  { id: "index", label: "index", minWidth: 5 },
  { id: "previousHash", label: "previousHash", minWidth: 50 },
  { id: "timestamp", label: "timestamp", minWidth: 20 },
  { id: "merkleRoot", label: "merkleRoot", minWidth: 50 },
  { id: "difficulty", label: "difficulty", minWidth: 50 },
  { id: "nonce", label: "nonce", minWidth: 50 },
  { id: "body", label: "body", minWidth: 50 },
];

const Mining = () => {
  const userState = useSelector((state) => state.user);
  const ws = useRef(null);
  const [socketMessage, setSocketMessage] = useState(null);
  const [mineBlock, setmineBlockWithTransation] = useState([]);
  const reverse = [...mineBlock].reverse();
  // const [blockIndex, setBlockIndex] = useState("");
  // const [prevHash, setPrevHash] = useState("");
  // const [blockMerkleRoot, setblockMerkleRoot] = useState("");
  // const [blockTimestamp, setBlockTimestamp] = useState("");
  // const [blockDifficulty, setBlockDifficulty] = useState("");
  // const [blocktNonce, setBlocktNonce] = useState("");
  // const [blocktData, setBlocktData] = useState("");
  const serverPort = parseInt(window.location.port) + 2000;
  const serverUrl = `http://127.0.0.1:${serverPort}`;

  useEffect(() => {
    // mineBlockWithTransation()
    if (socketMessage !== null) {
      ws.current.onmessage = async (e) => {
        // a message was received
        let reciveData = JSON.parse(JSON.parse(e.data).data);
        setSocketMessage(reciveData);
        if (reciveData !== null) {
          setSocketMessage(JSON.parse(JSON.parse(e.data).data)[0]);
          setSocketMessage(socketMessage.header.index);
          // setBlockIndex(reciveData[0].header.index);
          // setPrevHash(await reciveData[0].header.previousHash);
          // setblockMerkleRoot(await reciveData[0].header.merkleRoot);
          // setBlockTimestamp(await reciveData[0].header.timestamp);
          // setBlockDifficulty(await reciveData[0].header.difficulty);
          // setBlocktNonce(await reciveData[0].header.nonce);
          // setBlocktData(await reciveData[0].body);
          document.getElementById("socket_writefield").innerText =
            JSON.stringify(socketMessage);
        }
      };
    }
  }, [socketMessage]);

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

  function mineBlockWithTransation(userAddress) {
    axios
      .post(`${serverUrl}/mineBlockWithTransaction`, {
        userAddress: userAddress,
      })
      .then((res) => {
        console.log(res.data);
        // const data = JSON.stringify(res.data.message);
        setmineBlockWithTransation(res.data);
        // document.getElementById("poolWritefield").innerText = data;
        // setmineBlockWithTransation(res.data.message);
      })
      .catch((error) => console.error(`ERROR: ${error}`));
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
      <div className="table-wrapper" style={{ marginBottom: "200px" }}>
        <h2>블럭정보</h2>
        <br />
        <div>
          <div className="col-8" style={{ width: "1500px" }}>
            <div className="card" style={{ width: "1200px" }}>
              <h3>Block Infomation</h3>
              <br />
              <div className="card__body" style={{ width: "500px" }}>
                <table>
                  <Button
                    color="primary"
                    id="connectPeer"
                    onClick={() => {
                      inputPort();
                    }}
                    style={{
                      borderRadius: 10,
                      borderColor: "gold",
                      color: "gold",
                      size: 100,
                      padding: "10px",
                    }}
                  >
                    피어 연결
                  </Button>
                  <Button
                    color="primary"
                    id="inputPort"
                    onClick={() => webon()}
                    style={{
                      borderRadius: 10,
                      borderColor: "gold",
                      color: "gold",
                      size: 100,
                      padding: "10px",
                    }}
                  >
                    웹소켓 연결
                  </Button>

                  <Button
                    color="primary"
                    id="mineBlockWithTransation"
                    onClick={() => mineBlockWithTransation(userState.address)}
                    style={{
                      borderRadius: 10,
                      borderColor: "gold",
                      color: "gold",
                      size: 100,
                      padding: "10px",
                    }}
                  >
                    트랜잭선&블록채굴
                  </Button>
                </table>
              </div>

              <div id="writefield"></div>
              <Paper sx={{ width: "100%", overflow: "hidden" }}>
                <Table
                  sx={{ minWidth: 650 }}
                  aria-label="sticky table"
                  stickyHeader
                >
                  <TableHead>
                    <TableRow>
                      {columns.map((column) => (
                        <TableCell
                          key={column.id}
                          align={column.align}
                          style={{ minWidth: column.minWidth }}
                        >
                          {column.label}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {reverse.map((data) => (
                      <TableRow
                        sx={{
                          padding: "0px 0px",
                          borderRight: "2px solid black",
                          backgroundColor: "#5c5c5c",
                          fontSize: "1.1rem",
                        }}
                      >
                        <TableCell align="left" style={{ color: "#bbbbbb" }}>
                          {data.header.index}
                        </TableCell>
                        <TableCell
                          align="left"
                          style={{
                            color: "#bbbbbb",
                            maxWidth: "240px",
                            wordBreak: "break-all",
                          }}
                        >
                          {data.header.previousHash}
                        </TableCell>
                        <TableCell
                          align="left"
                          style={{
                            color: "#bbbbbb",
                            maxWidth: "240px",
                            wordBreak: "break-all",
                          }}
                        >
                          {data.header.merkleRoot}
                        </TableCell>
                        <TableCell
                          align="left"
                          style={{ color: "#bbbbbb", maxWidth: "100px" }}
                        >
                          {data.header.timestamp}
                        </TableCell>
                        <TableCell
                          align="left"
                          style={{ color: "#bbbbbb", maxWidth: "100px" }}
                        >
                          {data.header.difficulty}
                        </TableCell>
                        <TableCell
                          align="left"
                          style={{ color: "#bbbbbb", maxWidth: "100px" }}
                        >
                          {data.header.nonce}
                        </TableCell>
                        {reverse.map((bodydata) => (
                          <TableCell
                            align="left"
                            style={{
                              color: "#bbbbbb",
                              maxWidth: "100px",
                              wordBreak: "break-all",
                            }}
                          >
                            {JSON.stringify(bodydata.id)}
                          </TableCell>
                        ))}
                        {/* <td>{data.header.index}</td>
                        <td>{data.header.previousHash}</td>
                        <td>{data.header.merkleRoot}</td>
                        <td>{data.header.timestamp}</td>
                        <td>{data.header.difficulty}</td>
                        <td>{data.header.nonce}</td>
                        <td>{JSON.stringify(data.body)}</td> */}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Paper>
              {/* <div id="socket_writefield"></div> */}
              <textfild
                defaultValue="No transactions in transaction pool"
                id="poolWritefield"
              />
              <div className="card__footer"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mining;
