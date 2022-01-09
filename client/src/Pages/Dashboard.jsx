import React from "react";

import Chart from "react-apexcharts";

import StatusCard from "../components/status-card/StatusCard";

import Table from "../components/table/Table";

import statusCards from "../assets/JsonData/status-card-data.json";
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

const latestOrders = {};

const Dashboard = () => {
  return (
    <div>
      <h2 className="page-header">Dashboard</h2>
      <div className="row">
        <div className="col-6">
          <div className="row">
            {statusCards.map((item, index) => (
              <div className="col-6">
                {/* status card here */}
                {item.title}
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
            {/* 누적채굴량 차트넣을자리 */}
            <Chart
              options={chartOptions.options}
              series={chartOptions.series}
              type="line"
              height="100%"
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
          <div className="col-8">
            <div className="card__header">
              <h3>Latest Transactions</h3>
            </div>
            <div className="card__body">
              <Table />
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
