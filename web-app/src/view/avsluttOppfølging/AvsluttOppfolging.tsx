import { avsluttOppfolgingsperiode, batchAvsluttOppfolging } from '../../api';
import React, { useState } from 'react';
import { Card } from '../../component/card/card';
import { Button, TextField } from '@navikt/ds-react';

export function AvsluttOppfolging() {
	return (
		<div style={{ display: 'flex' }}>
			<AvsluttOppfolgingForMangeBrukereCard />
			<AvsluttOppfolgingsperiode />
		</div>
	);
}

function AvsluttOppfolgingForMangeBrukereCard() {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(undefined);

	async function handleSubmit(e: any) {
		e.preventDefault();
		const { aktorIds: aktorIdStrings, begrunnelse } = Object.fromEntries(new FormData(e.target)) as unknown as {
			aktorIds: string;
			begrunnelse: string;
		};
		const aktorIds = aktorIdStrings.split(',').map(aktorId => aktorId.trim());
		try {
			setError(undefined);
			setIsLoading(true);
			await batchAvsluttOppfolging({ aktorIds, begrunnelse });
		} catch (e: any) {
			setError(e?.toString);
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<div className="view kafka-admin">
			<form onSubmit={handleSubmit} className="large-card card__content space-y-4">
				<h1>Avslutt oppfølging for mange brukere</h1>
				<label htmlFor="brukere">Liste over brukere som skal avsluttes:</label>
				<textarea id="brukere" name="aktorIds" disabled={isLoading} />
				<label htmlFor="begrunnelse">Begrunnelse for avsluttning av oppfølging:</label>
				<input id="begrunnelse" type="text" name="begrunnelse" disabled={isLoading} />
				<input type="submit" disabled={isLoading} />
				{error || ''}
			</form>
		</div>
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
		<Card title="Avslutt Oppfølgingsperiode" className="small-card" innholdClassName="hovedside__card-innhold">
			<form onSubmit={handleSubmit}>
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
