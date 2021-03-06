import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { Button } from "@mui/material";
// import Table from "../components/table/Table";
// const blockTableHead = ["Hash", "Timestamp", "Amount", "Data"];

const columns = [{ id: "header", minWidth: 170 }];

const BlockDetail = (props) => {
  const serverPort = parseInt(window.location.port) + 2000;
  const serverUrl = `http://127.0.0.1:${serverPort}`;

  const [chainBlocks, setChainBlocks] = useState([]);
  const reverse = [...chainBlocks].reverse();

  console.log(chainBlocks);

  const connect = async () => {
    await axios
      .post(`${serverUrl}/analytics`)
      .then((res) => setChainBlocks(res.data.allBlocks))
      .catch((error) => console.error(`ERROR: ${error}`));
  };

  return (
    <div className="row">
      <div>
        <h2 className="page-header">Blocks</h2>
        <div className="row">
          <Button
            style={{
              borderRadius: 10,
              borderColor: "gold",
              marginLeft: 30,
              color: "gold",
              size: 100,
              padding: "10px",
              marginBottom: "25px",
            }}
            onClick={connect}
            variant="outlined"
          >
            블록체인 목록 불러오기
          </Button>
          <div className="col-12">
            <div
              className="card"
              style={{ marginRight: "50px", minWidth: "1200px" }}
            >
              <div className="card__body">
                <div className="colinkBox">
                  <Paper sx={{ width: "99%", overflow: "hidden" }}>
                    <TableContainer sx={{ maxHeight: 800 }}>
                      <Table
                        className="ae-zone"
                        stickyHeader
                        aria-label="sticky table"
                      >
                        <TableHead style={{ color: "#5c5c5c" }}>
                          <TableRow style={{ color: "#5c5c5c" }}>
                            <TableCell>version</TableCell>
                            <TableCell>previousHash</TableCell>
                            <TableCell>timestamp</TableCell>
                            <TableCell>merkleRoot</TableCell>
                            <TableCell>difficulty</TableCell>
                            <TableCell>nonce</TableCell>
                            <TableCell>body</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {reverse.map((data) => (
                            <TableRow
                              sx={{
                                padding: "0px 0px",
                                borderRight: "2px solid black",
                                backgroundColor: "#5c5c5c",
                                fontSize: "1.1rem",
                              }}
                            >
                              <td>{data.version}</td>
                              <td>{data.previousHash}</td>
                              <td>{data.timestamp}</td>
                              <td>{data.merkleRoot}</td>
                              <td>{data.difficulty}</td>
                              <td>{data.nonce}</td>
                              <td>{data.body}</td>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Paper>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlockDetail;
