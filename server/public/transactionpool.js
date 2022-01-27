const _ = require("lodash");
const transaction_1 = require("./transaction");
let transactionPool = [];
const getTransactionPool = () => {
  return _.cloneDeep(transactionPool);
};

const addToTransactionPool = (tx, unspentTxOuts) => {
  if (!transaction_1.validateTransaction(tx, unspentTxOuts)) {
    throw Error("Trying to add invalid tx to pool");
  }
  if (!isValidTxForPool(tx, transactionPool)) {
    throw Error("Trying to add invalid tx to pool");
  }
  console.log("adding to txPool: %s", JSON.stringify(tx));
  transactionPool.push(tx);
};

const hasTxIn = (txIn, unspentTxOuts) => {
  const foundTxIn = unspentTxOuts.find((uTxO) => {
    return uTxO.txOutId === txIn.txOutId && uTxO.txOutIndex === txIn.txOutIndex;
  });
  return foundTxIn !== undefined;
};
const updateTransactionPool = (unspentTxOuts) => {
  const invalidTxs = [];
  for (const tx of transactionPool) {
    for (const txIn of tx.txIns) {
      if (!hasTxIn(txIn, unspentTxOuts)) {
        invalidTxs.push(tx);
        break;
      }
    }
  }
  if (invalidTxs.length > 0) {
    console.log(
      "removing the following transactions from txPool: %s",
      JSON.stringify(invalidTxs)
    );
    transactionPool = _.without(transactionPool, ...invalidTxs);
  }
};

const getTxPoolIns = (aTransactionPool) => {
  return _(aTransactionPool)
    .map((tx) => tx.txIns)
    .flatten()
    .value();
};
const isValidTxForPool = (tx, aTtransactionPool) => {
  const txPoolIns = getTxPoolIns(aTtransactionPool);
  console.log("////////////////");
  console.log(txPoolIns);
  console.log("////////////////");
  console.log(tx.txIns);
  console.log("////////////////");
  const containsTxIn = (txIns, comparetxIn) => {
    return _.find(txIns, (txIn) => {
      return (
        txIn.txOutIndex === comparetxIn.txOutIndex &&
        txIn.txOutId === comparetxIn.txOutId
      );
    });
  };

  for (const txIn of tx.txIns) {
    if (containsTxIn(txPoolIns, txIn)) {
      console.log("txIn already found in the txPool");
      return false;
    }
  }
  return true;
};

module.exports = {
  getTransactionPool,
  updateTransactionPool,
  addToTransactionPool,
};
//# sourceMappingURL=transactionPool.js.map
