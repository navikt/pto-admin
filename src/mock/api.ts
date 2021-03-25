import { RequestHandlersList } from 'msw/lib/types/setupWorker/glossary';
import { rest } from 'msw';
import { PTO_ADMIN_API_URL, UtrulletEnhet } from '../api';

const utrulledeEnheter: UtrulletEnhet[] = [
	{
		enhetId: '1234',
		createdAt: '2021-03-25T07:45:24.787Z'
	},
	{
		enhetId: '5678',
		createdAt: '2020-09-15T08:12:24.787Z'
	},
	{
		enhetId: '4444',
		createdAt: '2021-02-21T09:23:24.787Z'
	},
	{
		enhetId: '1111',
		createdAt: '2021-03-25T07:28:24.787Z'
	},
	{
		enhetId: '7777',
		createdAt: '2021-03-20T10:37:24.787Z'
	}
];

export const handlers: RequestHandlersList = [
	rest.get(PTO_ADMIN_API_URL + '/api/auth/me', (req, res, ctx) => {
		return res(
			ctx.delay(500),
			ctx.json({
				ident: 'Z12345',
				harTilgang: true
			})
		);
	}),
	rest.get(PTO_ADMIN_API_URL + '/api/ident/fnr', (req, res, ctx) => {
		return res(
			ctx.delay(500),
			ctx.json({
				fnr: '12345678900'
			})
		);
	}),
	rest.get(PTO_ADMIN_API_URL + '/api/ident/aktorId', (req, res, ctx) => {
		return res(
			ctx.delay(500),
			ctx.json({
				aktorId: '1111222344555'
			})
		);
	}),
	rest.get(PTO_ADMIN_API_URL + '/api/tilgang/enhet', (req, res, ctx) => {
		return res(
			ctx.delay(500),
			ctx.json({
				harTilgang: true
			})
		);
	}),
	rest.get(PTO_ADMIN_API_URL + '/api/tilgang/skriv', (req, res, ctx) => {
		return res(
			ctx.delay(500),
			ctx.json({
				harTilgang: true
			})
		);
	}),
	rest.get(PTO_ADMIN_API_URL + '/api/tilgang/les', (req, res, ctx) => {
		return res(
			ctx.delay(500),
			ctx.json({
				harTilgang: true
			})
		);
	}),
	rest.get(PTO_ADMIN_API_URL + '/api/tilgang/kode6', (req, res, ctx) => {
		return res(
			ctx.delay(500),
			ctx.json({
				harTilgang: true
			})
		);
	}),
	rest.get(PTO_ADMIN_API_URL + '/api/tilgang/kode7', (req, res, ctx) => {
		return res(
			ctx.delay(500),
			ctx.json({
				harTilgang: false
			})
		);
	}),
	rest.get(PTO_ADMIN_API_URL + '/api/tilgang/skjermet', (req, res, ctx) => {
		return res(
			ctx.delay(500),
			ctx.json({
				harTilgang: false
			})
		);
	}),
	rest.post(PTO_ADMIN_API_URL + '/api/admin/veilarbvedtaksstotte/utrulling/*', (req, res, ctx) => {
		return res(ctx.delay(500), ctx.status(200));
	}),
	rest.delete(PTO_ADMIN_API_URL + '/api/admin/veilarbvedtaksstotte/utrulling/*', (req, res, ctx) => {
		return res(ctx.delay(500), ctx.status(200));
	}),
	rest.get(PTO_ADMIN_API_URL + '/api/admin/veilarbvedtaksstotte/utrulling', (req, res, ctx) => {
		return res(ctx.delay(500), ctx.json(utrulledeEnheter));
	})
];
