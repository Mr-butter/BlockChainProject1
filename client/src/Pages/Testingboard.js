import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import CryptoJS from "crypto-js";

function Testingboard(props) {
  // const ws = useRef(null);
  // const [socketMessage, setSocketMessage] = useState("");
  // const [blockIndex, setBlockIndex] = useState("");
  // const [prevHash, setPrevHash] = useState("");
  // const [blockMerkleRoot, setblockMerkleRoot] = useState("");
  // const [blockTimestamp, setBlockTimestamp] = useState("");
  // const [blockDifficulty, setBlockDifficulty] = useState("");
  // const [blocktNonce, setBlocktNonce] = useState("");
  // const [blocktData, setBlocktData] = useState("");
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

  // useEffect(() => {
  //     ws.current.onmessage = (e) => {
  //         // a message was received
  //         let reciveData = JSON.parse(JSON.parse(e.data).data);
  //         setSocketMessage(reciveData);
  //         if (reciveData !== null) {
  //             setSocketMessage(JSON.parse(JSON.parse(e.data).data)[0]);
  //             // setBlockIndex(socketMessage.header.index);
  //             // setPrevHash(socketMessage.header.previousHash);
  //             // setblockMerkleRoot(socketMessage.header.merkleRoot);
  //             // setBlockTimestamp(socketMessage.header.timestamp);
  //             // setBlockDifficulty(socketMessage.header.difficulty);
  //             // setBlocktNonce(socketMessage.header.nonce);
  //             // setBlocktData(socketMessage.body);
  //         }
  //     };

  //     document.getElementById("socket_writefield").innerText =
  //         JSON.stringify(socketMessage);
  //     // document.getElementById("blockIndex").innerText =
  //     //     JSON.stringify(blockIndex);
  //     // document.getElementById("prevHash").innerText =
  //     //     JSON.stringify(prevHash);
  //     // document.getElementById("blockMerkleRoot").innerText =
  //     //     JSON.stringify(blockMerkleRoot);
  //     // document.getElementById("blockTimestamp").innerText =
  //     //     JSON.stringify(blockTimestamp);
  //     // document.getElementById("blockDifficulty").innerText =
  //     //     JSON.stringify(blockDifficulty);
  //     // document.getElementById("blocktNonce").innerText =
  //     //     JSON.stringify(blocktNonce);
  //     // document.getElementById("blocktData").innerText =
  //     //     JSON.stringify(blocktData);
  // }, [socketMessage]);

  function block() {
    axios.post(`${serverUrl}/blocks`).then((res) => {
      const data = res.data;
      document.getElementById("writefield").innerText = JSON.stringify(data);
    });
  }

  function inputPort() {
    const inputport = prompt("포트를 입력해주세요.\nex)5001", parseInt(5001));
    axios.post(`${serverUrl}/inputport`, { port: inputport }).then((res) => {
      // const data = res.data;
      // document.getElementById("writefield").innerText =
      //     JSON.stringify(data);
      const data = res.data.message;
      document.getElementById("writefield").innerText = data;
    });
  }

  function mineBlock(onOff) {
    axios.post(`${serverUrl}/mineBlock`, { switchOnOff: onOff }).then((res) => {
      // const data = res.data;
      // document.getElementById("writefield").innerText =
      //     JSON.stringify(data);
      const data = res.data.message;
      console.log("1");
      // document.getElementById("writefield").innerText = data;
    });
  }

  function version() {
    axios.post(`${serverUrl}/version`).then((res) => {
      const data = res.data;
      document.getElementById("writefield").innerText = JSON.stringify(data);
    });
  }
  function getsocket() {
    axios.post(`${serverUrl}/getsocket`).then((res) => {
      const data = res.data;
      document.getElementById("writefield").innerText = JSON.stringify(data);
    });
  }

  function makeWallet() {
    axios.post(`${serverUrl}/initWallet`).then((res) => {
      const data = res.data;
      document.getElementById("writefield").innerText = JSON.stringify(data);
    });
  }

  function peers() {
    axios.post(`${serverUrl}/peers`).then((res) => {
      const data = res.data;
      document.getElementById("writefield").innerText = JSON.stringify(data);
    });
  }

  function address() {
    axios.get(`${serverUrl}/address`).then((res) => {
      const data = res.data;
      document.getElementById("writefield").innerText = JSON.stringify(data);
    });
  }

  function mnemonic() {
    axios.post(`${serverUrl}/wallet/mnemonic`).then((res) => {
      const data = res.data;
      document.getElementById("writefield").innerText = JSON.stringify(data);
    });
  }

  function newWallet() {
    let walletPwdFromUser = prompt(
      "지갑 생성을 위한 패스워드를 입력하세요.",
      "1234"
    );
    let mnemonicFromUser = prompt("니모닉을 입력하세요.");

    function encryption(data) {
      const key = "aaaaaaaaaabbbbbb";
      const iv = "aaaaaaaaaabbbbbb";

      const keyutf = CryptoJS.enc.Utf8.parse(key);
      //console.log("키유티에프:", keyutf);
      const ivutf = CryptoJS.enc.Utf8.parse(iv);
      //console.log("아이브이유티에프:", ivutf);

      const encObj = CryptoJS.AES.encrypt(JSON.stringify(data), keyutf, {
        iv: ivutf,
      });
      //console.log("key : toString(CryptoJS.enc.Utf8)" + encObj.key.toString(CryptoJS.enc.Utf8));
      //console.log("iv : toString(CryptoJS.enc.Utf8)" + encObj.iv.toString(CryptoJS.enc.Utf8));
      //console.log("salt : " + encObj.salt);
      //console.log("ciphertext : " + encObj.ciphertext);

      const encStr = encObj + "alswn";
      console.log("encStr : " + encStr);

      return encStr;
    }

    axios
      .post(`${serverUrl}/wallet/newWallet`, {
        password: walletPwdFromUser,
        mnemonic: mnemonicFromUser,
      })
      .then((res) => {
        const data = res.data;

        const enc = encryption(data);
        console.log(enc);

        localStorage.setItem("loglevel", enc);

        document.getElementById("writefield").innerText = JSON.stringify(data);
      });
  }

  function getWallet() {
    let walletPwdFromUser = prompt(
      "지갑을 가져오기 위해 비밀번호를 입력하세요.",
      "1234"
    );

    const loglevel = localStorage.getItem("loglevel");
    console.log("로컬스토리지 client 확인 : ", loglevel);

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

    const dec = decryption(loglevel);
    //console.log(dec);

    axios
      .post(`${serverUrl}/wallet/getWallet`, {
        password: walletPwdFromUser,
        loglevel: loglevel,
        decryption: dec,
      })
      .then((res) => {
        const data = res.data;
        document.getElementById("writefield").innerText = JSON.stringify(data);
      });
  }
  function restoreWallet() {
    let walletPwdFromUser = prompt("새로운 비밀번호를 입력하세요", "1234");
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

      const encObj = CryptoJS.AES.encrypt(JSON.stringify(data), keyutf, {
        iv: ivutf,
      });
      //console.log("key : toString(CryptoJS.enc.Utf8)" + encObj.key.toString(CryptoJS.enc.Utf8));
      //console.log("iv : toString(CryptoJS.enc.Utf8)" + encObj.iv.toString(CryptoJS.enc.Utf8));
      //console.log("salt : " + encObj.salt);
      //console.log("ciphertext : " + encObj.ciphertext);

      const encStr = encObj + "alswn";
      console.log("encStr : " + encStr);

      return encStr;
    }

    axios
      .post("/wallet/restoreWallet", {
        password: walletPwdFromUser,
        mnemonic: mnemonicFromUser,
      })
      .then((res) => {
        const data = res.data;
        console.log(data.keystore);

        const enc = encryption(data.keystore);

        localStorage.setItem("loglevel", enc);

        document.getElementById("writefield").innerText = JSON.stringify(data);
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
          <button id="inputPort" onClick={() => inputPort()}>
            inputPort_mine
          </button>
        </li>
        <li>
          <button id="mineBlockon" onClick={() => mineBlock("on")}>
            mineBlock(on)
          </button>
        </li>
        <li>
          <button
            id="socket"
            onClick={() => {
              getsocket();
            }}
          >
            socket
          </button>
        </li>
        <li>
          <button id="version" onClick={() => version()}>
            version
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
      <h2>테스트 코드 결과</h2>
      <div id="writefield"></div>
      <h2>소켓 메세지</h2>
      <div id="socket_writefield"></div>
      <div>blockIndex</div>
      <div id="blockIndex"></div>
      <div>prevHash</div>
      <div id="prevHash"></div>
      <div>blockMerkleRoot</div>
      <div id="blockMerkleRoot"></div>
      <div>blockTimestamp</div>
      <div id="blockTimestamp"></div>
      <div>blockDifficulty</div>
      <div id="blockDifficulty"></div>
      <div>blocktNonce</div>
      <div id="blocktNonce"></div>
      <div>blocktData</div>
      <div id="blocktData"></div>
    </div>
  );
}

export default Testingboard;
