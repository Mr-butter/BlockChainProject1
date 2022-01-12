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
                // console.log("날 것의 데이터 : ", data);
                // console.log("제이슨 형태로 변화 : stringify", JSON.stringify(data));
                // //console.log("제이슨 형태로 변화 : toString", JSON.toString(data)); // [object JSON]
                // const parsedData = JSON.stringify(data)
                // console.log("제이슨 파서 : parse", JSON.parse(parsedData));

                // // const sencondJSON = JSON.stringify(parsedData)
                // // console.log("두번째 제이슨 형태로 변환 : stringify ", JSON.stringify(sencondJSON)); // 슬래쉬가 많아지네

                // //const ciphertext = CryptoJS.AES.encrypt(data, process.env.REACT_APP_SECRET_KEY).toString();
                // const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), 'secret key').toString()
                // console.log("암호화 합니다 : encrypted", encrypted);

                // const bytes = CryptoJS.AES.decrypt(encrypted, 'secret key').toString();
                // console.log("bytes::::", bytes);

                // console.log("풀린거 보자", bytes.toString(CryptoJS.enc.Utf8));

                // const decrypted = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
                // console.log("decrypted:::::", decrypted);

                // const originalText = bytes.toString(CryptoJS.enc.Utf8);
                // console.log("originalText:::::::", originalText);
                ////////////////////////////////////////////////////////////////////////////////////
                // function encrypt(pText, init_key, init_iv) {

                //     var key = CryptoJS.enc.Utf8.parse(init_key);
                //     var iv = CryptoJS.enc.Utf8.parse(init_iv);
                //     var cipherData = CryptoJS.AES.encrypt(pText, key, {

                //         iv: iv

                //     });

                //     return cipherData
                // }

                // function decrypt(cipherText, init_key, init_iv) {

                //     var key = CryptoJS.enc.Utf8.parse(init_key);
                //     var iv = CryptoJS.enc.Utf8.parse(init_iv);
                //     var Data = CryptoJS.AES.decrypt(cipherText, key, {

                //         iv: iv

                //     });

                //     return Data
                // }

                ////////////////////////////////////////////////////////////////////////////////////////////

                // const key = '하이';
                // const iv = '바이';

                // var ct = encrypt('aaa', key, iv).toString();
                // console.log('암호화:' + ct);
                // console.log('복호화:' + decrypt(ct, key, iv).toString(CryptoJS.enc.Utf8));
                // //console.log('복호화:' + decrypt(ct, 'key', 'iv').toString(CryptoJS.enc.Utf8));

                //////////////////////////////////////////////////////////////////////////////////////////////

                // const key = '하이';
                // const iv = '바이';

                const key = "aaaaaaaaaabbbbbb";
                const iv = "aaaaaaaaaabbbbbb";

                const keyutf = CryptoJS.enc.Utf8.parse(key);
                console.log("키유티에프:", keyutf);
                const ivutf = CryptoJS.enc.Utf8.parse(iv);
                console.log("아이브이유티에프:", ivutf);

                const encObj = CryptoJS.AES.encrypt(
                    JSON.stringify(data),
                    keyutf,
                    { iv: ivutf }
                );
                console.log(
                    "key : toString(CryptoJS.enc.Utf8)" +
                        encObj.key.toString(CryptoJS.enc.Utf8)
                );
                console.log(
                    "iv : toString(CryptoJS.enc.Utf8)" +
                        encObj.iv.toString(CryptoJS.enc.Utf8)
                );
                console.log("salt : " + encObj.salt);
                console.log("ciphertext : " + encObj.ciphertext);

                const encStr = encObj + "";
                console.log("encStr : " + encStr);

                // const test = CryptoJS.enc.Base64.parse(encStr)
                // console.log("testestet: ", test);

                // CryptoJS AES 128 복호화
                const decObj = CryptoJS.AES.decrypt(
                    { ciphertext: CryptoJS.enc.Base64.parse(encStr) },
                    keyutf,
                    { iv: ivutf }
                );
                // console.log("decObj가 나올라나", decObj);

                const decStr = CryptoJS.enc.Utf8.stringify(decObj);
                console.log("decStr : " + decStr);

                /////////////////////////////////////////////////////////////////////////////////////

                //localStorage.setItem("loglevel", JSON.stringify(data));

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
                <li>
                    <button id="getWallet" onClick={() => getWallet()}>
                        getWallet
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
