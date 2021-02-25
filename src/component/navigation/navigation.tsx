import React, { ChangeEvent } from 'react';
import { Select } from 'nav-frontend-skjema';
import { ViewType, useViewStore } from '../../store/view-store';
import './navigation.less';
import Lenke from 'nav-frontend-lenker';

const logInnUrl = 'https://app-q1.dev.adeo.no/veilarblogin/api/aad-login?returnUrl=https%3A%2F%2Fpto-admin.dev.adeo.no';

export function Navigation() {
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
			<Lenke href={logInnUrl}>Log Inn</Lenke>
		</header>
	);
}
