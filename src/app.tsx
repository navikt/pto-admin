import React from 'react';
import StoreProvider from './store/store-provider';
import { Navigation } from './component/navigation/navigation';
import { ViewController } from './component/view-controller';
import './app.less';
import { LoginCheck } from './component/login-check/login-check';

function App() {
	return (
		<StoreProvider>
			<div className="app pto-admin">
				<Navigation />
				<main>
					<LoginCheck>
						<ViewController />
					</LoginCheck>
				</main>
			</div>
		</StoreProvider>
	);
}

export default App;
