const express = require("express");
const router = express.Router();
const { keystore } = require("eth-lightwallet");
const fs = require("fs");
const CryptoJS = require("crypto-js");
const UserWallet = require("../../models/userWallet");

function encryption(data) {
  const key = "aaaaaaaaaabbbbbb";
  const iv = "aaaaaaaaaabbbbbb";

  const keyutf = CryptoJS.enc.Utf8.parse(key);
  //console.log("키유티에프:", keyutf);
  const ivutf = CryptoJS.enc.Utf8.parse(iv);
  //console.log("아이브이유티에프:", ivutf);

  const encObj = CryptoJS.AES.encrypt(JSON.stringify(data), keyutf, {
    iv: ivutf,
  });
  //console.log("key : toString(CryptoJS.enc.Utf8)" + encObj.key.toString(CryptoJS.enc.Utf8));
  //console.log("iv : toString(CryptoJS.enc.Utf8)" + encObj.iv.toString(CryptoJS.enc.Utf8));
  //console.log("salt : " + encObj.salt);
  //console.log("ciphertext : " + encObj.ciphertext);

  const encStr = encObj + "";
  console.log("encStr : " + encStr);

  return encStr;
}

router.post("/", async (req, res, next) => {
  const password = req.body.password;
  const mnemonic = req.body.mnemonic;
  const checkMnemonic = await UserWallet.findOne({
    where: {
      mnemonic: mnemonic,
    },
  });
  if (checkMnemonic === null) {
    try {
      keystore.createVault(
        {
          password: password,
          seedPhrase: mnemonic,
          hdPathString: "m/0'/0'/0'",
        },
        function (err, ks) {
          ks.keyFromPassword(password, async function (err, pwDerivedKey) {
            if (!ks.isDerivedKeyCorrect(pwDerivedKey)) {
              throw new Error("Incorrect derived key!");
            }
            ks.generateNewAddress(pwDerivedKey, 1);
            const address = ks.getAddresses().toString();
            const keystore = ks.serialize();

            const encryptkey = encryption(keystore);
            await UserWallet.create({
              address: address,
              password: password,
              keystore: keystore,
              mnemonic: mnemonic,
              point: 1000,
            });

            res.send({
              registerSuccess: true,
              message: "지갑생성완료",
              encryptkey: encryptkey,
            });
          });
        }
      );
    } catch (exception) {
      console.log("NewWallet ==>>>> " + exception);
    }
  } else {
    res.send({
      registerSuccess: false,
      message: "같은 니모닉 문구가 있습니다.",
    });
  }
});

module.exports = router;
