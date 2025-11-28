import React, { useState } from 'react';
import {republiserForUtvalgteOppfolgingsperioder, syncArenaKontorForBruker} from '../../api/ao-oppfolgingskontor';
import {Button, Heading, TextField} from '@navikt/ds-react';

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

	const republiserKontorordningForUtvalgteOppfolgingsperioder = async e => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const oppfolgingsperiodeIder = formData.get('oppfolgingsperiodeIder') as string;
		setIsLoading(true);
		await republiserForUtvalgteOppfolgingsperioder({ oppfolgingsperiodeIder: oppfolgingsperiodeIder });
		setIsLoading(false);
	}

	return (
		<div className="p-4 bg-gray-white">
			<Heading size="medium">Sync Arena-kontor</Heading>
			<form className="space-y-4" onSubmit={fetchKontorData}>
				<TextField name="identer" label={'Identer (kommaseparert)'} />
				<Button loading={isLoading} disabled={isLoading}>
					Hent
				</Button>
			</form>
			<Heading size="medium">Republiser kontortilordninger</Heading>
			<form className="space-y-4" onSubmit={republiserKontorordningForUtvalgteOppfolgingsperioder}>
				<TextField name="oppfolgingsperiodeIder" label={'Liste med oppfolgingsperiode-ID-er (kommaseparert)'} />
				<Button loading={isLoading} disabled={isLoading}>
					Hent
				</Button>
			</form>
		</div>
	);
};
