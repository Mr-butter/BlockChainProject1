import React from "react";

import Table from "../components/table/Table";

const blockTableHead = ["Hash", "Timestamp", "Amount", "Data"];

// 아래 blockTableBody은 페이지 기능보려고 넣은 임시데이타
const blockTableBody = [
  {
    Hash: "717705125461",
    Timestamp: "1321546489797",
    Amount: "1000",
    Data: "1231545 fkjvmgcslkdfj;ksldfdm",
  },
];

const renderHead = (item, index) => <th key={index}>{item}</th>;

const renderBody = (item, index) => (
  <tr>
    <td>{item.Hash}</td>
    <td>{item.Timestamp}</td>
    <td>{item.Amount}</td>
    <td>{item.Data}</td>
  </tr>
);

const BlockDetail = () => {
  return (
    <div className="row">
      <div>
        {" "}
        <h2 className="page-header">Blocks</h2>
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card__body">
                <Table
                  limit="10"
                  headData={blockTableHead}
                  renderHead={(item, index) => renderHead(item, index)}
                  bodyData={blockTableBody} // 추후 데이터 베이스 불러와야함.
                  renderBody={(item, index) => renderBody(item, index)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        {" "}
        <h2 className="page-header">Latest Transactions</h2>
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card__body">
                <Table
                  limit="10"
                  headData={blockTableHead}
                  renderHead={(item, index) => renderHead(item, index)}
                  bodyData={blockTableBody} // 추후 데이터 베이스 불러와야함.
                  renderBody={(item, index) => renderBody(item, index)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlockDetail;
