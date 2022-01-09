import React from "react";

import Table from "../components/table/Table";

const blockTableHead = ["Hash", "Timestamp", "Amount", "Data"];

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
    <div>
      <h2 className="page-header">Blocks</h2>
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card__body">
              <Table
                headData={blockTableHead}
                renderHead={(item, index) => renderHead(item, index)}
                bodyData={[]} // 추후 데이터 베이스 불러와야함.
                renderBody={(item, index) => renderBody(item, index)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlockDetail;
