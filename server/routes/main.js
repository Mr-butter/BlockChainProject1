var express = require("express");
var router = express.Router();
const chainedBlock = require("../public/chainedBlock");
const p2pServer = require("../public/p2pServer");

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
    res.send(chainedBlock.getBlocks());
});

const addPeerPort = [];
router.post("/addPeer", (req, res) => {
    if (addPeerPort.length === 0) {
        addPeerPort.push(6000);
        const addP2pport = addPeerPort[0];
        const addPeer = `ws://localhost:${addP2pport}`;
        p2pServer.initP2PServer(addP2pport);
        p2pServer.connectToPeer(addPeer);
        res.send(`포트 ${addP2pport}번 에서 열림`);
    } else {
        const addP2pport = addPeerPort[addPeerPort.length() - 1] + 1;
        const addPeer = `ws://localhost:${addP2pport}`;
        p2pServer.initP2PServer(addP2pport);
        p2pServer.connectToPeer(addPeer);
        res.send(`포트 ${addP2pport}번 에서 열림`);
    }
});

router.post("/mineBlock", (req, res) => {
    const addP2pport = req.body.port;
    const addPeer = `ws://localhost:${addP2pport}`;
    p2pServer.initP2PServer(addP2pport);
    p2pServer.connectToPeer(addPeer);
});

router.post("/version", (req, res) => {
    res.send(chainedBlock.getVersion());
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
