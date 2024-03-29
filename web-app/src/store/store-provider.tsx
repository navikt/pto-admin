import React from 'react';
import { AppStoreProvider } from './app-store';
import { ViewStoreProvider } from './view-store';

interface StoreProviderProps {
	children: React.ReactNode;
}

const StoreProvider = (props: StoreProviderProps) => {
	return (
		<AppStoreProvider>
			<ViewStoreProvider>{props.children}</ViewStoreProvider>
		</AppStoreProvider>
	);
};

export default StoreProvider;
