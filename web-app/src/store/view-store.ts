import { useState } from 'react';
import constate from 'constate';

export enum ViewType {
	HOVEDSIDE = 'HOVEDSIDE',
	UTRULLING_VEDTAKSSTOTTE = 'UTRULLING_VEDTAKSSTOTTE',
	REPUBLISERING_KAFKA = 'REPUBLISERING_KAFKA',
	KAFKA_ADMIN = 'KAFKA_ADMIN',
	VEILARBPORTEFOLJE = 'VEILARBPORTEFOLJE'
}

export const [ViewStoreProvider, useViewStore] = constate(() => {
	const [view, setView] = useState<ViewType>(ViewType.HOVEDSIDE);

	const changeView = (type: ViewType) => {
		setView(type);
	};

	return { view, changeView };
});
