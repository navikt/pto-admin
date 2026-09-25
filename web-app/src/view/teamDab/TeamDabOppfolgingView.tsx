import React, { useEffect, useState } from 'react';
import { Heading } from '@navikt/ds-react';
import { BrukerDataCard } from './BrukerDataCard';
import KontorCard from './kontor/KontorCard';
import { AoKontorAdmin } from './kontor/AoKontorAdmin';
import { KontorMerge } from './kontor/KontorMerge';
import { BrukerStatusCard } from './oppfolging/BrukerStatusCard';
import { StartOppfolging } from './oppfolging/StartOppfolging';
import { FlyttAktiviteterTilSistePeriodeCard } from './FlyttAktiviteterTilSistePeriodeCard';
import { HentAvslutningsstatusCard } from './oppfolging/HentAvslutningsstatusCard';
import { AvsluttOppfolgingForMangeBrukereCard } from './oppfolging/AvsluttOppfolgingForMangeBrukereCard';
import { UtmeldingskandidaterCard } from './oppfolging/UtmeldingskandidaterCard';
import { AvsluttOppfolgingsperiode } from './oppfolging/AvsluttOppfolgingsperiode';
import { AktivitetArenaAclCard } from './ArenaAclCard';

export function TeamDabOppfolgingView() {
	const [tab, setTab] = useState<TabKey>(getTabFromLocalStorage());

	useEffect(() => {
		setTabInLocalStorage(tab);
	}, [tab]);

	return (
		<div className="flex justify-center p-2">
			<div className="border rounded-lg bg-white border-gray-300 flex-1 max-w-[1600px] p-2">
				<div className="flex flex-col gap-3 lg:flex-row">
					<aside className="w-full lg:w-72 shrink-0">
						<div className="rounded-lg border border-gray-200 bg-gray-50 p-2">
							<Heading size="small" spacing>
								Team DAB
							</Heading>
							<nav className="flex flex-col gap-4" aria-label="Team DAB meny">
								{menuGroups.map(group => (
									<div key={group.label} className="space-y-1">
										<Heading size="xsmall" className="px-1 py-3 text-orange-900 tracking-wide">
											{group.label}
										</Heading>
										<div className="flex flex-col gap-1">
											{group.items.map(item => {
												const isSelected = tab === item.value;
												return (
													<button
														key={item.value}
														type="button"
														onClick={() => setTab(item.value)}
														aria-current={isSelected ? 'page' : undefined}
														className={`flex w-full items-center rounded-md border px-3 py-2 text-left text-sm transition ${
															isSelected
																? 'border-blue-500 bg-blue-50 font-semibold text-blue-900 shadow-sm'
																: 'border-transparent hover:border-gray-200 hover:bg-white'
														}`}
													>
														{item.label}
													</button>
												);
											})}
										</div>
									</div>
								))}
							</nav>
						</div>
					</aside>
					<section className="min-w-0 flex-1 p-1 lg:p-2">{renderTabContent(tab)}</section>
				</div>
			</div>
		</div>
	);
}

enum TabKey {
	'avsluttBrukere' = 'avsluttBrukere',
	'hentAvslutningsstatus' = 'hentAvslutningsstatus',
	'kontor' = 'kontor',
	'ao-kontor-admin' = 'ao-kontor-admin',
	'kontor-merge' = 'kontor-merge',
	'aktiviteter' = 'aktiviteter',
	'bruker-status' = 'bruker-status',
	'utmeldingskandidater' = 'utmeldingskandidater',
	'aktivitet-arena-acl' = 'aktivitet-arena-acl',
	'start-oppfolging' = 'start-oppfolging',
	'flytt-aktiviteter' = 'flytt-aktiviteter'
}

const menuGroups: Array<{
	label: string;
	items: Array<{ value: TabKey; label: string }>;
}> = [
	{
		label: 'Oppfølging',
		items: [
			{ value: TabKey['start-oppfolging'], label: 'Start Oppfølging' },
			{ value: TabKey.avsluttBrukere, label: 'Avslutt oppfølging' },
			{ value: TabKey.hentAvslutningsstatus, label: 'Hent avslutningsstatus' },
			{ value: TabKey['bruker-status'], label: 'Brukerstatus' },
			{ value: TabKey.utmeldingskandidater, label: 'Utmeldingskandidater' }
		]
	},
	{
		label: 'Kontor',
		items: [
			{ value: TabKey.kontor, label: 'Kontorhistorikk' },
			{ value: TabKey['ao-kontor-admin'], label: 'AO Kontor Admin' },
			{ value: TabKey['kontor-merge'], label: 'Kontorsammenslåing' }
		]
	},
	{
		label: 'Data',
		items: [
			{ value: TabKey.aktiviteter, label: 'Dialog og aktiviteter' },
			{ value: TabKey['flytt-aktiviteter'], label: 'Flytt aktiviteter' },
			{ value: TabKey['aktivitet-arena-acl'], label: 'Aktivitet Arena ACL' }
		]
	}
];

function renderTabContent(tab: TabKey) {
	switch (tab) {
		case TabKey.avsluttBrukere:
			return (
				<div className="flex flex-row flex-wrap gap-4">
					<AvsluttOppfolgingForMangeBrukereCard />
					<AvsluttOppfolgingsperiode />
				</div>
			);
		case TabKey.hentAvslutningsstatus:
			return <HentAvslutningsstatusCard />;
		case TabKey.aktiviteter:
			return <BrukerDataCard />;
		case TabKey.kontor:
			return <KontorCard />;
		case TabKey['ao-kontor-admin']:
			return <AoKontorAdmin />;
		case TabKey['kontor-merge']:
			return <KontorMerge />;
		case TabKey['bruker-status']:
			return <BrukerStatusCard />;
		case TabKey.utmeldingskandidater:
			return <UtmeldingskandidaterCard />;
		case TabKey['aktivitet-arena-acl']:
			return <AktivitetArenaAclCard />;
		case TabKey['start-oppfolging']:
			return <StartOppfolging />;
		case TabKey['flytt-aktiviteter']:
			return <FlyttAktiviteterTilSistePeriodeCard />;
		default:
			return <BrukerDataCard />;
	}
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
