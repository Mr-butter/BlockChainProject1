import React, { useEffect, useRef, useState } from "react";

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
  head: ["Height", "Mined", "Miner", "Size"],
  body: [
    {
      Height: "717701",
      Mined: "5555555",
      Miner: "sgsfsf",
      Size: "1231545 bytes",
    },
    {
      Height: "717702",
      Mined: "5555555",
      Miner: "sdfsfg",
      Size: "1231545 bytes",
    },
    {
      Height: "717703",
      Mined: "555555",
      Miner: "fsdfsdf0",
      Size: "1231545 bytes",
    },
    {
      Height: "717704",
      Mined: "5555555",
      Miner: "gf1gfs",
      Size: "1231545 bytes",
    },
    {
      Height: "717705",
      Mined: "555555",
      Miner: "sdfgh",
      Size: "1231545 bytes",
    },
  ],
};

const renderCustomerHead = (item, index) => <th key={index}>{item}</th>;

const renderCusomerBody = (item, index) => (
  <tr key={index}>
    <td>{item.Height}</td>
    <td>{item.Mined}</td>
    <td>{item.Miner}</td>
    <td>{item.Size}</td>
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
  // const [latestOrders, setlatestOrders] = useState({
  //     header: ["Hash", "Time", "Amount", "Data"],
  //     body: [
  //         { Hash: 1, Time: 1, Amount: 1, Data: 1 },
  //         { Hash: 2, Time: 2, Amount: 2, Data: 2 },
  //     ],
  // });
  let latestOrders = {
    header: ["Hash", "Time", "Amount", "Data"],
    body: [
      { Hash: 1, Time: 1, Amount: 1, Data: 1 },
      { Hash: 2, Time: 2, Amount: 2, Data: 2 },
    ],
  };

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
        // let latestOrders = {
        //     header: ["Hash", "Time", "Amount", "Data"],
        //     body: [
        //         { Hash: 1, Time: 1, Amount: 1, Data: 1 },
        //         { Hash: 2, Time: 2, Amount: 2, Data: 2 },
        //     ],
        // };
        // setSocketMessage(JSON.parse(JSON.parse(e.data).data)[0]);
        setBlockIndex(socketMessage.header.index);
        setPrevHash(socketMessage.header.previousHash);
        setblockMerkleRoot(socketMessage.header.merkleRoot);
        setBlockTimestamp(socketMessage.header.timestamp);
        setBlockDifficulty(socketMessage.header.difficulty);
        setBlocktNonce(socketMessage.header.nonce);
        setBlocktData(socketMessage.body);
        // latestOrders.body.push({
        //     Hash: prevHash,
        //     Time: blockTimestamp,
        //     Amount: 50,
        //     Data: blocktData,
        // });
        // return latestOrders;
      }
    };
    console.log(latestOrders);
    // if (latestOrders.header.body === undefined) {
    // }

    // document.getElementById("socket_writefield").innerText =
    //     JSON.stringify(socketMessage);
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
  return (
    <div>
      <h2 className="page-header">Dashboard</h2>
      <div className="row">
        {/*  <div className="col-6">
                    <div className="row">
                        {statusCards.map((item, index) => (
                            <div className="col-6" key={index}>*/}
        {/* status card here */}
        {/* {item.title}
                                <StatusCard
                                    icon={item.icon}
                                    count={item.count}
                                    title={item.title}
                                />
                            </div>
                        ))}
                    </div>
                </div>*/}
        <div className="col-6">
          <p>CoLink mined</p>
          <div className="card full-height">
            {/* 누적채굴량 차트넣을자리 */}
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
              height="180%"
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
              <Link to="/">View all</Link>
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
