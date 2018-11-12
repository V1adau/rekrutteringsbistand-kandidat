import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SprakSearchFelles from '../../../felles/sok/sprak/SprakSearch';
import { SEARCH } from '../searchReducer';
import {
    CLEAR_TYPE_AHEAD_SUGGESTIONS,
    FETCH_TYPE_AHEAD_SUGGESTIONS
} from '../../common/typeahead/typeaheadReducer';
import {
    SELECT_TYPE_AHEAD_VALUE_SPRAK,
    REMOVE_SELECTED_SPRAK,
    TOGGLE_SPRAK_PANEL_OPEN
} from './sprakReducer';
import { ALERTTYPE, BRANCHNAVN } from '../../../felles/konstanter';

const SprakSearch = ({ ...props }) => {
    const { search, removeSprak, fetchTypeAheadSuggestions, selectTypeAheadValue, clearTypeAheadSprak, sprak,
        typeAheadSuggestionsSprak, totaltAntallTreff, visAlertFaKandidater, skjulSprak, panelOpen, togglePanelOpen } = props;
    return (
        <SprakSearchFelles
            search={search}
            removeSprak={removeSprak}
            fetchTypeAheadSuggestions={fetchTypeAheadSuggestions}
            selectTypeAheadValue={selectTypeAheadValue}
            clearTypeAheadSprak={clearTypeAheadSprak}
            sprak={sprak}
            typeAheadSuggestionsSprak={typeAheadSuggestionsSprak}
            totaltAntallTreff={totaltAntallTreff}
            visAlertFaKandidater={visAlertFaKandidater}
            skjulSprak={skjulSprak}
            panelOpen={panelOpen}
            togglePanelOpen={togglePanelOpen}
        />
    );
};

SprakSearch.propTypes = {
    search: PropTypes.func.isRequired,
    removeSprak: PropTypes.func.isRequired,
    fetchTypeAheadSuggestions: PropTypes.func.isRequired,
    selectTypeAheadValue: PropTypes.func.isRequired,
    clearTypeAheadSprak: PropTypes.func.isRequired,
    sprak: PropTypes.arrayOf(PropTypes.string).isRequired,
    typeAheadSuggestionsSprak: PropTypes.arrayOf(PropTypes.string).isRequired,
    totaltAntallTreff: PropTypes.number.isRequired,
    visAlertFaKandidater: PropTypes.string.isRequired,
    skjulSprak: PropTypes.bool.isRequired,
    panelOpen: PropTypes.bool.isRequired,
    togglePanelOpen: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
    sprak: state.sprakReducer.sprak,
    typeAheadSuggestionsSprak: state.typeahead.sprak.suggestions,
    totaltAntallTreff: state.search.searchResultat.resultat.totaltAntallTreff,
    visAlertFaKandidater: state.search.visAlertFaKandidater,
    skjulSprak: state.search.featureToggles['skjul-spraak'],
    panelOpen: state.sprakReducer.sprakPanelOpen
});

const mapDispatchToProps = (dispatch) => ({
    search: () => dispatch({ type: SEARCH, alertType: ALERTTYPE.SPRAK }),
    clearTypeAheadSprak: () => dispatch({ type: CLEAR_TYPE_AHEAD_SUGGESTIONS, branch: BRANCHNAVN.SPRAK }),
    fetchTypeAheadSuggestions: (value) => dispatch({ type: FETCH_TYPE_AHEAD_SUGGESTIONS, branch: BRANCHNAVN.SPRAK, value }),
    selectTypeAheadValue: (value) => dispatch({ type: SELECT_TYPE_AHEAD_VALUE_SPRAK, value }),
    removeSprak: (value) => dispatch({ type: REMOVE_SELECTED_SPRAK, value }),
    togglePanelOpen: () => dispatch({ type: TOGGLE_SPRAK_PANEL_OPEN })
});

export default connect(mapStateToProps, mapDispatchToProps)(SprakSearch);
