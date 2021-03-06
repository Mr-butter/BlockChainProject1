const express = require("express");
const router = express.Router();
const ligthWallet = require("eth-lightwallet");
const isNullOrUndefined = require("util");

router.post("/", function (req, res) {
  console.log(req.body);
  const walletPwdFromUser = req.body.password;
  const LocalStoreServer = req.body.keystore;
  const decryption = req.body.decryption;

  const parsed = JSON.parse(decryption);
  //console.log("parsed****************", parsed);

  if (LocalStoreServer === null) {
    return console.log(
      "로컬스토리지에 저장된 지갑이 없네요. 지갑이 있으시다면 복구하세요!"
    );
  }

  const keystore = new ligthWallet.keystore.deserialize(parsed);
  // console.log(keystore);
  // console.log('keystore---------------\n', keystore);
  // console.log('LocalStoreServer---------------\n', LocalStoreServer);

  if (isNullOrUndefined.isNullOrUndefined(keystore)) {
    let error = {
      isError: true,
      msg: "Error read Wallet Json",
    };

    console.log("error---------------1", error);
    //res.status(400).json(error);
  }

  if (isNullOrUndefined.isNullOrUndefined(walletPwdFromUser)) {
    let error = {
      isError: true,
      msg: "Error read parameter <password>",
    };
    console.log("error---------------2", error);
    //res.status(400).json(error);
  }

  //let walletJson = JSON.stringify(keystore);
  //console.log("1111111111111111111111", walletJson);
  //let ks = new ligthWallet.keystore.deserialize(walletJson);
  //console.log("222222222222222222", ks);
  const password = walletPwdFromUser.toString();
  const address = keystore.getAddresses();
  console.log("address---------------", address);
  //console.log(password);

  keystore.keyFromPassword(password, function (err, pwDerivedKey) {
    if (keystore.isDerivedKeyCorrect(pwDerivedKey)) {
      let data = {
        isError: false,
        msg: "지갑 주소 입니다.",
        address: address,
      };
      console.log("data-----------------------", data);
      res.send(data);
    } else {
      let data = {
        isError: true,
        msg: "비밀번호가 달라요!",
      };
      console.log("error-----------------------", data);
      res.send(data);
    }
  });
});

module.exports = router;
