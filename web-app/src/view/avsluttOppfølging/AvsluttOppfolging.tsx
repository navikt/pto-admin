import React, { useState } from 'react';
import {} from '@navikt/aksel-icons/'
import { Card } from '../../component/card/card';
import { Button, Heading, Loader, Textarea, TextField } from '@navikt/ds-react';
import {
	avsluttOppfolgingsperiode,
	batchAvsluttOppfolging,
	hentOppfolgingsperioder
} from '../../api/veilarboppfolging';
import { Dialog, hentDialoger } from '../../api/veilarbdialog';
import { Button, Textarea, TextField } from '@navikt/ds-react';

export function AvsluttOppfolging() {
	return (
		<div className="flex flex-1 justify-around">
			<div className="flex flex-wrap space-x-8 p-4">
				<AvsluttOppfolgingForMangeBrukereCard />
				<AvsluttOppfolgingsperiode />
				<BrukerDataCard />
			</div>
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
			className="small-card"
			innholdClassName="hovedside__card-innhold"
		>
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

interface PeriodeMedDialoger {
	id: string;
	startTidspunkt: string;
	sluttTidspunkt: string;
	dialoger: Dialog[];
}

const BrukerDataCard = () => {
	// const [dialoger, setDialoger] = useState(null)
	const [oppfolgingsperioder, setOppfolgingsperioder] = useState<PeriodeMedDialoger[] | null>(null)
	// const [aktiviteter, setAktiviteter] = useState(null)
	const [error, setError] = useState<string | undefined>(undefined)
	const [isLoading, setIsLoading] = useState(false)

	const fetchBrukerData = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const fnr = formData.get('fnr') as string;
		if (!fnr) {
			setError('Fnr er påkrevd');
			return;
		}
		setIsLoading(true)
		Promise.all([
			hentDialoger({ fnr }),
			hentOppfolgingsperioder({ fnr })
		]).then(([dialogerResponse, oppfolgingsperioderResponse]) => {
			const dialoger = dialogerResponse?.data?.dialoger || [];
			const perioder = (oppfolgingsperioderResponse?.data?.oppfolgingsPerioder || [])
				.map(periode => {
					return {
						...periode,
						dialoger: dialoger.filter(dialog => dialog.oppfolgingsperiode === periode.id)
					}
				})
			setOppfolgingsperioder(perioder)
		})
			.catch(e => { })
			.finally(() => {
				setIsLoading(false)
			})

	}

	return (
		<Card className="large-card" innholdClassName=" flex flex-col space-y-4">
			<Heading size="medium">Brukerdata</Heading>
			<form className="space-y-4" onSubmit={fetchBrukerData}>
				<TextField name="fnr" label={'Fnr'} />
				<Button>Hent</Button>
			</form>
			
			<p>Her kan du vise brukerdata.</p>
			{ isLoading && <Loader size="small" /> }
			{ error && <div className="error-message">{error}</div> }
			{ oppfolgingsperioder && oppfolgingsperioder.map((periode: PeriodeMedDialoger) => (
				<div key={periode.id} className="mt-4">
					<div className="font-bold">Oppfølgingsperiode: { periode.id }</div>
					<div className="ml-4">
						<div>Start: {new Date(periode.startTidspunkt).toLocaleDateString()}</div>
						<div>Slutt: {periode.sluttTidspunkt ? new Date(periode.sluttTidspunkt).toLocaleDateString() : 'Aktiv'}</div>
						
						<div className="mt-2 font-bold">Dialoger ({periode.dialoger.length})</div>
						{periode.dialoger.map(dialog => (
							<div key={dialog.id} className="ml-4 mt-1">
								<div>DialogId: {dialog.id}</div>
								<details>
									<summary>Opprettet: {new Date(dialog.opprettetDato).toLocaleString()}</summary>
									<div className="ml-4">
										<div>Venter på svar fra: {dialog.venterPaSvar}</div>
										<div>Ferdig behandlet: {dialog.ferdigBehandlet}</div>
										<div>Lest: {dialog.lest}</div>
										<div>Opprettet dato: {dialog.opprettetDato}</div>
										<div>Siste dato: {dialog.sisteDato}</div>
										<div>Historisk: {dialog.historisk ? 'Ja' : 'Nei'}</div>
										<div>Lest: {dialog.lest ? 'Ja' : 'Nei'}</div>
									</div>
								</details>
							</div>
						))}
					</div>
				</div>
			))}
		</Card>
	);
}
