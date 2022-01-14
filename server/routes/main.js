var express = require("express");
var router = express.Router();
const { WebSocket } = require("ws");
const chainedBlock_func = require("../public/chainedBlock");
const p2pServer_func = require("../public/p2pServer");
// const { isMainThread, Worker, parentPort } = require("worker_threads");
// const worker = new Worker("./public/p2pServer.js");

router.post("/blocks", (req, res) => {
  const blocks = chainedBlock_func.getBlocks();
  res.send(blocks);
});
router.post("/inputport", (req, res) => {
  const port = req.body.port;
  console.log(port);
  p2pServer_func.connectToPeer(`ws://localhost:${port}`);
  res.send({ message: `${port}번 포트로 웹소켓 접속` });
  chainedBlock_func.minning("on");
});

router.post("/mineBlock", (req, res) => {
  const switchOnOff = req.body.switchOnOff;
  const p2pPort = p2pServer_func.getSockets().length + 6000;
  p2pServer_func.initP2PServer(p2pPort);
  p2pServer_func.connectToPeer(`ws://localhost:${p2pPort}`);
  res.send({ message: `${p2pPort}번 포트로 웹소켓 접속` });
  chainedBlock_func.minning(switchOnOff);
});

router.post("/version", (req, res) => {
  res.send(chainedBlock_func.getVersion());
});

module.exports = router;
