const fs = require("fs");
const ecdsa = require("elliptic");
const ec = new ecdsa.ec("secp256k1");
const _ = require('lodash')

import {
    getPublicKey,
    getTransactionId,
    signTxIn,
    Transaction,
    TxIn,
    TxOut,
} from "./chainedBlock";

const privateKeyLocation = "wallet/" + (process.env.PRIVATE_KEY || "default");
const privateKeyFile = privateKeyLocation + "/private_key";

function initWallet() {
    if (fs.existsSync(privateKeyFile)) {
        console.log("기존 지갑 경로 : " + privateKeyFile);
        return { message: "기존지갑경로가 있습니다." };
    }
    if (!fs.existsSync("wallet/")) {
        fs.mkdirSync("wallet/");
    }
    if (!fs.existsSync(privateKeyLocation)) {
        fs.mkdirSync(privateKeyLocation);
    }

    const newPrivateKey = generatePrivatekey();
    fs.writeFileSync(privateKeyFile, newPrivateKey);
    console.log("새로운 지갑경로 생성 경로 : " + privateKeyFile);
    return { message: "지갑이 잘 생성되었습니다." };
}

function generatePrivatekey() {
    const keyPair = ec.genKeyPair();
    const privatekey = keyPair.getPrivate();
    return privatekey.toString(16);
}

function getPrivateKeyFromWallet() {
    const buffer = fs.readFileSync(privateKeyFile, "utf8");
    return buffer.toString();
}

function getPublicKeyFromWallet() {
    const privatekey = getPrivateKeyFromWallet();
    const key = ec.keyFromPrivate(privatekey, "hex");
    return key.getPublic().encode("hex");
}

//////////////////////////////////////////////////////////////

const getBalance = (address, unspentTxOuts) => {
    return _(unspentTxOuts)
        .filter((uTxo) => uTxo.address === address)
        .map((uTxO) => uTxO.amount)
        .sum()
}

const findTxOutsForAmount = (amount, myUnspentTxOuts) => {
    let currentAmount = 0;

    const includedUnspentTxOuts = [];

    for (const myUnspentTxOut of myUnspentTxOuts) {
        includedUnspentTxOuts.push(myUnspentTxOut)
        currentAmount = currentAmount + myUnspentTxOut.amount

        if (currentAmount >= amount) {
            const leftOverAmount = currentAmount - amount;
            return { includedUnspentTxOuts, leftOverAmount }
        }
    }
    throw Error('not enough coins to send transaction')
}

const createTxOuts = (receiverAddress, myAddress, amount, leftOverAmount) => {
    const txOut1 = new TxOut(receiverAddress, amount)
    if (leftOverAmount === 0) {
        return [txOut1]
    } else {
        const leftOverTx = new TxOut(myAddress, leftOverAmount)
        return [txOut1, leftOverTx]
    }
}

const createTransaction = (receiverAddress, amount, privateKey, unspentTxOuts) => {
    const myAddress = getPublicKey(privateKey);
    const myUnspentTxOuts = unspentTxOuts.filter(
        (uTxO) => uTxO.address === myAddress
    )

    const { includedUnspentTxOuts, leftOverAmount } = findTxOutsForAmount(
        amount,
        myUnspentTxOuts
    )

    const toUnsignedTxIn = (unspentTxOut) => {
        const txIn = new TxIn()
        txIn.txOutId = unspentTxOut.txOutId
        txIn.txOutIndex = unspentTxOut.txOutIndex
        return txIn;
    }

    const unsignedTxIns = includedUnspentTxOuts.map(toUnsignedTxIn);

    const tx = new Transaction();
    tx.txIns = unsignedTxIns;
    tx.txOuts = createTxOuts(receiverAddress, myAddress, amount, leftOverAmount);
    tx.id = getTransactionId(tx);

    tx.txIns = tx.txIns.map((txIn, index) => {
        txIn.signature = signTxIn(tx, index, privateKey, unspentTxOuts);
        return txIn
    });
    return tx;
}

module.exports = {
    initWallet,
    generatePrivatekey,
    getPrivateKeyFromWallet,
    getPublicKeyFromWallet,
    getBalance,
    createTransaction
};
