import { RequestHandler, rest } from 'msw';
import { UtrulletEnhet } from '../api';
import { KafkaRecord, LastRecordOffsetResponse, TopicPartitionOffset } from '../api/kafka-admin';

const utrulledeEnheter: UtrulletEnhet[] = [
	{
		enhetId: '1234',
		navn: 'NAV Test1',
		createdAt: '2021-03-25T07:45:24.787Z'
	},
	{
		enhetId: '5678',
		navn: 'NAV Test2',
		createdAt: '2020-09-15T08:12:24.787Z'
	},
	{
		enhetId: '4444',
		navn: 'NAV Test3',
		createdAt: '2021-02-21T09:23:24.787Z'
	},
	{
		enhetId: '1111',
		navn: 'NAV Test4',
		createdAt: '2021-03-25T07:28:24.787Z'
	},
	{
		enhetId: '7777',
		navn: 'NAV Test5',
		createdAt: '2021-03-20T10:37:24.787Z'
	}
];

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
	rest.get('/api/auth/me', (req, res, ctx) => {
		return res(
			ctx.delay(500),
			ctx.json({
				navn: 'Test Testersen'
			})
		);
	}),

	rest.get('/api/ident/fnr', (req, res, ctx) => {
		return res(
			ctx.delay(500),
			ctx.json({
				fnr: '12345678900'
			})
		);
	}),
	rest.get('/api/ident/aktorId', (req, res, ctx) => {
		return res(
			ctx.delay(500),
			ctx.json({
				aktorId: '1111222344555'
			})
		);
	}),
	rest.get('/api/tilgang/enhet', (req, res, ctx) => {
		return res(
			ctx.delay(500),
			ctx.json({
				harTilgang: true
			})
		);
	}),
	rest.get('/api/tilgang/skriv', (req, res, ctx) => {
		return res(
			ctx.delay(500),
			ctx.json({
				harTilgang: true
			})
		);
	}),
	rest.get('/api/tilgang/les', (req, res, ctx) => {
		return res(
			ctx.delay(500),
			ctx.json({
				harTilgang: true
			})
		);
	}),
	rest.get('/api/tilgang/kode6', (req, res, ctx) => {
		return res(
			ctx.delay(500),
			ctx.json({
				harTilgang: true
			})
		);
	}),
	rest.get('/api/tilgang/kode7', (req, res, ctx) => {
		return res(
			ctx.delay(500),
			ctx.json({
				harTilgang: false
			})
		);
	}),
	rest.get('/api/tilgang/skjermet', (req, res, ctx) => {
		return res(
			ctx.delay(500),
			ctx.json({
				harTilgang: false
			})
		);
	}),

	rest.post('/api/admin/veilarbvedtaksstotte/utrulling/*', (req, res, ctx) => {
		return res(ctx.delay(500), ctx.status(200));
	}),
	rest.delete('/api/admin/veilarbvedtaksstotte/utrulling/*', (req, res, ctx) => {
		return res(ctx.delay(500), ctx.status(200));
	}),
	rest.get('/api/admin/veilarbvedtaksstotte/utrulling', (req, res, ctx) => {
		return res(ctx.delay(500), ctx.json(utrulledeEnheter));
	}),
	rest.post('/api/admin/veilarbvedtaksstotte/republiser/siste-14a-vedtak', (req, res, ctx) => {
		return res(ctx.delay(500), ctx.status(200), ctx.json(window.crypto.randomUUID()));
	}),
	rest.post('/api/admin/veilarbvedtaksstotte/republiser/vedtak-14a-fattet-dvh', (req, res, ctx) => {
		return res(ctx.delay(500), ctx.status(200), ctx.json(window.crypto.randomUUID()));
	}),
	rest.post('/api/kafka-admin/read-topic', (req, res, ctx) => {
		return res(ctx.delay(500), ctx.json(kafkaRecords));
	}),
	rest.post('/api/kafka-admin/get-consumer-offsets', (req, res, ctx) => {
		return res(ctx.delay(500), ctx.json(topicPartitionOffsets));
	}),
	rest.post('/api/kafka-admin/get-last-record-offset', (req, res, ctx) => {
		return res(ctx.delay(500), ctx.json(lastRecordOffsetResponse));
	}),
	rest.post('/api/kafka-admin/set-consumer-offset', (req, res, ctx) => {
		return res(ctx.delay(500), ctx.status(200));
	}),
	rest.get('/api/admin/veilarbportefolje/opensearch/getAliases', (req, res, ctx) => {
		return res(
			ctx.delay(500),
			ctx.status(200),
			ctx.body(
				'{"brukerindeks_20220825_0215":{"aliases":{"brukerindeks":{}}},".kibana_1":{"aliases":{".kibana":{}}},".opensearch-notebooks":{"aliases":{}}}'
			)
		);
	}),
	rest.post(`/api/admin/veilarboppfolging/republiser/oppfolgingsperioder`, (req, res, ctx) => {
		return res(ctx.delay(500), ctx.status(200), ctx.json(window.crypto.randomUUID()));
	})
];
