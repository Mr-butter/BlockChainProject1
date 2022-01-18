import axios from "axios";
import React, { useEffect, useRef, useState } from "react";

import Table from "../components/table/Table";
const blockTableHead = ["Hash", "Timestamp", "Amount", "Data"];

// 아래 blockTableBody은 페이지 기능보려고 넣은 임시데이타
// const blockTableBody = [
//   {
//     Hash: "717705125461",
//     Timestamp: "1321546489797",
//     Amount: "1000",
//     Data: "1231545 fkjvmgcslkdfj;ksldfdm",
//   },
// ];

const renderHead = (item, index) => <th key={index}>{item}</th>;

// const renderBody = (item, index) => (
//   <tr>
//     <td>{item.Hash}</td>
//     <td>{item.Timestamp}</td>
//     <td>{item.Amount}</td>
//     <td>{item.Data}</td>
//   </tr>
// );

const BlockDetail = (props) => {
  const ws = useRef(null);
  const [socketMessage, setSocketMessage] = useState("");
  const [blockIndex, setBlockIndex] = useState("");
  const [prevHash, setPrevHash] = useState("");
  const [blockMerkleRoot, setblockMerkleRoot] = useState("");
  const [blockTimestamp, setBlockTimestamp] = useState("");
  const [blockDifficulty, setBlockDifficulty] = useState("");
  const [blocktNonce, setBlocktNonce] = useState("");
  const [blocktData, setBlocktData] = useState("");
  const p2pport = parseInt(window.location.port) + 3000;
  useEffect(() => {
    ws.current = new WebSocket(`ws://127.0.0.1:${p2pport}/`);
    ws.current.onopen = () => {
      // connection opened
      console.log(`웹소켓 포트 : ${p2pport}번으로 연결`);
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
      let reciveData = JSON.parse(JSON.parse(e.data).data);
      setSocketMessage(reciveData);
      if (reciveData !== null) {
        setSocketMessage(JSON.parse(JSON.parse(e.data).data)[0]);
        setBlockIndex(socketMessage.header.index);
        setPrevHash(socketMessage.header.previousHash);
        setblockMerkleRoot(socketMessage.header.merkleRoot);
        setBlockTimestamp(socketMessage.header.timestamp);
        setBlockDifficulty(socketMessage.header.difficulty);
        setBlocktNonce(socketMessage.header.nonce);
        setBlocktData(socketMessage.body);
      }
    };

    document.getElementById("socket_writefield").innerText =
      JSON.stringify(socketMessage);
    document.getElementById("blockIndex").innerText =
      JSON.stringify(blockIndex);
    document.getElementById("prevHash").innerText = JSON.stringify(prevHash);
    document.getElementById("blockMerkleRoot").innerText =
      JSON.stringify(blockMerkleRoot);
    document.getElementById("blockTimestamp").innerText =
      JSON.stringify(blockTimestamp);
    document.getElementById("blockDifficulty").innerText =
      JSON.stringify(blockDifficulty);
    document.getElementById("blocktNonce").innerText =
      JSON.stringify(blocktNonce);
    // document.getElementById("blocktData").innerText =
    //   JSON.stringify(blocktData);
  }, [socketMessage]);

  const blockBox = [];
  // blockBox[0] = JSON.stringify(blockIndex);

  // blockBox.push(blockIndex);
  // console.log(blockBox + "블럭인덱스");
  // console.log(JSON.stringify(blockBox) + "나는 블럭인덱스");

  // Object.keys(blockIndex);
  // console.log([socketMessage]);
  // console.log(blockBox);
  // blockBox[1] = "prevHash";
  // blockBox[2] = "blockMerkleRoot";
  // blockBox[3] = "blockTimestamp";
  // blockBox[4] = "blockDifficulty";
  // blockBox[5] = "blocktNonce";
  // blockBox[6] = "blocktData";

  const allBlock = {
    head: [
      "blockIndex",
      "prevHash",
      "blockMerkleRoot",
      "blockTimestamp",
      "blockDifficulty",
      "blocktNonce",
      // "blocktData",
    ],
    // body: [blockBox],
  };
  // console.log(allBlock.body);

  const renderBlockHead = (item, index) => <th key={index}>{item}</th>;

  const renderBlockBody = (item, index) => {
    <tr key={index}>
      <td>{item.blockBox.blockIndex}</td>
      <td>{item.hash}</td>
      <td>{item.root}</td>
      <td>{item.time}</td>
      <td>{item.diffi}</td>
      <td>{item.nonce}</td>
      {/* <td>{item.data}</td> */}
    </tr>;
  };

  return (
    <div className="row">
      <div>
        <h2 className="page-header">Blocks</h2>
        <div className="row">
          <div className="col-12">
            <div className="card" style={{ marginRight: "50px" }}>
              <div className="card__body">
                {/* <Table
                  limit="10"
                  headData={blockTableHead}
                  // renderHead={(item, index) => renderHead(item, index)}
                  // bodyData={blockTableBody} // 추후 데이터 베이스 불러와야함.
                  // renderBody={(item, index) => renderBody(item, index)}
                /> */}
                <h2>소켓 메세지</h2>
                <div id="socket_writefield"></div>
                <br />
                <Table
                  headData={allBlock.head}
                  renderHead={(item, index) => renderBlockHead(item, index)}
                  // bodyData={allBlock.body}
                  // renderBody={(item, index) => renderBlockBody(item, index)}
                />
                <br />
                <tbody>
                  {/* <div>blockIndex</div> */}
                  <td id="blockIndex"></td>
                  {/* <div>prevHash</div> */}
                  <td id="prevHash"></td>
                  {/* <div>blockMerkleRoot</div> */}
                  <td id="blockMerkleRoot"></td>
                  {/* <div>blockTimestamp</div> */}
                  <td id="blockTimestamp"></td>
                  {/* <div>blockDifficulty</div> */}
                  <td id="blockDifficulty"></td>
                  {/* <div>blocktNonce</div> */}
                  <td id="blocktNonce"></td>
                  {/* <div>blocktData</div> */}
                  {/* <td id="blocktData"></td> */}
                </tbody>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <h2 className="page-header">Latest Transactions</h2>
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card__body">
                {/* <Table
                  limit="10"
                  headData={blockTableHead}
                  renderHead={(item, index) => renderHead(item, index)}
                  bodyData={blockTableBody} // 추후 데이터 베이스 불러와야함.
                  renderBody={(item, index) => renderBody(item, index)}
                /> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlockDetail;
