import React from 'react';
import { useViewStore, ViewType } from '../store/view-store';
import { ExampleView } from '../view/example/example-view';
import { Hovedside } from '../view/hovedside/hovedside';

export function ViewController() {
	const { view } = useViewStore();

	switch (view) {
		case ViewType.EKSEMPEL:
			return <ExampleView />;
		case ViewType.HOVEDSIDE:
			return <Hovedside />;
		default:
			return <Hovedside />;
	}
}
