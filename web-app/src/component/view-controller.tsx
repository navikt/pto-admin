import React from 'react';
import { useViewStore, ViewType } from '../store/view-store';
import { Hovedside } from '../view/hovedside/hovedside';
import { KafkaAdmin } from '../view/kafka-admin/kafka-admin';
import { RepubliseringKafka } from '../view/republisering-kafka/republisering-kafka';
import { Veilarbportefolje } from '../view/veilarbportefolje/veilarbportefolje';
import { AvsluttOppfolging } from '../view/avsluttOppfølging/AvsluttOppfolging';
import { Vedtaksstotte } from '../view/vedtaksstotte/vedtaksstotte';

export function ViewController() {
	const { view } = useViewStore();

	switch (view) {
		case ViewType.VEDTAKSSTOTTE:
			return <Vedtaksstotte />;
		case ViewType.REPUBLISERING_KAFKA:
			return <RepubliseringKafka />;
		case ViewType.HOVEDSIDE:
			return <Hovedside />;
		case ViewType.KAFKA_ADMIN:
			return <KafkaAdmin />;
		case ViewType.VEILARBPORTEFOLJE:
			return <Veilarbportefolje />
		case ViewType.AVSLUTT_BRUKERE:
			return <AvsluttOppfolging />
		default:
			return <Hovedside />;
	}
}
