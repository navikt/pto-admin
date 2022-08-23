import React, { useState } from 'react';
import { hovedindeksering, hovedindekseringNyttAlias, indekser, JobId } from '../../api';
import { AxiosPromise } from 'axios';
import { errorToast, successToast } from '../../utils/toast-utils';
import { Card } from '../../component/card/card';
import { Normaltekst } from 'nav-frontend-typografi';
import AlertStripe from 'nav-frontend-alertstriper';
import { Flatknapp } from 'nav-frontend-knapper';
import BekreftModal from '../../component/bekreft-modal';
import { Input } from 'nav-frontend-skjema';

import './veilarbportefolje.less'

export function Veilarbportefolje() {
    return (
        <div className="view veilarbportefolje">
            <AdminKnappMedInput
                tittel="Oppdater bruker i OpenSearch"
                beskrivelse="Knappen reindekserer bruker"
                inputType="aktoerId"
                request={indekser}
            />
            <AdminKnapp
                tittel="Hovedindeksering"
                beskrivelse="Oppdaterer alle brukere i opensearch. Tar typ 10min i produksjon."
                request={hovedindeksering}
            />
            <AdminKnapp
                tittel="Hovedindeksering: Nytt alias"
                beskrivelse="Skriver alle brukere til en ny indeks.
                Alle oppdateringer til gammel indeks vil stanse mens jobben kjører.
                Dette vil også skape noen warnings i loggene.
                "
                request={hovedindekseringNyttAlias}
            />
        </div>
    );
}


interface AdminKnappProps {
    tittel: string
    beskrivelse: string
    request: () => AxiosPromise<JobId>
}

function AdminKnapp(props: AdminKnappProps) {
    const [jobId, setJobId] = useState<string | undefined>(undefined);
    const [isOpen, setOpen] = useState(false);

    const handleAdminResponse = () => {
        props.request()
            .then((resp) => {
                setJobId(resp.data);
                successToast(`${props.tittel} er startet`);
            })
            .catch(() => errorToast(`Klarte ikke å utføre handling: ${props.tittel}`));
    };

    return (
        <>
            <Card title={props.tittel}
                  className="large-card"
                  innholdClassName="republisering-kafka-kort__innhold">
                <Normaltekst className="blokk-xxs">
                    {props.beskrivelse}
                </Normaltekst>
                {jobId && <AlertStripe type="suksess" form="inline">
                    Jobb startet med jobId: {jobId}
                </AlertStripe>}
                <Flatknapp onClick={() => setOpen(true)}>
                    {props.tittel}
                </Flatknapp>
            </Card>

            <BekreftModal action={handleAdminResponse}
                          isOpen={isOpen}
                          setOpen={setOpen}
                          description={props.tittel}
            />
        </>
    );
}


interface AdminKnappInputProps {
    tittel: string
    beskrivelse: string
    inputType: string
    request: (id: string) => AxiosPromise<JobId>
}

function AdminKnappMedInput(props: AdminKnappInputProps) {
    const [jobId, setJobId] = useState<string | undefined>(undefined);
    const [isOpen, setOpen] = useState(false);
    const [id, setid] = useState('');
    const inputType = props.inputType;

    const handleAdminResponse = () => {
        if (id) {
            props.request(id)
                .then((resp) => {
                    setJobId(resp.data);
                    successToast(`${props.tittel} er startet`);
                })
                .catch(() => errorToast(`Klarte ikke å utføre handling: ${props.tittel}`))
        } else {
            errorToast(`Input felt er tomt`)
        }
    };

    return (
        <>
            <Card title={props.tittel}
                  className="large-card"
                  innholdClassName="republisering-kafka-kort__innhold">
                <Normaltekst className="blokk-xxs">
                    {props.beskrivelse}
                </Normaltekst>
                <Input label={inputType} value={id} onChange={e => setid(e.target.value)}/>
                {jobId && <AlertStripe type="suksess" form="inline">
                    Jobb startet med jobId: {jobId}
                </AlertStripe>}
                <Flatknapp onClick={() => setOpen(true)}>
                    {props.tittel}
                </Flatknapp>
            </Card>

            <BekreftModal action={handleAdminResponse}
                          isOpen={isOpen}
                          setOpen={setOpen}
                          description={props.tittel}
            />
        </>
    );
}


