import React, { useEffect, useRef, useState } from "react";

const Mining = () => {
  const ws = useRef(null);
  const [socketMessage, setSocketMessage] = useState("");

  useEffect(() => {
    ws.current = new WebSocket(`ws://127.0.0.1:6005/`);
  }, []);
  return (
    <div>
      <h2>CoLink Mining</h2>
      <div>
        <div>
          from : <input type="text" id="from" />
        </div>
        <div>
          to : <input type="text" id="to" />
        </div>
        <div>
          amount : <input type="text" id="amount" />
        </div>
        {/* <div>
          <button onClick={sendTx}>send</button>
        </div>
      </div>
      Hello world
      <button id="mineBlockon" onClick={() => mineBlock("on")}>
        startMinig
      </button>
      <button id="mineBlockoff" onClick={() => mineBlock("off")}>
        stopMinig
      </button> */}
      </div>
    </div>
  );
};

export default Mining;
