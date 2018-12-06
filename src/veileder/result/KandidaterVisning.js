/* eslint-disable react/no-did-update-set-state */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Undertittel } from 'nav-frontend-typografi';
import { Row } from 'nav-frontend-grid';
import cvPropTypes from '../../felles/PropTypes';
import KandidaterTabell from './KandidaterTabell';
import './Resultat.less';
import { HENT_KANDIDATLISTE, LEGG_TIL_KANDIDATER } from '../kandidatlister/kandidatlisteReducer';
import { KANDIDATLISTE_CHUNK_SIZE, LAGRE_STATUS } from '../../felles/konstanter';
import KnappMedHjelpetekst from '../../felles/common/KnappMedHjelpetekst';
import { LAST_FLERE_KANDIDATER, MARKER_KANDIDATER, OPPDATER_ANTALL_KANDIDATER } from '../sok/searchReducer';
import LagreKandidaterTilStillingModal from '../../veileder/result/LagreKandidaterTilStillingModal';

const antallKandidaterMarkert = (kandidater) => (
    kandidater.filter((k) => (k.markert)).length
);

const lagreKandidaterTilStillingKnappTekst = (antall) => {
    if (antall === 0) {
        return 'Lagre kandidater til stilling';
    } else if (antall === 1) {
        return 'Lagre 1 kandidat til stilling';
    }
    return `Lagre ${antall} kandidater til stilling`;
};

const markereKandidat = (kandidatnr, checked) => (k) => {
    if (k.arenaKandidatnr === kandidatnr) {
        return { ...k, markert: checked };
    }

    return k;
};

class KandidaterVisning extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            alleKandidaterMarkert: props.kandidater.filter((k, i) => i < props.antallKandidater && k.markert).length === Math.min(props.antallKandidater, props.kandidater.length),
            lagreKandidaterModalTilStillingVises: false,
            kandidater: props.kandidater,
            kandidatlisteId: undefined
        };
    }

    componentDidMount() {
        if (this.props.stillingsId) {
            this.props.hentKandidatliste(this.props.stillingsId);
        }
        setTimeout(() => {
            window.scrollTo(0, this.props.scrolletFraToppen);
        }, 10);
    }

    componentDidUpdate(prevProps) {
        const harNyeSokekriterier = (this.props.searchQueryHash !== prevProps.searchQueryHash);
        if (harNyeSokekriterier) {
            this.setState({
                kandidater: this.props.kandidater,
                alleKandidaterMarkert: false
            });
        } else if (!harNyeSokekriterier && this.props.kandidater > prevProps.kandidater) {
            this.setState({
                kandidater: this.props.kandidater
            });
        } else if (prevProps.kandidater !== this.props.kandidater) {
            this.setState({
                kandidater: this.props.kandidater
            });
        }
        if (prevProps.kandidatliste !== this.props.kandidatliste) {
            this.setState({
                kandidatlisteId: this.props.kandidatliste.kandidatlisteId
            });
        }
        if (prevProps.leggTilKandidatStatus !== this.props.leggTilKandidatStatus && this.props.leggTilKandidatStatus === LAGRE_STATUS.SUCCESS) {
            this.setState({ lagreKandidaterModalTilStillingVises: false });
            this.toggleMarkeringAlleKandidater(false);
        }
    }

    onKandidatValgt = (checked, kandidatnr) => {
        this.props.oppdaterMarkerteKandidater(this.state.kandidater.map(markereKandidat(kandidatnr, checked)));
        this.setState({
            alleKandidaterMarkert: false
        });
    };

    onFlereResultaterClick = () => {
        if (this.props.isSearching) {
            return;
        }
        const nyttAntall = Math.min(this.props.antallKandidater + KANDIDATLISTE_CHUNK_SIZE, this.props.totaltAntallTreff);
        if (nyttAntall > this.props.kandidater.length) {
            this.props.lastFlereKandidater();
        }

        if (nyttAntall !== this.props.antallKandidater) {
            this.props.oppdaterAntallKandidater(nyttAntall);
        }
    };

    onLagreKandidatlister = (kandidatlisteIder) => {
        this.props.leggTilKandidaterIKandidatliste(kandidatlisteIder, this.state.kandidater
            .filter((kandidat) => (kandidat.markert))
            .map((kandidat) => ({
                kandidatnr: kandidat.arenaKandidatnr,
                sisteArbeidserfaring: kandidat.mestRelevanteYrkeserfaring ? kandidat.mestRelevanteYrkeserfaring.styrkKodeStillingstittel : ''
            }))
        );
    };

    onToggleMarkeringAlleKandidater = () => {
        const checked = !this.state.alleKandidaterMarkert;
        this.toggleMarkeringAlleKandidater(checked);
    };

    toggleMarkeringAlleKandidater = (checked) => {
        const kandidaterMedMarkering = this.state.kandidater.map((k, i) => {
            if (i < this.props.antallKandidater) {
                return { ...k, markert: checked };
            }
            return k;
        });

        this.setState({
            alleKandidaterMarkert: checked
        });

        this.props.oppdaterMarkerteKandidater(kandidaterMedMarkering);
    };

    toggleLagreKandidaterTilStillingModal = () => {
        this.setState({
            lagreKandidaterModalTilStillingVises: !this.state.lagreKandidaterModalTilStillingVises
        });
    };

    render() {
        const panelTekst = this.props.isEmptyQuery ? ' kandidater' : ' treff på aktuelle kandidater';
        const antallMarkert = antallKandidaterMarkert(this.state.kandidater);

        return (
            <div>
                {this.state.lagreKandidaterModalTilStillingVises &&
                <LagreKandidaterTilStillingModal
                    vis={this.state.lagreKandidaterModalTilStillingVises}
                    onRequestClose={this.toggleLagreKandidaterTilStillingModal}
                    onLagre={this.onLagreKandidatlister}
                    antallMarkerteKandidater={antallMarkert}
                    kandidatlisteId={this.state.kandidatlisteId}
                    stillingsoverskrift={this.props.stillingsoverskrift}
                />
                }
                <Row className="resultatvisning">
                    <div className="resultatvisning--header">
                        <Undertittel className="text--left inline"><strong id="antall-kandidater-treff">{this.props.totaltAntallTreff}</strong>{panelTekst}</Undertittel>
                        <KnappMedHjelpetekst
                            hjelpetekst="Du må huke av for kandidatene du ønsker å lagre."
                            mini
                            type="hoved"
                            disabled={antallMarkert === 0}
                            onClick={this.toggleLagreKandidaterTilStillingModal}
                            id="lagre-kandidater-knapp"
                        >
                            {lagreKandidaterTilStillingKnappTekst(antallMarkert)}
                        </KnappMedHjelpetekst>
                    </div>
                </Row>
                <KandidaterTabell
                    antallResultater={this.props.antallKandidater}
                    kandidater={this.state.kandidater}
                    onFlereResultaterClick={this.onFlereResultaterClick}
                    totaltAntallTreff={this.props.totaltAntallTreff}
                    onKandidatValgt={this.onKandidatValgt}
                    alleKandidaterMarkert={this.state.alleKandidaterMarkert}
                    onToggleMarkeringAlleKandidater={this.onToggleMarkeringAlleKandidater}
                    valgtKandidatNr={this.props.valgtKandidatNr}
                    stillingsId={this.props.stillingsId}
                />
            </div>
        );
    }
}

KandidaterVisning.defaultProps = {
    stillingsId: undefined,
    kandidatliste: {
        kandidatlisteId: undefined
    },
    stillingsoverskrift: undefined
};

KandidaterVisning.propTypes = {
    kandidater: PropTypes.arrayOf(cvPropTypes).isRequired,
    totaltAntallTreff: PropTypes.number.isRequired,
    isEmptyQuery: PropTypes.bool.isRequired,
    isSearching: PropTypes.bool.isRequired,
    lastFlereKandidater: PropTypes.func.isRequired,
    leggTilKandidatStatus: PropTypes.string.isRequired,
    searchQueryHash: PropTypes.string.isRequired,
    antallKandidater: PropTypes.number.isRequired,
    valgtKandidatNr: PropTypes.string.isRequired,
    scrolletFraToppen: PropTypes.number.isRequired,
    oppdaterAntallKandidater: PropTypes.func.isRequired,
    oppdaterMarkerteKandidater: PropTypes.func.isRequired,
    leggTilKandidaterIKandidatliste: PropTypes.func.isRequired,
    stillingsId: PropTypes.string,
    hentKandidatliste: PropTypes.func.isRequired,
    kandidatliste: PropTypes.shape({
        kandidatlisteId: PropTypes.string
    }),
    stillingsoverskrift: PropTypes.string
};

const mapDispatchToProps = (dispatch) => ({
    leggTilKandidaterIKandidatliste: (kandidatlisteIder, kandidater) => { dispatch({ type: LEGG_TIL_KANDIDATER, kandidatlisteIder, kandidater }); },
    lastFlereKandidater: () => { dispatch({ type: LAST_FLERE_KANDIDATER }); },
    oppdaterAntallKandidater: (antallKandidater) => { dispatch({ type: OPPDATER_ANTALL_KANDIDATER, antall: antallKandidater }); },
    oppdaterMarkerteKandidater: (markerteKandidater) => { dispatch({ type: MARKER_KANDIDATER, kandidater: markerteKandidater }); },
    hentKandidatliste: (stillingsId) => { dispatch({ type: HENT_KANDIDATLISTE, stillingsnummer: stillingsId }); }
});

const mapStateToProps = (state) => ({
    kandidater: state.search.searchResultat.resultat.kandidater,
    totaltAntallTreff: state.search.searchResultat.resultat.totaltAntallTreff,
    isEmptyQuery: state.search.isEmptyQuery,
    isSearching: state.search.isSearching,
    leggTilKandidatStatus: state.kandidatlister.leggTilKandidater.lagreStatus,
    searchQueryHash: state.search.searchQueryHash,
    antallKandidater: state.search.antallVisteKandidater,
    valgtKandidatNr: state.search.valgtKandidatNr,
    scrolletFraToppen: state.search.scrolletFraToppen,
    kandidatliste: state.kandidatlister.detaljer.kandidatliste,
    stillingsoverskrift: state.search.stillingsoverskrift
});

export default connect(mapStateToProps, mapDispatchToProps)(KandidaterVisning);
