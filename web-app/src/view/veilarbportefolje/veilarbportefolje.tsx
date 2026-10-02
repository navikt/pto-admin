import React, { useEffect, useState } from 'react';
import {
	assignAliasToIndex,
	createIndex,
	deleteIndex,
	getAliases,
	hentBatchjobbForDatakilde,
	hentMuligeDataTyperSomKanHentes,
	hentTilordningsdatoBatch,
	hentValgteDataForBruker,
	hovedindeksering,
	hovedindekseringNyttAlias,
	indekserAktoer,
	indekserFnr,
	JobId
} from '../../api';
import { errorToast, successToast } from '../../utils/toast-utils';
import { Card } from '../../component/card/card';
import BekreftModal from '../../component/bekreft-modal';
import {
	Alert,
	BodyShort,
	Button,
	Checkbox,
	CheckboxGroup,
	DatePicker,
	Radio,
	RadioGroup,
	TextField,
	useDatepicker
} from '@navikt/ds-react';

import './veilarbportefolje.less';

export function Veilarbportefolje() {
	const [dataTyper, setDataTyper] = useState<AdminDataTypeResponse[]>([]);

	useEffect(() => {
		hentMuligeDataTyperSomKanHentes()
			.then(response => setDataTyper(Array.isArray(response.data) ? response.data : []))
			.catch(() => setDataTyper([]));
	}, []);

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
			<AdminKnappMedInput
				tittel="Hent tilordningsdato for x antall"
				beskrivelse="Hent tilordningsdato for x antall brukere som ikke alt har den"
				inputType="Antall"
				request={hentTilordningsdatoBatch}
			/>
			<AdminBatchjobb
				tittel="Hent batchjobb for en gitt datakilde"
				beskrivelse="Går gjennom alle brukere under oppfølging og henter inn data fra valgt datakilde. Tidsrom for oppfølging startet er valgfritt, default er å hente alle. Sett 'Start fra' for å hoppe over et gitt antall brukere (f.eks. om en jobb feilet halvveis). For å stoppe en påstartet jobb, toggle på veilarbportefolje.stopp_kjoerende_batchjobber i unleash."
				request={hentBatchjobbForDatakilde}
				dataTyper={dataTyper}
			/>
			<AdminCheckboxerMedInput
				tittel={'Hent valgte data for en bruker'}
				beskrivelse={'Hent / oppdater data for en bruker basert på valg av datatypene under'}
				inputType={'AktørId'}
				request={hentValgteDataForBruker}
				dataTyper={dataTyper}
			/>
		</div>
	);
}

export interface AdminDataTypeResponse {
	name: string;
	displayName: string;
}

export interface AdminDataForBrukerRequest {
	aktorId: string;
	valg: string[];
}

export interface AdminBatchjobbRequest {
	datakilde: string;
	startFra?: number;
	oppfolgingStartetFra?: string;
	oppfolgingStarterTil?: string;
}

interface AdminKnappProps {
	tittel: string;
	beskrivelse: string;
	request: () => Promise<{ data: JobId }>;
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
				<br />
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
	request: (id: string) => Promise<{ data: string | boolean }>;
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
				<br />
				<Button className="veilarbportefolje-knapp" onClick={() => setOpen(true)}>
					{props.tittel}
				</Button>
			</Card>

			<BekreftModal action={handleAdminResponse} isOpen={isOpen} setOpen={setOpen} description={props.tittel} />
		</>
	);
}

interface AdminCheckboxerMedInputProps {
	dataTyper: AdminDataTypeResponse[];
	beskrivelse: string;
	inputType: string;
	tittel: string;
	request: (requestBody: AdminDataForBrukerRequest) => Promise<{ data: string | boolean }>;
}

function AdminCheckboxerMedInput(props: AdminCheckboxerMedInputProps) {
	const [valg, setValg] = useState<string[]>([]);
	const [respons, setRespons] = useState<string | undefined>(undefined);
	const [isOpen, setOpen] = useState(false);
	const [id, setid] = useState('');
	const inputType = props.inputType;

	const handleAdminResponse = () => {
		if (id) {
			props
				.request({ aktorId: id, valg })
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
				{respons && (
					<Alert size="small" variant="success" inline>
						Respons: {respons}
					</Alert>
				)}
				<br />
				<CheckboxGroup legend="Datavalg" onChange={setValg} value={valg}>
					{props.dataTyper.map(type => (
						<Checkbox value={type.name} key={type.name}>
							{type.displayName}
						</Checkbox>
					))}
				</CheckboxGroup>
				<br />
				<TextField label={inputType} value={id} onChange={e => setid(e.target.value)} />
				<br />
				<Button className="veilarbportefolje-knapp" onClick={() => setOpen(true)}>
					{props.tittel}
				</Button>
			</Card>
			<BekreftModal action={handleAdminResponse} isOpen={isOpen} setOpen={setOpen} description={props.tittel} />
		</>
	);
}

interface AdminBatchjobbProps {
	dataTyper: AdminDataTypeResponse[];
	tittel: string;
	beskrivelse: string;
	request: (requestBody: AdminBatchjobbRequest) => Promise<{ data: JobId }>;
}

function AdminBatchjobb(props: AdminBatchjobbProps) {
	const [datakilde, setDatakilde] = useState('');
	const [startFra, setStartFra] = useState('');
	const [oppfolgingStartetEtter, setOppfolgingStartetEtter] = useState('');
	const [oppfolgingStarterFor, setOppfolgingStarterFor] = useState('');
	const [jobId, setJobId] = useState<string | undefined>(undefined);
	const [isOpen, setOpen] = useState(false);

	const handleAdminResponse = () => {
		if (!datakilde) {
			errorToast('Velg en datakilde');
			return;
		}
		const startFraTall = startFra ? Number(startFra) : 0;
		if (!Number.isInteger(startFraTall) || startFraTall < 0) {
			errorToast('Start fra må være et positivt heltall');
			return;
		}
		props
			.request({
				datakilde,
				startFra: startFraTall,
				oppfolgingStartetFra: oppfolgingStartetEtter || undefined,
				oppfolgingStarterTil: oppfolgingStarterFor || undefined
			})
			.then(resp => {
				setJobId(JSON.stringify(resp.data));
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
				<br />
				<RadioGroup legend="Datakilde" onChange={setDatakilde} value={datakilde}>
					{props.dataTyper.map(type => (
						<Radio value={type.name} key={type.name}>
							{type.displayName}
						</Radio>
					))}
				</RadioGroup>
				<br />
				<TextField
					label="Start jobb fra (valgfritt)"
					type="number"
					min={0}
					value={startFra}
					onChange={e => setStartFra(e.target.value)}
				/>
				<br />
				<Datovelger label="Oppfølging startet fra dato (valgfritt)" onChange={setOppfolgingStartetEtter} />
				<br />
				<Datovelger label="Oppfølging startet til dato (valgfritt)" onChange={setOppfolgingStarterFor} />
				<br />
				<Button className="veilarbportefolje-knapp" onClick={() => setOpen(true)}>
					{props.tittel}
				</Button>
			</Card>
			<BekreftModal action={handleAdminResponse} isOpen={isOpen} setOpen={setOpen} description={props.tittel} />
		</>
	);
}

function Datovelger({ label, onChange }: { label: string; onChange: (dato: string) => void }) {
	const { datepickerProps, inputProps } = useDatepicker({
		onDateChange: dato => onChange(dato ? tilIsoDato(dato) : '')
	});

	return (
		<DatePicker {...datepickerProps}>
			<DatePicker.Input {...inputProps} label={label} />
		</DatePicker>
	);
}

function tilIsoDato(dato: Date): string {
	const mnd = String(dato.getMonth() + 1).padStart(2, '0');
	const dag = String(dato.getDate()).padStart(2, '0');
	return `${dato.getFullYear()}-${mnd}-${dag}`;
}

function isJsonString(str: string): boolean {
	try {
		JSON.stringify(str);
	} catch (e) {
		return false;
	}
	return true;
}
