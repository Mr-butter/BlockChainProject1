import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';
import { BrowserRouter } from 'react-router-dom';
import MainBody from './containers/MainBody';
import { applyMiddleware, createStore } from 'redux';
import promiseMiddleware from 'redux-promise';
import ReduxThunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import rootReducer from './reducers';

const createStoreWithMiddleware = applyMiddleware(
    promiseMiddleware,
    ReduxThunk
)(createStore);

ReactDOM.render(
    <Provider
        store={createStoreWithMiddleware(rootReducer, composeWithDevTools())}
    >
        <BrowserRouter>
            <MainBody />
        </BrowserRouter>
    </Provider>,
    document.getElementById('root')
);
