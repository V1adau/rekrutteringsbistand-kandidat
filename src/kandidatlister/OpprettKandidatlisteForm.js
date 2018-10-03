import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { SkjemaGruppe, Input, Textarea } from 'nav-frontend-skjema';
import { Innholdstittel, Normaltekst } from 'nav-frontend-typografi';
import NavFrontendModal from 'nav-frontend-modal';
import { Flatknapp, Hovedknapp, Knapp } from 'nav-frontend-knapper';
import KnappMedDisabledFunksjon from '../common/KnappMedDisabledFunksjon';

const FELTER = {
    TITTEL: 'TITTEL',
    BESKRIVELSE: 'BESKRIVELSE',
    OPPDRAGSGIVER: 'OPPDRAGSGIVER'
};

const BekreftAvbrytPopup = ({ onCancel, onConfirm }) => (
    <NavFrontendModal
        isOpen
        contentLabel={'Fortsett'}
        onRequestClose={onCancel}
        className="modal--bekreft"
        closeButton={false}
    >
        <Innholdstittel className="blokk-xxs" tag="h1">
            Obs!
        </Innholdstittel>
        <Normaltekst className="blokk">
            Du har ikke lagret endringene dine. Er du sikker på at du vil avbryte?
        </Normaltekst>
        <div className="text-center">
            <Hovedknapp
                onClick={onConfirm}
                id="confirmationPopup--fortsett"
            >
            Fortsett
            </Hovedknapp>
            <Knapp
                onClick={onCancel}
                id="confirmationPopup--avbryt"
            >
            Avbryt
            </Knapp>
        </div>
    </NavFrontendModal>
);

export default class OpprettKandidatlisteForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            kandidatlisteInfo: props.kandidatlisteInfo,
            visValideringsfeilInput: false
        };
    }

    onAvbrytClick = () => {
        if (JSON.stringify(this.state.kandidatlisteInfo) !== JSON.stringify(this.props.kandidatlisteInfo)) {
            this.setState({
                visBekreftAvbrytPopup: true
            });
        } else {
            this.props.onAvbrytClick();
        }
    };

    onAvbrytCancel = () => {
        this.setState({
            visBekreftAvbrytPopup: false
        });
    };

    onUnvalidatedSave = () => {
        if (this.props.onDisabledClick !== undefined) {
            this.props.onDisabledClick();
        }
        this.setState({
            visValideringsfeilInput: true
        });
    };

    validateAndSave = () => {
        if (this.formValidates()) {
            this.props.onSave(this.state.kandidatlisteInfo);
        }
    };

    formValidates = () => (
        this.state.kandidatlisteInfo.tittel !== ''
    );

    updateField = (field, value) => {
        if (this.props.onChange) {
            this.props.onChange();
        }
        if (field === FELTER.TITTEL) {
            this.setState({
                ...this.state,
                kandidatlisteInfo: {
                    ...this.state.kandidatlisteInfo,
                    tittel: value
                },
                visValideringsfeilInput: this.state.visValideringsfeilInput && value === ''
            });
        } else if (field === FELTER.BESKRIVELSE) {
            this.setState({
                ...this.state,
                kandidatlisteInfo: {
                    ...this.state.kandidatlisteInfo,
                    beskrivelse: value
                }
            });
        } else if (field === FELTER.OPPDRAGSGIVER) {
            this.setState({
                ...this.state,
                kandidatlisteInfo: {
                    ...this.state.kandidatlisteInfo,
                    oppdragsgiver: value
                }
            });
        }
    };

    render() {
        const { backLink, saving } = this.props;
        return (
            <SkjemaGruppe>
                {this.state.visBekreftAvbrytPopup && <BekreftAvbrytPopup onCancel={this.onAvbrytCancel} onConfirm={this.props.onAvbrytClick} />}
                <div className="OpprettKandidatlisteForm__input">
                    <Normaltekst>* er obligatoriske felter du må fylle ut</Normaltekst>
                </div>
                <div className="OpprettKandidatlisteForm__input">
                    <Input
                        label="Navn på kandidatliste *"
                        placeholder="For eksempel barnehagelærer, Oslo"
                        value={this.state.kandidatlisteInfo.tittel}
                        onChange={(event) => {
                            this.updateField(FELTER.TITTEL, event.target.value);
                        }}
                        feil={this.state.visValideringsfeilInput ? { feilmelding: 'Navn må være utfylt' } : undefined}
                    />
                </div>
                <div className="OpprettKandidatlisteForm__input">
                    <Textarea
                        textareaClass="OpprettKandidatlisteForm__input__textarea"
                        label="Beskrivelse"
                        placeholder="Skrive noen ord om stillingen du søker kandidater til"
                        value={this.state.kandidatlisteInfo.beskrivelse}
                        onChange={(event) => {
                            this.updateField(FELTER.BESKRIVELSE, event.target.value);
                        }}
                    />
                </div>
                <div className="OpprettKandidatlisteForm__input">
                    <Input
                        label="Oppdragsgiver"
                        placeholder="For eksempel NAV"
                        value={this.state.kandidatlisteInfo.oppdragsgiver}
                        onChange={(event) => {
                            this.updateField(FELTER.OPPDRAGSGIVER, event.target.value);
                        }}
                    />
                </div>
                <KnappMedDisabledFunksjon
                    type="hoved"
                    onClick={this.validateAndSave}
                    onDisabledClick={this.onUnvalidatedSave}
                    disabled={!this.formValidates()}
                    spinner={saving}
                >
                    Lagre
                </KnappMedDisabledFunksjon>
                {this.props.onAvbrytClick !== undefined ?
                    <Flatknapp className="knapp--avbryt" onClick={this.onAvbrytClick}>Avbryt</Flatknapp> :
                    (<div className="OpprettKandidatlisteForm__avbryt-lenke-wrapper">
                        <Link to={backLink} className="lenke">Avbryt</Link>
                    </div>)}
            </SkjemaGruppe>
        );
    }
}

OpprettKandidatlisteForm.defaultProps = {
    saving: false,
    onChange: undefined,
    onAvbrytClick: undefined,
    onDisabledClick: undefined,
    backLink: undefined
};

OpprettKandidatlisteForm.propTypes = {
    onSave: PropTypes.func.isRequired,
    onChange: PropTypes.func,
    onDisabledClick: PropTypes.func,
    backLink: PropTypes.string,
    kandidatlisteInfo: PropTypes.shape({
        tittel: PropTypes.string,
        beskrivelse: PropTypes.string,
        oppdragsgiver: PropTypes.string,
        stillingsId: PropTypes.string
    }).isRequired,
    saving: PropTypes.bool,
    onAvbrytClick: PropTypes.func
};

BekreftAvbrytPopup.propTypes = {
    onConfirm: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
};
