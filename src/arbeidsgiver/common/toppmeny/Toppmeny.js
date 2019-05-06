import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ArbeidsgiverTabId, Header, AuthStatus, ArbeidsgiverSelect } from 'pam-frontend-header';
import { LOGOUT_URL, LOGIN_URL, USE_JANZZ } from '../fasitProperties';
import { RESET_ARBEIDSGIVER, VELG_ARBEIDSGIVER } from '../../arbeidsgiver/arbeidsgiverReducer';
import KandidatsokNextHeader from '../kandidatsokNextHeader/KandidatsokNextHeader.tsx';

export const loggUt = () => {
    sessionStorage.removeItem('orgnr');
    window.location.href = LOGOUT_URL;
};

export const loggInn = () => {
    window.location.href = `${LOGIN_URL}&redirect=${window.location.href}`;
};

const Toppmeny = ({ arbeidsgivere, valgtArbeidsgiverId, velgArbeidsgiver, resetArbeidsgiver, activeTabID }) => {
    const onArbeidsgiverSelect = (orgNummer) => {
        if (orgNummer) {
            velgArbeidsgiver(orgNummer);
        } else {
            resetArbeidsgiver();
        }
    };
    const mappedeArbeidsgivere = arbeidsgivere.map((arbeidsgiver) => ({
        navn: arbeidsgiver.orgnavn,
        orgNummer: arbeidsgiver.orgnr
    }));
    if (USE_JANZZ) {
        return <KandidatsokNextHeader />;
    }
    return (
        <Header
            onLoginClick={loggInn}
            onLogoutClick={loggUt}
            authenticationStatus={AuthStatus.IS_AUTHENTICATED}
            applikasjon={activeTabID}
            useMenu="arbeidsgiver"
            arbeidsgiverSelect={
                <ArbeidsgiverSelect
                    onArbeidsgiverSelect={onArbeidsgiverSelect}
                    arbeidsgivere={mappedeArbeidsgivere}
                    valgtArbeidsgiverId={valgtArbeidsgiverId}
                />
            }
        />
    );
};

Toppmeny.defaultProps = {
    valgtArbeidsgiverId: undefined,
    arbeidsgivere: []
};

Toppmeny.propTypes = {
    arbeidsgivere: PropTypes.arrayOf(PropTypes.shape({
        orgnavn: PropTypes.string,
        orgnr: PropTypes.string
    })),
    valgtArbeidsgiverId: PropTypes.string,
    velgArbeidsgiver: PropTypes.func.isRequired,
    resetArbeidsgiver: PropTypes.func.isRequired,
    activeTabID: PropTypes.string.isRequired
};


const mapStateToProps = (state) => ({
    arbeidsgivere: state.mineArbeidsgivere.arbeidsgivere,
    valgtArbeidsgiverId: state.mineArbeidsgivere.valgtArbeidsgiverId
});

const mapDispatchToProps = (dispatch) => ({
    velgArbeidsgiver: (orgnr) => dispatch({ type: VELG_ARBEIDSGIVER, data: orgnr }),
    resetArbeidsgiver: () => dispatch({ type: RESET_ARBEIDSGIVER })
});

const KandidatsokHeaderComponent = (props) => (
    <Toppmeny {...props} activeTabID={ArbeidsgiverTabId.KANDIDATSOK} />
);

const KandidatlisteHeaderComponent = (props) => (
    <Toppmeny {...props} activeTabID={ArbeidsgiverTabId.KANDIDATLISTER} />
);

export const KandidatsokHeader = connect(mapStateToProps, mapDispatchToProps)(KandidatsokHeaderComponent);

export const KandidatlisteHeader = connect(mapStateToProps, mapDispatchToProps)(KandidatlisteHeaderComponent);
