import React, { useState } from 'react';
import { syncArenaKontorForBruker } from '../../api/ao-oppfolgingskontor';
import { Button, TextField } from '@navikt/ds-react';

export const AoKontorAdmin = () => {
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const fetchKontorData = async e => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const identer = formData.get('identer') as string;
		setIsLoading(true);
		await syncArenaKontorForBruker({ identer });
		setIsLoading(false);
	};

	return (
		<div className="p-4 bg-gray-white">
			<form className="space-y-4" onSubmit={fetchKontorData}>
				<TextField name="identer" label={'Identer (kommaseparert)'} />
				<Button loading={isLoading} disabled={isLoading}>
					Hent
				</Button>
			</form>
		</div>
	);
};
