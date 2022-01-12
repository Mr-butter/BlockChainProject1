import axios from "axios";
import React, { useEffect, useRef, useState } from "react";

function Testingboard(props) {
    const ws = useRef(null);
    const [socketMessage, setSocketMessage] = useState("");
    useEffect(() => {
        ws.current = new WebSocket(`ws://127.0.0.1:6001/`);
        ws.current.onopen = () => {
            // connection opened
            console.log("connected");
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
            setSocketMessage(e.data);
        };

        document.getElementById("socket_writefield").innerText =
            JSON.stringify(socketMessage);
    }, [socketMessage]);

    function block() {
        axios.post("/blocks").then((res) => {
            const data = res.data;
            document.getElementById("writefield").innerText =
                JSON.stringify(data);
        });
    }

    function mineBlock(onOff) {
        axios.post("/mineBlock", { switchOnOff: onOff }).then((res) => {
            // const data = res.data;
            // document.getElementById("writefield").innerText =
            //     JSON.stringify(data);
            const data = res.data.message;
            document.getElementById("writefield").innerText = data;
        });
    }
    function addPeer() {
        axios.post("/addPeer").then((res) => {
            const data = res.data;
            console.log(data);
        });
    }

    function version() {
        axios.post("/version").then((res) => {
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

    function peers() {
        axios.post("/peers").then((res) => {
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

                localStorage.setItem("loglevel", JSON.stringify(data));

                document.getElementById("writefield").innerText =
                    JSON.stringify(data);
            });
    }

    function getWallet() {
        let walletPwdFromUser = prompt(
            "지갑을 가져오기 위해 비밀번호를 입력하세요.",
            "1234"
        );

        const loglevel = localStorage.getItem("loglevel");
        console.log("로컬스토리지 client 확인 : ", loglevel);

        axios
            .post("/wallet/getWallet", {
                password: walletPwdFromUser,
                loglevel: loglevel,
            })
            .then((res) => {
                const data = res.data;
                document.getElementById("writefield").innerText =
                    JSON.stringify(data);
            });
    }

    return (
        <div>
            <h2>테스트 코드</h2>
            <ol>
                <li>
                    <button id="blocks" onClick={() => block()}>
                        get blocks
                    </button>
                </li>
                <li>
                    <button id="addPeer" onClick={() => addPeer()}>
                        addPeer
                    </button>
                </li>
                <li>
                    <button id="mineBlockon" onClick={() => mineBlock("on")}>
                        mineBlock(on)
                    </button>
                </li>
                <li>
                    <button id="mineBlockoff" onClick={() => mineBlock("off")}>
                        mineBlock(off)
                    </button>
                </li>
                <li>
                    <button id="version" onClick={() => version()}>
                        version
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
            </ol>
            <h2>테스트 코드 결과</h2>
            <div id="writefield"></div>
            <h2>소켓 메세지</h2>
            <div id="socket_writefield"></div>
        </div>
    );
}

export default Testingboard;
