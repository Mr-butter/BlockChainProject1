import axios from "axios";
import React, { Fragment, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    Stack,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Paper,
    TextField,
} from "@mui/material";

const Analytics = (props) => {
    const serverPort = parseInt(window.location.port) + 2000;
    const serverUrl = `http://127.0.0.1:${serverPort}`;
    const dispatch = useDispatch();
    const userState = useSelector((state) => state.User);
    const socketState = useSelector((state) => state.Socket);
    const userAuth = userState.isAuth;
    const userAddress = userState.address;
    const myAmount = userState.amount;
    const [userTransaction, setUserTransaction] = useState("");

    useEffect(() => {
        const myTransaction = axios
            .post(`${serverUrl}/findTransaction`, { userAddress: userAddress })
            .then((res) => {
                let findTransaction = JSON.parse(res.data.uTxO);
                setUserTransaction(findTransaction);
            });
    }, [socketState]);
    useEffect(() => {
        console.log(userTransaction);
    }, [userTransaction]);

    return (
        <div>
            <Stack direction={"column"} spacing={2} id="TableContainer">
                <h2>My Transaction</h2>
            </Stack>
        </div>
    );
};

export default Analytics;
