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
// import Table from "../components/table/Table";
// const blockTableHead = ["Hash", "Timestamp", "Amount", "Data"];

const columns = [{ id: "header", minWidth: 170 }];

const BlockDetail = (props) => {
  const serverPort = parseInt(window.location.port) + 2000;
  const serverUrl = `http://127.0.0.1:${serverPort}`;

  const [chainBlocks, setChainBlocks] = useState({});
  const colink = [...chainBlocks].reverse();

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
                <div className="colinkBox">
                  <Paper sx={{ width: "100%", overflow: "hidden" }}>
                    <TableContainer sx={{ maxHeight: 500 }}>
                      <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                          <TableRow>
                            {columns.map((column) => (
                              <TableCell
                                key={column.id}
                                align={column.align}
                                style={{ minWidth: column.minWidth }}
                              ></TableCell>
                            ))}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {colink.map((coco) => {
                            return (
                              <tr>
                                <td>{coco.header.index}</td>
                                <td>{coco.header.version}</td>
                                <td>{coco.header.previousHash}</td>
                                <td>{coco.header.timestamp}</td>
                                <td>{coco.header.merkleRoot}</td>
                                <td>{coco.header.difficulty}</td>
                                <td>{coco.header.nonce}</td>
                                <td>{coco.body.bodyData}</td>
                              </tr>
                            );
                          })}
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
