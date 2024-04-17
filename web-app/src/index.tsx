import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';

async function enableMocking() {
	if (process.env.NODE_ENV !== 'development') {
		return
	}

	const { worker } = await import('./mock/index')

	// `worker.start()` returns a Promise that resolves
	// once the Service Worker is up and ready to intercept requests.
	return worker.start()
}

enableMocking().then(() => {
	ReactDOM.render(<App />, document.getElementById('root'))
})