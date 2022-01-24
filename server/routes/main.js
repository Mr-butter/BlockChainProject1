var express = require("express");
var router = express.Router();
const { WebSocket } = require("ws");
const UserWallet = require("../models/userWallet");
const chainedBlock_func = require("../public/chainedBlock");

router.post("/blocks", async (req, res) => {

  const blocks = chainedBlock_func.getBlocks();
  res.send(blocks);
});
router.post("/inputport", (req, res) => {
  const p2pServer_func = require("../public/p2pServer");
  const port = req.body.port;
  console.log(port);
  p2pServer_func.connectToPeer(port);
  res.send({ message: `${port}번 포트로 웹소켓 접속` });
});

router.post("/mineBlock", (req, res) => {

  console.log("////////////");
  const switchOnOff = req.body.switchOnOff;
  console.log(switchOnOff);
  chainedBlock_func.minning(switchOnOff);
  res.send({ message: "블록생성을 시작합니다." });
});

router.post("/getsocket", (req, res) => {
  const p2pServer_func = require("../public/p2pServer");
  res.send(p2pServer_func.getSockets());
});

router.post("/version", (req, res) => {

  res.send(chainedBlock_func.getVersion());
});

router.post("/transaction", (req, res) => {

  const address = req.body.address;
  const amount = req.body.amount;


  console.log(req.body);
  //res.send(req.body)

  const resp = chainedBlock_func.generatenextBlockWithTransaction(address, amount)
  console.log(resp);
  res.send(resp);

  // try {
  //   const resp = chainedBlock_func.generatenextBlockWithTransaction(address, amount)
  //   console.log(resp);
  //   res.send(resp)
  // } catch (e) {
  //   console.log(e.message);
  //   res.status(400).send(e.message)
  // }

});

module.exports = router;
