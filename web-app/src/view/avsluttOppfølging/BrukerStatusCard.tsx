import React, { useState } from 'react';
import { Button, Heading, TextField } from '@navikt/ds-react';
import { Card } from '../../component/card/card';
import { BooleanTag } from '../../component/BooleanTag';
import { hentBrukerStatus, BrukerStatusDto } from '../../api/veilarboppfolging';
import { UserQuery, UserQueryResultsContainer } from '../../component/UserQueryResults';

export const BrukerStatusCard = () => {
	const [results, setResults] = useState<UserQuery[]>([]);
	const [error, setError] = useState<string | undefined>(undefined);
	const [isLoading, setIsLoading] = useState(false);

	const fetchBrukerStatus = async (e: React.SubmitEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const fnr = formData.get('fnr') as string;
		if (!fnr) {
			setError('Fnr er påkrevd');
			return;
		}
		setError(undefined);
		setIsLoading(true);
		try {
			const response = await hentBrukerStatus(fnr);
			const brukerStatus = response.data.brukerStatus;
			setResults(prev => [
				...prev,
				{
					id: prev.length + 1 + '',
					ident: fnr,
					component: <BrukerStatusResult brukerStatus={brukerStatus} />
				}
			]);
		} catch (e: any) {
			setError(e?.toString());
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Card className="large-card" innholdClassName="flex flex-col space-y-4">
			<Heading size="medium">Brukerstatus</Heading>
			<form className="space-y-4" onSubmit={fetchBrukerStatus}>
				<TextField name="fnr" label="Fnr" />
				<Button loading={isLoading} disabled={isLoading}>
					Hent
				</Button>
			</form>

			{error && <div className="error-message">{error}</div>}

			<UserQueryResultsContainer
				queries={results}
				onCloseTab={itemId => setResults(prev => prev.filter(it => it.id !== itemId))}
			/>
		</Card>
	);
};

function BrukerStatusResult({ brukerStatus }: { brukerStatus: BrukerStatusDto }) {
	return (
		<div className="space-y-4">
			<div className="bg-gray-100 p-3 border border-gray-200 rounded">
				<div className="font-bold mb-2">Kontorsperre</div>
				<div>
					Er kontorsperret: <BooleanTag value={brukerStatus.erKontorsperret} />
				</div>
				{brukerStatus.kontorSperre && <div>Kontor ID: {brukerStatus.kontorSperre.kontorId}</div>}
			</div>

			<div className="bg-gray-100 p-3 border border-gray-200 rounded">
				<div className="font-bold mb-2">KRR</div>
				<div>
					Reservert i KRR: <BooleanTag value={brukerStatus.krr.reservertIKrr} />
				</div>
				<div>
					Kan varsles: <BooleanTag value={brukerStatus.krr.kanVarsles} />
				</div>
				<div>
					Registrert i KRR: <BooleanTag value={brukerStatus.krr.registrertIKrr} />
				</div>
			</div>

			<div className="bg-gray-100 p-3 border border-gray-200 rounded">
				<div className="font-bold mb-2">Manuell</div>
				{brukerStatus.manuell ? (
					<>
						<div>
							Er manuell: <BooleanTag value={brukerStatus.manuell.erManuell ?? false} />
						</div>
						{brukerStatus.manuell.opprettetTidspunkt && (
							<div>Opprettet tidspunkt: {brukerStatus.manuell.opprettetTidspunkt}</div>
						)}
						{brukerStatus.manuell.begrunnelse && <div>Begrunnelse: {brukerStatus.manuell.begrunnelse}</div>}
						{brukerStatus.manuell.endretAvType && (
							<div>Endret av type: {brukerStatus.manuell.endretAvType}</div>
						)}
						{brukerStatus.manuell.endretAvIdent && (
							<div>Endret av ident: {brukerStatus.manuell.endretAvIdent}</div>
						)}
					</>
				) : (
					<div className="text-gray-500">Ingen manuell status</div>
				)}
			</div>
		</div>
	);
}
