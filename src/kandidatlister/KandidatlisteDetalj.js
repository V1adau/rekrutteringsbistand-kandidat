import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
/** nav komponenter */
import { Container } from 'nav-frontend-grid';
import { Panel } from 'nav-frontend-paneler';
import { Normaltekst, Undertekst, UndertekstBold, Sidetittel } from 'nav-frontend-typografi';
import { Checkbox } from 'nav-frontend-skjema';
import { Knapp } from 'nav-frontend-knapper';
import './kandidatlister.less';
import TilbakeLenke from '../common/TilbakeLenke';

class KandidatlisteDetalj extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            markerAlleChecked: false,
            kandidater: props.kandidater.map((k) => ({ ...k, checked: false }))
        };
    }

    onKandidatCheckboxClicked = (valgtKandidat) => {
        this.setState({
            markerAlleChecked: false,
            kandidater: this.state.kandidater.map((k) => {
                if (k.kandidatnr === valgtKandidat.kandidatnr) {
                    return {
                        ...k,
                        checked: !k.checked
                    };
                }
                return { ...k };
            })
        });
    }

    markerAlleClicked = () => {
        this.setState({
            markerAlleChecked: !this.state.markerAlleChecked,
            kandidater: this.state.kandidater.map((k) => ({ ...k, checked: !this.state.markerAlleChecked }))
        });
    }

    render() {
        const { listeNavn, listeBeskrivelse, oppdragsgiver, stillingsannonse } = this.props;
        const { kandidater, markerAlleChecked } = this.state;
        const ToppRad = () => (
            <Panel className="KandidatPanel KandidatPanel__header">
                <Checkbox label="Navn" checked={markerAlleChecked} onChange={this.markerAlleClicked} />
                <UndertekstBold >Arbeidserfaring</UndertekstBold>
            </Panel>
        );

        const KandidatListe = () => (
            kandidater.map((kandidat) => (
                <Panel className="KandidatPanel" key={JSON.stringify(kandidat)}>
                    <Checkbox label={kandidat.kandidatnr} checked={kandidat.checked} onChange={() => this.onKandidatCheckboxClicked(kandidat)} />
                    <Undertekst >{kandidat.arbeidsErfaring}</Undertekst>
                    <Knapp>CV</Knapp>
                </Panel>
            ))
        );

        const ToppMeny = () => (
            <div className="KandidatlisteDetalj__toppmeny--bakgrunn">
                <Container className="KandidatlisteDetalj__toppmeny--innhold">
                    <TilbakeLenke tekst="Til kandidatlistene" href="/pam-kandidatsok/lister" />
                    <Sidetittel>{listeNavn}</Sidetittel>
                    <Undertekst className="undertittel">{listeBeskrivelse}</Undertekst>
                    <div className="KandidatlisteDetalj__toppmeny--inforad">
                        <Normaltekst>{kandidater.length} kandidater</Normaltekst>
                        <Normaltekst>Oppdragsgiver: <Link to="/">{oppdragsgiver}</Link></Normaltekst>
                        <Normaltekst>Stillingsannonse: <Link to="/">{stillingsannonse}</Link></Normaltekst>
                    </div>
                </Container>
            </div>
        );

        const Knapper = () => (
            <div className="KandidatlisteDetalj__knapper-rad">
                <Knapp type="standard" mini>Skriv ut</Knapp>
                <Knapp type="standard" mini>Slett</Knapp>
            </div>
        );

        return (
            <div>
                <ToppMeny />
                <Container className="KandidatlisteDetalj__container">
                    <Knapper />
                    <ToppRad />
                    <KandidatListe />
                </Container>
            </div>
        );
    }
}

KandidatlisteDetalj.defaultProps = {
    listeNavn: 'Testliste',
    listeBeskrivelse: 'En testliste som er til test. Kun til test.',
    oppdragsgiver: 'Test AS',
    stillingsannonse: 'TestKokk søkes',
    kandidater: [
        { lagtTilAv: 'meg', kandidatnr: '1234', arbeidsErfaring: 'Mye rart' },
        { lagtTilAv: 'deg', kandidatnr: '1235', arbeidsErfaring: 'Kokk' }
    ]
};

KandidatlisteDetalj.propTypes = {
    listeNavn: PropTypes.string.isRequired,
    listeBeskrivelse: PropTypes.string.isRequired,
    oppdragsgiver: PropTypes.string.isRequired,
    stillingsannonse: PropTypes.string.isRequired,
    kandidater: PropTypes.arrayOf(
        PropTypes.shape({
            lagtTilAv: PropTypes.string,
            kandidatnr: PropTypes.string,
            arbeidsErfaring: PropTypes.string
        })
    )
};

const mapStateToProps = () => ({ listeId: '123456' });

export default connect(mapStateToProps)(KandidatlisteDetalj);
