const express = require("express");
const router = express.Router();
const ligthWallet = require('eth-lightwallet')

router.post('/', function (req, res) {

  const password = req.body.password.toString();
  const randomSeed = req.body.mnemonic.toString();
  const checkingSeed = ligthWallet.keystore.isSeedValid(randomSeed)
  //console.log(checkingSeed);

  if (checkingSeed) {

    ligthWallet.keystore.createVault({
      password: password,
      seedPhrase: randomSeed,
      hdPathString: "m/0'/0'/0'"
    }, function (err, ks) {
      ks.keyFromPassword(password, function (err, pwDerivedKey) {
        if (ks.isDerivedKeyCorrect(pwDerivedKey)) {
          ks.generateNewAddress(pwDerivedKey, 1);
          const address = ks.getAddresses(ks)
          let data = {
            keystore: ks,
            isError: false,
            msg: '성공적으로 복구되었습니다.',
            address: address,
          }
          res.json(data);
        }
      })
    });

  }
  else {

    let data = {
      isError: true,
      msg: 'KeyStore: Invalid mnemonic // 유효한 니모닉이 아닙니다.'
    };
    res.json(data);
  }
});



module.exports = router; 