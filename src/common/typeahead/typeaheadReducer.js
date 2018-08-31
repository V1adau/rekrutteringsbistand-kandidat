import { call, put, select, takeLatest } from 'redux-saga/effects';
import { fetchTypeaheadJanzzGeografiSuggestions, fetchTypeaheadSuggestions, SearchApiError } from '../../sok/api';

/** *********************************************************
 * ACTIONS
 ********************************************************* */

export const FETCH_TYPE_AHEAD_SUGGESTIONS = 'FETCH_TYPE_AHEAD_SUGGESTIONS';
export const FETCH_TYPE_AHEAD_SUGGESTIONS_SUCCESS = 'FETCH_TYPE_AHEAD_SUGGESTIONS_SUCCESS';
export const FETCH_TYPE_AHEAD_SUGGESTIONS_FAILURE = 'FETCH_TYPE_AHEAD_SUGGESTIONS_FAILURE';

// TODO: Toggle: janzz-enabled

export const SET_KOMPLETT_GEOGRAFI = 'SET_KOMPLETT_GEOGRAFI';

export const CLEAR_TYPE_AHEAD_SUGGESTIONS = 'CLEAR_TYPE_AHEAD_SUGGESTIONS';


/** *********************************************************
 * REDUCER
 ********************************************************* */

const initialTypeaheadState = () => ({
    value: '',
    suggestions: []
});

const initialState = {
    // TODO: Toggle: janzz-enabled
    kompetanse: initialTypeaheadState(),
    stilling: initialTypeaheadState(),
    arbeidserfaring: initialTypeaheadState(),
    utdanning: initialTypeaheadState(),
    geografi: initialTypeaheadState(),
    geografiKomplett: initialTypeaheadState(),
    sprak: initialTypeaheadState()
};

export default function typeaheadReducer(state = initialState, action) {
    switch (action.type) {
        case FETCH_TYPE_AHEAD_SUGGESTIONS:
            return {
                ...state,
                [action.branch]: {
                    ...(state[action.branch]),
                    value: action.value
                }
            };
        case FETCH_TYPE_AHEAD_SUGGESTIONS_SUCCESS:
            if (action.query === state[action.branch].value) {
                return {
                    ...state,
                    [action.branch]: {
                        ...(state[action.branch]),
                        suggestions: action.suggestions
                    }
                };
            }
            return state;
        case SET_KOMPLETT_GEOGRAFI:
            return {
                ...state,
                geografiKomplett: {
                    ...(state.geografiKomplett),
                    suggestions: action.value
                }
            };
        case CLEAR_TYPE_AHEAD_SUGGESTIONS:
            if (action.branch === 'geografi') {
                return {
                    ...state,
                    geografi: {
                        ...(state.geografi),
                        suggestions: []
                    },
                    geografiKomplett: {
                        ...(state.geografiKomplett),
                        suggestions: []
                    }
                };
            }
            return {
                ...state,
                [action.branch]: {
                    ...(state[action.branch]),
                    suggestions: []
                }
            };
        default:
            return state;
    }
}

const getTypeAheadBranch = (type) => {
    if (type === 'stilling') return 'sti';
    else if (type === 'arbeidserfaring') return 'yrke';
    else if (type === 'utdanning') return 'utd';
    else if (type === 'kompetanse') return 'komp';
    else if (type === 'geografi') return 'geo';
    else if (type === 'sprak') return 'sprak';
    return '';
};

/** *********************************************************
 * ASYNC ACTIONS
 ********************************************************* */

function* fetchTypeAheadSuggestionsES(action) {
    const TYPE_AHEAD_MIN_INPUT_LENGTH = 3;
    const branch = action.branch;
    const value = action.value;

    const typeAheadBranch = getTypeAheadBranch(branch);

    if (value && value.length >= TYPE_AHEAD_MIN_INPUT_LENGTH) {
        try {
            const response = yield call(fetchTypeaheadSuggestions, { [typeAheadBranch]: value });

            // The suggestions from Elastic Search is a list of key-value pair
            // Put the values into a list
            const suggestions = [];
            const totalSuggestions = [];
            if (response._embedded) {
                if (branch === 'geografi') {
                    response._embedded.stringList.map((r) => {
                        const content = JSON.parse(r.content);
                        totalSuggestions.push(content);
                        return suggestions.push(content.geografiKodeTekst);
                    });
                    yield put({ type: SET_KOMPLETT_GEOGRAFI, value: totalSuggestions });
                } else {
                    response._embedded.stringList.map((r) =>
                        suggestions.push(r.content)
                    );
                }
            }

            yield put({ type: FETCH_TYPE_AHEAD_SUGGESTIONS_SUCCESS, suggestions, branch, query: value });
        } catch (e) {
            if (e instanceof SearchApiError) {
                yield put({ type: FETCH_TYPE_AHEAD_SUGGESTIONS_FAILURE, error: e });
            } else {
                throw e;
            }
        }
    } else {
        yield put({ type: FETCH_TYPE_AHEAD_SUGGESTIONS_SUCCESS, suggestions: [], branch, query: value });
    }
}

function* fetchTypeAheadSuggestionsJanzz(action) {
    const TYPE_AHEAD_MIN_INPUT_LENGTH = 3;
    const branch = action.branch;
    const value = action.value;

    const typeAheadBranch = getTypeAheadBranch(branch);

    if (value && value.length >= TYPE_AHEAD_MIN_INPUT_LENGTH) {
        try {
            const response = branch === 'geografi' ? yield call(fetchTypeaheadJanzzGeografiSuggestions, { lokasjon: value }) : yield call(fetchTypeaheadSuggestions, { [typeAheadBranch]: value });

            const result = [];
            const totalResult = [];
            if (response._embedded) {
                if (branch === 'geografi') {
                    response._embedded.lokasjonList.map((sted) => {
                        totalResult.push({ geografiKode: sted.code, geografiKodeTekst: sted.label });
                        return result.push(sted.label);
                    });


                    yield put({ type: SET_KOMPLETT_GEOGRAFI, value: totalResult });
                } else {
                    response._embedded.stringList.map((r) =>
                        result.push(r.content)
                    );
                }

                yield put({ type: FETCH_TYPE_AHEAD_SUGGESTIONS_SUCCESS, suggestions: result, branch, query: value });
            }
        } catch (e) {
            if (e instanceof SearchApiError) {
                yield put({ type: FETCH_TYPE_AHEAD_SUGGESTIONS_FAILURE, error: e });
            } else {
                throw e;
            }
        }
    }
}

function* fetchTypeAheadSuggestions(action) {
    const state = yield select();

    // TODO: Fjern else og fetchTypeAheadSuggestionsES. Toggle: janzz-enabled
    if (state.search.featureToggles['janzz-enabled']) {
        yield fetchTypeAheadSuggestionsJanzz(action);
    } else {
        yield fetchTypeAheadSuggestionsES(action);
    }
}

export const typeaheadSaga = function* saga() {
    yield takeLatest(FETCH_TYPE_AHEAD_SUGGESTIONS, fetchTypeAheadSuggestions);
};
