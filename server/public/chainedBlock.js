const fs = require("fs");
const merkle = require("merkle");
const cryptojs = require("crypto-js");
const random = require("random");
const BlockChainDB = require("../models/blocks");
const ecdsa = require('elliptic');
const ec = new ecdsa.ec("secp256k1");
const { getCoinbaseTransaction, isValidAddress, processTransactions, Transaction, UnspentTxOut } = require('./transaction');
const { getPublicKeyFromWallet, getPrivateKeyFromWallet, createTransaction, getBalance } = require("./encryption");

const BLOCK_GENERATION_INTERVAL = 10; //단위시간 초
const DIIFFICULTY_ADJUSTMENT_INTERVAL = 10;

class Block {
  constructor(header, body) {
    this.header = header;
    this.body = body;
  }
}

class BlockHeader {
  constructor(
    version,
    index,
    previousHash,
    timestamp,
    merkleRoot,
    difficulty,
    nonce
  ) {
    this.version = version;
    this.index = index;
    this.previousHash = previousHash;
    this.timestamp = timestamp;
    this.merkleRoot = merkleRoot;
    this.difficulty = difficulty;
    this.nonce = nonce;
  }
}


function getVersion() {
  const package = fs.readFileSync("package.json");
  return JSON.parse(package).version;
}

function createGenesisBlock() {
  const version = getVersion();
  const index = 0;
  const previousHash = "0".repeat(64);
  const timestamp = 1231006505;

  const body = [
    "The Times 03/Jan/2009 Chancellor on brink of second bailout for banks",
  ];
  const tree = merkle("sha256").sync(body);
  const merkleRoot = tree.root() || "0".repeat(64);
  const difficulty = 0;
  const nonce = 0;

  const header = new BlockHeader(
    version,
    index,
    previousHash,
    timestamp,
    merkleRoot,
    difficulty,
    nonce
  );
  return new Block(header, body);
}

let Blocks = [createGenesisBlock()];

function getBlocks() {
  return Blocks;
}

function getLastBlock() {
  return Blocks[Blocks.length - 1];
}

function createHash(block) {
  const {
    version,
    index,
    previousHash,
    timestamp,
    merkleRoot,
    difficulty,
    nonce,
  } = block.header;
  const blockString =
    version +
    index +
    previousHash +
    timestamp +
    merkleRoot +
    difficulty +
    nonce;
  const hash = cryptojs.SHA256(blockString).toString();
  return hash;
}

function calculateHash(
  version,
  index,
  previousHash,
  timestamp,
  merkleRoot,
  difficulty,
  nonce
) {
  const blockString =
    version +
    index +
    previousHash +
    timestamp +
    merkleRoot +
    difficulty +
    nonce;
  const hash = cryptojs.SHA256(blockString).toString();
  return hash;
}

const genesisBlock = createGenesisBlock();

function nextBlock(bodyData) {
  const { broadcast, responseLatestMsg } = require("./p2pServer");
  const prevBlock = getLastBlock();

  const version = getVersion();
  const index = prevBlock.header.index + 1;
  const previousHash = createHash(prevBlock);
  const timestamp = Math.round(new Date().getTime() / 1000);
  const tree = merkle("sha256").sync(bodyData);
  const merkleRoot = tree.root() || "0".repeat(64);
  const difficulty = getDifficulty(getBlocks());

  const newBlock = findBlock(
    version,
    index,
    previousHash,
    timestamp,
    merkleRoot,
    difficulty,
    bodyData
  );
  if (addBlock(newBlock)) {
    broadcast(responseLatestMsg());
    return newBlock;
  } else {
    return null;
  }
}

function replaceChain(newBlocks) {
  const { broadcast, responseLatestMsg } = require("./p2pServer");
  console.log(isValidChain(newBlocks));
  if (isValidChain(newBlocks)) {
    if (
      newBlocks.length > Blocks.length ||
      (newBlocks.length === Blocks.length && random.boolean())
    ) {
      Blocks = newBlocks;
      broadcast(responseLatestMsg());
    }
  } else {
    console.log("받은 원장에 문제가 있음");
  }
}

function hexToBinary(s) {
  const lookupTable = {
    0: "0000",
    1: "0001",
    2: "0010",
    3: "0011",
    4: "0100",
    5: "0101",
    6: "0110",
    7: "0111",
    8: "1000",
    9: "1001",
    A: "1010",
    B: "1011",
    C: "1100",
    D: "1101",
    E: "1110",
    F: "1111",
  };

  var ret = "";
  for (var i = 0; i < s.length; i++) {
    if (lookupTable[s[i]]) {
      ret += lookupTable[s[i]];
    } else {
      return null;
    }
  }
  return ret;
}

function hashMatchesDifficulty(hash, difficulty) {
  const hashBinary = hexToBinary(hash.toUpperCase());
  const requirePrefix = "0".repeat(difficulty);
  return hashBinary.startsWith(requirePrefix);
}

function findBlock(
  currentVersion,
  nextIndex,
  previousHash,
  nextTimestamp,
  merkleRoot,
  difficulty,
  bodyData
) {
  var nonce = 0;

  while (true) {
    var hash = calculateHash(
      currentVersion,
      nextIndex,
      previousHash,
      nextTimestamp,
      merkleRoot,
      difficulty,
      nonce
    );
    if (hashMatchesDifficulty(hash, difficulty)) {
      const newBlockHeader = new BlockHeader(
        currentVersion,
        nextIndex,
        previousHash,
        nextTimestamp,
        merkleRoot,
        difficulty,
        nonce
      );

      return new Block(newBlockHeader, bodyData);
    }
    nonce++;
  }
}

function getDifficulty(blocks) {
  const lastBlock = blocks[blocks.length - 1];
  if (
    lastBlock.header.index !== 0 &&
    lastBlock.header.index % DIIFFICULTY_ADJUSTMENT_INTERVAL === 0
  ) {
    return getAdjustDifficulty(lastBlock, blocks);
  }
  return lastBlock.header.difficulty;
}

function getAdjustDifficulty(lastBlock, blocks) {
  const prevAdjustmentBlock =
    blocks[blocks.length - DIIFFICULTY_ADJUSTMENT_INTERVAL];
  const elapsedTime =
    lastBlock.header.timestamp - prevAdjustmentBlock.header.timestamp;
  const expectedTime =
    BLOCK_GENERATION_INTERVAL * DIIFFICULTY_ADJUSTMENT_INTERVAL;
  if (expectedTime / 2 > elapsedTime) {
    return prevAdjustmentBlock.header.difficulty + 1;
  } else if (expectedTime * 2 < elapsedTime) {
    return prevAdjustmentBlock.header.difficulty - 1;
  } else {
    return prevAdjustmentBlock.header.difficulty;
  }
}

//////////////////////////// 검증코드
function isValidBlockStructure(block) {
  return (
    typeof block.header.version === "string" &&
    typeof block.header.index === "number" &&
    typeof block.header.previousHash === "string" &&
    typeof block.header.timestamp === "number" &&
    typeof block.header.merkleRoot === "string" &&
    typeof block.header.difficulty === "number" &&
    typeof block.header.nonce === "number" &&
    typeof block.body === "object"
  );
}

function isValidNewBlock(newBlock, previousBlock) {
  if (isValidBlockStructure(newBlock) === false) {
    console.log("Invalid Block Structure");
    return false;
  } else if (newBlock.header.index !== previousBlock.header.index + 1) {
    console.log("Invalid Index");
    return false;
  } else if (createHash(previousBlock) !== newBlock.header.previousHash) {
    console.log("Invalid previousHash");
    return false;
  } else if (
    (newBlock.body.length === 0 &&
      "0".repeat(64) !== newBlock.header.merkleRoot) ||
    (newBlock.body.length !== 0 &&
      merkle("sha256").sync(newBlock.body).root() !==
      newBlock.header.merkleRoot)
  ) {
    console.log("Invalid merkleRoot");
    return false;
  } else if (!isValidTimestamp(newBlock, previousBlock)) {
    console.log("invalid timestamp");
    return false;
  } else if (
    !hashMatchesDifficulty(createHash(newBlock), newBlock.header.difficulty)
  ) {
    console.log("Invalid hash");
    return false;
  }
  return true;
}

function getCurrentTimestamp() {
  return Math.round(new Date().getTime() / 1000);
}

function isValidTimestamp(newBlock, previousBlock) {
  return (
    previousBlock.header.timestamp - 60 < newBlock.header.timestamp &&
    newBlock.header.timestamp - 60 < getCurrentTimestamp()
  );
}

function isValidChain(newBlocks) {
  if (JSON.stringify(newBlocks[0]) !== JSON.stringify(Blocks[0])) {
    return false;
  }
  var tempBlocks = [newBlocks[0]];
  for (var i = 1; i < newBlocks.length; i++) {
    if (isValidNewBlock(newBlocks[i], tempBlocks[i - 1])) {
      tempBlocks.push(newBlocks[i]);
    } else {
      return false;
    }
  }
  return true;
}

//////////////////////////////////////임의거래장부
// let transectionArry = [];
// setInterval(() => {
//   const transection = { addTransection: parseInt(Math.random() * 1000) };
//   transectionArry.push(transection);
// }, Math.random() * 1000);
//////////////////////////////////////

// async function addBlock(newBlock) {
//   if (isValidNewBlock(newBlock, getLastBlock())) {
//     Blocks.push(newBlock);
//     const checkGene = await BlockChainDB.findAll({
//       where: { index: 0 },
//     });

//     if (checkGene[0] === undefined) {
//       BlockChainDB.create({
//         index: "0",
//         version: "0.0.1",
//         previousHash:
//           "0000000000000000000000000000000000000000000000000000000000000000",
//         timestamp: "1231006505",
//         merkleRoot:
//           "A6D72BAA3DB900B03E70DF880E503E9164013B4D9A470853EDC115776323A098",
//         difficulty: "0",
//         nonce: "0",
//         body: `["The Times 03/Jan/2009 Chancellor on brink of second bailout for banks"]`,
//       });
//       BlockChainDB.create({
//         index: JSON.stringify(newBlock.header.index),
//         version: newBlock.header.version,
//         previousHash: newBlock.header.previousHash,
//         timestamp: JSON.stringify(newBlock.header.timestamp),
//         merkleRoot: newBlock.header.merkleRoot,
//         difficulty: JSON.stringify(newBlock.header.difficulty),
//         nonce: JSON.stringify(newBlock.header.nonce),
//         body: JSON.stringify(newBlock.body),
//       });
//       return true;
//     } else {
//       BlockChainDB.create({
//         index: JSON.stringify(newBlock.header.index),
//         version: newBlock.header.version,
//         previousHash: newBlock.header.previousHash,
//         timestamp: JSON.stringify(newBlock.header.timestamp),
//         merkleRoot: newBlock.header.merkleRoot,
//         difficulty: JSON.stringify(newBlock.header.difficulty),
//         nonce: JSON.stringify(newBlock.header.nonce),
//         body: JSON.stringify(newBlock.body),
//       });
//       return true;
//     }
//   }
//   return false;
// }

// async function addBlock(newBlock) {
//   if (isValidNewBlock(newBlock, getLastBlock())) {
//     Blocks.push(newBlock);
//     const checkGene = await BlockChainDB.findAll({
//       where: { index: 0 },
//     });
//     if (checkGene[0] === undefined) {
//       BlockChainDB.create({
//         index: "0",
//         version: "0.0.1",
//         previousHash:
//           "0000000000000000000000000000000000000000000000000000000000000000",
//         timestamp: "1231006505",
//         merkleRoot:
//           "A6D72BAA3DB900B03E70DF880E503E9164013B4D9A470853EDC115776323A098",
//         difficulty: "0",
//         nonce: "0",
//         body: `["The Times 03/Jan/2009 Chancellor on brink of second bailout for banks"]`,
//       });
//       BlockChainDB.create({
//         index: JSON.stringify(newBlock.header.index),
//         version: newBlock.header.version,
//         previousHash: newBlock.header.previousHash,
//         timestamp: JSON.stringify(newBlock.header.timestamp),
//         merkleRoot: newBlock.header.merkleRoot,
//         difficulty: JSON.stringify(newBlock.header.difficulty),
//         nonce: JSON.stringify(newBlock.header.nonce),
//         body: JSON.stringify(newBlock.body),
//       });
//       return true;
//     } else {
//       BlockChainDB.create({
//         index: JSON.stringify(newBlock.header.index),
//         version: newBlock.header.version,
//         previousHash: newBlock.header.previousHash,
//         timestamp: JSON.stringify(newBlock.header.timestamp),
//         merkleRoot: newBlock.header.merkleRoot,
//         difficulty: JSON.stringify(newBlock.header.difficulty),
//         nonce: JSON.stringify(newBlock.header.nonce),
//         body: JSON.stringify(newBlock.body),
//       });
//       return true;
//     }
//   }
//   return false;
// }

function minning(message) {
  const p2pServer_func = require("./p2pServer");
  // console.log("들어가니?");
  // addBlock(nextBlock(["bodyData"]));
  switch (message) {
    case "on":
      console.log("온진입");
      p2pServer_func.connectToPeer(6001);
      setInterval(() => {
        addBlock(nextBlock(["bodyData"]));
      }, 3000);
      return;
    case "block":
      console.log("블럭진입");
      addBlock(nextBlock(["bodyData"]));
      return;
    case "connectPeer":
      console.log("피어진입");
      p2pServer_func.connectToPeer(6001);
      return;
    default:
      return;
  }
}

// function minning(message) {
//     switch (message) {
//         case "on":
//             setInterval(() => addBlock(), 1000);
//             break;
//         case "off":
//             return process.exit();

//         default:
//             break;
//     }
// }

///////////////////////////////////////////////////////////////////////////////////////////////////////

let unspentTxOuts = [];

function addBlock(newBlock) {
  if (isValidNewBlock(newBlock, getLastBlock())) {
    const retVal = processTransactions(newBlock.data, unspentTxOuts, newBlock.index)
    if (retVal === null) {
      return false
    } else {
      Blocks.push(newBlock);
      unspentTxOuts = retVal;
      return true;
    }
  }
  return false;
}

const generatenextBlockWithTransaction = (receiverAddress, amount) => {

  console.log("진입");
  console.log("receiverAddress::", receiverAddress);
  console.log("amount::", amount);



  if (!isValidAddress(receiverAddress)) {
    throw Error('invalid address')
  }
  if (typeof amount !== 'number') {
    throw Error('invalid amount')
  }

  const coinbaseTx = getCoinbaseTransaction(getPublicKeyFromWallet(), getLastBlock().index + 1)
  const tx = createTransaction(receiverAddress, amount, getPrivateKeyFromWallet(), unspentTxOuts)
  const blockData = [coinbaseTx, tx]
  // return generateRawNextBlock(blockData)
  return nextBlock(blockData)
}




module.exports = {
  Blocks,
  addBlock,
  getLastBlock,
  createHash,
  nextBlock,
  getVersion,
  getBlocks,
  hexToBinary,
  hashMatchesDifficulty,
  replaceChain,
  minning,
  generatenextBlockWithTransaction
};