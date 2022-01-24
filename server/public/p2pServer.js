const p2pport = process.env.P2P_PORT || "6001";
const { WebSocket } = require("ws");

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
    if (ws.readyState === 2) {
      console.log("웹소켓 서버를 새로 생성합니다.");
      initP2PServer(port);
      connectToPeer(port);
    }
    // console.log("재접속을 시도합니다");
    // connectToPeer(port);
  });
}

// Message Handler
const MessageType = {
  QUERY_LATEST: 0,
  QUERY_ALL: 1,
  RESPONSE_BLOCKCHAIN: 2,
};

function initMessageHandler(ws) {
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
      if (chainedBlock_Func.addBlock(latestReceiveBlock)) {
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
  console.log("에러 핸들러 진입");
  ws.on("close", () => {
    closeConnection(ws);
  });
  ws.on("error", () => {
    closeConnection(ws);
  });
  console.log("에러 핸들러 종료");
}

function closeConnection(ws) {
  console.log(`Connection close ${ws.url}`);
  sockets.splice(sockets.indexOf(ws), 1);
  if (ws.readyState === 2) {
    console.log("웹소켓 서버를 새로 생성합니다.");
    initP2PServer(6001);
    connectToPeer(6001);
  }
  console.log("재접속을 시도합니다");
  connectToPeer(6001);
}

const broadcastLatest = () => {
  broadcast(responseLatestMsg());
}

// parentPort.on("message", (message) => {
//     const chainedBlock_func = require("./chainedBlock");
//     switch (message) {
//         case "on":
//             connectToPeer(6001);
//             setInterval(() => chainedBlock_func.addBlock(), 1000);
//             break;
//         case "block":
//             chainedBlock_func.addBlock();
//             return;
//         case "off":
//             parentPort.close();
//             return;

//         default:
//             break;
//     }
// });

module.exports = {
  WebSocket,
  initP2PServer,
  initHttpP2PServer,
  connectToPeer,
  initMessageHandler,
  getSockets,
  broadcast,
  responseLatestMsg,
  broadcastLatest
};
