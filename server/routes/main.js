var express = require("express");
var router = express.Router();
const chainedBlock = require("../public/chainedBlock");
const { getPublicKeyFromWallet } = require("../public/encryption");
const p2pServer = require("../public/p2pServer");

/* GET home page. */
router.post("/addPeers", (req, res) => {
    const data = req.body.data || [];
    connectToPeers(data);
    res.send(data);
});

router.post("/peers", (req, res) => {
    let sockInfo = [];

    getSockets().forEach((s) => {
        sockInfo.push(s._socket.remoteAddress + ":" + s._socket.remotePort);
    });
    res.send(sockInfo);
});

router.post("/blocks", (req, res) => {
    res.send(chainedBlock.getBlocks());
});

router.post("/mineBlock", (req, res) => {
    const newBlock = chainedBlock.addBlock();
    if (newBlock !== null) {
        // p2pServer.broadcast(p2pServer.responseLatestMsg());
        return res.json(newBlock);
    } else {
        return res.json(null);
    }
});

router.post("/version", (req, res) => {
    res.send(chainedBlock.getVersion());
});

router.post("/stop", (req, res) => {
    res.send({ msg: "Stop Server!" });
    process.exit();
});

router.get("/address", (req, res) => {
    const address = getPublicKeyFromWallet().toString();
    if (address != "") {
        res.send({ address: address });
    } else {
        res.send("주소비었음");
    }
});

module.exports = router;
