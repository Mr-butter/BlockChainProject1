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
    const serverPort = parseInt(window.location.port) + 2000;
    const serverUrl = `http://127.0.0.1:${serverPort}`;
    const blocks = useSelector((state) => state.Block.Blocks);

    const tableTemp = blocks.map((block) => {
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
