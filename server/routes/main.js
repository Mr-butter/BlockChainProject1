var express = require("express");
var router = express.Router();
const { WebSocket } = require("ws");
const UserWallet = require("../models/userWallet");
const chainedBlock_func = require("../public/chainedBlock");
const p2pServer_func = require("../public/p2pServer");
const transactionpool_func = require("../public/transactionpool");
const ecdsa = require("elliptic");
const ec = new ecdsa.ec("secp256k1");

router.post("/blocks", async (req, res) => {
  const blocks = chainedBlock_func.getBlocks();
  res.send(blocks);
});
router.post("/inputport", (req, res) => {
  // const p2pServer_func = require("../public/p2pServer");
  const port = req.body.port;
  console.log(port);
  p2pServer_func.connectToPeer(port);
  res.send({ message: `${port}번 포트로 웹소켓 접속` });
});

// router.post("/mineBlock", (req, res) => {
//     const switchOnOff = req.body.switchOnOff;
//     chainedBlock_func.minning(switchOnOff, "");
//     res.send({ message: "블록생성" });
// });

router.post("/mineBlock", (req, res) => {
  const switchOnOff = req.body.switchOnOff;
  const userAddress = req.body.userAddress;
  const key = ec.keyFromPrivate(userAddress, "hex");
  const userPublicKey = key.getPublic().encode("hex");
  chainedBlock_func.minning(switchOnOff, userPublicKey);
  res.send({ message: "블록생성시작" });
});

router.post("/mineBlockWithTransaction", (req, res) => {
  const userAddress = req.body.userAddress;
  const key = ec.keyFromPrivate(userAddress, "hex");
  const userPublicKey = key.getPublic().encode("hex");
  chainedBlock_func.minningWithTransaction(userPublicKey);
  // const txPool = chainedBlock_func.minningWithTransaction(userPublicKey);
  res.send(chainedBlock_func.getBlocks());
});

router.post("/getUserAmount", (req, res) => {
  const userAddress = req.body.userAddress;
  const key = ec.keyFromPrivate(userAddress, "hex");
  const userPublicKey = key.getPublic().encode("hex");
  const userAmount = chainedBlock_func.getAccountBalance(userPublicKey);
  res.send({ message: `전체금액 ${userAmount}` });
});

router.post("/sendTransation", (req, res) => {
  const myAddress = req.body.myAddress;
  const receiverAddress = req.body.receiverAddress;
  const sendAmount = req.body.sendAmount;

  chainedBlock_func.sendTransaction(myAddress, receiverAddress, sendAmount);
  res.send({ message: `전송완료` });
});

router.post("/getSocket", (req, res) => {
  const getSocket = p2pServer_func.getSockets();
  res.send(getSocket);
});

router.post("/getTransactionPool", (req, res) => {
  // const p2pServer_func = require("../public/p2pServer");
  res.send(transactionpool_func.getTransactionPool());
});

router.post("/getUnspentTxOuts", (req, res) => {
  // const p2pServer_func = require("../public/p2pServer");
  res.send(chainedBlock_func.getUnspentTxOuts());
});

router.post("/version", (req, res) => {
  // const chainedBlock_func = require("../public/chainedBlock");
  res.send(chainedBlock_func.getVersion());
});

module.exports = router;
