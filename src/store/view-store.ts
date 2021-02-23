import { useState } from 'react';
import constate from 'constate';

export enum ViewType {
	HOVEDSIDE = 'HOVEDSIDE',
	DIALOG = 'DIALOG'
}

export const [ViewStoreProvider, useViewStore] = constate(() => {
	const [view, setView] = useState<ViewType>(ViewType.HOVEDSIDE);

	const changeView = (type: ViewType) => {
		setView(type);
	};

	return { view, changeView };
});
