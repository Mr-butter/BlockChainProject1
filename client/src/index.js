import React from "react";
import ReactDOM from "react-dom";
import "./css/index.css";

// import { applyMiddleware, createStore } from "redux";
// import promiseMiddleware from "redux-promise";
// import ReduxThunk from "redux-thunk";
import { createStore } from "redux";
import { Provider } from "react-redux";
// import { composeWithDevTools } from "redux-devtools-extension";
import rootReducer from "./reducers";

import Layout from "./components/layout/Layout";

document.title = "CoLink";

// const createStoreWithMiddleware = applyMiddleware(
//   promiseMiddleware,
//   ReduxThunk
// )(createStore);

const store = createStore(rootReducer);

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
