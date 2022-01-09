var express = require("express");
var router = express.Router();
const { getBlocks, nextBlock, getVersion } = require("../public/chainedBlock");
const { addBlock } = require("../public/checkValidBlock");
const { getPublicKeyFromWallet } = require("../public/encryption");

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
    res.send(getBlocks());
});

router.post("/mineBlock", (req, res) => {
    const data = req.body.data || [];
    const block = nextBlock(data);
    addBlock(block);

    res.send(block);
});

router.post("/version", (req, res) => {
    res.send(getVersion());
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
