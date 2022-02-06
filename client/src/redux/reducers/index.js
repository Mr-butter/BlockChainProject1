import { combineReducers } from "redux";
import User from "./User";
import Block from "./Block";
import Socket from "./Socket";

import ThemeReducer from "./ThemeReducer";

const rootReducer = combineReducers({
    User,
    Block,
    Socket,
    ThemeReducer,
});

export default rootReducer;
