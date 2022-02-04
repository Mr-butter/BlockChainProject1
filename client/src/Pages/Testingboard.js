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
import { useSelector, useDispatch } from "react-redux";

function Testingboard(props) {
    const userState = useSelector((state) => state.user);
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

    useEffect(() => {
        if (socketMessage !== null) {
            ws.current.onmessage = (e) => {
                // a message was received
                let reciveData = JSON.parse(JSON.parse(e.data).data);
                setSocketMessage(reciveData);
                if (reciveData !== null) {
                    setSocketMessage(JSON.parse(JSON.parse(e.data).data)[0]);
                    // setBlockIndex(socketMessage.header.index);
                    // setPrevHash(socketMessage.header.previousHash);
                    // setblockMerkleRoot(socketMessage.header.merkleRoot);
                    // setBlockTimestamp(socketMessage.header.timestamp);
                    // setBlockDifficulty(socketMessage.header.difficulty);
                    // setBlocktNonce(socketMessage.header.nonce);
                    // setBlocktData(socketMessage.body);
                    document.getElementById("socket_writefield").innerText =
                        JSON.stringify(socketMessage);
                }
            };
        }

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

    function block() {
        axios.post(`${serverUrl}/blocks`).then((res) => {
            const data = res.data;
            document.getElementById("writefield").innerText =
                JSON.stringify(data);
        });
    }

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

    function mineBlock(onOff) {
        const userAddress = userState.address;
        axios
            .post(`${serverUrl}/mineBlock`, {
                switchOnOff: onOff,
                userAddress: userAddress,
            })
            .then((res) => {
                const data = res.data.message;
                console.log(res.data.message);
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
                document.getElementById("writefield").innerText = data;
            });
    }
    function sendTransactionwithmineBlock() {
        const receiverAddress = prompt(
            "받는사람 주소름 입력하세요",
            "04bfcab8722991ae774db48f934ca79cfb7dd991229153b9f732ba5334aafcd8e7266e47076996b55a14bf9913ee3145ce0cfc1372ada8ada74bd287450313534b"
        );
        const sendAmounte = Number(prompt("보내실 금액을 입력해주세요", 50));
        axios
            .post(`${serverUrl}/sendTransationwithmineBlock`, {
                myAddress: userState.address,
                receiverAddress: receiverAddress,
                sendAmounte: sendAmounte,
            })
            .then((res) => {
                // const data = res.data.message;
                console.log(res.data.message);
                // document.getElementById("writefield").innerText = data;
            });
    }

    function sendTransation() {
        const receiverAddress = prompt(
            "받는사람 주소름 입력하세요",
            "ex) 0x23009f380afbb841bf93b7e2d728060041d11fb0"
        );
        const sendAmounte = Number(prompt("보내실 금액을 입력해주세요", 50));
        axios
            .post(`${serverUrl}/sendTransation`, {
                myAddress: userState.address,
                receiverAddress: receiverAddress,
                sendAmounte: sendAmounte,
            })
            .then((res) => {
                // const data = res.data.message;
                // console.log(res.data.message);
                // document.getElementById("writefield").innerText = data;
            });
    }

    function getUserAmount(userAddress) {
        axios
            .post(`${serverUrl}/getUserAmount`, {
                userAddress: userAddress,
            })
            .then((res) => {
                const data = res.data.message;
                document.getElementById("writefield").innerText = data;
            });
    }

    function getSocket() {
        axios.post(`${serverUrl}/getSocket`).then((res) => {
            const data = res.data;
            console.log(data);
            document.getElementById("writefield").innerText = data;
        });
    }

    function getUnspentTxOuts() {
        axios.post(`${serverUrl}/getUnspentTxOuts`).then((res) => {
            const data = res.data;
            console.log(data);
            document.getElementById("writefield").innerText =
                JSON.stringify(data);
        });
    }

    function version() {
        axios.post(`${serverUrl}/version`).then((res) => {
            const data = res.data;
            document.getElementById("writefield").innerText =
                JSON.stringify(data);
        });
    }
    function getTransactionPool() {
        axios.post(`${serverUrl}/getTransactionPool`).then((res) => {
            const data = res.data;
            console.log(data);
            document.getElementById("writefield").innerText =
                JSON.stringify(data);
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
                    <Button
                        color="primary"
                        id="connectPeer"
                        onClick={() => {
                            inputPort();
                        }}
                    >
                        connectPeer
                    </Button>
                </li>
                <li>
                    <Button
                        color="primary"
                        id="mineBlockWithTransation"
                        onClick={() =>
                            mineBlockWithTransation(userState.address)
                        }
                    >
                        mineBlock With Transation
                    </Button>
                </li>
                <li>
                    <Button
                        color="primary"
                        id="getUserAmount"
                        onClick={() => getUserAmount(userState.address)}
                    >
                        getUserAmount
                    </Button>
                </li>
                <li>
                    <Button
                        color="primary"
                        id="sendTransation"
                        onClick={() => sendTransation()}
                    >
                        sendTransation
                    </Button>
                </li>
                <li>
                    <Button color="primary" id="blocks" onClick={() => block()}>
                        get blocks
                    </Button>
                </li>
                <li>
                    <Button
                        color="primary"
                        id="inputPort"
                        onClick={() => webon()}
                    >
                        connect websocket
                    </Button>
                </li>
                <li>
                    <Button
                        color="primary"
                        id="getSocket"
                        onClick={() => getSocket()}
                    >
                        getSocket
                    </Button>
                </li>
                <li>
                    <Button
                        color="primary"
                        id="getTransactionPool"
                        onClick={() => getTransactionPool()}
                    >
                        get TransactionPool
                    </Button>
                </li>
                <li>
                    <Button
                        color="primary"
                        id="getUnspentTxOuts"
                        onClick={() => getUnspentTxOuts()}
                    >
                        get UnspentTxOuts
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
                        id="sendTransactionwithmineBlock"
                        onClick={() => sendTransactionwithmineBlock()}
                    >
                        sendTransactionwithmineBlock
                    </Button>
                </li>
                <li>
                    <Button
                        color="primary"
                        id="version"
                        onClick={() => version()}
                    >
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
