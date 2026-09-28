import React, { useMemo, useState } from 'react';
import { Button, Heading, Table, TextField, UNSAFE_Combobox as Combobox } from '@navikt/ds-react';
import { Card } from '../../component/card/card';
import { Aktivitet, DEFAULT_AKTIVITET_FELTER, hentAktivitet } from '../../api/veilarbaktivitet';
import { BooleanTag } from '../../component/BooleanTag';
import { IdWithCopy } from '../../component/IdWithCopy';
import { AktivitetKolonne, renderAktivitetTabellKolonner } from './aktivitetTable';

interface AktivitetFeltOption {
	label: string;
	value: string;
}

const DEFAULT_AKTIVITET_KOLONNER: AktivitetKolonne[] = [
	{ label: 'Versjon', felt: 'versjon' },
	{ label: 'Sist endret', felt: 'endretDato' }
];

const RESERVERT_AKTIVITET_FELTER = ['id', ...DEFAULT_AKTIVITET_KOLONNER.map(kolonne => kolonne.felt)];

const AKTIVITET_FELT_OPTIONS: AktivitetFeltOption[] = [
	{ label: 'Tittel', value: 'tittel' },
	{ label: 'Beskrivelse', value: 'beskrivelse' },
	{ label: 'Lenke', value: 'lenke' },
	{ label: 'Fra dato', value: 'fraDato' },
	{ label: 'Til dato', value: 'tilDato' },
	{ label: 'Opprettet dato', value: 'opprettetDato' },
	{ label: 'Endret dato', value: 'endretDato' },
	{ label: 'Endret av', value: 'endretAv' },
	{ label: 'Avsluttet kommentar', value: 'avsluttetKommentar' },
	{ label: 'Avtalt', value: 'avtalt' },
	{ label: 'Forhåndsorientering id', value: 'forhaandsorientering.id' },
	{ label: 'Forhåndsorientering type', value: 'forhaandsorientering.type' },
	{ label: 'Forhåndsorientering tekst', value: 'forhaandsorientering.tekst' },
	{ label: 'Forhåndsorientering lest dato', value: 'forhaandsorientering.lestDato' },
	{ label: 'Endret av type', value: 'endretAvType' },
	{ label: 'Transaksjonstype', value: 'transaksjonsType' },
	{ label: 'Målid', value: 'malid' },
	{ label: 'Oppfølgingsperiode id', value: 'oppfolgingsperiodeId' },
	{ label: 'Etikett', value: 'etikett' },
	{ label: 'Kontaktperson', value: 'kontaktperson' },
	{ label: 'Portefølje Kafka offset Aiven', value: 'portefoljeKafkaOffsetAiven' },
	{ label: 'Arbeidsgiver', value: 'arbeidsgiver' },
	{ label: 'Arbeidssted', value: 'arbeidssted' },
	{ label: 'Stillingstittel', value: 'stillingsTittel' },
	{ label: 'Hensikt', value: 'hensikt' },
	{ label: 'Oppfølging', value: 'oppfolging' },
	{ label: 'Antall stillinger søkes', value: 'antallStillingerSokes' },
	{ label: 'Antall stillinger i uken', value: 'antallStillingerIUken' },
	{ label: 'Avtale oppfølging', value: 'avtaleOppfolging' },
	{ label: 'Jobbstatus', value: 'jobbStatus' },
	{ label: 'Ansettelsesforhold', value: 'ansettelsesforhold' },
	{ label: 'Arbeidstid', value: 'arbeidstid' },
	{ label: 'Behandling type', value: 'behandlingType' },
	{ label: 'Behandling sted', value: 'behandlingSted' },
	{ label: 'Effekt', value: 'effekt' },
	{ label: 'Behandling oppfølging', value: 'behandlingOppfolging' },
	{ label: 'Adresse', value: 'adresse' },
	{ label: 'Forberedelser', value: 'forberedelser' },
	{ label: 'Kanal', value: 'kanal' },
	{ label: 'Referat', value: 'referat' },
	{ label: 'Referat publisert', value: 'erReferatPublisert' },
	{ label: 'CV kan deles', value: 'stillingFraNavData.cvKanDelesData.kanDeles' },
	{ label: 'CV delt endret tidspunkt', value: 'stillingFraNavData.cvKanDelesData.endretTidspunkt' },
	{ label: 'CV delt endret av', value: 'stillingFraNavData.cvKanDelesData.endretAv' },
	{ label: 'CV delt endret av type', value: 'stillingFraNavData.cvKanDelesData.endretAvType' },
	{ label: 'CV delt avtalt dato', value: 'stillingFraNavData.cvKanDelesData.avtaltDato' },
	{ label: 'Søknadsfrist', value: 'stillingFraNavData.soknadsfrist' },
	{ label: 'Svarfrist', value: 'stillingFraNavData.svarfrist' },
	{ label: 'Stilling fra NAV arbeidsgiver', value: 'stillingFraNavData.arbeidsgiver' },
	{ label: 'Bestillings id', value: 'stillingFraNavData.bestillingsId' },
	{ label: 'Stillings id', value: 'stillingFraNavData.stillingsId' },
	{ label: 'Stilling fra NAV arbeidssted', value: 'stillingFraNavData.arbeidssted' },
	{ label: 'Søknadsstatus', value: 'stillingFraNavData.soknadsstatus' },
	{ label: 'Livsløpsstatus', value: 'stillingFraNavData.livslopsStatus' },
	{ label: 'Varsel id', value: 'stillingFraNavData.varselId' },
	{ label: 'Detaljer', value: 'stillingFraNavData.detaljer' },
	{ label: 'Kontaktperson navn', value: 'stillingFraNavData.kontaktpersonData.navn' },
	{ label: 'Kontaktperson tittel', value: 'stillingFraNavData.kontaktpersonData.tittel' },
	{ label: 'Kontaktperson mobil', value: 'stillingFraNavData.kontaktpersonData.mobil' },
	{ label: 'Ekstern aktivitet type', value: 'eksternAktivitet.type' }
];

export function AktivitetDataCard() {
	const [aktivitetId, setAktivitetId] = useState('');
	const [versjon, setVersjon] = useState('');
	const [error, setError] = useState<string | undefined>(undefined);
	const [isLoading, setIsLoading] = useState(false);
	const [aktivitet, setAktivitet] = useState<Aktivitet | null>(null);
	const [aktivitetKolonner, setAktivitetKolonner] = useState<AktivitetKolonne[]>(DEFAULT_AKTIVITET_KOLONNER);
	const [valgtKolonneFelt, setValgtKolonneFelt] = useState('');
	const [komboboxKey, setKomboboxKey] = useState(0);

	const tilgjengeligeKolonner = useMemo(
		() =>
			AKTIVITET_FELT_OPTIONS.filter(
				option =>
					!RESERVERT_AKTIVITET_FELTER.includes(option.value) &&
					!aktivitetKolonner.some(kolonne => kolonne.felt === option.value)
			),
		[aktivitetKolonner]
	);

	const leggTilAktivitetKolonne = (felt: string) => {
		const valgtFelt = tilgjengeligeKolonner.find(option => option.value === felt);
		if (!valgtFelt) {
			return;
		}

		setAktivitetKolonner(current => [...current, { label: valgtFelt.label, felt: valgtFelt.value }]);
		setValgtKolonneFelt('');
		setKomboboxKey(current => current + 1);

		if (aktivitetId.trim()) {
			void hentAktivitetMedFelter(aktivitetId.trim(), versjon.trim(), [
				...aktivitetKolonner,
				{ label: valgtFelt.label, felt: valgtFelt.value }
			]);
		}
	};

	const hentAktivitetMedFelter = async (
		id: string,
		versjonToFetch: string,
		kolonnerTilLeggTil: AktivitetKolonne[]
	) => {
		const ekstraFelter = kolonnerTilLeggTil
			.map(kolonne => kolonne.felt)
			.filter(felt => !DEFAULT_AKTIVITET_FELTER.includes(felt));
		const response = await hentAktivitet({
			aktivitetId: id,
			versjon: versjonToFetch || undefined,
			aktivitetFelter: [...DEFAULT_AKTIVITET_FELTER, ...ekstraFelter]
		});
		setAktivitet(response.data.aktivitet);
		if (!response.data.aktivitet) {
			setError('Fant ingen aktivitet');
		}
	};

	async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
		e.preventDefault();
		if (!aktivitetId.trim()) {
			setError('Aktivitet id er påkrevd');
			setAktivitet(null);
			return;
		}

		try {
			setError(undefined);
			setIsLoading(true);
			await hentAktivitetMedFelter(aktivitetId.trim(), versjon.trim(), aktivitetKolonner);
		} catch (e: any) {
			setError(e?.toString() ?? 'Noe gikk galt ved henting av aktivitet.');
			setAktivitet(null);
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<Card className="w-full" innholdClassName="hovedside__card-innhold">
			<Heading size="medium">Aktivitet</Heading>
			<form className="space-y-4" onSubmit={handleSubmit}>
				<TextField
					name="aktivitetId"
					label="Aktivitet id"
					value={aktivitetId}
					onChange={e => setAktivitetId(e.target.value)}
					disabled={isLoading}
				/>
				<TextField
					name="versjon"
					label="Versjon (valgfri)"
					value={versjon}
					onChange={e => setVersjon(e.target.value)}
					disabled={isLoading}
				/>
				{error && <div className="error-message">{error}</div>}
				<Button type="submit" disabled={isLoading}>
					Hent aktivitet
				</Button>
			</form>
			<div className="flex self-end items-end gap-2 mt-4">
				<Combobox
					key={komboboxKey}
					label="Legg til kolonne"
					placeholder="Velg felt"
					options={tilgjengeligeKolonner}
					selectedOptions={valgtKolonneFelt ? tilgjengeligeKolonner.filter(option => option.value === valgtKolonneFelt) : []}
					onToggleSelected={(felt, selected) => {
						setValgtKolonneFelt(selected ? felt : '');
					}}
					shouldAutocomplete
				/>
				<Button
					type="button"
					size="small"
					variant="secondary"
					disabled={!valgtKolonneFelt}
					onClick={() => leggTilAktivitetKolonne(valgtKolonneFelt)}
				>
					Legg til
				</Button>
			</div>
			{aktivitet && (
				<div className="mt-4 overflow-x-auto">
					<Table size="small">
						<Table.Header>
							<Table.Row>
								<Table.HeaderCell />
								<Table.HeaderCell>Id</Table.HeaderCell>
								{DEFAULT_AKTIVITET_KOLONNER.map(kolonne => (
									<Table.HeaderCell key={kolonne.felt}>{kolonne.label}</Table.HeaderCell>
								))}
								{aktivitetKolonner.map(kolonne => (
									<Table.HeaderCell key={kolonne.felt}>{kolonne.label}</Table.HeaderCell>
								))}
							</Table.Row>
						</Table.Header>
						<Table.Body>
							<Table.ExpandableRow
								key={aktivitet.id}
								content={
									<div className="ml-4">
										<IdWithCopy id={aktivitet.funksjonellId} label="FunksjonellId" />
										<div>Endret dato: {aktivitet.endretDato}</div>
										<div>Opprettet dato: {aktivitet.opprettetDato}</div>
										<div>Status: {aktivitet.status}</div>
										<div>
											Historisk: <BooleanTag value={aktivitet.historisk} />
										</div>
										<div>Type: {aktivitet.type}</div>
										{aktivitet.type === 'EKSTERNAKTIVITET' ? (
											<div>Ekstern aktivitet type: {aktivitet.eksternAktivitet.type}</div>
										) : null}
									</div>
								}
							>
								<Table.DataCell>
									<IdWithCopy id={aktivitet.id} label="AktivitetId" />
								</Table.DataCell>
								{renderAktivitetTabellKolonner(aktivitet, DEFAULT_AKTIVITET_KOLONNER)}
								{renderAktivitetTabellKolonner(aktivitet, aktivitetKolonner)}
							</Table.ExpandableRow>
						</Table.Body>
					</Table>
				</div>
			)}
		</Card>
	);
}
