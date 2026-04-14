import React, { useState } from 'react';
import {
	doDryRunFinnKontor,
	hentIdenterForInternIdent,
	hentInternIdent,
	republiserForUtvalgteOppfolgingsperioder,
	republiserTombstone,
	syncArenaKontorForBruker
} from '../../api/ao-oppfolgingskontor';
import { Button, Heading, TextField } from '@navikt/ds-react';
import { AoKontorFailedMessages } from './AoKontorFailedMessages';
import { Card } from '../../component/card/card';

export const AoKontorAdmin = () => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [dryRunKontorResult, setDryRunKontorResult] = useState<Record<string, string> | null>(null);
	const [internIdentResult, setInternIdentResult] = useState<number | null>(null);
	const [identerForInternIdentResult, setIdenterForInternIdentResult] = useState<{ aktorId: string | null; fnr: string | null } | null>(null);

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

	const hentInternIdentForBruker = async e => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const ident = formData.get('internIdent') as string;
		setIsLoading(true);
		const result = await hentInternIdent({ ident });
		setInternIdentResult(result.data.internIdent);
		setIsLoading(false);
	};

	const hentIdenterForInternIdentForBruker = async e => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const internIdent = Number(formData.get('identerForInternIdent') as string);
		setIsLoading(true);
		const result = await hentIdenterForInternIdent({ internIdent });
		setIdenterForInternIdentResult(result.data);
		setIsLoading(false);
	};

	return (
		<div className="p-4 grid grid-cols-2 gap-4 space-y-4 bg-slate-200">
			<Card>
				<Heading size="medium">Sync Arena-kontor</Heading>
				<form className="space-y-4" onSubmit={fetchKontorData}>
					<TextField name="identer" label={'Identer (kommaseparert)'} />
					<Button loading={isLoading} disabled={isLoading}>
						Hent
					</Button>
				</form>
			</Card>
			<Card>
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
			</Card>
			<Card>
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
			</Card>
			<Card>
				<Heading size="medium">Republiser tombstone for identer</Heading>
				<form className="space-y-4" onSubmit={tombstoneIdenter}>
					<TextField name="tombstoneIdenter" label={'Identer (kommaseparert)'} />
					<Button loading={isLoading} disabled={isLoading}>
						Send
					</Button>
				</form>
			</Card>
			<Card>
				<Heading size="medium">Hent intern-ID</Heading>
				<form className="space-y-4" onSubmit={hentInternIdentForBruker}>
					<TextField name="internIdent" label={'Ident'} />
					<Button loading={isLoading} disabled={isLoading}>
						Hent
					</Button>
					<div>{internIdentResult !== null ? `Intern-ID: ${internIdentResult}` : null}</div>
				</form>
			</Card>
			<Card>
				<Heading size="medium">Hent identer for intern-ID</Heading>
				<form className="space-y-4" onSubmit={hentIdenterForInternIdentForBruker}>
					<TextField name="identerForInternIdent" label={'Intern-ID'} />
					<Button loading={isLoading} disabled={isLoading}>
						Hent
					</Button>
					{identerForInternIdentResult !== null && (
						<div>
							<div>Aktør-ID: {identerForInternIdentResult.aktorId ?? 'Ikke funnet'}</div>
							<div>Fnr: {identerForInternIdentResult.fnr ?? 'Ikke funnet'}</div>
						</div>
					)}
				</form>
			</Card>
			<Card className="col-span-2">
				<AoKontorFailedMessages />
			</Card>
		</div>
	);
};
