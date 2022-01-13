var express = require("express");
var router = express.Router();
const chainedBlock_func = require("../public/chainedBlock");
const { Worker } = require("worker_threads");
const worker = new Worker("./public/chainedBlock.js");

/* GET home page. */
// router.post("/addPeers", (req, res) => {
//   const data = req.body.data || [];
//   connectToPeers(data);
//   res.send(data);
// });

// router.post("/peers", (req, res) => {
//   let sockInfo = [];

//   getSockets().forEach((s) => {
//     sockInfo.push(s._socket.remoteAddress + ":" + s._socket.remotePort);
//   });
//   res.send(sockInfo);
// });

router.post("/blocks", (req, res) => {
    console.log("111");
    console.log(chainedBlock.getBlocks());
});

// const addPeerPort = [];
// router.post("/addPeer", (req, res) => {
//     if (addPeerPort.length === 0) {
//         addPeerPort.push(6000);
//         const addP2pport = addPeerPort[0];
//         const addPeer = `ws://localhost:${addP2pport}`;
//         p2pServer.initP2PServer(addP2pport);
//         p2pServer.connectToPeer(addPeer);
//         res.send(`포트 ${addP2pport}번 에서 열림`);
//     } else {
//         const addP2pport = addPeerPort[addPeerPort.length() - 1] + 1;
//         const addPeer = `ws://localhost:${addP2pport}`;
//         p2pServer.initP2PServer(addP2pport);
//         p2pServer.connectToPeer(addPeer);
//         res.send(`포트 ${addP2pport}번 에서 열림`);
//     }
// });

router.post("/addPeer", (req, res) => {
    // p2pServer.connectToPeer("ws://localhost:6001");
    // res.send();
});

router.post("/mineBlock", (req, res) => {
    const switchOnOff = req.body.switchOnOff;
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
