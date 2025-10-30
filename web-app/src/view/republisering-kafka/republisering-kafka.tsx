import React, { ChangeEvent, useState } from 'react';
import { Card } from '../../component/card/card';
import {
	JobId,
	republiserArbeidsoppfolgingskontorendret,
	republiserEndringPaaDialog,
	republiserEndringPaaOppfolgingsbrukere,
	republiserSiste14aVedtak,
	republiserVedtak14aFattetDvh
} from '../../api';
import { errorToast, successToast } from '../../utils/toast-utils';
import { AxiosPromise } from 'axios';
import BekreftModal from '../../component/bekreft-modal';
import { Alert, BodyShort, Button, TextField } from '@navikt/ds-react';
import './republisering-kafka.less';
import { republiserOppfolgingsperiodeForBruker } from '../../api/veilarboppfolging';

export function RepubliseringKafka() {
	return (
		<div className="view republisering-kafka">
			<RepubliseringsKort
				tittel="Republiser siste 14a vedtak i veilarbvedtaksstotte"
				beskrivelse="Republiserer siste 14a vedtak for brukere som har vedtak i Modia vedtaksstøtte eller i Arena."
				request={republiserSiste14aVedtak}
				topicNavn={'<ukjent topic>'}
			/>
			<RepubliseringsKort
				tittel="Republiser fattede 14a vedtak i veilarbvedtaksstotte til DVH"
				beskrivelse="Republiser alle fattede 14a vedtak i veilarbvedtaksstotte på topic for DVH."
				request={republiserVedtak14aFattetDvh}
				topicNavn={'<ukjent topic>'}
			/>
			<RepubliseringsKort
				tittel="Republiser endring på dialog i veilarbdialog"
				beskrivelse="Republiser endring på dialog i veilarbdialog for alle brukere som har en aktiv dialog
					(dvs. ikke historisk)."
				request={republiserEndringPaaDialog}
				topicNavn={'dab.endring-paa-dialog-v1'}
			/>
			<RepubliseringsKort
				tittel="Republiser endring på alle oppfølgingsbrukere i veilarbarena (v2 på Aiven)"
				beskrivelse="Republiser endring på alle oppfølgingsbrukere i veilarbarena (v2 på Aiven)."
				request={republiserEndringPaaOppfolgingsbrukere}
				topicNavn={'pto.siste-oppfolgingsperiode-v1 + pto.oppfolgingsperiode-v1'}
			/>
			<RepubliseringsKortMedInput
				tittel="Republiser oppfølgingsperiode for bruker"
				beskrivelse="Republiser oppfølgingsperiode for bruker"
				inputLabel={'Aktør-ID'}
				request={republiserOppfolgingsperiodeForBruker}
				topicNavn={'pto.siste-oppfolgingsperiode-v1 + pto.oppfolgingsperiode-v1'}
			/>
			<RepubliseringsKort
				tittel="Republiser arbeidsoppfølgingskontor endret"
				beskrivelse="Republiserer kontoret til alle brukere med aktiv oppfølgingsperiode på topic dab.arbeidsoppfolgingskontortilordninger-v1"
				request={republiserArbeidsoppfolgingskontorendret}
				topicNavn={'dab.arbeidsoppfolgingskontortilordninger-v1'}
			/>
		</div>
	);
}

interface RepubliseringsKortProps {
	tittel: string;
	topicNavn: string;
	beskrivelse: string;
	request: () => AxiosPromise<JobId>;
}

interface RepubliseringsKortMedInputProps {
	tittel: string;
	beskrivelse: string;
	topicNavn: string;
	inputLabel: string;
	request: (input: string) => AxiosPromise<JobId>;
}

function RepubliseringsKortMedInput({
	tittel,
	beskrivelse,
	inputLabel,
	request,
	topicNavn
}: RepubliseringsKortMedInputProps) {
	const [jobId, setJobId] = useState<string | undefined>(undefined);
	const [isOpen, setOpen] = useState(false);
	const [input, setInput] = useState<string>('');

	const handleRepubliseringsResponse = () => {
		request(input)
			.then(resp => {
				setJobId(resp.data);
				successToast(`${tittel} er startet`);
			})
			.catch(() => errorToast(`Klarte ikke å starte republisering av ${tittel}`));
	};

	return (
		<>
			<Card title={tittel} className="large-card" innholdClassName="republisering-kafka-kort__innhold">
				<BodyShort className="blokk-xxs">{beskrivelse}</BodyShort>
				<TextField
					label={inputLabel}
					value={input}
					onChange={(e: ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
				/>
				{jobId && (
					<Alert size="small" variant="success" inline>
						Jobb startet med jobId: {jobId}
					</Alert>
				)}
				<div>
					<code className="bg-gray-200 p-2 rounded-sm">{topicNavn}</code>
				</div>
				<div>
					<Button onClick={() => setOpen(true)}>Utfør republisering</Button>
				</div>
			</Card>

			<BekreftModal
				action={handleRepubliseringsResponse}
				isOpen={isOpen}
				setOpen={setOpen}
				description={tittel}
			/>
		</>
	);
}

function RepubliseringsKort({ tittel, beskrivelse, request, topicNavn }: RepubliseringsKortProps) {
	const [jobId, setJobId] = useState<string | undefined>(undefined);
	const [isOpen, setOpen] = useState(false);

	const handleRepubliseringsResponse = () => {
		request()
			.then(resp => {
				setJobId(resp.data);
				successToast(`${tittel} er startet`);
			})
			.catch(() => errorToast(`Klarte ikke å starte republisering av ${tittel}`));
	};

	return (
		<>
			<Card title={tittel} className="large-card" innholdClassName="republisering-kafka-kort__innhold">
				<BodyShort className="blokk-xxs">{beskrivelse}</BodyShort>
				{jobId && (
					<Alert size="small" variant="success" inline>
						Jobb startet med jobId: {jobId}
					</Alert>
				)}
				<div>
					<code className="bg-gray-200 p-2 rounded-sm">{topicNavn}</code>
				</div>
				<div>
					<Button onClick={() => setOpen(true)}>Utfør republisering</Button>
				</div>
			</Card>

			<BekreftModal
				action={handleRepubliseringsResponse}
				isOpen={isOpen}
				setOpen={setOpen}
				description={tittel}
			/>
		</>
	);
}
