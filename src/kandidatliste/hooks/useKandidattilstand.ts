import { useSelector } from 'react-redux';
import AppState from '../../AppState';

const useKandidattilstand = (kandidatnr: string) => {
    const { kandidattilstander } = useSelector((state: AppState) => state.kandidatliste);

    return kandidattilstander[kandidatnr];
};

export default useKandidattilstand;
