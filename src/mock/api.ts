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
	})
];
