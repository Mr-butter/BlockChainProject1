import React, { useState } from "react";
import { decryption } from "../../utils/decrypt";
import "./wallettable.css";
import ligthWallet from "eth-lightwallet";
import { Button, TextField } from "@material-ui/core";

const WalletTable = () => {
  const [WalletPwdFromUser, setWalletPwdFromUser] = useState("");
  const [VarPwdFromUser, setVarPwdFromUser] = useState("");
  const [Mnemonic, setMnemonic] = useState("");
  const [PrivateKey, setPrivateKey] = useState("");

  function getWalletPwdFromUser() {
    keystore.keyFromPassword(VarPwdFromUser, function (err, pwDerivedKey) {
      if (keystore.isDerivedKeyCorrect(pwDerivedKey)) {
        const seed = keystore.getSeed(pwDerivedKey);
        const privatekey = keystore.exportPrivateKey(address[0], pwDerivedKey);

        return setMnemonic(seed), setPrivateKey(privatekey);
      } else {
        return setMnemonic("비밀번호달라요"), setPrivateKey("확인해주세요");
      }
    });
  }
  function getVarPwdFromUser(event) {
    // console.log(event.currentTarget.value);
    setVarPwdFromUser(event.currentTarget.value);
  }

  const decStr = JSON.parse(decryption(localStorage.getItem("loglevel")));
  // console.log("decStr");
  // console.log(decStr);
  const keystore = new ligthWallet.keystore.deserialize(decStr);
  const address = keystore.getAddresses();

  const avatarStyle = { backgroundColor: "gold", color: "#030303" };
  return (
    <div>
      <div className="wallet-wrapper">
        <table>
          <thead>
            <tr>
              <th>My Address</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{address}</td>
            </tr>
          </tbody>
        </table>
        <br />
        <br />
        <table>
          <br />
          <thead>
            <tr>
              <th>
                <h3>
                  니모닉 문구와 개인키 확인을 위한 비밀번호 입력이 필요합니다.
                </h3>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th align="right">
                <TextField
                  type={"password"}
                  onChange={getVarPwdFromUser}
                  value={VarPwdFromUser}
                  // label="Input your password"
                  placeholder="Input your password"
                  fullwidth
                  required
                  style={{ width: "250px" }}
                ></TextField>
                <Button
                  onClick={getWalletPwdFromUser}
                  size="small"
                  style={avatarStyle}
                  variant="contained"
                >
                  submit
                </Button>
              </th>
            </tr>
          </tbody>
        </table>
        <table>
          <thead>
            <tr>
              <th>My Mnemonic</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{Mnemonic}</td>
            </tr>
          </tbody>
        </table>
        <br />
        <br />
        <table>
          <thead>
            <tr>
              <th>My PrivateKey</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{PrivateKey}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WalletTable;
