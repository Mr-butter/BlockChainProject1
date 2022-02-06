const p2pport = process.env.P2P_PORT || "6001";
const { WebSocket } = require("ws");
const transactionPool = require("./transactionpool");

// 웹소켓 서버 개통
function initP2PServer(port) {
  // 해당 포트로 새 웹소켓 서버를 개통하고
  const p2pserver = new WebSocket.Server({ port: port });
  // 서버가 개통되었다면 앞으로 해당 소켓에서 무엇을 할 것인지 명시.
  p2pserver.on("connection", (ws) => {
    // 소켓 연결 초기화 할 것. (그럼 앞으로 initConnection에 들어있는 내용들)실행가능.
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

// 연결된 소켓 목록
let sockets = [];

// 소켓 연결 초기화
function initConnection(ws) {
  console.log('4. 인잇컨넥션 진입 - 소켓배열에 푸쉬됨\n');

  // 해당 소켓을 내 연결목록에 추가하고
  sockets.push(ws);
  // 메시지 핸들러 초기화 (다른 소켓 처음 연결할 때 서로 빈 메시지 교환)
  initMessageHandler(ws);
  // 에러 핸들러 초기화
  initErrorHandler(ws);
  // 해당 소켓에게 마지막 블록 요청
  write(ws, queryLatestMsg());

  // 해당 소캣애개  답장 받기까지 잠시대기
  setTimeout(() => {
    // 연결된 모두에게 트랜잭션 풀 달라고 요청하기
      broadcast(queryTransactionPoolMsg());
  }, 500);
}

// 소켓 연결목록 가져오기
const getSockets = () => sockets;
// function getSockets() {
//   return sockets;
// }

// 해당 소켓에 해당 메시지 전송하기
function write(ws, message) {
  console.log(`\n8. 소켓에 메세지 발송` + message);
  ws.send(JSON.stringify(message));
}

///////////////////////////////////////////////////////////

// 전체 블록체인 네트워크에 퍼트리기
// 내 소켓 연결목록에 있는 노드들에게 메시지 전송
const broadcast = (message) => sockets.forEach((socket) => write(socket, message));
// function broadcast(message) {
//   sockets.forEach((socket) => {
//     write(socket, message);
//   });
// }
///////////////////////////////////////////////////////////

// 받은 주소로 소켓 연결하기
function connectToPeer(port) {
  console.log("2. connectToPeer 진입");
  console.log(`port :` + port);

  const peer = `ws://localhost:${port}`;
  const ws = new WebSocket(peer);

  ws.on("open", () => {
    console.log("피어연결완료 / ws.on(접속)");
    initConnection(ws);
  });
  
  ws.on("error", () => {
    console.log("피어연결실패");
    console.log(ws.readyState);
    // WebSocket.readyState 읽기 전용 속성은  WebSocket현재 상태를 반환

    if (ws.readyState === 2) {
      console.log("웹소켓 서버를 새로 생성합니다.");
      initP2PServer(port);
      connectToPeer(port);
    }
    // console.log("재접속을 시도합니다");
    // connectToPeer(port);
  });
}
connectToPeer(6001);

// Message Handler 메시지 타입정의
const MessageType = {
  QUERY_LATEST: 0, // 가지고 있는 마지막 블록 요청
  QUERY_ALL: 1, // 가지고 있는 모든 블록(블록체인)요청
  RESPONSE_BLOCKCHAIN: 2, // 내 블록체인 전달
  QUERY_TRANSACTION_POOL: 3, // 가지고 있는 트랜잭션 풀을 요청
  RESPONSE_TRANSACTION_POOL: 4, // 트랜잭션 풀을 전달요청
};

// 메시지 받으면 따를 메뉴얼
function initMessageHandler(ws) {
  const chainedBlock_Func = require("./chainedBlock");

  ws.on("message", (data) => {
    try {
      // JSON 형식으로 받은 메시지 원래 형태로 반환
      const message = JSON.parse(data);

      // 메시지 변환하게 null인경우 오류메시지
      if (message === null) {
        console.log("could not parse received JSON message:", data + "를 분석할 수 없습니다.");
        return;
      } 
      console.log("메시지 도착!" + 'Received message: %s', JSON.stringify(message));

      // 메시지 타입에 따라 무엇을 할 것인지
      switch (message.type) {
        case MessageType.QUERY_LATEST:
          console.log("마지막 블록 전송요청, 마지막 블록을 보내겠습니다.");
          write(ws, responseLatestMsg());
          break;

        case MessageType.QUERY_ALL:
          console.log("모든블록(블록체인) 전송요청, 블록체인을 전송하겠습니다.");
          write(ws, responseAllChainMsg());
          break;

        case MessageType.RESPONSE_BLOCKCHAIN:
          const receivedBlocks = JSON.parse(message.data);
          if (receivedBlocks === null) {
            console.log("젇달받은 메시지에 블록이 없습니다.", JSON.stringify(message.data));
            break;
          }
          console.log("받은 메시지에 블록 발견, 비교해보겠습니다.");
          handleBlockChainResponse(message);
          break;

        case MessageType.QUERY_TRANSACTION_POOL:
          console.log("트랜잭션풀 요청이 있어 트랜잭션풀을 전송하겠습니다.");
          write(ws, responseTransactionPoolMsg());
          break;

        case MessageType.RESPONSE_TRANSACTION_POOL:
          const receivedTransactions = JSON.parse(message.data);
          if (receivedTransactions === null) {
            console.log("받은 메시지에 트랜잭션 풀이 없습니다.", JSON.stringify(message.data));
          }

          // 받은 트랜잭션들
          receivedTransactions.forEach((transaction) => {
            try {
              chainedBlock_Func.handleReceivedTransaction(transaction);
              // if no error is thrown, transaction was indeed added to the pool
              // let's broadcast transaction pool
              broadCastTransactionPool();
            } catch (e) {
              console.log(e.message);
            }
          });
          break;
      }
    } catch (e) {
      console.log(e);
    }
  });
};

// 다른 노드에게 내가가진 마지막 블록 전송요청메시지
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

// 다른 노드에게 상대방 트랜잭션 풀 요청 메시지
const queryTransactionPoolMsg = () => ({
  type: MessageType.QUERY_TRANSACTION_POOL,
  data: null,
});

// 상대 노드에게 블록체인 또는 마지막 블록 받으면 처리할 메뉴얼
function handleBlockChainResponse(message) {
  console.log('\n9. 메세지타입 RESPONSE_BLOCKCHAIN 의 자세한 내용들');

  const chainedBlock_Func = require("./chainedBlock");
  const receiveBlocks = JSON.parse(message.data);
  
  // 전달받은 블록 OR 블록체인의 마지막 블록 변수로 저장
  const latestReceiveBlock = receiveBlocks[receiveBlocks.length - 1];
  // 내 블록체인의 마지막 블록변수로 저장
  const latesMyBlock = chainedBlock_Func.getLastBlock();

    // 전달받은 블록 OR 블록체인의 길이가 0일때
    if (receiveBlocks.length === 0) {
      console.log('received block chain size of 0'+ "전달받은 블록체인 길이가 0 ?");
      return;
    }
  
    // 블록 구조 검증
    // if (!isValidBlockStructure(latestReceiveBlock)) {
    //   console.log('block structuture not valid' + "블록체인 구조가 유효하지 않음");
    //   return;
    // }


  // 데이터로 받은 블럭 중에 마지막 블럭의 인덱스가
  // 내가 보유 중인 마지막 블럭의 인덱스보다 클 때 / 작을 때
  if (latestReceiveBlock.header.index > latesMyBlock.header.index) {
    // 내 블록보다 긴것으로 추정되는 블록을 받은것 같아 비교
    console.log('blockchain possibly behind. We got: '
      + latesMyBlock.index + ' Peer got: ' + latestReceiveBlock.index);
    // 받은 마지막 블록의 이전 해시값이 내 마지막 블럭일 때
    // 내 마지막 블록의 해시랑 전달받은 마지막 블록의 이전해시가 같을때
    if (
      chainedBlock_Func.createHash(latesMyBlock) ===
      latestReceiveBlock.header.previousHash
    ) {
      // 내 블록체인에 전달받은 마지막 블록을 연결하고 boradcase (퍼트리기)
      if (chainedBlock_Func.addBlock(latestReceiveBlock)) {
        broadcast(responseLatestMsg());
      } else {
        console.log("Invalid Block!!");
      }
    }
    // 전달받은 블록 OR 블록체인의 길이가 1일때
    // (전달받은 블록이 내 블록보다 2개이상 긴 상태인데 마지막 블록 한개만 받은 상황)
    else if (receiveBlocks.length === 1) {

      broadcast(queryAllMsg());

    } else {
      console.log('Received blockchain is longer than current blockchain');
      // 전달받은 블록체인이 내것보다 더 길어서 검증해보고 교체하겠다는것.
      chainedBlock_Func.replaceChain(receiveBlocks);
    }
  } else {
    console.log('received blockchain is not longer than received blockchain. Do nothing');
  }
}

// 다른 노드에게 내 트랜잭션풀 전송요청 메시지
const responseTransactionPoolMsg = () => ({
  type: MessageType.RESPONSE_TRANSACTION_POOL,
  data: JSON.stringify(transactionPool.getTransactionPool()),
});

// 트랜잭션 풀 broadcast
const broadCastTransactionPool = () => {
  broadcast(responseTransactionPoolMsg());
};

// 다른 노드에게 가진 블록체인 전송요청 메시지
function queryAllMsg() {
  return {
      type: MessageType.QUERY_ALL,
      data: null,
  };
}

// 다른 노드에게 마지막 블록 전송요청 메시지
// 네이브 코인에서는 > queryChainLengthMsg
function queryLatestMsg() {
  return {
      type: MessageType.QUERY_LATEST,
      data: null,
  };
}

// 에러 핸들러 초기화
function initErrorHandler(ws) {
  console.log("에러 핸들러 초기화 진입");

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
        // 해당 소켓이 닫히거나 오류가 있으면 연결 끊기
        default:
            closeConnection(ws);
            console.log("웹소켓 서버 재접속...");
            connectToPeer(6001);
            break;
    }
  });
}

// function closeConnection(ws) {
//   console.log(`Connection close ${ws.url}`);
//   sockets.splice(sockets.indexOf(ws), 1);
//   if (ws.readyState === 2) {
//     console.log("웹소켓 서버를 새로 생성합니다.");
//     initP2PServer(6001);
//     connectToPeer(6001);
//   }
//   console.log("재접속을 시도합니다");
//   connectToPeer(6001);
// }

function closeConnection(ws) {
  console.log(`Connection close ${ws.url}`);
  sockets.splice(sockets.indexOf(ws), 1);

  // 해당 소켓이 닫히거나 오류가 있으면 연결 끊기
  // ws.on('close', () => closeConnection(ws));
  // ws.on('error', () => closeConnection(ws));
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
  broadCastTransactionPool,
  responseLatestMsg,
};
