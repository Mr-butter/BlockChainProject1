var express = require("express");
var router = express.Router();
const { WebSocket } = require("ws");
const UserWallet = require("../models/userWallet");
// const chainedBlock_func = require("../public/chainedBlock");

router.post("/blocks", async (req, res) => {
  const chainedBlock_func = require("../public/chainedBlock");
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
  const chainedBlock_func = require("../public/chainedBlock");
  console.log("///////////////블럭채굴시작합니다.");
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
  const chainedBlock_func = require("../public/chainedBlock");
  res.send(chainedBlock_func.getVersion());
});

router.post("/mineTransaction", (req, res) => {
  console.log("///////////////////////////////////////////////////////////////mineTransaction 시작입니다.\n");
  const chainedBlock_func = require("../public/chainedBlock");
  const address = req.body.address;
  const amount = parseInt(req.body.amount);
  console.log(typeof amount);

  console.log(req.body);

  try {
    const resp = chainedBlock_func.generatenextBlockWithTransaction(address, amount)
    console.log(resp);
    res.send(resp)
  } catch (e) {
    console.log(e.message);
    res.status(400).send(e.message)
  }

});

router.get("/address", (req, res) => {
  const { getPublicKeyFromWallet } = require("../public/encryption");
  const address = getPublicKeyFromWallet().toString();
  if (address != "") {
    res.send({ address_PublicKey: address });
  } else {
    res.send("주소비었음");
  }
});

router.post("/initWallet", async (req, res, next) => {
  const { initWallet } = require("../public/encryption");
  res.json(initWallet());
});


module.exports = router;
