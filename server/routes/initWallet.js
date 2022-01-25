const express = require("express");

const router = express.Router();

router.post("/", async (req, res, next) => {
  const { getPublicKeyFromWallet } = require("../public/encryption");
  res.json(getPublicKeyFromWallet());
});

module.exports = router;
