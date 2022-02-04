import React, { useEffect, useRef, useState } from "react";
import { Stack } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import axios from "axios";
import { useSelector } from "react-redux";

const Mining = () => {
    const ws = useRef(null);
    const userState = useSelector((state) => state.user);
    const [blockState, setBlockState] = useState([]);
    const [socketMessage, setSocketMessage] = useState(null);
    const [blockIndex, setBlockIndex] = useState("");
    const [prevHash, setPrevHash] = useState("");
    const [blockMerkleRoot, setblockMerkleRoot] = useState("");
    const [blockTimestamp, setBlockTimestamp] = useState("");
    const [blockDifficulty, setBlockDifficulty] = useState("");
    const [blocktNonce, setBlocktNonce] = useState("");
    const [blocktData, setBlocktData] = useState("");
    const serverPort = parseInt(window.location.port) + 2000;
    const serverUrl = `http://127.0.0.1:${serverPort}`;

    useEffect(() => {
        getBlockState();
        ws.current = new WebSocket(`ws://127.0.0.1:6001/`);
        ws.current.onopen = () => {
            // connection opened
            console.log(ws.current.readyState);
            console.log(`웹소켓 포트 : 6001 번으로 연결`);
            // send a message
        };
        ws.current.onmessage = (e) => {
            // a message was received
            setSocketMessage(e.data);
            console.log(socketMessage);
        };
        ws.current.onclose = (ws) => {
            axios.post(`${serverUrl}/getSocket`).then((res) => {
                const sockets = res.data;
                sockets.splice(sockets.indexOf(ws), 1);
            });

            console.log("종료되었습니다.");
        };
        return () => {
            console.log("페이지이동시 실행 확인");
            ws.current.close();
        };
    }, []);

    useEffect(() => {
        getBlockState();
        if (socketMessage !== null) {
            ws.current.onmessage = async (e) => {
                // a message was received
                let reciveData = await JSON.parse(JSON.parse(e.data).data);
                setSocketMessage(reciveData);
                if (reciveData !== null) {
                    setBlockIndex(reciveData[0].header.index);
                    setPrevHash(await reciveData[0].header.previousHash);
                    setblockMerkleRoot(await reciveData[0].header.merkleRoot);
                    setBlockTimestamp(await reciveData[0].header.timestamp);
                    setBlockDifficulty(await reciveData[0].header.difficulty);
                    setBlocktNonce(await reciveData[0].header.nonce);
                    setBlocktData(await reciveData[0].body);
                }
            };
        }
    }, [socketMessage]);

    const getBlockState = () => {
        axios.post(`${serverUrl}/blocks`).then((res) => {
            const data = res.data;
            setBlockState(data);
        });
    };

    const tableTemp = blockState.map((block) => {
        return (
            <TableContainer
                component={Paper}
                sx={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                }}
            >
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableBody>
                        <TableRow
                            sx={{
                                "&:last-child td, &:last-child th": {
                                    border: 0,
                                },
                            }}
                        >
                            <TableCell
                                component="th"
                                scope="row"
                                style={{ fontWeight: "bold" }}
                            >
                                Index
                            </TableCell>
                            <TableCell
                                align="left"
                                style={{ fontWeight: "bold" }}
                            >
                                {block.header.index}
                            </TableCell>
                        </TableRow>
                        <TableRow
                            sx={{
                                "&:last-child td, &:last-child th": {
                                    border: 0,
                                },
                            }}
                        >
                            <TableCell
                                component="th"
                                scope="row"
                                style={{ fontWeight: "bold" }}
                            >
                                prevHash
                            </TableCell>
                            <TableCell
                                align="left"
                                style={{ fontWeight: "bold" }}
                            >
                                {block.header.previousHash}
                            </TableCell>
                        </TableRow>
                        <TableRow
                            sx={{
                                "&:last-child td, &:last-child th": {
                                    border: 0,
                                },
                            }}
                        >
                            <TableCell
                                component="th"
                                scope="row"
                                style={{ fontWeight: "bold" }}
                            >
                                MerkleRoot
                            </TableCell>
                            <TableCell
                                align="left"
                                style={{ fontWeight: "bold" }}
                            >
                                {block.header.merkleRoot}
                            </TableCell>
                        </TableRow>
                        <TableRow
                            sx={{
                                "&:last-child td, &:last-child th": {
                                    border: 0,
                                },
                            }}
                        >
                            <TableCell
                                component="th"
                                scope="row"
                                style={{ fontWeight: "bold" }}
                            >
                                Timestamp
                            </TableCell>
                            <TableCell
                                align="left"
                                style={{ fontWeight: "bold" }}
                            >
                                {block.header.timestamp}
                            </TableCell>
                        </TableRow>
                        <TableRow
                            sx={{
                                "&:last-child td, &:last-child th": {
                                    border: 0,
                                },
                            }}
                        >
                            <TableCell
                                component="th"
                                scope="row"
                                style={{ fontWeight: "bold" }}
                            >
                                Difficulty
                            </TableCell>
                            <TableCell
                                align="left"
                                style={{ fontWeight: "bold" }}
                            >
                                {block.header.difficulty}
                            </TableCell>
                        </TableRow>
                        <TableRow
                            sx={{
                                "&:last-child td, &:last-child th": {
                                    border: 0,
                                },
                            }}
                        >
                            <TableCell
                                component="th"
                                scope="row"
                                style={{ fontWeight: "bold" }}
                            >
                                Nonce
                            </TableCell>
                            <TableCell
                                align="left"
                                style={{ fontWeight: "bold" }}
                            >
                                {block.header.nonce}
                            </TableCell>
                        </TableRow>
                        <TableRow
                            sx={{
                                "&:last-child td, &:last-child th": {
                                    border: 0,
                                },
                            }}
                        >
                            <TableCell
                                component="th"
                                scope="row"
                                style={{ fontWeight: "bold" }}
                            >
                                blocktData
                            </TableCell>
                            <TableCell
                                align="left"
                                style={{ fontWeight: "bold" }}
                            >
                                {JSON.stringify(block.body)}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        );
    });

    return (
        <div>
            <Stack direction={"column"} spacing={2} id="TableContainer">
                <h2>블럭정보</h2>
                {tableTemp}
            </Stack>
        </div>
    );
};

export default Mining;
