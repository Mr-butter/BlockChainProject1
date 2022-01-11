const express = require("express");
const router = express.Router();
const ligthWallet = require('eth-lightwallet')

router.post("/", async (req, res, next) => {
  const walletPwdFromUser = req.body.password
  const LocalStoreServer = req.body.loglevel
  console.log('로컬스토리지 server 확인 : ', walletPwdFromUser);
  console.log('로컬스토리지 server 확인 : ', LocalStoreServer);

  const test = ligthWallet.keystore.isDerivedKeyCorrect(password)
  console.log("testssssss:", test);


  res.json({
    password: walletPwdFromUser,
    LocalStoreServer: LocalStoreServer,
  })
});

module.exports = router; 