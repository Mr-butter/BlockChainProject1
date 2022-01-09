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
                    <button
                        id="connectSocketServer"
                        onClick={() => connectSocketServer()}
                    >
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
            </ol>
            <div id="writefield"></div>
        </div>
    );
}

export default withRouter(MainSection);
