import React from 'react';
import { useState, useEffect } from 'react';
import { Accordion, Checkbox, CheckboxGroup, Radio, RadioGroup } from '@navikt/ds-react';
import css from './Filter.module.css';
import { Søkekriterier } from '../reducer/listeoversiktReducer';

enum Eierskapsfilter {
    KunMine = 'KUN_MINE',
    AlleSine = 'ALLE_SINE',
}

export enum Stillingsfilter {
    MedStilling = 'MED_STILLING',
    UtenStilling = 'UTEN_STILLING',
    Ingen = '',
}

type Props = {
    søkekriterier: Søkekriterier;
    onVisMineKandidatlister: () => void;
    onVisAlleKandidatlister: () => void;
    onFilterChange: (verdi: string) => void;
    className?: string;
};

const Filter = ({
    søkekriterier,
    onVisMineKandidatlister,
    onVisAlleKandidatlister,
    onFilterChange,
    className,
}: Props) => {
    const [utenStilling, setUtenStilling] = useState<boolean>(
        søkekriterier.type === Stillingsfilter.UtenStilling
    );

    const [medStilling, setMedStilling] = useState<boolean>(
        søkekriterier.type === Stillingsfilter.MedStilling
    );

    const handleEierskapsfilterChange = (eierskap: Eierskapsfilter) => {
        if (eierskap === Eierskapsfilter.KunMine) {
            onVisMineKandidatlister();
        } else {
            onVisAlleKandidatlister();
        }
    };

    const handleStillingsfilterChange = (type: Stillingsfilter[]) => {
        setMedStilling(type.includes(Stillingsfilter.MedStilling));
        setUtenStilling(type.includes(Stillingsfilter.UtenStilling));
    };

    useEffect(() => {
        if (medStilling === utenStilling) {
            onFilterChange(Stillingsfilter.Ingen);
        } else {
            onFilterChange(
                medStilling ? Stillingsfilter.MedStilling : Stillingsfilter.UtenStilling
            );
        }
    }, [medStilling, utenStilling, onFilterChange]);

    const eierskapsfilter: Eierskapsfilter = søkekriterier.kunEgne
        ? Eierskapsfilter.KunMine
        : Eierskapsfilter.AlleSine;

    const stillingsfilter: Stillingsfilter[] = [];
    if (utenStilling) stillingsfilter.push(Stillingsfilter.UtenStilling);
    if (medStilling) stillingsfilter.push(Stillingsfilter.MedStilling);

    return (
        <Accordion className={className}>
            <Accordion.Item defaultOpen>
                <Accordion.Header>Kandidatlister</Accordion.Header>
                <Accordion.Content className={css.innhold}>
                    <RadioGroup
                        hideLegend
                        legend="Eierskap"
                        className={css.eierskap}
                        onChange={handleEierskapsfilterChange}
                        value={eierskapsfilter}
                    >
                        <Radio value={Eierskapsfilter.KunMine}>Vis kun mine</Radio>
                        <Radio value={Eierskapsfilter.AlleSine}>Vis alle sine</Radio>
                    </RadioGroup>

                    <CheckboxGroup
                        hideLegend
                        legend="Stilling"
                        onChange={handleStillingsfilterChange}
                        value={stillingsfilter}
                    >
                        <Checkbox value={Stillingsfilter.MedStilling}>Med stilling</Checkbox>
                        <Checkbox value={Stillingsfilter.UtenStilling}>Uten stilling</Checkbox>
                    </CheckboxGroup>
                </Accordion.Content>
            </Accordion.Item>
        </Accordion>
    );
};

export default Filter;
