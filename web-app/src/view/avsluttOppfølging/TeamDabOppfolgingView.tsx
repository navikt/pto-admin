import React, { useEffect, useState } from 'react';
import { Card } from '../../component/card/card';
import { BodyShort, Button, Heading, Tabs, Textarea, TextField, Tag } from '@navikt/ds-react';
import {
	avsluttOppfolgingsperiode,
	batchAvsluttOppfolging,
	hentUtmeldingskandidat,
	UtmeldingskandidatDto
} from '../../api/veilarboppfolging';
import { BrukerDataCard } from './BrukerDataCard';
import KontorCard from './KontorCard';
import { AoKontorAdmin } from './AoKontorAdmin';
import { KontorMerge } from './KontorMerge';
import { BrukerStatusCard } from './BrukerStatusCard';

export function TeamDabOppfolgingView() {
	const [tab, setTab] = useState<TabKey>(getTabFromLocalStorage());

	useEffect(() => {
		setTabInLocalStorage(tab);
	}, [tab]);

	return (
		<div className="flex p-4 justify-center">
			<div className="border rounded-t-lg bg-white border-gray-300 flex-1 max-w-[1200px]">
				<Tabs value={tab} onChange={value => setTab(value as TabKey)}>
					<Tabs.List>
						<Tabs.Tab value={TabKey.avsluttBrukere} label={'Avslutt brukere'} />
						<Tabs.Tab value={TabKey.aktiviteter} label={'Dialog og aktiviteter'} />
						<Tabs.Tab value={TabKey.kontor} label={'Kontor'} />
						<Tabs.Tab value={TabKey['ao-kontor-admin']} label={'AO Kontor Admin'} />
						<Tabs.Tab value={TabKey['kontor-merge']} label={'Kontorsammenslåing'} />
						<Tabs.Tab value={TabKey['bruker-status']} label={'Brukerstatus'} />
						<Tabs.Tab value={TabKey.utmeldingskandidater} label={'Utmeldingskandidater'} />
					</Tabs.List>
					<Tabs.Panel value={TabKey.avsluttBrukere}>
						<div className="flex flex-row flex-wrap gap-4">
							<AvsluttOppfolgingForMangeBrukereCard />
							<AvsluttOppfolgingsperiode />
						</div>
					</Tabs.Panel>
					<Tabs.Panel value={TabKey.aktiviteter}>
						<BrukerDataCard />
					</Tabs.Panel>
					<Tabs.Panel value={TabKey.kontor}>
						<KontorCard />
					</Tabs.Panel>
					<Tabs.Panel value={TabKey['ao-kontor-admin']}>
						<AoKontorAdmin />
					</Tabs.Panel>
					<Tabs.Panel value={TabKey['kontor-merge']}>
						<KontorMerge />
					</Tabs.Panel>
					<Tabs.Panel value={TabKey['bruker-status']}>
						<BrukerStatusCard />
					</Tabs.Panel>
					<Tabs.Panel value={TabKey.utmeldingskandidater}>
						<UtmeldingskandidaterCard />
					</Tabs.Panel>
				</Tabs>
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
		<Card className="small-card" innholdClassName="hovedside__card-innhold">
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

enum TabKey {
	'avsluttBrukere' = 'avsluttBrukere',
	'kontor' = 'kontor',
	'ao-kontor-admin' = 'ao-kontor-admin',
	'kontor-merge' = 'kontor-merge',
	'aktiviteter' = 'aktiviteter',
	'bruker-status' = 'bruker-status',
	'utmeldingskandidater' = 'utmeldingskandidater'
}

const tabKey = 'last-selected-tab';
const getTabFromLocalStorage = (): TabKey => {
	const lastSelectedTab = localStorage.getItem(tabKey);
	if (lastSelectedTab && Object.values(TabKey).includes(lastSelectedTab as TabKey)) {
		return lastSelectedTab as TabKey;
	}
	return TabKey.aktiviteter;
};
const setTabInLocalStorage = (view: TabKey) => {
	localStorage.setItem(tabKey, view);
};

function UtmeldingskandidaterCard() {
	const [fnr, setFnr] = useState('');
	const [data, setData] = useState<UtmeldingskandidatDto | null>(null);
	const [error, setError] = useState<string | undefined>(undefined);
	const [isLoading, setIsLoading] = useState(false);

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		try {
			setError(undefined);
			setIsLoading(true);
			const response = await hentUtmeldingskandidat(fnr);
			setData(response.data.utmeldingskandidat);
		} catch (e: any) {
			setError(e?.toString());
			setData(null);
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<Card className="small-card" innholdClassName="hovedside__card-innhold">
			<Heading size="medium">Utmeldingskandidater</Heading>
			<form className="space-y-4" onSubmit={handleSubmit}>
				<TextField label="Fødselsnummer" value={fnr} onChange={e => setFnr(e.target.value)} disabled={isLoading} />
				{error && <div className="error-message">{error}</div>}
				<Button type="submit" disabled={isLoading}>
					Hent utmeldingskandidat
				</Button>
			</form>
			{data && (
				<div className="mt-6 space-y-4">
					<BodyShort>
						<Tag size="small" variant="success-moderate">
							{data.tag ?? 'Ingen tag'}
						</Tag>
					</BodyShort>
					<div>
						<Heading size="small">Aktiv forlengelse</Heading>
						{data.aktivForlengelse ? (
							<div className="space-y-1">
								<BodyShort>Utfort av type: {data.aktivForlengelse.utfortAvType}</BodyShort>
								<BodyShort>Utfort av: {data.aktivForlengelse.utfortAv ?? '-'}</BodyShort>
								<BodyShort>Hendelse tidspunkt: {data.aktivForlengelse.hendelseTidspunkt}</BodyShort>
								<BodyShort>Forlenget til: {data.aktivForlengelse.forlengetTil ?? '-'}</BodyShort>
							</div>
						) : (
							<BodyShort>Ingen aktiv forlengelse</BodyShort>
						)}
					</div>
					<div>
						<Heading size="small">Hendelser</Heading>
						{data.utmeldingskandidatHendelser?.length ? (
							<div className="space-y-2">
								{data.utmeldingskandidatHendelser.map((hendelse, index) => (
									<div key={`${hendelse.hendelseTidspunkt}-${index}`} className="border rounded p-3">
										<BodyShort>Type: {hendelse.type}</BodyShort>
										<BodyShort>Utført av type: {hendelse.utfortAvType}</BodyShort>
										<BodyShort>Utført av: {hendelse.utfortAv ?? '-'}</BodyShort>
										<BodyShort>Tidspunkt: {hendelse.hendelseTidspunkt}</BodyShort>
										<BodyShort>Forlenget til: {hendelse.forlengetTil ?? '-'}</BodyShort>
									</div>
								))}
							</div>
						) : (
							<BodyShort>Ingen hendelser</BodyShort>
						)}
					</div>
				</div>
			)}
		</Card>
	);
}
