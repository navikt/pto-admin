import React, { useState } from 'react';
import {
	doDryRunFinnKontor,
	republiserForUtvalgteOppfolgingsperioder,
	republiserTombstone,
	syncArenaKontorForBruker
} from '../../api/ao-oppfolgingskontor';
import { Button, Heading, TextField } from '@navikt/ds-react';
import { AoKontorFailedMessages } from './AoKontorFailedMessages';

export const AoKontorAdmin = () => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [dryRunKontorResult, setDryRunKontorResult] = useState<Record<string, string> | null>(null);

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
	};

	const dryRunFinnKontor = async e => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const identer = formData.get('identer2') as string;
		setIsLoading(true);
		const result = await doDryRunFinnKontor({ identer });
		setDryRunKontorResult(result.data);
		setIsLoading(false);
	};

	const tombstoneIdenter = async e => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const identer = formData.get('tombstoneIdenter') as string;
		setIsLoading(true);
		await republiserTombstone({ identer });
		setIsLoading(false);
	};

	return (
		<div className="p-4 space-y-4 bg-gray-white">
			<div>
				<Heading size="medium">Sync Arena-kontor</Heading>
				<form className="space-y-4" onSubmit={fetchKontorData}>
					<TextField name="identer" label={'Identer (kommaseparert)'} />
					<Button loading={isLoading} disabled={isLoading}>
						Hent
					</Button>
				</form>
			</div>
			<div>
				<Heading size="medium">Republiser kontortilordninger</Heading>
				<form className="space-y-4" onSubmit={republiserKontorordningForUtvalgteOppfolgingsperioder}>
					<TextField
						name="oppfolgingsperiodeIder"
						label={'Liste med oppfolgingsperiode-ID-er (kommaseparert)'}
					/>
					<Button loading={isLoading} disabled={isLoading}>
						Hent
					</Button>
				</form>
			</div>
			<div>
				<Heading size="medium">
					Dry-run finn kontor (som om det var arbeidssøker, dvs kan blir rutet til NOE)
				</Heading>
				<form className="space-y-4" onSubmit={dryRunFinnKontor}>
					<TextField name="identer2" label={'Identer (kommaseparert)'} />
					<Button loading={isLoading} disabled={isLoading}>
						Hent
					</Button>
					<div>{dryRunKontorResult ? JSON.stringify(dryRunKontorResult) : null}</div>
				</form>
			</div>
			<div>
				<Heading size="medium">Republiser tombstone for identer</Heading>
				<form className="space-y-4" onSubmit={tombstoneIdenter}>
					<TextField name="tombstoneIdenter" label={'Identer (kommaseparert)'} />
					<Button loading={isLoading} disabled={isLoading}>
						Send
					</Button>
				</form>
			</div>
			<div>
				<AoKontorFailedMessages />
			</div>
		</div>
	);
};
