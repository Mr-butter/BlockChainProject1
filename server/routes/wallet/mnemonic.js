const express = require("express");
const router = express.Router();
const ligthWallet = require('eth-lightwallet')

router.post("/", async (req, res, next) => {
  try {
    const mnemonic = ligthWallet.keystore.generateRandomSeed();
    res.json({ mnemonic: mnemonic })
  } catch (err) {
    console.log(err)
  }

});

module.exports = router;
