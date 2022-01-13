var express = require("express");
var router = express.Router();
const chainedBlock_func = require("../public/chainedBlock");
// const p2pServer_func = require("../public/p2pServer");
const { isMainThread, Worker, parentPort } = require("worker_threads");
const worker = new Worker("./public/p2pServer.js");

router.post("/blocks", (req, res) => {
    const blocks = chainedBlock_func.getBlocks();
    res.send(blocks);
});

router.post("/addPeer", (req, res) => {
    const p2pPort = p2pServer_func.getSockets().length + 6000;
    p2pServer_func.initP2PServer(p2pPort);
    p2pServer_func.connectToPeer(`ws://localhost:${p2pPort}`);
    res.send({ message: `${p2pPort}번 포트로 웹소켓 접속` });
});

router.post("/mineBlock", (req, res) => {
    const switchOnOff = req.body.switchOnOff;
    // chainedBlock_func.testminning(switchOnOff);
    // console.log(switchOnOff);
    worker.postMessage("on");
    // switch (switchOnOff) {
    //     case "on":
    //         p2pServer.testMinning(switchOnOff);
    //         return res.send({ message: "마이닝을 시작합니다." });
    //     case "off":
    //         // p2pServer.testMinning(switchOnOff);
    //         return res.send({ message: "마이닝을 종료합니다." });
    //     default:
    //         returnres.send({ message: "아직 작업 전입니다." });
    // }
    // const newBlock = chainedBlock.addBlock();
    // if (newBlock === null) {
    //     res.status(400).send("could not generate block");
    // } else {
    //     res.json(newBlock);
    //     // res.send(ok);
    // }
});

router.post("/version", (req, res) => {
    // res.send(chainedBlock.getVersion());
});

router.post("/stop", (req, res) => {
    res.send({ msg: "Stop Server!" });
    process.exit();
});

// router.get("/address", (req, res) => {
//   const address = getPublicKeyFromWallet().toString();
//   if (address != "") {
//     res.send({ address: address });
//   } else {
//     res.send("주소비었음");
//   }
// });

module.exports = router;
