import React, { useState } from 'react';
import { BodyShort, Button, Heading, Tag, Textarea, TextField } from '@navikt/ds-react';
import {
	batchKandidatForUtmelding,
	hentUtmeldingskandidat,
	UtmeldingskandidatDto
} from '../../../api/veilarboppfolging';
import { Card } from '../../../component/card/card';

export function UtmeldingskandidaterCard() {
	const [fnr, setFnr] = useState('');
	const [data, setData] = useState<UtmeldingskandidatDto | null>(null);
	const [error, setError] = useState<string | undefined>(undefined);
	const [isLoading, setIsLoading] = useState(false);

	async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
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
		await batchKandidatForUtmelding({
			oppfolgingsperiodeIder: oppfolgingsperiodeIder.split(',').map(it => it.trim())
		});
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
										<div
											key={`${hendelse.hendelseTidspunkt}-${index}`}
											className="border rounded p-3"
										>
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
