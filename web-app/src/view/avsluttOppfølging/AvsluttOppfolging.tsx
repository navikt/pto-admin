import React, { useEffect, useState } from 'react';
import { Card } from '../../component/card/card';
import { Button, Heading, Tabs, Textarea, TextField } from '@navikt/ds-react';
import { avsluttOppfolgingsperiode, batchAvsluttOppfolging } from '../../api/veilarboppfolging';
import { BrukerDataCard } from './BrukerDataCard';
import KontorCard from './KontorCard';
import { ViewType } from '../../store/view-store';

export function AvsluttOppfolging() {
	const [tab, setTab] = useState<TabKey>(getTabFromLocalStorage());

	useEffect(() => {
		setTabInLocalStorage(tab);
	}, [tab]);

	return (
		<div className="flex p-4 justify-center">
			<div className="border rounded-t-lg bg-white border-gray-300 flex-1 max-w-[960px]">
				<Tabs value={tab} onChange={value => setTab(value as TabKey)}>
					<Tabs.List>
						<Tabs.Tab value={TabKey.avsluttBrukere} label={'Avslutt brukere'} />
						<Tabs.Tab value={TabKey.aktiviteter} label={'Dialog og aktiviteter'} />
						<Tabs.Tab value={TabKey.kontor} label={'Kontor'} />
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
	'aktiviteter' = 'aktiviteter'
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
