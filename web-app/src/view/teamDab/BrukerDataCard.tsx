import React, { useMemo, useState } from 'react';
import { Dialog, hentDialoger } from '../../api/veilarbdialog';
import { hentOppfolgingsperioder } from '../../api/veilarboppfolging';
import { Aktivitet, DEFAULT_AKTIVITET_FELTER, hentAktiviteter, TiltaksAktivitet } from '../../api/veilarbaktivitet';
import { Button, TextField, Heading, Loader, Timeline, Table, UNSAFE_Combobox as Combobox } from '@navikt/ds-react';
import { Card } from '../../component/card/card';
import { BooleanTag } from '../../component/BooleanTag';
import { IdWithCopy } from '../../component/IdWithCopy';
import dayjs from 'dayjs';

interface PeriodeMedDialoger {
	id: string;
	startTidspunkt: string;
	sluttTidspunkt: string;
	startetBegrunnelse: string | undefined;
	dialoger: Dialog[];
	aktiviteter: Aktivitet[];
	tiltaksAktiviteter: TiltaksAktivitet[];
}

interface AktivitetKolonne {
	label: string;
	felt: string;
}

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

export const BrukerDataCard = () => {
	const [oppfolgingsperioder, setOppfolgingsperioder] = useState<PeriodeMedDialoger[] | null>(null);
	const [error, setError] = useState<string | undefined>(undefined);
	const [isLoading, setIsLoading] = useState(false);
	const [aktivitetKolonner, setAktivitetKolonner] = useState<AktivitetKolonne[]>(DEFAULT_AKTIVITET_KOLONNER);
	const [fnr, setFnr] = useState<string>('');
	const [valgtKolonneFelt, setValgtKolonneFelt] = useState<string>('');
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

		const nesteKolonner = [...aktivitetKolonner, { label: valgtFelt.label, felt: valgtFelt.value }];
		setAktivitetKolonner(nesteKolonner);
		setValgtKolonneFelt('');
		setKomboboxKey(current => current + 1);

		if (fnr) {
			void fetchBrukerDataMedFnr(fnr, nesteKolonner);
		}
	};

	const getValueByPath = (value: unknown, path: string) =>
		path.split('.').reduce<unknown>((acc, key) => {
			if (!acc || typeof acc !== 'object') {
				return undefined;
			}

			return (acc as Record<string, unknown>)[key];
		}, value);

	const fetchBrukerDataMedFnr = (fnr: string, kolonner: AktivitetKolonne[]) => {
		setIsLoading(true);
		return Promise.all([
			hentDialoger({ fnr }),
			hentOppfolgingsperioder({ fnr }),
			hentAktiviteter({
				fnr,
				aktivitetFelter: [
					...DEFAULT_AKTIVITET_FELTER,
					...kolonner.map(kolonne => kolonne.felt).filter((felt, index, list) => list.indexOf(felt) === index)
				]
			})
		])
			.then(([dialogerResponse, oppfolgingsperioderResponse, aktiviteterResponse]) => {
				const perioderMedAktiviteter = aktiviteterResponse?.data?.perioder || [];
				const tiltaksAktiviteter = aktiviteterResponse?.data?.tiltaksaktiviteter || [];
				const dialoger = dialogerResponse?.data?.dialoger || [];
				const perioder = (oppfolgingsperioderResponse?.data?.oppfolgingsPerioder || [])
					.map(periode => {
						return {
							...periode,
							dialoger: dialoger.filter(dialog => dialog.oppfolgingsperiode === periode.id),
							aktiviteter:
								perioderMedAktiviteter.find(
									periodeMedAktiviteter => periodeMedAktiviteter.id === periode.id
								)?.aktiviteter || [],
							tiltaksAktiviteter
						};
					})
					.sort((a, b) => new Date(b.startTidspunkt).getTime() - new Date(a.startTidspunkt).getTime());
				setOppfolgingsperioder(perioder);
			})
			.catch(e => {
				console.error(e);
			})
			.finally(() => {
				setIsLoading(false);
			});
	};

	const fetchBrukerData = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const submittedFnr = formData.get('fnr') as string;
		if (!submittedFnr) {
			setError('Fnr er påkrevd');
			return;
		}
		setFnr(submittedFnr);
		void fetchBrukerDataMedFnr(submittedFnr, aktivitetKolonner);
	};

	return (
		<Card className="large-card" innholdClassName=" flex flex-col space-y-4">
			<Heading size="medium">Brukerdata</Heading>
			<form className="space-y-4" onSubmit={fetchBrukerData}>
				<TextField name="fnr" label={'Fnr'} />
				<Button>Hent</Button>
			</form>
			<div className="flex items-end gap-2">
				<Combobox
					key={komboboxKey}
					label="Legg til kolonne"
					placeholder="Velg felt"
					options={tilgjengeligeKolonner}
					selectedOptions={
						valgtKolonneFelt
							? tilgjengeligeKolonner.filter(option => option.value === valgtKolonneFelt)
							: []
					}
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

			{isLoading && <Loader size="small" />}
			{error && <div className="error-message">{error}</div>}
			{oppfolgingsperioder && oppfolgingsperioder.length > 0 && (
				<Timeline>
					<Timeline.Row label={'Oppfølgingsperioder'}>
						{oppfolgingsperioder?.map(oppfolgingsperiode => (
							<Timeline.Period
								status={!oppfolgingsperiode.sluttTidspunkt ? 'success' : 'neutral'}
								start={dayjs(oppfolgingsperiode.startTidspunkt).toDate()}
								end={dayjs(oppfolgingsperiode.sluttTidspunkt ?? undefined).toDate()}
								key={oppfolgingsperiode.id}
							>
								{dayjs(oppfolgingsperiode.startTidspunkt).format('DD.MM.YYYY')} -
								{oppfolgingsperiode.sluttTidspunkt
									? dayjs(oppfolgingsperiode.sluttTidspunkt).format('DD.MM.YYYY')
									: '->'}
							</Timeline.Period>
						))}
					</Timeline.Row>
				</Timeline>
			)}
			{oppfolgingsperioder &&
				oppfolgingsperioder.map((periode: PeriodeMedDialoger) => (
					<div key={periode.id} className="mt-6 bg-gray-100 p-2 border border-gray-200 rounded-xl">
						<div className="flex ml-2 items-center">
							<span className="font-bold">Periode:</span>
							<IdWithCopy id={periode.id} label="" />
						</div>
						<div className="flex flex-col gap-8 p-1">
							<div className="bg-white shadow-sm rounded-xl p-2">
								<div className="flex-1">
									<span className="font-medium">Start:</span>{' '}
									{new Date(periode.startTidspunkt).toISOString()}
								</div>
								<div>
									<span className="font-medium">Slutt:</span>{' '}
									{periode.sluttTidspunkt ? new Date(periode.sluttTidspunkt).toISOString() : 'Aktiv'}
								</div>
								<div>
									<span className="font-medium">Startet begrunnelse:</span>
									{periode.startetBegrunnelse}
								</div>
							</div>

							<div className="bg-white shadow-sm rounded-xl ">
								<div className="font-bold p-2 border-b border-dashed border-gray-400">
									Dialoger ({periode.dialoger.length})
								</div>
								<Table size="small" className="p-2">
									<Table.Header>
										<Table.Row>
											<Table.HeaderCell />
											<Table.HeaderCell>Id</Table.HeaderCell>
											<Table.HeaderCell>Opprettet</Table.HeaderCell>
										</Table.Row>
									</Table.Header>
									<Table.Body>
										{periode.dialoger.map(dialog => (
											<Table.ExpandableRow
												aria-label={`Dialog ${dialog.id}`}
												key={dialog.id}
												content={
													<div className="ml-4">
														<div>
															Venter på svar fra:{' '}
															<BooleanTag value={dialog.venterPaSvar} />
														</div>
														<div>
															Ferdig behandlet:{' '}
															<BooleanTag value={dialog.ferdigBehandlet} />
														</div>
														<div>
															Lest: <BooleanTag value={dialog.lest} />
														</div>
														<div>
															Er lest av bruker:{' '}
															<BooleanTag value={dialog.erLestAvBruker} />
														</div>
														<div>
															Historisk: <BooleanTag value={dialog.historisk} />
														</div>
														<div>Opprettet dato: {dialog.opprettetDato}</div>
														<div>Siste dato: {dialog.sisteDato}</div>
														{dialog.lestAvBrukerTidspunkt && (
															<div>
																Lest av bruker tidspunkt: {dialog.lestAvBrukerTidspunkt}
															</div>
														)}
													</div>
												}
											>
												<Table.DataCell>
													<IdWithCopy id={dialog.id} label="DialogId" />
												</Table.DataCell>
												<Table.DataCell>
													{new Date(dialog.opprettetDato).toLocaleString()}
												</Table.DataCell>
											</Table.ExpandableRow>
										))}
									</Table.Body>
								</Table>
							</div>
							<div className="bg-white shadow-sm rounded-xl mt-2 space-y-2">
								<div className="font-bold border-b border-dashed border-gray-400 p-2">
									Aktiviteter ({periode.aktiviteter.length})
								</div>
								<Table size="small" className="p-2">
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
										{periode.aktiviteter.map(aktivitet => (
											<Table.ExpandableRow
												key={aktivitet.id}
												content={
													<div className="ml-4">
														<IdWithCopy
															id={aktivitet.funksjonellId}
															label="FunksjonellId"
														/>
														<div>Endret dato: {aktivitet.endretDato}</div>
														<div>Opprettet dato: {aktivitet.opprettetDato}</div>
														<div>Status: {aktivitet.status}</div>
														<div>
															Historisk: <BooleanTag value={aktivitet.historisk} />
														</div>
														<div>Type: {aktivitet.type}</div>
														{aktivitet.type === 'EKSTERNAKTIVITET' ? (
															<div>
																Ekstern aktivitet type:{' '}
																{aktivitet.eksternAktivitet.type}
															</div>
														) : null}
													</div>
												}
											>
												<Table.DataCell>
													<IdWithCopy id={aktivitet.id} label="AktivitetId" />
												</Table.DataCell>
												{DEFAULT_AKTIVITET_KOLONNER.map(kolonne => (
													<Table.DataCell key={kolonne.felt}>
														{String(getValueByPath(aktivitet, kolonne.felt) ?? '')}
													</Table.DataCell>
												))}
												{aktivitetKolonner.map(kolonne => (
													<Table.DataCell key={kolonne.felt}>
														{String(getValueByPath(aktivitet, kolonne.felt) ?? '')}
													</Table.DataCell>
												))}
											</Table.ExpandableRow>
										))}
									</Table.Body>
								</Table>
							</div>
							<div className="bg-white shadow-sm rounded-xl">
								<div className="font-bold p-2 border-b border-dashed border-gray-400">
									Gamle arenaaktiviteter (tiltaksaktiviteter) ({periode.tiltaksAktiviteter.length})
								</div>
								<Table size="small" className="p-2">
									<Table.Header>
										<Table.Row>
											<Table.HeaderCell />
											<Table.HeaderCell>Id</Table.HeaderCell>
											<Table.HeaderCell>Opprettet dato</Table.HeaderCell>
										</Table.Row>
									</Table.Header>
									<Table.Body>
										{periode.tiltaksAktiviteter.map(aktivitet => (
											<Table.ExpandableRow
												key={aktivitet.id}
												content={
													<div className="ml-4">
														<div>Fra dato: {aktivitet.fraDato}</div>
														<div>Til dato: {aktivitet.tilDato}</div>
														<div>Opprettet dato: {aktivitet.opprettetDato}</div>
														<div>Status: {aktivitet.status}</div>
														<div>
															Avtalt: <BooleanTag value={aktivitet.avtalt} />
														</div>
														<div>Type: {aktivitet.type}</div>
													</div>
												}
											>
												<Table.DataCell>
													<IdWithCopy id={aktivitet.id} label="AktivitetId" />
												</Table.DataCell>
												<Table.DataCell>{aktivitet.opprettetDato}</Table.DataCell>
											</Table.ExpandableRow>
										))}
									</Table.Body>
								</Table>
							</div>
						</div>
					</div>
				))}
		</Card>
	);
};
