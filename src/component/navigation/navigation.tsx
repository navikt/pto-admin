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
					<option value={ViewType.EKSEMPEL}>Eksempel</option>
				</Select>
			</div>
			<Ingress>{loggedInUser?.ident || 'Ikke logget inn'}</Ingress>
		</header>
	);
}
