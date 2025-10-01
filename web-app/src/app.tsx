import React from 'react';
import StoreProvider from './store/store-provider';
import { Navigation } from './component/navigation/navigation';
import { ViewController } from './component/view-controller';
import { LoginCheck } from './component/login-check/login-check';
import { ToastContainer } from 'react-toastify';
import './app.less';
import './app.css';
import 'react-toastify/dist/ReactToastify.css';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

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
				<ToastContainer />
			</div>
		</StoreProvider>
	);
}

export default App;
