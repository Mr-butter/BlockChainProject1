const p2p_port = process.env.P2P_PORT || 6001;

const WebSocket = require("ws");
const {
    getLastBlock,
    createHash,
    addBlock,
    replaceChain,
} = require("./chainedBlock");

function initP2PServer(port) {
    const server = new WebSocket.Server({ port: port });
    server.on("connection", (ws) => {
        initConnection(ws);
    });
    console.log("웹소켓 서버 포트 : " + port);
}

// function initP2PServer(server, port) {
//   const webSocketServer = new WebSocket.Server({ server: server });
//   webSocketServer.on("connection", (ws) => {
//     initConnection(ws);
//   });
//   console.log("웹소켓 서버 포트 : " + port);
// }

// function testmessage(peer) {
//   const ws = new WebSocket(peer);
//   ws.on("open", () => {
//     ws.send("클라이언트 접속요청");
//   });
//   ws.on("message", (message) => {
//     console.log(`클라이언트 받은 메세지:${message}`);
//   });
//   ws.on("error", (errorType) => {
//     console.log("connetion Failed!" + errorType);
//   });
// }

let sockets = [];

function initConnection(ws) {
    sockets.push(ws);
    initMessageHandler(ws);
    initErrorHandler(ws);
    write(ws, queryLatestMsg());
}

function getSockets() {
    return sockets;
}

function write(ws, message) {
    console.log(message);
    ws.send(JSON.stringify(message));
}

///////////////////////////////////////////////////////////

function broadcast(message) {
    sockets.forEach((socket) => {
        write(socket, message);
    });
}
///////////////////////////////////////////////////////////

function connectToPeer(peer) {
    const ws = new WebSocket(peer);
    ws.on("open", () => {
        console.log("채굴시작");
        while (true) {
            addBlock();
        }
    });
    ws.on("error", (errorType) => {
        console.log("connetion Failed!" + errorType);
    });
}

// Message Handler
const MessageType = {
    QUERY_LATEST: 0,
    QUERY_ALL: 1,
    RESPONSE_BLOCKCHAIN: 2,
};

function initMessageHandler(ws) {
    console.log("핸들러 진입");
    ws.on("message", (data) => {
        const message = JSON.parse(data);

        switch (message.type) {
            case MessageType.QUERY_LATEST:
                write(ws, responseLatestMsg());
                break;
            case MessageType.QUERY_ALL:
                write(ws, responseAllChainMsg());
                break;
            case MessageType.RESPONSE_BLOCKCHAIN:
                handleBlockChainResponse(message);
                break;
        }
    });
}

function responseLatestMsg() {
    return {
        type: MessageType.RESPONSE_BLOCKCHAIN,
        data: JSON.stringify([getLastBlock()]),
    };
}

function responseAllChainMsg() {
    return {
        type: MessageType.RESPONSE_BLOCKCHAIN,
        data: JSON.stringify(getBlocks()),
    };
}

function handleBlockChainResponse(message) {
    const receiveBlocks = JSON.parse(message.data);
    const latestReceiveBlock = receiveBlocks[receiveBlocks.length - 1];
    const latesMyBlock = getLastBlock();

    // 데이터로 받은 블럭 중에 마지막 블럭의 인덱스가
    // 내가 보유 중인 마지막 블럭의 인덱스보다 클 때 / 작을 때
    if (latestReceiveBlock.header.index > latesMyBlock.header.index) {
        // 받은 마지막 블록의 이전 해시값이 내 마지막 블럭일 때
        if (
            createHash(latesMyBlock) === latestReceiveBlock.header.previousHash
        ) {
            if (addBlock(latestReceiveBlock)) {
                broadcast(responseLatestMsg());
            } else {
                console.log("Invalid Block!!");
            }
        }
        // 받은 블럭의 전체 크기가 1일 때
        else if (receiveBlocks.length === 1) {
            broadcast(queryAllMsg());
        } else {
            replaceChain(receiveBlocks);
        }
    } else {
        console.log("Do nothing.");
    }
}

function queryAllMsg() {
    return {
        type: MessageType.QUERY_ALL,
        data: null,
    };
}

function queryLatestMsg() {
    return {
        type: MessageType.QUERY_LATEST,
        data: null,
    };
}

function initErrorHandler(ws) {
    ws.on("close", () => {
        closeConnection(ws);
    });
    ws.on("error", () => {
        closeConnection(ws);
    });
}

function closeConnection(ws) {
    console.log(`Connection close ${ws.url}`);
    sockets.splice(sockets.indexOf(ws), 1);
}

module.exports = {
    WebSocket,
    initP2PServer,
    connectToPeer,
    initMessageHandler,
    getSockets,
    broadcast,
    responseLatestMsg,
};
