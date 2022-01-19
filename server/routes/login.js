const express = require("express");
const router = express.Router();
const { keystore } = require("eth-lightwallet");
const CryptoJS = require("crypto-js");
const UserWallet = require("../models/userWallet");

function decryption(encStr) {
  const key = "aaaaaaaaaabbbbbb";
  const iv = "aaaaaaaaaabbbbbb";

  const keyutf = CryptoJS.enc.Utf8.parse(key);
  const ivutf = CryptoJS.enc.Utf8.parse(iv);

  //CryptoJS AES 128 복호화
  const decObj = CryptoJS.AES.decrypt(
    { ciphertext: CryptoJS.enc.Base64.parse(encStr) },
    keyutf,
    { iv: ivutf }
  );

  const decStr = CryptoJS.enc.Utf8.stringify(decObj);

  return decStr;
}

router.post("/", async function (req, res) {
  const walletPwdFromUser = req.body.password;
  const decloglevel = JSON.parse(decryption(req.body.loglevel));
  const checkKeystore = new keystore.deserialize(decloglevel);
  const address = checkKeystore.getAddresses().toString();
  const checkWallet = await UserWallet.findOne({ where: { address: address } });

  if (checkWallet !== null && address === checkWallet.address) {
    let data = {
      address: checkWallet.address,
      isAuth: true,
    };
    return res.send(data);
  } else {
    let data = {
      address: "",
      isAuth: false,
    };
    return res.send(data);
  }
});

module.exports = router;
