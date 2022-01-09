const express = require('express');
const router = express.Router();
const mnemonic = require('./mnemonic')
const newWallet = require('./newWallet')

router.use('/mnemonic', mnemonic);
router.use('/newWallet', newWallet);

module.exports = router;