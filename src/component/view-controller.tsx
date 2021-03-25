import React from 'react';
import { useViewStore, ViewType } from '../store/view-store';
import { Hovedside } from '../view/hovedside/hovedside';
import { UtrullingVedtaksstotte } from '../view/utrulling-vedtaksstotte/utrulling-vedtaksstotte';

export function ViewController() {
	const { view } = useViewStore();

	switch (view) {
		case ViewType.UTRULLING_VEDTAKSSTOTTE:
			return <UtrullingVedtaksstotte />;
		case ViewType.HOVEDSIDE:
			return <Hovedside />;
		default:
			return <Hovedside />;
	}
}
