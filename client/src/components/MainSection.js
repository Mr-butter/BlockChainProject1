import axios from "axios";
import React from "react";
import { withRouter } from "react-router-dom";

function MainSection(props) {
    function block() {
        axios.post("/blocks").then((res) => {
            const data = res.data;
            document.getElementById("writefield").innerText =
                JSON.stringify(data);
        });
    }
    function mineBlock() {
        axios
            .post("/mineBlock", {
                data: [{ transection: Math.random() * 1000 }],
            })
            .then((res) => {
                const data = res.data;
                document.getElementById("writefield").innerText =
                    JSON.stringify(data);
            });
    }
    function version() {
        axios.post("/version").then((res) => {
            const data = res.data;
            document.getElementById("writefield").innerText =
                JSON.stringify(data);
        });
    }

    function connectSocketServer() {
        axios.post("/socketServer/connectServer").then((res) => {
            const data = res.data;
            console.log(data);
        });
    }

    function sendMessage() {
        let ws = new WebSocket("ws://localhost:6001");

        ws.onopen = function () {
            ws.send("할로");
        };
        ws.onmessage = function (e) {
            console.log(e.data);
        };
    }

    function addPeers() {
        let socketport = prompt(
            "참여할 주소 입력하세요\n ex:ws://localhost:6001",
            "ws://localhost:6001"
        );
        axios
            .post("/addPeers", {
                data: [socketport],
            })
            .then((res) => {
                const data = res.data;
                document.getElementById("writefield").innerText =
                    JSON.stringify(data);
            });
    }

    function peers() {
        axios.get("/peers").then((res) => {
            const data = res.data;
            document.getElementById("writefield").innerText =
                JSON.stringify(data);
        });
    }

    function address() {
        axios.get("/address").then((res) => {
            const data = res.data;
            document.getElementById("writefield").innerText =
                JSON.stringify(data);
        });
    }

    function makeWallet() {
        axios.post("/initWallet").then((res) => {
            const data = res.data;
            document.getElementById("writefield").innerText =
                JSON.stringify(data);
        });
    }

    function mnemonic() {
        axios.post("/wallet/mnemonic").then((res) => {
            const data = res.data;
            document.getElementById("writefield").innerText =
                JSON.stringify(data);
        });
    }

    function newWallet() {
        let walletPwdFromUser = prompt(
            "지갑 생성을 위한 패스워드를 입력하세요.",
            "1234"
        );
        let mnemonicFromUser = prompt(
            "니모닉을 입력하세요."
        );
        axios
            .post("/wallet/newWallet", {
                password: walletPwdFromUser,
                mnemonic: mnemonicFromUser
            })
            .then((res) => {
                const data = res.data;
                document.getElementById("writefield").innerText =
                    JSON.stringify(data);
            });
    }


    function getWallet() {
        localStorage.setItem('name', '로컬스토리에 저장합니다.');
        const getValue = localStorage.getItem('name');
        console.log('로컬스토리지확인', getValue);
        axios
            .post("/wallet/getWallet", {

                get: getValue
            })
            .then((res) => {
                const data = res.data;
                document.getElementById("writefield").innerText =
                    JSON.stringify(data);
            });
    }

    return (
        <div>
            <h2>메인 페이지 내용 추가</h2>
            <ol>
                <li>
                    <button id="blocks" onClick={() => block()}>
                        get blocks
                    </button>
                </li>
                <li>
                    <button id="mineBlock" onClick={() => mineBlock()}>
                        mineBlock
                    </button>
                </li>
                <li>
                    <button id="version" onClick={() => version()}>
                        version
                    </button>
                </li>
                <li>
                    <button id="connectSocketServer" onClick={() => connectSocketServer()} >
                        connectSocketServer
                    </button>
                </li>
                <li>
                    <button id="sendMessage" onClick={() => sendMessage()}>
                        sendMessage
                    </button>
                </li>
                <li>
                    <button id="addPeers" onClick={() => addPeers()}>
                        addPeers(test...)
                    </button>
                </li>
                <li>
                    <button id="peers" onClick={() => peers()}>
                        peers(test...)
                    </button>
                </li>
                <li>
                    <button id="address" onClick={() => address()}>
                        address(test...)
                    </button>
                </li>
                <li>
                    <button id="initwallet" onClick={() => makeWallet()}>
                        initwallet
                    </button>
                </li>
                <li>
                    <button id="mnemonic" onClick={() => mnemonic()}>
                        mnemonic
                    </button>
                </li>
                <li>
                    <button id="newWallet" onClick={() => newWallet()}>
                        newWallet
                    </button>
                </li>
                <li>
                    <button id="getWallet" onClick={() => getWallet()}>
                        getWallet
                    </button>
                </li>
            </ol>
            <div id="writefield"></div>
        </div>
    );
}

export default withRouter(MainSection);
