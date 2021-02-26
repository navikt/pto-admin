import React, { useEffect, useState } from 'react';
import NavFrontendSpinner from 'nav-frontend-spinner';
import { useAppStore } from '../../store/app-store';
import { me } from '../../api';
import { Hovedknapp } from 'nav-frontend-knapper';
import { erITestMiljo } from '../../utils';
import './login-check.less';
import { Systemtittel } from 'nav-frontend-typografi';

interface LoginCheckProps {
	children?: any;
}

const logInnUrl = erITestMiljo()
	? 'https://veilarblogin.dev.adeo.no/veilarblogin/api/aad-login?returnUrl=https%3A%2F%2Fpto-admin.dev.adeo.no'
	: 'https://veilarblogin.nais.adeo.no/veilarblogin/api/aad-login?returnUrl=https%3A%2F%2Fpto-admin.nais.adeo.no';

export function LoginCheck(props: LoginCheckProps) {
	const { loggedInUser, setLoggedInUser } = useAppStore();
	const [isAuthenticated, setIsAutenticated] = useState(false);
	const [isPending, setIsPending] = useState(loggedInUser == null);

	useEffect(() => {
		me()
			.then(res => {
				setLoggedInUser(res.data);
				setIsAutenticated(true);
			})
			.catch(() => setIsAutenticated(false))
			.finally(() => setIsPending(false));

		// eslint-disable-next-line
	}, []);

	if (isPending) {
		return (
			<div className="login-check">
				<NavFrontendSpinner type="L" />
			</div>
		);
	}

	if (!isAuthenticated) {
		return (
			<div className="login-check">
				<Hovedknapp onClick={() => (window.location.href = logInnUrl)}>Logg inn</Hovedknapp>
			</div>
		);
	}

	if (!loggedInUser?.harTilgang) {
		return (
			<div className="login-check">
				<Systemtittel>Du har ikke tilgang til PTO Admin</Systemtittel>
			</div>
		);
	}

	return props.children;
}
