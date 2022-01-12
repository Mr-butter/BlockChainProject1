const express = require("express");
const router = express.Router();
const ligthWallet = require('eth-lightwallet')
const fs = require('fs')

router.post("/", async (req, res, next) => {
  console.log(req.body);
  var password = req.body.password;
  var mnemonic = req.body.mnemonic;

  const privateKeyLocation = "routes/wallet/" + (process.env.PRIVATE_KEY || "default");
  const privateKeyFile = privateKeyLocation + "/wallet.json";

  function checkWalletPath() {
    if (fs.existsSync(privateKeyFile)) {
      console.log("기존 지갑 경로 : " + privateKeyFile);
      //return { message: "기존지갑경로가 있습니다." };
      return res.send(fs.readFileSync(privateKeyFile).toString())
    }
    if (!fs.existsSync("routes/wallet")) {
      fs.mkdirSync("routes/wallet");
    }
    if (!fs.existsSync(privateKeyLocation)) {
      fs.mkdirSync(privateKeyLocation);
    }
  }

  function saveWallet(keystore) {

    if (!fs.existsSync(privateKeyFile)) {
      fs.writeFileSync(privateKeyFile, keystore, (err, data) => {
        if (err) {
          console.log('지갑생성 실패');
        }
        else {
          console.log("새로운 지갑경로 생성 경로 : " + privateKeyFile);
          return res.json({ keystore: keystore });
          //return { message: "지갑이 잘 생성되었습니다." };
        }
      });
    }
  }

  try {

    checkWalletPath()

    //새로운 lightwallet 키저장소를 생성해 주는 메서드
    ligthWallet.keystore.createVault(

      {
        password: password,
        seedPhrase: mnemonic,
        hdPathString: "m/0'/0'/0'"
      },

      function (err, ks) {

        ks.keyFromPassword(password, function (err, pwDerivedKey) {
          if (err) throw err;

          ks.generateNewAddress(pwDerivedKey, 1);

          //var address = (ks.getAddresses()).toString();
          var keystore = ks.serialize();

          saveWallet(keystore)

          //res.json({ keystore: keystore, address: address });

        });
      }
    );
  } catch (exception) {
    console.log("NewWallet ==>>>> " + exception);
  }
});

module.exports = router;
