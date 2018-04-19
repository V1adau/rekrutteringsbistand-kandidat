import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter, Route } from 'react-router-dom';
import { composeWithDevTools } from 'redux-devtools-extension';
import { applyMiddleware, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';
import Kandidatsok from './Kandidatsok';
import ShowCv from './ShowCv';
import './../styles.less';
import './sok.less';
import searchReducer, { saga } from './domene';
import { getUrlParameterByName, toUrlParams } from './utils';

export const getInitialStateFromUrl = (url) => {
    const stateFromUrl = {};
    const yrkeserfaring = getUrlParameterByName('yrkeserfaring', url);
    const kompetanse = getUrlParameterByName('kompetanse', url);
    const utdanning = getUrlParameterByName('utdanning', url);
    const styrkKode = getUrlParameterByName('styrkKode', url);
    const nusKode = getUrlParameterByName('nusKode', url);

    if (yrkeserfaring) stateFromUrl.yrkeserfaring = yrkeserfaring;
    if (kompetanse) stateFromUrl.kompetanse = kompetanse;
    if (utdanning) stateFromUrl.utdanning = utdanning;
    if (styrkKode) stateFromUrl.styrkKode = styrkKode;
    if (nusKode) stateFromUrl.nusKode = nusKode;
    return stateFromUrl;
};

export const createUrlParamsFromState = (state) => {
    const { query } = state;
    const urlQuery = {};
    if (query.yrkeserfaring) urlQuery.yrkeserfaring = query.yrkeserfaring;
    if (query.kompetanse) urlQuery.kompetanse = query.kompetanse;
    if (query.utdanning) urlQuery.utdanning = query.utdanning;
    if (query.styrkKode) urlQuery.styrkKode = query.styrkKode;
    if (query.nusKode) urlQuery.nusKode = query.nusKode;
    return toUrlParams(urlQuery);
};

const sagaMiddleware = createSagaMiddleware();
const store = createStore(searchReducer, composeWithDevTools(
    applyMiddleware(sagaMiddleware)));


store.subscribe(() => {
    if (store.getState().isSearching) {
        const urlParams = createUrlParamsFromState(store.getState());
        if (urlParams && urlParams.length > 0) {
            window.history.replaceState('', '', `?${urlParams}`);
        } else {
            window.history.replaceState('', '', window.location.pathname);
        }
    }
});

const App = () => (
    <div>
        <Route exact path="/pam-kandidatsok" render={() => <Kandidatsok urlParams={getInitialStateFromUrl(window.location.href)} />} />
        <Route exact path="/pam-kandidatsok/showcv/:id" render={(props) => <ShowCv {...props} />} />
    </div>
);

sagaMiddleware.run(saga);

ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </Provider>,
    document.getElementById('app')
);

