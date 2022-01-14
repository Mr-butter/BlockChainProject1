import React from "react";
import "./wallettable.css";

const WalletTable = () => {
  return (
    <div>
      <div className="wallet-wrapper">
        <h3>This is Your Address</h3>
        <br />
        <table>
          <thead>
            <tr>
              <th>My Address</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>fdgdhgfsasd</td>
            </tr>
          </tbody>
        </table>
        <br />
        <h3>This is Your Public key</h3>
        <br />
        <table>
          <thead>
            <tr>
              <th>Public key</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>fdgdhgfsasd</td>
            </tr>
          </tbody>
        </table>
        <br />
        <h3>This is Your Private Key</h3>
        <br />
        <table>
          <thead>
            <tr>
              <th>PrivateKeyHex</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>fdgdhgfsasd</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WalletTable;
