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

// in seconds (블록 생성 간격 10초)
const BLOCK_GENERATION_INTERVAL = 10;
// in blocks (난이도 조절 간격 블록 10개당)
const DIIFFICULTY_ADJUSTMENT_INTERVAL = 10;

// 블록 구조 정의
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
// 버전정보
function getVersion() {
  const package = fs.readFileSync("package.json");
  return JSON.parse(package).version;
}
// 제네시스 트랜잭션
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

  // 새 블록 생성 , 가장 최근블록이 이전블록
  const prevBlock = getLastBlock();
  console.log('\n4. 코인베이스트랜잭션을 블록데이터에 담는다.');
  console.log('///////////////////////////////////////');
  console.log("\n2. 다음 블럭 생성 함수 : ", bodyData);

  const version = getVersion();
  const index = prevBlock.header.index + 1;
  const previousHash = createHash(prevBlock);
  // 다음 블록이 생성되는 시간 = generateRawNextBlock함수가 작동되는 시간
  const timestamp = Math.round(new Date().getTime() / 1000);
  const tree = merkle("sha256").sync(bodyData);
  const merkleRoot = tree.root() || "0".repeat(64);

  // 전체 블록체인을 인자로 해서 difficulty를 가져옴.
  const difficulty = getDifficulty(getBlocks());
  console.log("difficulty추가 : ", difficulty);

  const newBlock = findBlock(
    version,
    index,
    previousHash,
    timestamp,
    merkleRoot,
    difficulty,
    bodyData
  );
  //chapter3
  // 블록체인에 채굴한 블록 추가하고 채굴한 블록 전파하기
  if (addBlockToChain(newBlock)) {
    broadcast(responseLatestMsg());
    return newBlock;
  } else {
      return null;
  }
}

// 새 블록 블록체인에 추가하기
const addBlockToChain = (newBlock) => {
  console.log('\n3. addBlockToChain에 진입\n', newBlock);

  // 새블록을 검증해서 정상이면
  if (!isValidNewBlock(newBlock, getLastBlock())) {
    // 새 블록에 들어갈 트랜잭션들을 검증하고 (processTransactions)
    // 기존 미사용 트랜잭션 아웃풋 목록(uTxO공용장부)에서 일어난 거래들을
    // 계산해서 공용장부이용, 고객들 잔고 갱신해서 retVal변수에 담기
    const retVal = processTransactions(newBlock.body, getUnspentTxOuts(), newBlock.header.index);

    // 새블록에 들어갈 공용장부가 null일 경우
    if (retVal === null) {
      console.log('\n블록생성 실패/트랜잭션쪽에 문제가 있습니다.');
      return false;
    } else {
      console.log('\n블록이 성공적으로 생성됩니다.');
      // 이상이 없다면 블록체인에 새 블록을 추가하고
      // 내가 가진 기존 공용장부를 갱신한 공용장부로 최신화
      // 최신화된 공용징부로 트랜잭션 Pool갱신
      Blocks.push(newBlock);
      setUnspentTxOuts(retVal);
      updateTransactionPool(unspentTxOuts);
      return true;
    }
  }
  return false;
}

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
// // 블록체인 교체, 전달하기
// function replaceChain(newBlocks) {
//   const { broadcast, responseLatestMsg } = require("./p2pServer");
//   console.log(isValidChain(newBlocks));

//   // 전달받은 블록체인, 그안의 트랜잭션들을 검증후 그것들로 만든 공용장부를 aUnspentTxOuts 변수에 저장
//   const aUnspentTxOuts = isValidChain(newBlocks);
//   // 공용장부 상태가 null이 아닌지 확인용 변수 validChiain (true/false)
//   const validChain = aUnspentTxOuts !== null;

//   // 공용장부가 비어있지 않고 전달받은 블록체인의 누적난이도가 내가가진 블록체인의 누적난이도보다 높으면
//   if (
//     validChain &&
//     getAccumulatedDifficulty(newBlocks) > getAccumulatedDifficulty(getBlockchain())) {
//       console.log(`Received blockchain is valid. Replacing current blockchain with received blockchain 
//       / 전달받은 블록체인으로 교체했어요!`);
//       // 내 블록체인을 전달받은 블록체인으로 교체
//       Blocks = newBlocks;
//       // 공용장부도 전달받은 블록체인으로부터 만든 공용장부로 교체
//       setUnspentTxOuts(aUnspentTxOuts);
//       // 새 공용장부로 트랜잭션Pool 갱신
//       updateTransactionPool(unspentTxOuts);
//       // 최신화된 블록체인의 마지막 블록 알리기
//       broadcast(responseLatestMsg());
//   } else {
//     console.log("Received blockchain invalid/전달받은 블록체인보다 내 블록체인의 누적 난이도가 높으니 내 블록체인을 그대로 유지합니다");
//   }
// }
//chapter4 추가
const getAccumulatedDifficulty = (aBlockchain) => {
  return aBlockchain
  .map((block) => block.difficulty)
  .map((difficulty) => Math.pow(2, difficulty))
  .reduce((a, b) => a + b);
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

// 찾은 해시값을 2진수로 변환해 난이도 만큼 앞에 0이 채워졌는지 대조하기
function hashMatchesDifficulty(hash, difficulty) {
  // 블록의 해시값이 난이도 difficulty를 만족하는지 확인하는 코드
  const hashBinary = hexToBinary(hash.toUpperCase());
  const requirePrefix = "0".repeat(difficulty);
  return hashBinary.startsWith(requirePrefix);
}

//chapter2 추가
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
      // naiveCoin과 달리 header body 구조라서 아래처럼 !
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

// 블록 채굴의 난이도 조정 => difficulty 값을 조정
// 즉 채굴 간격을 유지하기 위해 difficulty값을 조정
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

// 마지막 블록이랑 10개 이전 블록 비교해 난이도 조절
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

// 이전 블록과 비교해서 알맞은 블록인지 검증
// 새 블록 추가할때 (addBlockToChain), 블록체인 교체할때(replaceChain)이 사용된다.
function isValidNewBlock(newBlock, previousBlock) {

  if (isValidBlockStructure(newBlock) === false) {
    console.log("invalid structure/블록검증실패: 블록구조가 잘못됨.", JSON.stringify(newBlock));
    return false;
  } else if (newBlock.header.index !== previousBlock.header.index + 1) {
    console.log("invalid index/블록검증실패: 인덱스가 잘못됐어요");
    return false;
  } else if (createHash(previousBlock) !== newBlock.header.previousHash) {
    console.log("invalid previoushash/블록검증실패: 이전블록의 해시와 새블록의 해시가 달라요");
    return false;
  } else if (
    (newBlock.body.length === 0 &&
      "0".repeat(64) !== newBlock.header.merkleRoot) ||
    (newBlock.body.length !== 0 &&
      merkle("sha256").sync(newBlock.body).root() !==
        newBlock.header.merkleRoot)
  ) {
    console.log("Invalid merkleRoot//블록검증실패: 머클루트 재확인바랍니다.");
    return false;
  } else if (!isValidTimestamp(newBlock, previousBlock)) {
    console.log("invalid timestamp/블록검증실패: 타임스탬프가 잘못됐어요");
    return false;
  } else if (
    !hashMatchesDifficulty(createHash(newBlock), newBlock.header.difficulty)
  ) {
    console.log("Invalid hash/블록검증실패: 해시값 재확인바랍니다.");
    return false;
  }
  console.log("\n4.애드블럭체인시 유효성 검사 진입 후 통과");
  return true;
}

// 현재시간을 타임스탬프로
function getCurrentTimestamp() {
  return Math.round(new Date().getTime() / 1000);
}


function isValidTimestamp(newBlock, previousBlock) {
  return (
    previousBlock.header.timestamp - 60 < newBlock.header.timestamp &&
    newBlock.header.timestamp - 60 < getCurrentTimestamp()
  );
}

// 전달받은 블록체인과 그 안의 트랜잭션들을 검증하고 그로부터 만들어낸 공용장부 반환하기
const isValidChain = (blockchainToValidate) => {
  console.log("isValidChain:");
  console.log(JSON.stringify(blockchainToValidate));
  // 내가가진 제네시스블록과 전달받은 블록체인의 제네시스 블록이 같으면 true
  const isValidGenesis = (block) => {
      return JSON.stringify(block) === JSON.stringify(genesisBlock);
  };
  // 전달받은 블록체인과 내 제네시스 블록이 동일한지 검증
  if (!isValidGenesis(blockchainToValidate[0])) {
      return null;
  }
  /*
Validate each block in the chain. The block is valid if the block structure is valid
  and the transaction are valid
 */
// 새로만들 공용장부
  let aUnspentTxOuts = [];

  // 전달받은 블록체인의 길이만큼 돌리기
  for (let i = 0; i < blockchainToValidate.length; i++) {
      const currentBlock = blockchainToValidate[i];
      if (
        // 블록들 하나하나 순서대로 정상인지 검사
          i !== 0 &&
          !isValidNewBlock(
              blockchainToValidate[i],
              blockchainToValidate[i - 1]
          )
      ) {
          return null;
      }
      // 전달받은 블록들의 트랜잭션들 검사해서 공용장부 갱신
      aUnspentTxOuts = processTransactions(
          currentBlock.body,
          aUnspentTxOuts,
          currentBlock.header.index
      );
      // 공용장부에 들은게 null이면
      if (aUnspentTxOuts === null) {
          console.log("invalid transactions in blockchain");
          return null;
      }
  }
  // 전달받은 블록체인으로 만든 공용장부 반환
  return aUnspentTxOuts;
};

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

// 새 블록 블록체인에 추가하기
function addBlockWithTransaction(newBlock) {
  console.log('\n3. addBlockWithTransaction 진입/나이브에서는 addBlockToChain', newBlock);
  const transactionpool_func = require("./transactionpool");

  // 새블록에 들어갈 트랜잭션들을 검증 (processTransactions)
  // 기존 미사용 트랜잭션아웃풋 목록(uTxO/공용장부)에서 일어난 거래들을 계산해서 
  // 공용장부이용 고객들 잔고를 갱신 > retVal 변수에 담기
  const retVal = processTransactions(
    newBlock.body,
    unspentTxOuts,
    newBlock.header.index
  );

  // 새 블록에 들어갈 공용장부가 null인 경우
  if (retVal === null) {
    console.log('\n블럭 생성 실패/트랜잭션쪽에 문제가 있습니다');
    return false;
  } else {
    console.log("\n블럭이 성공적으로 생성됩니다.");
    // 이상 없으면 블록체인에 새 블록을 추가하고
    // 내가 가진 기존 공용장부 갱신한 공용장부로 최신화
    // 최신화된 공용장부로 트랜잭션Pool 갱신
    Blocks.push(newBlock);
    setUnspentTxOuts(retVal);
    transactionpool_func.updateTransactionPool(unspentTxOuts);
    return newBlock;
  }
}

// function minning(message) {
//   const p2pServer_func = require("./p2pServer");

//   switch (message) {
//     case "on":
//       p2pServer_func.connectToPeer(6001);
//       setInterval(() => {
//         addBlock(nextBlock(["bodyData"]));
//       }, 3000);
//       return;
//     case "connectPeer":
//       p2pServer_func.connectToPeer(6001);
//       return;
//     default:
//       return;
//   }
// }
function minning(message, publicKey) {
  if (message === "on") {
      return (mineblock = setInterval(() => {
          generateNextBlock(publicKey);
      }, 3000));
  } else {
      return clearInterval(mineblock);
  }
}

// 새블록 생성 (chapter4 추가된 내용)
const generateNextBlock = (userPublicKey) => {
  // 채굴했으니 지갑 공개키를 담은 코인베이스트랜잭션을 생성
  console.log('\n1. 마인블럭시 generateNextBlock 진입');

  const coinbaseTx = getCoinbaseTransaction(
    userPublicKey,
    getLastBlock().header.index + 1
  );

  // 코인베이스 트랜잭션[]이랑 그동안 생성된 트랜잭션[]이랑 concat으로 합쳐서 새블록 생성
  const blockData = [coinbaseTx].concat(getTransactionPool());
  console.log("???????generateNextBlock: blockData :", blockData);
  return nextBlock(blockData);
};

const generatenextBlockWithTransaction = (
  myAddress,
  receiverAddress,
  amount
) => {
  console.log('\n1. generatenextBlockWithTransaction 진입');
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

// function minningWithTransaction(userPublicKey) {
//   addBlockWithTransaction(generateNextBlock(userPublicKey));
// }

// 블록체인에 추가하는 대신 트랜잭션 풀에 넣는다. (chapter5 추가)
const sendTransaction = (myAddress, receiverAddress, amount) => {
  const { broadCastTransactionPool } = require("./p2pServer");

  const tx = createTransaction(
    getPublicKey(receiverAddress),
    amount,
    myAddress,
    getUnspentTxOuts(),
    getTransactionPool()
  );

  // tx는 보내는 금액이 포함되어 새로 생성된 트랜잭션.
  // 제네시스 블럭과 내가 채굴한 내역이 들어있는 getUnspentTxOuts()
  addToTransactionPool(tx, getUnspentTxOuts());
  broadCastTransactionPool();
  return tx;
};

const getUnspentTxOuts = () => _.cloneDeep(unspentTxOuts);
// 미사용 트랜잭션 목록 교체
const setUnspentTxOuts = (newUnspentTxOut) => {
  console.log("공용장부(unspentTxOuts)를 최신화합니다. replacing unspentTxouts with: %s", newUnspentTxOut);
  unspentTxOuts = newUnspentTxOut;
}

// 미사용 트랜잭션 찾기
const findUnspentTxOuts = (ownerAddress, unspentTxOuts) => {
  // 미사용 트랜잭션에서 요구하는 지갑주소(ownerAddress)와 일치하는
  // 지갑 주소들 (uTxO.address)찾아서 반환
  return _.filter(unspentTxOuts, (uTxO) => uTxO.address === ownerAddress);
};
/////////////////////////////////////////////////////////////////////
// 지갑 잔고 조회
const getBalance = (address, unspentTxOuts) => {
  console.log('\n2.getBalance 진입');
  console.log(`unspentTxOuts :`+unspentTxOuts);

  // 미사용 트랜잭션에서 해당 지갑주소만 찾아서 합치기
  const test = _(unspentTxOuts)
  .filter((uTxO) => uTxO.address === address)
  .map((uTxO) => uTxO.amount)
  .sum();
  console.log('tetetetetet\n', test);
  ////////////////////////////////////////테스트 용

  // filter : 특정 조건을 만족하는 모든 요소를 추출하는 메소드
  // 입력한 key값이 true인 객체들을 배열로 반환
  return _(findUnspentTxOuts(address, unspentTxOuts))
    // .filter((uTxO) => uTxO.address === address)
    .map((uTxO) => uTxO.amount)
    .sum();
};

// 내 지갑 잔고 조회 (chapter4 추가)
const getAccountBalance = (userPublicKey) => {
  console.log("\n1.잔고 계산 시작");

  // 미사용 트랜잭션(getUnspentTxOuts)에서 
  // 내 지갑(getPublicFromWallet)에 해당하는 것을 찾아옴.
  return getBalance(userPublicKey, getUnspentTxOuts());
};

const handleReceivedTransaction = (transaction) => {
  addToTransactionPool(transaction, getUnspentTxOuts());
};

module.exports = {
  Blocks,
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
