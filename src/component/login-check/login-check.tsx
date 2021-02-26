import React, { useEffect, useState } from 'react';
import NavFrontendSpinner from 'nav-frontend-spinner';
import { useAppStore } from '../../store/app-store';
import { me } from '../../api';
import { Hovedknapp } from 'nav-frontend-knapper';
import { erITestMiljo } from '../../utils';
import './login-check.less';

interface LoginCheckProps {
	children?: any;
}

const logInnUrl = erITestMiljo()
	? 'https://veilarblogin.dev.intern.nav.no/veilarblogin/api/aad-login?returnUrl=https%3A%2F%2Fpto-admin.dev.intern.nav.no'
	: 'https://veilarblogin.intern.nav.no/veilarblogin/api/aad-login?returnUrl=https%3A%2F%2Fpto-admin.intern.nav.no';

export function LoginCheck(props: LoginCheckProps) {
	const { loggedInUser, setLoggedInUser } = useAppStore();
	const [isPending, setIsPending] = useState(loggedInUser == null);
	const [isLoggedIn, setIsLoggedIn] = useState(loggedInUser != null);

	useEffect(() => {
		if (!isLoggedIn) {
			me()
				.then(res => {
					setLoggedInUser(res.data.ident);
					setIsLoggedIn(true);
				})
				.catch()
				.finally(() => setIsPending(false));
		}
		// eslint-disable-next-line
	}, []);

	if (isLoggedIn) {
		return props.children;
	}

	if (isPending) {
		return (
			<div className="login-check">
				<NavFrontendSpinner type="L" />
			</div>
		);
	}

	function handleOnLoggInnClicked() {
		window.location.href = logInnUrl;
	}

	return (
		<div className="login-check">
			<Hovedknapp onClick={handleOnLoggInnClicked}>Logg inn</Hovedknapp>
		</div>
	);
}
