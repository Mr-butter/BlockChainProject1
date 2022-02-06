const CryptoJS = require("crypto-js");
const ecdsa = require("elliptic");
const ec = new ecdsa.ec("secp256k1");
const _ = require("lodash");

class TxOut {
    constructor(address, amount) {
        this.address = address;
        this.amount = amount;
    }
}
class TxIn {
    constructor(txOutId, txOutIndex, signature) {
        this.txOutId = txOutId;
        this.txOutIndex = txOutIndex;
        this.signature = signature;
    }
}

class Transaction {
    constructor(id, txIns, txOuts) {
        this.id = id;
        this.txIns = txIns;
        this.txOuts = txOuts;
    }
}

class UnspentTxOut {
    constructor(txOutId, txOutIndex, address, amount) {
        this.txOutId = txOutId;
        this.txOutIndex = txOutIndex;
        this.address = address;
        this.amount = amount;
    }
}

const COINBASE_AMOUNT = 50000;

const getTransactionId = (transaction) => {
    const txInContent = transaction.txIns
        .map((txIn) => txIn.txOutId + txIn.txOutIndex)
        .reduce((a, b) => a + b, "");

    const txOutContent = transaction.txOuts
        .map((txOut) => txOut.address + txOut.amount)
        .reduce((a, b) => a + b, "");
    // return { txInContent, txOutContent };
    return CryptoJS.SHA256(txInContent + txOutContent).toString();
};

const findUnspentTxOut = (transactionId, index, aUnspentTxOuts) => {
    return aUnspentTxOuts.find(
        (uTxO) => uTxO.txOutId === transactionId && uTxO.txOutIndex === index
    );
};

const toHexString = (byteArray) => {
    return Array.from(byteArray, (byte) => {
        return ("0" + (byte & 0xff).toString(16)).slice(-2);
    }).join("");
};

// const signTxIn = (transaction, txInIndex, privateKey, aUnspentTxOuts) => {
//     const txIn = transaction.txIns[txInIndex];
//     const dataToSign = transaction.id;

//     const referencedUnspentTxOut = findUnspentTxOut(
//         txIn.txOutId,
//         txIn.txOutIndex,
//         aUnspentTxOuts
//     );
//     const referencedAddress = referencedUnspentTxOut.address;
//     const key = ec.keyFromPrivate(privateKey, "hex");
//     const signature = toHexString(key.sign(dataToSign).toDER());
//     return signature;
// };

const signTxIn = (transaction, txInIndex, privateKey, aUnspentTxOuts) => {
    const txIn = transaction.txIns[txInIndex];

    const dataToSign = transaction.id;
    const referencedUnspentTxOut = findUnspentTxOut(
        txIn.txOutId,
        txIn.txOutIndex,
        aUnspentTxOuts
    );
    if (referencedUnspentTxOut == null) {
        console.log("could not find referenced txOut");
        throw Error();
    }
    const referencedAddress = referencedUnspentTxOut.address;

    if (getPublicKey(privateKey) !== referencedAddress) {
        console.log(
            "trying to sign an input with private" +
                " key that does not match the address that is referenced in txIn"
        );
        throw Error();
    }
    const key = ec.keyFromPrivate(privateKey, "hex");
    const signature = toHexString(key.sign(dataToSign).toDER());

    return signature;
};

// console.log(getTransactionId(testTransaction));

// console.log(
//     signTxIn(
//         testTransaction,
//         2,
//         "19f128debc1b9122da0635954488b208b829879cf13b3d6cac5d1260c0fd967c",
//         [testUnspentTxOut]
//     )
// );

const updateUnspentTxOuts = (aTransactions, aUnspentTxOuts) => {
    const newUnspentTxOuts = aTransactions
        .map((t) => {
            return t.txOuts.map(
                (txOut, index) =>
                    new UnspentTxOut(t.id, index, txOut.address, txOut.amount)
            );
        })
        .reduce((a, b) => a.concat(b), []);

    const consumedTxOuts = aTransactions
        .map((t) => t.txIns)
        .reduce((a, b) => a.concat(b), [])
        .map((txIn) => new UnspentTxOut(txIn.txOutId, txIn.txOutIndex, "", 0));

    const resultingUnspentTxOuts = aUnspentTxOuts
        .filter(
            (uTxO) =>
                !findUnspentTxOut(uTxO.txOutId, uTxO.txOutIndex, consumedTxOuts)
        )
        .concat(newUnspentTxOuts);

    return resultingUnspentTxOuts;
};

// console.log(updateUnspentTxOuts([testTransaction], [testUnspentTxOut]));

const validateTransaction = (transaction, aUnspentTxOuts) => {
    if (getTransactionId(transaction) !== transaction.id) {
        console.log("invalid tx id: " + transaction.id);
        return false;
    }
    const hasValidTxIns = transaction.txIns
        .map((txIn) => validateTxIn(txIn, transaction, aUnspentTxOuts))
        .reduce((a, b) => a && b, true);

    if (!hasValidTxIns) {
        console.log("some of the txIns are invalid in tx: " + transaction.id);
        return false;
    }

    const totalTxInValues = transaction.txIns
        .map((txIn) => getTxInAmount(txIn, aUnspentTxOuts))
        .reduce((a, b) => a + b, 0);

    const totalTxOutValues = transaction.txOuts
        .map((txOut) => txOut.amount)
        .reduce((a, b) => a + b, 0);

    if (totalTxOutValues !== totalTxInValues) {
        console.log(
            "totalTxOutValues !== totalTxInValues in tx: " + transaction.id
        );
        return false;
    }

    return true;
};
// console.log(validateTransaction(testTransaction, [testUnspentTxOut]));

const isValidTxInStructure = (txIn) => {
    if (txIn == null) {
        console.log("txIn is null");
        return false;
    } else if (typeof txIn.signature !== "string") {
        console.log("invalid signature type in txIn");
        return false;
    } else if (typeof txIn.txOutId !== "string") {
        console.log("invalid txOutId type in txIn");
        return false;
    } else if (typeof txIn.txOutIndex !== "number") {
        console.log("invalid txOutIndex type in txIn");
        return false;
    } else {
        return true;
    }
};

// console.log(isValidTxInStructure(testtxIns[0]));

const isValidTxOutStructure = (txOut) => {
    if (txOut == null) {
        console.log("txOut is null");
        return false;
    } else if (typeof txOut.address !== "string") {
        console.log("invalid address type in txOut");
        return false;
    } else if (!isValidAddress(txOut.address)) {
        console.log("invalid TxOut address");
        return false;
    } else if (typeof txOut.amount !== "number") {
        console.log("invalid amount type in txOut");
        return false;
    } else {
        return true;
    }
};
// console.log(isValidTxOutStructure(testtxOuts[0]));

const isValidTransactionStructure = (transaction) => {
    if (typeof transaction.id !== "string") {
        console.log("transactionId missing");
        return false;
    }
    if (!(transaction.txIns instanceof Array)) {
        console.log("invalid txIns type in transaction");
        return false;
    }
    if (
        !transaction.txIns
            .map(isValidTxInStructure)
            .reduce((a, b) => a && b, true)
    ) {
        return false;
    }

    if (!(transaction.txOuts instanceof Array)) {
        console.log("invalid txIns type in transaction");
        return false;
    }

    if (
        !transaction.txOuts
            .map(isValidTxOutStructure)
            .reduce((a, b) => a && b, true)
    ) {
        return false;
    }
    return true;
};

// console.log(isValidTransactionStructure(testTransaction));

// /////////////////////////////////////////////////

const validateBlockTransactions = (
    aTransactions,
    aUnspentTxOuts,
    blockIndex
) => {
    const coinbaseTx = aTransactions[0];
    if (!validateCoinbaseTx(coinbaseTx, blockIndex)) {
        console.log(
            "invalid coinbase transaction: " + JSON.stringify(coinbaseTx)
        );
        return false;
    }
    // check for duplicate txIns. Each txIn can be included only once
    const txIns = _(aTransactions)
        .map((tx) => tx.txIns)
        .flatten()
        .value();
    if (hasDuplicates(txIns)) {
        return false;
    }
    // all but coinbase transactions
    const normalTransactions = aTransactions.slice(1);
    return normalTransactions
        .map((tx) => validateTransaction(tx, aUnspentTxOuts))
        .reduce((a, b) => a && b, true);
};

const hasDuplicates = (txIns) => {
    const groups = _.countBy(txIns, (txIn) => txIn.txOutId + txIn.txOutId);
    return _(groups)
        .map((value, key) => {
            if (value > 1) {
                console.log("duplicate txIn: " + key);
                return true;
            } else {
                return false;
            }
        })
        .includes(true);
};

const validateCoinbaseTx = (transaction, blockIndex) => {
    if (transaction == null) {
        console.log(
            "the first transaction in the block must be coinbase transaction"
        );
        return false;
    }
    if (getTransactionId(transaction) !== transaction.id) {
        console.log("invalid coinbase tx id: " + transaction.id);
        return false;
    }
    if (transaction.txIns.length !== 1) {
        console.log("one txIn must be specified in the coinbase transaction");
        return;
    }
    if (transaction.txIns[0].txOutIndex !== blockIndex) {
        console.log(
            "the txIn signature in coinbase tx must be the block height"
        );
        return false;
    }
    if (transaction.txOuts.length !== 1) {
        console.log("invalid number of txOuts in coinbase transaction");
        return false;
    }
    if (transaction.txOuts[0].amount != COINBASE_AMOUNT) {
        console.log("invalid coinbase amount in coinbase transaction");
        return false;
    }
    return true;
};

const validateTxIn = (txIn, transaction, aUnspentTxOuts) => {
    const referencedUTxOut = aUnspentTxOuts.find(
        (uTxO) => uTxO.txOutId === txIn.txOutId && uTxO.txOutId === txIn.txOutId
    );
    if (referencedUTxOut == null) {
        console.log("referenced txOut not found: " + JSON.stringify(txIn));
        return false;
    }
    const address = referencedUTxOut.address;

    const key = ec.keyFromPublic(address, "hex");
    return key.verify(transaction.id, txIn.signature);
};

const getTxInAmount = (txIn, aUnspentTxOuts) => {
    return findUnspentTxOut(txIn.txOutId, txIn.txOutIndex, aUnspentTxOuts)
        .amount;
};

const getCoinbaseTransaction = (address, blockIndex) => {
    const t = new Transaction();
    const txIn = new TxIn();
    txIn.signature = "";
    txIn.txOutId = "";
    txIn.txOutIndex = blockIndex;

    t.txIns = [txIn];
    t.txOuts = [new TxOut(address, COINBASE_AMOUNT)];
    t.id = getTransactionId(t);
    return t;
};

const processTransactions = (aTransactions, aUnspentTxOuts, blockIndex) => {
    if (!validateBlockTransactions(aTransactions, aUnspentTxOuts, blockIndex)) {
        console.log("invalid block transactions");
        return null;
    }
    return updateUnspentTxOuts(aTransactions, aUnspentTxOuts);
};

const getPublicKey = (aPrivateKey) => {
    return ec.keyFromPrivate(aPrivateKey, "hex").getPublic().encode("hex");
};

const isValidTransactionsStructure = (transactions) => {
    return transactions
        .map(isValidTransactionStructure)
        .reduce((a, b) => a && b, true);
};

//valid address is a valid ecdsa public key in the 04 + X-coordinate + Y-coordinate format
const isValidAddress = (address) => {
    if (address.length !== 130) {
        console.log("invalid public key length");
        return false;
    } else if (address.match("^[a-fA-F0-9]+$") === null) {
        console.log("public key must contain only hex characters");
        return false;
    } else if (!address.startsWith("04")) {
        console.log("public key must start with 04");
        return false;
    }
    return true;
};

const findTxOutsForAmount = (amount, myUnspentTxOuts) => {
    let currentAmount = 0;
    const includedUnspentTxOuts = [];
    for (const myUnspentTxOut of myUnspentTxOuts) {
        includedUnspentTxOuts.push(myUnspentTxOut);
        currentAmount = currentAmount + myUnspentTxOut.amount;
        if (currentAmount >= amount) {
            const leftOverAmount = currentAmount - amount;
            return { includedUnspentTxOuts, leftOverAmount };
        }
    }

    const eMsg =
        "Cannot create transaction from the available unspent transaction outputs." +
        " Required amount:" +
        amount +
        ". Available unspentTxOuts:" +
        JSON.stringify(myUnspentTxOuts);
    throw Error(eMsg);
};

const createTxOuts = (receiverAddress, myAddress, amount, leftOverAmount) => {
    const txOut1 = new TxOut(receiverAddress, amount);
    if (leftOverAmount === 0) {
        return [txOut1];
    } else {
        const leftOverTx = new TxOut(myAddress, leftOverAmount);
        return [txOut1, leftOverTx];
    }
};

const filterTxPoolTxs = (unspentTxOuts, transactionPool) => {
    const txIns = _(transactionPool)
        .map((tx) => tx.txIns)
        .flatten()
        .value();
    const removable = [];
    for (const unspentTxOut of unspentTxOuts) {
        const txIn = _.find(txIns, (aTxIn) => {
            return (
                aTxIn.txOutIndex === unspentTxOut.txOutIndex &&
                aTxIn.txOutId === unspentTxOut.txOutId
            );
        });

        if (txIn === undefined) {
        } else {
            removable.push(unspentTxOut);
        }
    }

    return _.without(unspentTxOuts, ...removable);
};

const createTransaction = (
    receiverAddress,
    amount,
    myaddress,
    unspentTxOuts,
    txPool
) => {
    const mypublickey = getPublicKey(myaddress);
    const myUnspentTxOutsA = unspentTxOuts.filter(
        (uTxO) => uTxO.address === mypublickey
    );

    const myUnspentTxOuts = filterTxPoolTxs(myUnspentTxOutsA, txPool);

    const { includedUnspentTxOuts, leftOverAmount } = findTxOutsForAmount(
        amount,
        myUnspentTxOuts
    );
    const toUnsignedTxIn = (unspentTxOut) => {
        const txIn = new TxIn();
        txIn.txOutId = unspentTxOut.txOutId;
        txIn.txOutIndex = unspentTxOut.txOutIndex;
        return txIn;
    };
    const unsignedTxIns = includedUnspentTxOuts.map(toUnsignedTxIn);
    const tx = new Transaction();
    tx.txIns = unsignedTxIns;
    tx.txOuts = createTxOuts(
        receiverAddress,
        mypublickey,
        amount,
        leftOverAmount
    );
    tx.id = getTransactionId(tx);
    tx.txIns = tx.txIns.map((txIn, index) => {
        txIn.signature = signTxIn(tx, index, myaddress, unspentTxOuts);
        return txIn;
    });
    return tx;
};

module.exports = {
    processTransactions,
    signTxIn,
    validateTransaction,
    getTransactionId,
    isValidAddress,
    UnspentTxOut,
    TxIn,
    TxOut,
    getCoinbaseTransaction,
    getPublicKey,
    Transaction,
    createTransaction,
};
