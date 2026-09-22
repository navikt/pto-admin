import React, { useState } from 'react';
import { Card } from '../../component/card/card';
import { Button, Heading, Textarea, BodyShort } from '@navikt/ds-react';
import { AvslutningsStatusDto, hentAvslutningStatusForOppfolgingsperioder } from '../../api/veilarboppfolging';

export function HentAvslutningsstatusCard() {
	const [oppfolgingsperiodeIder, setOppfolgingsperiodeIder] = useState('');
	const [data, setData] = useState<Record<string, AvslutningsStatusDto | undefined> | null>(null);
	const [error, setError] = useState<string | undefined>(undefined);
	const [isLoading, setIsLoading] = useState(false);

	async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
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
					{Object.keys(data).length ? (
						Object.entries(data).map(([key, item]) => (
							<div key={key} className="border rounded p-3">
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
