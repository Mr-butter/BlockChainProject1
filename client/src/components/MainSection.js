import axios from "axios";
import React from "react";
import { withRouter } from "react-router-dom";

function MainSection(props) {
    return (
        <div>
            <h2>메인 페이지 내용 추가</h2>
            <ol>
                <li>
                    <button id="blocks" onclick="block()">
                        get blocks
                    </button>
                </li>
                <li>
                    <button id="mineBlock" onclick="mineBlock()">
                        mineBlock
                    </button>
                </li>
                <li>
                    <button id="version" onclick="version()">
                        version
                    </button>
                </li>
                <li>
                    <button id="addPeers" onclick="addPeers()">
                        addPeers
                    </button>
                </li>
                <li>
                    <button id="peers" onclick="peers()">
                        peers
                    </button>
                </li>
                <li>
                    <button id="address" onclick="address()">
                        address
                    </button>
                </li>
            </ol>
        </div>
    );
}

export default withRouter(MainSection);
