import React from 'react';
import { useViewStore, ViewType } from '../store/view-store';
import { DialogView } from '../view/dialog/dialog-view';
import { HovedsideView } from '../view/hovedside/hovedside-view';

export function ViewController() {
	const { view } = useViewStore();

	switch (view) {
		case ViewType.DIALOG:
			return <DialogView />;
		case ViewType.HOVEDSIDE:
			return <HovedsideView />;
		default:
			return <HovedsideView />;
	}
}
