var express = require("express");
var router = express.Router();

/* GET home page. */
router.post("/addPeers", (req, res) => {
    const data = req.body.data || [];
    connectToPeers(data);
    res.send(data);
});

router.get("/peers", (req, res) => {
    let sockInfo = [];

    getSockets().forEach((s) => {
        sockInfo.push(s._socket.remoteAddress + ":" + s._socket.remotePort);
    });
    res.send(sockInfo);
});

router.get("/blocks", (req, res) => {
    res.send(getBlocks());
});

router.post("/mineBlock", (req, res) => {
    const data = req.body.data || [];
    const block = nextBlock(data);
    addBlock(block);

    res.send(block);
});

router.get("/version", (req, res) => {
    res.send(getVersion());
});

router.get("/stop", (req, res) => {
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
