import { avsluttOppfolgingsperiode, batchAvsluttOppfolging } from '../../api';
import React, { useState } from 'react';
import { Card } from '../../component/card/card';
import { Button, Textarea, TextField } from '@navikt/ds-react';

export function AvsluttOppfolging() {
	return (
		<div style={{ display: 'flex' }}>
			<AvsluttOppfolgingForMangeBrukereCard />
			<AvsluttOppfolgingsperiode />
		</div>
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
		<Card
			title="Avslutt oppfølging for mange brukere"
			className="small-card"
			innholdClassName="hovedside__card-innhold"
		>
			<form onSubmit={handleSubmit}>
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
		<Card title="Avslutt en enkelt oppfølgingsperiode" className="small-card" innholdClassName="hovedside__card-innhold">
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
