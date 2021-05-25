import React from 'react';
import { useViewStore, ViewType } from '../store/view-store';
import { Hovedside } from '../view/hovedside/hovedside';
import { UtrullingVedtaksstotte } from '../view/utrulling-vedtaksstotte/utrulling-vedtaksstotte';
import { KafkaAdmin } from '../view/kafka-admin/kafka-admin';

export function ViewController() {
	const { view } = useViewStore();

	switch (view) {
		case ViewType.UTRULLING_VEDTAKSSTOTTE:
			return <UtrullingVedtaksstotte />;
		case ViewType.HOVEDSIDE:
			return <Hovedside />;
		case ViewType.KAFKA_ADMIN:
			return <KafkaAdmin />;
		default:
			return <Hovedside />;
	}
}