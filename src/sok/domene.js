import { select, call, put, takeLatest } from 'redux-saga/effects';
import {
    SearchApiError,
    fetchKandidater,
    fetchTypeaheadSuggestions
} from './api';

/** *********************************************************
 * ACTIONS
 ********************************************************* */

export const SEARCH = 'SEARCH';
export const SEARCH_BEGIN = 'SEARCH_BEGIN';
export const SEARCH_SUCCESS = 'SEARCH_SUCCESS';
export const SEARCH_FAILURE = 'SEARCH_FAILURE';
export const INITIAL_SEARCH = 'INITIAL_SEARCH';
export const SET_INITIAL_STATE = 'SET_INITIAL_STATE';

export const FETCH_KOMPETANSE_SUGGESTIONS = 'FETCH_KOMPETANSE_SUGGESTIONS';
export const SET_KOMPETANSE_SUGGESTIONS_BEGIN = 'SET_KOMPETANSE_SUGGESTIONS_BEGIN';
export const SET_KOMPETANSE_SUGGESTIONS_SUCCESS = 'SET_KOMPETANSE_SUGGESTIONS_SUCCESS';

export const FETCH_TYPE_AHEAD_SUGGESTIONS = 'FETCH_TYPE_AHEAD_SUGGESTIONS';
export const FETCH_TYPE_AHEAD_SUGGESTIONS_SUCCESS = 'FETCH_TYPE_AHEAD_SUGGESTIONS_SUCCESS';
export const FETCH_TYPE_AHEAD_SUGGESTIONS_FAILURE = 'FETCH_TYPE_AHEAD_SUGGESTIONS_FAILURE';
export const FETCH_TYPE_AHEAD_SUGGESTIONS_CACHE = 'FETCH_TYPE_AHEAD_SUGGESTIONS_CACHE';

export const SELECT_TYPE_AHEAD_VALUE_YRKE = 'SELECT_TYPE_AHEAD_VALUE_YRKE';
export const REMOVE_SELECTED_YRKE = 'REMOVE_SELECTED_YRKE';

export const SELECT_TYPE_AHEAD_VALUE_ARBEIDSERFARING = 'SELECT_TYPE_AHEAD_VALUE_ARBEIDSERFARING';
export const REMOVE_SELECTED_ARBEIDSERFARING = 'REMOVE_SELECTED_ARBEIDSERFARING';

export const SELECT_TYPE_AHEAD_VALUE_UTDANNING = 'SELECT_TYPE_AHEAD_VALUE_UTDANNING';
export const REMOVE_SELECTED_UTDANNING = 'REMOVE_SELECTED_UTDANNING';

export const SELECT_TYPE_AHEAD_VALUE_GEOGRAFI = 'SELECT_TYPE_AHEAD_VALUE_GEOGRAFI';
export const REMOVE_SELECTED_GEOGRAFI = 'REMOVE_SELECTED_GEOGRAFI';

export const SELECT_TYPE_AHEAD_VALUE_KOMPETANSE = 'SELECT_TYPE_AHEAD_VALUE_KOMPETANSE';
export const REMOVE_SELECTED_KOMPETANSE = 'REMOVE_SELECTED_KOMPETANSE';

export const SELECT_TOTAL_ERFARING = 'SELECT_TOTAL_ERFARING';


/** *********************************************************
 * REDUCER
 ********************************************************* */
const initialState = {
    elasticSearchResultat: {
        resultat: {
            cver: [],
            aggregeringer: []
        },
        kompetanseSuggestions: [],
        total: 0
    },
    query: {
        yrkeserfaringer: [],
        arbeidserfaringer: [],
        utdanninger: [],
        kompetanser: [],
        geografiList: [],
        totalErfaring: '',
        styrkKode: '',
        nusKode: ''
    },
    isSearching: false,
    isInitialSearch: true,
    typeAheadSuggestionsyrkeserfaring: [],
    typeAheadSuggestionsarbeidserfaring: [],
    typeAheadSuggestionsutdanning: [],
    typeAheadSuggestionskompetanse: [],
    typeAheadSuggestionsgeografi: [],
    cachedTypeAheadSuggestionsYrke: [],
    cachedTypeAheadSuggestionsArbeidserfaring: [],
    cachedTypeAheadSuggestionsUtdanning: [],
    cachedTypeAheadSuggestionsKompetanse: [],
    cachedTypeAheadSuggestionsGeografi: [],
    error: undefined
};

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case SEARCH_BEGIN:
            return {
                ...state,
                query: action.query,
                isSearching: true
            };
        case SEARCH_SUCCESS:
            return {
                ...state,
                isSearching: false,
                isInitialSearch: false,
                error: undefined,
                elasticSearchResultat: { ...state.elasticSearchResultat, resultat: action.response, total: action.response.cver.length }
            };
        case SEARCH_FAILURE:
            return {
                ...state,
                isSearching: false,
                error: action.error
            };
        case SET_KOMPETANSE_SUGGESTIONS_BEGIN:
            return {
                ...state,
                isSearching: true,
                query: action.query
            };
        case SET_KOMPETANSE_SUGGESTIONS_SUCCESS:
            return {
                ...state,
                isSearching: false,
                elasticSearchResultat: { ...state.elasticSearchResultat, kompetanseSuggestions: action.response }
            };
        case SET_INITIAL_STATE:
            return {
                ...state,
                query: {
                    ...state.query,
                    ...action.query
                },
                isSearching: false,
                isInitialSearch: false

            };
        case FETCH_TYPE_AHEAD_SUGGESTIONS_SUCCESS:
            return {
                ...state,
                [action.typeAheadSuggestionsLabel]: action.suggestions
            };
        case FETCH_TYPE_AHEAD_SUGGESTIONS_CACHE:
            return {
                ...state,
                [action.cachedTypeAheadSuggestionsLabel]: action.cachedSuggestions
            };
        case SELECT_TYPE_AHEAD_VALUE_YRKE:
            return {
                ...state,
                query: {
                    ...state.query,
                    yrkeserfaringer: state.query.yrkeserfaringer.includes(action.value) ?
                        state.query.yrkeserfaringer :
                        [
                            ...state.query.yrkeserfaringer,
                            action.value
                        ]
                },
                typeAheadSuggestionsyrkeserfaring: []
            };
        case REMOVE_SELECTED_YRKE:
            return {
                ...state,
                query: {
                    ...state.query,
                    yrkeserfaringer: state.query.yrkeserfaringer.filter((y) => y !== action.value)
                }
            };
        case SELECT_TYPE_AHEAD_VALUE_ARBEIDSERFARING:
            return {
                ...state,
                query: {
                    ...state.query,
                    arbeidserfaringer: state.query.arbeidserfaringer.includes(action.value) ?
                        state.query.arbeidserfaringer :
                        [
                            ...state.query.arbeidserfaringer,
                            action.value
                        ]
                },
                typeAheadSuggestionsarbeidserfaring: []
            };
        case REMOVE_SELECTED_ARBEIDSERFARING:
            return {
                ...state,
                query: {
                    ...state.query,
                    arbeidserfaringer: state.query.arbeidserfaringer.filter((y) => y !== action.value)
                }
            };
        case SELECT_TYPE_AHEAD_VALUE_UTDANNING:
            return {
                ...state,
                query: {
                    ...state.query,
                    utdanninger: state.query.utdanninger.includes(action.value) ?
                        state.query.utdanninger :
                        [
                            ...state.query.utdanninger,
                            action.value
                        ]
                },
                typeAheadSuggestionsutdanning: []
            };
        case REMOVE_SELECTED_UTDANNING:
            return {
                ...state,
                query: {
                    ...state.query,
                    utdanninger: state.query.utdanninger.filter((u) => u !== action.value)
                }
            };
        case SELECT_TYPE_AHEAD_VALUE_GEOGRAFI:
            return {
                ...state,
                query: {
                    ...state.query,
                    geografiList: state.query.geografiList.includes(action.value) ?
                        state.query.geografiList :
                        [
                            ...state.query.geografiList,
                            action.value
                        ]
                },
                typeAheadSuggestionsgeografi: []
            };
        case REMOVE_SELECTED_GEOGRAFI:
            return {
                ...state,
                query: {
                    ...state.query,
                    geografiList: state.query.geografiList.filter((g) => g !== action.value)
                }
            };
        case SELECT_TYPE_AHEAD_VALUE_KOMPETANSE:
            return {
                ...state,
                query: {
                    ...state.query,
                    kompetanser: state.query.kompetanser.includes(action.value) ?
                        state.query.kompetanser :
                        [
                            ...state.query.kompetanser,
                            action.value
                        ]
                },
                typeAheadSuggestionskompetanse: []
            };
        case REMOVE_SELECTED_KOMPETANSE:
            return {
                ...state,
                query: {
                    ...state.query,
                    kompetanser: state.query.kompetanser.filter((k) => k !== action.value)
                }
            };
        case SELECT_TOTAL_ERFARING:
            return {
                ...state,
                query: {
                    ...state.query,
                    totalErfaring: action.value
                }
            };
        default:
            return { ...state };
    }
}


/** *********************************************************
 * ASYNC ACTIONS
 ********************************************************* */

function* search() {
    try {
        const state = yield select();
        const query = state.query;

        yield put({ type: SEARCH_BEGIN, query });

        const response = yield call(fetchKandidater, query);

        yield put({ type: SEARCH_SUCCESS, response });
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put({ type: SEARCH_FAILURE, error: e });
        } else {
            throw e;
        }
    }
}

function* fetchKompetanseSuggestions() {
    try {
        const state = yield select();
        const query = state.query;

        yield put({ type: SET_KOMPETANSE_SUGGESTIONS_BEGIN, query });

        if (query.yrkeserfaringer.length === 0) {
            yield put({ type: SET_KOMPETANSE_SUGGESTIONS_SUCCESS, response: [] });
        } else {
            const response = yield call(fetchKandidater, { ...query, arbeidserfaringer: query.yrkeserfaringer });

            yield put({ type: SET_KOMPETANSE_SUGGESTIONS_SUCCESS, response: response.aggregeringer[1].felt });
        }
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put({ type: SEARCH_FAILURE, error: e });
        } else {
            throw e;
        }
    }
}

function* initialSearch(action) {
    try {
        if (Object.keys(action.query).length > 0) {
            yield put({ type: SET_INITIAL_STATE, query: action.query });
        }
        yield call(search);
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put({ type: SEARCH_FAILURE, error: e });
        } else {
            throw e;
        }
    }
}

function* fetchTypeAheadSuggestions(action) {
    const TYPE_AHEAD_MIN_INPUT_LENGTH = 3;
    const state = yield select();
    const name = action.name;
    const value = action.value;

    let typeAheadName;
    let cachedSuggestionsLabel;
    if (name === 'yrkeserfaring') {
        typeAheadName = 'yrke';
        cachedSuggestionsLabel = 'cachedTypeAheadSuggestionsYrke';
    } else if (name === 'arbeidserfaring') {
        typeAheadName = 'yrke';
        cachedSuggestionsLabel = 'cachedTypeAheadSuggestionsArbeidserfaring';
    } else if (name === 'utdanning') {
        typeAheadName = 'utd';
        cachedSuggestionsLabel = 'cachedTypeAheadSuggestionsUtdanning';
    } else if (name === 'kompetanse') {
        typeAheadName = 'komp';
        cachedSuggestionsLabel = 'cachedTypeAheadSuggestionsKompetanse';
    } else if (name === 'geografi') {
        typeAheadName = 'geo';
        cachedSuggestionsLabel = 'cachedTypeAheadSuggestionsGeografi';
    }

    if (value && value.length >= TYPE_AHEAD_MIN_INPUT_LENGTH) {
        if (state[cachedSuggestionsLabel].length === 0) {
            const cachedTypeAheadMatch = value.substring(0, TYPE_AHEAD_MIN_INPUT_LENGTH);
            try {
                const response = yield call(fetchTypeaheadSuggestions, { [typeAheadName]: cachedTypeAheadMatch });

                // The result from Elastic Search is a list of key-value pair
                // Put the values into a list
                const result = [];
                if (response._embedded) {
                    response._embedded.stringList.map((r) =>
                        result.push(r.content)
                    );
                }

                const suggestions = result.filter((cachedSuggestion) => (
                    cachedSuggestion.toLowerCase()
                        .startsWith((cachedTypeAheadMatch.toLowerCase()))
                ));

                yield put({ type: FETCH_TYPE_AHEAD_SUGGESTIONS_CACHE, cachedSuggestions: result, cachedTypeAheadSuggestionsLabel: cachedSuggestionsLabel });
                yield put({ type: FETCH_TYPE_AHEAD_SUGGESTIONS_SUCCESS, suggestions, typeAheadSuggestionsLabel: `typeAheadSuggestions${name}` });
            } catch (e) {
                if (e instanceof SearchApiError) {
                    yield put({ type: FETCH_TYPE_AHEAD_SUGGESTIONS_FAILURE, error: e });
                } else {
                    throw e;
                }
            }
        } else {
            const suggestions = state[cachedSuggestionsLabel].filter((cachedSuggestion) => (
                cachedSuggestion.toLowerCase()
                    .startsWith(value.toLowerCase())
            ));
            yield put({ type: FETCH_TYPE_AHEAD_SUGGESTIONS_SUCCESS, suggestions, typeAheadSuggestionsLabel: `typeAheadSuggestions${name}` });
        }
    } else {
        yield put({ type: FETCH_TYPE_AHEAD_SUGGESTIONS_CACHE, cachedSuggestions: [], cachedTypeAheadSuggestionsLabel: cachedSuggestionsLabel });
        yield put({ type: FETCH_TYPE_AHEAD_SUGGESTIONS_SUCCESS, suggestions: [], typeAheadSuggestionsLabel: `typeAheadSuggestions${name}` });
    }
}

export const saga = function* saga() {
    yield takeLatest(SEARCH, search);
    yield takeLatest(FETCH_KOMPETANSE_SUGGESTIONS, fetchKompetanseSuggestions);
    yield takeLatest(INITIAL_SEARCH, initialSearch);
    yield takeLatest(FETCH_TYPE_AHEAD_SUGGESTIONS, fetchTypeAheadSuggestions);
};
