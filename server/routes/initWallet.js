const express = require("express");
const { User } = require("../models");
const {
    initWallet,
    generatePrivatekey,
    getPrivateKeyFromWallet,
    getPublicKeyFromWallet,
} = require("../public/encryption");

const router = express.Router();

router.post("/", async (req, res, next) => {
    res.json(initWallet());
});

module.exports = router;
