import React, { ChangeEvent } from 'react';
import { Select } from 'nav-frontend-skjema';
import { ViewType, useViewStore } from '../../store/view-store';
import './navigation.less';
import { useAppStore } from '../../store/app-store';
import { Ingress } from 'nav-frontend-typografi';

export function Navigation() {
	const { loggedInUser } = useAppStore();
	const { changeView, view } = useViewStore();

	function handleOnChange(e: ChangeEvent<HTMLSelectElement>) {
		changeView(e.target.value as ViewType);
	}

	return (
		<header className="navigation">
			<div className="navigation__innhold">
				<h1>PTO Admin</h1>
				<Select className="navigation__visning-velger" value={view} onChange={handleOnChange}>
					<option value={ViewType.HOVEDSIDE}>Hovedside</option>
					<option value={ViewType.UTRULLING_VEDTAKSSTOTTE}>Utrulling vedtaksstøtte</option>
					<option value={ViewType.REPUBLISERING_VEDTAKSSTOTTE}>Republisering vedtaksstøtte</option>
					<option value={ViewType.KAFKA_ADMIN}>Kafka Admin</option>
				</Select>
			</div>
			<Ingress>{loggedInUser?.navn || ''}</Ingress>
		</header>
	);
}
