import React from 'react';
import PropTypes from 'prop-types';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import { SkjemaGruppe, Checkbox } from 'nav-frontend-skjema';
import { Knapp } from 'nav-frontend-knapper';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import Typeahead from '../../../arbeidsgiver/common/typeahead/Typeahead';
import AlertStripeInfo from '../../../felles/common/AlertStripeInfo';
import { ALERTTYPE } from '../../../felles/konstanter';
import './Arbeidserfaring.less';

class ArbeidserfaringSearch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showTypeAhead: false,
            typeAheadValue: ''
        };
        this.erfaringer = [{ label: 'Under 1 år', value: '0-11' }, { label: '1-3 år', value: '12-47' },
            { label: '4-9 år', value: '48-119' }, { label: 'Over 10 år', value: '120-' }];
    }

    onTotalErfaringChange = (e) => {
        if (e.target.checked) {
            this.props.checkTotalErfaring(e.target.value);
        } else {
            this.props.uncheckTotalErfaring(e.target.value);
        }
        this.props.search();
    };

    onTypeAheadArbeidserfaringChange = (value) => {
        this.props.fetchTypeAheadSuggestions(value);
        this.setState({
            typeAheadValue: value
        });
    };

    onTypeAheadArbeidserfaringSelect = (value) => {
        if (value !== '') {
            this.props.selectTypeAheadValue(value);
            this.props.clearTypeAheadArbeidserfaring();
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
        this.props.removeArbeidserfaring(e.target.value);
        this.props.search();
    };

    onTypeAheadBlur = () => {
        this.setState({
            typeAheadValue: '',
            showTypeAhead: false
        });
        this.props.clearTypeAheadArbeidserfaring();
    };

    onSubmit = (e) => {
        e.preventDefault();
        this.onTypeAheadArbeidserfaringSelect(this.state.typeAheadValue);
        this.typeAhead.input.focus();
    };

    render() {
        if (this.props.skjulArbeidserfaring) {
            return null;
        }
        return (
            <Ekspanderbartpanel
                className="panel--sokekriterier"
                tittel="Arbeidserfaring"
                tittelProps="undertittel"
                onClick={this.props.togglePanelOpen}
                apen={this.props.panelOpen}
            >
                <Element>
                    Hvilken arbeidserfaring skal kandidaten ha?
                </Element>
                <Normaltekst className="text--italic">
                    For eksempel barnehagelærer
                </Normaltekst>
                <div className="sokekriterier--kriterier">
                    <div>
                        {this.state.showTypeAhead ? (
                            <Typeahead
                                ref={(typeAhead) => {
                                    this.typeAhead = typeAhead;
                                }}
                                onSelect={this.onTypeAheadArbeidserfaringSelect}
                                onChange={this.onTypeAheadArbeidserfaringChange}
                                label=""
                                name="arbeidserfaring"
                                placeholder="Skriv inn arbeidserfaring"
                                suggestions={this.props.typeAheadSuggestionsArbeidserfaring}
                                value={this.state.typeAheadValue}
                                id="typeahead-arbeidserfaring"
                                onSubmit={this.onSubmit}
                                onTypeAheadBlur={this.onTypeAheadBlur}
                            />
                        ) : (
                            <Knapp
                                onClick={this.onLeggTilClick}
                                className="leggtil--sokekriterier--knapp knapp--sokekriterier"
                                id="leggtil-arbeidserfaring-knapp"
                                mini
                            >
                                +Legg til arbeidserfaring
                            </Knapp>
                        )}
                    </div>
                    {this.props.arbeidserfaringer.map((arbeidserfaring) => (
                        <button
                            onClick={this.onFjernClick}
                            className="etikett--sokekriterier kryssicon--sokekriterier"
                            key={arbeidserfaring}
                            value={arbeidserfaring}
                        >
                            {arbeidserfaring}
                        </button>
                    ))}
                </div>
                <div className="sokekriterier--margin-top-extra-large">
                    <SkjemaGruppe title="Totalt antall år med arbeidserfaring - velg en eller flere">
                        <div className="sokekriterier--kriterier">
                            {this.erfaringer.map((arbeidserfaring) => (
                                <Checkbox
                                    id={`arbeidserfaring-${arbeidserfaring.value.toLowerCase()}-checkbox`}
                                    label={arbeidserfaring.label}
                                    key={arbeidserfaring.value}
                                    value={arbeidserfaring.value}
                                    checked={this.props.totalErfaring.includes(arbeidserfaring.value)}
                                    onChange={this.onTotalErfaringChange}
                                />
                            ))}
                        </div>
                    </SkjemaGruppe>
                </div>
                {this.props.totaltAntallTreff <= 10 && this.props.visAlertFaKandidater === ALERTTYPE.ARBEIDSERFARING && (
                    <AlertStripeInfo totaltAntallTreff={this.props.totaltAntallTreff} />
                )}
            </Ekspanderbartpanel>
        );
    }
}

ArbeidserfaringSearch.propTypes = {
    search: PropTypes.func.isRequired,
    removeArbeidserfaring: PropTypes.func.isRequired,
    fetchTypeAheadSuggestions: PropTypes.func.isRequired,
    selectTypeAheadValue: PropTypes.func.isRequired,
    checkTotalErfaring: PropTypes.func.isRequired,
    uncheckTotalErfaring: PropTypes.func.isRequired,
    arbeidserfaringer: PropTypes.arrayOf(PropTypes.string).isRequired,
    typeAheadSuggestionsArbeidserfaring: PropTypes.arrayOf(PropTypes.string).isRequired,
    totalErfaring: PropTypes.arrayOf(PropTypes.string).isRequired,
    clearTypeAheadArbeidserfaring: PropTypes.func.isRequired,
    totaltAntallTreff: PropTypes.number.isRequired,
    visAlertFaKandidater: PropTypes.string.isRequired,
    skjulArbeidserfaring: PropTypes.bool.isRequired,
    panelOpen: PropTypes.bool.isRequired,
    togglePanelOpen: PropTypes.func.isRequired
};

export default ArbeidserfaringSearch;
