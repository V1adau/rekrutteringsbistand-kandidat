import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Systemtittel, Element } from 'nav-frontend-typografi';
import { Knapp } from 'nav-frontend-knapper';
import Typeahead from '../../common/typeahead/Typeahead';
import { SEARCH } from '../searchReducer';
import {
    CLEAR_TYPE_AHEAD_SUGGESTIONS,
    FETCH_TYPE_AHEAD_SUGGESTIONS
} from '../../common/typeahead/typeaheadReducer';
import { SELECT_TYPE_AHEAD_VALUE_SPRAK, REMOVE_SELECTED_SPRAK } from './sprakReducer';

class SprakSearch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showTypeAhead: false,
            typeAheadValue: ''
        };
    }

    onTypeAheadSprakChange = (value) => {
        this.props.fetchTypeAheadSuggestions(value);
        this.setState({
            typeAheadValue: value
        });
    };

    onTypeAheadSprakSelect = (value) => {
        if (value !== '') {
            this.props.selectTypeAheadValue(value);
            this.props.clearTypeAheadSprak('suggestionssprak');
            this.setState({
                typeAheadValue: ''
            });
            this.props.search();
        }
    };

    onLeggTilClick = () => {
        this.setState({
            showTypeAhead: true
        }, () => this.typeAhead.input.focus());
    };

    onFjernClick = (e) => {
        this.props.removeSprak(e.target.value);
        this.props.search();
    };

    onTypeAheadBlur = () => {
        this.setState({
            typeAheadValue: '',
            showTypeAhead: false
        });
        this.props.clearTypeAheadSprak('suggestionssprak');
    };

    onSubmit = (e) => {
        e.preventDefault();
        if (this.state.typeAheadValue !== '') {
            this.onTypeAheadUtdanningSelect(this.state.typeAheadValue);
            this.typeAhead.input.focus();
        }
    };

    render() {
        return (
            <div>
                <Systemtittel>Språk</Systemtittel>
                <div className="panel panel--sokekriterier">
                    <Element>Krav til språk i jobbsituasjon</Element>
                    <div className="sokekriterier--kriterier">
                        {this.state.showTypeAhead ? (
                            <div className="leggtil--sokekriterier">
                                <form
                                    onSubmit={this.onSubmit}
                                >
                                    <Typeahead
                                        ref={(typeAhead) => {
                                            this.typeAhead = typeAhead;
                                        }}
                                        onSelect={this.onTypeAheadSprakSelect}
                                        onChange={this.onTypeAheadSprakChange}
                                        label=""
                                        name="utdanning"
                                        placeholder="Skriv inn fagfelt"
                                        suggestions={this.props.typeAheadSuggestionsSprak}
                                        value={this.state.typeAheadValue}
                                        id="yrke"
                                        onSubmit={this.onSubmit}
                                        onTypeAheadBlur={this.onTypeAheadBlur}
                                    />
                                </form>
                            </div>
                        ) : (
                            <Knapp
                                onClick={this.onLeggTilClick}
                                className="leggtil--sokekriterier--knapp"
                                id="leggtil-fagfelt-knapp"
                            >
                                +Legg til språk
                            </Knapp>
                        )}
                        {this.props.sprak.map((sprak) => (
                            <button
                                onClick={this.onFjernClick}
                                className="etikett--sokekriterier kryssicon--sokekriterier"
                                key={sprak}
                                value={sprak}
                            >
                                {sprak}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        );
    }
}

SprakSearch.propTypes = {
    search: PropTypes.func.isRequired,
    removeSprak: PropTypes.func.isRequired,
    fetchTypeAheadSuggestions: PropTypes.func.isRequired,
    selectTypeAheadValue: PropTypes.func.isRequired,
    clearTypeAheadSprak: PropTypes.func.isRequired,
    sprak: PropTypes.arrayOf(PropTypes.string).isRequired,
    typeAheadSuggestionsSprak: PropTypes.arrayOf(PropTypes.string).isRequired
};

const mapStateToProps = (state) => ({
    sprak: state.sprak.sprakList,
    typeAheadSuggestionsSprak: state.typeahead.suggestionssprak
});

const mapDispatchToProps = (dispatch) => ({
    search: () => dispatch({ type: SEARCH }),
    clearTypeAheadSprak: (name) => dispatch({ type: CLEAR_TYPE_AHEAD_SUGGESTIONS, name }),
    fetchTypeAheadSuggestions: (value) => dispatch({ type: FETCH_TYPE_AHEAD_SUGGESTIONS, name: 'sprak', value }),
    selectTypeAheadValue: (value) => dispatch({ type: SELECT_TYPE_AHEAD_VALUE_SPRAK, value }),
    removeSprak: (value) => dispatch({ type: REMOVE_SELECTED_SPRAK, value })
});

export default connect(mapStateToProps, mapDispatchToProps)(SprakSearch);
