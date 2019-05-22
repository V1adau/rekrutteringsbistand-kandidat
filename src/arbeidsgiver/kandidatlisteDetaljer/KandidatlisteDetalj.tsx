import * as React from 'react';
import { FunctionComponent, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Media from 'react-media';
import { Checkbox } from 'nav-frontend-skjema';
import { Container } from 'nav-frontend-grid';
import Modal from 'nav-frontend-modal';
import { Normaltekst, Undertekst, UndertekstBold, Undertittel } from 'nav-frontend-typografi';
import { HjelpetekstMidt } from 'nav-frontend-hjelpetekst';
import NavFrontendChevron from 'nav-frontend-chevron';
import { Knapp } from 'pam-frontend-knapper';
import { Panel } from 'nav-frontend-paneler';
import TilbakeLenke from '../common/TilbakeLenke.js';
import SlettKandidaterModal from './SlettKandidaterModal';
import Lenkeknapp from '../../felles/common/Lenkeknapp.js';
import { FadingAlertStripe } from '../../felles/common/HjelpetekstFading';
import PageHeader from '../../felles/common/PageHeaderWrapper.js';
import Notater from './Notater';
import { capitalizeFirstLetter } from '../../felles/sok/utils';
import { RemoteData, RemoteDataTypes } from '../../felles/common/remoteData';
import { useTimeoutState } from '../../felles/common/hooks/useTimeoutState';
import { CONTEXT_ROOT } from '../common/fasitProperties';
import Sidetittel from '../../felles/common/Sidetittel';
import {
    Kandidat,
    KandidatlisteDetaljer,
    KandidatlisteTypes,
    KandidatState,
    UpdateKandidatIListeStateTypes
} from './kandidatlisteReducer';

import '../common/TomListe.less';
import '../../felles/common/ikoner/ikoner.less';
import '../kandidatlister/kandidatlister.less';

const fornavnOgEtternavnFraKandidat = (kandidat) => (kandidat.fornavn && kandidat.etternavn
    ? `${capitalizeFirstLetter(kandidat.fornavn)} ${capitalizeFirstLetter(kandidat.etternavn)}`
    : kandidat.kandidatnr);

interface HeaderProps {
    tittel: string,
    beskrivelse?: string,
    oppdragsgiver?: string,
    antallKandidater: number
}

const Header: FunctionComponent<HeaderProps> = ({ beskrivelse = '', antallKandidater, oppdragsgiver, tittel }) => (
    <PageHeader>
        <div className="KandidatlisteDetalj__header">
            <div className="top-row">
                <div className="TilbakeLenke-wrapper">
                    <TilbakeLenke tekst="Til&nbsp;kandidatlistene" href={`/${CONTEXT_ROOT}/lister`} />
                </div>
                <div className="info-kolonne">
                    <Sidetittel id="kandidatliste-navn" className="tittel">{tittel}</Sidetittel>
                    {beskrivelse && <Undertekst id="kandidatliste-beskrivelse" className="undertittel">{beskrivelse}</Undertekst>}
                </div>
                <div className="empty-right-side" />
            </div>
            <div className="bottom-row">
                <div className="inforad">
                    <Normaltekst id="kandidatliste-antall-kandidater">{antallKandidater !== 1 ? `${antallKandidater} kandidater` : '1 kandidat'}</Normaltekst>
                    {oppdragsgiver && <Normaltekst id="kandidatliste-oppdragsgiver">Oppdragsgiver: {oppdragsgiver}</Normaltekst>}
                </div>
            </div>
        </div>
    </PageHeader>
);

const erSynligFlaggIkkeSatt = (kandidat: Kandidat) => kandidat.erSynlig === undefined || kandidat.erSynlig === null;


interface KandidatListeProps {
    kandidatliste: KandidatlisteDetaljer,
    toggleKandidatChecked: (kandidatnr: string) => void,
    setViewStateKandidat: (kandidatnr: string, state: KandidatState) => void,
    onFjernKandidat: (kandidat: Kandidat) => void,
    setFailureMelding: (innhold: string) => void
    visNotater: boolean
}

const KandidatListe: FunctionComponent<KandidatListeProps> = ({ kandidatliste, toggleKandidatChecked, setViewStateKandidat, onFjernKandidat, setFailureMelding, visNotater }) => (
    <div className="tbody">
        {kandidatliste.kandidater && kandidatliste.kandidater.map((kandidat) => {
            if (erSynligFlaggIkkeSatt(kandidat) || kandidat.erSynlig) {
                return (
                    <SynligKandidatPanel
                        kandidat={kandidat}
                        key={`${kandidat.kandidatnr}-synlig`}
                        kandidatliste={kandidatliste}
                        toggleKandidatChecked={toggleKandidatChecked}
                        setViewStateKandidat={setViewStateKandidat}
                        setFailureMelding={setFailureMelding}
                        visNotater={visNotater}
                    />
                );
            }
            return <IkkeSynligKandidatPanel kandidat={kandidat} key={`${kandidat.kandidatnr}-ikke`} onFjernKandidat={onFjernKandidat} />;
        })}
    </div>
);

interface SynligKandidatPanelProps {
    kandidatliste: KandidatlisteDetaljer,
    kandidat: Kandidat,
    toggleKandidatChecked: (kandidatnr: string) => void,
    setViewStateKandidat: (kandidatnr: string, state: KandidatState) => void,
    setFailureMelding: (innhold: string) => void
    visNotater: boolean
}

const SynligKandidatPanel: FunctionComponent<SynligKandidatPanelProps> = ({ kandidat, kandidatliste, toggleKandidatChecked, setViewStateKandidat, setFailureMelding, visNotater }) => (
    <div className="tr">
        <div className="KandidatlisteDetalj__panel">
            <div className="KandidatlisteDetalj__panel--first td">
                <div className="skjemaelement skjemaelement--horisontal text-hide skjemaelement--pink">
                    <input
                        type="checkbox"
                        title="Marker"
                        id={`marker-kandidat-checkbox-${kandidat.kandidatnr}`}
                        className="skjemaelement__input checkboks"
                        aria-label={`Marker kandidat ${fornavnOgEtternavnFraKandidat(kandidat)}`}
                        checked={kandidat.checked}
                        onChange={() => toggleKandidatChecked(kandidat.kandidatnr)}
                    />
                    <label
                        className="skjemaelement__label"
                        htmlFor={`marker-kandidat-checkbox-${kandidat.kandidatnr}`}
                        aria-hidden="true"
                    >
                        .
                    </label>
                </div>
                <Link title="Vis profil" className="link" to={`/${CONTEXT_ROOT}/lister/detaljer/${kandidatliste.kandidatlisteId}/cv/${kandidat.kandidatnr}`}>
                    {fornavnOgEtternavnFraKandidat(kandidat)}
                </Link>
            </div>
            <Normaltekst className="KandidatlisteDetalj__panel--second arbeidserfaring">{kandidat.sisteArbeidserfaring}</Normaltekst>
            {visNotater &&
            <div className="KandidatlisteDetalj__panel--notater">
                <Lenkeknapp
                    onClick={() => {
                        setViewStateKandidat(
                            kandidat.kandidatnr,
                            kandidat.viewState === KandidatState.NOTATER_VISES ? KandidatState.LUKKET : KandidatState.NOTATER_VISES
                        );
                    }}
                    className="legg-til-kandidat Notat"
                >
                    <i className="Notat__icon" />
                    {kandidat.antallNotater}
                    <NavFrontendChevron type={kandidat.viewState === KandidatState.NOTATER_VISES ? 'opp' : 'ned'} />
                </Lenkeknapp>
            </div>
            }
        </div>

        <div className="KandidatlisteDetalj__panel">
            <Media query="(min-width: 769px)">
                <div className="KandidatlisteDetalj__panel--first td" />
            </Media>
            <div className="KandidatlisteDetalj__panel--second td">
                { kandidat.viewState === KandidatState.NOTATER_VISES &&
                <Notater
                    notater={kandidat.notater}
                    kandidatlisteId={kandidatliste.kandidatlisteId}
                    kandidatnr={kandidat.kandidatnr}
                    antallNotater={kandidat.notater.notater.kind === RemoteDataTypes.SUCCESS ? kandidat.notater.notater.data.length : kandidat.antallNotater}
                    setFailureMelding={setFailureMelding}
                />
                }
            </div>
            <Media query="(min-width: 769px)">
                <div className="KandidatlisteDetalj__panel--notater" />
            </Media>
        </div>
    </div>
);

interface IkkeSynligKandidatPanelProps {
    kandidat: Kandidat,
    onFjernKandidat: (kandidat: Kandidat) => void
}

const IkkeSynligKandidatPanel: FunctionComponent<IkkeSynligKandidatPanelProps> = ({ kandidat, onFjernKandidat }) => (
    <div className="KandidatlisteDetalj__panel__ikke_synlig tr">
        <div className="KandidatlisteDetalj__panel--first td" >
            <div className="text-hide">
                <input
                    type="checkbox"
                    id={`marker-kandidat-checkbox-disabled-${kandidat.kandidatnr}`}
                    className="skjemaelement__input checkboks"
                    aria-label="Kandidat ikke synlig"
                    disabled
                />
                <label
                    className="skjemaelement__label"
                    htmlFor={`marker-kandidat-checkbox-disabled-${kandidat.kandidatnr}`}
                    aria-hidden="true"
                >
                    .
                </label>
            </div>
            <Normaltekst>
                Kandidaten er inaktiv og ikke aktuell for jobb
            </Normaltekst>
        </div>
        <Knapp
            className="knapp--fjern-kandidat"
            mini
            onClick={() => onFjernKandidat(kandidat)}
        >
            Fjern kandidat
        </Knapp>
    </div>
);

const DisabledSlettKnapp = () => (
    <div className="Lenkeknapp typo-normal Delete" aria-label="Knapp for sletting av markerte kandidater fra listen">
        Slett
        <i className="Delete__icon" />
    </div>
);

const Knapper: FunctionComponent<{ valgteKandidater: Array<Kandidat>, visSlettKandidaterModal: () => void }> = ({ valgteKandidater, visSlettKandidaterModal }) => {
    if (valgteKandidater.length > 0) {
        return (
            <div className="KandidatlisteDetalj__knapperad">
                <div className="KandidatlisteDetalj__knapperad--slett" aria-label="Knapp for sletting av markerte kandidater fra listen">
                    <Lenkeknapp onClick={visSlettKandidaterModal} className="Delete">
                        Slett
                        <i className="Delete__icon" />
                    </Lenkeknapp>
                </div>
            </div>
        );
    }
    return (
        <div className="KandidatlisteDetalj__knapperad">
            <div className="KandidatlisteDetalj__knapperad--slett">
                <HjelpetekstMidt
                    id="marker-kandidater-hjelpetekst"
                    anchor={DisabledSlettKnapp}
                    tittel="Slett markerte kandidater"
                >
                    Du må huke av for kandidatene du ønsker å slette
                </HjelpetekstMidt>
            </div>
        </div>
    );
};

const KandidatListeToppRad: FunctionComponent<{ allChecked: boolean, markerAlleClicked: (boolean) => void, visNotater: boolean }> = ({ allChecked, markerAlleClicked, visNotater }) => (
    <div className="thead">
        <div className="KandidatlisteDetalj__panel KandidatlisteDetalj__panel--header th">
            <div className="KandidatlisteDetalj__panel--first td">
                <Checkbox
                    className="skjemaelement--pink"
                    id="marker-alle-kandidater-checkbox"
                    title="Marker alle"
                    label="Navn"
                    aria-label="Marker alle kandidater"
                    checked={allChecked}
                    onChange={() => { markerAlleClicked(!allChecked); }}
                />
            </div>
            <UndertekstBold className="KandidatlisteDetalj__panel--second arbeidserfaring td">Arbeidserfaring</UndertekstBold>
            {visNotater &&
            <UndertekstBold className="KandidatlisteDetalj__panel--notater td">Notater</UndertekstBold>
            }
        </div>
    </div>
);

interface KandidatlisteDetaljProps {
    kandidatliste: KandidatlisteDetaljer,
    sletteStatus: RemoteData<{ antallKandidaterSlettet: number }>,
    slettKandidater: (kandidater: Array<{ kandidatnr: string }>) => void,
    clearKandidatliste: () => void,
    nullstillSletteStatus: () => void,
    toggleKandidatChecked: (kandidatnr: string) => void,
    setViewStateKandidat: (kandidatnr: string, state: KandidatState) => void
    markerAlleClicked: (checked: boolean) => void
    visNotater: boolean
}

const KandidatlisteDetalj: FunctionComponent<KandidatlisteDetaljProps> = (
    {
        kandidatliste,
        sletteStatus,
        slettKandidater,
        clearKandidatliste,
        nullstillSletteStatus,
        toggleKandidatChecked,
        setViewStateKandidat,
        markerAlleClicked,
        visNotater
    }
) => {
    const [alertStripeState, clearAlertstripeState, setSuccessMelding, setFailureMelding] = useTimeoutState();
    const [sletteModalFailureAlertStripeState, clearModalState, , setSletteModalFailureMelding] = useTimeoutState();
    const [sletteModalOpen, setSletteModalOpen] = useState<boolean>(false);
    useEffect(() => {
        if (sletteStatus.kind === RemoteDataTypes.SUCCESS) {
            const successMelding = sletteStatus.data.antallKandidaterSlettet > 1 ? `${sletteStatus.data.antallKandidaterSlettet} kandidater er slettet` : 'Kandidaten er slettet';
            setSuccessMelding(successMelding);
            nullstillSletteStatus();
            if (sletteModalOpen) {
                setSletteModalOpen(false);
            }
        } else if (sletteStatus.kind === RemoteDataTypes.FAILURE) {
            setSletteModalFailureMelding('Noe gikk galt under sletting av kandidatene');
            nullstillSletteStatus()
        }
    }, [sletteStatus]);

    useEffect(() => {
        return () => {
            clearAlertstripeState();
            clearModalState();
            clearKandidatliste();
        }
    }, []);

    const { tittel, beskrivelse, oppdragsgiver, kandidater } = kandidatliste;
    const valgteKandidater = kandidater.filter((k) => k.checked);
    const onSlettKandidaterClick = () => {
        slettKandidater(kandidater.filter((k) => k.checked));
    };

    return (
        <div id="KandidaterDetalj">
            <Header
                tittel={tittel}
                beskrivelse={beskrivelse}
                oppdragsgiver={oppdragsgiver}
                antallKandidater={kandidater.length}
            />
            <FadingAlertStripe alertStripeState={alertStripeState} />
            {kandidater.length > 0 ? (
                <div className="KandidatlisteDetalj__container Kandidatlister__container-width-l">
                    <Knapper
                        valgteKandidater={valgteKandidater}
                        visSlettKandidaterModal={() => setSletteModalOpen(true)}
                    />
                    <div className="table">
                        <KandidatListeToppRad
                            allChecked={kandidatliste.allChecked}
                            markerAlleClicked={markerAlleClicked}
                            visNotater={visNotater}
                        />
                        <KandidatListe
                            kandidatliste={kandidatliste}
                            toggleKandidatChecked={toggleKandidatChecked}
                            setViewStateKandidat={setViewStateKandidat}
                            onFjernKandidat={(kandidat) => {
                                slettKandidater([kandidat]);
                            }}
                            setFailureMelding={setFailureMelding}
                            visNotater={visNotater}
                        />
                    </div>
                </div>
            ) : (
                <Container className="Kandidatlister__container Kandidatlister__container-width">
                    <Panel className="TomListe">
                        <Undertittel>Du har ingen kandidater i kandidatlisten</Undertittel>
                        <Link className="link" to={`/${CONTEXT_ROOT}`}>Finn kandidater</Link>
                    </Panel>
                </Container>
            )}
            <SlettKandidaterModal
                isOpen={sletteModalOpen}
                sletterKandidater={sletteStatus.kind === RemoteDataTypes.LOADING}
                lukkModal={() => {
                    setSletteModalOpen(false);
                    clearModalState();
                }}
                alertState={sletteModalFailureAlertStripeState}
                valgteKandidater={valgteKandidater}
                onDeleteClick={onSlettKandidaterClick}
            />
        </div>
    );
};

const mapStateToProps = (state, props) => ({
    ...props,
    sletteStatus: state.kandidatlisteDetaljer.sletteStatus,
    visNotater: state.search.featureToggles['vis-notater-arbeidsgiver']
});

const mapDispatchToProps = (dispatch, { kandidatliste }) => ({
    slettKandidater: (kandidater) => dispatch({ type: KandidatlisteTypes.SLETT_KANDIDATER, kandidatlisteId: kandidatliste.kandidatlisteId, kandidater }),
    clearKandidatliste: () => dispatch({ type: KandidatlisteTypes.CLEAR_KANDIDATLISTE }),
    nullstillSletteStatus: () => dispatch({ type: KandidatlisteTypes.SLETT_KANDIDATER_RESET_STATUS }),
    toggleKandidatChecked: (kandidatnr) => dispatch({ type: KandidatlisteTypes.UPDATE_KANDIDATLISTE_VIEW_STATE, change: { type: UpdateKandidatIListeStateTypes.KANDIDAT_TOGGLE_CHECKED, kandidatnr } }),
    setViewStateKandidat: (kandidatnr, state) => dispatch({ type: KandidatlisteTypes.UPDATE_KANDIDATLISTE_VIEW_STATE, change: { type: UpdateKandidatIListeStateTypes.KANDIDAT_SET_VIEW_STATE, kandidatnr, state } }),
    markerAlleClicked: (checked) => dispatch({ type: KandidatlisteTypes.UPDATE_KANDIDATLISTE_VIEW_STATE, change: { type: UpdateKandidatIListeStateTypes.SET_ALL_CHECKED, checked } })
});

Modal.setAppElement('#app');

export default connect(mapStateToProps, mapDispatchToProps)(KandidatlisteDetalj);
