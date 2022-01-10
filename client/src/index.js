import React from "react";
import ReactDOM from "react-dom";
import "./css/index.css";

// import { applyMiddleware, createStore } from "redux";
// import promiseMiddleware from "redux-promise";
// import ReduxThunk from "redux-thunk";
import { createStore } from "redux";
import { Provider } from "react-redux";
// import { composeWithDevTools } from "redux-devtools-extension";
import rootReducer from "./redux/reducers/index";

import "./assets/boxicons-2.1.1/css/boxicons.min.css";
import "./assets/css/grid.css";
import "./assets/css/theme.css";
import "./assets/css/index.css";

import Layout from "./components/layout/Layout";

const store = createStore(rootReducer);

document.title = "CoLink";

// const createStoreWithMiddleware = applyMiddleware(
//   promiseMiddleware,
//   ReduxThunk
// )(createStore);

ReactDOM.render(
  //   <Provider
  //     store={createStoreWithMiddleware(rootReducer, composeWithDevTools())}
  //   >
  <Provider store={store}>
    <React.StrictMode>
      <Layout />
    </React.StrictMode>
  </Provider>,
  document.getElementById("root")
);
