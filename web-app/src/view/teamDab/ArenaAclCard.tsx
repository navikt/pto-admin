import React, { useState } from 'react';
import {
	AdminArenaDataDto,
	AdminDeltakerAktivitetMappingDto,
	hentArenaData,
	hentDeltakerAktivitetMapping
} from '../../api/aktivitet-arena-acl';
import { Card } from '../../component/card/card';
import { BodyShort, Button, Heading, Table, Tag, Tabs, TextField } from '@navikt/ds-react';
import { hentAktivitet } from '../../api/veilarbaktivitet';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const TAB_VALUES = {
	deltakerAktivitetMapping: 'deltaker-aktivitet-mapping',
	arenaData: 'arena-data'
} as const;

export function AktivitetArenaAclCard() {
	const [activeTab, setActiveTab] = useState<(typeof TAB_VALUES)[keyof typeof TAB_VALUES]>(
		TAB_VALUES.deltakerAktivitetMapping
	);
	const [selectedArenaId, setSelectedArenaId] = useState('');
	const [selectedOppfolgingsperiodeId, setSelectedOppfolgingsperiodeId] = useState('');
	const [selectedFunksjonellId, setSelectedFunksjonellId] = useState('');
	const [arenaLookupToken, setArenaLookupToken] = useState(0);
	const [mappingLookupToken, setMappingLookupToken] = useState(0);

	const openArenaData = (arenaId: string) => {
		setSelectedArenaId(arenaId);
		setSelectedOppfolgingsperiodeId('');
		setSelectedFunksjonellId('');
		setActiveTab(TAB_VALUES.arenaData);
		setArenaLookupToken(current => current + 1);
	};

	const openDeltakerAktivitetMapping = (oppfolgingsperiodeId: string) => {
		setSelectedArenaId('');
		setSelectedOppfolgingsperiodeId(oppfolgingsperiodeId);
		setSelectedFunksjonellId('');
		setActiveTab(TAB_VALUES.deltakerAktivitetMapping);
		setMappingLookupToken(current => current + 1);
	};

	return (
		<div className="w-full">
			<Tabs value={activeTab} onChange={value => setActiveTab(value as typeof activeTab)}>
				<Tabs.List>
					<Tabs.Tab
						value={TAB_VALUES.deltakerAktivitetMapping}
						label="Deltaker aktivitet mapping"
					/>
					<Tabs.Tab value={TAB_VALUES.arenaData} label="Arena data" />
				</Tabs.List>
				<Tabs.Panel value={TAB_VALUES.deltakerAktivitetMapping}>
						<DeltakerAktivitetMappingCard
							onOpenArenaData={openArenaData}
							oppfolgingsperiodeId={selectedOppfolgingsperiodeId}
							onOppfolgingsperiodeIdChange={setSelectedOppfolgingsperiodeId}
							funksjonellId={selectedFunksjonellId}
							onFunksjonellIdChange={setSelectedFunksjonellId}
							autoFetchToken={mappingLookupToken}
							onOpenDeltakerAktivitetMapping={openDeltakerAktivitetMapping}
						/>
				</Tabs.Panel>
				<Tabs.Panel value={TAB_VALUES.arenaData}>
						<ArenaDataCard arenaId={selectedArenaId} arenaLookupToken={arenaLookupToken} />
				</Tabs.Panel>
			</Tabs>
		</div>
	);
}

function DeltakerAktivitetMappingCard(props: {
	onOpenArenaData: (arenaId: string) => void;
	oppfolgingsperiodeId: string;
	onOppfolgingsperiodeIdChange: (oppfolgingsperiodeId: string) => void;
	funksjonellId: string;
	onFunksjonellIdChange: (funksjonellId: string) => void;
	autoFetchToken: number;
	onOpenDeltakerAktivitetMapping: (oppfolgingsperiodeId: string) => void;
}) {
	const [deltakerId, setDeltakerId] = useState('');
	const [aktivitetId, setAktivitetId] = useState('');
	const [data, setData] = useState<AdminDeltakerAktivitetMappingDto[] | null>(null);
	const [error, setError] = useState<string | undefined>(undefined);
	const [lookupError, setLookupError] = useState<string | undefined>(undefined);
	const [isLoading, setIsLoading] = useState(false);
	const [isLookupLoading, setIsLookupLoading] = useState(false);

	async function handleLookupFunksjonellId(e: React.SubmitEvent<HTMLFormElement>) {
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
			props.onFunksjonellIdChange(foundFunksjonellId);
		} catch (e: any) {
			setLookupError(e?.toString());
		} finally {
			setIsLookupLoading(false);
		}
	}

	const runLookup = async () => {
		const request = props.oppfolgingsperiodeId
			? { oppfolgingsperiodeId: props.oppfolgingsperiodeId }
			: props.funksjonellId
				? { funksjonellId: props.funksjonellId }
				: deltakerId
					? { deltakerId: Number(deltakerId) }
					: null;

		if (!request) {
			setError('Deltaker id, funksjonell id eller oppfølgingsperiode id må fylles ut');
			return;
		}

		try {
			setError(undefined);
			setIsLoading(true);
			const response = await hentDeltakerAktivitetMapping(request);
			setData(response.data);
		} catch (e: any) {
			setError(e?.toString());
			setData(null);
		} finally {
			setIsLoading(false);
		}
	};

	async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
		e.preventDefault();
		void runLookup();
	}

	React.useEffect(() => {
		if (!props.autoFetchToken || !props.oppfolgingsperiodeId) {
			return;
		}

		void runLookup();
	}, [props.autoFetchToken]);

	return (
		<Card className="w-full" innholdClassName="hovedside__card-innhold">
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
					value={props.funksjonellId}
					onChange={e => props.onFunksjonellIdChange(e.target.value)}
					disabled={isLoading}
				/>
				<TextField
					name="oppfolgingsperiodeId"
					label="Oppfølgingsperiode id"
					value={props.oppfolgingsperiodeId}
					onChange={e => props.onOppfolgingsperiodeIdChange(e.target.value)}
					disabled={isLoading}
				/>
				{error && <div className="error-message">{error}</div>}
				<Button type="submit" disabled={isLoading}>
					Hent mapping
				</Button>
			</form>
			{data && (
				<div className="mt-4 overflow-x-auto">
					{data.length ? (
						<Table size="small">
							<Table.Header>
								<Table.Row>
									<Table.HeaderCell>Deltakelse id</Table.HeaderCell>
									<Table.HeaderCell>Aktivitet id</Table.HeaderCell>
									<Table.HeaderCell>Aktivitet kategori</Table.HeaderCell>
									<Table.HeaderCell>Oppfølgingsperiode id</Table.HeaderCell>
									<Table.HeaderCell>Sluttidspunkt</Table.HeaderCell>
								</Table.Row>
							</Table.Header>
							<Table.Body>
								{data.map(item => (
									<Table.Row key={`${item.deltakelseId}-${item.aktivitetId}`}>
									<Table.DataCell>
										<Button
											type="button"
											size="small"
											variant="tertiary"
											onClick={() => props.onOpenArenaData(String(item.deltakelseId))}
										>
											{item.deltakelseId}
										</Button>
									</Table.DataCell>
									<Table.DataCell>{item.aktivitetId}</Table.DataCell>
									<Table.DataCell>{item.aktivitetKategori}</Table.DataCell>
									<Table.DataCell>
										<Button
											type="button"
											size="small"
											variant="tertiary"
											onClick={() =>
												props.onOpenDeltakerAktivitetMapping(item.oppfolgingsPeriodeId)
											}
										>
											{item.oppfolgingsPeriodeId}
										</Button>
									</Table.DataCell>
									<Table.DataCell>{item.oppfolgingsPeriodeSluttTidspunkt ?? '-'}</Table.DataCell>
								</Table.Row>
								))}
							</Table.Body>
						</Table>
					) : (
						<BodyShort>Ingen treff</BodyShort>
					)}
				</div>
			)}
		</Card>
	);
}

function ArenaDataCard(props: { arenaId: string; arenaLookupToken: number }) {
	const [arenaId, setArenaId] = useState('');
	const [data, setData] = useState<AdminArenaDataDto[] | null>(null);
	const [error, setError] = useState<string | undefined>(undefined);
	const [isLoading, setIsLoading] = useState(false);

	React.useEffect(() => {
		setArenaId(props.arenaId);
	}, [props.arenaId]);

	const runLookup = async (arenaIdToFetch: string) => {
		try {
			setError(undefined);
			setIsLoading(true);
			const response = await hentArenaData(arenaIdToFetch);
			setData(response.data);
		} catch (e: any) {
			setError(e?.toString());
			setData(null);
		} finally {
			setIsLoading(false);
		}
	};

	React.useEffect(() => {
		if (!props.arenaLookupToken || !props.arenaId) {
			return;
		}

		void runLookup(props.arenaId);
	}, [props.arenaLookupToken, props.arenaId]);

	async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
		e.preventDefault();
		void runLookup(arenaId);
	}

	return (
		<Card className="w-full" innholdClassName="hovedside__card-innhold">
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
				<div className="mt-4 overflow-x-auto">
					{data.length ? (
						<Table size="small">
							<Table.Header>
								<Table.Row>
									<Table.HeaderCell>Id</Table.HeaderCell>
									<Table.HeaderCell>Tabell</Table.HeaderCell>
									<Table.HeaderCell>Operation</Table.HeaderCell>
									<Table.HeaderCell>Posisjon</Table.HeaderCell>
									<Table.HeaderCell>Operation tidspunkt</Table.HeaderCell>
									<Table.HeaderCell>Status</Table.HeaderCell>
									<Table.HeaderCell>Ingested</Table.HeaderCell>
									<Table.HeaderCell>Forsøk</Table.HeaderCell>
									<Table.HeaderCell>Sist forsøkt</Table.HeaderCell>
									<Table.HeaderCell>Noter</Table.HeaderCell>
								</Table.Row>
							</Table.Header>
							<Table.Body>
								{data.map(item => (
									<Table.Row key={item.id}>
										<Table.DataCell>{item.id}</Table.DataCell>
										<Table.DataCell>{item.arenaTableName}</Table.DataCell>
										<Table.DataCell>{item.operation}</Table.DataCell>
										<Table.DataCell>{item.operationPosition}</Table.DataCell>
										<Table.DataCell>{formatRelativeTime(item.operationTimestamp)}</Table.DataCell>
										<Table.DataCell>
											<Tag size="small" variant={getIngestStatusVariant(item.ingestStatus)}>
												{formatIngestStatus(item.ingestStatus)}
											</Tag>
										</Table.DataCell>
										<Table.DataCell>{formatRelativeTime(item.ingestedTimestamp)}</Table.DataCell>
										<Table.DataCell>{item.ingestAttempts}</Table.DataCell>
										<Table.DataCell>{formatRelativeTime(item.lastAttempted)}</Table.DataCell>
										<Table.DataCell>
											<div className="whitespace-pre-wrap">{item.note?.trim() ? item.note : '-'}</div>
										</Table.DataCell>
									</Table.Row>
								))}
							</Table.Body>
						</Table>
					) : (
						<BodyShort>Ingen treff</BodyShort>
					)}
				</div>
			)}
		</Card>
	);
}

function getIngestStatusVariant(status: string) {
	switch (status.toUpperCase()) {
		case 'FAILED':
			return 'error-moderate';
		case 'IGNORED':
		case 'QUEUED':
			return 'warning-moderate';
		case 'HANDLED':
		case 'HANDLED_AND_IGNORED':
			return 'success-moderate';
		default:
			return 'outline';
	}
}

function formatIngestStatus(status: string) {
	return status
		.toLowerCase()
		.split('_')
		.map(part => part.charAt(0).toUpperCase() + part.slice(1))
		.join(' ');
}

function formatRelativeTime(timestamp: string | null) {
	return timestamp ? dayjs(timestamp).fromNow() : '-';
}
