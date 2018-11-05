import PropTypes from 'prop-types';

export const Kandidat = {
    kandidatId: PropTypes.string,
    kandidatnr: PropTypes.string,
    sisteArbeidserfaring: PropTypes.string,
    status: PropTypes.string,
    lagtTilTidspunkt: PropTypes.string,
    lagtTilAv: {
        ident: PropTypes.string,
        navn: PropTypes.string
    },
    fornavn: PropTypes.string,
    etternavn: PropTypes.string,
    fodselsdato: PropTypes.string,
    utfall: PropTypes.string
};

export const Kandidatliste = {
    kandidatlisteId: PropTypes.string,
    tittel: PropTypes.string,
    beskrivelse: PropTypes.string,
    organisasjonReferanse: PropTypes.string,
    organisasjonNavn: PropTypes.string,
    stillingId: PropTypes.string,
    opprettetAv: PropTypes.shape({
        ident: PropTypes.string,
        navn: PropTypes.string
    }),
    opprettetTidspunkt: PropTypes.string,
    kandidater: PropTypes.arrayOf(PropTypes.shape(Kandidat))
};
