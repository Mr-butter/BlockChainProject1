const express = require("express");
const router = express.Router();
const { keystore } = require("eth-lightwallet");

router.post("/", async (req, res, next) => {
  try {
    const mnemonic = keystore.generateRandomSeed();
    res.send({ mnemonic: mnemonic });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
