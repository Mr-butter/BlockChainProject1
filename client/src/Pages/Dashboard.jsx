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
  const serverPort = parseInt(window.location.port) + 2000;
  const serverUrl = `http://127.0.0.1:${serverPort}`;

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
