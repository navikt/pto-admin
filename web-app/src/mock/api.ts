import { RequestHandler, http, HttpResponse, delay } from 'msw';
import { KafkaRecord, LastRecordOffsetResponse, TopicPartitionOffset } from '../api/kafka-admin';
import { HttpStatusCode } from 'axios';
import { DEFAULT_DELAY_MILLISECONDS } from './index';
import { Dialog } from '../api/veilarbdialog';
import {hentAapBrukerData} from "../api";


const antallAvsluttet = {
	antallAvsluttet: 500,
	antallKunneIkkeAvsluttes: 2
}

const kafkaRecords: KafkaRecord[] = [];

for (let i = 0; i < 25; i++) {
	const key = (i + 123) * (i + 99999);
	const offset = i + 10000;

	kafkaRecords.push({
		key: key.toString(),
		value: '{"aktoerid":"xxxxxxx","fodselsnr":"xxxxxxxx","formidlingsgruppekode":"ARBS","iserv_fra_dato":null,"etternavn":"TESTERSEN","fornavn":"TEST","nav_kontor":"0425","kvalifiseringsgruppekode":"IKVAL","rettighetsgruppekode":"IYT","hovedmaalkode":"SKAFFEA","sikkerhetstiltak_type_kode":null,"fr_kode":null,"har_oppfolgingssak":true,"sperret_ansatt":false,"er_doed":false,"doed_fra_dato":null,"endret_dato":"2021-03-28T20:11:12+02:00"}',
		offset,
		timestamp: 1620126765357,
		headers: [
			{
				name: 'CORRELATION_ID',
				value: 'ddemc238fsdf0fd3s22'
			}
		]
	});
}

const lastRecordOffsetResponse: LastRecordOffsetResponse = {
	latestRecordOffset: 1234
};

const topicPartitionOffsets: TopicPartitionOffset[] = [
	{
		topicName: 'test-topic',
		topicPartition: 0,
		offset: 4567
	},
	{
		topicName: 'test-topic',
		topicPartition: 1,
		offset: 4570
	}
];

export const handlers: RequestHandler[] = [
	http.get('/api/auth/me', async () => {
		await delay(DEFAULT_DELAY_MILLISECONDS);
		return HttpResponse.json(
			{
				navn: 'Test Testersen'
			}
		);
	}),

	http.post('/api/v2/ident/hent-fnr', async () => {
		await delay(DEFAULT_DELAY_MILLISECONDS);
		return HttpResponse.json({
				fnr: '12345678900'
			}
		);
	}),
	http.post('/api/v2/ident/hent-aktorid', async () => {
 		await delay(DEFAULT_DELAY_MILLISECONDS);
		return HttpResponse.json({
				aktorId: '1111222344555'
			}
		);
	}),
	http.get('/api/tilgang/enhet', async () => {
 		await delay(DEFAULT_DELAY_MILLISECONDS);
		return HttpResponse.json({
				harTilgang: true
			}
		);
	}),
	http.post('/api/v2/tilgang/hent-skriv', async () => {
		await delay(DEFAULT_DELAY_MILLISECONDS);
		return HttpResponse.json({
				harTilgang: true
			}
		);
	}),
	http.post('/api/v2/tilgang/hent-les', async () => {
 		await delay(DEFAULT_DELAY_MILLISECONDS);
		return HttpResponse.json({
				harTilgang: true
			}
		);
	}),
	http.get('/api/tilgang/kode6', async () => {
		await delay(DEFAULT_DELAY_MILLISECONDS);
		return HttpResponse.json({
				harTilgang: true
			}
		);
	}),
	http.get('/api/tilgang/kode7', async () => {
		await delay(DEFAULT_DELAY_MILLISECONDS);
		return HttpResponse.json({
				harTilgang: false
			}
		);
	}),
	http.get('/api/tilgang/skjermet', async () => {
		await delay(DEFAULT_DELAY_MILLISECONDS);
		return HttpResponse.json({
				harTilgang: false
			}
		);
	}),
	http.put('/api/admin/veilarbvedtaksstotte/slett-vedtak', async () => {
		await delay(DEFAULT_DELAY_MILLISECONDS);
		return HttpResponse.json(HttpStatusCode.Ok);
	}),
	http.post('/api/admin/veilarbvedtaksstotte/republiser/siste-14a-vedtak', async () => {
		await delay(DEFAULT_DELAY_MILLISECONDS);
		return HttpResponse.json(window.crypto.randomUUID());
	}),
	http.post('/api/admin/veilarbvedtaksstotte/republiser/vedtak-14a-fattet-dvh', async () => {
		await delay(DEFAULT_DELAY_MILLISECONDS);
		return HttpResponse.json(window.crypto.randomUUID());
	}),
	http.post('/api/kafka-admin/read-topic', async () => {
		await delay(DEFAULT_DELAY_MILLISECONDS);
		return HttpResponse.json(kafkaRecords);
	}),
	http.post('/api/kafka-admin/get-consumer-offsets', async () => {
		await delay(DEFAULT_DELAY_MILLISECONDS);
		return HttpResponse.json(topicPartitionOffsets);
	}),
	http.post('/api/kafka-admin/get-last-record-offset', async () => {
		await delay(DEFAULT_DELAY_MILLISECONDS);
		return HttpResponse.json(lastRecordOffsetResponse);
	}),
	http.post('/api/kafka-admin/set-consumer-offset', async () => {
		await delay(DEFAULT_DELAY_MILLISECONDS);
		return HttpResponse.json(HttpStatusCode.Ok);
	}),
	http.get('/api/admin/veilarbportefolje/opensearch/getAliases', async () => {
		await delay(DEFAULT_DELAY_MILLISECONDS);
		return HttpResponse.json('{"brukerindeks_20220825_0215":{"aliases":{"brukerindeks":{}}},".kibana_1":{"aliases":{".kibana":{}}},".opensearch-notebooks":{"aliases":{}}');
	}),
	http.post(`/api/admin/veilarboppfolging/republiser/oppfolgingsperioder`, async () => {
		await delay(DEFAULT_DELAY_MILLISECONDS);
		return HttpResponse.json(window.crypto.randomUUID());
	}),
	http.post(`/api/admin/veilarboppfolging/avsluttBrukere`, async () => {
		await delay(10000);
		return HttpResponse.json(antallAvsluttet);
	}),
	http.post(`/api/admin/veilarbdialog/republiser/endring-paa-dialog`, async () => {
		await delay(DEFAULT_DELAY_MILLISECONDS);
		return HttpResponse.json(window.crypto.randomUUID());
	}),
	http.post(`/api/admin/veilarbarena/republiser/endring-pa-bruker/all`, async () => {
		await delay(DEFAULT_DELAY_MILLISECONDS);
		return HttpResponse.json(window.crypto.randomUUID());
	}),
	http.put(`/api/admin/veilarbportefolje/indeks/bruker`, async () => {
		await delay(DEFAULT_DELAY_MILLISECONDS);
		return HttpResponse.json(HttpStatusCode.Ok);
	}),
	http.put(`/api/admin/veilarbportefolje/indeks/bruker/fnr`, async () => {
		await delay(DEFAULT_DELAY_MILLISECONDS);
		return HttpResponse.json(HttpStatusCode.Ok);
	}),
	http.post(`/api/admin/veilarbportefolje/indeks/AlleBrukere`, async () => {
		await delay(DEFAULT_DELAY_MILLISECONDS);
		return HttpResponse.json(123456789);
	}),
	http.post(`/api/admin/veilarbportefolje/indeks/AlleBrukereNyIndex`, async () => {
		await delay(DEFAULT_DELAY_MILLISECONDS);
		return HttpResponse.json(987654321);
	}),
	http.post(`/api/admin/veilarbportefolje/opensearch/createindex`, async () => {
		await delay(DEFAULT_DELAY_MILLISECONDS);
		return HttpResponse.json(192837465);
	}),
	http.post(`/api/admin/veilarbportefolje/opensearch/assignAliasToIndex`, async () => {
		await delay(DEFAULT_DELAY_MILLISECONDS);
		return HttpResponse.json(HttpStatusCode.Ok);
	}),
	http.post(`/api/admin/veilarbportefolje/opensearch/deleteIndex`, async () => {
		await delay(DEFAULT_DELAY_MILLISECONDS);
		return HttpResponse.json(HttpStatusCode.Ok);
	}),
	http.post(`/api/admin/veilarbportefolje/pdl/lastInnDataFraPdl`, async () => {
		await delay(DEFAULT_DELAY_MILLISECONDS);
		return HttpResponse.json(192837465);
	}),
	http.post(`/api/admin/veilarbportefolje/hentEnsligForsorgerData`, async () => {
		await delay(DEFAULT_DELAY_MILLISECONDS);
		return HttpResponse.json(6666333345);
	}),
	http.post(`/api/admin/veilarbportefolje/hentAapBrukerData`, async () => {
		await delay(DEFAULT_DELAY_MILLISECONDS);
		return HttpResponse.json("");
	}),
	http.post(`/api/veilarboppfolging/veilarboppfolging/api/graphql`, async () => {
		await delay(DEFAULT_DELAY_MILLISECONDS);
		return HttpResponse.json({
			data: {
				oppfolgingsPerioder: [
					{
						startTidspunkt: '2024-01-01',
						sluttTidspunkt: null,
						id: '550e8400-e29b-41d4-a716-446655440000'
					},
					{
						startTidspunkt: '2021-01-01',
						sluttTidspunkt: '2023-01-01',
						id: '550e8400-e29b-41d4-a716-446655440001'
					}
				]
			}
		});
	}),
	http.post(`/api/veilarbdialog/veilarbdialog/graphql`, async () => {
		await delay(DEFAULT_DELAY_MILLISECONDS);
		return HttpResponse.json({
			data: {
				dialoger: [
					{
						opprettetDato: '2021-01-01',
						ferdigBehandlet: true,
						lest: true,
						venterPaSvar: true,
						historisk: false,
						id: '121',
						sisteDato: '2021-01-01',
						erLestAvBruker: true,
						oppfolgingsperiode: '550e8400-e29b-41d4-a716-446655440001'
					},
					{
						opprettetDato: '2021-02-01',
						ferdigBehandlet: true,
						lest: true,
						venterPaSvar: true,
						historisk: false,
						id: '124',
						sisteDato: '2021-01-01',
						erLestAvBruker: true,
						oppfolgingsperiode: '550e8400-e29b-41d4-a716-446655440001'
					},
					{
						opprettetDato: '2025-01-01',
						ferdigBehandlet: true,
						lest: true,
						venterPaSvar: true,
						historisk: false,
						id: '123',
						sisteDato: '2021-01-01',
						erLestAvBruker: true,
						oppfolgingsperiode: '550e8400-e29b-41d4-a716-446655440000'
					}	
				] satisfies Dialog[]
			}
		});
	}),
	http.post(`/api/veilarbaktivitet/veilarbaktivitet/graphql`, async () => {
		await delay(DEFAULT_DELAY_MILLISECONDS);
		return HttpResponse.json({
			data: {
				perioder: [
					{
						id: '550e8400-e29b-41d4-a716-446655440000',
						aktiviteter: [
							{
								id: '123321123',
								funksjonellId: '4e123456-7890-1234-5678-901234567890',
								versjon: 1,
								endretDato: '2021-01-01T00:00:00.000Z',
								opprettetDato: '2021-01-01T00:00:00.000Z',
								status: 'GJENNOMFORES',
								historisk: false,
								type: 'SOKEAVTALE',
							},
							{
								id: '125321312',
								funksjonellId: '4e123456-7890-1234-5678-901234567891',
								versjon: 3,
								endretDato: '2021-01-01T00:00:00.000Z',
								opprettetDato: '2021-01-01T00:00:00.000Z',
								status: 'GJENNOMFORES',
								historisk: false,
								type: 'SOKEAVTALE',
							}
						]
					},
					{
						id: '550e8400-e29b-41d4-a716-446655440001',
						aktiviteter: [
							{
								id: '124321312',
								funksjonellId: '4e123456-7890-1234-5678-901234567892',
								versjon: 1,
								endretDato: '2021-01-01T00:00:00.000Z',
								opprettetDato: '2021-01-01T00:00:00.000Z',
								status: 'GJENNOMFORES',
								historisk: false,
								type: 'SOKEAVTALE',
							}
						]
					}
				]
			}
		});
	}),
];
