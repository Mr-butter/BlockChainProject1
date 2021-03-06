import React from "react";
import ReactDOM from "react-dom";
import "./css/index.css";

import { applyMiddleware, createStore } from "redux";
import promiseMiddleware from "redux-promise";
import ReduxThunk from "redux-thunk";
import { Provider } from "react-redux";

import { composeWithDevTools } from "redux-devtools-extension";
// import rootReducer from "./reducers";
import { BrowserRouter } from "react-router-dom";
import rootReducer from "./redux/reducers/index";

import "./assets/boxicons-2.1.1/css/boxicons.min.css";
import "./assets/css/grid.css";
import "./assets/css/theme.css";
import "./assets/css/index.css";

import Layout from "./components/layout/Layout";
import { createMuiTheme, ThemeProvider } from "@material-ui/core";

const theme = createMuiTheme({
    palette: {
        type: "dark",
    },
});

const store = createStore(rootReducer);

document.title = "CoLink";

const createStoreWithMiddleware = applyMiddleware(
    promiseMiddleware,
    ReduxThunk
)(createStore);

ReactDOM.render(
    <ThemeProvider theme={theme}>
        <Provider
            store={createStoreWithMiddleware(
                rootReducer,
                composeWithDevTools()
            )}
        >
            <BrowserRouter>
                <Layout />
            </BrowserRouter>
        </Provider>
    </ThemeProvider>,
    document.getElementById("root")
);
