import React, { useEffect, useState } from 'react';
import { useAppStore } from '../../store/app-store';
import { me } from '../../api';
import { erITestMiljo } from '../../utils';
import './login-check.less';
import { Button, Loader } from '@navikt/ds-react';

interface LoginCheckProps {
	children?: any;
}

const logInnUrl = erITestMiljo()
	? 'https://app-q1.adeo.no/veilarblogin/api/start?url=https%3A%2F%2Fapp-q1.adeo.no/pto-admin'
	: 'https://app.adeo.no/veilarblogin/api/start?url=https%3A%2F%2Fapp.adeo.no/pto-admin';

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
				<Loader size="2xlarge" />
			</div>
		);
	}

	if (!isAuthenticated) {
		return (
			<div className="login-check">
				<Button onClick={() => (window.location.href = logInnUrl)}>Logg inn</Button>
			</div>
		);
	}

	return props.children;
}
