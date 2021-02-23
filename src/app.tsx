import React from 'react';
import StoreProvider from './store/store-provider';
import { Navigation } from './component/navigation/navigation';
import { ViewController } from './component/view-controller';
import './app.less';

function App() {
	return (
		<StoreProvider>
			<div className="app pto-admin">
				<Navigation />
				<main>
					<ViewController />
				</main>
			</div>
		</StoreProvider>
	);
}

export default App;
