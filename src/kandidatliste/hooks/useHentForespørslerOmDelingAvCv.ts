import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import KandidatlisteActionType from '../reducer/KandidatlisteActionType';
import KandidatlisteAction from '../reducer/KandidatlisteAction';
import { erIkkeProd } from '../../utils/featureToggleUtils';

const useHentForespørslerOmDelingAvCv = (stillingsId: string | null) => {
    const dispatch = useDispatch();

    useEffect(() => {
        if (stillingsId && erIkkeProd) {
            dispatch<KandidatlisteAction>({
                type: KandidatlisteActionType.HENT_FORESPØRSLER_OM_DELING_AV_CV,
                stillingsId,
            });
        }
    }, [dispatch, stillingsId]);
};

export default useHentForespørslerOmDelingAvCv;
