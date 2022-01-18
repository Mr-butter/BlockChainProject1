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

  let check = { seed: false };
  // let privatekeyCheck = { privatekey: true };

  function getWalletPwdFromUser() {
    setWalletPwdFromUser(VarPwdFromUser);

    keystore.keyFromPassword(WalletPwdFromUser, function (err, pwDerivedKey) {
      if (keystore.isDerivedKeyCorrect(pwDerivedKey)) {
        const seed = keystore.getSeed(pwDerivedKey);
        const privatekey = keystore.exportPrivateKey(address[0], pwDerivedKey);
        console.log("seed---------", seed);
        console.log("address---------", address[0]);
        console.log("privatekey---------", privatekey);

        //console.log("privatekey---------", privatekey);
        // console.log(setMnemonic(seed), { seed: check });
        return setMnemonic(seed), setPrivateKey(privatekey), check;
      } else {
        check = { seed: false };
        return check;
      }
    });
  }
  function getVarPwdFromUser(event) {
    console.log(event.currentTarget.value);
    setVarPwdFromUser(event.currentTarget.value);
  }

  const decStr = JSON.parse(decryption(localStorage.getItem("loglevel")));
  const keystore = new ligthWallet.keystore.deserialize(decStr);
  const address = keystore.getAddresses();

  //const mnemonic = keystore.getSeed(pwDerivedKey);
  //const privatekey = keystore.exportPrivateKey(address, pwDerivedKey);

  // keystore.keyFromPassword(WalletPwdFromUser, function (err, pwDerivedKey) {
  //   if (keystore.isDerivedKeyCorrect(pwDerivedKey)) {
  //     const seed = keystore.getSeed(pwDerivedKey);
  //     //const privatekey = keystore.exportPrivateKey(address, pwDerivedKey)
  //     console.log("seed---------", seed);
  //     //console.log("privatekey---------", privatekey);
  //     let data = {
  //       isError: false,
  //       msg: "지갑 주소 입니다.",
  //       address: address,
  //       isAuth: true,
  //       seed: seed,
  //     };
  //     console.log("data-----------------------", data);
  //   } else {
  //     let data = {
  //       isError: true,
  //       msg: "비밀번호가 달라요!",
  //       address: "",
  //       isAuth: false,
  //       seed: "",
  //     };
  //     console.log("error-----------------------", data);
  //   }
  // });

  const avatarStyle = { backgroundColor: "gold", color: "#030303" };
  return (
    <div>
      <div className="wallet-wrapper">
        {/* <h3>This is Your Address</h3> */}
        {/* <br /> */}
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
        {/* <h3>My Mnemonic</h3>
        <TextField
          onChange={getVarPwdFromUser}
          value={VarPwdFromUser}
          label="Input your password"
          placeholder="password"
          fullwidth
          required
          style={{ width: "250px" }}
        ></TextField>
        <Button
          onClick={getWalletPwdFromUser}
          size="medium"
          style={avatarStyle}
          variant="contained"
        >
          submit
        </Button> */}
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
              {/* <th>
                <TextField
                  onChange={getVarPwdFromUser}
                  value={VarPwdFromUser}
                  // label="Input your password"
                  placeholder="Input your password"
                  fullwidth
                  required
                  style={{ width: "250px" }}
                ></TextField>
              </th>
              <th>
                <Button
                  onClick={getWalletPwdFromUser}
                  size="small"
                  style={avatarStyle}
                  variant="contained"
                >
                  submit
                </Button>
              </th> */}
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
