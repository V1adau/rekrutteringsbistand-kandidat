import React, { FunctionComponent, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { KandidatlisterForKandidatActionType } from './historikkReducer';
import { Nettstatus } from '../../../felles/common/remoteData';
import { useRouteMatch } from 'react-router-dom';
import AppState from '../../AppState';
import 'nav-frontend-tabell-style';
import './Historikkside.less';
import { capitalizeFirstLetter } from '../../../felles/sok/utils';
import { Ingress } from 'nav-frontend-typografi';
import { Historikktabell } from './historikktabell/Historikktabell';

const Historikkside: FunctionComponent = () => {
    const { params } = useRouteMatch<{ kandidatnr: string }>();
    const kandidatnr = params.kandidatnr;
    const historikk = useSelector((state: AppState) => state.historikk);
    const cv = useSelector((state: AppState) => state.cv);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch({
            type: KandidatlisterForKandidatActionType.Fetch,
            kandidatnr,
        });
    }, [kandidatnr, dispatch]);

    if (
        historikk.kandidatlisterForKandidat.kind !== Nettstatus.Suksess ||
        cv.hentStatus !== 'SUCCESS'
    ) {
        return null;
    }

    const kandidatlister = historikk.kandidatlisterForKandidat.data;
    return (
        <div className="historikkside">
            <Ingress className="blokk-m">
                <b>
                    {capitalizeFirstLetter(cv.cv.fornavn)} {capitalizeFirstLetter(cv.cv.etternavn)}
                </b>{' '}
                er lagt til i <b>{kandidatlister.length}</b> kandidatlister
            </Ingress>
            <Historikktabell kandidatlister={kandidatlister} />
        </div>
    );
};

export default Historikkside;
