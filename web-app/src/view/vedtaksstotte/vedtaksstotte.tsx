import React, { useState } from 'react';
import { BodyShort, Button, TextField } from '@navikt/ds-react';
import { Card } from '../../component/card/card';
import { errorToast, successToast } from '../../utils/toast-utils';
import { slett14avedtak } from '../../api';
import './vedtaksstotte.less';

export const Vedtaksstotte = () => {
    const [journalpostId, setJournalpostId] = useState('');
    const [fnr, setFnr] = useState('');
    const [ansvarligVeileder, setAnsvarligVeileder] = useState('');
    const [slettVedtakBestillingId, setSlettVedtakBestillingId] = useState('');

    const handleSlett14aVedtak = () => {
        if (journalpostId.length < 3) {
            errorToast('JournalpostId er ikke fylt inn');
            return;
        }
        if (fnr.length !== 11) {
            errorToast('Fødselsnummer har ikke 11 tegn');
            return;
        }
        if (ansvarligVeileder.length !== 7) {
            errorToast('Veilederident har ikke 7 tegn');
            return;
        }
        if (slettVedtakBestillingId.length < 3 || !slettVedtakBestillingId.includes('FAGSYSTEM-')) {
            errorToast('Jiranummer er ikke fylt ut eller inneholder ikke FAGSYSTEM-');
            return;
        }

        slett14avedtak(journalpostId, fnr, ansvarligVeileder, slettVedtakBestillingId)
            .then(() => {
                successToast(`Sletting av § 14 a-vedtak for person ${fnr} med journalpostId ${journalpostId} er utført.`);
                setJournalpostId('');
                setFnr('');
                setSlettVedtakBestillingId('');
            })
            .catch(() => errorToast(`Klarte ikke å slette § 14 a-vedtak for person ${fnr} med journalpostId ${journalpostId}`));

    }

    return (
        <div className="view vedtaksstotte">
            <Card title="Slett § 14-vedtak" className="small-card" innholdClassName="card__content">
                <BodyShort className="blokk-xxs">Det å slette § 14-a vedtak skal kun gjøres dersom vedtak er fattet på feil person. Om dette ikke er tilfelle skal man bare fatte et nytt vedtak.</BodyShort>
                <TextField label="Journalpost-ID for § 14 a-vedtak" value={journalpostId} onChange={e => setJournalpostId(e.target.value)} />
                <TextField label="Fødselsnummer § 14 a-vedtak som skal slettes er fattet på" value={fnr} onChange={e => setFnr(e.target.value)} />
                <TextField label="Ident på veileder som har bestilt sletting av § 14 a-vedtak" value={ansvarligVeileder} onChange={e => setAnsvarligVeileder(e.target.value)} />
                <TextField label="Jira/FAGSYSTEM-nummer hvor bestilling av sletting av § 14 a-vedtak finnes." description="Eksempel: FAGSYSTEM-1234556" value={slettVedtakBestillingId} onChange={e => setSlettVedtakBestillingId(e.target.value)} />
                <Button onClick={handleSlett14aVedtak}>Slett § 14 a-vedtak</Button>
            </Card>
        </div>
    )
}