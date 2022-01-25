var express = require("express");
var router = express.Router();
const { WebSocket } = require("ws");
const UserWallet = require("../models/userWallet");
const chainedBlock_func = require("../public/chainedBlock");
const p2pServer_func = require("../public/p2pServer");
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

router.post("/mineBlock", (req, res) => {
    const switchOnOff = req.body.switchOnOff;
    chainedBlock_func.minning(switchOnOff, "");
    res.send({ message: "블록생성" });
});

router.post("/mineBlockWithTransaction", (req, res) => {
    const userAddress = req.body.userAddress;
    const key = ec.keyFromPrivate(userAddress, "hex");
    const userPublicKey = key.getPublic().encode("hex");
    chainedBlock_func.minningWithTransaction(userPublicKey);
    res.send({ message: "트랜잭션추가 블록생성." });
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
    const sendAmounte = req.body.sendAmounte;

    const userAmount = chainedBlock_func.sendTransaction(
        myAddress,
        receiverAddress,
        sendAmounte
    );
    res.send({ message: `전체금액 ${userAmount}` });
});

router.post("/getsocket", (req, res) => {
    // const p2pServer_func = require("../public/p2pServer");
    res.send(p2pServer_func.getSockets());
});

router.post("/version", (req, res) => {
    // const chainedBlock_func = require("../public/chainedBlock");
    res.send(chainedBlock_func.getVersion());
});

module.exports = router;
