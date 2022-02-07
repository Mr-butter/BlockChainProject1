import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, FormControl, OutlinedInput, Paper, Tab, Table, TableBody, TableCell, TableHead, TablePagination, TableRow, TextField } from "@mui/material";
import styled from "styled-components";
import axios from "axios";
import { DataGrid } from '@mui/x-data-grid';
import { useHistory } from "react-router";

const CssTextField = styled(TextField)({
  "& label.Mui-focused": {
    color: "grey",
  },
  "& .MuiInput-underline:after": {
    borderBottomColor: "grey",
    color: "grey",
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "gold",
      textcolor: "grey",
      color: "grey",
    },
    "&:hover fieldset": {
      borderColor: "yellow",
      color: "grey",
    },
    "&.Mui-focused fieldset": {
      borderColor: "gold",
      color: "grey",
    },
  },
});

const columns = [
  { id: 'txOutId', label: 'txOutId', minWidth: 170 },
  { id: 'txOutIndex', label: 'txOutIndex', minWidth: 50 },
  { id: 'address', label: 'address', minWidth: 170 },
  { id: 'amount', label: 'amount', minWidth: 100 },
];

const Transaction = () => {
  const userState = useSelector((state) => state.user);
  const ws = useRef(null);
  const [socketMessage, setSocketMessage] = useState(null);
  const [TransactionPool, setTransactionPool] = useState([]);
  const reverse = [...TransactionPool].reverse();
  // const [txOutId, setTxOutId] = useState("");
  // const [txOutIndex, setTxOutIndex] = useState("");
  // const [address, setAddress] = useState("");
  // const [amountpool, setAmountpool] = useState("");

  const serverPort = parseInt(window.location.port) + 2000;
  const serverUrl = `http://127.0.0.1:${serverPort}`;

  const history = useHistory();
  const dispatch = useDispatch();
  ///////////////////////////////////////////////////////////
  // 아래는 입력창 객체를 업데이트하는 useState
  // const [fromAddress, setFromAddress] = useState("04bfcab8722991ae774db48f934ca79cfb7dd991229153b9f732ba5334aafcd8e7266e47076996b55a14bf9913ee3145ce0cfc1372ada8ada74bd287450313534b");
  const [fromAddress, setFromAddress] = useState("0x23009f380afbb841bf93b7e2d728060041d11fb0");

  const getFromAddress = (event) => {
    console.log(event.target)
    console.log(event.target.value)

    setFromAddress(event.target.value)
  }

  const [amount, setAmount] = useState("")

  const getAmount = (event) => {
    setAmount(event.target.value)
  }

  // function getFromAddress(event) {
  //   setGetFromAddress(event.currentTarget.value);
  // }
  /////////////////////////////////////////////////////////////

  useEffect(() => {
    if (socketMessage !== null) {
        ws.current.onmessage = (e) => {
            // a message was received
            let reciveData = JSON.parse(JSON.parse(e.data).data);
            setSocketMessage(reciveData);
            if (reciveData !== null) {
                setSocketMessage(JSON.parse(JSON.parse(e.data).data)[0]);
                setSocketMessage(socketMessage.header.index);
                // setTxOutId(socketMessage.header.txOutId);
                // setTxOutIndex(socketMessage.header.txOutIndex);
                // setAddress(socketMessage.header.address);
                // setAmountpool(socketMessage.header.amount);
                document.getElementById("socket_writefield").innerText =
                    JSON.stringify(socketMessage);
            }
        };
    }
  }, [socketMessage]);

    function inputPort() {
      const inputport = prompt(
          "포트를 입력해주세요.\nex)6001",
          parseInt(6001)
      );
      axios
          .post(`${serverUrl}/inputport`, { port: inputport })
          .then((res) => {
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
              const data = JSON.stringify(res.data.message);
              // console.log(res.data.message);
              document.getElementById("poolWritefield").innerText = data;
          });
  }

  function sendTransation() {
    // const receiverAddress = prompt(
    //     "받는사람 주소를 입력하세요",
    //     "04bfcab8722991ae774db48f934ca79cfb7dd991229153b9f732ba5334aafcd8e7266e47076996b55a14bf9913ee3145ce0cfc1372ada8ada74bd287450313534b"
    // );
    const receiverAddress = prompt("받으시는 분 주소 맞습니까?", fromAddress)
    // const sendAmounte = Number(prompt("보내실 금액을 입력해주세요", 50));
    const sendAmount = Number(prompt("전송 요청하신 금액이 맞습니까?", amount));
    axios
        .post(`${serverUrl}/sendTransation`, {
            myAddress: userState.address,
            receiverAddress: receiverAddress,
            sendAmount: sendAmount,
        })
        .then((res) => {
            // const data = res.data.message;
            console.log(res.data.message);
            // document.getElementById("writefield").innerText = data;
        });
  }
  

  function getTransactionPool() {
    axios.post(`${serverUrl}/getTransactionPool`).then((res) => {
        const data = res.data;
        console.log(data);
        // document.getElementById("poolWritefield").innerText =
        //     JSON.stringify(data);
            setTransactionPool(data);
    })
    .then((res) => setTransactionPool(res.data))
    .catch((error) => console.error(`ERROR: ${error}`));
  }

  // function getUserAmount(userAddress) {
  //   axios
  //       .post(`${serverUrl}/getUserAmount`, {
  //           userAddress: userAddress,
  //       })
  //       .then((res) => {
  //           const data = res.data.message;
  //           document.getElementById("writefield").innerText = data;
  //       });
  // }

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
        <h2>Create transaction</h2>
        <br />
        <div>
          <div className="col-8" style={{ width: "1100px" }}>
            <div className="card" style={{ width: "900px" }}>
              <div className="card__header">
                <h3>Transfer some money to someone!</h3>
              </div>
              <div id="writefield"></div>
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
                    {/* <Button
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
                    </Button> */}

                    {/* <Button
                        color="primary"
                        id="mineBlockWithTransation"
                        onClick={() =>
                            mineBlockWithTransation(userState.address)
                        }
                        style={{
                          borderRadius: 10,
                          borderColor: "gold",
                          color: "gold",
                          size: 100,
                          padding: "10px",
                        }}
                    >
                        트랜잭선&블록채굴
                    </Button> */}
                    <Button
                        id="sendTransation"
                        onClick={() => sendTransation()}
                        style={{
                          borderRadius: 10,
                          borderColor: "gold",
                          color: "gold",
                          size: 100,
                          padding: "10px",
                        }}
                    >
                        거래하기
                    </Button>
                </table>
                <div>                
                <CssTextField label=" From address" type={"text"} onChange={getFromAddress} value={fromAddress} style={{
                    marginTop: 11,
                    width: "800px",
                    height: "50px",
                    flex: 1, 
                    margin: '20px 10px',
                    padding: "10px 10px",
                    color: 'grey',
                    marginBottom: "50px"
                  }} 
                  helperText="This is your wallet address. You cannot change it because you can only spend your own coins."
                  inputProps={{ style: { fontFamily: 'Arial', color: 'white', padding: "17px 15px"}}}
                  />
                </div>
                <br />
                {/* <CssTextField
                  label=" To address"
                  style={{
                    marginTop: 5,
                    width: "800px",
                    height: "100px",
                    padding: "10px",
                  }}
                  helperText="The address of the wallet where you want to send the money to. You can type random text here (if you are not interested in recovering the funds)"
                  id="toAdd"
                /> */}
                <CssTextField
                  label=" Amount"
                  // value={}
                  style={{
                    marginTop: 5,
                    width: "800px",
                    height: "70px",
                    flex: 1, 
                    margin: '20px 10px',
                    padding: "10px 10px",
                    color: 'grey',
                    marginBottom: "50px"
                  }}
                  inputProps={{ style: { fontFamily: 'Arial', color: 'white', padding: "17px 15px"}}}
                  onChange={getAmount} 
                  value={amount}
                  helperText="You can transfer any amount. Account balance is not checked in this demo. Have at it!
                  "
                  id="amount"
                />
              </div>
              {/* <Button
                onClick={() => {sendTransation()}}
                style={{
                  borderRadius: 10,
                  borderColor: "gold",
                  marginLeft: 30,
                  color: "gold",
                  size: 100,
                  padding: "10px",
                  marginBottom: "50px",
                  marginLeft: "500px"
                }}
                // onClick={connect}
                variant="outlined"
              >
                Sign & create transaction
              </Button> */}
              <h3>Transaction pool</h3>
                    <Button
                        color="primary"
                        id="getTransactionPool"
                        onClick={() => getTransactionPool()}
                        style={{
                          borderRadius: 10,
                          borderColor: "gold",
                          color: "gold",
                          size: 100,
                          padding: "10px",
                        }}
                    >
                        get TransactionPool
                    </Button>

              <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <Table sx={{ minWidth: 650 }} aria-label="sticky table" stickyHeader>
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
                        {data.txOutId}
                      </TableCell>
                      <TableCell align="left" style={{ color: "#bbbbbb" }}>
                        {data.txOutIndex}
                      </TableCell>
                      <TableCell align="left" style={{ color: "#bbbbbb" }}>
                        {data.address}
                      </TableCell>
                      <TableCell align="left" style={{ color: "#bbbbbb" }}>
                        {data.txOutIndex}
                      </TableCell>
                      <td>{data.txOutId}</td>
                      <td>{data.txOutIndex}</td>
                      <td>{data.address}</td>
                      <td>{data.txOutIndex}</td>
                  </TableRow>
                ))}
                </TableBody>
                </Table>
              </Paper>
                <div id="socket_writefield"></div>
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

export default Transaction;
