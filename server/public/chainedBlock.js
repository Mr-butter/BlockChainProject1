const fs = require("fs");
const merkle = require("merkle");
const cryptojs = require("crypto-js");
const random = require("random");
const { isMainThread, Worker, parentPort } = require("worker_threads");
const { WebSocket } = require("ws");
const p2pServer_func = require("./p2pServer");

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
    const timestamp = Math.round(new Date().getTime() / 1000);

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
    if (isValidNewBlock(newBlock, prevBlock)) {
        broadcast(responseLatestMsg());
        return newBlock;
    } else {
        return null;
    }
}

function replaceChain(newBlocks) {
    const { broadcast, responseLatestMsg } = require("./p2pServer");

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
    if (JSON.stringify(newBlocsk[0]) !== JSON.stringify(Blocks[0])) {
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
let transectionArry = [];

setInterval(() => {
    const transection = { addTransection: parseInt(Math.random() * 1000) };
    transectionArry.push(transection);
}, Math.random() * 10000);
//////////////////////////////////////

function addBlock() {
    const newBlock = nextBlock(transectionArry);
    if (isValidNewBlock(newBlock, getLastBlock())) {
        transectionArry = [];
        Blocks.push(newBlock);
        return newBlock;
    }
    return null;
}

function testminning(message) {
    if (isMainThread) {
        console.log("메인에서 응답" + message);
        const worker = new Worker(__filename);
        // worker.on("message", (message) => {
        //     console.log(message);
        // });
        worker.on("exit", () => {
            console.log("워커종료");
        });
        worker.postMessage(message);
    } else {
        parentPort.on("message", (message) => {
            switch (message) {
                case "on":
                    const p2pPort = p2pServer_func.getSockets().length + 6000;
                    p2pServer_func.initP2PServer(p2pPort);
                    p2pServer_func.connectToPeer(`ws://localhost:${p2pPort}`);

                    setInterval(() => addBlock());
                    return;
                case "off":
                    console.log("워커에서 응답" + message);
                    parentPort.close();
                    return;
                default:
                    console.log("디폴트 메시지");
                    return;
            }
        });
    }
}
testminning();

// const worker = new Worker(__filename);
// if (isMainThread) {
//     worker.on("message", (message) => {
//         console.log(message);
//     });
//     worker.on("exit", () => {
//         console.log("워커종료");
//     });
// } else {
//     parentPort.on("message", (message) => {
//         switch (message) {
//             case "on":
//                 console.log("워커에서 응답" + message);
//                 setInterval(() => addBlock());
//                 return;
//             case "off":
//                 console.log("워커에서 응답" + message);
//                 parentPort.close();
//                 return;
//             default:
//                 console.log("디폴트 메시지");
//                 return;
//         }
//     });
// }

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
    testminning,
};
