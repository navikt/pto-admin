import React, { useState } from 'react';
import { Card } from '../../component/card/card';
import { Flatknapp, Hovedknapp } from 'nav-frontend-knapper';
import { Normaltekst, Systemtittel } from 'nav-frontend-typografi';
import { JobId, republiserInnsatsbehovVedtaksstotte } from '../../api';
import { errorToast, successToast } from '../../utils/toast-utils';
import './republisering-kafka.less';
import Modal from 'nav-frontend-modal';
import { AxiosPromise } from 'axios';
import AlertStripe from 'nav-frontend-alertstriper';

export function RepubliseringKafka() {
	return (
		<div className="view republisering-kafka">

			<RepubliseringsKort
				tittel="Republiser innsatsbehov fra Modia vedtaksstøtte"
				beskrivelse="Republiserer innsatsbehov for brukere som har fått vedtak i Modia vedtaksstøtte. Republiserer ikke
					for brukere som bare har vedtak i Arena, men dersom en bruker har vedtak i Modia vedtaksstøtte og et
					nyere i Arena, så vil innsatsbehovet fra vedtak i Arena bli republisert."
				request={republiserInnsatsbehovVedtaksstotte}
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
