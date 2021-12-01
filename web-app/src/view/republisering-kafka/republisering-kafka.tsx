import React, { useState } from 'react';
import { Card } from '../../component/card/card';
import { Flatknapp, Hovedknapp } from 'nav-frontend-knapper';
import { Normaltekst, Systemtittel } from 'nav-frontend-typografi';
import {
	JobId,
	republiserEndringPaaDialog,
	republiserEndringPaaOppfolgingsbrukere,
	republiserSiste14aVedtak
} from '../../api';
import { errorToast, successToast } from '../../utils/toast-utils';
import './republisering-kafka.less';
import Modal from 'nav-frontend-modal';
import { AxiosPromise } from 'axios';
import AlertStripe from 'nav-frontend-alertstriper';

export function RepubliseringKafka() {
	return (
		<div className="view republisering-kafka">

			<RepubliseringsKort
				tittel="Republiser siste 14a vedtak i veilarbvedtaksstotte"
				beskrivelse="Republiserer siste 14a vedtak for brukere som har vedtak i Modia vedtaksstøtte eller i Arena."
				request={republiserSiste14aVedtak}
			/>
			<RepubliseringsKort
				tittel="Republiser endring på dialog i veilarbdialog"
				beskrivelse="Republiser endring på dialog i veilarbdialog for alle brukere som har en aktiv dialog
					(dvs. ikke historisk)."
				request={republiserEndringPaaDialog}
			/>
			<RepubliseringsKort
				tittel="Republiser endring på alle oppfølgingsbrukere i veilarbarena (v2 på Aiven)"
				beskrivelse="Republiser endring på alle oppfølgingsbrukere i veilarbarena (v2 på Aiven)."
				request={republiserEndringPaaOppfolgingsbrukere}
			/>
		</div>
	);
}

interface RepubliseringsKortProps {
	tittel: string
	beskrivelse: string
	request: () => AxiosPromise<JobId>
}

function RepubliseringsKort(props: RepubliseringsKortProps) {
	const [jobId, setJobId] = useState<string | undefined>(undefined);
	const [isOpen, setOpen] = useState(false);

	const handleRepubliseringsResponse = () => {
		props.request()
			.then((resp) => {
				setJobId(resp.data);
				successToast(`${props.tittel} er startet`);
			})
			.catch(() => errorToast(`Klarte ikke å starte republisering av ${props.tittel}`));
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
					Utfør republisering
				</Flatknapp>
			</Card>

			<BekreftModal action={handleRepubliseringsResponse}
						  isOpen={isOpen}
						  setOpen={setOpen}
						  description={props.tittel}
			/>
		</>
	);
}

interface BekreftModalProps {
	isOpen: boolean;
	setOpen: (isOpen: boolean) => void;
	action: () => void;
	description: string;
}

function BekreftModal(props: BekreftModalProps) {
	return (<Modal
		className="bekreft-modal"
		isOpen={props.isOpen}
		onRequestClose={() => {
			props.setOpen(false);
		}}
		closeButton={true}
		contentLabel="Bekreft handling"
	>
		<div className="bekreft-modal__innhold">
			<Systemtittel>Sikker?</Systemtittel>
			<Normaltekst>
				{props.description}
			</Normaltekst>
			<Hovedknapp
				className="bekreft-modal__bekreft"
				onClick={() => {
					props.setOpen(false);
					props.action();
				}}>
				Bekreft
			</Hovedknapp>
		</div>
	</Modal>);
}
