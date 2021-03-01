const DEV_DOMAINS = ['dev', 'localhost', 'app-q1', 'app-q0'];

export const erITestMiljo = (): boolean => {
	return window.location.hostname.split('.').findIndex(domain => DEV_DOMAINS.includes(domain)) >= 0;
};
