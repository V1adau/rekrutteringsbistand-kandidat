import { fetchJson, SearchApiError, postJson } from '../api/fetchUtils';
import Kandidatmatch from './Kandidatmatch';
import { Stilling } from './kandidatmatchReducer';

export const KANDIDATMATCH_API_URL = '/kandidatmatch-api';
export const STILLINGSSØK_PROXY = '/stillingssok-proxy';

export const hentStilling = async (stillingsId: string): Promise<any> => {
    try {
        const response = await fetchJson(`${STILLINGSSØK_PROXY}/stilling/_doc/${stillingsId}`);
        return response['_source'];
    } catch (e) {
        throw new SearchApiError({
            message: 'Klarte ikke å hente stilling',
            status: e.status,
        });
    }
};

export const hentKandidater = async (stilling: Stilling): Promise<Kandidatmatch[]> => {
    try {
        const body = {
            stilling: stilling,
        };

        return await postJson(`${KANDIDATMATCH_API_URL}/match`, JSON.stringify(body));
    } catch (e) {
        throw new SearchApiError({
            message: 'Klarte ikke å hente foreslåtte kandidater',
            status: e.status,
        });
    }
};
