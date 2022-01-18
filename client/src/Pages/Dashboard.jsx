import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

import Chart from "react-apexcharts";

import StatusCard from "../components/status-card/StatusCard";

import { useSelector, useDispatch } from "react-redux";

import Table from "../components/table/Table";

import statusCards from "../assets/JsonData/status-card-data.json";

import ThemeAction from "../redux/actions/ThemeAction";

import { Link } from "@mui/material";

const chartOptions = {
  series: [
    {
      name: "Market Cap",
      data: [40, 70, 20, 90, 36, 80, 30, 91, 80],
    },
    {
      name: "Price",
      data: [40, 30, 70, 80, 40, 16, 40, 20, 70, 50],
    },
  ],
  options: {
    color: ["#6ab04c", "#2980b9"],
    chart: {
      background: "transparent",
    },
    dataLabels: {
      enabled: false,
    },
    strock: {
      curve: "smooth",
    },
    xaxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
      ],
    },
    legend: {
      position: "top",
    },
    grid: {
      show: false,
    },
  },
};

const LatestBlocks = {
  head: [
    "index",
    "previousHash",
    "merkleRoot",
    "timestamp",
    "blockDifficulty",
    "nonce",
    "version",
  ],
  body: [
    {
      index: "717701",
      previousHash: "5555555",
      merkleRoot: "sgsfsf",
      timestamp: "1231545 bytes",
      difficulty: "1231545 bytes",
      nonce: "1231545 bytes",
      version: "dsds",
    },
  ],
};

const renderCustomerHead = (item, index) => <th key={index}>{item}</th>;

const renderCusomerBody = (item, index) => (
  <tr key={index}>
    <td>{item.index}</td>
    <td>{item.previousHash}</td>
    <td>{item.merkleRoot}</td>
    <td>{item.timestamp}</td>
    <td>{item.difficulty}</td>
    <td>{item.nonce}</td>
    <td>{item.version}</td>
  </tr>
);

// const orderStatus = {};

const renderOrderHead = (item, index) => <th key={index}>{item}</th>;

const renderOrderBody = (item, index) => (
  <tr key={index}>
    <td>{item.Hash}</td>
    <td>{item.Time}</td>
    <td>{item.Amount}</td>
    <td>
      <span>{item.Data}</span>
    </td>
  </tr>
);

const Dashboard = () => {
  const themeReducer = useSelector((state) => state.ThemeReducer.mode);

  let latestOrders = {
    header: ["Hash", "Time", "Amount", "Data"],
    body: [
      { Hash: 1, Time: 1, Amount: 1, Data: 1 },
      { Hash: 2, Time: 2, Amount: 2, Data: 2 },
    ],
  };

  const ws = useRef(null);
  const [socketMessage, setSocketMessage] = useState("");
  const [socketMessageLog, setSocketMessageLog] = useState([]);
  // const [blockIndex, setBlockIndex] = useState("");
  // const [prevHash, setPrevHash] = useState("");
  // const [blockMerkleRoot, setblockMerkleRoot] = useState("");
  // const [blockTimestamp, setBlockTimestamp] = useState("");
  // const [blockDifficulty, setBlockDifficulty] = useState("");
  // const [blocktNonce, setBlocktNonce] = useState("");
  // const [blocktData, setBlocktData] = useState("");
  const serverPort = parseInt(window.location.port) + 2000;
  const serverUrl = `http://127.0.0.1:${serverPort}`;
  useEffect(() => {
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

    return () => {
      ws.current.close();
    };
  }, []);

  useEffect(() => {
    ws.current.onmessage = (e) => {
      // a message was received
      let reciveData = JSON.parse(JSON.parse(e.data).data);
      setSocketMessage(reciveData);
      setSocketMessageLog((arr) => [...arr, { reciveData }]);
      if (reciveData !== null) {
        setSocketMessage(JSON.parse(JSON.parse(e.data).data)[0]);
        // setBlockIndex(socketMessage.header.index);
        // setPrevHash(socketMessage.header.previousHash);
        // setblockMerkleRoot(socketMessage.header.merkleRoot);
        // setBlockTimestamp(socketMessage.header.timestamp);
        // setBlockDifficulty(socketMessage.header.difficulty);
        // setBlocktNonce(socketMessage.header.nonce);
        // setBlocktData(socketMessage.body);
      }
      //else 이용해서 앞의 블록 달라고 메세지?
    };

    document.getElementById("socketLog_writefield").innerText =
      JSON.stringify(socketMessageLog);
  }, [socketMessageLog]);

  function forblock() {
    const list = JSON.parse(JSON.stringify(socketMessageLog));

    const fisrt = [];
    for (let i = 0; i < socketMessageLog.length; i++) {
      let test = JSON.stringify(list[i].reciveData);
      fisrt.push(test);
    }
    console.log("첫번째 변환", fisrt);

    const second = [];

    for (let j = 1; j < fisrt.length; j++) {
      const test = JSON.parse(fisrt[j])[0].header;
      second.push(test);
    }
    console.log("두번째 변환", second);

    // return {
    //   head: [
    //     "index",
    //     "previousHash",
    //     "merkleRoot",
    //     "timestamp",
    //     "blockDifficulty",
    //     "nonce",
    //     "version",
    //   ],
    //   body: [second],
    // };
  }

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

  return (
    <div>
      <h2>테스트 코드 결과</h2>
      <div id="writefield"></div>
      <h2>소켓 메세지</h2>
      <div id="socket_writefield"></div>
      ----------------------------------------------------------------------
      <h2>소켓 메세지</h2>
      <div id="socketLog_writefield"></div>
      {/* {socketMessageLog} */}
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
          <button id="version" onClick={() => version()}>
            version
          </button>
        </li>
        <li>
          <button id="forblock" onClick={() => forblock()}>
            forblock
          </button>
        </li>
      </ol>
      <h2 className="page-header">Dashboard</h2>
      <div className="row">
        <div className="col-6">
          <div className="row">
            {statusCards.map((item, index) => (
              <div className="col-6" key={index}>
                <StatusCard
                  icon={item.icon}
                  count={item.count}
                  title={item.title}
                />
              </div>
            ))}
          </div>
        </div>
        <div className="col-6">
          <div className="card full-height">
            {/* chart */}
            <Chart
              options={
                themeReducer === "theme-mode-dark"
                  ? {
                      ...chartOptions.options,
                      theme: { mode: "dark" },
                    }
                  : {
                      ...chartOptions.options,
                      theme: { mode: "light" },
                    }
              }
              series={chartOptions.series}
              type="line"
              height="150%"
            />
          </div>
        </div>
        <div className="col-4">
          <div className="card">
            <div className="card__header">
              <h3>Latest Blocks</h3>
              <h5>The most recently mined blocks</h5>
            </div>
            <div className="card__body">
              <Table
                headData={LatestBlocks.head}
                renderHead={(item, index) => renderCustomerHead(item, index)}
                bodyData={LatestBlocks.body}
                renderBody={(item, index) => renderCusomerBody(item, index)}
              />
            </div>
            <div className="card__footer">
              <Link to="/">view all</Link>
            </div>
          </div>
        </div>
        <div className="col-8">
          <div className="card">
            <div className="card__header">
              <h3>Latest Transactions</h3>
            </div>
            <div className="card__body">
              <Table
                headData={latestOrders.header}
                renderHead={(item, index) => renderOrderHead(item, index)}
                bodyData={latestOrders.body}
                renderBody={(item, index) => renderOrderBody(item, index)}
              />
            </div>
            <div className="card__footer">
              <Link to="/">view all</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
