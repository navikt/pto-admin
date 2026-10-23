import React, { useState } from 'react';
import { BodyShort, Button, Heading, TextField } from '@navikt/ds-react';
import { Card } from '../../../component/card/card';
import {
	hentOppfolgingsperiodeDetaljer,
	OppfolgingsperiodeDetaljerDto
} from '../../../api/veilarboppfolging';
import { IdWithCopy } from '../../../component/IdWithCopy';

interface OppfolgingsperiodeDetaljerCardProps {
	onSlaOppDialogerOgAktiviteter: (fnr: string) => void;
}

export function OppfolgingsperiodeDetaljerCard({ onSlaOppDialogerOgAktiviteter }: OppfolgingsperiodeDetaljerCardProps) {
	const [oppfolgingsperiodeId, setOppfolgingsperiodeId] = useState('');
	const [sistSoktOppfolgingsperiodeId, setSistSoktOppfolgingsperiodeId] = useState('');
	const [data, setData] = useState<OppfolgingsperiodeDetaljerDto | null | undefined>(undefined);
	const [error, setError] = useState<string | undefined>(undefined);
	const [isLoading, setIsLoading] = useState(false);

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const periodeId = oppfolgingsperiodeId.trim();
		if (!periodeId) {
			setError('Oppfølgingsperiode UUID er påkrevd');
			setData(undefined);
			return;
		}

		try {
			setError(undefined);
			setIsLoading(true);
			const response = await hentOppfolgingsperiodeDetaljer(periodeId);
			setSistSoktOppfolgingsperiodeId(periodeId);
			setData(response.data.oppfolgingsperiode);
		} catch (e: unknown) {
			setError(e instanceof Error ? e.toString() : 'Ukjent feil');
			setData(undefined);
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<Card className="small-card" innholdClassName="hovedside__card-innhold">
			<Heading size="medium">Hent oppfølgingsperiode på UUID</Heading>
			<form className="space-y-4" onSubmit={handleSubmit}>
				<TextField
					label="Oppfølgingsperiode UUID"
					value={oppfolgingsperiodeId}
					onChange={e => setOppfolgingsperiodeId(e.target.value)}
					disabled={isLoading}
				/>
				{error && <div className="error-message">{error}</div>}
				<Button type="submit" disabled={isLoading}>
					Hent oppfølgingsperiode
				</Button>
			</form>
			{data === null && <BodyShort className="mt-4">Fant ingen oppfølgingsperiode for gitt UUID.</BodyShort>}
			{data && (
				<div className="mt-4 space-y-2">
					{(() => {
						const ident = data.ident;
						return ident ? (
							<Button type="button" variant="secondary" onClick={() => onSlaOppDialogerOgAktiviteter(ident)}>
								Gå til Dialog og aktiviteter og slå opp bruker
							</Button>
						) : (
							<BodyShort>Kan ikke slå opp dialoger og aktiviteter fordi ident mangler på perioden.</BodyShort>
						);
					})()}
					<IdWithCopy id={sistSoktOppfolgingsperiodeId} label="UUID" />
					<BodyShort>Start tidspunkt: {data.startTidspunkt}</BodyShort>
					<BodyShort>Slutt tidspunkt: {data.sluttTidspunkt ?? '-'}</BodyShort>
					<BodyShort>AktørId: {data.aktorId}</BodyShort>
					<BodyShort>Ident: {data.ident ?? '-'}</BodyShort>
					<BodyShort>Kontor: {data.kontor ?? '-'}</BodyShort>
					<BodyShort>Oppdatert tidspunkt: {data.oppdatertTidspunkt}</BodyShort>
					<div className="border rounded p-3 mt-2">
						<Heading size="xsmall" spacing>
							Startet
						</Heading>
						<BodyShort>Startet av: {data.startet.startetAv ?? '-'}</BodyShort>
						<BodyShort>Startet av type: {data.startet.startetAvType ?? '-'}</BodyShort>
						<BodyShort>Registreringstype: {data.startet.registreringsType ?? '-'}</BodyShort>
					</div>
					<div className="border rounded p-3 mt-2">
						<Heading size="xsmall" spacing>
							Avsluttet
						</Heading>
						{data.avsluttet ? (
							<>
								<BodyShort>Avsluttet av: {data.avsluttet.avsluttetAv ?? '-'}</BodyShort>
								<BodyShort>Avsluttet av type: {data.avsluttet.avsluttetAvType ?? '-'}</BodyShort>
								<BodyShort>Avregistreringstype: {data.avsluttet.avregistreringsType ?? '-'}</BodyShort>
							</>
						) : (
							<BodyShort>Ikke avsluttet</BodyShort>
						)}
					</div>
				</div>
			)}
		</Card>
	);
}
