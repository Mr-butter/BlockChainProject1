const cryptojs = require("crypto-js");
const _ = require('lodash')
const ecdsa = require('elliptic');
const ec = new ecdsa.ec("secp256k1");

const COINBASE_AMOUNT = 50;
class UnspentTxOut {
  constructor(txOutId, txOutIndex, address, amount) {
    this.txOutId = txOutId;
    this.txOutIndex = txOutIndex;
    this.address = address;
    this.amount = amount;

  }
}
class TxIn {
  constructor(txOutId, txOutIndex, signature) {
    this.txOutId = txOutId; //이전의 아웃풋을 참조
    this.txOutIndex = txOutIndex;
    this.signature = signature; // 서명을 통해 언락
  }
}

class TxOut {
  constructor(address, amount) {
    this.address = address;
    this.amount = amount;
  }
}

class Transaction {
  constructor(id, txIns, txOuts) {
    this.id = id; //  트랜잭션의 컨텐트로부터 계산된 해시값
    this.txIns = txIns;
    this.txOuts = txOuts;
  }
}

const getTransactionId = (transaction) => {
  const txInContent = transaction.txIns
    //배열. 0부터 끝까지 반복
    .map((txIn) => txIn.txOutId + txIn.txOutIndex)
    //맵함수가 돌고, 그 결과물을 reduce 한다.
    .reduce((a, b) => a + b, '')

  const txOutContent = transaction.txOuts
    .map((txOut) => txOut.address + txOut.amount)
    .reduce((a, b) => a + b, '')

  return CryptoJS.SHA256(txInContent + txOutContent).toString()
}

//트랜잭션 검증
const validateTransaction = (transaction, aUnspentTxOuts) => {
  if (getTransactionId(transaction) !== transaction.id) {
    console.log('invaild tx id: ' + transaction.id);
    return false
  }

  const hasValidTxIns = transaction.txIns
    .map((txIn) => validateTxIn(txIn, transaction, aUnspentTxOuts))
    //&& : 두 피연산자가 모두가 참일 때 true를 반환
    //배열.reduce((누적값, 현잿값, 인덱스, 요소) => { return 결과 }, 초깃값)
    .reduce((a, b) => a && b, 0)

  if (!hasValidTxIns) {
    console.log('some of the txIns are invalid in tx: ', transaction.id);
    return false
  }

  const totalTxInValues = transaction.txIns
    .map((txIn) => getTxInAmount(txIn, aUnspentTxOuts))
    .reduce((a, b) => a + b, 0)

  const totalTxOutValues = transaction.txOuts
    .map((txOut) => txOut.amount)
    .reduce((a, b) => a + b, 0)

  if (totalTxOutValues !== totalTxInValues) {
    console.log('totalTxOutValues !== total TxInValues in tx: ' + transaction.id);
    return false;
  }

  return true;
}

const validateBlockTransactions = (
  aTransactions,
  aUnspentTxOuts,
  blockIndex
) => {
  const coinbaseTx = aTransactions[0];
  if (!validateCoinbaseTx(coinbaseTx, blockIndex)) {
    console.log('invalid coinbase transaction: ' + JSON.stringify(coinbaseTx));
    return false
  }

  const txIns = _(aTransactions)
    .map((tx) => tx.txIns)
    .flatten()
    .value();

  if (hasDuplicates(txIns)) {
    return false
  }

  const normalTransactions = aTransactions.slice(1)
  return normalTransactions
    .map((tx) => validateTransaction(tx, aUnspentTxOuts))
    .reduce((a, b) => a && b, true)
}

const hasDuplicates = (txIns) => {
  const groups = _.countBy(
    txIns, (txIn) => txIn.txOutId + txIn.txOutIndex
  )
  return _(groups)
    .map((value, key) => {
      if (value > 1) {
        console.log('duplicate txIn:' + key);
        return true
      } else {
        return false;
      }
    })
    .includes(true)
}

const validateCoinbaseTx = (
  transaction,
  blockIndex,
) => {
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
    console.log("the txIn signature in coinbase tx must be the block height");
    return false;
  }
  if (transaction.txOuts.length !== 1) {
    console.log("invalid number of txOuts in coinbase transaction");
    return false;
  }
  if (transaction.txOuts[0].amount !== COINBASE_AMOUNT) {
    console.log("invalid coinbase amount in coinbase transaction");
    return false;
  }
  return true;
};

const validateTxIn = (
  txIn,
  transaction,
  aUnspentTxOuts,
) => {
  const referencedUTxOut = aUnspentTxOuts.find(
    (uTxO) =>
      uTxO.txOutId === txIn.txOutId && uTxO.txOutIndex === txIn.txOutIndex
  );
  if (referencedUTxOut == null) {
    console.log("referenced txOut not found: " + JSON.stringify(txIn));
    return false;
  }
  const address = referencedUTxOut.address;

  const key = ec.keyFromPublic(address, "hex");
  const validSignature = key.verify(transaction.id, txIn.signature);
  if (!validSignature) {
    console.log(
      "invalid txIn signature: %s txId: %s address: %s",
      txIn.signature,
      transaction.id,
      referencedUTxOut.address
    );
    return false;
  }
  return true;
};

const getTxInAmount = (txIn, aUnspentTxOuts) => {
  return findUnspentTxOut(txIn.txOutId, txIn.txOutIndex, aUnspentTxOuts).amount;
};

const findUnspentTxOut = (transactionId, index, aUnspentTxOuts) => {
  return aUnspentTxOuts.find((uTxO) => uTxO.txOutId === transactionId && uTxO.txOutIndex === index)
}

const getCoinbaseTransaction = (address, blockIndex) => {
  const t = new Transaction();
  const txIn = new TxIn();
  txIn.signature = '';
  txIn.txOutId = '';
  txIn.txOutIndex = blockIndex;

  t.txIns = [txIn];
  t.txOuts = [new TxOut(address, COINBASE_AMOUNT)]
  t.id = getTransactionId(t);
  return t
}

const signTxIn = (transaction, txInIndex, privateKey, aUnspentTxOuts) => {
  const { getPublicKeyFromWallet } = require('./encryption')
  const txIn = transaction.txIns[txInIndex]
  const dataToSign = transaction.id
  const referencedUnspentTxOut = findUnspentTxOut(
    txIn.txOutId,
    txIn.txOutIndex,
    aUnspentTxOuts
  )
  if (referencedUnspentTxOut == null) {
    console.log('could not find referenced txOut');
    throw Error()
  }

  const referencedAddress = referencedUnspentTxOut.address;

  if (getPublicKeyFromWallet(privateKey) !== referencedAddress) {
    console.log(
      'trying to sign an input with private' +
      ' key that does not match the address that id reference in txIn'
    );
    throw Error()
  }
  const key = ec.keyfromPrivate(privateKey, 'hex')
  const signature = toHexString(key.sign(dataToSign).toDER())

  return signature
}

const updateUnspentTxOuts = (
  aTransactions,
  aUnspentTxOuts
) => {
  const newUnspentTxOuts = aTransactions
    .map((t) => {
      return t.txOuts.map(
        (txOut, index) =>
          new UnspentTxOut(t.id, index, txOut.address, txOut.amount)
      );
    })
    .reduce((a, b) => a.concat(b), [])


  const consumedTxOuts = aTransactions
    .map((t) => t.txIns)
    .reduce((a, b) => a.concat(b), [])
    .map((txIn) => new UnspentTxOut(txIn.txOutId, uTxO.txOutIndex, '', 0))

  const resultingUnsprentTxOuts = aUnspentTxOuts
    .filter((uTxO) => !findUnspentTxOut(uTxO.txOutId, uTxO.txOutIndex, consumedTxOuts))
    .concat(newUnspentTxOuts)

  return resultingUnsprentTxOuts;
}


const processTransactions = (
  aTransactions,
  aUnspentTxOuts,
  blockIndex
) => {
  if (!isValidTransactionsStructure(aTransactions)) {
    return null;
  }

  if (!validateBlockTransactions(aTransactions, aUnspentTxOuts, blockIndex)) {
    console.log('invalid block transactions');
    return null
  }
  return updateUnspentTxOuts(aTransactions, aUnspentTxOuts)
}


const toHexString = (byteArray) => {
  return Array.from(byteArray, 'hex').getPublic().encode('hex')
}

const getPublicKey = (aPrivateKey) => {
  return ec.keyFromPrivate(aPrivateKey, "hex").getPublic().encode("hex");
};

const isValidTxInStructure = (txIn) => {
  if (txIn === null) {
    console.log('txIn is null');
    return false;
  } else if (typeof txIn.signature !== 'string') {
    console.log('invaild signature type in txIn');
    return false
  } else if (typeof txIn.txOutId !== 'string') {
    console.log('invalid txOutId type in txIn');
    return false
  } else if (typeof txIn.txOutIndex !== 'number') {
    console.log('invaild txOutIndex type in txIn');
    return false
  } else {
    return true;
  }
}

const isValidTxOutStructure = (txOut) => {
  if (txOut == null) {
    console.log('txOut is null');
    return false
  } else if (typeof txOut.address !== 'string') {
    console.log('invalid address type in txOut');
    return false
  } else if (!isValidAddress(txOut.address)) {
    console.log('invalid TxOut address');
    return false
  } else if (typeof txOut.amount !== 'number') {
    console.log('invalid amount type in txOut');
    return false;
  } else {
    return true;
  }
}

const isValidTransactionsStructure = (transactions) => {
  return transactions
    .map(isValidTransactionStructure)
    .reduce((a, b) => a && b, true)
}

const isValidTransactionStructure = (transaction) => {
  if (typeof transaction.id !== 'string') {
    console.log('transactionId missing');
    return false;
  }
  if (!(transaction.txIns instanceof Array)) {
    console.log('invalid txIns type in transaction');
    return false;
  }
  if (!transaction.txIns.map(isValidTxInStructure).reduce((a, b) => a && b, true)) {
    return false
  }

  if (!(transaction.txOuts instanceof Array)) {
    console.log('invalid txIns type in transaction');
    return false
  }

  if (!transaction.txOuts
    .map(isValidTxOutStructure)
    .reduce((a, b) => a && b, true)) {
    return false
  }

  return true;
}

const isValidAddress = (address) => {
  if (address.length !== 130) {
    console.log('invalid public key length');
    return false;
  } else if (address.match("^[a-fA-F0-9]+$") === null) {
    console.log('public key must contain only hex characters');
    return false;
  } else if (!address.startsWith('04')) {
    console.log('public key must start with 04');
    return false;
  }
  return true;
}


module.exports = {
  processTransactions,
  signTxIn,
  getTransactionId,
  isValidAddress,
  UnspentTxOut,
  TxIn,
  TxOut,
  getCoinbaseTransaction,
  getPublicKey,
  Transaction,
}