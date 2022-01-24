const { keystore } = require("eth-lightwallet");
const fs = require("fs");
const CryptoJS = require("crypto-js");
const UserWallet = require("../models/userWallet");
const dotenv = require("dotenv");
dotenv.config();

function encryption(data) {
  const key = process.env.ENCRYPTION_KEY;
  const iv = process.env.ENCRYPTION_IV;
  console.log(key);
  console.log(iv);

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
const wooooo = "과자";
console.log(encryption(wooooo));
console.log(decryption(encryption(wooooo)));

function decryption(encStr) {
  const key = process.env.ENCRYPTION_KEY;
  const iv = process.env.ENCRYPTION_IV;

  const keyutf = CryptoJS.enc.Utf8.parse(key);
  //console.log("키유티에프:", keyutf);
  const ivutf = CryptoJS.enc.Utf8.parse(iv);
  //console.log("아이브이유티에프:", ivutf);

  //CryptoJS AES 128 복호화
  const decObj = CryptoJS.AES.decrypt(
    { ciphertext: CryptoJS.enc.Base64.parse(encStr) },
    keyutf,
    { iv: ivutf }
  );
  //console.log("decObj가 나올라나", decObj);

  const decStr = CryptoJS.enc.Utf8.stringify(decObj);
  //const parsedDecStr = JSON.parse(decStr)
  // console.log("decStr : " + decStr);

  return decStr;
}

const getmnemonic = () => {
  const mnemonic = keystore.generateRandomSeed();
  return mnemonic;
};
