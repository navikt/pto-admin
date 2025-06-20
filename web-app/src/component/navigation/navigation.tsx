import React, { ChangeEvent } from 'react';
import { ViewType, useViewStore } from '../../store/view-store';
import './navigation.less';
import { useAppStore } from '../../store/app-store';
import { BodyShort, Select } from '@navikt/ds-react';

export function Navigation() {
	const { loggedInUser } = useAppStore();
	const { changeView, view } = useViewStore();

	function handleOnChange(e: ChangeEvent<HTMLSelectElement>) {
		changeView(e.target.value as ViewType);
	}

	return (
		<header className="navigation">
			<div className="navigation__innhold">
				<h1>POAO Admin</h1>
				<Select label="PTO Admin" className="navigation__visning-velger" value={view} onChange={handleOnChange}>
					<option value={ViewType.HOVEDSIDE}>Hovedside</option>
					<option value={ViewType.VEDTAKSSTOTTE}>Vedtaksstøtte</option>
					<option value={ViewType.REPUBLISERING_KAFKA}>Republisering Kafka</option>
					<option value={ViewType.KAFKA_ADMIN}>Kafka Admin</option>
					<option value={ViewType.VEILARBPORTEFOLJE}>Veilarbportefolje</option>
					<option value={ViewType.AVSLUTT_BRUKERE}>Avslutt oppfølging</option>
				</Select>
			</div>
			<BodyShort>{loggedInUser?.navn || ''}</BodyShort>
		</header>
	);
}
