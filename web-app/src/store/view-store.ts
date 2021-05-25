import { useState } from 'react';
import constate from 'constate';

export enum ViewType {
	HOVEDSIDE = 'HOVEDSIDE',
	UTRULLING_VEDTAKSSTOTTE = 'UTRULLING_VEDTAKSSTOTTE',
	KAFKA_ADMIN = 'KAFKA_ADMIN'
}

export const [ViewStoreProvider, useViewStore] = constate(() => {
	const [view, setView] = useState<ViewType>(ViewType.HOVEDSIDE);

	const changeView = (type: ViewType) => {
		setView(type);
	};

	return { view, changeView };
});
