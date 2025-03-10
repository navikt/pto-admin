import React from 'react';
import App from './app';
import { createRoot } from 'react-dom/client';

async function enableMocking() {
	if (import.meta.env.DEV !== 'development') {
		return
	}

	const { worker } = await import('./mock/index')

	// `worker.start()` returns a Promise that resolves
	// once the Service Worker is up and ready to intercept requests.
	return worker.start()
}

enableMocking().then(() => {
	const rootElement = createRoot(document.getElementById('root')!);
	rootElement.render(
		<App />,
	);
})