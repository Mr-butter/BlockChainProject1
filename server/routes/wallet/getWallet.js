const express = require("express");
const router = express.Router();
const ligthWallet = require('eth-lightwallet')
const fs = require('fs')
const path = require('path');

router.post("/", async (req, res, next) => {
  const walletPwdFromUser = req.body.password
  const LocalStoreServer = req.body.loglevel
  console.log('로컬스토리지 server 확인 : ', walletPwdFromUser);
  console.log('로컬스토리지 server 확인 : ', LocalStoreServer);





  const walletPath = path.join(__dirname, 'default/wallet.json');
  console.log(walletPath);

  fs.readFile(walletPath, function (err, data) {
    if (err) {
      console.error(err);
    } else {
      console.log("wallet.json 읽기 성공!", JSON.parse(data));
    }
  });

  const keystore = await ligthWallet.keystore.deserialize(walletPath);
  console.log('keystore::::::::', keystore);

  const address = await keystore.getAddresses()

  console.log("address::::::::::", address);



  res.json({
    password: walletPwdFromUser,
    LocalStoreServer: LocalStoreServer,
  })
});

module.exports = router; 