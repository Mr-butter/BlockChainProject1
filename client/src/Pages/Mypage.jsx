import React, { Fragment, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  auth,
  getblock,
  messageFromSocket,
  userAmount,
} from "../redux/actions/index";
import { decryption } from "../utils/decrypt";
import styled from "styled-components";
import _ from "lodash";
import {
  Stack,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  TextField,
} from "@mui/material";
import ligthWallet from "eth-lightwallet";
import axios from "axios";

// import Modal from "../components/walletModal/modal";
// import ModalStyles from "../walletModal/ModalStyles";

const Container = styled.div`
  display: flex;
  margin-left: 150px
  width:100%
  justify-content: center;
  align-items: center;
`;

function Mypage(props) {
  const dispatch = useDispatch();
  const userState = useSelector((state) => state.User);
  const socketState = useSelector((state) => state.Socket);
  const userAuth = userState.isAuth;
  const userAddress = userState.address;
  const myAmount = userState.amount;

  const [receiverAddress, setReceiverAddress] = useState(null);
  const [sendAmount, setSendAmount] = useState(null);
  const [VarPwdFromUser, setVarPwdFromUser] = useState("");
  const [Mnemonic, setMnemonic] = useState("");
  const [PrivateKey, setPrivateKey] = useState("니모닉을 먼저 확인해주세요.");
  const serverPort = parseInt(window.location.port) + 2000;
  const serverUrl = `http://127.0.0.1:${serverPort}`;

  useEffect(() => {
    if (userAddress !== "") {
      dispatch(userAmount(userAddress));
    }
  }, [socketState]);

  function getWalletPwdFromUser() {
    keystore.keyFromPassword(VarPwdFromUser, function (err, pwDerivedKey) {
      if (keystore.isDerivedKeyCorrect(pwDerivedKey)) {
        const seed = keystore.getSeed(pwDerivedKey);
        const privatekey = keystore.exportPrivateKey(address[0], pwDerivedKey);

        return setMnemonic(seed), setPrivateKey(privatekey);
      } else {
        return setMnemonic("비밀번호달라요");
      }
    });
  }

  function sendTransation() {
    axios
      .post(`${serverUrl}/sendTransation`, {
        myAddress: userState.address,
        receiverAddress: receiverAddress,
        sendAmount: parseInt(sendAmount),
      })
      .then((res) => {
        const data = res.data.message;
        console.log(res.data.message);
      });
    setReceiverAddress(null);
    setSendAmount(null);
  }

  function getVarPwdFromUser(event) {
    setVarPwdFromUser(event.currentTarget.value);
  }

  const decStr = JSON.parse(decryption(localStorage.getItem("loglevel")));
  const keystore = new ligthWallet.keystore.deserialize(decStr);
  const address = keystore.getAddresses();

  function MypageMenu(Auth) {
    if (Auth) {
      return (
        <Stack direction={"column"} spacing={2} sx={{ width: "100%" }}>
          <div className="card" style={{ width: "100%" }}>
            <div className="card__header">
              <h2>My Wallet</h2>
            </div>
            <div className="card__body" style={{ width: "100%" }}>
              <Stack direction={"column"} spacing={2}>
                <TableContainer
                  component={Paper}
                  sx={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  <Table sx={{ width: "100%" }} aria-label="simple table">
                    <TableBody>
                      <TableRow
                        sx={{
                          "&:last-child td, &:last-child th": {
                            border: 0,
                          },
                          height: "7vh",
                        }}
                      >
                        <TableCell
                          component="th"
                          scope="row"
                          style={{
                            fontWeight: "bold",
                            width: "20%",
                          }}
                        >
                          My Address
                        </TableCell>
                        <TableCell
                          align="left"
                          style={{
                            fontWeight: "bold",
                            width: "80%",
                          }}
                        >
                          {address}
                        </TableCell>
                      </TableRow>
                      <TableRow
                        sx={{
                          "&:last-child td, &:last-child th": {
                            border: 0,
                          },
                          height: "7vh",
                        }}
                      >
                        <TableCell
                          component="th"
                          scope="row"
                          style={{
                            fontWeight: "bold",
                            width: "200px",
                          }}
                        >
                          Amount
                        </TableCell>
                        <TableCell
                          align="left"
                          style={{
                            fontWeight: "bold",
                            width: "200px",
                          }}
                        >
                          {myAmount}
                        </TableCell>
                      </TableRow>
                      <TableRow
                        sx={{
                          "&:last-child td, &:last-child th": {
                            border: 0,
                          },
                          height: "7vh",
                        }}
                      >
                        <TableCell
                          component="th"
                          scope="row"
                          style={{
                            fontWeight: "bold",
                            width: "200px",
                          }}
                        >
                          My Mnemonic
                        </TableCell>
                        <TableCell
                          align="left"
                          style={{
                            fontWeight: "bold",
                            width: "200px",
                          }}
                        >
                          {Mnemonic === "" ? (
                            <Stack spacing={2} direction={"row"}>
                              <TextField
                                type={"password"}
                                onChange={getVarPwdFromUser}
                                value={VarPwdFromUser}
                                // label="Input your password"
                                placeholder="Input your password"
                                fullwidth
                                required
                                style={{
                                  width: "250px",
                                }}
                              ></TextField>
                              <Button
                                onClick={getWalletPwdFromUser}
                                size="small"
                                variant="contained"
                              >
                                submit
                              </Button>
                            </Stack>
                          ) : (
                            Mnemonic
                          )}
                        </TableCell>
                      </TableRow>
                      <TableRow
                        sx={{
                          "&:last-child td, &:last-child th": {
                            border: 0,
                          },
                          height: "7vh",
                        }}
                      >
                        <TableCell
                          component="th"
                          scope="row"
                          style={{
                            fontWeight: "bold",
                          }}
                        >
                          My PrivateKey
                        </TableCell>
                        <TableCell
                          align="left"
                          style={{
                            fontWeight: "bold",
                          }}
                        >
                          {PrivateKey}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Stack>
            </div>
          </div>

          <div className="card" style={{ width: "100%" }}>
            <div className="card__header">
              <h2>Send transaction</h2>
            </div>
            <div className="card__body" style={{ width: "100%" }}>
              <Stack direction={"column"} spacing={2}>
                <TableContainer
                  component={Paper}
                  sx={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  <Table sx={{ width: "100%" }} aria-label="simple table">
                    <TableBody>
                      <TableRow
                        sx={{
                          "&:last-child td, &:last-child th": {
                            border: 0,
                          },
                          height: "7vh",
                        }}
                      >
                        <TableCell
                          component="th"
                          scope="row"
                          style={{
                            fontWeight: "bold",
                            Width: "20%",
                          }}
                        >
                          Reciver Address
                        </TableCell>
                        <TableCell
                          align="left"
                          style={{
                            fontWeight: "bold",
                            width: "80%",
                          }}
                        >
                          <TextField
                            type={"text"}
                            onChange={(e) =>
                              setReceiverAddress(e.currentTarget.value)
                            }
                            value={receiverAddress}
                            // label="Input your password"
                            placeholder="Input Address"
                            fullwidth
                            required
                            style={{
                              width: "100%",
                            }}
                          ></TextField>
                        </TableCell>
                      </TableRow>
                      <TableRow
                        sx={{
                          "&:last-child td, &:last-child th": {
                            border: 0,
                          },
                          height: "7vh",
                        }}
                      >
                        <TableCell
                          component="th"
                          scope="row"
                          style={{
                            fontWeight: "bold",
                          }}
                        >
                          Send Amount
                        </TableCell>
                        <TableCell
                          align="left"
                          style={{
                            fontWeight: "bold",
                          }}
                        >
                          <TextField
                            type={"number"}
                            onChange={(e) =>
                              setSendAmount(e.currentTarget.value)
                            }
                            value={sendAmount}
                            // label="Input your password"
                            placeholder="Input Amount"
                            fullwidth
                            required
                            style={{
                              width: "100%",
                            }}
                          ></TextField>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
                <Button
                  onClick={() => sendTransation()}
                  size="small"
                  variant="contained"
                >
                  submit
                </Button>
              </Stack>
            </div>
          </div>
        </Stack>
      );
    } else {
      return <h1>로그인이 필요한 서비스 입니다.</h1>;
    }
  }

  return <Container>{MypageMenu(userAuth)}</Container>;
}

export default Mypage;
