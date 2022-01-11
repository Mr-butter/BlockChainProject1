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
        axios.post("/mineBlock").then((res) => {
            const data = res.data;
            console.log(data);
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
            let sendData = { event: 'open' }
            ws.send(JSON.stringify('open'));

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
        axios.post("/peers")
            .then((res) => {
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
        let mnemonicFromUser = prompt("니모닉을 입력하세요.");


        axios
            .post("/wallet/newWallet", {
                password: walletPwdFromUser,
                mnemonic: mnemonicFromUser,
            })
            .then((res) => {
                const data = res.data;

                localStorage.setItem('loglevel', JSON.stringify(data));

                document.getElementById("writefield").innerText =
                    JSON.stringify(data);
            });
    }


    function getWallet() {
        let walletPwdFromUser = prompt(
            "지갑을 가져오기 위해 비밀번호를 입력하세요.",
            "1234"
        );


        const loglevel = localStorage.getItem('loglevel');
        console.log('로컬스토리지 client 확인 : ', loglevel);

        axios
            .post("/wallet/getWallet", {
                password: walletPwdFromUser,
                loglevel: loglevel
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
