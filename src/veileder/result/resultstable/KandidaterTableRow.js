import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Column, Row } from 'nav-frontend-grid';
import { Normaltekst } from 'nav-frontend-typografi';
import { Checkbox } from 'nav-frontend-skjema';
import { Link } from 'react-router-dom';
import cvPropTypes from '../../../felles/PropTypes';
import './Resultstable.less';
import { SETT_KANDIDATNUMMER } from '../../sok/searchReducer';

class KandidaterTableRow extends React.Component {
    onCheck = (kandidatnr) => {
        this.props.onKandidatValgt(!this.props.markert, kandidatnr);
    };

    onKandidatNrClick = () => {
        this.props.settValgtKandidat(this.props.cv.arenaKandidatnr, window.pageYOffset);
    };

    render() {
        const cv = this.props.cv;
        const kandidatnummer = cv.arenaKandidatnr;
        const navn = 'Etternavn, Fornavn';
        const fodselsdato = '01.01.01';
        const innsatsgruppe = cv.servicebehov;

        return (
            <Row className={`kandidater--row${this.props.markert ? ' kandidater--row--checked' : ''}${this.props.nettoppValgt ? ' kandidater--row--sett' : ''}`}>
                <Column xs="1" md="1">
                    <Checkbox
                        id={`marker-kandidat-${kandidatnummer}-checkbox`}
                        className="text-hide"
                        label="."
                        aria-label={`Marker kandidat med navn ${navn}`}
                        checked={this.props.markert}
                        onChange={() => { this.onCheck(cv.arenaKandidatnr); }}
                    />
                </Column>
                <Column className="lenke--kandidatnr--wrapper" xs="2" md="2">
                    <Link
                        className="lenke--kandidatnr"
                        to={`kandidater/cv?kandidatNr=${kandidatnummer}`}
                        onClick={this.onKandidatNrClick}
                        aria-label={`Se CV for ${navn}`}
                    >
                        <Normaltekst className="text-overflow" aria-hidden="true">{navn}</Normaltekst>
                    </Link>
                </Column>
                <Column xs="5" md="5">
                    <Normaltekst className="text-overflow utdanning">{fodselsdato}</Normaltekst>
                </Column>
                <Column xs="4" md="4">
                    <Normaltekst className="text-overflow yrkeserfaring">{`"${innsatsgruppe}"`}</Normaltekst>
                </Column>
            </Row>
        );
    }
}

KandidaterTableRow.defaultProps = {
    markert: false
};

KandidaterTableRow.propTypes = {
    cv: cvPropTypes.isRequired,
    onKandidatValgt: PropTypes.func.isRequired,
    markert: PropTypes.bool,
    nettoppValgt: PropTypes.bool.isRequired,
    settValgtKandidat: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
    query: state.query
});

const mapDispatchToProps = (dispatch) => ({
    settValgtKandidat: (kandidatnummer, scrollTop) => dispatch({ type: SETT_KANDIDATNUMMER, kandidatnr: kandidatnummer, scrollStr: scrollTop })
});

export default connect(mapStateToProps, mapDispatchToProps)(KandidaterTableRow);
