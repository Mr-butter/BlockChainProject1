import { combineReducers } from "redux";
import user from "./user";

import ThemeReducer from "./ThemeReducer";

const rootReducer = combineReducers({
  user,
  ThemeReducer,
});

export default rootReducer;
