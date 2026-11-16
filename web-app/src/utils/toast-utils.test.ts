import { afterEach, describe, expect, it, vi } from 'vitest';
import { toast } from 'react-toastify';
import { HttpError, fetchInstance } from '../api';
import { httpErrorToast } from './toast-utils';

vi.mock('react-toastify', () => ({ toast: vi.fn() }));

afterEach(() => {
	vi.unstubAllGlobals();
	vi.clearAllMocks();
});

describe('httpErrorToast', () => {
	it.each([
		{ body: 'Ingen tilgang', contentType: 'text/plain' },
		{ body: '{"message":"Ingen tilgang"}', contentType: 'application/json' },
		{ body: '{"custom":"Ingen tilgang"}', contentType: 'application/json' },
		{ body: '{invalid json', contentType: 'application/json' },
		{ body: 'x'.repeat(500), contentType: 'text/plain' }
	])('shows HTTP status and short response text: $contentType, $body', async ({ body, contentType }) => {
		vi.stubGlobal(
			'fetch',
			vi.fn().mockResolvedValue(new Response(body, { status: 403, headers: { 'content-type': contentType } }))
		);

		const error = await fetchInstance.post('/test').catch((error: unknown) => error);
		httpErrorToast('Kunne ikke hente', error);

		expect(toast).toHaveBeenCalledWith(`Kunne ikke hente (HTTP 403): ${body}`, {
			type: 'error',
			position: 'top-right'
		});
	});

	it.each(['', 'x'.repeat(501)])('omits empty or overly long responses', body => {
		httpErrorToast('Kunne ikke hente', new HttpError(500, body, body));

		expect(toast).toHaveBeenCalledWith('Kunne ikke hente (HTTP 500)', expect.anything());
	});

	it('reports network failures without inventing a status', async () => {
		vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')));
		const error = await fetchInstance.get('/test').catch((error: unknown) => error);
		httpErrorToast('Kunne ikke hente', error);

		expect(toast).toHaveBeenCalledWith(
			'Kunne ikke hente (ingen HTTP-status mottatt): Failed to fetch',
			expect.anything()
		);
	});

	it('preserves status and response text for failed deletions', async () => {
		vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('Konflikt', { status: 409 })));

		const error = await fetchInstance.delete('/test').catch((error: unknown) => error);
		httpErrorToast('Kunne ikke slette', error);

		expect(toast).toHaveBeenCalledWith('Kunne ikke slette (HTTP 409): Konflikt', expect.anything());
	});

	it('preserves existing parsed error messages', async () => {
		vi.stubGlobal('fetch', vi.fn().mockResolvedValue(Response.json({ message: 'Ingen tilgang' }, { status: 403 })));

		await expect(fetchInstance.get('/test')).rejects.toMatchObject({
			message: 'Ingen tilgang',
			status: 403,
			responseText: '{"message":"Ingen tilgang"}'
		});
	});
});
