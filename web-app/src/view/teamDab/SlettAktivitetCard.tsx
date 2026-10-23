import React, { useState } from 'react';
import { Button, Heading, TextField } from '@navikt/ds-react';
import { slettAktivitet } from '../../api/veilarbaktivitet';
import { Card } from '../../component/card/card';
import BekreftModal from '../../component/bekreft-modal';
import { errorToast, successToast } from '../../utils/toast-utils';

const aktivitetIdRegex = /^\d+$/;
const FORHAANDSORIENTERING_ERROR = 'Aktiviteter med forhåndsorientering kan ikke slettes';
const EKSTERNAKTIVITET_ERROR = 'Kun aktiviteter av typen EKSTERNAKTIVITET kan slettes';

function mapSlettAktivitetError(message: string): string {
	if (message.includes(FORHAANDSORIENTERING_ERROR)) {
		return FORHAANDSORIENTERING_ERROR;
	}
	if (message.includes(EKSTERNAKTIVITET_ERROR)) {
		return EKSTERNAKTIVITET_ERROR;
	}
	return message;
}

export function SlettAktivitetCard() {
	const [aktivitetId, setAktivitetId] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [isConfirmOpen, setIsConfirmOpen] = useState(false);

	const validerAktivitetId = (id: string): string | null => {
		if (!id.trim()) {
			return 'Aktivitet id er påkrevd.';
		}
		if (!aktivitetIdRegex.test(id.trim())) {
			return 'Aktivitet id må være et tall.';
		}
		return null;
	};

	const handleOpenConfirm = () => {
		const validationError = validerAktivitetId(aktivitetId);
		if (validationError) {
			errorToast(validationError);
			return;
		}
		setIsConfirmOpen(true);
	};

	const handleSlettAktivitet = async () => {
		try {
			setIsLoading(true);
			await slettAktivitet(aktivitetId.trim());
			successToast(`Aktivitet ${aktivitetId.trim()} er slettet.`);
			setAktivitetId('');
		} catch (e: unknown) {
			const message = e instanceof Error ? e.message : 'Noe gikk galt ved sletting av aktivitet.';
			errorToast(mapSlettAktivitetError(message));
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Card className="small-card" innholdClassName="hovedside__card-innhold">
			<Heading size="medium">Slett aktivitet</Heading>
			<form
				className="space-y-4"
				onSubmit={e => {
					e.preventDefault();
					handleOpenConfirm();
				}}
			>
				<TextField
					name="aktivitetId"
					label="Aktivitet id"
					value={aktivitetId}
					onChange={e => setAktivitetId(e.target.value)}
					disabled={isLoading}
				/>
				<Button type="submit" loading={isLoading} disabled={isLoading}>
					Slett aktivitet
				</Button>
			</form>

			<BekreftModal
				isOpen={isConfirmOpen}
				setOpen={setIsConfirmOpen}
				action={handleSlettAktivitet}
				description={`Er du sikker på at du vil slette aktivitet med id ${aktivitetId.trim()}?`}
			/>
		</Card>
	);
}
