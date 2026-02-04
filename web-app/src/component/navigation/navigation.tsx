import React from 'react';
import { ViewType, useViewStore } from '../../store/view-store';
import { useAppStore } from '../../store/app-store';
import { BodyShort, Heading, Tabs } from '@navikt/ds-react';

export function Navigation() {
	const { loggedInUser } = useAppStore();
	const { changeView, view } = useViewStore();

	return (
		<header className="flex drop-shadow-xl flex-col bg-white flex-1 px-10">
			<div className="flex flex-row flex-1 pt-4 justify-between items-baseline">
				<Heading size="medium" className="">
					POAO Admin
				</Heading>
				<BodyShort>{loggedInUser?.navn || ''}</BodyShort>
			</div>
			<Tabs value={view} onChange={changeView}>
				<Tabs.List>
					<Tabs.Tab value={ViewType.HOVEDSIDE} label="Hovedside" />
					<Tabs.Tab value={ViewType.VEDTAKSSTOTTE} label="Vedtaksstøtte" />
					<Tabs.Tab value={ViewType.REPUBLISERING_KAFKA} label="Republisering Kafka" />
					<Tabs.Tab value={ViewType.KAFKA_ADMIN} label="Kafka Admin" />
					<Tabs.Tab value={ViewType.VEILARBPORTEFOLJE} label="Veilarbportefolje" />
					<Tabs.Tab value={ViewType.TEAM_DAB} label="Team DAB" />
				</Tabs.List>
			</Tabs>
		</header>
	);
}
