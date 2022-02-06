const fs = require("fs");
const merkle = require("merkle");
const cryptojs = require("crypto-js");
const random = require("random");
const BlockChainDB = require("../models/blocks");
const {
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
    createTransaction,
} = require("./transaction");
const {
    getTransactionPool,
    updateTransactionPool,
    addToTransactionPool,
} = require("./transactionpool");
const _ = require("lodash");

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

const genesisTransaction = {
    txIns: [{ signature: "", txOutId: "", txOutIndex: 0 }],
    txOuts: [
        {
            address:
                "04bfcab8722991ae774db48f934ca79cfb7dd991229153b9f732ba5334aafcd8e7266e47076996b55a14bf9913ee3145ce0cfc1372ada8ada74bd287450313534a",
            amount: 50000,
        },
    ],
    id: "b83d939b523ed0464ffb579d49e3eb62503f034c018a54b827c3a616253d22d3",
};

function createGenesisBlock() {
    const version = getVersion();
    const index = 0;
    const previousHash = "0".repeat(64);
    const timestamp = 1231006505;

    const body = [genesisTransaction];
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
let unspentTxOuts = processTransactions(Blocks[0].body, [], 0);

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

    if (addBlockToChain(newBlock)) {
        broadcast(responseLatestMsg());
        return newBlock;
    } else {
        return null;
    }
}

const addBlockToChain = (newBlock) => {
    if (isValidNewBlock(newBlock, getLastBlock())) {
        const retVal = processTransactions(
            newBlock.body,
            getUnspentTxOuts(),
            newBlock.header.index
        );
        if (retVal === null) {
            console.log("block is not valid in terms of transactions");
            return false;
        } else {
            Blocks.push(newBlock);
            setUnspentTxOuts(retVal);
            updateTransactionPool(unspentTxOuts);
            return true;
        }
    }
    return false;
};

function replaceChain(newBlocks) {
    const { broadcast, responseLatestMsg } = require("./p2pServer");
    const aUnspentTxOuts = isValidChain(newBlocks);

    if (isValidChain(newBlocks)) {
        if (
            newBlocks.length > Blocks.length ||
            (newBlocks.length === Blocks.length && random.boolean())
        ) {
            Blocks = newBlocks;
            setUnspentTxOuts(aUnspentTxOuts);
            updateTransactionPool(unspentTxOuts);
            broadcast(responseLatestMsg());
        }
    } else {
        console.log("받은 원장에 문제가 있음");
    }
}
const getAccumulatedDifficulty = (aBlockchain) => {
    return aBlockchain
        .map((block) => block.difficulty)
        .map((difficulty) => Math.pow(2, difficulty))
        .reduce((a, b) => a + b);
};

// const replaceChain = (newBlocks) => {
//     const aUnspentTxOuts = isValidChain(newBlocks);
//     const validChain = aUnspentTxOuts !== null;
//     if (
//         validChain &&
//         getAccumulatedDifficulty(newBlocks) >
//             getAccumulatedDifficulty(getBlocks())
//     ) {
//         console.log(
//             "Received blockchain is valid. Replacing current blockchain with received blockchain"
//         );
//         Blocks = newBlocks;
//         setUnspentTxOuts(aUnspentTxOuts);
//         updateTransactionPool(unspentTxOuts);
//         broadcast(responseLatestMsg());
//     } else {
//         console.log("Received blockchain invalid");
//     }
// };

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

// function isValidChain(newBlocks) {
//     if (JSON.stringify(newBlocks[0]) !== JSON.stringify(Blocks[0])) {
//         return false;
//     }
//     let tempBlocks = [newBlocks[0]];
//     let aUnspentTxOuts = [];
//     for (var i = 1; i < newBlocks.length; i++) {
//         if (isValidNewBlock(newBlocks[i], tempBlocks[i - 1])) {
//             tempBlocks.push(newBlocks[i]);
//         } else {
//             return false;
//         }
//     }
//     return true;
// }
const isValidChain = (blockchainToValidate) => {
    console.log("isValidChain:");
    console.log(JSON.stringify(blockchainToValidate));
    const isValidGenesis = (block) => {
        return JSON.stringify(block) === JSON.stringify(genesisBlock);
    };

    if (!isValidGenesis(blockchainToValidate[0])) {
        return null;
    }
    /*
  Validate each block in the chain. The block is valid if the block structure is valid
    and the transaction are valid
   */
    let aUnspentTxOuts = [];

    for (let i = 0; i < blockchainToValidate.length; i++) {
        const currentBlock = blockchainToValidate[i];
        if (
            i !== 0 &&
            !isValidNewBlock(
                blockchainToValidate[i],
                blockchainToValidate[i - 1]
            )
        ) {
            return null;
        }

        aUnspentTxOuts = processTransactions(
            currentBlock.body,
            aUnspentTxOuts,
            currentBlock.header.index
        );
        if (aUnspentTxOuts === null) {
            console.log("invalid transactions in blockchain");
            return null;
        }
    }
    return aUnspentTxOuts;
};

//////////////////////////////////////////////////////

//////////////////////////////////////////////////////

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
//////////////////////////////////////////////////////

function addBlock(newBlock) {
    if (isValidNewBlock(newBlock, getLastBlock())) {
        Blocks.push(newBlock);
        return newBlock;
    }
    return false;
}

function addBlockWithTransaction(newBlock) {
    const transactionpool_func = require("./transactionpool");
    const retVal = processTransactions(
        newBlock.body,
        unspentTxOuts,
        newBlock.header.index
    );
    if (retVal === null) {
        return false;
    } else {
        Blocks.push(newBlock);
        setUnspentTxOuts(retVal);
        transactionpool_func.updateTransactionPool(unspentTxOuts);
        return newBlock;
    }
}

function minning(message, publicKey) {
    if (message === "on") {
        return (mineblock = setInterval(() => {
            generateNextBlock(publicKey);
        }, 3000));
    } else {
        return clearInterval(mineblock);
    }
}
// function minning(message, publicKey) {
//     let mineblock = setInterval(() => {
//         if (message === "on") {
//             generateNextBlock(publicKey);
//         } else {
//             console.log("인터벌클리어");
//             clearInterval(mineblock);
//         }
//     }, 3000);
// }

const generateNextBlock = (userPublicKey) => {
    const coinbaseTx = getCoinbaseTransaction(
        userPublicKey,
        getLastBlock().header.index + 1
    );
    const blockData = [coinbaseTx].concat(getTransactionPool());
    //   console.log(blockData);
    //   console.log(blockData[0].txIns);
    //   console.log(blockData[0].txOuts);
    return nextBlock(blockData);
};

const generatenextBlockWithTransaction = (
    myAddress,
    receiverAddress,
    amount
) => {
    const userPublicKey = getPublicKey(myAddress);

    if (!isValidAddress(receiverAddress)) {
        throw Error("invalid address");
    }
    if (typeof amount !== "number") {
        throw Error("invalid amount");
    }
    const coinbaseTx = getCoinbaseTransaction(
        userPublicKey,
        getLastBlock().header.index + 1
    );

    const tx = createTransaction(
        receiverAddress,
        amount,
        myAddress,
        getUnspentTxOuts(),
        getTransactionPool()
    );
    const blockData = [coinbaseTx, tx];
    return nextBlock(blockData);
};

const sendTransaction = (myAddress, receiverAddress, amount) => {
    const { broadCastTransactionPool } = require("./p2pServer");

    // console.log(getPublicKey(receiverAddress));
    // console.log(amount);
    // console.log(myAddress);
    // console.log(getUnspentTxOuts());
    // console.log(getTransactionPool());
    // console.log("///////////////////////////////");

    const tx = createTransaction(
        getPublicKey(receiverAddress),
        amount,
        myAddress,
        getUnspentTxOuts(),
        getTransactionPool()
    );
    //tx는 보내는 금액이 포함되어 새로 생성된 트랜잭션. 제네시스블럭과 내가 채굴한 내역이 들어있는 getUnspentTxOuts()
    addToTransactionPool(tx, getUnspentTxOuts());
    broadCastTransactionPool();
    return tx;
};

const getUnspentTxOuts = () => _.cloneDeep(unspentTxOuts);
const setUnspentTxOuts = (newUnspentTxOut) => {
    console.log("replacing unspentTxouts with: %s", newUnspentTxOut);
    unspentTxOuts = newUnspentTxOut;
};

const findUnspentTxOuts = (ownerAddress, unspentTxOuts) => {
    return _.filter(unspentTxOuts, (uTxO) => uTxO.address === ownerAddress);
};

const getBalance = (address, unspentTxOuts) => {
    return _(findUnspentTxOuts(address, unspentTxOuts))
        .map((uTxO) => uTxO.amount)
        .sum();
};

const getAccountBalance = (userPublicKey) => {
    return getBalance(userPublicKey, getUnspentTxOuts());
};
const handleReceivedTransaction = (transaction) => {
    addToTransactionPool(transaction, getUnspentTxOuts());
};

module.exports = {
    Blocks,
    findUnspentTxOuts,
    addBlockToChain,
    addBlockWithTransaction,
    getAccountBalance,
    getLastBlock,
    sendTransaction,
    createHash,
    nextBlock,
    getVersion,
    getBlocks,
    hexToBinary,
    hashMatchesDifficulty,
    replaceChain,
    minning,
    getUnspentTxOuts,
    generateNextBlock,
    generatenextBlockWithTransaction,
    handleReceivedTransaction,
};
