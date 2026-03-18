import React, { useState } from 'react';
import { Alert, Button, Heading, TextField } from '@navikt/ds-react';
import { kontortelling, mergeKontorer } from '../../api/ao-oppfolgingskontor';

export const KontorMerge = () => {
	const [fraKontorer, setFraKontorer] = useState<string[]>(['']);
	const [tilKontor, setTilKontor] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | undefined>(undefined);
	const [tellingResult, setTellingResult] = useState<number | null>(null);
	const [mergeSuccess, setMergeSuccess] = useState(false);
	const [validationError, setValidationError] = useState<string | undefined>(undefined);

	const updateFraKontor = (index: number, value: string) => {
		const updated = [...fraKontorer];
		updated[index] = value;
		setFraKontorer(updated);
	};

	const addFraKontor = () => {
		setFraKontorer([...fraKontorer, '']);
	};

	const removeFraKontor = (index: number) => {
		setFraKontorer(fraKontorer.filter((_, i) => i !== index));
	};

	const validate = (): boolean => {
		const filledKontorer = fraKontorer.filter(k => k.trim().length > 0);
		if (filledKontorer.length === 0) {
			setValidationError('Legg til minst ett fra-kontor');
			return false;
		}
		const invalidFra = filledKontorer.some(k => k.trim().length !== 4);
		if (invalidFra) {
			setValidationError('Alle fra-kontorer må være nøyaktig 4 tegn');
			return false;
		}
		if (tilKontor.trim().length !== 4) {
			setValidationError('Til-kontor må være nøyaktig 4 tegn');
			return false;
		}
		setValidationError(undefined);
		return true;
	};

	const handleTelling = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!validate()) return;
		setError(undefined);
		setTellingResult(null);
		setMergeSuccess(false);
		try {
			setIsLoading(true);
			const result = await kontortelling({
				fraKontorer: fraKontorer.map(k => k.trim()),
				tilKontor: tilKontor.trim()
			});
			setTellingResult(result.data);
		} catch (e: any) {
			setError(e?.toString());
		} finally {
			setIsLoading(false);
		}
	};

	const handleMerge = async () => {
		if (!validate()) return;
		setError(undefined);
		setMergeSuccess(false);
		try {
			setIsLoading(true);
			await mergeKontorer({ fraKontorer: fraKontorer.map(k => k.trim()), tilKontor: tilKontor.trim() });
			setMergeSuccess(true);
			setTellingResult(null);
		} catch (e: any) {
			setError(e?.toString());
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="p-4 space-y-8 ">
			<Heading size="medium" className="!mb-4">
				Kontorsammenslåing
			</Heading>
			<form className="space-y-4" onSubmit={handleTelling}>
				<div className="flex space-x-12">
					<fieldset className="!p-0 space-y-2">
						<legend className="font-semibold">Fra kontorer</legend>
						{fraKontorer.map((kontor, index) => (
							<div key={index} className="flex flex-row items-end gap-2">
								<TextField
									width="4"
									label={`Kontor ${index + 1}`}
									value={kontor}
									onChange={e => updateFraKontor(index, e.target.value)}
									maxLength={4}
									disabled={isLoading}
									size="small"
								/>
								{fraKontorer.length > 1 && (
									<Button
										type="button"
										variant="tertiary-neutral"
										size="small"
										disabled={isLoading}
										onClick={() => removeFraKontor(index)}
									>
										Fjern
									</Button>
								)}
							</div>
						))}
						<Button
							type="button"
							variant="secondary"
							size="small"
							disabled={isLoading}
							onClick={addFraKontor}
						>
							+ Legg til kontor
						</Button>
					</fieldset>

					<TextField
						width="4"
						className="!flex mt-8 !flex-col"
						label="Til kontor (kontor-ID)"
						value={tilKontor}
						onChange={e => setTilKontor(e.target.value)}
						maxLength={4}
						size="small"
						disabled={isLoading}
					/>
				</div>

				{validationError && <Alert variant="warning">{validationError}</Alert>}

				<div className="flex pt-8 gap-4">
					<Button type="submit" size="small" variant="secondary" loading={isLoading} disabled={isLoading}>
						Tell berørte brukere
					</Button>
					<Button
						size="small"
						type="button"
						variant="danger"
						loading={isLoading}
						disabled={isLoading || tellingResult === null}
						onClick={handleMerge}
					>
						Utfør sammenslåing
					</Button>
				</div>
			</form>

			{tellingResult !== null && (
				<Alert variant="info">
					Antall brukere som vil bli berørt: <strong>{tellingResult}</strong>
				</Alert>
			)}

			{mergeSuccess && <Alert variant="success">Merge utført!</Alert>}

			{error && <Alert variant="error">{error}</Alert>}
		</div>
	);
};
