import React, { useState } from 'react';
import {
	AdminArenaDataDto,
	AdminDeltakerAktivitetMappingDto,
	hentArenaData,
	hentDeltakerAktivitetMapping
} from '../../api/aktivitet-arena-acl';
import { Card } from '../../component/card/card';
import { BodyShort, Button, Heading, TextField } from '@navikt/ds-react';
import { hentAktivitet } from '../../api/veilarbaktivitet';

export function AktivitetArenaAclCard() {
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
			setFunksjonellId(foundFunksjonellId);
		} catch (e: any) {
			setLookupError(e?.toString());
		} finally {
			setIsLookupLoading(false);
		}
	}

	async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
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

	async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
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
