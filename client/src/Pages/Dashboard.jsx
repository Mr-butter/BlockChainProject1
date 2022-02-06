import React from "react";

import Chart from "react-apexcharts";

import StatusCard from "../components/status-card/StatusCard";

import { useSelector } from "react-redux";

import statusCards from "../assets/JsonData/status-card-data.json";

import { Table, TableBody, TableHead, TableRow } from "@mui/material";

const chartOptions = {
    series: [
        {
            name: "Market Cap",
            data: [40, 70, 20, 90, 36, 80, 30, 91, 80],
        },
    ],
    options: {
        color: ["#6ab04c"],
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

const Dashboard = () => {
    return (
        <div>
            <h2 className="page-header">Dashboard</h2>
            <div className="row">
                <div className="col-6">
                    <div className="row">
                        <div className="col-6">
                            <StatusCard
                                icon="bx bx-dollar-circle"
                                count="$2,632"
                                title="총 누적 채굴량"
                            />
                        </div>
                        <div className="col-6">
                            <StatusCard
                                icon="bx bx-receipt"
                                count="460445.5 USD(50BTC)"
                                title="가장 최신블럭"
                            />
                        </div>
                    </div>
                </div>
                <div className="col-6">
                    <div className="card full-height">
                        <Chart
                            options={{
                                ...chartOptions.options,
                                theme: { mode: "dark" },
                            }}
                            series={chartOptions.series}
                            type="line"
                            height="150%"
                        />
                    </div>
                </div>

                <div className="col-8">
                    <div className="card-1">
                        <div className="card__header">
                            <h3>Genesis Block</h3>
                            <br />
                            <h5>
                                The name of the first block of Bitcoin ever
                                mined.
                            </h5>
                        </div>
                        <br />
                        <div
                            className="card__body"
                            style={{ mixWidth: "1200px" }}
                        >
                            <Table stickyHeader aria-label="sticky table">
                                <TableHead>
                                    <TableRow style={{ color: "#bbbbbb" }}>
                                        <td>index</td>
                                        <td>version</td>
                                        <td>previousHash</td>
                                        <td>timestamp</td>
                                        <td>merkleRoot</td>
                                        <td>difficulty</td>
                                        <td>nonce</td>
                                        <td>body</td>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <tr>
                                        <td>0</td>
                                        <td>0.0.1</td>
                                        <td>
                                            0000000000000
                                            <br />
                                            0000000000000
                                            <br />
                                            0000000000000
                                            <br />
                                            0000000000000
                                            <br />
                                            0000000000000
                                            <br />
                                        </td>
                                        <td>1231006505</td>
                                        <td>
                                            A6D72BAA3DB900B03E70DF880E503E91
                                            <br />
                                            64013B4D9A470853EDC115776323A098
                                        </td>
                                        <td>0</td>
                                        <td>0</td>
                                        <td>
                                            The Times 03/Jan/2009 Chancellor on
                                            brink of second bailout for banks
                                        </td>
                                    </tr>
                                </TableBody>
                            </Table>
                        </div>
                        <br />
                        <div className="card__footer">
                            {/* <Link to="/analytics">view all</Link> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
