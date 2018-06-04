/** *********************************************************
 * ACTIONS
 ********************************************************* */
import { SET_INITIAL_STATE } from '../domene';

export const SELECT_TYPE_AHEAD_VALUE_UTDANNING = 'SELECT_TYPE_AHEAD_VALUE_UTDANNING';
export const REMOVE_SELECTED_UTDANNING = 'REMOVE_SELECTED_UTDANNING';

export const CHECK_UTDANNINGSNIVA = 'CHECK_UTDANNINGSNIVA';
export const UNCHECK_UTDANNINGSNIVA = 'UNCHECK_UTDANNINGSNIVA';

/** *********************************************************
 * REDUCER
 ********************************************************* */

const initialState = {
    utdanninger: [],
    utdanningsniva: []
};

export default function utdanningReducer(state = initialState, action) {
    switch (action.type) {
        case SET_INITIAL_STATE:
            return {
                ...state,
                utdanninger: action.query.utdanninger || [],
                utdanningsniva: action.query.utdanningsniva || []
            };
        case SELECT_TYPE_AHEAD_VALUE_UTDANNING:
            return {
                ...state,
                utdanninger: state.utdanninger.includes(action.value) ?
                    state.utdanninger :
                    [
                        ...state.utdanninger,
                        action.value
                    ]
            };
        case REMOVE_SELECTED_UTDANNING:
            return {
                ...state,
                utdanninger: state.utdanninger.filter((u) => u !== action.value)
            };
        case CHECK_UTDANNINGSNIVA:
            return {
                ...state,
                utdanningsniva: [...state.utdanningsniva, action.value]
            };
        case UNCHECK_UTDANNINGSNIVA:
            return {
                ...state,
                utdanningsniva: state.utdanningsniva.filter((u) => u !== action.value)
            };
        default:
            return {
                ...state
            };
    }
}
