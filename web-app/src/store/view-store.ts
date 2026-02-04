import { useState } from 'react';
import constate from 'constate';

export enum ViewType {
	HOVEDSIDE = 'HOVEDSIDE',
	VEDTAKSSTOTTE = 'VEDTAKSSTOTTE',
	REPUBLISERING_KAFKA = 'REPUBLISERING_KAFKA',
	KAFKA_ADMIN = 'KAFKA_ADMIN',
	VEILARBPORTEFOLJE = 'VEILARBPORTEFOLJE',
	TEAM_DAB = 'TEAM_DAB'
}

const ViewLocalStorageKey = 'current-view';

const getViewFromLocalStorage = (): ViewType => {
	const view = localStorage.getItem(ViewLocalStorageKey);
	if (view && Object.values(ViewType).includes(view as ViewType)) {
		return view as ViewType;
	}
	return ViewType.HOVEDSIDE;
};

const setViewInLocalStorage = (view: ViewType) => {
	localStorage.setItem(ViewLocalStorageKey, view);
};

export const [ViewStoreProvider, useViewStore] = constate(() => {
	const [view, setView] = useState<ViewType>(getViewFromLocalStorage());

	const changeView = (type: ViewType) => {
		setView(type);
		setViewInLocalStorage(type);
	};

	return { view, changeView };
});
