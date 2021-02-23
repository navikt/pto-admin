import React from 'react';
import { ViewStoreProvider } from './view-store';

interface StoreProviderProps {
	children: React.ReactNode;
}

const StoreProvider = (props: StoreProviderProps) => {
	return <ViewStoreProvider>{props.children}</ViewStoreProvider>;
};

export default StoreProvider;
