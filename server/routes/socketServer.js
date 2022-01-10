var express = require("express");
var router = express.Router();
const {
    WebSocket,
    initP2PServer,
    initMessageHandler,
    getSockets,
} = require("../public/p2pServer");

let portArry = [];

router.post("/connectServer", (req, res) => {
    if (portArry.length === 0) {
        initP2PServer(6000);
        portArry.push(6000);
        const ws = new WebSocket("ws://localhost:6000");
        ws.on("open", () => {
            console.log("클라이언트 요청 from 6000 포트");
        });
        ws.on("message", (message) => {
            console.log(`received:${message}`);
        });
        ws.on("error", (errorType) => {
            console.log("connetion Failed!" + errorType);
        });
    } else {
        const addSocketPort = portArry[portArry.length - 1] + 1;
        initP2PServer(addSocketPort);
        portArry.push(addSocketPort);
        const ws = new WebSocket(`ws://localhost:${addSocketPort}`);
        ws.on("open", () => {
            console.log(`클라이언트 요청 from ${addSocketPort} 포트`);
        });
        ws.on("message", (message) => {
            console.log(`received:${message}`);
        });
        ws.on("error", (errorType) => {
            console.log(
                "connetion Failed!" + `from ${addSocketPort} 포트` + errorType
            );
        });
    }
});

module.exports = router;
