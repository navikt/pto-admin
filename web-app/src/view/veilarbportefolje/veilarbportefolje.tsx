import React, { useState } from 'react';
import {
	assignAliasToIndex,
	createIndex,
	deleteIndex,
	getAliases,
	hovedindeksering,
	hovedindekseringNyttAlias,
	indekserAktoer,
	indekserFnr,
	JobId,
	pdlLastInnData
} from '../../api';
import { AxiosPromise } from 'axios';
import { errorToast, successToast } from '../../utils/toast-utils';
import { Card } from '../../component/card/card';
import BekreftModal from '../../component/bekreft-modal';
import { Alert, BodyShort, Button, TextField } from '@navikt/ds-react';

import './veilarbportefolje.less';

export function Veilarbportefolje() {
	return (
		<div className="view veilarbportefolje">
			<AdminKnappMedInput
				tittel="Oppdater bruker i OpenSearch"
				beskrivelse="Knappen reindekserer bruker"
				inputType="AktørId"
				request={indekserAktoer}
			/>
			<AdminKnappMedInput
				tittel="Oppdater bruker i OpenSearch"
				beskrivelse="Knappen reindekserer bruker"
				inputType="Fnr"
				request={indekserFnr}
			/>
			<AdminKnapp
				tittel="Hovedindeksering"
				beskrivelse="Oppdaterer alle brukere i opensearch. Tar ca 20 min i produksjon."
				request={hovedindeksering}
			/>
			<AdminKnapp
				tittel="Hovedindeksering: Nytt alias"
				beskrivelse="Skriver alle brukere til en ny indeks.
                NB! Det er kun nødvendig å kjøre denne i stedet for 'vanlig' hovedindeksering dersom det er gjort endringer på opensearch_settings.json i veilarbportefolje.
                Indekseringen tar ca 20 min i produksjon.
                Alle oppdateringer til gammel indeks vil stanse mens jobben kjører.
                 Dette betyr at veiledere vil oppleve forsinkelse på
                oppdateringer som skjer i perioden mens jobben pågår. Forsøk å legge denne
                jobben til slutten av en arbeidsdag.
                "
				request={hovedindekseringNyttAlias}
			/>

			<AdminKnapp tittel="Hent indekser" beskrivelse="Henter alle aktive indekser." request={getAliases} />

			<AdminKnapp
				tittel="Lag indeks"
				beskrivelse="Lager tom indeks i OpenSearch. Navn er autogenerert."
				request={createIndex}
			/>

			<AdminKnappMedInput
				tittel="Indeks til alias"
				beskrivelse="Kobler en indeks til et gitt alias (assignAliasToIndex)."
				inputType="Indeks navn"
				request={assignAliasToIndex}
			/>

			<AdminKnappMedInput
				tittel="Slett indeks"
				beskrivelse="Sletter indeks i OpenSearch."
				inputType="Indeks navn"
				request={deleteIndex}
			/>
			<AdminKnapp
				tittel="Hent PDL data"
				beskrivelse="Hent PDL data for alle oppfølgingsbrukere."
				request={pdlLastInnData}
			/>
		</div>
	);
}

interface AdminKnappProps {
	tittel: string;
	beskrivelse: string;
	request: () => AxiosPromise<JobId>;
}

function AdminKnapp(props: AdminKnappProps) {
	const [jobId, setJobId] = useState<string | undefined>(undefined);
	const [isOpen, setOpen] = useState(false);

	const handleAdminResponse = () => {
		props
			.request()
			.then(resp => {
				if (isJsonString(resp.data)) {
					setJobId(JSON.stringify(resp.data));
				} else {
					setJobId(resp.data);
				}
				successToast(`${props.tittel} er startet`);
			})
			.catch(() => errorToast(`Klarte ikke å utføre handling: ${props.tittel}`));
	};

	return (
		<>
			<Card title={props.tittel} className="veilarbportefolje-card">
				<BodyShort className="blokk-xxs">{props.beskrivelse}</BodyShort>
				{jobId && (
					<Alert size="small" variant="success" inline>
						Jobb startet med jobId: {jobId}
					</Alert>
				)}
				<Button className="veilarbportefolje-knapp" onClick={() => setOpen(true)}>
					{props.tittel}
				</Button>
			</Card>

			<BekreftModal action={handleAdminResponse} isOpen={isOpen} setOpen={setOpen} description={props.tittel} />
		</>
	);
}

interface AdminKnappInputProps {
	tittel: string;
	beskrivelse: string;
	inputType: string;
	request: (id: string) => AxiosPromise<string | boolean>;
}

function AdminKnappMedInput(props: AdminKnappInputProps) {
	const [respons, setRespons] = useState<string | undefined>(undefined);
	const [isOpen, setOpen] = useState(false);
	const [id, setid] = useState('');
	const inputType = props.inputType;

	const handleAdminResponse = () => {
		if (id) {
			props
				.request(id)
				.then(resp => {
					const data = resp.data;
					if (typeof data === 'string' && isJsonString(data)) {
						setRespons(JSON.stringify(data));
					} else if (typeof data === 'boolean') {
						setRespons(data ? 'true' : 'false');
					} else {
						setRespons(data);
					}
					successToast(`${props.tittel} er startet`);
				})
				.catch(() => errorToast(`Klarte ikke å utføre handling: ${props.tittel}`));
		} else {
			errorToast(`Input felt er tomt`);
		}
	};

	return (
		<>
			<Card title={props.tittel} className="veilarbportefolje-card">
				<BodyShort className="blokk-xxs">{props.beskrivelse}</BodyShort>
				<TextField label={inputType} value={id} onChange={e => setid(e.target.value)} />
				{respons && (
					<Alert size="small" variant="success" inline>
						Respons: {respons}
					</Alert>
				)}
				<Button className="veilarbportefolje-knapp" onClick={() => setOpen(true)}>
					{props.tittel}
				</Button>
			</Card>

			<BekreftModal action={handleAdminResponse} isOpen={isOpen} setOpen={setOpen} description={props.tittel} />
		</>
	);
}

function isJsonString(str: string): boolean {
	try {
		JSON.stringify(str);
	} catch (e) {
		return false;
	}
	return true;
}
