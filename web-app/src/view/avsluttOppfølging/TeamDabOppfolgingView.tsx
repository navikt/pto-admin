import React, { useEffect, useState } from 'react';
import { Card } from '../../component/card/card';
import { BodyShort, Button, Heading, Textarea, TextField, Tag } from '@navikt/ds-react';
import {
	avsluttOppfolgingsperiode,
	batchAvsluttOppfolging, batchKandidatForUtmelding, batchStartOppfolgingMedForrigeAoKontor,
	hentUtmeldingskandidat,
	UtmeldingskandidatDto
} from '../../api/veilarboppfolging';
import { hentAktivitet } from '../../api/veilarbaktivitet';
import {
	hentArenaData,
	hentDeltakerAktivitetMapping,
	AdminArenaDataDto,
	AdminDeltakerAktivitetMappingDto
} from '../../api/aktivitet-arena-acl';
import { BrukerDataCard } from './BrukerDataCard';
import KontorCard from './KontorCard';
import { AoKontorAdmin } from './AoKontorAdmin';
import { KontorMerge } from './KontorMerge';
import { BrukerStatusCard } from './BrukerStatusCard';
import { StartOppfolging } from './StartOppfolging';
import { FlyttAktiviteterTilSistePeriodeCard } from './FlyttAktiviteterTilSistePeriodeCard';
import { HentAvslutningsstatusCard } from './HentAvslutningsCard';

export function TeamDabOppfolgingView() {
	const [tab, setTab] = useState<TabKey>(getTabFromLocalStorage());

	useEffect(() => {
		setTabInLocalStorage(tab);
	}, [tab]);

	return (
		<div className="flex justify-center p-2">
			<div className="border rounded-lg bg-white border-gray-300 flex-1 max-w-[1600px] p-2">
				<div className="flex flex-col gap-3 lg:flex-row">
					<aside className="w-full lg:w-72 shrink-0">
						<div className="rounded-lg border border-gray-200 bg-gray-50 p-2">
							<Heading size="small" spacing>
								Team DAB
							</Heading>
							<nav className="flex flex-col gap-4" aria-label="Team DAB meny">
								{menuGroups.map(group => (
									<div key={group.label} className="space-y-1">
										<Heading size="xsmall" className="px-1 py-3 text-orange-900 tracking-wide">
											{group.label}
										</Heading>
										<div className="flex flex-col gap-1">
											{group.items.map(item => {
												const isSelected = tab === item.value;
												return (
													<button
														key={item.value}
														type="button"
														onClick={() => setTab(item.value)}
														aria-current={isSelected ? 'page' : undefined}
														className={`flex w-full items-center rounded-md border px-3 py-2 text-left text-sm transition ${
															isSelected
																? 'border-blue-500 bg-blue-50 font-semibold text-blue-900 shadow-sm'
																: 'border-transparent hover:border-gray-200 hover:bg-white'
														}`}
													>
														{item.label}
													</button>
												);
											})}
										</div>
									</div>
								))}
							</nav>
						</div>
					</aside>
					<section className="min-w-0 flex-1 p-1 lg:p-2">{renderTabContent(tab)}</section>
				</div>
			</div>
		</div>
	);
}

enum TabKey {
	'avsluttBrukere' = 'avsluttBrukere',
	'hentAvslutningsstatus' = 'hentAvslutningsstatus',
	'kontor' = 'kontor',
	'ao-kontor-admin' = 'ao-kontor-admin',
	'kontor-merge' = 'kontor-merge',
	'aktiviteter' = 'aktiviteter',
	'bruker-status' = 'bruker-status',
	'utmeldingskandidater' = 'utmeldingskandidater',
	'aktivitet-arena-acl' = 'aktivitet-arena-acl',
	'start-oppfolging' = 'start-oppfolging',
	'flytt-aktiviteter' = 'flytt-aktiviteter'
}

const menuGroups: Array<{
	label: string;
	items: Array<{ value: TabKey; label: string }>;
}> = [
	{
		label: 'Oppfølging',
		items: [
			{ value: TabKey['start-oppfolging'], label: 'Start Oppfølging' },
			{ value: TabKey.avsluttBrukere, label: 'Avslutt oppfølging' },
			{ value: TabKey.hentAvslutningsstatus, label: 'Hent avslutningsstatus' },
			{ value: TabKey['bruker-status'], label: 'Brukerstatus' },
			{ value: TabKey.utmeldingskandidater, label: 'Utmeldingskandidater' }
		]
	},
	{
		label: 'Kontor',
		items: [
			{ value: TabKey.kontor, label: 'Kontorhistorikk' },
			{ value: TabKey['ao-kontor-admin'], label: 'AO Kontor Admin' },
			{ value: TabKey['kontor-merge'], label: 'Kontorsammenslåing' }
		]
	},
	{
		label: 'Data',
		items: [
			{ value: TabKey.aktiviteter, label: 'Dialog og aktiviteter' },
			{ value: TabKey['flytt-aktiviteter'], label: 'Flytt aktiviteter' },
			{ value: TabKey['aktivitet-arena-acl'], label: 'Aktivitet Arena ACL' }
		]
	}
];

function renderTabContent(tab: TabKey) {
	switch (tab) {
		case TabKey.avsluttBrukere:
			return (
				<div className="flex flex-row flex-wrap gap-4">
					<AvsluttOppfolgingForMangeBrukereCard />
					<AvsluttOppfolgingsperiode />
				</div>
			);
		case TabKey.hentAvslutningsstatus:
			return <HentAvslutningsstatusCard />;
		case TabKey.aktiviteter:
			return <BrukerDataCard />;
		case TabKey.kontor:
			return <KontorCard />;
		case TabKey['ao-kontor-admin']:
			return <AoKontorAdmin />;
		case TabKey['kontor-merge']:
			return <KontorMerge />;
		case TabKey['bruker-status']:
			return <BrukerStatusCard />;
		case TabKey.utmeldingskandidater:
			return <UtmeldingskandidaterCard />;
		case TabKey['aktivitet-arena-acl']:
			return <AktivitetArenaAclCard />;
		case TabKey['start-oppfolging']:
			return <StartOppfolging />;
		case TabKey['flytt-aktiviteter']:
			return <FlyttAktiviteterTilSistePeriodeCard />;
		default:
			return <BrukerDataCard />;
	}
}

function AvsluttOppfolgingForMangeBrukereCard() {
	const [aktorIds, setAktorIds] = useState('');
	const [begrunnelse, setBegrunnelse] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(undefined);

	async function handleSubmit(e: any) {
		e.preventDefault();
		const aktorIdList = aktorIds.split(',').map(id => id.trim());
		try {
			setError(undefined);
			setIsLoading(true);
			await batchAvsluttOppfolging({ aktorIds: aktorIdList, begrunnelse });
		} catch (e: any) {
			setError(e?.toString());
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<Card className="small-card" innholdClassName="hovedside__card-innhold">
			<Heading size="medium">Avslutt oppfølging for mange brukere</Heading>
			<form onSubmit={handleSubmit} className="space-y-4">
				<Textarea
					label="AktørId-liste (kommaseparert)"
					name="aktorIds"
					value={aktorIds}
					onChange={e => setAktorIds(e.target.value)}
					disabled={isLoading}
				/>
				<TextField
					label="Begrunnelse"
					name="begrunnelse"
					value={begrunnelse}
					onChange={e => setBegrunnelse(e.target.value)}
					disabled={isLoading}
				/>

				{error && <div className="error-message">{error}</div>}

				<Button type="submit" disabled={isLoading}>
					Avslutt oppfølging
				</Button>
			</form>
		</Card>
	);
}

function AvsluttOppfolgingsperiode() {
	const [error, setError] = useState<string | undefined>(undefined);
	const [aktorId, setAktorId] = useState('');
	const [begrunnelse, setBegrunnelse] = useState('');
	const [oppfolgingsperiodeUuid, setOppfolgingsperiodeUuid] = useState('');

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);

		const aktorId = formData.get('aktorId') as string;
		const begrunnelse = formData.get('begrunnelse') as string;
		const oppfolgingsperiodeUuid = formData.get('oppfolgingsperiodeUuid') as string;

		try {
			setError(undefined);
			await avsluttOppfolgingsperiode({ aktorId, begrunnelse, oppfolgingsperiodeUuid });
		} catch (e: any) {
			setError(e?.toString());
		}
	}

	return (
		<Card className="small-card" innholdClassName="hovedside__card-innhold">
			<Heading size="medium">Avslutt Oppfølgingsperiode</Heading>
			<form className="space-y-4" onSubmit={handleSubmit}>
				<TextField label="AktørId" name="aktorId" value={aktorId} onChange={e => setAktorId(e.target.value)} />
				<TextField
					label="Begrunnelse"
					name="begrunnelse"
					value={begrunnelse}
					onChange={e => setBegrunnelse(e.target.value)}
				/>
				<TextField
					label="Oppfølgingsperiode UUID"
					name="oppfolgingsperiodeUuid"
					value={oppfolgingsperiodeUuid}
					onChange={e => setOppfolgingsperiodeUuid(e.target.value)}
				/>

				{error && <div className="error-message">{error}</div>}

				<Button type="submit">Avslutt oppfølgingsperiode</Button>
			</form>
		</Card>
	);
}

const tabKey = 'last-selected-tab';
const getTabFromLocalStorage = (): TabKey => {
	const lastSelectedTab = localStorage.getItem(tabKey);
	if (lastSelectedTab && Object.values(TabKey).includes(lastSelectedTab as TabKey)) {
		return lastSelectedTab as TabKey;
	}
	return TabKey.aktiviteter;
};
const setTabInLocalStorage = (view: TabKey) => {
	localStorage.setItem(tabKey, view);
};

function UtmeldingskandidaterCard() {
	const [fnr, setFnr] = useState('');
	const [data, setData] = useState<UtmeldingskandidatDto | null>(null);
	const [error, setError] = useState<string | undefined>(undefined);
	const [isLoading, setIsLoading] = useState(false);

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		try {
			setError(undefined);
			setIsLoading(true);
			const response = await hentUtmeldingskandidat(fnr);
			setData(response.data.utmeldingskandidat);
		} catch (e: any) {
			setError(e?.toString());
			setData(null);
		} finally {
			setIsLoading(false);
		}
	}

	const postUtmeldingskandidat = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const oppfolgingsperiodeIder = formData.get('oppfolgingsperiodeIder') as string;
		setIsLoading(true);
		await batchKandidatForUtmelding({ oppfolgingsperiodeIder: oppfolgingsperiodeIder.split(',').map(it => it.trim()) });
		setIsLoading(false);
	};

	return (
		<>
			<Card className="small-card" innholdClassName="hovedside__card-innhold">
				<Heading size="medium">Utmeldingskandidater</Heading>
				<form className="space-y-4" onSubmit={handleSubmit}>
					<TextField
						label="Fødselsnummer"
						value={fnr}
						onChange={e => setFnr(e.target.value)}
						disabled={isLoading}
					/>
					{error && <div className="error-message">{error}</div>}
					<Button type="submit" disabled={isLoading}>
						Hent utmeldingskandidat
					</Button>
				</form>
				{data && (
					<div className="mt-6 space-y-4">
						<BodyShort>
							<Tag size="small" variant="success-moderate">
								{data.tag ?? 'Ingen tag'}
							</Tag>
						</BodyShort>
						<div>
							<Heading size="small">Aktiv forlengelse</Heading>
							{data.aktivForlengelse ? (
								<div className="space-y-1">
									<BodyShort>Utfort av type: {data.aktivForlengelse.utfortAvType}</BodyShort>
									<BodyShort>Utfort av: {data.aktivForlengelse.utfortAv ?? '-'}</BodyShort>
									<BodyShort>Hendelse tidspunkt: {data.aktivForlengelse.hendelseTidspunkt}</BodyShort>
									<BodyShort>Forlenget til: {data.aktivForlengelse.forlengetTil ?? '-'}</BodyShort>
								</div>
							) : (
								<BodyShort>Ingen aktiv forlengelse</BodyShort>
							)}
						</div>
						<div>
							<Heading size="small">Hendelser</Heading>
							{data.utmeldingskandidatHendelser?.length ? (
								<div className="space-y-2">
									{data.utmeldingskandidatHendelser.map((hendelse, index) => (
										<div key={`${hendelse.hendelseTidspunkt}-${index}`}
										     className="border rounded p-3">
											<BodyShort>Type: {hendelse.type}</BodyShort>
											<BodyShort>Utført av type: {hendelse.utfortAvType}</BodyShort>
											<BodyShort>Utført av: {hendelse.utfortAv ?? '-'}</BodyShort>
											<BodyShort>Tidspunkt: {hendelse.hendelseTidspunkt}</BodyShort>
											<BodyShort>Forlenget til: {hendelse.forlengetTil ?? '-'}</BodyShort>
										</div>
									))}
								</div>
							) : (
								<BodyShort>Ingen hendelser</BodyShort>
							)}
						</div>
					</div>
				)}
			</Card>

			<Card>
				<Heading size="medium">Opprett utmeldingskandidat ikke lenger arbeidssøker</Heading>
				<form className="space-y-4" onSubmit={postUtmeldingskandidat}>
					<Textarea name="oppfolgingsperiodeIder" label={'OppfølgingsperiodeId-er (kommaseparert)'} />
					<Button loading={isLoading} disabled={isLoading}>
						Send
					</Button>
				</form>
			</Card>
		</>
	);
}

function AktivitetArenaAclCard() {
	return (
		<div className="flex flex-row flex-wrap gap-4">
			<DeltakerAktivitetMappingCard />
			<ArenaDataCard />
		</div>
	);
}

function DeltakerAktivitetMappingCard() {
	const [deltakerId, setDeltakerId] = useState('');
	const [aktivitetId, setAktivitetId] = useState('');
	const [funksjonellId, setFunksjonellId] = useState('');
	const [oppfolgingsperiodeId, setOppfolgingsperiodeId] = useState('');
	const [data, setData] = useState<AdminDeltakerAktivitetMappingDto[] | null>(null);
	const [error, setError] = useState<string | undefined>(undefined);
	const [lookupError, setLookupError] = useState<string | undefined>(undefined);
	const [isLoading, setIsLoading] = useState(false);
	const [isLookupLoading, setIsLookupLoading] = useState(false);

	async function handleLookupFunksjonellId(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		try {
			setLookupError(undefined);
			setIsLookupLoading(true);
			const response = await hentAktivitet({ aktivitetId });
			const foundFunksjonellId = response.data.aktivitet?.funksjonellId;
			if (!foundFunksjonellId) {
				setLookupError('Fant ingen funksjonellId på aktiviteten');
				return;
			}
			setFunksjonellId(foundFunksjonellId);
		} catch (e: any) {
			setLookupError(e?.toString());
		} finally {
			setIsLookupLoading(false);
		}
	}

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		try {
			setError(undefined);
			setIsLoading(true);
			const response = await hentDeltakerAktivitetMapping({
				deltakerId: Number(deltakerId),
				funksjonellId: funksjonellId || undefined,
				oppfolgingsperiodeId: oppfolgingsperiodeId || undefined
			});
			setData(response.data);
		} catch (e: any) {
			setError(e?.toString());
			setData(null);
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<Card className="small-card" innholdClassName="hovedside__card-innhold">
			<Heading size="medium">Deltaker aktivitet mapping</Heading>
			<form className="space-y-4" onSubmit={handleLookupFunksjonellId}>
				<TextField
					name="aktivitetId"
					label="Aktivitet id"
					value={aktivitetId}
					onChange={e => setAktivitetId(e.target.value)}
					disabled={isLookupLoading}
				/>
				{lookupError && <div className="error-message">{lookupError}</div>}
				<Button type="submit" disabled={isLookupLoading || !aktivitetId}>
					Hent funksjonell id fra aktivitet
				</Button>
			</form>
			<form className="space-y-4 mt-4" onSubmit={handleSubmit}>
				<TextField
					name="deltakerId"
					label="Deltaker id (path)"
					value={deltakerId}
					onChange={e => setDeltakerId(e.target.value)}
					disabled={isLoading}
				/>
				<TextField
					name="funksjonellId"
					label="Funksjonell id"
					value={funksjonellId}
					onChange={e => setFunksjonellId(e.target.value)}
					disabled={isLoading}
				/>
				<TextField
					name="oppfolgingsperiodeId"
					label="Oppfølgingsperiode id"
					value={oppfolgingsperiodeId}
					onChange={e => setOppfolgingsperiodeId(e.target.value)}
					disabled={isLoading}
				/>
				{error && <div className="error-message">{error}</div>}
				<Button type="submit" disabled={isLoading}>
					Hent mapping
				</Button>
			</form>
			{data && (
				<div className="mt-4 space-y-3">
					{data.length ? (
						data.map(item => (
							<div key={`${item.deltakelseId}-${item.aktivitetId}`} className="border rounded p-3">
								<BodyShort>Deltakelse id: {item.deltakelseId}</BodyShort>
								<BodyShort>Aktivitet id: {item.aktivitetId}</BodyShort>
								<BodyShort>Aktivitet kategori: {item.aktivitetKategori}</BodyShort>
								<BodyShort>Oppfølgingsperiode id: {item.oppfolgingsPeriodeId}</BodyShort>
								<BodyShort>
									Oppfølgingsperiode sluttidspunkt: {item.oppfolgingsPeriodeSluttTidspunkt ?? '-'}
								</BodyShort>
							</div>
						))
					) : (
						<BodyShort>Ingen treff</BodyShort>
					)}
				</div>
			)}
		</Card>
	);
}

function ArenaDataCard() {
	const [arenaId, setArenaId] = useState('');
	const [data, setData] = useState<AdminArenaDataDto[] | null>(null);
	const [error, setError] = useState<string | undefined>(undefined);
	const [isLoading, setIsLoading] = useState(false);

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		try {
			setError(undefined);
			setIsLoading(true);
			const response = await hentArenaData(arenaId);
			setData(response.data);
		} catch (e: any) {
			setError(e?.toString());
			setData(null);
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<Card className="small-card" innholdClassName="hovedside__card-innhold">
			<Heading size="medium">Arena data</Heading>
			<form className="space-y-4" onSubmit={handleSubmit}>
				<TextField
					label="Arena id"
					value={arenaId}
					onChange={e => setArenaId(e.target.value)}
					disabled={isLoading}
				/>
				{error && <div className="error-message">{error}</div>}
				<Button type="submit" disabled={isLoading}>
					Hent arena data
				</Button>
			</form>
			{data && (
				<div className="mt-4 space-y-3">
					{data.length ? (
						data.map(item => (
							<div key={item.id} className="border rounded p-3">
								<BodyShort>Id: {item.id}</BodyShort>
								<BodyShort>Tabell: {item.arenaTableName}</BodyShort>
								<BodyShort>Arena id: {item.arenaId}</BodyShort>
								<BodyShort>Operation: {item.operation}</BodyShort>
								<BodyShort>Operation posisjon: {item.operationPosition}</BodyShort>
								<BodyShort>Operation tidspunkt: {item.operationTimestamp}</BodyShort>
								<BodyShort>Ingest status: {item.ingestStatus}</BodyShort>
								<BodyShort>Ingested timestamp: {item.ingestedTimestamp ?? '-'}</BodyShort>
								<BodyShort>Ingest attempts: {item.ingestAttempts}</BodyShort>
								<BodyShort>Last attempted: {item.lastAttempted ?? '-'}</BodyShort>
								<BodyShort>Note: {item.note ?? '-'}</BodyShort>
							</div>
						))
					) : (
						<BodyShort>Ingen treff</BodyShort>
					)}
				</div>
			)}
		</Card>
	);
}
