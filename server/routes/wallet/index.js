const express = require('express');
const router = express.Router();
const mnemonic = require('./mnemonic')
const newWallet = require('./newWallet')
const getWallet = require('./getWallet')

router.use('/mnemonic', mnemonic);
router.use('/newWallet', newWallet);
router.use('/getWallet', getWallet);

module.exports = router;