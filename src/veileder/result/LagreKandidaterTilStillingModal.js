import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'nav-frontend-modal';
import { Systemtittel, Normaltekst } from 'nav-frontend-typografi';
import { Flatknapp, Hovedknapp } from 'nav-frontend-knapper';

const LagreKandidaterTilStillingModal = (props) => {
    const { vis, onLagre, onRequestClose, stillingsoverskrift, antallMarkerteKandidater, kandidatlisteId } = props;

    const lagreKandidater = () => {
        onLagre([kandidatlisteId]);
    };

    return (
        <Modal
            isOpen={vis}
            onRequestClose={onRequestClose}
            contentLabel="LagreKandidaterModal."
            className="LagreKandidaterTilStillingModal"
            appElement={document.getElementById('app')}
        >
            <div className="LagreKandidaterTilStillingModal--wrapper">
                <Systemtittel className="tittel">{
                    antallMarkerteKandidater > 1
                        ? 'Lagre kandidater'
                        : 'Lagre kandidat'
                }
                </Systemtittel>
                <Normaltekst>{
                    antallMarkerteKandidater > 1
                        ? `Ønsker du å lagre kandidatene i kandidatlisten til stillingen «${stillingsoverskrift}»?`
                        : `Ønsker du å lagre kandidaten i kandidatlisten til stillingen «${stillingsoverskrift}»?`
                }
                </Normaltekst>
                <div>
                    <Hovedknapp className="lagre--knapp" onClick={lagreKandidater}>Lagre</Hovedknapp>
                    <Flatknapp className="avbryt--knapp" onClick={onRequestClose}>Avbryt</Flatknapp>
                </div>
            </div>
        </Modal>
    );
};

LagreKandidaterTilStillingModal.defaultProps = {
    stillingsoverskrift: undefined
};

LagreKandidaterTilStillingModal.propTypes = {
    vis: PropTypes.bool.isRequired,
    onLagre: PropTypes.func.isRequired,
    onRequestClose: PropTypes.func.isRequired,
    stillingsoverskrift: PropTypes.string,
    antallMarkerteKandidater: PropTypes.number.isRequired,
    kandidatlisteId: PropTypes.string.isRequired
};

export default LagreKandidaterTilStillingModal;
