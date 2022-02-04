const p2pport = process.env.P2P_PORT || "6001";
const { WebSocket } = require("ws");
const transactionPool = require("./transactionpool");

function initP2PServer(port) {
    const p2pserver = new WebSocket.Server({ port: port });
    p2pserver.on("connection", (ws) => {
        initConnection(ws);
        console.log(`${port}번 포트 웹소켓 서버에 접속하셨습니다.`);
    });
    console.log(`${port}번 포트로 웹소켓 서버 생성되었습니다.`);
}

function initHttpP2PServer(server, port) {
    const p2pserver = new WebSocket.Server({ server });
    p2pserver.on("connection", (ws) => {
        // initConnection(ws);
        console.log(`${port}번 포트 웹소켓 서버에 접속하셨습니다.`);
    });
    console.log(`${port}번 포트로 웹소켓 서버 생성되었습니다.`);
}

let sockets = [];

function initConnection(ws) {
    sockets.push(ws);
    initMessageHandler(ws);
    initErrorHandler(ws);
    write(ws, queryLatestMsg());
    setTimeout(() => {
        broadcast(queryTransactionPoolMsg());
    }, 500);
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

function connectToPeer(port) {
    const peer = `ws://localhost:${port}`;
    const ws = new WebSocket(peer);
    ws.on("open", () => {
        console.log("피어연결완료");
        initConnection(ws);
    });
    ws.on("error", () => {
        console.log("피어연결실패");
        console.log(ws.readyState);
        switch (ws.readyState) {
            case 2:
                console.log("케이스2 : 웹소켓 서버를 새로 생성합니다.");
                initP2PServer(6001);
                connectToPeer(6001);
                break;
            case 3:
                console.log("케이스3 : 웹소켓 서버를 새로 생성합니다.");
                initP2PServer(6001);
                connectToPeer(6001);
                break;

            default:
                closeConnection(ws);
                break;
        }
    });
}
connectToPeer(6001);

// Message Handler
const MessageType = {
    QUERY_LATEST: 0,
    QUERY_ALL: 1,
    RESPONSE_BLOCKCHAIN: 2,
    QUERY_TRANSACTION_POOL: 3,
    RESPONSE_TRANSACTION_POOL: 4,
};

function initMessageHandler(ws) {
    const chainedBlock_Func = require("./chainedBlock");
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
            case MessageType.QUERY_TRANSACTION_POOL:
                write(ws, responseTransactionPoolMsg());
                break;
            case MessageType.RESPONSE_TRANSACTION_POOL:
                const receivedTransactions = JSON.parse(message.data);
                if (message === null) {
                    console.log(
                        "invalid transaction received: %s",
                        JSON.stringify(message)
                    );
                    break;
                }
                receivedTransactions.forEach((transaction) => {
                    try {
                        chainedBlock_Func.handleReceivedTransaction(
                            transaction
                        );
                        // if no error is thrown, transaction was indeed added to the pool
                        // let's broadcast transaction pool
                        broadCastTransactionPool();
                    } catch (e) {
                        console.log(e.message);
                    }
                });
                break;
        }
    });
}

function responseLatestMsg() {
    const chainedBlock_Func = require("./chainedBlock");
    return {
        type: MessageType.RESPONSE_BLOCKCHAIN,
        data: JSON.stringify([chainedBlock_Func.getLastBlock()]),
    };
}

function responseAllChainMsg() {
    const chainedBlock_Func = require("./chainedBlock");
    return {
        type: MessageType.RESPONSE_BLOCKCHAIN,
        data: JSON.stringify(chainedBlock_Func.getBlocks()),
    };
}
const queryTransactionPoolMsg = () => ({
    type: MessageType.QUERY_TRANSACTION_POOL,
    data: null,
});

function handleBlockChainResponse(message) {
    const chainedBlock_Func = require("./chainedBlock");
    const receiveBlocks = JSON.parse(message.data);
    const latestReceiveBlock = receiveBlocks[receiveBlocks.length - 1];
    const latesMyBlock = chainedBlock_Func.getLastBlock();

    // 데이터로 받은 블럭 중에 마지막 블럭의 인덱스가
    // 내가 보유 중인 마지막 블럭의 인덱스보다 클 때 / 작을 때
    if (latestReceiveBlock.header.index > latesMyBlock.header.index) {
        console.log("//////////////////////////////////////////////////");
        // 받은 마지막 블록의 이전 해시값이 내 마지막 블럭일 때
        if (
            chainedBlock_Func.createHash(latesMyBlock) ===
            latestReceiveBlock.header.previousHash
        ) {
            if (chainedBlock_Func.addBlockToChain(latestReceiveBlock)) {
                broadcast(responseLatestMsg());
            } else {
                console.log("Invalid Block!!");
            }
        }
        // 받은 블럭의 전체 크기가 1일 때
        else if (receiveBlocks.length === 1) {
            broadcast(queryAllMsg());
        } else {
            chainedBlock_Func.replaceChain(receiveBlocks);
        }
    } else {
        console.log("Do nothing.");
    }
}
const responseTransactionPoolMsg = () => ({
    type: MessageType.RESPONSE_TRANSACTION_POOL,
    data: JSON.stringify(transactionPool.getTransactionPool()),
});

const broadCastTransactionPool = () => {
    broadcast(responseTransactionPoolMsg());
};

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
        console.log("웹소켓 close 진입");
        closeConnection(ws);
    });
    ws.on("error", () => {
        console.log("웹소켓 error 진입");
        switch (ws.readyState) {
            case 0:
                console.log("웹소켓 서버를 새로 생성합니다.");
                initP2PServer(6001);
                connectToPeer(6001);
                break;
            case 2:
                console.log("웹소켓 서버 재접속...");
                connectToPeer(6001);
                break;
            case 3:
                console.log("웹소켓 서버를 새로 생성합니다.");
                initP2PServer(6001);
                connectToPeer(6001);
                break;

            default:
                closeConnection(ws);
                console.log("웹소켓 서버 재접속...");
                connectToPeer(6001);
                break;
        }
    });
}

function closeConnection(ws) {
    console.log(`Connection close ${ws.url}`);
    sockets.splice(sockets.indexOf(ws), 1);
}

module.exports = {
    WebSocket,
    initP2PServer,
    initHttpP2PServer,
    connectToPeer,
    initMessageHandler,
    getSockets,
    broadcast,
    broadCastTransactionPool,
    responseLatestMsg,
};
