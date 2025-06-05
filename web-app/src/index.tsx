import React from 'react';
import App from './app';
import { createRoot } from 'react-dom/client';

async function enableMocking() {
	if (import.meta.env.MODE !== 'development') {
		console.log("Skipping mocking in non-development environment");
		return
	}

	const { worker } = await import('./mock/index')

	// `worker.start()` returns a Promise that resolves
	// once the Service Worker is up and ready to intercept requests.
	console.log("Enabling mocking for development environment");
	return worker.start()
}

enableMocking().then(() => {
	const rootElement = createRoot(document.getElementById('root')!);
	rootElement.render(
		<App />,
	);
})