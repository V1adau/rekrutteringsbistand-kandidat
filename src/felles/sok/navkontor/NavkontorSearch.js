import React from 'react';
import PropTypes from 'prop-types';
import { Element } from 'nav-frontend-typografi';
import { Merkelapp } from 'pam-frontend-merkelapper';
import { Checkbox } from 'nav-frontend-skjema';
import SokekriteriePanel from '../../common/sokekriteriePanel/SokekriteriePanel';
import LeggtilKnapp from '../../common/leggtilKnapp/LeggtilKnapp';
import Typeahead from '../../../veileder/common/typeahead/Typeahead';
import { ALERTTYPE } from '../../konstanter';
import AlertStripeInfo from '../../common/AlertStripeInfo';
import './Navkontor.less';

class NavkontorSearch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showTypeAhead: false,
            typeAheadValue: ''
        };
    }

    onTypeAheadNavkontorChange = (value) => {
        this.props.fetchTypeAheadSuggestions(value);
        this.setState({
            typeAheadValue: value
        });
    };

    onTypeAheadNavkontorSelect = (value) => {
        if (value !== '') {
            const navkontor = this.props.typeAheadSuggestionsNavkontor.find((n) => n.toLowerCase() === value.toLowerCase());
            if (navkontor !== undefined) {
                this.props.selectTypeAheadValue(navkontor);
                this.props.clearTypeAheadNavkontor();
                this.setState({
                    typeAheadValue: ''
                });
                this.props.search();
            }
        }
    };

    onTypeAheadBlur = () => {
        this.setState({
            typeAheadValue: '',
            showTypeAhead: false
        });
        this.props.clearTypeAheadNavkontor();
    };

    onAddClick = () => {
        this.setState({
            showTypeAhead: true
        }, () => this.typeAhead.input.focus());
    };

    onRemoveClick = (navkontor) => {
        this.props.removeNavkontor(navkontor);
        this.props.search();
    };

    onSubmit = (e) => {
        e.preventDefault();
        this.onTypeAheadNavkontorSelect(this.state.typeAheadValue);
        this.typeAhead.input.focus();
    };

    onToggleMineKandidater = () => {
        this.props.toggleMinekandidater();
        this.props.search();
    };

    render() {
        if (this.props.skjulNavkontor) {
            return null;
        }
        return (
            <SokekriteriePanel
                id="NavKontor__SokekriteriePanel"
                tittel="NAV-kontor"
                onClick={this.props.togglePanelOpen}
                apen={this.props.panelOpen}
            >
                <Element>Brukers NAV-kontor</Element>
                <div className="sokekriterier--kriterier">
                    <div>
                        {this.state.showTypeAhead ? (
                            <Typeahead
                                ref={(typeAhead) => {
                                    this.typeAhead = typeAhead;
                                }}
                                onSelect={this.onTypeAheadNavkontorSelect}
                                onChange={this.onTypeAheadNavkontorChange}
                                label=""
                                name="navkontor"
                                placeholder="Skriv inn NAV-kontor"
                                suggestions={this.props.typeAheadSuggestionsNavkontor}
                                value={this.state.typeAheadValue}
                                id="navkontor"
                                onSubmit={this.onSubmit}
                                onTypeAheadBlur={this.onTypeAheadBlur}
                            />
                        ) : (
                            <LeggtilKnapp
                                onClick={this.onAddClick}
                                className="leggtil--sokekriterier--knapp knapp--sokekriterier"
                                id="leggtil-navkontor-knapp"
                                mini
                            >
                                +Legg til NAV-Kontor
                            </LeggtilKnapp>
                        )}
                    </div>

                    <div className="Merkelapp__wrapper">
                        {this.props.navkontor.map((nk) => (
                            <Merkelapp
                                onRemove={this.onRemoveClick}
                                key={nk}
                                value={nk}
                            >
                                {nk}
                            </Merkelapp>
                        ))}
                    </div>
                    {this.props.showMineKandidater ? (
                        <Checkbox
                            className="checkbox--minekandidater skjemaelement--pink"
                            id="minekandidater-checkbox"
                            label="Vis bare mine brukere"
                            key="minekandidater"
                            value={this.props.minekandidater}
                            checked={this.props.minekandidater}
                            onChange={this.onToggleMineKandidater}
                        />
                    ) : null
                    }
                </div>
                {this.props.totaltAntallTreff <= 10 && this.props.visAlertFaKandidater === ALERTTYPE.NAVKONTOR && (
                    <AlertStripeInfo totaltAntallTreff={this.props.totaltAntallTreff} />
                )}
            </SokekriteriePanel>
        );
    }
}

NavkontorSearch.defaultProps = {
    showMineKandidater: false
};

NavkontorSearch.propTypes = {
    search: PropTypes.func.isRequired,
    removeNavkontor: PropTypes.func.isRequired,
    fetchTypeAheadSuggestions: PropTypes.func.isRequired,
    selectTypeAheadValue: PropTypes.func.isRequired,
    clearTypeAheadNavkontor: PropTypes.func.isRequired,
    typeAheadSuggestionsNavkontor: PropTypes.arrayOf(PropTypes.string).isRequired,
    navkontor: PropTypes.arrayOf(PropTypes.string).isRequired,
    totaltAntallTreff: PropTypes.number.isRequired,
    visAlertFaKandidater: PropTypes.string.isRequired,
    skjulNavkontor: PropTypes.bool.isRequired,
    panelOpen: PropTypes.bool.isRequired,
    togglePanelOpen: PropTypes.func.isRequired,
    minekandidater: PropTypes.bool.isRequired,
    toggleMinekandidater: PropTypes.func.isRequired,
    showMineKandidater: PropTypes.bool
};

export default NavkontorSearch;
