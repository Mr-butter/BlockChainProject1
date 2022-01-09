const express = require("express");
const router = express.Router();
const ligthWallet = require('eth-lightwallet')

router.post("/", async (req, res, next) => {
  let mnemonic;

  try {
    mnemonic = ligthWallet.keystore.generateRandomSeed();
    res.json({ mnemonic })
  } catch (err) {
    console.log(err)
  }

});

module.exports = router;
