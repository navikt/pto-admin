import React, { useEffect, useState } from 'react';
import { Card } from '../../component/card/card';
import { BodyShort, Button, Heading, Tabs, Textarea, TextField, Tag } from '@navikt/ds-react';
import {
	avsluttOppfolgingsperiode,
	batchAvsluttOppfolging,
	hentAvslutningStatusForOppfolgingsperioder,
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

export function TeamDabOppfolgingView() {
	const [tab, setTab] = useState<TabKey>(getTabFromLocalStorage());

	useEffect(() => {
		setTabInLocalStorage(tab);
	}, [tab]);

	return (
		<div className="flex p-4 justify-center">
			<div className="border rounded-t-lg bg-white border-gray-300 flex-1 max-w-[1200px]">
				<Tabs value={tab} onChange={value => setTab(value as TabKey)}>
					<Tabs.List>
						<Tabs.Tab value={TabKey.avsluttBrukere} label={'Avslutt brukere'} />
						<Tabs.Tab value={TabKey.hentAvslutningsstatus} label={'Hent avslutningsstatus'} />
						<Tabs.Tab value={TabKey.aktiviteter} label={'Dialog og aktiviteter'} />
						<Tabs.Tab value={TabKey.kontor} label={'Kontor'} />
						<Tabs.Tab value={TabKey['ao-kontor-admin']} label={'AO Kontor Admin'} />
						<Tabs.Tab value={TabKey['kontor-merge']} label={'Kontorsammenslåing'} />
						<Tabs.Tab value={TabKey['bruker-status']} label={'Brukerstatus'} />
						<Tabs.Tab value={TabKey.utmeldingskandidater} label={'Utmeldingskandidater'} />
						<Tabs.Tab value={TabKey['aktivitet-arena-acl']} label={'Aktivitet Arena ACL'} />
						<Tabs.Tab value={TabKey['start-oppfolging']} label={'Start Oppfølging'} />
					</Tabs.List>
					<Tabs.Panel value={TabKey.avsluttBrukere}>
						<div className="flex flex-row flex-wrap gap-4">
							<AvsluttOppfolgingForMangeBrukereCard />
							<AvsluttOppfolgingsperiode />
						</div>
					</Tabs.Panel>
					<Tabs.Panel value={TabKey.hentAvslutningsstatus}>
						<HentAvslutningsstatusCard />
					</Tabs.Panel>
					<Tabs.Panel value={TabKey.aktiviteter}>
						<BrukerDataCard />
					</Tabs.Panel>
					<Tabs.Panel value={TabKey.kontor}>
						<KontorCard />
					</Tabs.Panel>
					<Tabs.Panel value={TabKey['ao-kontor-admin']}>
						<AoKontorAdmin />
					</Tabs.Panel>
					<Tabs.Panel value={TabKey['kontor-merge']}>
						<KontorMerge />
					</Tabs.Panel>
					<Tabs.Panel value={TabKey['bruker-status']}>
						<BrukerStatusCard />
					</Tabs.Panel>
					<Tabs.Panel value={TabKey.utmeldingskandidater}>
						<UtmeldingskandidaterCard />
					</Tabs.Panel>
					<Tabs.Panel value={TabKey['aktivitet-arena-acl']}>
						<AktivitetArenaAclCard />
					</Tabs.Panel>
					<Tabs.Panel value={TabKey['start-oppfolging']}>
						<StartOppfolging />
					</Tabs.Panel>
				</Tabs>
			</div>
		</div>
	);
}

function HentAvslutningsstatusCard() {
	const [oppfolgingsperiodeIder, setOppfolgingsperiodeIder] = useState('');
	const [data, setData] = useState<Record<string, unknown>[] | null>(null);
	const [error, setError] = useState<string | undefined>(undefined);
	const [isLoading, setIsLoading] = useState(false);

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		try {
			setError(undefined);
			setIsLoading(true);
			const response = await hentAvslutningStatusForOppfolgingsperioder({
				oppfolgingsperiodeIder: oppfolgingsperiodeIder
					.split(',')
					.map(id => id.trim())
					.filter(Boolean)
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
			<Heading size="medium">Hent avslutningsstatus</Heading>
			<form className="space-y-4" onSubmit={handleSubmit}>
				<Textarea
					label="Oppfølgingsperiode IDer (kommaseparert)"
					value={oppfolgingsperiodeIder}
					onChange={e => setOppfolgingsperiodeIder(e.target.value)}
					disabled={isLoading}
				/>
				{error && <div className="error-message">{error}</div>}
				<Button type="submit" disabled={isLoading}>
					Hent avslutningsstatus
				</Button>
			</form>
			{data && (
				<div className="mt-4 space-y-3">
					{data.length ? (
						data.map((item, index) => (
							<div key={index} className="border rounded p-3">
								<BodyShort>{JSON.stringify(item)}</BodyShort>
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

enum TabKey {
	'avsluttBrukere' = 'avsluttBrukere',
	'hentAvslutningsstatus' = 'hentAvslutningsstatus',
	'kontor' = 'kontor',
	'ao-kontor-admin' = 'ao-kontor-admin',
	'kontor-merge' = 'kontor-merge',
	'aktiviteter' = 'aktiviteter',
	'bruker-status' = 'bruker-status',
	'utmeldingskandidater' = 'utmeldingskandidater',
	'aktivitet-arena-acl' = 'aktivitet-arena-acl'
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

	return (
		<Card className="small-card" innholdClassName="hovedside__card-innhold">
			<Heading size="medium">Utmeldingskandidater</Heading>
			<form className="space-y-4" onSubmit={handleSubmit}>
				<TextField label="Fødselsnummer" value={fnr} onChange={e => setFnr(e.target.value)} disabled={isLoading} />
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
									<div key={`${hendelse.hendelseTidspunkt}-${index}`} className="border rounded p-3">
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
								<BodyShort>Oppfølgingsperiode sluttidspunkt: {item.oppfolgingsPeriodeSluttTidspunkt ?? '-'}</BodyShort>
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
				<TextField label="Arena id" value={arenaId} onChange={e => setArenaId(e.target.value)} disabled={isLoading} />
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
