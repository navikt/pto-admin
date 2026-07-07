import React, { useState } from 'react';
import { BodyShort, Button, TextField } from '@navikt/ds-react';
import { Card } from '../../component/card/card';
import { errorToast, successToast } from '../../utils/toast-utils';
import { sladdBegrunnelse14avedtak } from '../../api';
import './vedtaksstotte.less';

export const VedtaksstotteSladd = () => {
	const [journalpostId, setJournalpostId] = useState('');
	const [fnr, setFnr] = useState('');
	const [ansvarligVeileder, setAnsvarligVeileder] = useState('');
	const [sladdVedtakBestillingId, setSladdVedtakBestillingId] = useState('');

	const handleSladd14aVedtak = () => {
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
		if (sladdVedtakBestillingId.length < 3 || !sladdVedtakBestillingId.includes('FAGSYSTEM-')) {
			errorToast('Jiranummer er ikke fylt ut eller inneholder ikke FAGSYSTEM-');
			return;
		}

		if (window.confirm('Sikker på at du ønsker å sladde begrunnelse på § 14 a-vedtak for person ' + fnr + '?')) {
			sladdBegrunnelse14avedtak(journalpostId, fnr, ansvarligVeileder, sladdVedtakBestillingId)
				.then(() => {
					successToast(
						`Sladding av § 14 a-vedtak for person ${fnr} med journalpostId ${journalpostId} er utført.`
					);
					setJournalpostId('');
					setFnr('');
					setAnsvarligVeileder('');
					setSladdVedtakBestillingId('');
				})
				.catch(() =>
					errorToast(
						`Klarte ikke å sladde begrunnelsen på § 14 a-vedtak for person ${fnr} med journalpostId ${journalpostId}`
					)
				);
		}
	};

	return (
		<Card title="Sladd begrunnelse i § 14-vedtak" className="small-card" innholdClassName="card__content">
			<BodyShort className="blokk-xxs" spacing={true}>
				I noen tilfeller har veiledere skrevet feil opplysninger eller lignende i begrunnelsen i et vedtak, og
				de ber om at informasjonen sladdes. Vi fjerner ikke selektiv tekst, men sletter i stedet hele
				begrunnelsen og erstatter den med følgende setning: "Deler av vedtaket har blitt slettet/sladdet. Se
				dokument i Gosys".
			</BodyShort>
			<TextField
				label="Journalpost-ID for § 14 a-vedtak"
				value={journalpostId}
				onChange={e => setJournalpostId(e.target.value)}
			/>
			<TextField
				label="Fødselsnummer § 14 a-vedtak som skal sladdes er fattet på"
				value={fnr}
				onChange={e => setFnr(e.target.value)}
			/>
			<TextField
				label="Ident på veileder som har bestilt sladding av § 14 a-vedtak"
				value={ansvarligVeileder}
				onChange={e => setAnsvarligVeileder(e.target.value)}
			/>
			<TextField
				label="Jira/FAGSYSTEM-nummer hvor bestilling av sladding av § 14 a-vedtak finnes."
				description="Eksempel: FAGSYSTEM-1234556"
				value={sladdVedtakBestillingId}
				onChange={e => setSladdVedtakBestillingId(e.target.value)}
			/>
			<Button onClick={handleSladd14aVedtak}>Slett § 14 a-vedtak</Button>
		</Card>
	);
};
