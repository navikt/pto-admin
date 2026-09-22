import React, { useState } from 'react';
import { BodyShort, Button, Heading, Textarea } from '@navikt/ds-react';
import { flyttAktiviteterTilSistePeriode } from '../../api/veilarbaktivitet';
import { Card } from '../../component/card/card';

export function FlyttAktiviteterTilSistePeriodeCard() {
	const [aktorIds, setAktorIds] = useState('');
	const [error, setError] = useState<string | undefined>(undefined);
	const [isLoading, setIsLoading] = useState(false);
	const [resultat, setResultat] = useState<Array<{ aktorId: string; antallAktiviteter: number }> | null>(null);

	function parseAktorIds(input: string): string[] {
		return input
			.split(',')
			.map(id => id.trim())
			.filter(Boolean);
	}

	function validateAktorIds(ids: string[]): string | undefined {
		if (!ids.length) {
			return 'Du må legge inn minst én aktørId.';
		}
		const ugyldige = ids.filter(id => !/^\d{13}$/.test(id));
		if (ugyldige.length) {
			return `Ugyldig aktørId: ${ugyldige.join(', ')}. Alle aktørId-er må være 13 sifre.`;
		}
		return undefined;
	}

	async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
		e.preventDefault();
		const ids = parseAktorIds(aktorIds);
		const validationError = validateAktorIds(ids);
		if (validationError) {
			setError(validationError);
			setResultat(null);
			return;
		}

		try {
			setError(undefined);
			setResultat(null);
			setIsLoading(true);
			const response = await flyttAktiviteterTilSistePeriode({ aktorIds: ids });
			if (!response) {
				setError('response var null');
				return;
			}
			console.log(response);
			setResultat(
				Object.entries(response).map(([aktorId, antallAktiviteter]) => ({
					aktorId,
					antallAktiviteter
				}))
			);
		} catch (e: any) {
			setError(e?.toString() ?? 'Noe gikk galt ved flytting av aktiviteter.');
			setResultat(null);
		} finally {
			setIsLoading(false);
		}
	}

	const totaltAntallAktiviteter = resultat?.reduce((sum, entry) => sum + entry.antallAktiviteter, 0) ?? 0;

	return (
		<Card className="small-card" innholdClassName="hovedside__card-innhold">
			<Heading size="medium">Flytt aktiviteter til siste periode</Heading>
			<form className="space-y-4" onSubmit={handleSubmit}>
				<Textarea
					label="AktørId-er (kommaseparert)"
					value={aktorIds}
					onChange={e => setAktorIds(e.target.value)}
					disabled={isLoading}
				/>
				<BodyShort className="text-gray-600">Alle aktørId-er må være 13 sifre.</BodyShort>
				{error && <div className="border border-red-800 p-2 rounded-2xl">{error}</div>}
				<Button type="submit" loading={isLoading} disabled={isLoading}>
					Flytt aktiviteter
				</Button>
			</form>
			{resultat && (
				<div className="mt-4 space-y-2">
					<Heading size="small">Resultat</Heading>
					<div className="font-medium">Totalt flyttet: {totaltAntallAktiviteter}</div>
					{resultat.map(({ aktorId, antallAktiviteter }) => (
						<div key={aktorId} className="border rounded p-3">
							<BodyShort>{aktorId}</BodyShort>
							<BodyShort>{antallAktiviteter} aktiviteter</BodyShort>
						</div>
					))}
				</div>
			)}
		</Card>
	);
}
