import { RequestHandlersList } from 'msw/lib/types/setupWorker/glossary';
import { rest } from 'msw';
import { PTO_ADMIN_API_URL } from '../api';

export const handlers: RequestHandlersList = [
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
	rest.get(PTO_ADMIN_API_URL + '/api/tilgang/egenAnsatt', (req, res, ctx) => {
		return res(
			ctx.delay(500),
			ctx.json({
				harTilgang: false
			})
		);
	})
];
