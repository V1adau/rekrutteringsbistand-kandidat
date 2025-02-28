import * as React from 'react';
import { BodyLong, Link } from '@navikt/ds-react';
import { ExternalLinkIcon } from '@navikt/aksel-icons';
import { sendEvent } from '../../amplitude/amplitude';
import { arbeidsrettetOppfølgingUrl } from '../../utils/eksterneUrler';
import Informasjonspanel from '../Informasjonspanel';
import css from './Tilretteleggingsbehov.module.css';

interface Props {
    fnr: string;
}

const Tilretteleggingsbehov = ({ fnr }: Props) => {
    return (
        <Informasjonspanel tittel="Tilretteleggingsbehov">
            <BodyLong>Kandidaten trenger tilrettelegging</BodyLong>
            <BodyLong>
                <Link
                    href={`${arbeidsrettetOppfølgingUrl}/${fnr}?#visDetaljer&apneTilretteleggingsbehov`}
                    className={css.lenke}
                    target="_blank"
                    onClick={() => sendEvent('cv_tilretteleggingsbehov_lenke', 'klikk')}
                    rel="noopener noreferrer"
                >
                    Se behov for tilrettelegging.
                    <ExternalLinkIcon aria-hidden />
                </Link>
            </BodyLong>
        </Informasjonspanel>
    );
};

export default Tilretteleggingsbehov;
