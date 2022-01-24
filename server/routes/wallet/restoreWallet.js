const express = require("express");
const router = express.Router();
const ligthWallet = require("eth-lightwallet");
const UserWallet = require("../../models/userWallet");

router.post("/", async function (req, res) {
  const password = req.body.password.toString();
  const randomSeed = req.body.mnemonic.toString();
  const checkingSeed = ligthWallet.keystore.isSeedValid(randomSeed);
  //console.log(checkingSeed);
  const checkMnemonic = await UserWallet.findAll({
    where: { mnemonic: randomSeed },
  });
  if (checkingSeed && checkMnemonic !== null) {
    ligthWallet.keystore.createVault(
      {
        password: password,
        seedPhrase: randomSeed,
        hdPathString: "m/0'/0'/0'",
      },
      function (err, ks) {
        ks.keyFromPassword(password, async function (err, pwDerivedKey) {
          if (ks.isDerivedKeyCorrect(pwDerivedKey)) {
            ks.generateNewAddress(pwDerivedKey, 1);
            const address = ks.getAddresses();
            const keystore = ks.serialize();
            await UserWallet.update(
              { keystore: keystore, password: password },
              { where: { mnemonic: randomSeed } }
            );

            let data = {
              keystore: keystore,
              isError: false,
              msg: "성공적으로 복구되었습니다.",
              address: address,
            };
            res.json(data);
          }
        });
      }
    );
  } else {
    let data = {
      keystore: "",
      isError: true,
      msg: "KeyStore: Invalid mnemonic // 유효한 니모닉이 아닙니다.",
      address: "",
    };
    res.json(data);
  }
});

module.exports = router;
