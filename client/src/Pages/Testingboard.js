import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import CryptoJS from "crypto-js";

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

    function Testingboard() {
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
                // const data = res.data.message;
                // document.getElementById("writefield").innerText = data;
            });
        }

        function addPeer() {
            axios.post("/addPeer").then((res) => {
                const data = res.data.message;
                document.getElementById("writefield").innerText = data;
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

            console.log(process.env.REACT_APP_KEY);
            console.log(process.env.REACT_APP_IV);


            // function encryption(data, key, iv) {
            function encryption(data) {

                const key = "aaaaaaaaaabbbbbb";
                const iv = "aaaaaaaaaabbbbbb";

                const keyutf = CryptoJS.enc.Utf8.parse(key);
                console.log("키유티에프:", keyutf);
                const ivutf = CryptoJS.enc.Utf8.parse(iv);
                console.log("아이브이유티에프:", ivutf);

                const encObj = CryptoJS.AES.encrypt(JSON.stringify(data), keyutf, { iv: ivutf });
                //console.log("key : toString(CryptoJS.enc.Utf8)" + encObj.key.toString(CryptoJS.enc.Utf8));
                //console.log("iv : toString(CryptoJS.enc.Utf8)" + encObj.iv.toString(CryptoJS.enc.Utf8));
                //console.log("salt : " + encObj.salt);
                //console.log("ciphertext : " + encObj.ciphertext);

                const encStr = encObj + "alswn";
                console.log("encStr : " + encStr);

                return encStr

            }

            axios
                .post("/wallet/newWallet", {
                    password: walletPwdFromUser,
                    mnemonic: mnemonicFromUser,
                })
                .then((res) => {
                    const data = res.data;
                    //const enc = encryption(data, process.env.REACT_APP_KEY, process.env.REACT_APP_IV)
                    // console.log(process.env.REACT_APP_KEY);
                    // console.log(process.env.REACT_APP_IV);
                    const enc = encryption(data)

                    localStorage.setItem("loglevel", enc);

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

            //function decryption(encStr, key, iv) {
            function decryption(encStr) {

                const key = "aaaaaaaaaabbbbbb";
                const iv = "aaaaaaaaaabbbbbb";

                const keyutf = CryptoJS.enc.Utf8.parse(key);
                //console.log("키유티에프:", keyutf);
                const ivutf = CryptoJS.enc.Utf8.parse(iv);
                //console.log("아이브이유티에프:", ivutf);

                //CryptoJS AES 128 복호화
                const decObj = CryptoJS.AES.decrypt({ ciphertext: CryptoJS.enc.Base64.parse(encStr) }, keyutf, { iv: ivutf });
                // console.log("decObj가 나올라나", decObj);

                const decStr = CryptoJS.enc.Utf8.stringify(decObj);
                //console.log("decStr : " + decStr);

                return decStr
            }

            //const dec = decryption(loglevel, process.env.REACT_APP_KEY, process.env.REACT_APP_IV)
            const dec = decryption(loglevel)
            console.log(dec);


            axios
                .post("/wallet/getWallet", {
                    password: walletPwdFromUser,
                    loglevel: loglevel,
                    decryption: dec,
                })
                .then((res) => {
                    const data = res.data;
                    document.getElementById("writefield").innerText =
                        JSON.stringify(data);
                });
        }

        function restoreWallet() {

            let walletPwdFromUser = prompt(
                "새로운 비밀번호를 입력하세요",
                "1234"
            );
            let mnemonicFromUser = prompt(
                "지갑을 복구하기 위한 니모닉을 입력하세요",
                "soft wedding roof real apple evil excuse despair fragile ahead repair pluck"
            );

            // function encryption(data, key, iv) {
            function encryption(data) {

                const key = "aaaaaaaaaabbbbbb";
                const iv = "aaaaaaaaaabbbbbb";

                const keyutf = CryptoJS.enc.Utf8.parse(key);
                console.log("키유티에프:", keyutf);
                const ivutf = CryptoJS.enc.Utf8.parse(iv);
                console.log("아이브이유티에프:", ivutf);

                const encObj = CryptoJS.AES.encrypt(JSON.stringify(data), keyutf, { iv: ivutf });
                //console.log("key : toString(CryptoJS.enc.Utf8)" + encObj.key.toString(CryptoJS.enc.Utf8));
                //console.log("iv : toString(CryptoJS.enc.Utf8)" + encObj.iv.toString(CryptoJS.enc.Utf8));
                //console.log("salt : " + encObj.salt);
                //console.log("ciphertext : " + encObj.ciphertext);

                const encStr = encObj + "alswn";
                console.log("encStr : " + encStr);

                return encStr

            }

            function decryption(encStr) {
                const key = "aaaaaaaaaabbbbbb";
                const iv = "aaaaaaaaaabbbbbb";

                const keyutf = CryptoJS.enc.Utf8.parse(key);
                //console.log("키유티에프:", keyutf);
                const ivutf = CryptoJS.enc.Utf8.parse(iv);
                //console.log("아이브이유티에프:", ivutf);

                //CryptoJS AES 128 복호화
                const decObj = CryptoJS.AES.decrypt(
                    { ciphertext: CryptoJS.enc.Base64.parse(encStr) },
                    keyutf,
                    { iv: ivutf }
                );
                // console.log("decObj가 나올라나", decObj);

                const decStr = CryptoJS.enc.Utf8.stringify(decObj);
                //console.log("decStr : " + decStr);

                return decStr;
            }

            //const dec = decryption(loglevel);
            //console.log(dec);

            axios
                .post("/wallet/restoreWallet", {
                    password: walletPwdFromUser,
                    mnemonic: mnemonicFromUser,
                })
                .then((res) => {
                    const data = res.data;
                    console.log(data.keystore);

                    const enc = encryption(data.keystore)

                    localStorage.setItem("loglevel", enc);

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
                    <li>
                        <button id="restoreWallet" onClick={() => restoreWallet()}>
                            restoreWallet
                        </button>
                    </li>
                </ol>
                <div id="writefield"></div>
            </div>
        );
    }
}

export default Testingboard;